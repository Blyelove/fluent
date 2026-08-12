import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { Course, Exercise, Select, TypeAnswer, Unit } from '../types'
import { courses } from '../content'
import { useStore } from '../store'
import { nextDueDate } from '../srs'
import { isHerhaalbaar, mistakeKey, resolveMistake, sorteerFouten, type MistakeRef } from '../mistakes'
import { levelForXp } from '../levels'
import { totalXp } from '../store'
import { sfx, speak } from '../audio'
import { Avatar } from '../components/Avatar'
import { FillEx, ListenEx, SelectEx, TypeEx, WordBankEx, type EvalResult, type Registration } from './exercises'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function courseVocab(course: Course): { word: string; nl: string }[] {
  const out: { word: string; nl: string }[] = []
  for (const s of course.sections)
    for (const u of s.units)
      for (const l of u.lessons)
        for (const e of l.exercises) if (e.type === 'new') out.push({ word: e.word, nl: e.nl })
  return out
}

interface Item {
  /** srs-sleutel — alleen bij herhaal-modus */
  key?: string
  /** sleutel van de bewaarde fout — alleen bij de fouten-modus */
  mistakeKey?: string
  /** waar deze oefening vandaan komt, zodat een fout in een toets ook onthouden wordt */
  lesId?: string
  exIndex?: number
  /** waar deze fout vandaan komt, om te tonen tijdens het oefenen */
  bron?: string
  ex: Exercise
}

type Mode = 'srs' | 'test' | 'fouten'

type Phase =
  | { name: 'hub' }
  | { name: 'run'; mode: Mode; items: Item[]; label: string }
  // xp = wat je écht kreeg, inclusief eventuele dubbele XP — het scherm mag
  // nooit een ander getal tonen dan wat er is bijgeschreven
  | { name: 'done'; mode: Mode; correct: number; total: number; label: string; passed: boolean; xp: number }

