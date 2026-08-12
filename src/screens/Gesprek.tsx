import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { courses } from '../content'
import { GESPREKKEN, type GesprekAntwoord, type GesprekScenario, type GesprekStap } from '../content/gesprekken'
import { RESTAURANT, VRIJ_GESPREK, type GespreksOnderwerp } from '../content/gesprekkenExtra'
import { useStore } from '../store'
import { sfx, speak } from '../audio'
import { Flag } from '../components/Flag'
import { courseFlagCode } from '../countries'
import { norm, zonderAccenten } from './exercises'

/**
 * Gesprekken: je praat écht met iemand in de doeltaal.
 *
 * Elk gesprek is een chat: je partner spreekt (met moedertaal-audio), jij
 * antwoordt door te kiezen of door je antwoord in te spreken via
 * spraakherkenning. Alle antwoorden zijn goed; fout bestaat hier niet. Wie
 * de microfoon gebruikt oefent uitspraak, wie tikt oefent lezen, en allebei
 * telt het als een volwaardige leerdag.
 */

/* ---------- spraakherkenning (waar de browser het kan) ---------- */

interface HerkendAlternatief {
  transcript: string
}

interface HerkenningEvent {
  results: ArrayLike<ArrayLike<HerkendAlternatief>>
}

interface Herkenner {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: HerkenningEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

function maakHerkenner(): Herkenner | null {
  const w = window as unknown as Record<string, unknown>
  const Ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => Herkenner) | undefined
  if (!Ctor) return null
  try {
    return new Ctor()
  } catch {
    return null
  }
}

/** Kale vergelijkingsvorm: kleine letters, geen leestekens, geen accenten */
function kaal(s: string): string {
  return norm(zonderAccenten(s.replace(/[’']/g, ' ')))
}

/** Begrensde bewerkingsafstand: stopt zodra hij boven max uitkomt */
function editAfstand(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let vorige = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const rij = [i]
    let kleinste = i
    for (let j = 1; j <= b.length; j++) {
      const kosten = a[i - 1] === b[j - 1] ? 0 : 1
      rij[j] = Math.min(rij[j - 1] + 1, vorige[j] + 1, vorige[j - 1] + kosten)
      kleinste = Math.min(kleinste, rij[j])
    }
    if (kleinste > max) return max + 1
    vorige = rij
  }
  return vorige[b.length]
}

/** Welk antwoord heeft de speler gezegd? null = geen van de opties herkend */
function matchGesproken(transcript: string, opties: GesprekAntwoord[]): GesprekAntwoord | null {
  const gezegd = kaal(transcript)
  if (!gezegd) return null
  for (const optie of opties) {
    const doel = kaal(optie.tekst)
    // exact, ruim binnen de tikfoutmarge, of als geheel in een langere zin
    const marge = doel.length >= 12 ? 3 : doel.length >= 6 ? 2 : 1
    if (gezegd === doel || editAfstand(gezegd, doel, marge) <= marge || gezegd.includes(doel)) return optie
  }
  return null
}

/* ---------- de chat zelf ---------- */

interface Bericht {
  van: 'partner' | 'ik'
  tekst: string
  nl: string
  /** ingesproken in plaats van getikt */
  gesproken?: boolean
}

/** Gradiëntcirkel met de initiaal van je gesprekspartner */
function PartnerKop({ naam, code, size = 40 }: { naam: string; code: string; size?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--hot1), var(--hot2))',
          fontWeight: 900,
          fontSize: size * 0.42,
          color: '#fff',
          boxShadow: '0 0 14px rgba(168, 85, 247, 0.45)',
        }}
      >
        {naam[0]}
      </div>
      <span style={{ position: 'absolute', right: -3, bottom: -3, lineHeight: 0 }}>
        <Flag code={code} size={Math.round(size * 0.38)} />
      </span>
    </div>
  )
}

/* ---------- gedeeld door beide spelers ---------- */

