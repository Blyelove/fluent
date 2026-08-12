import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { Course, Exercise } from '../types'
import type { CountryState } from '../countries'
import { isHerhaalbaar } from '../mistakes'
import { useStore } from '../store'
import { sfx, speak } from '../audio'
import { Avatar } from '../components/Avatar'
import { Flag } from '../components/Flag'
import { Gatekeeper } from '../components/Gatekeeper'
import { ShareButton } from '../components/ShareButton'
import { levelForXp } from '../levels'
import { totalXp } from '../store'
import { FillEx, ListenEx, SelectEx, TypeEx, WordBankEx, type EvalResult, type Registration } from './exercises'

/**
 * De Grensproef: de eindbaas van een veroverd land.
 *
 * Puur glorie. Je kunt hier niets verliezen — geen XP, geen reeks, geen
 * verovering. Winnen levert een paspoortstempel en 40 XP op; verliezen kost
 * niets en je mag meteen opnieuw. Daarmee blijft de nooit-straffen-regel heel,
 * terwijl er wel iets op het spel staat: je eer.
 */

const VRAGEN = 10
const NODIG = 8

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Alle oefeningen uit de lessen tot aan de drempel van dit land */
function proefPool(course: Course, drempel: number): Exercise[] {
  const uit: Exercise[] = []
  let n = 0
  for (const s of course.sections)
    for (const u of s.units)
      for (const l of u.lessons) {
        if (n >= drempel) return uit
        n++
        for (const e of l.exercises) if (isHerhaalbaar(e) && e.type !== 'match') uit.push(e)
      }
  return uit
}

type Fase = 'intro' | 'strijd' | 'uitslag'

