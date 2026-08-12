import { useEffect, useRef, useState } from 'react'
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

function GesprekSpeler({
  scenario,
  onTerug,
}: {
  scenario: GesprekScenario
  onTerug: () => void
}) {
  const courseId = useStore((s) => s.courseId)
  const voltooiGesprek = useStore((s) => s.voltooiGesprek)
  const course = courses[courseId]
  const vlag = courseFlagCode[courseId]

  const [berichten, setBerichten] = useState<Bericht[]>([])
  const [stap, setStap] = useState(0)
  const [typend, setTypend] = useState(true)
  const [klaar, setKlaar] = useState(false)
  const [verdiend, setVerdiend] = useState(0)
  const [vertaling, setVertaling] = useState(false)
  const [luistert, setLuistert] = useState(false)
  const [micHint, setMicHint] = useState<string | null>(null)
  const herkenner = useRef<Herkenner | null>(null)
  const scroller = useRef<HTMLDivElement | null>(null)
  const uitbetaald = useRef(false)
  const timers = useRef<number[]>([])
  const kanSpreken = useRef(maakHerkenner() !== null)

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  // opruimen bij verlaten: timers en een eventueel lopende microfoon
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      herkenner.current?.abort()
    },
    []
  )

  /** partner zegt een regel: eerst even "aan het typen", dan de tekst met audio */
  const partnerZegt = (tekst: string, nl: string, daarna?: () => void) => {
    setTypend(true)
    later(900, () => {
      setTypend(false)
      setBerichten((b) => [...b, { van: 'partner', tekst, nl }])
      speak(tekst, course.ttsLang)
      daarna?.()
    })
  }

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
    setMicHint(null)
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

  const luister = () => {
    const opties = scenario.stappen[stap]?.antwoorden
    if (!opties || luistert) return
    const rec = maakHerkenner()
    if (!rec) return
    herkenner.current = rec
    rec.lang = course.ttsLang
    rec.interimResults = false
    rec.maxAlternatives = 4
    setLuistert(true)
    setMicHint(null)
    rec.onresult = (e) => {
      const kandidaten = Array.from(e.results[0] ?? [])
      const raak = kandidaten.map((k) => matchGesproken(k.transcript, opties)).find(Boolean)
      if (raak) {
        beantwoord(raak, true)
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
  }

  const antwoorden = !klaar && !typend && stap < scenario.stappen.length ? scenario.stappen[stap].antwoorden : []

  return (
    <div className="shell shell--bare" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', paddingBottom: 12 }}>
      {/* kop: wie spreek je, en de vertaalknop */}
      <header className="row" style={{ gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
        <button onClick={() => { sfx('tap'); onTerug() }} aria-label="Terug" style={{ minWidth: 44, minHeight: 44, fontSize: 22 }}>
          ←
        </button>
        <PartnerKop naam={scenario.partner} code={vlag} />
        <div className="col" style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ fontSize: 16 }}>{scenario.partner}</strong>
          <span className="dim" style={{ fontSize: 12.5 }}>
            {scenario.titel} · {course.name}
          </span>
        </div>
        <button
          onClick={() => { sfx('tap'); setVertaling((v) => !v) }}
          className={vertaling ? 'gold-text' : 'dim'}
          aria-label="Vertaling aan of uit"
          style={{ minWidth: 44, minHeight: 44, fontWeight: 800, fontSize: 13, border: '1.5px solid', borderColor: vertaling ? 'var(--gold)' : 'var(--line)', borderRadius: 12 }}
        >
          NL
        </button>
      </header>

      {/* het gesprek */}
      <div ref={scroller} style={{ flex: 1, overflowY: 'auto', padding: '16px 2px', display: 'flex', flexDirection: 'column', gap: 10 }} className="no-scrollbar">
        <p className="faint center" style={{ fontSize: 12.5, marginBottom: 6 }}>
          {scenario.emoji} {scenario.plek}
        </p>
        {berichten.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="row"
            style={{ alignItems: 'flex-end', gap: 8, justifyContent: b.van === 'ik' ? 'flex-end' : 'flex-start' }}
          >
            {b.van === 'partner' && <PartnerKop naam={scenario.partner} code={vlag} size={30} />}
            <button
              onClick={() => { if (b.van === 'partner') speak(b.tekst, course.ttsLang) }}
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
            <PartnerKop naam={scenario.partner} code={vlag} size={30} />
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

        {/* afgerond: de beloning en de vervolgkeuzes */}
        <AnimatePresence>
          {klaar && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass center col"
              style={{ gap: 10, padding: 20, marginTop: 10, borderColor: 'var(--line-gold)' }}
            >
              <span style={{ fontSize: 34 }}>🗣️</span>
              <strong className="display" style={{ fontSize: 20 }}>
                Gesprek voltooid!
              </strong>
              <span className="gold-text" style={{ fontWeight: 900, fontSize: 24 }}>
                +{verdiend} XP
              </span>
              <p className="dim" style={{ fontSize: 13.5 }}>
                Je hebt een heel gesprek in het {course.name} gevoerd. Dat is precies hoe het straks in het echt gaat.
              </p>
              <button className="btn btn-primary" style={{ padding: 13 }} onClick={() => { sfx('tap'); onTerug() }}>
                Verder
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* jouw beurt: kiezen of inspreken */}
      {antwoorden.length > 0 && (
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
                  onClick={() => beantwoord(a, false)}
                  style={{ padding: '11px 14px', textAlign: 'left', fontSize: 15, minHeight: 44 }}
                >
                  {a.tekst}
                  <span className="faint" style={{ display: 'block', fontSize: 12 }}>
                    {a.nl}
                  </span>
                </button>
              ))}
            </div>
            {kanSpreken.current && (
              <button
                onClick={luister}
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
            {kanSpreken.current ? 'Tik een antwoord of spreek het in met de microfoon' : 'Tik het antwoord dat jij zou geven'}
          </p>
        </div>
      )}
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

  const [berichten, setBerichten] = useState<Bericht[]>([])
  const [typend, setTypend] = useState(true)
  const [fase, setFase] = useState<'intro' | 'kies' | 'onderwerp'>('intro')
  const [huidigeStap, setHuidigeStap] = useState<GesprekStap | null>(null)
  const [wachtrij, setWachtrij] = useState<GesprekStap[]>([])
  const [gedaan, setGedaan] = useState<string[]>([])
  const [klaar, setKlaar] = useState(false)
  const [verdiend, setVerdiend] = useState(0)
  const [vertaling, setVertaling] = useState(false)
  const [luistert, setLuistert] = useState(false)
  const [micHint, setMicHint] = useState<string | null>(null)
  const herkenner = useRef<Herkenner | null>(null)
  const scroller = useRef<HTMLDivElement | null>(null)
  const uitbetaald = useRef(false)
  const timers = useRef<number[]>([])
  const kanSpreken = useRef(maakHerkenner() !== null)

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      herkenner.current?.abort()
    },
    []
  )

  const partnerZegt = (tekst: string, nl: string, daarna?: () => void) => {
    setTypend(true)
    later(900, () => {
      setTypend(false)
      setBerichten((b) => [...b, { van: 'partner', tekst, nl }])
      speak(tekst, course.ttsLang)
      daarna?.()
    })
  }

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
    setMicHint(null)
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

  const luister = () => {
    const opties = huidigeStap?.antwoorden
    if (!opties || luistert) return
    const rec = maakHerkenner()
    if (!rec) return
    herkenner.current = rec
    rec.lang = course.ttsLang
    rec.interimResults = false
    rec.maxAlternatives = 4
    setLuistert(true)
    setMicHint(null)
    rec.onresult = (e) => {
      const kandidaten = Array.from(e.results[0] ?? [])
      const raak = kandidaten.map((k) => matchGesproken(k.transcript, opties)).find(Boolean)
      if (raak) {
        beantwoord(raak, true)
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
  }

  const antwoorden = !klaar && !typend && huidigeStap ? huidigeStap.antwoorden : []
  const openOnderwerpen = vrij.onderwerpen.filter((o) => !gedaan.includes(o.id))

  return (
    <div className="shell shell--bare" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', paddingBottom: 12 }}>
      <header className="row" style={{ gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
        <button onClick={() => { sfx('tap'); onTerug() }} aria-label="Terug" style={{ minWidth: 44, minHeight: 44, fontSize: 22 }}>
          ←
        </button>
        <PartnerKop naam={vrij.partner} code={vlag} />
        <div className="col" style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ fontSize: 16 }}>{vrij.partner}</strong>
          <span className="dim" style={{ fontSize: 12.5 }}>
            Vrij gesprek · {course.name}
          </span>
        </div>
        <button
          onClick={() => { sfx('tap'); setVertaling((v) => !v) }}
          className={vertaling ? 'gold-text' : 'dim'}
          aria-label="Vertaling aan of uit"
          style={{ minWidth: 44, minHeight: 44, fontWeight: 800, fontSize: 13, border: '1.5px solid', borderColor: vertaling ? 'var(--gold)' : 'var(--line)', borderRadius: 12 }}
        >
          NL
        </button>
      </header>

      <div ref={scroller} style={{ flex: 1, overflowY: 'auto', padding: '16px 2px', display: 'flex', flexDirection: 'column', gap: 10 }} className="no-scrollbar">
        <p className="faint center" style={{ fontSize: 12.5, marginBottom: 6 }}>
          💬 Jij kiest waar dit gesprek over gaat
        </p>
        {berichten.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="row"
            style={{ alignItems: 'flex-end', gap: 8, justifyContent: b.van === 'ik' ? 'flex-end' : 'flex-start' }}
          >
            {b.van === 'partner' && <PartnerKop naam={vrij.partner} code={vlag} size={30} />}
            <button
              onClick={() => { if (b.van === 'partner') speak(b.tekst, course.ttsLang) }}
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
            <PartnerKop naam={vrij.partner} code={vlag} size={30} />
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

        <AnimatePresence>
          {klaar && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass center col"
              style={{ gap: 10, padding: 20, marginTop: 10, borderColor: 'var(--line-gold)' }}
            >
              <span style={{ fontSize: 34 }}>💬</span>
              <strong className="display" style={{ fontSize: 20 }}>
                Wat een gesprek!
              </strong>
              <span className="gold-text" style={{ fontWeight: 900, fontSize: 24 }}>
                +{verdiend} XP
              </span>
              <p className="dim" style={{ fontSize: 13.5 }}>
                Jullie hadden het over {gedaan.length} {gedaan.length === 1 ? 'onderwerp' : 'onderwerpen'}. Volgende keer kiest {vrij.partner} vast weer iets nieuws uit.
              </p>
              <button className="btn btn-primary" style={{ padding: 13 }} onClick={() => { sfx('tap'); onTerug() }}>
                Verder
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* jouw beurt: antwoorden, of het volgende onderwerp kiezen */}
      {antwoorden.length > 0 && (
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
                  onClick={() => beantwoord(a, false)}
                  style={{ padding: '11px 14px', textAlign: 'left', fontSize: 15, minHeight: 44 }}
                >
                  {a.tekst}
                  <span className="faint" style={{ display: 'block', fontSize: 12 }}>
                    {a.nl}
                  </span>
                </button>
              ))}
            </div>
            {kanSpreken.current && (
              <button
                onClick={luister}
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
        </div>
      )}

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
  if (actief) return <GesprekSpeler scenario={actief} onTerug={() => setActief(null)} />

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
      <p className="dim" style={{ fontSize: 14, marginBottom: 18 }}>
        Praat écht in het {course.name}: jouw partner spreekt met een moedertaalstem en jij antwoordt door te kiezen of in te
        spreken. Fout bestaat hier niet.
      </p>
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
              <span className="gold-text" style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
                NIEUW
              </span>
            </strong>
            <span className="dim" style={{ fontSize: 13 }}>
              Met {vrij.partner} · jij kiest zelf waar het over gaat
            </span>
          </div>
          {klaar.includes('vrij') ? (
            <span className="gold-text" style={{ fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
              ✓ Gevoerd
            </span>
          ) : (
            <span className="dim" style={{ fontSize: 20, flexShrink: 0 }}>
              ›
            </span>
          )}
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
                <span className="gold-text" style={{ fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                  ✓ Gevoerd
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