/**
 * De chat zelf: de berichtenlijst, de typindicator en de timers. Wie een beurt
 * van de partner wil laten vallen roept `partnerZegt` aan, zodat de opbouw
 * (eerst even "aan het typen", dan de tekst met audio) op één plek staat. Alle
 * timers gaan door `later`, zodat het opruimen bij verlaten er niet één mist.
 */
function useChat(ttsLang: string) {
  const [berichten, setBerichten] = useState<Bericht[]>([])
  const [typend, setTypend] = useState(true)
  const timers = useRef<number[]>([])

  // opruimen bij verlaten: geen enkele timer mag na dit scherm nog afgaan
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    },
    []
  )

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  /** partner zegt een regel: eerst even "aan het typen", dan de tekst met audio */
  const partnerZegt = useCallback(
    (tekst: string, nl: string, daarna?: () => void) => {
      setTypend(true)
      later(900, () => {
        setTypend(false)
        setBerichten((b) => [...b, { van: 'partner', tekst, nl }])
        speak(tekst, ttsLang)
        daarna?.()
      })
    },
    [later, ttsLang]
  )

  return { berichten, setBerichten, typend, partnerZegt, later }
}

/** Waar de luisteraar de antwoordopties van dit moment vandaan haalt */
type OptieBron = { readonly current: GesprekAntwoord[] } | (() => GesprekAntwoord[])

/**
 * De microfoon. De opties komen uit een getter en niet uit een gekopieerde
 * lijst, want tussen het starten van de herkenner en zijn antwoord kan het
 * gesprek al een stap verder zijn: zo leest `onresult` altijd de huidige stap.
 */
function useLuisteraar(ttsLang: string, bron: OptieBron, opAntwoord: (antwoord: GesprekAntwoord) => void) {
  const [luistert, setLuistert] = useState(false)
  const [micHint, setMicHint] = useState<string | null>(null)
  const [kanSpreken] = useState(() => maakHerkenner() !== null)
  const herkenner = useRef<Herkenner | null>(null)

  // altijd de nieuwste bron en afhandeling, nooit die van een vorige stap
  const bronRef = useRef(bron)
  bronRef.current = bron
  const opAntwoordRef = useRef(opAntwoord)
  opAntwoordRef.current = opAntwoord

  // opruimen bij verlaten: een lopende herkenner luistert anders door
  useEffect(
    () => () => {
      herkenner.current?.abort()
    },
    []
  )

  const opties = useCallback((): GesprekAntwoord[] => {
    const b = bronRef.current
    return (typeof b === 'function' ? b() : b.current) ?? []
  }, [])

  const luister = useCallback(() => {
    if (luistert || opties().length === 0) return
    const rec = maakHerkenner()
    if (!rec) return
    herkenner.current = rec
    rec.lang = ttsLang
    rec.interimResults = false
    rec.maxAlternatives = 4
    setLuistert(true)
    setMicHint(null)
    rec.onresult = (e) => {
      const nu = opties()
      const kandidaten = Array.from(e.results[0] ?? [])
      const raak = kandidaten.map((k) => matchGesproken(k.transcript, nu)).find(Boolean)
      if (raak) {
        opAntwoordRef.current(raak)
      } else {
        const gehoord = kandidaten[0]?.transcript
        setMicHint(gehoord ? `Ik verstond "${gehoord}". Probeer het nog eens, of tik je antwoord.` : 'Ik verstond je niet. Probeer het nog eens, of tik je antwoord.')
      }
    }
    rec.onerror = () => setMicHint('De microfoon deed het even niet. Tik je antwoord, dat is net zo goed.')
    rec.onend = () => setLuistert(false)
    try {
      rec.start()
    } catch {
      setLuistert(false)
    }
  }, [luistert, opties, ttsLang])

  return { luistert, micHint, setMicHint, kanSpreken, luister }
}