export function ReviewScreen() {
  const courseId = useStore((s) => s.courseId)
  const reviewWord = useStore((s) => s.reviewWord)
  const addReviewXp = useStore((s) => s.addReviewXp)
  const addTestResult = useStore((s) => s.addTestResult)
  const srs = useStore((s) => s.srs)
  const tests = useStore((s) => s.tests)
  const mistakes = useStore((s) => s.mistakes)
  const clearMistake = useStore((s) => s.clearMistake)
  const addMistake = useStore((s) => s.addMistake)
  const boostUntil = useStore((s) => s.boostUntil)
  const curLevel = useStore((s) => levelForXp(totalXp(s)))
  const look = useStore((s) => s.avatarLook)

  const course = courses[courseId]
  const [phase, setPhase] = useState<Phase>({ name: 'hub' })
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState<EvalResult | null>(null)
  const [ready, setReady] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [pickedUnits, setPickedUnits] = useState<string[]>([])
  /** vraagt om bevestiging voordat een halve sessie verloren gaat */
  const [pauze, setPauze] = useState(false)
  const evalRef = useRef<(() => EvalResult) | null>(null)

  const due = useMemo(
    () => Object.entries(srs).filter(([, e]) => e.courseId === courseId && new Date(e.card.due).getTime() <= Date.now()),
    [srs, courseId]
  )

  const allCards = useMemo(() => Object.values(srs).filter((e) => e.courseId === courseId).map((e) => e.card), [srs, courseId])

  const allUnits = useMemo(() => course.sections.flatMap((s) => s.units), [course])

  /** Jouw eigen fouten, hardnekkigste eerst, met de bijbehorende oefening erbij */
  const mijnFouten = useMemo(() => {
    const uit: { ref: MistakeRef; ex: Exercise; bron: string }[] = []
    for (const ref of sorteerFouten(mistakes.filter((m) => m.c === courseId))) {
      const gevonden = resolveMistake(course, ref)
      if (gevonden) uit.push({ ref, ex: gevonden.ex, bron: gevonden.unitTitle })
    }
    return uit
  }, [mistakes, courseId, course])

  const register = useCallback((r: Registration) => {
    evalRef.current = r.evaluate
    setReady(r.ready)
  }, [])

  const startSession = (mode: Mode, items: Item[], label: string) => {
    setIdx(0)
    setCorrectCount(0)
    setAnswered(null)
    setReady(false)
    evalRef.current = null
    setPhase({ name: 'run', mode, items, label })
  }

  const startSrs = () => {
    const pool = courseVocab(course)
    const items: Item[] = shuffle(due)
      .slice(0, 10)
      .map(([key, e]) => {
        const distractors = [
          ...new Set(
            shuffle(pool.filter((w) => w.word.toLowerCase() !== e.word.toLowerCase()))
              .slice(0, 3)
              .map((w) => w.word)
          ),
        ]
        if (e.card.reps >= 2 && distractors.length >= 2) {
          return { key, ex: { type: 'type', nl: e.nl, target: e.word } as TypeAnswer }
        }
        const options = shuffle([e.word, ...distractors])
        return { key, ex: { type: 'select', prompt: e.nl, options, correct: options.indexOf(e.word) } as Select }
      })
    startSession('srs', items, 'Herhaling')
  }

  const startFouten = () => {
    const items: Item[] = mijnFouten.slice(0, 12).map(({ ref, ex, bron }) => ({
      mistakeKey: mistakeKey(ref),
      bron,
      ex,
    }))
    if (items.length === 0) return
    startSession('fouten', items, 'Jouw fouten')
  }

  const startTest = (units: Unit[]) => {
    // herkomst meenemen (les + positie) zodat een fout in de toets ook in je foutenlijst belandt
    const eligible: { ex: Exercise; lesId: string; exIndex: number }[] = []
    for (const u of units)
      for (const l of u.lessons)
        l.exercises.forEach((e, i) => {
          if (isHerhaalbaar(e)) eligible.push({ ex: e, lesId: l.id, exIndex: i })
        })
    const items: Item[] = shuffle(eligible)
      .slice(0, 10)
      .map(({ ex, lesId, exIndex }) => ({ ex, lesId, exIndex }))
    const label = units.length === 1 ? `Toets: ${units[0].title}` : `Toets: ${units.length} onderwerpen`
    startSession('test', items, label)
  }

  const onCheck = () => {
    if (phase.name !== 'run' || !evalRef.current) return
    const r = evalRef.current()
    setAnswered(r)
    // na een fout of tikfout klinkt het juiste antwoord in de doeltaal
    if (r.speakAnswer && (!r.correct || r.spellingTip)) {
      setTimeout(() => speak(r.speakAnswer ?? '', course.ttsLang), 420)
    }
    const item = phase.items[idx]
    if (phase.mode === 'srs' && item.key) reviewWord(item.key, r.correct)
    // fout eindelijk goed? dan verdwijnt hij uit je foutenlijst
    if (phase.mode === 'fouten' && item.mistakeKey && r.correct) clearMistake(item.mistakeKey)
    // een fout in een toets telt net zo hard als een fout in een les
    if (phase.mode === 'test' && !r.correct && item.lesId !== undefined && item.exIndex !== undefined) {
      addMistake(courseId, item.lesId, item.exIndex)
    }
    if (r.correct) {
      sfx('correct')
      setCorrectCount((c) => c + 1)
    } else {
      sfx('wrong')
    }
  }

  const advance = () => {
    if (phase.name !== 'run') return
    setAnswered(null)
    setReady(false)
    evalRef.current = null
    if (idx + 1 >= phase.items.length) {
      const total = phase.items.length
      const finalCorrect = correctCount
      const dubbel = boostUntil > Date.now() ? 2 : 1
      if (phase.mode === 'srs' || phase.mode === 'fouten') {
        // fouten wegwerken levert extra op: dit is het waardevolste oefenwerk
        const xp = phase.mode === 'fouten' ? Math.max(4, finalCorrect * 4) : Math.max(2, finalCorrect * 2)
        addReviewXp(courseId, xp)
        if (phase.mode === 'fouten' && finalCorrect === total && total > 0) {
          confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors: ['#A855F7', '#EC4899', '#FFC53D', '#22D3EE'], disableForReducedMotion: true })
        }
        setPhase({ name: 'done', mode: phase.mode, correct: finalCorrect, total, label: phase.label, passed: true, xp: xp * dubbel })
      } else {
        const passed = finalCorrect >= Math.ceil(total * 0.8)
        const xp = finalCorrect * 2 + (passed ? 10 : 0)
        addReviewXp(courseId, xp)
        addTestResult({
          label: phase.label,
          score: finalCorrect,
          total,
          passed,
          day: new Date().toISOString().slice(0, 10),
        })
        if (passed) {
          confetti({ particleCount: 110, spread: 100, origin: { y: 0.6 }, colors: ['#A855F7', '#EC4899', '#FFC53D', '#22D3EE'], disableForReducedMotion: true })
        }
        setPhase({ name: 'done', mode: 'test', correct: finalCorrect, total, label: phase.label, passed, xp: xp * dubbel })
      }
      sfx('complete')
    } else {
      setIdx(idx + 1)
    }
  }

  /* ---------- hub ---------- */

  if (phase.name === 'hub') {
    const next = nextDueDate(allCards)
    const recentTests = [...tests].reverse().slice(0, 3)
    return (
      <div className="shell">
        <p className="eyebrow">Oefenen</p>
        <h1 className="display" style={{ fontSize: 30, margin: '8px 0 20px' }}>
          Train jezelf
        </h1>

        {mijnFouten.length > 0 && (
          <div className="glass" style={{ padding: 22, marginBottom: 16, borderColor: 'var(--line-hot)' }}>
            <div className="spread">
              <strong style={{ fontSize: 16 }}>🎯 Jouw fouten</strong>
              <span className="hot-text" style={{ fontWeight: 800 }}>
                {mijnFouten.length}
              </span>
            </div>
            <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 12px' }}>
              Precies de vragen waar jij op struikelde, de hardnekkigste eerst. Heb je er één goed, dan verdwijnt hij uit je lijst —
              en fouten wegwerken levert dubbele punten op.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {[...new Set(mijnFouten.map((f) => f.bron))].slice(0, 4).map((b) => (
                <span
                  key={b}
                  className="faint"
                  style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 999, border: '1px solid var(--line)' }}
                >
                  {b}
                </span>
              ))}
            </div>
            <button className="btn btn-primary" onClick={startFouten}>
              Werk je fouten weg
            </button>
          </div>
        )}

        <div className="glass" style={{ padding: 22, marginBottom: 16 }}>
          <div className="spread">
            <strong style={{ fontSize: 16 }}>🧠 Herhaling</strong>
            {due.length > 0 && <span className="gold-text" style={{ fontWeight: 800 }}>{due.length} klaar</span>}
          </div>
          <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 14px' }}>
            {due.length > 0
              ? 'Herhaal op het perfecte moment — vlak voordat je vergeet. Zo blijft alles hangen.'
              : allCards.length === 0
                ? 'Voltooi eerst een les — geleerde woorden verschijnen hier op het perfecte herhaalmoment.'
                : next
                  ? `Alles zit nog vers. Kom terug rond ${next.toLocaleDateString('nl-NL', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}.`
                  : 'Alles zit nog vers.'}
          </p>
          {due.length > 0 && (
            <button className="btn btn-primary" onClick={startSrs}>
              Start herhaling
            </button>
          )}
        </div>

        <div className="glass" style={{ padding: 22 }}>
          <strong style={{ fontSize: 16 }}>📝 Eigen toets</strong>
          <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 12px' }}>
            Kies zelf je onderwerpen, wij bouwen de toets. Haal 8 van de 10 en je slaagt: dubbele punten + bonus.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {allUnits.map((u) => {
              const on = pickedUnits.includes(u.id)
              return (
                <button
                  key={u.id}
                  className="tile"
                  style={
                    on
                      ? { background: 'rgba(168,85,247,0.25)', borderColor: 'var(--hot1)', boxShadow: '0 3px 0 rgba(126,34,206,0.6)' }
                      : undefined
                  }
                  onClick={() => {
                    sfx('tap')
                    setPickedUnits((p) => (on ? p.filter((x) => x !== u.id) : [...p, u.id]))
                  }}
                >
                  {u.icon} {u.title}
                </button>
              )
            })}
          </div>
          <button
            className="btn btn-primary"
            disabled={pickedUnits.length === 0}
            onClick={() => startTest(allUnits.filter((u) => pickedUnits.includes(u.id)))}
          >
            Genereer mijn toets
          </button>
          {recentTests.length > 0 && (
            <div style={{ marginTop: 16, borderTop: '1.5px solid var(--line)', paddingTop: 10 }}>
              <p className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>
                Laatste toetsen
              </p>
              {recentTests.map((t, i) => (
                <div className="spread" key={i} style={{ padding: '5px 0' }}>
                  <span className="dim" style={{ fontSize: 13 }}>
                    {t.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: t.passed ? 'var(--ok)' : 'var(--err)' }}>
                    {t.score}/{t.total} {t.passed ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ---------- klaar ---------- */

  if (phase.name === 'done') {
    return (
      <div className="shell center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80dvh' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar size={104} mode={phase.passed ? 'cheer' : 'idle'} level={curLevel} courseId={courseId} look={look} />
          </div>
          <p className="eyebrow" style={{ marginTop: 8 }}>
            {phase.label}
          </p>
          <h1 className="display" style={{ fontSize: 34, margin: '10px 0' }}>
            {phase.mode === 'fouten'
              ? phase.correct === phase.total
                ? 'Alles rechtgezet!'
                : 'Weer een paar minder.'
              : phase.mode === 'srs'
                ? phase.correct === phase.total
                  ? 'IJzersterk geheugen.'
                  : 'Weer wat steviger.'
                : phase.passed
                  ? 'Geslaagd!'
                  : 'Net niet — probeer opnieuw.'}
          </h1>
          <div className="divider-gold" />
          <p className="dim" style={{ fontSize: 16 }}>
            {phase.correct} van {phase.total} goed · +{phase.xp} XP
          </p>
          {phase.mode === 'fouten' && (
            <p className="faint" style={{ fontSize: 13, marginTop: 6 }}>
              {phase.correct === phase.total
                ? 'Deze vragen staan niet meer op je foutenlijst.'
                : `${phase.correct} van je fouten zijn weg. De rest komt terug tot je ze beheerst.`}
            </p>
          )}
          {phase.mode === 'test' && !phase.passed && (
            <p className="faint" style={{ fontSize: 13, marginTop: 6 }}>
              Je hebt {Math.ceil(phase.total * 0.8)} goede antwoorden nodig om te slagen.
            </p>
          )}
          <div style={{ marginTop: 32 }}>
            <button className="btn btn-primary" onClick={() => setPhase({ name: 'hub' })}>
              Klaar
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  /* ---------- sessie ---------- */

  const item = phase.items[idx]
  const ex = item.ex

  const restVragen = Math.max(0, phase.items.length - idx)

  return (
    <div className="shell shell--bare" style={{ paddingBottom: 170 }}>
      {/* zelfde vangnet als in een les: nooit stilzwijgend je werk weggooien */}
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
                  : `Nog ${restVragen} vragen en je bent er. Stop je nu, dan telt deze sessie niet mee.`}
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
              <button
                className="btn btn-ghost"
                style={{ padding: 12, fontSize: 14 }}
                onClick={() => {
                  setPauze(false)
                  setPhase({ name: 'hub' })
                }}
              >
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
          onClick={() => (idx > 0 ? setPauze(true) : setPhase({ name: 'hub' }))}
          aria-label="Stoppen"
        >
          ×
        </button>
        <span className="eyebrow" style={{ whiteSpace: 'nowrap' }}>
          {phase.mode === 'srs' ? 'Herhaling' : phase.mode === 'fouten' ? 'Jouw fouten' : 'Toets'}
        </span>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            animate={{ width: `${Math.max(4, (idx / phase.items.length) * 100)}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          />
        </div>
        <span className="faint" style={{ fontSize: 13, fontWeight: 700 }}>
          {idx + 1}/{phase.items.length}
        </span>
      </div>

      <div className="lesson-body" key={idx}>
        {ex.type === 'select' && <SelectEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
        {ex.type === 'type' && <TypeEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
        {ex.type === 'wordbank' && <WordBankEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
        {ex.type === 'listen' && <ListenEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
        {ex.type === 'fill' && <FillEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
      </div>

      <div className="sheet">
        <AnimatePresence mode="wait">
          {answered === null ? (
            <motion.div key="check" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className="sheet-inner">
                <button className="btn btn-primary" disabled={!ready} onClick={onCheck}>
                  Controleren
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="fb" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className={`sheet-inner ${answered.correct ? 'good' : 'bad'}`}>
                <p className={`feedback-title ${answered.correct ? 'ok-text' : 'err-text'}`} style={{ marginBottom: 10 }}>
                  {answered.correct
                    ? phase.mode === 'fouten'
                      ? 'Rechtgezet!'
                      : phase.mode === 'srs'
                        ? 'Onthouden.'
                        : 'Goed!'
                    : phase.mode === 'fouten'
                      ? 'Deze houden we nog even vast.'
                      : phase.mode === 'srs'
                        ? 'Deze komt sneller terug.'
                        : 'Helaas.'}
                </p>
                {!answered.correct && answered.correctAnswer && (
                  <p className="dim" style={{ fontSize: 15, marginBottom: 10, marginTop: -6 }}>
                    Juiste antwoord: <strong style={{ color: 'var(--text)' }}>{answered.correctAnswer}</strong>
                  </p>
                )}
                {answered.correct && answered.spellingTip && (
                  <p className="dim" style={{ fontSize: 15, marginBottom: 10, marginTop: -6 }}>
                    Let op de spelling: <strong style={{ color: 'var(--text)' }}>{answered.spellingTip}</strong>
                  </p>
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
