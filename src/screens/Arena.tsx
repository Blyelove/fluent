import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import confetti from 'canvas-confetti'
import { courses } from '../content'
import { useStore } from '../store'
import {
  ARENAS,
  SCHILDEN,
  VERLIES_BEKERS,
  WINST_BEKERS,
  arenaVoor,
  arenaVragen,
  botBeurt,
  drukVan,
  gladiatorVoor,
  volgendeArena,
  type ArenaVraag,
  type Gladiator,
} from '../arena'
import { Avatar } from '../components/Avatar'
import { isMeester } from '../skills'
import { STANDAARD_STIJLEN, stijlUitLink } from '../stijlen'
import { Schildbreuk, type BreukStijl } from '../components/Schildbreuk'
import { encodeSchaduw, schaduwLink, type SchaduwBeurt, type SchaduwDuel } from '../arena-duel'
import { courseFlagCode } from '../countries'
import { Flag } from '../components/Flag'
import { sfx, speak } from '../audio'
import { feestGoud } from '../wereldkleuren'

/**
 * De Arena: één tegen één, drie schilden elk, wie het eerst door zijn
 * schilden heen is verliest. De opkomst zet beide vechters tegenover
 * elkaar, elke vraag is een slagwissel, en snelheid telt: wie snel goed
 * antwoordt zet de ander onder druk.
 *
 * Buiten het potje wordt nooit gestraft: een nederlaag kost geen XP of
 * voortgang, en de revanche staat altijd klaar. Schilden zijn spanning
 * binnen het gevecht, geen limiet op leren.
 */

const VRAGEN_MAX = 30
/** hoelang de breuk in beeld blijft; korter en de scherven worden afgekapt */
const KLAP_MS = 800

type Fase =
  | { naam: 'opkomst'; tel: number }
  | { naam: 'strijd' }
  | { naam: 'uitslag'; gewonnen: boolean; bekersNa: number }