/** Kop van een gesprek: terug, wie je spreekt, en de vertaalknop */
function ChatKop({
  partner,
  vlag,
  ondertitel,
  vertaling,
  opVertaling,
  onTerug,
}: {
  partner: string
  vlag: string
  ondertitel: string
  vertaling: boolean
  opVertaling: () => void
  onTerug: () => void
}) {
  return (
    <header className="row" style={{ gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
      <button onClick={() => { sfx('tap'); onTerug() }} aria-label="Terug" style={{ minWidth: 44, minHeight: 44, fontSize: 22 }}>
        ←
      </button>
      <PartnerKop naam={partner} code={vlag} />
      <div className="col" style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ fontSize: 16 }}>{partner}</strong>
        <span className="dim" style={{ fontSize: 12.5 }}>
          {ondertitel}
        </span>
      </div>
      <button
        onClick={() => { sfx('tap'); opVertaling() }}
        className={vertaling ? 'gold-text' : 'dim'}
        aria-label="Vertaling aan of uit"
        style={{ minWidth: 44, minHeight: 44, fontWeight: 800, fontSize: 13, border: '1.5px solid', borderColor: vertaling ? 'var(--gold)' : 'var(--line)', borderRadius: 12 }}
      >
        NL
      </button>
    </header>
  )
}

