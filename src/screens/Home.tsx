import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Course, Lesson, Unit } from '../types'
import { courseList, courses } from '../content'
import { totalXp, useStore } from '../store'
import { isDue } from '../srs'
import { countryStates, courseFlagCode, totalLessons } from '../countries'
import { levelProgress, levelTitle, nextReward } from '../levels'
import { addDaysStr, daysUntil, goalStatus, suggestGoals, todayStr } from '../goals'
import { Flag } from '../components/Flag'
import { Avatar } from '../components/Avatar'
import { sfx } from '../audio'

interface Props {
  onStartLesson: (course: Course, lesson: Lesson) => void
  onReview: () => void
}

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z" />
  </svg>
)

const FlameIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2s1 3.5-1.5 6C8 10.5 6 12.5 6 15.5A6 6 0 0 0 12 21.5a6 6 0 0 0 6-6c0-2-1-3.5-2-5-0.5 1-1.5 1.8-2.5 2 0.5-2.5-0.5-7-1.5-10.5z" />
  </svg>
)

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const r = 15
  const c = 2 * Math.PI * r
  const frac = Math.min(1, value / goal)
  return (
    <div className="row" style={{ gap: 8 }}>
      <svg width="38" height="38" viewBox="0 0 38 38">
        <circle cx="19" cy="19" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <motion.circle
          cx="19"
          cy="19"
          r={r}
          fill="none"
          stroke="url(#goldgrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - frac) }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
          transform="rotate(-90 19 19)"
        />
        <defs>
          <linearGradient id="goldgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EED9A0" />
            <stop offset="100%" stopColor="#B08D4C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="col">
        <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{value}</span>
        <span className="faint" style={{ fontSize: 11 }}>
          / {goal} XP
        </span>
      </div>
    </div>
  )
}

