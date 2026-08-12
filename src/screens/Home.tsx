import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { Course, Lesson, Unit } from '../types'
import { courseList, courses } from '../content'
import { totalXp, useStore } from '../store'
import { isDue } from '../srs'
import { countryStates, courseFlagCode, totalLessons } from '../countries'
import { levelProgress, levelTitle, nextReward } from '../levels'
import { LEAGUES, standings, weekIndex, yourRank } from '../leagues'
import { addDaysStr, daysUntil, goalStatus, suggestGoals, todayStr } from '../goals'
import { Flag } from '../components/Flag'
import { Avatar } from '../components/Avatar'
import { GuideSheet } from '../components/GuideSheet'
import { StreakScreen } from './Streak'
import { sfx } from '../audio'

interface Props {
  onStartLesson: (course: Course, lesson: Lesson) => void
  onReview: () => void
  onLeague?: () => void
  onPlay?: () => void
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

export function HomeScreen({ onStartLesson, onReview, onLeague, onPlay }: Props) {
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
  const boostUntil = useStore((s) => s.boostUntil)
  const leagueId = useStore((s) => s.leagueId)
  const weekXp = useStore((s) => s.weekXp)
  const weekLessons = useStore((s) => s.weekLessons)
  const weekArcade = useStore((s) => s.weekArcade)
  const weekDuels = useStore((s) => s.weekDuels)
  const weekChestWeek = useStore((s) => s.weekChestWeek)
  const todayFixedRaw = useStore((s) => s.todayFixed)
  const comebackDays = useStore((s) => s.comebackDays)
  const dismissComeback = useStore((s) => s.dismissComeback)
  const freezes = useStore((s) => s.freezes)
  const mijnFouten = useStore((s) => s.mistakes.filter((m) => m.c === s.courseId).length)
  const claimWeekChest = useStore((s) => s.claimWeekChest)
  const leagueRank = useMemo(() => yourRank(standings(leagueId, weekXp)), [leagueId, weekXp])
  const addGoal = useStore((s) => s.addGoal)
  const removeGoal = useStore((s) => s.removeGoal)
  const [picker, setPicker] = useState(false)
  const [goalModal, setGoalModal] = useState(false)
  const [streakOpen, setStreakOpen] = useState(false)
  const [guideUnit, setGuideUnit] = useState<Unit | null>(null)

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

  if (streakOpen) return <StreakScreen onBack={() => setStreakOpen(false)} />

  return (
    <div className="shell" style={{ display: 'flex', flexDirection: 'column' }}>
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
          <button
            className="row"
            style={{ gap: 5, color: streak > 0 ? 'var(--gold-bright)' : 'var(--text-faint)', padding: '6px 4px' }}
            onClick={() => setStreakOpen(true)}
            aria-label="Bekijk je reeks"
          >
            <span className={streak > 0 ? 'flame-active' : ''} style={{ lineHeight: 0 }}>
              <FlameIcon />
            </span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{streak}</span>
          </button>
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
      <p className="dim" style={{ fontSize: 14, marginBottom: 16 }}>
        CEFR-niveau {activeSection.cefr} · {completed.length} van {flat.length} lessen voltooid
      </p>

      {/* Doorgaan-hero: de volgende les start met één tik, zonder scrollen */}
      {(() => {
        const next = flat[currentIdx]
        // alles uitgespeeld? dan geen dood spoor, maar een viering met een vervolgstap
        if (!next)
          return (
            <motion.div
              className="glass center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: 20,
                marginBottom: 18,
                borderColor: 'var(--line-gold)',
                background: 'linear-gradient(135deg, rgba(255,197,61,0.16), rgba(236,72,153,0.10))',
              }}
            >
              <div style={{ fontSize: 34, lineHeight: 1 }}>🏆</div>
              <strong className="display gold-text" style={{ fontSize: 20, display: 'block', margin: '6px 0 4px' }}>
                Alle lessen voltooid!
              </strong>
              <p className="dim" style={{ fontSize: 13.5, marginBottom: 14 }}>
                Je hebt heel {course.name} tot en met A2 uitgespeeld. Houd het scherp met herhaling en minigames — nieuwe secties zijn in de
                maak.
              </p>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-primary" style={{ fontSize: 15 }} onClick={onReview}>
                  ↻ Herhalen
                </button>
                {onPlay && (
                  <button className="btn btn-ghost" style={{ fontSize: 15 }} onClick={onPlay}>
                    🕹️ Spelen
                  </button>
                )}
              </div>
            </motion.div>
          )
        const unitDone = next.unit.lessons.filter((l) => completed.includes(l.id)).length
        return (
          <motion.div
            className="glass"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 18,
              marginBottom: 18,
              borderColor: 'var(--line-hot)',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.16), rgba(236,72,153,0.10))',
              boxShadow: '0 0 28px rgba(236,72,153,0.22)',
            }}
          >
            <div className="row" style={{ gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 30, lineHeight: 1 }}>{next.unit.icon}</span>
              <span className="col" style={{ gap: 2, flex: 1, minWidth: 0 }}>
                <span className="eyebrow" style={{ fontSize: 10.5 }}>
                  {completed.length === 0 ? 'Je eerste les' : 'Verder waar je gebleven was'}
                </span>
                <strong style={{ fontSize: 16.5, lineHeight: 1.2 }}>{next.lesson.title}</strong>
                <span className="faint" style={{ fontSize: 12.5 }}>
                  {next.unit.title} · les {unitDone + 1} van {next.unit.lessons.length}
                </span>
              </span>
            </div>
            <motion.button
              className="btn btn-primary"
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartLesson(course, next.lesson)}
              style={{ fontSize: 17.5 }}
            >
              {completed.length === 0 ? '▶  Beginnen' : '▶  Doorgaan'}
            </motion.button>
          </motion.div>
        )
      })()}

      {/* Welkom terug: geen verwijt, wel een zachte landing en een cadeautje */}
      <AnimatePresence>
        {comebackDays > 0 && (
          <motion.div
            className="glass"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{
              padding: 16,
              marginBottom: 16,
              overflow: 'hidden',
              borderColor: 'var(--line-gold)',
              background: 'linear-gradient(135deg, rgba(255,197,61,0.14), rgba(168,85,247,0.10))',
            }}
          >
            <div className="row" style={{ gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>👋</span>
              <span className="col" style={{ gap: 2, flex: 1 }}>
                <strong className="display" style={{ fontSize: 17 }}>
                  Fijn dat je er weer bent
                </strong>
                <span className="faint" style={{ fontSize: 12.5 }}>
                  Je was {comebackDays} {comebackDays === 1 ? 'dag' : 'dagen'} weg — geen probleem, je pakt het zo weer op.
                </span>
              </span>
            </div>
            <p className="dim" style={{ fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
              {streak > 0
                ? `Je reeks van ${streak} ${streak === 1 ? 'dag' : 'dagen'} staat nog${freezes > 0 ? ' en je bescherming is intact' : ''}. `
                : 'Je begint gewoon opnieuw — dat telt hier net zo hard. '}
              We hebben <strong className="gold-text">30 minuten dubbele XP</strong> voor je klaargezet.
            </p>
            <div className="col" style={{ gap: 8 }}>
              <button
                className="btn btn-primary"
                style={{ fontSize: 15.5 }}
                onClick={() => {
                  sfx('tap')
                  dismissComeback()
                  const next = flat[currentIdx]
                  if (next) onStartLesson(course, next.lesson)
                }}
              >
                ▶ Rustig weer beginnen
              </button>
              <button
                className="btn-quiet center"
                style={{ width: '100%', fontSize: 13, padding: '6px 0 2px' }}
                onClick={() => {
                  sfx('tap')
                  dismissComeback()
                }}
              >
                Later — sluit dit bericht
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compacte statusbalk: houdt de dagelijkse haakjes zichtbaar zonder het pad weg te duwen */}
      {(() => {
        const lessonsToday = isToday ? todayLessonsRaw : 0
        const perfectToday = isToday ? todayPerfectRaw : 0
        const fixedToday = isToday ? todayFixedRaw : 0
        const questsDone =
          (xpShown >= dailyGoalXp ? 1 : 0) + (lessonsToday >= 2 ? 1 : 0) + (perfectToday >= 1 ? 1 : 0)
        const weekDone =
          (weekXp >= 500 ? 1 : 0) + (weekLessons >= 10 ? 1 : 0) + (weekArcade >= 3 ? 1 : 0) + (weekDuels >= 1 ? 1 : 0)
        const naarVandaag = () => {
          sfx('tap')
          document.getElementById('vandaag')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        const chips: { key: string; icon: string; label: string; klaar: boolean; hot?: boolean; actie: () => void }[] = [
          { key: 'dag', icon: '⚜️', label: `${questsDone}/3`, klaar: questsDone === 3, actie: naarVandaag },
          { key: 'week', icon: '🎁', label: `${weekDone}/4`, klaar: weekDone === 4, actie: naarVandaag },
          {
            key: 'divisie',
            icon: '🏆',
            label: `#${leagueRank}`,
            klaar: false,
            actie: () => {
              sfx('tap')
              onLeague?.()
            },
          },
        ]
        // fouten alleen tonen als je ze hebt — anders is het een lege belofte
        if (mijnFouten > 0)
          chips.push({
            key: 'fouten',
            icon: '🎯',
            label: String(mijnFouten),
            klaar: false,
            hot: true,
            actie: () => {
              sfx('tap')
              onReview()
            },
          })
        return (
          <div className="row" style={{ gap: 8, marginBottom: 18 }}>
            {chips.map((c) => (
              <button
                key={c.key}
                className="glass row"
                onClick={c.actie}
                style={{
                  flex: 1,
                  gap: 6,
                  padding: '10px 8px',
                  justifyContent: 'center',
                  borderRadius: 14,
                  borderColor: c.klaar ? 'var(--line-gold)' : c.hot ? 'var(--line-hot)' : undefined,
                  minHeight: 44,
                }}
              >
                <span style={{ fontSize: 15 }}>{c.icon}</span>
                <strong className={c.klaar ? 'gold-text' : c.hot ? 'hot-text' : ''} style={{ fontSize: 13.5 }}>
                  {c.label}
                </strong>
              </button>
            ))}
          </div>
        )
      })()}

      {boostUntil > Date.now() && (
        <motion.div
          className="glass row"
          style={{ padding: '12px 16px', marginBottom: 14, gap: 10, borderColor: 'var(--line-gold)' }}
          animate={{ boxShadow: ['0 0 0 rgba(255,197,61,0)', '0 0 24px rgba(255,197,61,0.45)', '0 0 0 rgba(255,197,61,0)'] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <span style={{ fontSize: 22 }}>⚡</span>
          <span className="col" style={{ gap: 1, flex: 1 }}>
            <strong className="gold-text" style={{ fontSize: 14.5 }}>Dubbele XP actief!</strong>
            <span className="faint" style={{ fontSize: 12 }}>
              Nog {Math.max(1, Math.ceil((boostUntil - Date.now()) / 60000))} minuten — speel nu door
            </span>
          </span>
        </motion.div>
      )}

      {onLeague && (
        <button
          className="glass spread"
          id="vandaag"
          style={{ width: '100%', padding: '14px 16px', marginBottom: 16, textAlign: 'left', order: 1, scrollMarginTop: 16 }}
          onClick={onLeague}
        >
          <span className="row" style={{ gap: 12 }}>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: LEAGUES[leagueId].color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 19,
                flexShrink: 0,
              }}
            >
              🏆
            </span>
            <span className="col" style={{ gap: 2 }}>
              <strong style={{ fontSize: 14.5 }}>{LEAGUES[leagueId].name}-divisie</strong>
              <span className="faint" style={{ fontSize: 12.5 }}>
                Plek {leagueRank} van 30 · {weekXp} XP deze week
              </span>
            </span>
          </span>
          <span className="hot-text" style={{ fontSize: 20, fontWeight: 800 }}>›</span>
        </button>
      )}

      {(() => {
        const lessonsToday = isToday ? todayLessonsRaw : 0
        const perfectToday = isToday ? todayPerfectRaw : 0
        const fixedToday = isToday ? todayFixedRaw : 0
        // de derde missie is op twee manieren te halen: foutloos spelen óf je eigen fouten wegwerken
        // ook tonen wanneer je vandaag al fouten hebt weggewerkt, anders verspringt
        // de missie zodra je lijst leeg is terwijl je hem net gehaald had
        const derde =
          (mijnFouten > 0 || fixedToday > 0) && perfectToday < 1
            ? { label: 'Werk 3 fouten weg', done: fixedToday >= 3, frac: Math.min(1, fixedToday / 3), icon: '🎯' }
            : { label: 'Speel een foutloze les', done: perfectToday >= 1, frac: perfectToday >= 1 ? 1 : 0, icon: '✨' }
        const quests = [
          { label: `Verdien ${dailyGoalXp} XP`, done: xpShown >= dailyGoalXp, frac: Math.min(1, xpShown / dailyGoalXp), icon: '⚡' },
          { label: 'Voltooi 2 lessen', done: lessonsToday >= 2, frac: Math.min(1, lessonsToday / 2), icon: '📘' },
          derde,
        ]
        const doneCount = quests.filter((q) => q.done).length
        const bonusIn = questBonusDay !== null && isToday && questBonusDay === todayDay
        return (
          <div className="glass unit-card" style={{ order: 1 }}>
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
        const missies = [
          { label: 'Verdien 500 XP', have: weekXp, need: 500, icon: '⚡' },
          { label: 'Voltooi 10 lessen', have: weekLessons, need: 10, icon: '📘' },
          { label: 'Speel 3 minigames', have: weekArcade, need: 3, icon: '🕹️' },
          { label: 'Speel 1 duel', have: weekDuels, need: 1, icon: '⚔️' },
        ]
        const klaar = missies.filter((m) => m.have >= m.need).length
        const alles = klaar === missies.length
        const geopend = weekChestWeek === weekIndex()
        return (
          <div className="glass unit-card" style={alles && !geopend ? { borderColor: 'var(--line-gold)', order: 1 } : { order: 1 }}>
            <div className="spread">
              <strong style={{ fontSize: 15 }}>🎁 Weekmissies</strong>
              <span className="gold-text" style={{ fontWeight: 800, fontSize: 14 }}>
                {klaar} / {missies.length}
              </span>
            </div>
            <div className="col" style={{ gap: 9, marginTop: 13 }}>
              {missies.map((m) => {
                const done = m.have >= m.need
                return (
                  <div className="row" key={m.label} style={{ gap: 10 }}>
                    <span style={{ fontSize: 16, width: 22, textAlign: 'center', filter: done ? 'none' : 'grayscale(0.7)' }}>{m.icon}</span>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: done ? 'var(--text)' : 'var(--text-dim)' }}>{m.label}</span>
                    <span className="faint" style={{ fontSize: 11.5, minWidth: 52, textAlign: 'right' }}>
                      {Math.min(m.have, m.need)}/{m.need}
                    </span>
                    <div className="progress-track" style={{ height: 5, width: 52, flex: 'none' }}>
                      <div className="progress-fill" style={{ width: `${Math.min(100, Math.round((m.have / m.need) * 100))}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            {alles && !geopend ? (
              <motion.button
                className="btn btn-primary"
                style={{ marginTop: 14 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                onClick={() => {
                  sfx('complete')
                  confetti({ particleCount: 140, spread: 100, origin: { y: 0.7 }, colors: ['#A855F7', '#EC4899', '#FFC53D', '#22D3EE'], disableForReducedMotion: true })
                  claimWeekChest()
                }}
              >
                🎁 Open de weekkist · +100 XP
              </motion.button>
            ) : (
              <p className={geopend ? 'gold-text' : 'faint'} style={{ fontSize: 12, fontWeight: geopend ? 700 : 500, marginTop: 12 }}>
                {geopend
                  ? '✦ Weekkist geopend: +100 XP en 30 min dubbele XP!'
                  : 'Alle vier gehaald = 100 XP + 30 minuten dubbele XP'}
              </p>
            )}
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
          <div className="glass unit-card" style={{ order: 1 }}>
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
          style={{ width: '100%', padding: '16px 18px', marginBottom: 18, borderColor: 'var(--line-gold)', textAlign: 'left', order: 1 }}
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
          <div className="glass unit-card" style={{ order: 1 }}>
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
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  sfx('tap')
                  setGuideUnit(unit)
                }}
                aria-label={`Gids bij ${unit.title}`}
                title="Grammatica-gids"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  background: unitDone ? 'rgba(0,0,0,0.18)' : 'var(--surface-2)',
                  border: '1px solid var(--line)',
                }}
              >
                📖
              </button>
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
          <div className="path-wrap" id="leerpad" style={{ scrollMarginTop: 16 }}>
            <div className="path-line" />
            {elements}
          </div>
        )
      })()}

      <p className="faint center" style={{ fontSize: 13, marginTop: 26, order: 2 }}>
        Sectie 4 en verder zijn in de maak — jouw reis gaat door tot B2.
      </p>

      {guideUnit && (
        <GuideSheet unit={guideUnit} courseId={courseId} ttsLang={course.ttsLang} onClose={() => setGuideUnit(null)} />
      )}

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