export function GrensproefScreen({
  course,
  land,
  onKlaar,
}: {
  course: Course
  land: CountryState
  onKlaar: () => void
}) {
  const awardXp = useStore((s) => s.awardXp)
  const zetStempel = useStore((s) => s.zetStempel)
  const look = useStore((s) => s.avatarLook)
  const level = useStore((s) => levelForXp(totalXp(s)))

  const [fase, setFase] = useState<Fase>('intro')
  const [idx, setIdx] = useState(0)
  const [goed, setGoed] = useState(0)
  const [antwoord, setAntwoord] = useState<EvalResult | null>(null)
  const [klaar, setKlaar] = useState(false)
  const [spot, setSpot] = useState(false)
  const evalRef = useRef<(() => EvalResult) | null>(null)

  const items = useMemo(() => shuffle(proefPool(course, land.threshold)).slice(0, VRAGEN), [course, land.threshold, fase])
  const ex = items[idx]
  const gewonnen = goed >= NODIG

  const register = useCallback((r: Registration) => {
    evalRef.current = r.evaluate
    setKlaar(r.ready)
  }, [])

  const controleer = () => {
    if (antwoord !== null || !evalRef.current) return
    const r = evalRef.current()
    setAntwoord(r)
    if (r.correct) {
      setGoed((g) => g + 1)
      sfx('correct')
    } else {
      // hij lacht je uit, maar je verliest niets
      setSpot(true)
      window.setTimeout(() => setSpot(false), 600)
      sfx('wrong')
      if (r.speakAnswer) window.setTimeout(() => speak(r.speakAnswer ?? '', course.ttsLang), 420)
    }
  }

  const verder = () => {
    if (antwoord === null) return
    setAntwoord(null)
    setKlaar(false)
    evalRef.current = null
    if (idx + 1 >= items.length) {
      setFase('uitslag')
      return
    }
    setIdx(idx + 1)
  }

  // de beloning valt één keer, bij het bereiken van de uitslag
  const uitbetaald = useRef(false)
  useEffect(() => {
    if (fase !== 'uitslag' || uitbetaald.current) return
    uitbetaald.current = true
    if (goed >= NODIG) {
      zetStempel(course.id, land.code)
      awardXp(40)
      sfx('complete')
      confetti({
        particleCount: 170,
        spread: 110,
        startVelocity: 40,
        origin: { y: 0.55 },
        colors: ['#FFC53D', '#A855F7', '#EC4899', '#22D3EE', '#FFFFFF'],
        disableForReducedMotion: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase])

  const opnieuw = () => {
    uitbetaald.current = false
    setIdx(0)
    setGoed(0)
    setAntwoord(null)
    setKlaar(false)
    evalRef.current = null
    setFase('strijd')
  }

  /* ---------------- intro ---------------- */

  if (fase === 'intro') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'var(--bg)', overflowY: 'auto' }}>
        <div className="shell center" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div initial={{ y: -260, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Gatekeeper code={land.code} size={150} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className="eyebrow" style={{ marginTop: 18 }}>
              De Grensproef
            </p>
            <h1 className="display" style={{ fontSize: 32, margin: '8px 0 6px' }}>
              De poort van {land.name}
            </h1>
            <p className="dim" style={{ fontSize: 15, maxWidth: 320, margin: '0 auto 6px' }}>
              Tien vragen uit alles wat je tot hier leerde. Acht goed en de poort zwaait open.
            </p>
            <p className="gold-text" style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 26 }}>
              Verliezen bestaat niet: je kunt hier alleen iets winnen.
            </p>
            <button className="btn btn-primary" style={{ padding: 15, fontSize: 15.5 }} onClick={() => { sfx('tap'); setFase('strijd') }}>
              ⚔️ Neem de proef
            </button>
            <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14, marginTop: 10 }} onClick={onKlaar}>
              Nog even niet
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  /* ---------------- uitslag ---------------- */

  if (fase === 'uitslag') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'var(--bg)', overflowY: 'auto' }}>
        <div className="shell center" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {gewonnen ? (
            <>
              {/* de poort gaat open: twee deuren schuiven opzij */}
              <div style={{ position: 'relative', height: 130, marginBottom: 10, overflow: 'hidden' }}>
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: '-110%' }}
                  transition={{ delay: 0.25, duration: 0.9, ease: 'easeInOut' }}
                  style={{ position: 'absolute', inset: '0 50% 0 0', background: 'linear-gradient(90deg,#1A1533,#2A2440)', borderRight: '2px solid var(--gold)' }}
                />
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: '110%' }}
                  transition={{ delay: 0.25, duration: 0.9, ease: 'easeInOut' }}
                  style={{ position: 'absolute', inset: '0 0 0 50%', background: 'linear-gradient(270deg,#1A1533,#2A2440)', borderLeft: '2px solid var(--gold)' }}
                />
                <div className="center" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar size={104} mode="cheer" level={level} courseId={course.id} look={look} />
                </div>
              </div>
              <p className="eyebrow">Poort geopend</p>
              <h1 className="display gold-text" style={{ fontSize: 34, margin: '8px 0 4px' }}>
                {land.name} doorstaan
              </h1>
              <p className="dim" style={{ fontSize: 15 }}>
                {goed} van de {items.length} goed. De Poortwachter buigt.
              </p>
              <motion.div
                initial={{ scale: 2.2, rotate: -14, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 12 }}
                style={{
                  margin: '22px auto',
                  width: 118,
                  height: 118,
                  borderRadius: '50%',
                  border: '3px dashed var(--gold)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <Flag code={land.code} size={30} />
                <span className="gold-text" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em' }}>
                  {land.name.toUpperCase().slice(0, 12)}
                </span>
              </motion.div>
              <p className="gold-text display" style={{ fontSize: 20, marginBottom: 20 }}>
                +40 XP · stempel verdiend
              </p>
              <ShareButton
                label="Deel je Grensproef"
                kaart={{
                  icoon: '🏅',
                  waarde: land.name,
                  label: 'Grensproef doorstaan',
                  onderschrift: `${course.name} · ${goed}/${items.length} goed`,
                  bericht: `Ik heb de Grensproef van ${land.name} doorstaan in Fluent!`,
                }}
              />
              <button className="btn btn-primary" style={{ padding: 15, fontSize: 15.5, marginTop: 10 }} onClick={onKlaar}>
                Reis verder →
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Gatekeeper code={land.code} size={130} pantser={8 - goed} />
              </div>
              <p className="eyebrow" style={{ marginTop: 16 }}>
                De poort blijft dicht
              </p>
              <h1 className="display" style={{ fontSize: 28, margin: '8px 0 6px' }}>
                Nog {NODIG - goed} {NODIG - goed === 1 ? 'raak antwoord' : 'rake antwoorden'}
              </h1>
              <p className="dim" style={{ fontSize: 15, maxWidth: 300, margin: '0 auto 24px' }}>
                Je haalde er {goed} van de {items.length}. Er is niets verloren gegaan: probeer het zo vaak als je wilt.
              </p>
              <button className="btn btn-primary" style={{ padding: 15, fontSize: 15.5 }} onClick={opnieuw}>
                ↻ Nog een ronde
              </button>
              <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14, marginTop: 10 }} onClick={onKlaar}>
                Terug naar de kaart
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  /* ---------------- het gevecht ---------------- */

  if (!ex) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'var(--bg)' }}>
        <div className="shell center" style={{ paddingTop: 60 }}>
          <p className="dim" style={{ marginBottom: 18 }}>Er zijn nog te weinig vragen voor deze proef.</p>
          <button className="btn btn-primary" onClick={onKlaar}>Terug</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'var(--bg)', overflowY: 'auto' }}>
      <div className="shell shell--bare" style={{ paddingBottom: 180 }}>
        <div className="lesson-top" style={{ marginBottom: 10 }}>
          <button
            className="btn-quiet"
            style={{ minWidth: 44, minHeight: 44, fontSize: 21, lineHeight: 1 }}
            onClick={onKlaar}
            aria-label="Proef verlaten"
          >
            ×
          </button>
          <span className="eyebrow" style={{ whiteSpace: 'nowrap' }}>
            Vraag {idx + 1}/{items.length}
          </span>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              animate={{ width: `${Math.max(4, ((idx + (antwoord ? 1 : 0)) / items.length) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            />
          </div>
          <span className="gold-text" style={{ fontSize: 13, fontWeight: 800 }}>
            {goed}/{NODIG}
          </span>
        </div>

        {/* de baas kijkt mee: zijn pantser slinkt met elk goed antwoord */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <Gatekeeper code={land.code} size={92} pantser={Math.max(0, 8 - goed)} spot={spot} />
        </div>

        <div className="lesson-body" key={idx}>
          {ex.type === 'select' && <SelectEx ex={ex} ttsLang={course.ttsLang} locked={antwoord !== null} register={register} onSubmit={controleer} />}
          {ex.type === 'type' && <TypeEx ex={ex} ttsLang={course.ttsLang} locked={antwoord !== null} register={register} onSubmit={controleer} />}
          {ex.type === 'wordbank' && <WordBankEx ex={ex} ttsLang={course.ttsLang} locked={antwoord !== null} register={register} />}
          {ex.type === 'listen' && <ListenEx ex={ex} ttsLang={course.ttsLang} locked={antwoord !== null} register={register} />}
          {ex.type === 'fill' && <FillEx ex={ex} ttsLang={course.ttsLang} locked={antwoord !== null} register={register} />}
        </div>

        <div className="sheet">
          <AnimatePresence mode="wait">
            {antwoord === null ? (
              <motion.div key="check" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.18 }}>
                <div className="sheet-inner">
                  <button className="btn btn-primary" disabled={!klaar} onClick={controleer}>
                    Controleren
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="fb" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.18 }}>
                <div className={`sheet-inner ${antwoord.correct ? 'good' : 'bad'}`}>
                  <p className={`feedback-title ${antwoord.correct ? 'ok-text' : 'err-text'}`} style={{ marginBottom: 10 }}>
                    {antwoord.correct ? 'Pantser eraf!' : 'Hij houdt stand.'}
                  </p>
                  {!antwoord.correct && antwoord.correctAnswer && (
                    <p className="dim" style={{ fontSize: 15, marginBottom: 10, marginTop: -6 }}>
                      Juiste antwoord: <strong style={{ color: 'var(--text)' }}>{antwoord.correctAnswer}</strong>
                    </p>
                  )}
                  {antwoord.correct && antwoord.spellingTip && (
                    <p className="dim" style={{ fontSize: 15, marginBottom: 10, marginTop: -6 }}>
                      Let op de spelling: <strong style={{ color: 'var(--text)' }}>{antwoord.spellingTip}</strong>
                    </p>
                  )}
                  <button className="btn btn-primary" onClick={verder}>
                    {idx + 1 === items.length ? 'Naar de uitslag' : 'Volgende vraag'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
