import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { Course, Exercise, Lesson, UnitGuide } from '../types'
import { loadGuides, pickRule } from '../content/guides'
import { isHerhaalbaar } from '../mistakes'
import { courseProgress, totalXp, useStore } from '../store'
import { levelForXp, levelReward, levelTitle } from '../levels'
import { countryStates, courseFlagCode, type CountryState } from '../countries'
import type { CompletedGoal } from '../goals'
import type { CourseId } from '../types'
import { Flag } from '../components/Flag'
import { Avatar } from '../components/Avatar'
import { ShareButton } from '../components/ShareButton'
import { courses } from '../content'
import { sfx, speak } from '../audio'
import {
  FillEx,
  ListenEx,
  MatchEx,
  NewWordEx,
  SelectEx,
  TypeEx,
  WordBankEx,
  type EvalResult,
  type Registration,
} from './exercises'

interface Props {
  course: Course
  lesson: Lesson
  onExit: () => void
  /** Ketent door naar de volgende les zonder terug naar het startscherm */
  onNext?: (lesson: Lesson) => void
}

const GEEN_LESSEN: string[] = []

/** De zichtbare vraagtekst van een oefening — helpt bij het kiezen van de juiste regel */
function vraagTekst(ex: Exercise): string {
  switch (ex.type) {
    case 'select':
      return ex.prompt
    case 'fill':
      return `${ex.before} ${ex.after} ${ex.nl ?? ''}`
    case 'wordbank':
      return ex.target
    case 'type':
      return ex.target
    case 'listen':
      return ex.target
    default:
      return ''
  }
}

const PRAISE = ['Juist.', 'Precies.', 'Uitstekend.', 'Prachtig.', 'Zo hoort het.']
const GENTLE = ['Bijna.', 'Net niet.', 'Volgende keer.', 'Blijf scherp.']