/** De bellen van het gesprek, plus de partner die aan het typen is */
function Berichtenlijst({
  berichten,
  typend,
  partner,
  vlag,
  ttsLang,
  vertaling,
}: {
  berichten: Bericht[]
  typend: boolean
  partner: string
  vlag: string
  ttsLang: string
  vertaling: boolean
}) {
  return (
    <>
      {berichten.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="row"
          style={{ alignItems: 'flex-end', gap: 8, justifyContent: b.van === 'ik' ? 'flex-end' : 'flex-start' }}
        >
          {b.van === 'partner' && <PartnerKop naam={partner} code={vlag} size={30} />}
          <button
            onClick={() => { if (b.van === 'partner') speak(b.tekst, ttsLang) }}
            style={{
              maxWidth: '78%',
              textAlign: 'left',
              padding: '11px 14px',
              fontSize: 15.5,
              lineHeight: 1.4,
              borderRadius: b.van === 'ik' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: b.van === 'ik' ? 'linear-gradient(135deg, var(--hot1), var(--hot2))' : 'var(--surface-2)',
              border: b.van === 'ik' ? 'none' : '1px solid var(--line)',
              color: '#fff',
              cursor: b.van === 'partner' ? 'pointer' : 'default',
            }}
          >
            {b.gesproken && <span style={{ marginRight: 6 }}>🎤</span>}
            {b.tekst}
            {vertaling && (
              <span className="dim" style={{ display: 'block', fontSize: 12.5, marginTop: 3 }}>
                {b.nl}
              </span>
            )}
          </button>
        </motion.div>
      ))}

      {typend && (
        <div className="row" style={{ alignItems: 'flex-end', gap: 8 }}>
          <PartnerKop naam={partner} code={vlag} size={30} />
          <div className="row" style={{ gap: 4, padding: '14px 16px', borderRadius: '18px 18px 18px 4px', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-dim)' }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/** Jouw beurt: de antwoorden, de microfoon en de regel die uitlegt hoe het werkt */
function AntwoordPaneel({
  antwoorden,
  onKies,
  micHint,
  kanSpreken,
  luistert,
  onLuister,
}: {
  antwoorden: GesprekAntwoord[]
  onKies: (antwoord: GesprekAntwoord) => void
  micHint: string | null
  kanSpreken: boolean
  luistert: boolean
  onLuister: () => void
}) {
  if (antwoorden.length === 0) return null
  return (
    <div className="col" style={{ gap: 8, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
      {micHint && (
        <p className="dim" style={{ fontSize: 12.5, textAlign: 'center' }}>
          {micHint}
        </p>
      )}
      <div className="row" style={{ gap: 8, alignItems: 'stretch' }}>
        <div className="col" style={{ flex: 1, gap: 8 }}>
          {antwoorden.map((a) => (
            <button
              key={a.tekst}
              className="glass"
              onClick={() => onKies(a)}
              style={{ padding: '11px 14px', textAlign: 'left', fontSize: 15, minHeight: 44 }}
            >
              {a.tekst}
              <span className="faint" style={{ display: 'block', fontSize: 12 }}>
                {a.nl}
              </span>
            </button>
          ))}
        </div>
        {kanSpreken && (
          <button
            onClick={onLuister}
            aria-label="Spreek je antwoord in"
            style={{
              width: 62,
              borderRadius: 18,
              fontSize: 24,
              background: luistert ? 'linear-gradient(135deg, var(--hot1), var(--hot2))' : 'var(--surface-2)',
              border: luistert ? 'none' : '1.5px solid var(--line)',
              boxShadow: luistert ? '0 0 18px rgba(236, 72, 153, 0.55)' : 'none',
            }}
          >
            {luistert ? (
              <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.9, repeat: Infinity }} style={{ display: 'inline-block' }}>
                🎤
              </motion.span>
            ) : (
              '🎤'
            )}
          </button>
        )}
      </div>
      <p className="faint center" style={{ fontSize: 11.5 }}>
        {kanSpreken ? 'Tik een antwoord of spreek het in met de microfoon' : 'Tik het antwoord dat jij zou geven'}
      </p>
    </div>
  )
}

/** De kaart na afloop: de beloning en de vervolgkeuzes */
function KlaarKaart({
  emoji,
  titel,
  tekst,
  xp,
  children,
}: {
  emoji: string
  titel: string
  tekst: ReactNode
  xp: number
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass center col"
      style={{ gap: 10, padding: 20, marginTop: 10, borderColor: 'var(--line-gold)' }}
    >
      <span style={{ fontSize: 34 }}>{emoji}</span>
      <strong className="display" style={{ fontSize: 20 }}>
        {titel}
      </strong>
      <span className="gold-text" style={{ fontWeight: 900, fontSize: 24 }}>
        +{xp} XP
      </span>
      <p className="dim" style={{ fontSize: 13.5 }}>
        {tekst}
      </p>
      {children}
    </motion.div>
  )
}

function GesprekSpeler({
  scenario,
  onTerug,
  volgende,
  onVolgende,
}: {
  scenario: GesprekScenario
  onTerug: () => void
  /** eerstvolgende nog niet gevoerde gesprek: na de confetti staat het klaar */
  volgende?: GesprekScenario
  onVolgende?: (sc: GesprekScenario) => void
}) {
  const courseId = useStore((s) => s.courseId)
  const voltooiGesprek = useStore((s) => s.voltooiGesprek)
  const course = courses[courseId]
  const vlag = courseFlagCode[courseId]

  const [stap, setStap] = useState(0)
  const [klaar, setKlaar] = useState(false)
  const [verdiend, setVerdiend] = useState(0)
  const [vertaling, setVertaling] = useState(false)
  const scroller = useRef<HTMLDivElement | null>(null)
  const uitbetaald = useRef(false)

  const { berichten, setBerichten, typend, partnerZegt, later } = useChat(course.ttsLang)
  // de getter zorgt dat de microfoon de opties van de huidige stap leest
  const mic = useLuisteraar(
    course.ttsLang,
    () => scenario.stappen[stap]?.antwoorden ?? [],
    (antwoord) => beantwoord(antwoord, true)
  )

  // openingszin
  useEffect(() => {
    partnerZegt(scenario.stappen[0].zeg, scenario.stappen[0].nl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // altijd naar het laatste bericht scrollen
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [berichten, typend, klaar])

  const beantwoord = (antwoord: GesprekAntwoord, gesproken: boolean) => {
    if (typend || klaar) return
    sfx(gesproken ? 'correct' : 'tap')
    mic.setMicHint(null)
    setBerichten((b) => [...b, { van: 'ik', ...antwoord, gesproken }])
    const volgende = stap + 1
    setStap(volgende)
    if (volgende < scenario.stappen.length) {
      later(350, () => partnerZegt(scenario.stappen[volgende].zeg, scenario.stappen[volgende].nl))
    } else {
      later(350, () =>
        partnerZegt(scenario.slot.zeg, scenario.slot.nl, () => {
          if (uitbetaald.current) return
          uitbetaald.current = true
          const xp = voltooiGesprek(scenario.id)
          setVerdiend(xp)
          later(700, () => {
            setKlaar(true)
            sfx('complete')
            confetti({ particleCount: 90, spread: 75, origin: { y: 0.7 }, colors: ['#A855F7', '#EC4899', '#FFC53D'] })
          })
        })
      )
    }
  }

  const antwoorden = !klaar && !typend && stap < scenario.stappen.length ? scenario.stappen[stap].antwoorden : []
  const totaal = scenario.stappen.length
  const voortgang = Math.round((Math.min(stap, totaal) / totaal) * 100)

  return (
    <div className="shell shell--bare" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', paddingBottom: 12 }}>
      {/* kop: wie spreek je, en de vertaalknop */}
      <ChatKop
        partner={scenario.partner}
        vlag={vlag}
        ondertitel={`${scenario.titel} · ${course.name}`}
        vertaling={vertaling}
        opVertaling={() => setVertaling((v) => !v)}
        onTerug={onTerug}
      />

      {/* hoe ver ben je in dit gesprek? de CSS-overgang doet de beweging */}
      <div style={{ flexShrink: 0, paddingTop: 8 }}>
        <div
          className="progress-track"
          style={{ height: 5 }}
          role="progressbar"
          aria-label="Voortgang in dit gesprek"
          aria-valuemin={0}
          aria-valuemax={totaal}
          aria-valuenow={Math.min(stap, totaal)}
        >
          <div className="progress-fill" style={{ width: `${voortgang}%` }} />
        </div>
      </div>

      {/* het gesprek */}
      <div ref={scroller} style={{ flex: 1, overflowY: 'auto', padding: '16px 2px', display: 'flex', flexDirection: 'column', gap: 10 }} className="no-scrollbar">
        <p className="faint center" style={{ fontSize: 12.5, marginBottom: 6 }}>
          {scenario.emoji} {scenario.plek}
        </p>
        <Berichtenlijst berichten={berichten} typend={typend} partner={scenario.partner} vlag={vlag} ttsLang={course.ttsLang} vertaling={vertaling} />

        {/* afgerond: de beloning en de vervolgkeuzes */}
        <AnimatePresence>
          {klaar && (
            <KlaarKaart
              emoji="🗣️"
              titel="Gesprek voltooid!"
              xp={verdiend}
              tekst={`Je hebt een heel gesprek in het ${course.name} gevoerd. Dat is precies hoe het straks in het echt gaat.`}
            >
              {volgende && onVolgende ? (
                <>
                  {/* het volgende gesprek staat al klaar: de lus blijft draaien */}
                  <button className="btn btn-primary" style={{ padding: 13 }} onClick={() => { sfx('tap'); onVolgende(volgende) }}>
                    {volgende.emoji} Volgende gesprek: {volgende.titel}
                  </button>
                  <button className="dim" style={{ minHeight: 44, fontSize: 14 }} onClick={() => { sfx('tap'); onTerug() }}>
                    Terug naar de lijst
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" style={{ padding: 13 }} onClick={() => { sfx('tap'); onTerug() }}>
                  Verder
                </button>
              )}
            </KlaarKaart>
          )}
        </AnimatePresence>
      </div>

      {/* jouw beurt: kiezen of inspreken */}
      <AntwoordPaneel
        antwoorden={antwoorden}
        onKies={(a) => beantwoord(a, false)}
        micHint={mic.micHint}
        kanSpreken={mic.kanSpreken}
        luistert={mic.luistert}
        onLuister={mic.luister}
      />
    </div>
  )
}

/**
 * Het vrije gesprek: jij bepaalt waar het over gaat. Na de begroeting kies je
 * een onderwerp, praat je daar twee beurten over, en kies je daarna het
 * volgende onderwerp of rond je af. Elk gesprek is dus anders, en je kan
 * blijven doorpraten zolang je wilt.
 */
function VrijSpeler({ onTerug }: { onTerug: () => void }) {
  const courseId = useStore((s) => s.courseId)
  const voltooiGesprek = useStore((s) => s.voltooiGesprek)
  const course = courses[courseId]
  const vlag = courseFlagCode[courseId]
  const vrij = VRIJ_GESPREK[courseId]

  const [fase, setFase] = useState<'intro' | 'kies' | 'onderwerp'>('intro')
  const [huidigeStap, setHuidigeStap] = useState<GesprekStap | null>(null)
  const [wachtrij, setWachtrij] = useState<GesprekStap[]>([])
  const [gedaan, setGedaan] = useState<string[]>([])
  const [klaar, setKlaar] = useState(false)
  const [verdiend, setVerdiend] = useState(0)
  const [vertaling, setVertaling] = useState(false)
  const scroller = useRef<HTMLDivElement | null>(null)
  const uitbetaald = useRef(false)

  const { berichten, setBerichten, typend, partnerZegt, later } = useChat(course.ttsLang)
  // de getter zorgt dat de microfoon de opties van de huidige stap leest
  const mic = useLuisteraar(
    course.ttsLang,
    () => huidigeStap?.antwoorden ?? [],
    (antwoord) => beantwoord(antwoord, true)
  )

  useEffect(() => {
    partnerZegt(vrij.intro.zeg, vrij.intro.nl)
    setHuidigeStap(vrij.intro)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [berichten, typend, klaar, fase])

  const beantwoord = (antwoord: GesprekAntwoord, gesproken: boolean) => {
    if (typend || klaar || !huidigeStap) return
    sfx(gesproken ? 'correct' : 'tap')
    mic.setMicHint(null)
    setBerichten((b) => [...b, { van: 'ik', ...antwoord, gesproken }])
    setHuidigeStap(null)
    if (fase === 'intro') {
      later(350, () => partnerZegt(vrij.keuzevraag.zeg, vrij.keuzevraag.nl, () => setFase('kies')))
    } else if (wachtrij.length > 0) {
      const [volgende, ...rest] = wachtrij
      setWachtrij(rest)
      later(350, () => partnerZegt(volgende.zeg, volgende.nl, () => setHuidigeStap(volgende)))
    } else {
      later(350, () => partnerZegt(vrij.vervolgvraag.zeg, vrij.vervolgvraag.nl, () => setFase('kies')))
    }
  }

  const kiesOnderwerp = (o: GespreksOnderwerp) => {
    if (typend || klaar) return
    sfx('tap')
    setFase('onderwerp')
    setGedaan((g) => [...g, o.id])
    setWachtrij(o.stappen.slice(1))
    later(250, () => partnerZegt(o.stappen[0].zeg, o.stappen[0].nl, () => setHuidigeStap(o.stappen[0])))
  }

  const rondAf = () => {
    if (typend || klaar) return
    sfx('tap')
    setFase('onderwerp')
    setBerichten((b) => [...b, { van: 'ik', tekst: vrij.afscheid.tekst, nl: vrij.afscheid.nl }])
    later(350, () =>
      partnerZegt(vrij.slot.zeg, vrij.slot.nl, () => {
        if (uitbetaald.current) return
        uitbetaald.current = true
        const xp = voltooiGesprek('vrij')
        setVerdiend(xp)
        later(700, () => {
          setKlaar(true)
          sfx('complete')
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.7 }, colors: ['#A855F7', '#EC4899', '#FFC53D'] })
        })
      })
    )
  }

  const antwoorden = !klaar && !typend && huidigeStap ? huidigeStap.antwoorden : []
  const openOnderwerpen = vrij.onderwerpen.filter((o) => !gedaan.includes(o.id))
  // een vrij gesprek heeft geen vast einde, dus geen balk: wel de teller zodra
  // er iets besproken is
  const ondertitel =
    gedaan.length > 0
      ? `Vrij gesprek · ${gedaan.length} ${gedaan.length === 1 ? 'onderwerp' : 'onderwerpen'}`
      : `Vrij gesprek · ${course.name}`

  return (
    <div className="shell shell--bare" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', paddingBottom: 12 }}>
      <ChatKop
        partner={vrij.partner}
        vlag={vlag}
        ondertitel={ondertitel}
        vertaling={vertaling}
        opVertaling={() => setVertaling((v) => !v)}
        onTerug={onTerug}
      />

      <div ref={scroller} style={{ flex: 1, overflowY: 'auto', padding: '16px 2px', display: 'flex', flexDirection: 'column', gap: 10 }} className="no-scrollbar">
        <p className="faint center" style={{ fontSize: 12.5, marginBottom: 6 }}>
          💬 Jij kiest waar dit gesprek over gaat
        </p>
        <Berichtenlijst berichten={berichten} typend={typend} partner={vrij.partner} vlag={vlag} ttsLang={course.ttsLang} vertaling={vertaling} />

        <AnimatePresence>
          {klaar && (
            <KlaarKaart
              emoji="💬"
              titel="Wat een gesprek!"
              xp={verdiend}
              tekst={`Jullie hadden het over ${gedaan.length} ${gedaan.length === 1 ? 'onderwerp' : 'onderwerpen'}. Volgende keer kiest ${vrij.partner} vast weer iets nieuws uit.`}
            >
              <button className="btn btn-primary" style={{ padding: 13 }} onClick={() => { sfx('tap'); onTerug() }}>
                Verder
              </button>
            </KlaarKaart>
          )}
        </AnimatePresence>
      </div>

      {/* jouw beurt: antwoorden, of het volgende onderwerp kiezen */}
      <AntwoordPaneel
        antwoorden={antwoorden}
        onKies={(a) => beantwoord(a, false)}
        micHint={mic.micHint}
        kanSpreken={mic.kanSpreken}
        luistert={mic.luistert}
        onLuister={mic.luister}
      />

      {fase === 'kies' && !typend && !klaar && (
        <div className="col" style={{ gap: 8, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
          <p className="dim center" style={{ fontSize: 12.5 }}>
            Waar wil je het over hebben?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {openOnderwerpen.map((o) => (
              <button key={o.id} className="glass col center" onClick={() => kiesOnderwerp(o)} style={{ gap: 3, padding: '10px 6px', minHeight: 56 }}>
                <span style={{ fontSize: 20 }}>{o.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{o.titel}</span>
              </button>
            ))}
            {gedaan.length > 0 && (
              <button className="glass col center" onClick={rondAf} style={{ gap: 3, padding: '10px 6px', minHeight: 56, borderColor: 'var(--line-gold)' }}>
                <span style={{ fontSize: 20 }}>🏁</span>
                <span className="gold-text" style={{ fontSize: 12, fontWeight: 800 }}>Afronden</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- de hub: kies met wie je gaat praten ---------- */

/** stabiele lege lijst, anders geeft de selector elke render een nieuw object */
const GEEN_GESPREKKEN: string[] = []

export function GesprekkenScreen({ onExit }: { onExit: () => void }) {
  const courseId = useStore((s) => s.courseId)
  const klaar = useStore((s) => s.gesprekken[s.courseId] ?? GEEN_GESPREKKEN)
  const course = courses[courseId]
  const vlag = courseFlagCode[courseId]
  const scenarios = [...(GESPREKKEN[courseId] ?? []), RESTAURANT[courseId]]
  const vrij = VRIJ_GESPREK[courseId]
  const [actief, setActief] = useState<GesprekScenario | 'vrij' | null>(null)

  if (actief === 'vrij') return <VrijSpeler onTerug={() => setActief(null)} />
  if (actief) {
    // na de confetti staat het eerstvolgende ongevoerde gesprek al klaar
    const volgende = scenarios.find((sc) => sc.id !== actief.id && !klaar.includes(sc.id))
    return (
      <GesprekSpeler
        key={actief.id}
        scenario={actief}
        onTerug={() => setActief(null)}
        volgende={volgende}
        onVolgende={(sc) => setActief(sc)}
      />
    )
  }

  return (
    <div className="shell shell--bare">
      <header className="row" style={{ gap: 10, marginBottom: 6 }}>
        <button onClick={() => { sfx('tap'); onExit() }} aria-label="Terug" style={{ minWidth: 44, minHeight: 44, fontSize: 22 }}>
          ←
        </button>
        <h1 className="display" style={{ fontSize: 26 }}>
          🗣️ Gesprekken
        </h1>
      </header>
      <p className="dim" style={{ fontSize: 14, marginBottom: 14 }}>
        Praat écht in het {course.name}: jouw partner spreekt met een moedertaalstem en jij antwoordt door te kiezen of in te
        spreken. Fout bestaat hier niet.
      </p>
      {/* de verzameling die om vulling vraagt: hoe ver ben je? */}
      {(() => {
        const totaal = scenarios.length + 1
        const aantal = Math.min(klaar.length, totaal)
        return (
          <div style={{ marginBottom: 18 }}>
            <div className="progress-track" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${Math.round((aantal / totaal) * 100)}%` }} />
            </div>
            <p className="faint num" style={{ fontSize: 12, marginTop: 5 }}>
              {aantal} van {totaal} gesprekken gevoerd
            </p>
          </div>
        )
      })()}
      <div className="col" style={{ gap: 12 }}>
        {/* het vrije gesprek: jij kiest het onderwerp, elke keer anders */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="glass row"
          onClick={() => { sfx('tap'); setActief('vrij') }}
          style={{ gap: 14, padding: 16, textAlign: 'left', alignItems: 'center', borderColor: 'var(--line-hot)', boxShadow: '0 0 20px rgba(236, 72, 153, 0.18)' }}
        >
          <PartnerKop naam={vrij.partner} code={vlag} size={46} />
          <div className="col" style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ fontSize: 16 }}>
              💬 Vrij gesprek{' '}
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--cyan)', border: '1px solid rgba(34,211,238,0.5)', borderRadius: 6, padding: '1px 5px' }}>
                NIEUW
              </span>
            </strong>
            <span className="dim" style={{ fontSize: 13 }}>
              Met {vrij.partner} · elke keer een ander gesprek
            </span>
          </div>
          {/* het vrije gesprek is nooit "af": altijd de uitnodigende chevron */}
          <span className="dim" style={{ fontSize: 20, flexShrink: 0 }}>
            ›
          </span>
        </motion.button>

        {scenarios.map((sc) => {
          const af = klaar.includes(sc.id)
          return (
            <motion.button
              key={sc.id}
              whileTap={{ scale: 0.98 }}
              className="glass row"
              onClick={() => { sfx('tap'); setActief(sc) }}
              style={{ gap: 14, padding: 16, textAlign: 'left', alignItems: 'center', borderColor: af ? 'var(--line-gold)' : undefined }}
            >
              <PartnerKop naam={sc.partner} code={vlag} size={46} />
              <div className="col" style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: 16 }}>
                  {sc.emoji} {sc.titel}
                </strong>
                <span className="dim" style={{ fontSize: 13 }}>
                  Met {sc.partner} · {sc.plek}
                </span>
              </div>
              {af ? (
                <span className="col" style={{ flexShrink: 0, alignItems: 'flex-end', gap: 1 }}>
                  <span className="gold-text" style={{ fontWeight: 800, fontSize: 13 }}>
                    ✓ Gevoerd
                  </span>
                  <span className="faint" style={{ fontSize: 10.5 }}>
                    opnieuw voor 10 XP
                  </span>
                </span>
              ) : (
                <span className="dim" style={{ fontSize: 20, flexShrink: 0 }}>
                  ›
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
      <p className="faint center" style={{ fontSize: 12.5, marginTop: 18 }}>
        Eerste keer 25 XP, daarna 10 XP per gesprek. Er komen er steeds meer bij.
      </p>
    </div>
  )
}
