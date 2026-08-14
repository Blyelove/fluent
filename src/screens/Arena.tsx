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
  drukVan,
  gladiatorVoor,
  volgendeArena,
  type ArenaVraag,
  type Gladiator,
} from '../arena'
import { Avatar } from '../components/Avatar'
import { isMeester } from '../skills'
import { STANDAARD_STIJLEN, stijlUitLink } from '../stijlen'
import { courseFlagCode } from '../countries'
import { Flag } from '../components/Flag'
import { sfx, speak } from '../audio'

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

type Fase =
  | { naam: 'opkomst'; tel: number }
  | { naam: 'strijd' }
  | { naam: 'uitslag'; gewonnen: boolean; bekersNa: number }

export function ArenaScreen({ onTerug, onPlayingChange }: { onTerug: () => void; onPlayingChange?: (b: boolean) => void }) {
  const courseId = useStore((s) => s.courseId)
  const bekers = useStore((s) => s.bekers)
  const boekArena = useStore((s) => s.boekArena)
  const addMistake = useStore((s) => s.addMistake)
  const look = useStore((s) => s.avatarLook)
  const meester = useStore((s) => isMeester(s.progress[s.courseId]?.xp ?? 0))
  const opkomstStijl = useStore((s) => stijlUitLink('arena') ?? s.stijlen.arena ?? STANDAARD_STIJLEN.arena)
  const course = courses[courseId]
  const kalm = Boolean(useReducedMotion())

  const rang = arenaVoor(bekers)
  const [tegenstander] = useState<Gladiator>(() => gladiatorVoor(bekers))
  const vragen = useMemo(() => arenaVragen(course, VRAGEN_MAX), [course])

  const [fase, setFase] = useState<Fase>({ naam: 'opkomst', tel: 3 })
  const [vraagIdx, setVraagIdx] = useState(0)
  // ?matchpoint=1 start het gevecht meteen op het scherpst van de snede
  const opScherp = new URLSearchParams(window.location.search).has('matchpoint')
  const [mijnSchilden, setMijnSchilden] = useState(opScherp ? 1 : SCHILDEN)
  const [zijnSchilden, setZijnSchilden] = useState(opScherp ? 1 : SCHILDEN)
  const [gekozen, setGekozen] = useState<number | null>(null)
  const [botDenkt, setBotDenkt] = useState(false)
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
    if (gewonnen) {
      sfx('complete')
      confetti({ particleCount: 170, spread: 110, origin: { y: 0.5 }, colors: ['#FFC53D', '#FFE08A', '#FFFFFF'], disableForReducedMotion: true })
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
      later(500, () => setKlap(null))
    }

    // de tegenstander speelt zijn beurt: hij twijfelt, en jouw tempo drukt
    setBotDenkt(true)
    const druk = goed ? drukVan(ms) : 0
    const botGoed = Math.random() < Math.max(0.15, tegenstander.kans - druk)
    const denktijd = Math.max(700, tegenstander.tempo * (0.7 + Math.random() * 0.6))
    later(denktijd, () => {
      setBotDenkt(false)
      if (!botGoed) {
        sfx('correct')
        setKlap('hij')
        setZijnSchilden((s) => s - 1)
        setMelding(`${tegenstander.naam} sloeg de plank mis`)
        later(500, () => setKlap(null))
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

  const schild = (aantal: number, kant: 'ik' | 'hij') => (
    <div className="row" style={{ gap: 5 }} aria-label={`${aantal} schilden over`}>
      {Array.from({ length: SCHILDEN }, (_, i) => {
        const heel = i < aantal
        return (
          <motion.span
            key={i}
            animate={klap === kant && i === aantal ? { scale: [1, 1.5, 0.4], opacity: [1, 1, 0], rotate: [0, 12, -18] } : {}}
            transition={{ duration: 0.45 }}
            style={{ fontSize: 19, filter: heel ? 'drop-shadow(0 0 6px rgba(34,211,238,0.6))' : 'grayscale(1) opacity(0.25)' }}
          >
            🛡️
          </motion.span>
        )
      })}
    </div>
  )

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
        <div className="row" style={{ justifyContent: 'center', gap: 18, margin: '22px 0 10px', alignItems: 'center' }}>
          <motion.div initial={{ x: kalm ? 0 : -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="col center" style={{ gap: 6 }}>
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
          <motion.div initial={{ x: kalm ? 0 : 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="col center" style={{ gap: 6 }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 44,
                background: 'var(--paneel-diep)',
                border: '2px solid var(--line-hot)',
                boxShadow: 'var(--glow-hot)',
              }}
            >
              ⚔️
            </div>
            <strong className="card-title">{tegenstander.naam}</strong>
          </motion.div>
        </div>
        <p className="dim" style={{ fontSize: 13.5, marginBottom: 6 }}>
          {tegenstander.uitleg}
        </p>
        <p className="faint" style={{ fontSize: 12.5, marginBottom: 18 }}>
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
        <button className="dim" style={{ minHeight: 44, fontSize: 13.5, marginTop: 18 }} onClick={() => { sfx('tap'); onTerug() }}>
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
          <p style={{ fontSize: 64, lineHeight: 1 }}>{fase.gewonnen ? '🏆' : '🛡️'}</p>
          <h1 className="display" style={{ fontSize: 32, margin: '10px 0 4px' }}>
            {fase.gewonnen ? 'Overwinning!' : 'Nipt verloren'}
          </h1>
          <p className="dim" style={{ fontSize: 14.5 }}>
            {fase.gewonnen
              ? `Je sloeg ${tegenstander.naam} uit de ${rang.naam}.`
              : `${tegenstander.naam} hield één schild over. De revanche staat klaar.`}
          </p>
          <div className="card-hero" style={{ padding: 18, margin: '20px 0' }}>
            <div className="spread">
              <span style={{ fontWeight: 600, fontSize: 14 }}>Bekers</span>
              <span className="gold-text num display" style={{ fontSize: 24 }}>
                {fase.gewonnen ? `+${WINST_BEKERS}` : `-${VERLIES_BEKERS}`} → {fase.bekersNa}
              </span>
            </div>
            <div className="spread" style={{ marginTop: 8 }}>
              <span className="dim" style={{ fontSize: 13 }}>
                {rangNa.emoji} {rangNa.naam}
              </span>
              {volgende && (
                <span className="faint num" style={{ fontSize: 12 }}>
                  nog {volgende.vanaf - fase.bekersNa} tot {volgende.naam}
                </span>
              )}
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: 14, fontSize: 15.5, marginBottom: 10 }}
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
              boxShadow: `inset 0 0 90px ${mijnSchilden === 1 ? 'rgba(251,113,133,0.55)' : 'rgba(74,222,128,0.45)'}`,
            }}
          />
          <p
            className="center num"
            style={{
              position: 'relative',
              zIndex: 2,
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: mijnSchilden === 1 ? 'var(--err)' : 'var(--ok)',
              marginBottom: 2,
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

      {/* de stand: twee vechters, twee rijen schilden */}
      <div className="spread" style={{ padding: '10px 0 12px', borderBottom: '1px solid var(--line)' }}>
        <div className="row" style={{ gap: 9 }}>
          <Avatar size={40} look={look} courseId={courseId} meester={meester} still />
          <div className="col" style={{ gap: 2 }}>
            <strong style={{ fontSize: 13, fontWeight: 700 }}>Jij</strong>
            {schild(mijnSchilden, 'ik')}
          </div>
        </div>
        <span className="display hot-text" style={{ fontSize: 19 }}>
          VS
        </span>
        <div className="row" style={{ gap: 9 }}>
          <div className="col" style={{ gap: 2, alignItems: 'flex-end' }}>
            <strong style={{ fontSize: 13, fontWeight: 700 }}>{tegenstander.naam}</strong>
            {schild(zijnSchilden, 'hij')}
          </div>
          <motion.span
            animate={botDenkt && !kalm ? { rotate: [0, -8, 8, 0] } : {}}
            transition={{ duration: 0.9, repeat: botDenkt ? Infinity : 0 }}
            style={{ fontSize: 30 }}
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
            <h2 className="display center" style={{ fontSize: 30, marginBottom: 20 }}>
              {vraag?.prompt}
            </h2>
            <div className="col" style={{ gap: 10 }}>
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

        <div style={{ minHeight: 34, marginTop: 14 }} className="center">
          {botDenkt && (
            <p className="faint" style={{ fontSize: 12.5 }}>
              {tegenstander.naam} denkt na…
            </p>
          )}
          {melding && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="dim" style={{ fontSize: 13, fontWeight: 600 }}>
              {melding}
            </motion.p>
          )}
        </div>
      </div>

      <div className="center">
        <span className="faint row" style={{ fontSize: 11.5, gap: 6, justifyContent: 'center' }}>
          <Flag code={courseFlagCode[courseId]} size={13} /> {rang.emoji} {rang.naam} · verliezen kost hier nooit je voortgang
        </span>
      </div>
    </div>
  )
}