export function LessonScreen({ course, lesson, onExit, onNext }: Props) {
  /** De unit waar deze les in zit — nodig om de juiste grammatica-gids te laden */
  const unit = useMemo(() => {
    for (const sec of course.sections)
      for (const u of sec.units) if (u.lessons.some((l) => l.id === lesson.id)) return u
    return null
  }, [course, lesson.id])

  const [guide, setGuide] = useState<UnitGuide | null>(null)
  useEffect(() => {
    let levend = true
    void loadGuides(course.id).then((g) => {
      if (levend && unit) setGuide(g[unit.id] ?? null)
    })
    return () => {
      levend = false
    }
  }, [course.id, unit])

  /** Uitleg opengeklapt bij het huidige foute antwoord */
  const [uitlegOpen, setUitlegOpen] = useState(false)

  const learnWord = useStore((s) => s.learnWord)
  const completeLesson = useStore((s) => s.completeLesson)
  const addMistake = useStore((s) => s.addMistake)
  const alreadyDone = useStore((s) => courseProgress(s, course.id).completed.includes(lesson.id))
  const completedNow = useStore((s) => s.progress[course.id]?.completed ?? GEEN_LESSEN)

  /** De eerstvolgende les die nog niet af is — voor de "nog één les"-knop */
  const nextLesson = useMemo(() => {
    for (const sec of course.sections)
      for (const u of sec.units)
        for (const l of u.lessons) if (!completedNow.includes(l.id)) return l
    return null
  }, [course, completedNow])

  const [items, setItems] = useState<Exercise[]>(() => [...lesson.exercises])
  const [idx, setIdx] = useState(0)
  /** vraagt om bevestiging voordat een halve les verloren gaat */
  const [pauze, setPauze] = useState(false)
  const [phase, setPhase] = useState<'answer' | 'feedback'>('answer')
  const [result, setResult] = useState<EvalResult | null>(null)
  const [ready, setReady] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [finished, setFinished] = useState<{
    xp: number
    /** was dubbele XP actief? dan verdient dat een eigen vermelding */
    dubbel: boolean
    perfect: boolean
    newLevel: number | null
    conquered: CountryState[]
    goalsHit: CompletedGoal[]
  } | null>(null)

  const evalRef = useRef<(() => EvalResult) | null>(null)
  const retried = useRef(new Set<Exercise>())

  const ex = items[idx]

  const register = useCallback((r: Registration) => {
    evalRef.current = r.evaluate
    setReady(r.ready)
  }, [])

  const applyResult = (r: EvalResult) => {
    setResult(r)
    setPhase('feedback')
    // na een fout of tikfout hoor je hoe het juiste antwoord klínkt — lezen
    // alleen is geen taal leren (bij goed zonder tip zou het dubbel zijn met
    // de audio die veel oefeningen zelf al afspelen)
    if (r.speakAnswer && (!r.correct || r.spellingTip)) {
      setTimeout(() => speak(r.speakAnswer ?? '', course.ttsLang), 420)
    }
    if (ex.type !== 'new') {
      if (r.correct) {
        sfx('correct')
        setCombo((c) => {
          const n = c + 1
          setMaxCombo((m) => Math.max(m, n))
          return n
        })
      } else {
        sfx('wrong')
        setCombo(0)
        setMistakes((m) => m + 1)
        // onthouden zodat je hem later gericht kunt herhalen
        const positie = lesson.exercises.indexOf(ex)
        if (positie >= 0 && isHerhaalbaar(ex)) addMistake(course.id, lesson.id, positie)
        if (!retried.current.has(ex)) {
          retried.current.add(ex)
          setItems((arr) => [...arr, ex])
        }
      }
    }
  }

  const onCheck = () => {
    if (ex.type === 'new') {
      learnWord(course.id, ex.word, ex.nl)
      advance()
      return
    }
    if (!evalRef.current) return
    applyResult(evalRef.current())
  }

  /** De regel uit de gids die het best past bij deze fout */
  const regel = useMemo(
    () => (result && !result.correct ? pickRule(guide ?? undefined, result.correctAnswer ?? '', vraagTekst(ex)) : null),
    [result, guide, ex]
  )

  const advance = () => {
    setResult(null)
    setPhase('answer')
    setUitlegOpen(false)
    setReady(false)
    evalRef.current = null
    if (idx + 1 >= items.length) {
      const perfect = mistakes === 0
      // basis 10 + foutloos-bonus + oplopende combo-bonussen (3/6/9 op rij)
      const xp = alreadyDone
        ? 5
        : 10 + (perfect ? 5 : 0) + (maxCombo >= 3 ? 1 : 0) + (maxCombo >= 6 ? 2 : 0) + (maxCombo >= 9 ? 3 : 0)
      const before = useStore.getState()
      const xpBefore = totalXp(before)
      const completedBefore = (before.progress[course.id]?.completed ?? []).length
      const goalsDoneBefore = before.goalsDone.length
      completeLesson(course.id, lesson.id, xp, perfect)
      const after = useStore.getState()
      const xpAfter = totalXp(after)
      const completedAfter = (after.progress[course.id]?.completed ?? []).length
      const levelAfter = levelForXp(xpAfter)
      setFinished({
        // wat er écht is bijgeschreven, inclusief dubbele XP, missiebonus en
        // gehaalde doelen. Zelf narekenen loog tijdens een boost: je zag +10
        // en kreeg er 20.
        xp: Math.max(0, xpAfter - xpBefore),
        dubbel: before.boostUntil > Date.now(),
        perfect,
        newLevel: levelAfter > levelForXp(xpBefore) ? levelAfter : null,
        conquered: countryStates(course, completedAfter).filter((c) => c.conquered && c.threshold > completedBefore),
        goalsHit: after.goalsDone.slice(goalsDoneBefore),
      })
      sfx('complete')
    } else {
      setIdx(idx + 1)
    }
  }

  if (finished) {
    return (
      <CompleteView
        xp={finished.xp}
        dubbel={finished.dubbel}
        perfect={finished.perfect}
        newLevel={finished.newLevel}
        conquered={finished.conquered}
        goalsHit={finished.goalsHit}
        startCode={courseFlagCode[course.id]}
        courseId={course.id}
        onDone={onExit}
        nextTitle={nextLesson?.title ?? null}
        onNext={nextLesson ? () => onNext?.(nextLesson) : undefined}
      />
    )
  }

  const progress = items.length > 0 ? idx / items.length : 0
  const restVragen = Math.max(0, items.length - idx)

  return (
    <div className="shell shell--bare" style={{ paddingBottom: 170 }}>
      {/* Vangnet: één mistik op het kruisje gooide anders een halve les weg */}
      <AnimatePresence>
        {pauze && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPauze(false)}
            style={{ zIndex: 80 }}
          >
            <motion.div
              className="modal-panel"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 110 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="display" style={{ fontSize: 24, marginBottom: 6 }}>
                Even pauze?
              </h3>
              <p className="dim" style={{ fontSize: 14.5, marginBottom: 18 }}>
                {restVragen === 1
                  ? 'Nog één vraag en je bent er. Zonde om nu te stoppen.'
                  : `Nog ${restVragen} vragen en je bent er. Je voortgang in deze les gaat verloren als je stopt.`}
              </p>
              <button
                className="btn btn-primary"
                style={{ padding: 15, fontSize: 15.5, marginBottom: 10 }}
                onClick={() => {
                  sfx('tap')
                  setPauze(false)
                }}
              >
                ▶ Doorgaan
              </button>
              <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14 }} onClick={onExit}>
                Toch stoppen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lesson-top">
        <button
          className="btn-quiet"
          style={{ padding: 8, fontSize: 22, lineHeight: 1, minWidth: 44, minHeight: 44 }}
          onClick={() => (idx > 0 ? setPauze(true) : onExit())}
          aria-label="Les sluiten"
        >
          ×
        </button>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            animate={{ width: `${Math.max(4, progress * 100)}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          />
        </div>
        <AnimatePresence>
          {combo >= 3 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="gold-text"
              style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}
            >
              ×{combo}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="lesson-body" key={idx}>
        {ex.type === 'new' && <NewWordEx ex={ex} ttsLang={course.ttsLang} locked={false} register={register} />}
        {ex.type === 'select' && <SelectEx ex={ex} ttsLang={course.ttsLang} locked={phase === 'feedback'} register={register} />}
        {ex.type === 'wordbank' && <WordBankEx ex={ex} ttsLang={course.ttsLang} locked={phase === 'feedback'} register={register} />}
        {ex.type === 'listen' && <ListenEx ex={ex} ttsLang={course.ttsLang} locked={phase === 'feedback'} register={register} />}
        {ex.type === 'type' && <TypeEx ex={ex} ttsLang={course.ttsLang} locked={phase === 'feedback'} register={register} onSubmit={onCheck} />}
        {ex.type === 'fill' && <FillEx ex={ex} ttsLang={course.ttsLang} locked={phase === 'feedback'} register={register} />}
        {ex.type === 'match' && <MatchEx ex={ex} ttsLang={course.ttsLang} onAuto={applyResult} />}
      </div>

      <div className="sheet">
        <AnimatePresence mode="wait">
          {phase === 'answer' ? (
            <motion.div key="check" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className="sheet-inner">
                {ex.type === 'match' ? (
                  <p className="center dim" style={{ padding: '8px 0', fontSize: 15 }}>
                    Match alle paren om verder te gaan
                  </p>
                ) : (
                  <button className="btn btn-primary" disabled={ex.type !== 'new' && !ready} onClick={onCheck}>
                    {ex.type === 'new' ? 'Begrepen' : 'Controleren'}
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="fb" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className={`sheet-inner ${result?.correct ? 'good' : 'bad'}`}>
                <div className="spread" style={{ marginBottom: 12 }}>
                  <div>
                    <p className={`feedback-title ${result?.correct ? 'ok-text' : 'err-text'}`}>
                      {result?.correct
                        ? PRAISE[Math.floor(Math.random() * PRAISE.length)]
                        : GENTLE[Math.floor(Math.random() * GENTLE.length)]}
                    </p>
                    {!result?.correct && result?.correctAnswer && (
                      <p className="dim" style={{ fontSize: 15 }}>
                        Juiste antwoord: <strong style={{ color: 'var(--text)' }}>{result.correctAnswer}</strong>
                      </p>
                    )}
                    {result?.correct && result?.spellingTip && (
                      <p className="dim" style={{ fontSize: 15 }}>
                        Let op de spelling: <strong style={{ color: 'var(--text)' }}>{result.spellingTip}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Waarom was dit fout? De regel uit de gids, precies op het moment dat je hem nodig hebt */}
                {!result?.correct && regel && (
                  <div style={{ marginBottom: 12 }}>
                    <AnimatePresence initial={false}>
                      {uitlegOpen ? (
                        <motion.div
                          key="uitleg"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div
                            className="glass"
                            style={{ padding: '13px 15px', background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}
                          >
                            <strong className="hot-text" style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                              💡 {regel.title}
                            </strong>
                            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-dim)' }}>{regel.explanation}</p>
                            {regel.examples.slice(0, 2).map((v, i) => (
                              <button
                                key={i}
                                className="row"
                                style={{ gap: 9, width: '100%', textAlign: 'left', padding: '7px 0', minHeight: 44 }}
                                onClick={() => {
                                  sfx('tap')
                                  speak(v.target, course.ttsLang)
                                }}
                              >
                                <span
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 8,
                                    flexShrink: 0,
                                    background: 'rgba(168,85,247,0.25)',
                                    border: '1px solid rgba(168,85,247,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 11,
                                  }}
                                >
                                  ▶
                                </span>
                                <span className="col" style={{ gap: 0, flex: 1, minWidth: 0 }}>
                                  <strong style={{ fontSize: 13.5 }}>{v.target}</strong>
                                  <span className="faint" style={{ fontSize: 12 }}>
                                    {v.nl}
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="waarom"
                          className="btn btn-ghost"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ padding: 12, fontSize: 14.5 }}
                          onClick={() => {
                            sfx('tap')
                            setUitlegOpen(true)
                          }}
                        >
                          💡 Waarom?
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <button className="btn btn-primary" onClick={advance}>
                  Verder
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- lesresultaat: stats → landverovering → level-up ---------- */

const GOLD_CONFETTI = ['#EED9A0', '#D4AF6A', '#B08D4C', '#F2ECDF']

function CompleteView({
  xp,
  dubbel,
  perfect,
  newLevel,
  conquered,
  goalsHit,
  startCode,
  courseId,
  onDone,
  nextTitle,
  onNext,
}: {
  xp: number
  dubbel: boolean
  perfect: boolean
  newLevel: number | null
  conquered: CountryState[]
  goalsHit: CompletedGoal[]
  startCode: string
  courseId: CourseId
  onDone: () => void
  /** Titel van de eerstvolgende les — leeg als er niets meer volgt */
  nextTitle?: string | null
  /** Start meteen de volgende les zonder terug naar het startscherm */
  onNext?: () => void
}) {
  const streak = useStore((s) => s.streak)
  const curLevel = useStore((s) => levelForXp(totalXp(s)))
  const look = useStore((s) => s.avatarLook)
  const todayXp = useStore((s) => s.todayXp)
  const dailyGoalXp = useStore((s) => s.dailyGoalXp)
  const goalReached = todayXp >= dailyGoalXp
  const [shown, setShown] = useState(0)
  /** het personage op het niveau-scherm, om mee te tekenen op de deelkaart */
  const figuurRef = useRef<HTMLDivElement | null>(null)

  const steps = useMemo(() => {
    const s: ('stats' | 'conquest' | 'goal' | 'level')[] = ['stats']
    if (conquered.length > 0) s.push('conquest')
    if (goalsHit.length > 0) s.push('goal')
    if (newLevel) s.push('level')
    return s
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [si, setSi] = useState(0)
  const step = steps[si]
  const next = () => (si + 1 < steps.length ? setSi(si + 1) : onDone())
  const isLastStep = si === steps.length - 1
  const canChain = isLastStep && !!onNext && !!nextTitle

  /**
   * Slotknoppen: op het laatste stapje bied je de volgende les aan in plaats van af te sluiten.
   * Bewust een functie die JSX teruggeeft (geen component): een component die binnen de render
   * wordt gedefinieerd, zou bij elke tik van de XP-teller opnieuw worden opgebouwd.
   */
  const chainFooter = (label = 'Verder') =>
    canChain ? (
      <div className="col" style={{ marginTop: 22, padding: '0 8px', gap: 10 }}>
        <motion.button
          className="btn btn-primary"
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sfx('tap')
            onNext?.()
          }}
          style={{ fontSize: 17 }}
        >
          ▶ Nog één les
        </motion.button>
        <p className="faint" style={{ fontSize: 12, marginTop: -2 }}>
          Volgende: {nextTitle}
        </p>
        <button className="btn btn-ghost" style={{ fontSize: 14.5, padding: 13 }} onClick={next}>
          Klaar voor nu
        </button>
      </div>
    ) : (
      <div style={{ marginTop: 26, padding: '0 8px' }}>
        <button className="btn btn-primary" onClick={next}>
          {label}
        </button>
      </div>
    )

  useEffect(() => {
    if (step === 'stats' && perfect) {
      confetti({ particleCount: 70, spread: 75, origin: { y: 0.7 }, colors: GOLD_CONFETTI, disableForReducedMotion: true })
    }
    if (step === 'conquest') {
      const t = setTimeout(() => {
        sfx('complete')
        confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 }, colors: GOLD_CONFETTI, disableForReducedMotion: true })
      }, 1500)
      return () => clearTimeout(t)
    }
    if (step === 'goal') {
      sfx('complete')
      confetti({ particleCount: 100, spread: 95, origin: { y: 0.6 }, colors: GOLD_CONFETTI, disableForReducedMotion: true })
    }
    if (step === 'level') {
      sfx('complete')
      confetti({ particleCount: 130, spread: 110, origin: { y: 0.6 }, colors: GOLD_CONFETTI, disableForReducedMotion: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    const stepSize = Math.max(1, Math.round(xp / 24))
    const t = setInterval(() => {
      setShown((v) => {
        if (v + stepSize >= xp) {
          clearInterval(t)
          return xp
        }
        return v + stepSize
      })
    }, 40)
    return () => clearInterval(t)
  }, [xp])

  return (
    <div className="shell shell--bare center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        {step === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar size={100} mode={perfect ? 'cheer' : 'idle'} level={curLevel} courseId={courseId} look={look} />
            </div>
            <p className="eyebrow" style={{ marginTop: 8 }}>
              Les voltooid
            </p>
            <h1 className="display" style={{ fontSize: 38, margin: '10px 0 4px' }}>
              {perfect ? 'Vlekkeloos.' : 'Goed gedaan.'}
            </h1>
            <div className="divider-gold" />
            <div className="row" style={{ justifyContent: 'center', gap: 14, marginTop: 16 }}>
              <div className="glass stat-card" style={{ minWidth: 120, borderColor: dubbel ? 'var(--line-gold)' : undefined }}>
                <div className="stat-value gold-text">+{shown}</div>
                <div className="stat-label">{dubbel ? '⚡ XP × 2' : 'XP verdiend'}</div>
              </div>
              <div className="glass stat-card" style={{ minWidth: 120 }}>
                <div className="stat-value">{streak}</div>
                <div className="stat-label">{streak === 1 ? 'dag reeks' : 'dagen reeks'}</div>
              </div>
            </div>
            {perfect && (
              <p className="gold-text" style={{ marginTop: 18, fontWeight: 600 }}>
                Foutloze les — uitzonderlijk.
              </p>
            )}

            {/* Dagdoel: laat zien hoe dichtbij je bent — dat is de motor achter "nog één les" */}
            <div className="glass" style={{ padding: '14px 16px', marginTop: 18, textAlign: 'left' }}>
              <div className="spread" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>{goalReached ? '🎉 Dagdoel gehaald!' : 'Jouw dagdoel'}</span>
                <span className={goalReached ? 'gold-text' : 'faint'} style={{ fontSize: 12.5, fontWeight: 700 }}>
                  {Math.min(todayXp, dailyGoalXp)} / {dailyGoalXp} XP
                </span>
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: `${Math.round((Math.max(0, todayXp - xp) / dailyGoalXp) * 100)}%` }}
                  animate={{ width: `${Math.min(100, Math.round((todayXp / dailyGoalXp) * 100))}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
              <p className="faint" style={{ fontSize: 12, marginTop: 8 }}>
                {goalReached
                  ? 'Je reeks is veiliggesteld voor vandaag. Alles hierna is pure winst.'
                  : `Nog ${dailyGoalXp - todayXp} XP — dat is ongeveer ${Math.max(1, Math.ceil((dailyGoalXp - todayXp) / 12))} ${
                      Math.ceil((dailyGoalXp - todayXp) / 12) === 1 ? 'les' : 'lessen'
                    }.`}
              </p>
            </div>

            {chainFooter()}
          </motion.div>
        )}

        {step === 'conquest' && (
          <motion.div key="conq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.3 }}>
            <p className="eyebrow">Nieuw gebied veroverd</p>
            <div style={{ position: 'relative', height: 140, margin: '10px 0 0', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', left: 14, bottom: 30, opacity: 0.45, lineHeight: 0 }}>
                <Flag code={startCode} size={24} />
              </span>
              <motion.span
                style={{ position: 'absolute', right: 14, bottom: 28, display: 'inline-block', lineHeight: 0 }}
                initial={{ scale: 0.7, opacity: 0.4 }}
                animate={{ scale: [0.7, 1.35, 1], opacity: 1 }}
                transition={{ delay: 1.45, duration: 0.5 }}
              >
                <Flag code={conquered[0].code} size={34} />
              </motion.span>
              <div style={{ position: 'absolute', left: 20, right: 20, bottom: 22, borderBottom: '2px dashed rgba(212,175,106,0.35)' }} />
              <motion.div
                style={{ position: 'absolute', bottom: 18, left: '50%' }}
                initial={{ x: -190 }}
                animate={{ x: 120 }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              >
                <Avatar size={86} mode="run" level={curLevel} courseId={courseId} look={look} />
              </motion.div>
            </div>
            <motion.h1
              className="display gold-text"
              style={{ fontSize: 32, margin: '8px 0 4px' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              {conquered[0].name} veroverd!
            </motion.h1>
            {conquered.length > 1 && (
              <p className="dim">+ nog {conquered.length - 1} {conquered.length - 1 === 1 ? 'gebied' : 'gebieden'}</p>
            )}
            <motion.p className="dim" style={{ fontSize: 15, marginTop: 6 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              Jij rent alvast vooruit naar het volgende land.
            </motion.p>
            <div style={{ marginTop: 16, padding: '0 8px' }}>
              <ShareButton
                label="Deel je verovering"
                kaart={{
                  icoon: '🌍',
                  waarde: conquered[0].name,
                  label: 'veroverd',
                  onderschrift: courses[courseId].name,
                  bericht: `${conquered[0].name} veroverd in ${courses[courseId].name} met Fluent!`,
                }}
              />
            </div>
            {chainFooter()}
          </motion.div>
        )}

        {step === 'goal' && goalsHit.length > 0 && (
          <motion.div key="goal" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar size={104} mode="cheer" level={curLevel} courseId={courseId} look={look} />
            </div>
            <p className="eyebrow" style={{ marginTop: 10 }}>
              Doel gehaald
            </p>
            <h1 className="display gold-text" style={{ fontSize: 30, margin: '10px 0 6px' }}>
              {goalsHit[0].label}
            </h1>
            {goalsHit[0].earlyDays > 0 && (
              <motion.p
                className="display"
                style={{ fontSize: 19, color: 'var(--ok)' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {goalsHit[0].earlyDays} {goalsHit[0].earlyDays === 1 ? 'dag' : 'dagen'} vóór je deadline.
              </motion.p>
            )}
            <p className="gold-text" style={{ fontWeight: 700, fontSize: 17, marginTop: 8 }}>
              +{goalsHit[0].rewardXp} XP beloning
            </p>
            {goalsHit.length > 1 && (
              <p className="dim" style={{ fontSize: 14, marginTop: 4 }}>
                + nog {goalsHit.length - 1} {goalsHit.length - 1 === 1 ? 'doel' : 'doelen'} gehaald
              </p>
            )}
            <div className="divider-gold" />
            {chainFooter()}
          </motion.div>
        )}

        {step === 'level' && newLevel && (
          <motion.div key="lvl" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div ref={figuurRef} style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar size={128} mode="cheer" level={newLevel} courseId={courseId} look={look} />
            </div>
            <p className="eyebrow" style={{ marginTop: 10 }}>
              Niveau omhoog
            </p>
            <h1 className="display gold-text" style={{ fontSize: 46, margin: '8px 0 2px' }}>
              Niveau {newLevel}
            </h1>
            <p className="display dim" style={{ fontSize: 21 }}>
              {levelTitle(newLevel)}
            </p>
            <div style={{ marginTop: 14 }}>
              <ShareButton
                label="Laat je personage zien"
                kaart={() => ({
                  icoon: '⭐',
                  waarde: `Niveau ${newLevel}`,
                  label: levelTitle(newLevel),
                  onderschrift: `${courses[courseId].name} · ${levelReward(courseId, newLevel) ?? 'nieuw niveau'}`,
                  bericht: `Niveau ${newLevel} gehaald in ${courses[courseId].name} met Fluent!`,
                  svg: figuurRef.current?.querySelector('svg') ?? null,
                })}
              />
            </div>
            {levelReward(courseId, newLevel) && (
              <motion.p
                className="gold-text"
                style={{ fontWeight: 700, marginTop: 10 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 16 }}
              >
                ✦ Jij verdient: {levelReward(courseId, newLevel)}
              </motion.p>
            )}
            <div className="divider-gold" />
            {chainFooter('Prachtig')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