export function ArenaScreen({
  onTerug,
  onPlayingChange,
  schaduw,
}: {
  onTerug: () => void
  onPlayingChange?: (b: boolean) => void
  /** de opname van een vriend: dan vecht je tegen zijn schaduw in plaats van tegen een poortwachter */
  schaduw?: SchaduwDuel | null
}) {
  const courseId = useStore((s) => s.courseId)
  const bekers = useStore((s) => s.bekers)
  const boekArena = useStore((s) => s.boekArena)
  const addMistake = useStore((s) => s.addMistake)
  const look = useStore((s) => s.avatarLook)
  const meester = useStore((s) => isMeester(s.progress[s.courseId]?.xp ?? 0))
  // dezelfde naam als bij de duels: één plek waar je jezelf noemt
  const naamVanJou = useStore((s) => s.duelName.trim().slice(0, 16) || 'Uitdager')
  const opkomstStijl = useStore((s) => stijlUitLink('arena') ?? s.stijlen.arena ?? STANDAARD_STIJLEN.arena)
  const breukStijl = useStore(
    (s) => (stijlUitLink('breuk') ?? s.stijlen.breuk ?? STANDAARD_STIJLEN.breuk) as BreukStijl,
  )
  const course = courses[courseId]
  const kalm = Boolean(useReducedMotion())

  const rang = arenaVoor(bekers)
  /* Het zaad bepaalt de vragen. Bij een uitdaging komt het uit de link, zodat
     je vriend exact jouw vragen krijgt; anders is het nieuw en houden we het
     vast om er later een uitdaging van te kunnen maken. */
  const [zaad] = useState<number>(() => schaduw?.s ?? Math.floor(Math.random() * 2 ** 31))
  const [tegenstander] = useState<Gladiator>(() =>
    schaduw
      ? { naam: schaduw.n, kans: 0.5, tempo: 3500, uitleg: 'Speelde precies deze vragen, en dit is hoe het hem verging' }
      : gladiatorVoor(bekers),
  )
  const vragen = useMemo(() => arenaVragen(course, VRAGEN_MAX, zaad), [course, zaad])
  /** jouw eigen beurten, om er een uitdaging van te kunnen maken */
  const opname = useRef<SchaduwBeurt[]>([])
  const [uitdaging, setUitdaging] = useState<string | null>(null)
  const [gedeeld, setGedeeld] = useState(false)

  const [fase, setFase] = useState<Fase>({ naam: 'opkomst', tel: 3 })
  const [vraagIdx, setVraagIdx] = useState(0)
  // ?matchpoint=1 start het gevecht meteen op het scherpst van de snede
  const opScherp = new URLSearchParams(window.location.search).has('matchpoint')
  const [mijnSchilden, setMijnSchilden] = useState(opScherp ? 1 : SCHILDEN)
  const [zijnSchilden, setZijnSchilden] = useState(opScherp ? 1 : SCHILDEN)
  const [gekozen, setGekozen] = useState<number | null>(null)
  const [botDenkt, setBotDenkt] = useState(false)
  /** wat hij uitstraalt terwijl hij nadenkt: dat mag je aan hem zien */
  const [botStemming, setBotStemming] = useState<'aarzelt' | 'versnelt' | null>(null)
  const [melding, setMelding] = useState<string | null>(null)
  /** de korte stilte na een nederlaag: het scherm valt even weg */
  const [stilte, setStilte] = useState(false)
  const [klap, setKlap] = useState<'ik' | 'hij' | null>(null)
  /** de slag die nu over het scherm trekt: van wie naar wie */
  const [slag, setSlag] = useState<'ik' | 'hij' | null>(null)
  /** matchpoint: iemand staat op één schild, het scherm houdt zijn adem in */
  const matchpoint = fase.naam === 'strijd' && (mijnSchilden === 1 || zijnSchilden === 1)
  const vraagStart = useRef(0)
  const geboekt = useRef(false)
  const timers = useRef<number[]>([])
  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // de onderbalk verdwijnt tijdens het gevecht: dit is een potje op spanning
  useEffect(() => {
    onPlayingChange?.(true)
    return () => onPlayingChange?.(false)
  }, [onPlayingChange])

  /* ---------- de opkomst: aftelling met dreun ---------- */
  useEffect(() => {
    if (fase.naam !== 'opkomst') return
    if (fase.tel === 0) {
      setFase({ naam: 'strijd' })
      vraagStart.current = performance.now()
      return
    }
    sfx('tap')
    const t = window.setTimeout(() => setFase({ naam: 'opkomst', tel: fase.tel - 1 }), 900)
    return () => clearTimeout(t)
  }, [fase])

  const vraag: ArenaVraag | undefined = vragen[vraagIdx]

  /* ---------- einde van het gevecht ---------- */
  const rondAf = (gewonnen: boolean) => {
    if (geboekt.current) return
    geboekt.current = true
    const bekersNa = boekArena(gewonnen)
    // van jouw net gespeelde potje meteen een uitdaging maken; alleen bij een
    // eigen gevecht, want de schaduw van je vriend doorsturen slaat nergens op
    if (!schaduw && opname.current.length) {
      setUitdaging(
        encodeSchaduw({
          v: 1,
          c: courseId,
          s: zaad,
          n: naamVanJou,
          b: opname.current.slice(0, 40),
          o: gewonnen ? Math.max(1, mijnSchilden) : 0,
        }),
      )
    }
    if (gewonnen) {
      sfx('complete')
      confetti({ particleCount: 170, spread: 110, origin: { y: 0.5 }, colors: feestGoud(), disableForReducedMotion: true })
    } else {
      // geen geluid bij verlies: de stilte is het effect
      setStilte(true)
    }
    later(gewonnen ? 700 : 1300, () => setFase({ naam: 'uitslag', gewonnen, bekersNa }))
  }

  /* ---------- een slagwissel ---------- */
  const beantwoord = (i: number) => {
    if (fase.naam !== 'strijd' || gekozen !== null || !vraag) return
    const ms = performance.now() - vraagStart.current
    setGekozen(i)
    const goed = i === vraag.juist
    if (goed) {
      sfx('correct')
      speak(vraag.zeg, course.ttsLang)
      // jouw slag trekt naar rechts, naar je tegenstander toe
      setSlag('ik')
      later(420, () => setSlag(null))
    } else {
      sfx('wrong')
      setKlap('ik')
      setMijnSchilden((s) => s - 1)
      later(KLAP_MS, () => setKlap(null))
    }

    // jouw beurt vastleggen, zodat hier een uitdaging van te maken is
    opname.current.push({ g: goed ? 1 : 0, t: Math.min(30000, Math.round(ms / 100) * 100) })

    /* De beurt van de tegenstander. Tegen een poortwachter wordt die berekend:
       voor staan laat hem versnellen, achter staan laat hem twijfelen, en jouw
       tempo maakt hem grillig. Tegen een schaduw wordt er niets berekend, want
       dan speelt je vriend zijn eigen opgenomen beurt terug: precies wat hij
       had, in precies zijn eigen tempo. */
    setBotDenkt(true)
    const druk = goed ? drukVan(ms) : 0
    const opgenomen = schaduw?.b[vraagIdx]
    const beurt = opgenomen
      ? {
          denktijd: Math.max(650, Math.min(9000, opgenomen.t)),
          goed: opgenomen.g === 1,
          aarzelt: opgenomen.t > 6000,
          versnelt: opgenomen.t < 2200,
        }
      : botBeurt(tegenstander, {
          zijnSchilden: zijnSchilden - (goed ? 1 : 0),
          mijnSchilden: mijnSchilden - (goed ? 0 : 1),
          druk,
        })
    const botGoed = beurt.goed
    setBotStemming(beurt.aarzelt ? 'aarzelt' : beurt.versnelt ? 'versnelt' : null)
    later(beurt.denktijd, () => {
      setBotDenkt(false)
      setBotStemming(null)
      if (!botGoed) {
        sfx('correct')
        setKlap('hij')
        setZijnSchilden((s) => s - 1)
        setMelding(`${tegenstander.naam} sloeg de plank mis`)
        later(KLAP_MS, () => setKlap(null))
      } else {
        setMelding(`${tegenstander.naam} pareerde jouw slag`)
        setSlag('hij')
        later(420, () => setSlag(null))
      }
      later(650, () => {
        setMelding(null)
        const mijnNa = mijnSchilden - (goed ? 0 : 1)
        const zijnNa = zijnSchilden - (botGoed ? 0 : 1)
        if (mijnNa <= 0 || zijnNa <= 0) {
          rondAf(zijnNa <= 0 && mijnNa > 0)
        } else {
          setGekozen(null)
          setVraagIdx((v) => (v + 1) % vragen.length)
          vraagStart.current = performance.now()
        }
      })
    })
  }

  // fouten uit de arena horen gewoon in je foutenlijst; hier is geen les-id,
  // dus dat doen we niet: de arena leert je tempo, de les leert je stof
  void addMistake

  /**
   * De schilden zijn de levensbalk van het hele gevecht, dus die mogen niet
   * als bijzaak in de hoek staan. Ze zijn groter dan de rest van de balk, en
   * de rij van wie geraakt wordt schudt mee: dat is wat een klap voelbaar
   * maakt op een scherm van 375 breed.
   */
  const schild = (aantal: number, kant: 'ik' | 'hij') => {
    const geraakt = klap === kant
    return (
      <motion.div
        className="row"
        style={{ gap: 4 }}
        aria-label={`${aantal} schilden over`}
        animate={geraakt && !kalm ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.34 }}
      >
        {Array.from({ length: SCHILDEN }, (_, i) => {
          const heel = i < aantal
          // het schild dat nét breekt: de teller staat al één lager, dus dit
          // is precies het vakje waar de breuk overheen komt te liggen
          const breekt = geraakt && i === aantal
          return (
            <span
              key={i}
              style={{ position: 'relative', width: 27, height: 29, display: 'inline-grid', placeItems: 'center' }}
            >
              <span
                style={{
                  fontSize: 23,
                  lineHeight: 1,
                  opacity: breekt ? 0 : 1,
                  filter: heel ? 'drop-shadow(0 0 7px var(--cyaan-65))' : 'grayscale(1) opacity(0.22)',
                }}
              >
                🛡️
              </span>
              {breekt && <Schildbreuk key={`breuk-${kant}-${aantal}`} stijl={breukStijl} kalm={kalm} />}
            </span>
          )
        })}
      </motion.div>
    )
  }

  /* ---------- de opkomst ---------- */
  if (fase.naam === 'opkomst') {
    return (
      <div
        className="shell shell--bare center"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}
      >
        {/* POORT: twee deuren zwaaien open en onthullen de arena */}
        {opkomstStijl === 'poort' && !kalm && (
          <>
            {[-1, 1].map((kant) => (
              <motion.div
                key={kant}
                initial={{ x: 0 }}
                animate={{ x: kant * 400 }}
                transition={{ duration: 1.5, delay: 0.2, ease: [0.7, 0, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  [kant === -1 ? 'left' : 'right']: 0,
                  width: '50%',
                  background: 'var(--paneel-diep)',
                  borderRight: kant === -1 ? '3px solid var(--gold)' : undefined,
                  borderLeft: kant === 1 ? '3px solid var(--gold)' : undefined,
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              />
            ))}
          </>
        )}
        {/* SPOTLICHT: donker, dan valt er één spot op elke vechter */}
        {opkomstStijl === 'spot' && !kalm && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 42%, transparent 12%, rgba(0,0,0,0.94) 30%), radial-gradient(circle at 70% 42%, transparent 12%, rgba(0,0,0,0.94) 30%)',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          />
        )}
        {/* geen hero-token: dit staat op de pagina zelf en niet op de heldkaart,
            en in een lichte wereld is dat romige goud dan onleesbaar */}
        <p className="eyebrow" style={{ color: 'var(--goud-tekst-dim)' }}>
          {rang.emoji} {rang.naam}
        </p>
        {/* 24 boven en 12 onder: tweeëntwintig en tien staan allebei net naast
            de maatladder, en juist in de opkomst van een gevecht moet het
            ritme kloppen omdat er verder niets afleidt */}
        {/* padding erbij: de opkomst staat in een schil zonder marge, en op een
            telefoon van 320 stond het embleem van je tegenstander vijf pixels
            van de rand. Niets hoort dichter bij de rand te komen dan de marge
            die de rest van de app aanhoudt. */}
        <div className="row" style={{ justifyContent: 'center', gap: 16, margin: '24px 0 12px', padding: '0 16px', alignItems: 'center' }}>
          <motion.div initial={{ x: kalm ? 0 : -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="col center" style={{ gap: 4, flex: '1 1 0', minWidth: 0 }}>
            <Avatar size={92} look={look} courseId={courseId} meester={meester} />
            <strong className="card-title">Jij</strong>
          </motion.div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 12 }}
            className="display hot-text"
            style={{ fontSize: 34 }}
          >
            VS
          </motion.span>
          {/* beide kanten delen de breedte gelijk: anders duwt een lange naam de
              hele rij opzij en steekt het embleem op 320 buiten beeld */}
          <motion.div
            initial={{ x: kalm ? 0 : 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="col center"
            style={{ gap: 4, flex: '1 1 0', minWidth: 0 }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                flexShrink: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                background: 'var(--paneel-diep)',
                border: '2px solid var(--line-hot)',
                boxShadow: 'var(--glow-hot)',
                overflow: 'hidden',
              }}
            >
              {schaduw ? (
                /* Een schaduw hoort er als een schaduw uit te zien: het is een
                   echt mens dat dit potje al speelde, geen poortwachter met
                   zwaarden. Zelfde personage als het jouwe, helemaal donker. */
                <span style={{ filter: 'brightness(0) opacity(0.62)', display: 'flex' }}>
                  <Avatar size={78} level={12} courseId={courseId} look={look} still />
                </span>
              ) : (
                '⚔️'
              )}
            </div>
            <strong className="card-title">{tegenstander.naam}</strong>
          </motion.div>
        </div>
        <p className="dim" style={{ fontSize: 14, marginBottom: 4 }}>
          {tegenstander.uitleg}
        </p>
        <p className="faint" style={{ fontSize: 12.5, marginBottom: 16 }}>
          Drie schilden elk. Elke fout breekt er één. Snel goed antwoorden zet {tegenstander.naam} onder druk.
        </p>
        <motion.p
          key={fase.tel}
          initial={{ scale: kalm ? 1 : 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="display gold-text num"
          style={{ fontSize: 64, lineHeight: 1 }}
        >
          {fase.tel}
        </motion.p>
        <button className="dim" style={{ minHeight: 44, fontSize: 14, marginTop: 16 }} onClick={() => { sfx('tap'); onTerug() }}>
          Toch niet, terug
        </button>
      </div>
    )
  }

  /* ---------- de uitslag ---------- */
  if (fase.naam === 'uitslag') {
    const volgende = volgendeArena(fase.bekersNa)
    const rangNa = arenaVoor(fase.bekersNa)
    return (
      <div className="shell shell--bare center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          {/* geen emoji als vervanging voor een ontwerp: je eigen personage
              juicht of staat verslagen, en dat zegt meer dan een beker */}
          <div className="center" style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar size={104} look={look} courseId={courseId} meester={meester} mode={fase.gewonnen ? 'cheer' : 'verslagen'} />
          </div>
          <h1 className="display" style={{ fontSize: 34, margin: '10px 0 4px' }}>
            {fase.gewonnen ? 'Overwinning!' : 'Nipt verloren'}
          </h1>
          <p className="dim" style={{ fontSize: 14 }}>
            {schaduw
              ? fase.gewonnen
                ? `Je versloeg de schaduw van ${tegenstander.naam} op zijn eigen vragen.`
                : `De schaduw van ${tegenstander.naam} hield stand. De revanche staat klaar.`
              : fase.gewonnen
                ? `Je sloeg ${tegenstander.naam} uit de ${rang.naam}.`
                : `${tegenstander.naam} hield één schild over. De revanche staat klaar.`}
          </p>
          <div className="card-hero" style={{ padding: 16, margin: '20px 0' }}>
            <div className="spread">
              <span style={{ fontWeight: 600, fontSize: 14 }}>Bekers</span>
              <span className="gold-text num display" style={{ fontSize: 23 }}>
                {fase.gewonnen ? `+${WINST_BEKERS}` : `-${VERLIES_BEKERS}`} → {fase.bekersNa}
              </span>
            </div>
            <div className="spread" style={{ marginTop: 8 }}>
              <span className="dim" style={{ fontSize: 12.5 }}>
                {rangNa.emoji} {rangNa.naam}
              </span>
              {volgende && (
                <span className="faint num" style={{ fontSize: 12.5 }}>
                  nog {volgende.vanaf - fase.bekersNa} tot {volgende.naam}
                </span>
              )}
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: 12, fontSize: 16, marginBottom: 8 }}
            onClick={() => {
              sfx('tap')
              geboekt.current = false
              setStilte(false)
              setMijnSchilden(SCHILDEN)
              setZijnSchilden(SCHILDEN)
              setGekozen(null)
              setVraagIdx((v) => (v + 1) % Math.max(1, vragen.length))
              setFase({ naam: 'opkomst', tel: 3 })
            }}
          >
            ⚔️ {fase.gewonnen ? 'Volgend gevecht' : 'Revanche'}
          </button>
          {uitdaging && (
            /* Hetzelfde potje dat je net speelde, als uitdaging. Je vriend
               krijgt exact jouw vragen en vecht tegen jouw opgenomen tempo,
               dus het is een gevecht en geen scorevergelijking. */
            <button
              className="btn btn-ghost"
              style={{ padding: 12, fontSize: 14, marginBottom: 8 }}
              onClick={() => {
                sfx('tap')
                const link = schaduwLink(uitdaging)
                const tekst = `Ik hield het ${vraagIdx + 1} vragen vol in de ${rang.naam} van Fluent. Vecht tegen mijn schaduw: ${link}`
                if (navigator.share) {
                  void navigator.share({ text: tekst }).catch(() => {})
                } else {
                  void navigator.clipboard?.writeText(tekst).then(
                    () => setGedeeld(true),
                    () => setGedeeld(false),
                  )
                }
              }}
            >
              🤝 {gedeeld ? 'Link gekopieerd!' : 'Daag een vriend uit'}
            </button>
          )}
          <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14 }} onClick={() => { sfx('tap'); onTerug() }}>
            Terug naar de speelhal
          </button>
        </motion.div>
      </div>
    )
  }

  /* ---------- de strijd ---------- */
  return (
    <div
      className="shell shell--bare"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', paddingBottom: 16, position: 'relative', overflow: 'hidden' }}
    >
      {/* MATCHPOINT: iemand staat op één schild. Het scherm houdt zijn adem in
          met een rode rand die traag pulseert, en zegt het er ook bij. */}
      {matchpoint && (
        <>
          <motion.div
            aria-hidden="true"
            animate={kalm ? { opacity: 0.5 } : { opacity: [0.28, 0.62, 0.28] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
              boxShadow: `inset 0 0 90px ${mijnSchilden === 1 ? 'var(--hot-50)' : 'rgba(74,222,128,0.45)'}`,
            }}
          />
          <p
            className="center num"
            style={{
              position: 'relative',
              zIndex: 2,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: mijnSchilden === 1 ? 'var(--err)' : 'var(--ok)',
              marginBottom: 0,
            }}
          >
            {mijnSchilden === 1 && zijnSchilden === 1
              ? 'Allebei één schild. Alles of niets.'
              : mijnSchilden === 1
                ? 'Nog één schild. Hou stand.'
                : 'Matchpoint. Nog één rake klap.'}
          </p>
        </>
      )}

      {/* DE SLAGWISSEL: een lichtveeg die van de aanvaller naar de ander trekt */}
      <AnimatePresence>
        {slag && !kalm && (
          <motion.div
            key={slag + Date.now()}
            aria-hidden="true"
            initial={{ x: slag === 'ik' ? '-60%' : '60%', opacity: 0 }}
            animate={{ x: slag === 'ik' ? '60%' : '-60%', opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 44,
              left: 0,
              right: 0,
              height: 46,
              zIndex: 2,
              pointerEvents: 'none',
              background:
                slag === 'ik'
                  ? 'linear-gradient(90deg, transparent, var(--cyan), transparent)'
                  : 'linear-gradient(90deg, transparent, var(--err), transparent)',
              filter: 'blur(7px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* DE STILTE: na een nederlaag valt het scherm even helemaal weg */}
      <AnimatePresence>
        {stilte && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(2, 1, 6, 0.9)', pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      {/* De stand: twee vechters, twee rijen schilden. Zijmarge erbij, want de
          arena staat in een schil zonder marge: op een telefoon van 320 stond
          het embleem van je tegenstander vijf pixels van de rand, terwijl de
          rest van de app overal zestien tot twintig aanhoudt. En 12 in plaats
          van 10 boven, want tien staat naast de maatladder. */}
      <div className="spread" style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
        <div className="row" style={{ gap: 8 }}>
          {/* je personage speelt mee: hij zakt als hij een klap krijgt en
              wiegt terwijl de ander nadenkt. Stilstaan terwijl er iets gebeurt
              maakt van een personage weer een plaatje. */}
          <Avatar
            size={40}
            look={look}
            courseId={courseId}
            meester={meester}
            mode={klap === 'ik' ? 'verslagen' : botDenkt ? 'denk' : 'idle'}
            still={!klap && !botDenkt}
          />
          <div className="col" style={{ gap: 0 }}>
            <strong style={{ fontSize: 12.5, fontWeight: 700 }}>Jij</strong>
            {schild(mijnSchilden, 'ik')}
          </div>
        </div>
        <span className="display hot-text" style={{ fontSize: 19 }}>
          VS
        </span>
        {/* De naam mag inkorten, de schilden en het embleem nooit. Op een
            telefoon van 320 duwde een lange naam als "Zilveren Sanne" het
            embleem elf pixels buiten beeld; de schilden zijn de stand van het
            gevecht en die moet je altijd volledig zien. */}
        <div className="row" style={{ gap: 8, minWidth: 0, flexShrink: 1 }}>
          <div className="col" style={{ gap: 0, alignItems: 'flex-end', minWidth: 0 }}>
            <strong
              style={{ fontSize: 12.5, fontWeight: 700, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {tegenstander.naam}
            </strong>
            {schild(zijnSchilden, 'hij')}
          </div>
          <motion.span
            animate={botDenkt && !kalm ? { rotate: [0, -8, 8, 0] } : {}}
            transition={{ duration: 0.9, repeat: botDenkt ? Infinity : 0 }}
            style={{ fontSize: 28, flexShrink: 0 }}
          >
            ⚔️
          </motion.span>
        </div>
      </div>

      {/* de vraag als slagwissel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* bewust een CSS-animatie en géén exit: de vraag mag nooit van een
            JavaScript-animatieframe afhangen, want in een achtergrondtab komt
            dat frame niet en zou het gevecht bevriezen of onzichtbaar zijn */}
        <div key={vraagIdx} className="float-in">
            <p className="eyebrow center" style={{ marginBottom: 8 }}>
              Wat is dit in het {course.name}?
            </p>
            <h2 className="display center" style={{ fontSize: 28, marginBottom: 16 }}>
              {vraag?.prompt}
            </h2>
            <div className="col" style={{ gap: 8 }}>
              {vraag?.opties.map((opt, i) => {
                const vast = gekozen !== null
                const kleur = !vast ? '' : i === vraag.juist ? 'correct' : i === gekozen ? 'wrong' : ''
                return (
                  <button key={i} className={`opt ${kleur}`} disabled={vast} onClick={() => beantwoord(i)} style={{ justifyContent: 'center', textAlign: 'center' }}>
                    {opt}
                  </button>
                )
              })}
            </div>
        </div>

        <div style={{ minHeight: 34, marginTop: 12 }} className="center">
          {botDenkt && (
            /* Wat hij voelt hoort zichtbaar te zijn. Aarzelt hij, dan weet je
               dat je hem hebt; versnelt hij, dan weet je dat hij bloed ruikt.
               Een vaste regel "denkt na" vertelt je niets over de stand. */
            <p
              className={botStemming === 'versnelt' ? 'dim' : 'faint'}
              style={{
                fontSize: 12.5,
                fontWeight: botStemming ? 600 : 400,
                color: botStemming === 'versnelt' ? 'var(--err-tekst, var(--err))' : undefined,
              }}
            >
              {botStemming === 'aarzelt'
                ? `${tegenstander.naam} aarzelt…`
                : botStemming === 'versnelt'
                  ? `${tegenstander.naam} ruikt bloed`
                  : `${tegenstander.naam} denkt na…`}
            </p>
          )}
          {melding && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="dim" style={{ fontSize: 12.5, fontWeight: 600 }}>
              {melding}
            </motion.p>
          )}
        </div>
      </div>

      <div className="center">
        <span className="faint row" style={{ fontSize: 11, gap: 4, justifyContent: 'center' }}>
          <Flag code={courseFlagCode[courseId]} size={13} /> {rang.emoji} {rang.naam} · verliezen kost hier nooit je voortgang
        </span>
      </div>
    </div>
  )
}