export function HomeScreen({ onStartLesson, onReview }: Props) {
  const courseId = useStore((s) => s.courseId)
  const setCourse = useStore((s) => s.setCourse)
  const streak = useStore((s) => s.streak)
  const todayXp = useStore((s) => s.todayXp)
  const todayDay = useStore((s) => s.todayDay)
  const dailyGoalXp = useStore((s) => s.dailyGoalXp)
  const progressMap = useStore((s) => s.progress)
  const srs = useStore((s) => s.srs)
  const xpAll = useStore((s) => totalXp(s))
  const todayLessonsRaw = useStore((s) => s.todayLessons)
  const todayPerfectRaw = useStore((s) => s.todayPerfect)
  const questBonusDay = useStore((s) => s.questBonusDay)
  const goals = useStore((s) => s.goals)
  const goalsDoneCount = useStore((s) => s.goalsDone.length)
  const look = useStore((s) => s.avatarLook)
  const addGoal = useStore((s) => s.addGoal)
  const removeGoal = useStore((s) => s.removeGoal)
  const [picker, setPicker] = useState(false)
  const [goalModal, setGoalModal] = useState(false)

  const course = courses[courseId]
  const completed = useMemo(() => progressMap[courseId]?.completed ?? [], [progressMap, courseId])
  const due = useMemo(
    () => Object.entries(srs).filter(([, e]) => e.courseId === courseId && isDue(e.card)),
    [srs, courseId]
  )
  const today = new Date()
  const isToday =
    todayDay ===
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const xpShown = isToday ? todayXp : 0

  const flat = useMemo(() => {
    const list: { unit: Unit; lesson: Lesson }[] = []
    for (const section of course.sections) for (const unit of section.units) for (const lesson of unit.lessons) list.push({ unit, lesson })
    return list
  }, [course])

  const currentIdx = useMemo(() => {
    const i = flat.findIndex(({ lesson }) => !completed.includes(lesson.id))
    return i === -1 ? flat.length : i
  }, [flat, completed])

  const activeSection = useMemo(() => {
    let count = 0
    for (const s of course.sections) {
      const n = s.units.reduce((sum, u) => sum + u.lessons.length, 0)
      if (currentIdx < count + n) return s
      count += n
    }
    return course.sections[course.sections.length - 1]
  }, [course, currentIdx])

  return (
    <div className="shell">
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />
      <header className="spread" style={{ marginBottom: 22 }}>
        <button className="row glass" style={{ gap: 8, padding: '8px 14px', borderRadius: 999 }} onClick={() => setPicker(true)}>
          <Flag code={courseFlagCode[courseId]} size={17} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>{course.name}</span>
          <span className="faint" style={{ fontSize: 11 }}>
            ▾
          </span>
        </button>
        <div className="row" style={{ gap: 16 }}>
          <div className="row" style={{ gap: 5, color: streak > 0 ? 'var(--gold-bright)' : 'var(--text-faint)' }}>
            <span className={streak > 0 ? 'flame-active' : ''} style={{ lineHeight: 0 }}>
              <FlameIcon />
            </span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{streak}</span>
          </div>
          <GoalRing value={xpShown} goal={dailyGoalXp} />
        </div>
      </header>

      {(() => {
        const lp = levelProgress(xpAll)
        const nr = nextReward(courseId, lp.level)
        return (
          <div className="glass" style={{ padding: '10px 16px', marginBottom: 16 }}>
            <div className="row" style={{ gap: 14 }}>
              <Avatar size={56} level={lp.level} courseId={courseId} look={look} />
              <div style={{ flex: 1 }}>
                <div className="spread">
                  <strong style={{ fontSize: 14 }}>
                    Niveau {lp.level} · {levelTitle(lp.level)}
                  </strong>
                  <span className="gold-text" style={{ fontWeight: 700, fontSize: 13 }}>
                    {xpAll} XP totaal
                  </span>
                </div>
                <div className="progress-track" style={{ height: 6, margin: '7px 0 5px' }}>
                  <div className="progress-fill" style={{ width: `${Math.max(3, Math.round(lp.frac * 100))}%` }} />
                </div>
                <p className="faint" style={{ fontSize: 11 }}>
                  Nog {lp.needed - lp.current} XP tot niveau {lp.level + 1}
                  {nr ? ` · bij niveau ${nr.level} verdien jij: ${nr.item}` : ''}
                </p>
              </div>
            </div>
          </div>
        )
      })()}

      <h1 className="display" style={{ fontSize: 26, marginBottom: 4 }}>
        {activeSection.title}
      </h1>
      <p className="dim" style={{ fontSize: 14, marginBottom: 20 }}>
        CEFR-niveau {activeSection.cefr} · {completed.length} van {flat.length} lessen voltooid
      </p>

      {(() => {
        const lessonsToday = isToday ? todayLessonsRaw : 0
        const perfectToday = isToday ? todayPerfectRaw : 0
        const quests = [
          { label: `Verdien ${dailyGoalXp} XP`, done: xpShown >= dailyGoalXp, frac: Math.min(1, xpShown / dailyGoalXp) },
          { label: 'Voltooi 2 lessen', done: lessonsToday >= 2, frac: Math.min(1, lessonsToday / 2) },
          { label: 'Speel een foutloze les', done: perfectToday >= 1, frac: perfectToday >= 1 ? 1 : 0 },
        ]
        const doneCount = quests.filter((q) => q.done).length
        const bonusIn = questBonusDay !== null && isToday && questBonusDay === todayDay
        return (
          <div className="glass unit-card">
            <div className="spread">
              <strong style={{ fontSize: 15 }}>⚜️ Dagelijkse missies</strong>
              <span className="gold-text" style={{ fontWeight: 700, fontSize: 14 }}>
                {doneCount} / 3
              </span>
            </div>
            <div className="col" style={{ gap: 10, marginTop: 14 }}>
              {quests.map((q) => (
                <div className="row" key={q.label} style={{ gap: 10 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      background: q.done ? 'var(--grad-gold)' : 'var(--surface-2)',
                      color: q.done ? 'var(--ink-on-gold)' : 'var(--text-faint)',
                      border: q.done ? 'none' : '1px solid var(--line)',
                    }}
                  >
                    {q.done ? '✓' : ''}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: q.done ? 'var(--text)' : 'var(--text-dim)' }}>
                    {q.label}
                  </span>
                  <div className="progress-track" style={{ height: 5, width: 64, flex: 'none' }}>
                    <div className="progress-fill" style={{ width: `${Math.round(q.frac * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className={bonusIn ? 'gold-text' : 'faint'} style={{ fontSize: 12, fontWeight: bonusIn ? 700 : 500, marginTop: 12 }}>
              {bonusIn ? '✦ Bonuskist binnen: +15 XP verdiend!' : 'Voltooi alle drie voor een bonuskist van +15 XP'}
            </p>
          </div>
        )
      })()}

      {(() => {
        const ctx = {
          streak,
          totalXp: xpAll,
          completedByCourse: (cid: (typeof courseList)[number]['id']) => (progressMap[cid]?.completed ?? []).length,
        }
        return (
          <div className="glass unit-card">
            <div className="spread">
              <strong style={{ fontSize: 15 }}>🎯 Jouw doelen</strong>
              <span className="faint" style={{ fontSize: 13 }}>
                {goalsDoneCount} gehaald
              </span>
            </div>
            {goals.length === 0 && (
              <p className="dim" style={{ fontSize: 13, marginTop: 10 }}>
                Stel jezelf een doel mét deadline. Wie een doel stelt, haalt het vaker — en meestal eerder.
              </p>
            )}
            <div className="col" style={{ gap: 14, marginTop: 12 }}>
              {goals.map((g) => {
                const st = goalStatus(g, ctx)
                const left = daysUntil(g.deadline)
                return (
                  <div key={g.id}>
                    <div className="spread" style={{ marginBottom: 5 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{g.label}</span>
                      <span className="row" style={{ gap: 6 }}>
                        <span
                          style={{
                            fontSize: 12,
                            color: left < 0 ? 'var(--err)' : left <= 1 ? 'var(--gold-bright)' : 'var(--text-faint)',
                            fontWeight: left <= 1 ? 700 : 500,
                          }}
                        >
                          {left > 1 ? `nog ${left} dagen` : left === 1 ? 'nog 1 dag!' : left === 0 ? 'vandaag!' : 'deadline voorbij'}
                        </span>
                        <button
                          className="btn-quiet"
                          style={{ padding: '0 4px', fontSize: 13, lineHeight: 1 }}
                          onClick={() => removeGoal(g.id)}
                          aria-label="Doel verwijderen"
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                    <div className="row" style={{ gap: 10 }}>
                      <div className="progress-track" style={{ height: 6 }}>
                        <div className="progress-fill" style={{ width: `${Math.max(3, Math.round(st.frac * 100))}%` }} />
                      </div>
                      <span className="faint" style={{ fontSize: 11, flex: 'none' }}>
                        {st.current}/{st.target}
                      </span>
                      <span className="gold-text" style={{ fontSize: 11, fontWeight: 700, flex: 'none' }}>
                        +{g.rewardXp} XP
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            {goals.length < 3 && (
              <button className="btn btn-ghost" style={{ marginTop: 14, padding: 12, fontSize: 14 }} onClick={() => setGoalModal(true)}>
                + Doel stellen
              </button>
            )}
          </div>
        )
      })()}

      {due.length > 0 && (
        <motion.button
          className="glass spread"
          style={{ width: '100%', padding: '16px 18px', marginBottom: 18, borderColor: 'var(--line-gold)', textAlign: 'left' }}
          whileTap={{ scale: 0.98 }}
          onClick={onReview}
        >
          <div className="col" style={{ gap: 2 }}>
            <strong style={{ fontSize: 15 }}>Herhaling staat klaar</strong>
            <span className="dim" style={{ fontSize: 13 }}>
              {due.length} {due.length === 1 ? 'woord wacht' : 'woorden wachten'} op je geheugen
            </span>
          </div>
          <span className="gold-text" style={{ fontSize: 22, fontWeight: 700 }}>
            ↻
          </span>
        </motion.button>
      )}

      {(() => {
        const world = countryStates(course, completed.length)
        const conqueredCount = world.filter((c) => c.conquered).length
        const target = world.find((c) => !c.conquered)
        return (
          <div className="glass unit-card">
            <div className="spread">
              <strong style={{ fontSize: 15 }}>🌍 Wereldverovering</strong>
              <span className="gold-text" style={{ fontWeight: 700, fontSize: 14 }}>
                {conqueredCount} / {world.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {world.map((c) => (
                <span
                  key={c.name}
                  className={c.conquered ? 'flag-conquered' : ''}
                  title={c.conquered ? `${c.name} — veroverd` : `${c.name} — na ${c.threshold} lessen`}
                  style={{
                    opacity: c.conquered ? 1 : 0.25,
                    filter: c.conquered ? undefined : 'grayscale(0.8)',
                    transition: 'opacity 0.3s ease',
                    lineHeight: 0,
                  }}
                >
                  <Flag code={c.code} size={21} />
                </span>
              ))}
            </div>
            {target ? (
              <div style={{ marginTop: 14 }}>
                <div className="spread" style={{ marginBottom: 6 }}>
                  <span className="dim row" style={{ fontSize: 13, gap: 6 }}>
                    Volgende: <Flag code={target.code} size={14} /> {target.name}
                  </span>
                  <span className="faint" style={{ fontSize: 12 }}>
                    {target.inCourse
                      ? `nog ${Math.max(0, target.threshold - completed.length)} ${target.threshold - completed.length === 1 ? 'les' : 'lessen'}`
                      : 'komt met nieuwe lessen'}
                  </span>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${Math.min(100, (completed.length / target.threshold) * 100)}%` }} />
                </div>
              </div>
            ) : (
              <p className="gold-text" style={{ fontSize: 13, fontWeight: 600, marginTop: 12 }}>
                De hele {course.name}talige wereld is van jou. Meesterlijk.
              </p>
            )}
          </div>
        )
      })()}

      {(() => {
        const UNIT_COLORS = ['#FFB300', '#FF5C8A', '#22D3EE', '#A3E635', '#A855F7', '#FF8A3D']
        let gi = 0
        let ui = 0
        const elements: ReactNode[] = []
        for (const section of course.sections) {
          elements.push(
            <div key={section.title} className="center" style={{ margin: '38px 0 0', position: 'relative', zIndex: 1 }}>
              <p
                className="eyebrow"
                style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  borderRadius: 999,
                  border: '1.5px solid var(--line)',
                  background: 'rgba(23, 18, 51, 0.92)',
                }}
              >
                {section.title} · {section.cefr}
              </p>
            </div>
          )
          for (const unit of section.units) {
          const uc = UNIT_COLORS[ui % UNIT_COLORS.length]
          ui++
          const doneCount = unit.lessons.filter((l) => completed.includes(l.id)).length
          const unitDone = doneCount === unit.lessons.length
          const containsCurrent = currentIdx >= gi && currentIdx < gi + unit.lessons.length
          elements.push(
            <div
              className={`unit-banner ${unitDone ? 'unit-banner-done' : ''} ${containsCurrent ? 'unit-banner-active' : ''}`}
              key={unit.id}
              style={{ '--uc': uc } as CSSProperties}
            >
              <span style={{ fontSize: 22 }}>{unit.icon}</span>
              <strong style={{ flex: 1, fontSize: 15 }}>{unit.title}</strong>
              <span style={{ fontSize: 13, fontWeight: 700 }} className={unitDone ? '' : 'faint'}>
                {unitDone ? '✓ Voltooid' : `${doneCount}/${unit.lessons.length}`}
              </span>
            </div>
          )
          const unitFirstIncomplete = unit.lessons.find((l) => !completed.includes(l.id))?.id ?? null
          for (const lesson of unit.lessons) {
            const idxHere = gi
            // vrij beginnen per onderwerp: de eerste onvoltooide les van elke unit is altijd open
            const state = completed.includes(lesson.id)
              ? 'done'
              : lesson.id === unitFirstIncomplete
                ? idxHere === currentIdx
                  ? 'current'
                  : 'open'
                : 'locked'
            const offset = [0, 58, 0, -58][idxHere % 4]
            elements.push(
              <div
                key={lesson.id}
                style={{ display: 'flex', justifyContent: 'center', transform: `translateX(${offset}px)`, margin: '22px 0', position: 'relative', zIndex: 1 }}
              >
                <button
                  className={`node-big ${state}`}
                  title={lesson.title}
                  style={{ '--uc': uc } as CSSProperties}
                  onClick={() => {
                    if (state === 'locked') {
                      sfx('tap')
                      return
                    }
                    onStartLesson(course, lesson)
                  }}
                >
                  {state === 'current' && <span className="start-label">Start</span>}
                  {state === 'done' ? <span style={{ fontSize: 24, fontWeight: 800 }}>✓</span> : <StarIcon filled={state === 'current'} />}
                </button>
              </div>
            )
            gi++
          }
          }
        }
        return (
          <div className="path-wrap">
            <div className="path-line" />
            {elements}
          </div>
        )
      })()}

      <p className="faint center" style={{ fontSize: 13, marginTop: 26 }}>
        Sectie 4 en verder zijn in de maak — jouw reis gaat door tot B2.
      </p>

      <AnimatePresence>
        {goalModal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGoalModal(false)}>
            <motion.div
              className="modal-panel"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="display" style={{ fontSize: 22, marginBottom: 4 }}>
                Kies je doel
              </h3>
              <p className="dim" style={{ fontSize: 13, marginBottom: 16 }}>
                Haal je het vóór de deadline, dan telt dat — en de XP-beloning is van jou.
              </p>
              <div className="col" style={{ gap: 10 }}>
                {suggestGoals({ streak, totalXp: xpAll, course, completedCount: completed.length, active: goals }).map((s) => (
                  <button
                    key={`${s.type}-${s.target}`}
                    className="opt"
                    onClick={() => {
                      sfx('tap')
                      addGoal({
                        id: `${s.type}-${s.target}-${Date.now()}`,
                        type: s.type,
                        target: s.target,
                        label: s.label,
                        courseId: s.courseId,
                        deadline: addDaysStr(s.deadlineDays),
                        createdAt: todayStr(),
                        rewardXp: s.rewardXp,
                      })
                      setGoalModal(false)
                    }}
                  >
                    <span className="col" style={{ gap: 2, flex: 1 }}>
                      <strong style={{ fontSize: 15 }}>{s.label}</strong>
                      <span className="faint" style={{ fontSize: 12 }}>
                        Deadline: over {s.deadlineDays} dagen
                      </span>
                    </span>
                    <span className="gold-text" style={{ fontWeight: 700, fontSize: 14 }}>
                      +{s.rewardXp} XP
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {picker && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPicker(false)}>
            <motion.div
              className="modal-panel"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="display" style={{ fontSize: 22, marginBottom: 18 }}>
                Kies je cursus
              </h3>
              <div className="col" style={{ gap: 10 }}>
                {courseList.map((c) => (
                  <button
                    key={c.id}
                    className={`opt ${c.id === courseId ? 'selected' : ''}`}
                    onClick={() => {
                      setCourse(c.id)
                      setPicker(false)
                    }}
                  >
                    <Flag code={courseFlagCode[c.id]} size={22} />
                    <span className="col" style={{ gap: 1 }}>
                      <strong>{c.name}</strong>
                      <span className="faint" style={{ fontSize: 13 }}>
                        {c.tagline}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
