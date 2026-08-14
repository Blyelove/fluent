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
import { addDaysStr, DAGDOELEN, daysUntil, goalStatus, suggestGoals, todayStr } from '../goals'
import { Flag } from '../components/Flag'
import { Avatar } from '../components/Avatar'
import { GuideSheet } from '../components/GuideSheet'
import { SkillsSheet } from '../components/SkillsSheet'
import { isMeester, skillStand } from '../skills'
import { StreakScreen } from './Streak'
import { WorldMapScreen } from './WorldMap'
import { WorldPeek } from '../components/WorldPeek'
import { sfx } from '../audio'
import { feestPalet } from '../wereldkleuren'

interface Props {
  onStartLesson: (course: Course, lesson: Lesson) => void
  onReview: () => void
  onLeague?: () => void
  onPlay?: () => void
  onPraten?: () => void
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
        <circle cx="19" cy="19" r={r} fill="none" stroke="var(--glans-10)" strokeWidth="4.5" />
        <motion.circle
          cx="19"
          cy="19"
          r={r}
          fill="none"
          stroke="url(#goldgrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - frac) }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
          transform="rotate(-90 19 19)"
          // beweegt alleen bij XP-verandering, dus de drop-shadow mag
          style={{ filter: 'drop-shadow(0 0 4px var(--goud-50))' }}
        />
        <defs>
          {/* het eerste goudmoment van de dag matcht het frisse systeemgoud, geen dof brons */}
          <linearGradient id="goldgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gold-bright)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="col">
        <span className="num" style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{value}</span>
        <span className="faint" style={{ fontSize: 11 }}>
          / {goal} XP
        </span>
      </div>
    </div>
  )
}

export function HomeScreen({ onStartLesson, onReview, onLeague, onPlay, onPraten }: Props) {
  const courseId = useStore((s) => s.courseId)
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
  // de meestermantel hoort overal te hangen zodra je 99 haalt, niet alleen op
  // je profiel; hier draagt je personage hem dus ook op het leerpad
  const meesterNu = useStore((s) => isMeester(s.progress[s.courseId]?.xp ?? 0))
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
  const [goalModal, setGoalModal] = useState(false)
  const [streakOpen, setStreakOpen] = useState(false)
  const [worldOpen, setWorldOpen] = useState(false)
  const [doelOpen, setDoelOpen] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const setDailyGoal = useStore((s) => s.setDailyGoal)
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

  if (streakOpen)
    return (
      <StreakScreen
        onBack={() => setStreakOpen(false)}
        onLeren={
          currentIdx < flat.length
            ? () => {
                setStreakOpen(false)
                onStartLesson(course, flat[currentIdx].lesson)
              }
            : undefined
        }
      />
    )

  if (worldOpen)
    return (
      <WorldMapScreen
        course={course}
        completedCount={completed.length}
        onBack={() => setWorldOpen(false)}
        onVerderLeren={
          currentIdx < flat.length
            ? () => {
                setWorldOpen(false)
                onStartLesson(course, flat[currentIdx].lesson)
              }
            : undefined
        }
      />
    )

  return (
    <div className="shell" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="ambient-orb orb-a" />
      <header className="spread rise" style={{ marginBottom: 24 }}>
        {/* alleen de vlag als stille wegwijzer: van taal wisselen doe je op je
            profiel, zodat de kop hier ademt */}
        <span className="row" style={{ gap: 8, minHeight: 44, alignItems: 'center' }} aria-label={`Je leert ${course.name}`}>
          <Flag code={courseFlagCode[courseId]} size={20} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>{course.name}</span>
        </span>
        <div className="row" style={{ gap: 16 }}>
          <button
            className="row"
            style={{
              gap: 4,
              color: streak > 0 ? 'var(--gold-bright)' : 'var(--text-faint)',
              padding: '6px 10px',
              minWidth: 44,
              minHeight: 44,
              justifyContent: 'center',
            }}
            onClick={() => setStreakOpen(true)}
            aria-label="Bekijk je reeks"
          >
            <span className={streak > 0 ? 'flame-active' : ''} style={{ lineHeight: 0 }}>
              <FlameIcon />
            </span>
            {streak > 0 ? (
              <span className="num" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{streak}</span>
            ) : (
              <span className="faint" style={{ fontSize: 12.5, fontWeight: 700 }}>Start je reeks</span>
            )}
          </button>
          {/* de ring was een dood plaatje; nu opent hij je dagdoel */}
          <button
            onClick={() => {
              sfx('tap')
              setDoelOpen(true)
            }}
            aria-label="Dagdoel aanpassen"
            style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <GoalRing value={xpShown} goal={dailyGoalXp} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {doelOpen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDoelOpen(false)}
          >
            <motion.div
              className="modal-panel"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 110 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="display" style={{ fontSize: 23, marginBottom: 4 }}>
                Jouw dagdoel
              </h3>
              <p className="dim" style={{ fontSize: 14, marginBottom: 16 }}>
                Vandaag {xpShown} van de {dailyGoalXp} XP. Een doel dat past, haal je vaker.
              </p>
              <div className="col" style={{ gap: 8 }}>
                {DAGDOELEN.map((g) => (
                  <button
                    key={g.xp}
                    className="opt"
                    style={
                      dailyGoalXp === g.xp
                        ? { borderColor: 'var(--gold)', background: 'var(--goud-10)' }
                        : undefined
                    }
                    onClick={() => {
                      sfx('tap')
                      setDailyGoal(g.xp)
                      setDoelOpen(false)
                    }}
                  >
                    <span className="col" style={{ gap: 0, flex: 1 }}>
                      <strong>{g.label}</strong>
                      <span className="faint" style={{ fontSize: 12.5 }}>
                        {g.sub}
                      </span>
                    </span>
                    <span className="gold-text" style={{ fontWeight: 700 }}>
                      {g.xp} XP
                    </span>
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: 12, padding: 12, fontSize: 14 }} onClick={() => setDoelOpen(false)}>
                Sluiten
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {(() => {
        const lp = levelProgress(xpAll)
        const nr = nextReward(courseId, lp.level)
        // beheersinformatie hoort niet boven de actie: via order naar het
        // secundaire blok, onder de missies
        return (
          <div className="glass" style={{ padding: '10px 16px', marginBottom: 16, order: 1 }}>
            <div className="row" style={{ gap: 12 }}>
              {/* op je poppetje drukken opent je vaardigheden, RuneScape-stijl */}
              <button
                onClick={() => { sfx('tap'); setSkillsOpen(true) }}
                aria-label="Bekijk je vaardigheden"
                style={{ position: 'relative', minWidth: 56, minHeight: 56, flexShrink: 0 }}
              >
                <Avatar size={56} level={lp.level} courseId={courseId} look={look} meester={meesterNu} />
                <span
                  className="num"
                  style={{
                    position: 'absolute',
                    right: -6,
                    bottom: -3,
                    padding: '1px 7px',
                    borderRadius: 999,
                    background: 'var(--grad-gold)',
                    color: 'var(--ink-on-gold)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 11,
                    boxShadow: '0 0 8px var(--goud-50)',
                  }}
                  title={`${course.name}: level ${skillStand(progressMap[courseId]?.xp ?? 0).level} van 99`}
                >
                  {skillStand(progressMap[courseId]?.xp ?? 0).level}
                </span>
              </button>
              <div style={{ flex: 1 }}>
                <div className="spread">
                  <strong style={{ fontSize: 14 }}>
                    Niveau {lp.level} · {levelTitle(lp.level)}
                  </strong>
                  <span className="gold-text num" style={{ fontWeight: 700, fontSize: 12.5 }}>
                    {xpAll} XP totaal
                  </span>
                </div>
                <div className="progress-track" style={{ height: 6, margin: '7px 0 5px' }}>
                  <div className="progress-fill progress-fill--gold" style={{ width: `${Math.max(3, Math.round(lp.frac * 100))}%` }} />
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

      {/* Doorgaan-hero: de volgende les start met één tik, zonder scrollen.
          Ben je net terug na een paar dagen, dan neemt de welkom-terug-kaart
          deze plek over: twee knoppen die dezelfde les starten is verwarrend. */}
      {comebackDays === 0 && (() => {
        const next = flat[currentIdx]
        // alles uitgespeeld? dan geen dood spoor, maar een viering met een vervolgstap
        if (!next)
          return (
            <motion.div
              className="glass center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: 16,
                marginBottom: 16,
                borderColor: 'var(--line-gold)',
                background: 'linear-gradient(135deg, var(--goud-16), var(--hot-10))',
              }}
            >
              <div style={{ fontSize: 34, lineHeight: 1 }}>🏆</div>
              <strong className="display gold-text" style={{ fontSize: 19, display: 'block', margin: '6px 0 4px' }}>
                Alle lessen voltooid!
              </strong>
              <p className="dim" style={{ fontSize: 14, marginBottom: 12 }}>
                Je hebt heel {course.name} tot en met A2 uitgespeeld. Houd het scherp met herhaling en minigames. Nieuwe secties zijn in de
                maak.
              </p>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-primary" style={{ fontSize: 14 }} onClick={onReview}>
                  ↻ Herhalen
                </button>
                {onPlay && (
                  <button className="btn btn-ghost" style={{ fontSize: 14 }} onClick={onPlay}>
                    🕹️ Spelen
                  </button>
                )}
              </div>
            </motion.div>
          )
        const unitDone = next.unit.lessons.filter((l) => completed.includes(l.id)).length
        return (
          <motion.div
            className="card-hero"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '22px 20px', marginBottom: 16 }}
          >
            <div className="row" style={{ gap: 12, marginBottom: 12 }}>
              <span
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: 'var(--grad-hot)',
                  boxShadow: '0 5px 0 #7e22ce',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                {next.unit.icon}
              </span>
              <span className="col" style={{ gap: 0, flex: 1, minWidth: 0 }}>
                <span className="eyebrow" style={{ fontSize: 11, color: 'var(--hero-eyebrow)' }}>
                  {activeSection.title} · {completed.length === 0 ? 'je eerste les' : 'verder waar je was'}
                </span>
                <strong className="display" style={{ fontSize: 19, lineHeight: 1.15 }}>{next.lesson.title}</strong>
                <span className="faint" style={{ fontSize: 12.5 }}>
                  {next.unit.title} · les {unitDone + 1} van {next.unit.lessons.length}
                </span>
              </span>
            </div>
            {/* de enige ademende knop van het scherm: de uitnodiging */}
            <motion.button
              className="btn btn-primary"
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.025, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
              onClick={() => onStartLesson(course, next.lesson)}
            >
              {completed.length === 0 ? '▶︎ Beginnen' : '▶︎ Doorgaan'}
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
              background: 'linear-gradient(135deg, var(--goud-16), var(--hot-10))',
            }}
          >
            <div className="row" style={{ gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 28, lineHeight: 1 }}>👋</span>
              <span className="col" style={{ gap: 0, flex: 1 }}>
                <strong className="display" style={{ fontSize: 16 }}>
                  Fijn dat je er weer bent
                </strong>
                <span className="faint" style={{ fontSize: 12.5 }}>
                  Je was {comebackDays} {comebackDays === 1 ? 'dag' : 'dagen'} weg. Geen probleem, je pakt het zo weer op.
                </span>
              </span>
            </div>
            <p className="dim" style={{ fontSize: 12.5, marginBottom: 12, lineHeight: 1.5 }}>
              {streak > 0
                ? `Je reeks van ${streak} ${streak === 1 ? 'dag' : 'dagen'} staat nog${freezes > 0 ? ' en je bescherming is intact' : ''}. `
                : 'Je begint gewoon opnieuw, en dat telt hier net zo hard. '}
              We hebben <strong className="gold-text">30 minuten dubbele XP</strong> voor je klaargezet.
            </p>
            <div className="col" style={{ gap: 8 }}>
              <button
                className="btn btn-primary"
                style={{ fontSize: 16 }}
                onClick={() => {
                  sfx('tap')
                  dismissComeback()
                  const next = flat[currentIdx]
                  if (next) onStartLesson(course, next.lesson)
                }}
              >
                ▶︎ Rustig weer beginnen
              </button>
              <button
                className="btn-quiet center"
                style={{ width: '100%', fontSize: 12.5, padding: '6px 0 2px' }}
                onClick={() => {
                  sfx('tap')
                  dismissComeback()
                }}
              >
                Later, sluit dit bericht
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
        // korte woorden erbij: een los cijfer naast een plaatje zegt niets
        const chips: { key: string; icon: string; label: string; klaar: boolean; hot?: boolean; actie: () => void }[] = [
          { key: 'dag', icon: '⚜️', label: `Vandaag ${questsDone}/3`, klaar: questsDone === 3, actie: naarVandaag },
          { key: 'week', icon: '🎁', label: `Week ${weekDone}/4`, klaar: weekDone === 4, actie: naarVandaag },
          {
            key: 'divisie',
            icon: '🏆',
            label: weekXp === 0 ? 'Doe mee' : `Plek ${leagueRank}`,
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
            label: `Fouten ${mijnFouten}`,
            klaar: false,
            hot: true,
            actie: () => {
              sfx('tap')
              onReview()
            },
          })
        return (
          <div className="row rise" style={{ gap: 8, marginBottom: 16, '--d': '120ms' } as CSSProperties}>
            {chips.map((c) => (
              // kleurdiscipline: goud = behaald, cyaan = systeem (oefenen),
              // roze blijft exclusief voor de hero
              <button
                key={c.key}
                className={`chip ${c.klaar ? 'chip--gold' : c.hot ? 'chip--cool' : ''}`}
                onClick={c.actie}
              >
                <span style={{ fontSize: 14 }}>{c.icon}</span>
                <strong className={`num ${c.klaar ? 'gold-text' : ''}`} style={{ fontSize: 14, ...(c.hot ? { color: 'var(--cyan)' } : null) }}>
                  {c.label}
                </strong>
              </button>
            ))}
          </div>
        )
      })()}

      {boostUntil > Date.now() && (
        <div
          className="glass row"
          style={{ padding: '12px 16px', marginBottom: 12, gap: 8, borderColor: 'var(--line-gold)', boxShadow: '0 0 24px var(--goud-35)' }}
        >
          <span style={{ fontSize: 23 }}>⚡</span>
          <span className="col" style={{ gap: 0, flex: 1 }}>
            <strong className="gold-text" style={{ fontSize: 14 }}>Dubbele XP actief!</strong>
            <span className="faint" style={{ fontSize: 12.5 }}>
              Nog {Math.max(1, Math.ceil((boostUntil - Date.now()) / 60000))} minuten, speel nu door
            </span>
          </span>
        </div>
      )}

      {onLeague && (
        <button
          className="glass spread"
          style={{ width: '100%', padding: '14px 16px', marginBottom: 16, textAlign: 'left', order: 1 }}
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
            <span className="col" style={{ gap: 0 }}>
              <strong style={{ fontSize: 14 }}>{LEAGUES[leagueId].name}-divisie</strong>
              <span className="faint" style={{ fontSize: 12.5 }}>
                Plek {leagueRank} van 30 · {weekXp} XP deze week
              </span>
            </span>
          </span>
          <span className="hot-text" style={{ fontSize: 19, fontWeight: 800 }}>›</span>
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
          // de dagmissies zijn de dagelijkse haak: die horen boven het pad,
          // niet zeven schermen eronder. De rest van de kaarten blijft achter
          // het leerpad staan (order 1).
          <div className="glass unit-card rise" id="vandaag" style={{ order: 0, scrollMarginTop: 16, '--d': '180ms' } as CSSProperties}>
            <div className="spread">
              <span className="row" style={{ gap: 8 }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--goud-16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>⚜️</span>
                <strong className="card-title">Dagelijkse missies</strong>
              </span>
              <span className="gold-text num" style={{ fontWeight: 700, fontSize: 14 }}>
                {doneCount} / 3
              </span>
            </div>
            <div className="col" style={{ gap: 8, marginTop: 12 }}>
              {quests.map((q) => (
                <div className="row" key={q.label} style={{ gap: 8 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12.5,
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
                    <div className="progress-fill progress-fill--gold" style={{ width: `${Math.round(q.frac * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {/* de kist geeft óók een kwartier dubbele XP; dat stond nergens */}
            {bonusIn ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                className="row"
                style={{
                  gap: 8,
                  marginTop: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'var(--goud-10)',
                  border: '1.5px solid var(--line-gold)',
                }}
              >
                <motion.span
                  style={{ fontSize: 23, lineHeight: 1 }}
                  animate={{ rotate: [0, -12, 10, 0] }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                  🎁
                </motion.span>
                <span className="gold-text" style={{ fontSize: 12.5, fontWeight: 800 }}>
                  Kist geopend: +15 XP en 15 minuten dubbele XP
                </span>
              </motion.div>
            ) : (
              <p className="faint" style={{ fontSize: 12.5, marginTop: 12 }}>
                Alle drie gehaald = kist: +15 XP én 15 minuten dubbele XP
              </p>
            )}
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
              <span className="row" style={{ gap: 8 }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--cyaan-16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎁</span>
                <strong className="card-title">Weekmissies</strong>
              </span>
              <span className="gold-text num" style={{ fontWeight: 700, fontSize: 14 }}>
                {klaar} / {missies.length}
              </span>
            </div>
            <div className="col" style={{ gap: 8, marginTop: 12 }}>
              {missies.map((m) => {
                const done = m.have >= m.need
                return (
                  <div className="row" key={m.label} style={{ gap: 8 }}>
                    <span style={{ fontSize: 16, width: 22, textAlign: 'center', filter: done ? 'none' : 'grayscale(0.7)' }}>{m.icon}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: done ? 'var(--text)' : 'var(--text-dim)' }}>{m.label}</span>
                    <span className="faint" style={{ fontSize: 11, minWidth: 52, textAlign: 'right' }}>
                      {Math.min(m.have, m.need)}/{m.need}
                    </span>
                    <div className="progress-track" style={{ height: 5, width: 52, flex: 'none' }}>
                      <div className="progress-fill progress-fill--gold" style={{ width: `${Math.min(100, Math.round((m.have / m.need) * 100))}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            {alles && !geopend ? (
              <motion.button
                className="btn btn-primary"
                style={{ marginTop: 12 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                onClick={() => {
                  sfx('complete')
                  confetti({ particleCount: 140, spread: 100, origin: { y: 0.7 }, colors: feestPalet(), disableForReducedMotion: true })
                  claimWeekChest()
                }}
              >
                🎁 Open de weekkist · +100 XP
              </motion.button>
            ) : (
              <p className={geopend ? 'gold-text' : 'faint'} style={{ fontSize: 12.5, fontWeight: geopend ? 700 : 500, marginTop: 12 }}>
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
              <span className="row" style={{ gap: 8 }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--hot-16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎯</span>
                <strong className="card-title">Jouw doelen</strong>
              </span>
              <span className="faint num" style={{ fontSize: 12.5 }}>
                {goalsDoneCount} gehaald
              </span>
            </div>
            {goals.length === 0 && (
              <p className="dim" style={{ fontSize: 12.5, marginTop: 8 }}>
                Stel jezelf een doel mét deadline. Wie een doel stelt, haalt het vaker, en meestal eerder.
              </p>
            )}
            <div className="col" style={{ gap: 12, marginTop: 12 }}>
              {goals.map((g) => {
                const st = goalStatus(g, ctx)
                const left = daysUntil(g.deadline)
                return (
                  <div key={g.id}>
                    <div className="spread" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{g.label}</span>
                      <span className="row" style={{ gap: 4 }}>
                        <span
                          style={{
                            fontSize: 12.5,
                            color: left < 0 ? 'var(--err)' : left <= 1 ? 'var(--gold-bright)' : 'var(--text-faint)',
                            fontWeight: left <= 1 ? 700 : 500,
                          }}
                        >
                          {left > 1 ? `nog ${left} dagen` : left === 1 ? 'nog 1 dag!' : left === 0 ? 'vandaag!' : 'deadline voorbij'}
                        </span>
                        <button
                          className="btn-quiet"
                          style={{ padding: '0 4px', fontSize: 12.5, lineHeight: 1 }}
                          onClick={() => removeGoal(g.id)}
                          aria-label="Doel verwijderen"
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                    <div className="row" style={{ gap: 8 }}>
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
              <button className="btn btn-ghost" style={{ marginTop: 12, padding: 12, fontSize: 14 }} onClick={() => setGoalModal(true)}>
                + Doel stellen
              </button>
            )}
          </div>
        )
      })()}

      {due.length > 0 && (
        <motion.button
          className="glass spread"
          style={{ width: '100%', padding: '16px 18px', marginBottom: 16, borderColor: 'var(--line-gold)', textAlign: 'left', order: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReview}
        >
          <div className="col" style={{ gap: 0 }}>
            <strong style={{ fontSize: 14 }}>Herhaling staat klaar</strong>
            <span className="dim" style={{ fontSize: 12.5 }}>
              {due.length} {due.length === 1 ? 'woord wacht' : 'woorden wachten'} op je geheugen
            </span>
          </div>
          <span className="gold-text" style={{ fontSize: 23, fontWeight: 700 }}>
            ↻
          </span>
        </motion.button>
      )}

      {/* Vaardigheden in RuneScape-stijl: onmisbaar op Home, niet verstopt */}
      {(() => {
        const stand = skillStand(progressMap[courseId]?.xp ?? 0)
        const totaal = courseList.reduce((n, c) => n + skillStand(progressMap[c.id]?.xp ?? 0).level, 0)
        return (
          <button className="glass unit-card" onClick={() => { sfx('tap'); setSkillsOpen(true) }} style={{ order: 1, width: '100%', textAlign: 'left' }}>
            <div className="spread">
              <span className="row" style={{ gap: 8 }}>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--goud-16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎓</span>
                <strong className="card-title">Vaardigheden</strong>
              </span>
              <span className="gold-text num" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}>
                Totaal {totaal}
              </span>
            </div>
            <div className="row" style={{ gap: 12, marginTop: 12 }}>
              <Flag code={courseFlagCode[courseId]} size={26} />
              <span className="col" style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <span className="spread">
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{course.name}</span>
                  <span className="num" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--gold-bright)' }}>
                    {stand.level}
                    <span className="faint" style={{ fontSize: 12.5, fontWeight: 700 }}> / 99</span>
                  </span>
                </span>
                <span className="progress-track" style={{ height: 6, display: 'block' }}>
                  <span className="progress-fill progress-fill--gold" style={{ width: `${Math.max(3, Math.round(stand.frac * 100))}%`, display: 'block' }} />
                </span>
              </span>
            </div>
            <p className="faint num" style={{ fontSize: 11, marginTop: 8 }}>
              {stand.meester
                ? `Meester van het ${course.name}. Niveau 99 bereikt.`
                : `Nog ${stand.breedte - stand.binnen} XP tot niveau ${stand.level + 1}. Tik voor al je talen.`}
            </p>
          </button>
        )
      })()}

      <WorldPeek course={course} completedCount={completed.length} onOpen={() => setWorldOpen(true)} />

      {/* gesprekken: echt praten in de doeltaal, het duolingo-max-gevoel zonder abonnement */}
      {onPraten && (
        <button className="glass unit-card row" onClick={() => { sfx('tap'); onPraten() }} style={{ gap: 12, textAlign: 'left', alignItems: 'center', order: 1 }}>
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 23,
              background: 'linear-gradient(135deg, var(--hot1), var(--hot2))',
              boxShadow: '0 0 16px var(--hot-35)',
              flexShrink: 0,
            }}
          >
            🗣️
          </span>
          <span className="col" style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ fontSize: 14 }}>
              Gesprekken{' '}
              <span className="gold-text" style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
                NIEUW
              </span>
            </strong>
            <span className="dim" style={{ fontSize: 12.5 }}>
              Praat echt in het {course.name}, met je stem of met keuzes
            </span>
          </span>
          <span className="dim" style={{ fontSize: 19, flexShrink: 0 }}>
            ›
          </span>
        </button>
      )}

      {(() => {
        const UNIT_COLORS = ['var(--gold)', '#FF5C8A', 'var(--cyan)', '#A3E635', 'var(--hot1)', '#FF8A3D']
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
                  // uit tokens: op een lichte taalwereld blijft dit blokje donker
                  background: 'var(--paneel-diep)',
                  color: 'var(--paneel-dim)',
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
              <span style={{ fontSize: 23 }}>{unit.icon}</span>
              <strong className="card-title" style={{ flex: 1 }}>{unit.title}</strong>
              <span style={{ fontSize: 12.5, fontWeight: 700 }} className={unitDone ? '' : 'faint'}>
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
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  background: unitDone ? 'var(--inkt-16)' : 'var(--surface-2)',
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
            // vloeiende sinus-slinger in plaats van starre zigzag
            const offset = Math.round(Math.sin(((idxHere % 6) / 6) * Math.PI * 2) * 76)
            elements.push(
              <div
                key={lesson.id}
                style={{ display: 'flex', justifyContent: 'center', transform: `translateX(${offset}px)`, margin: '16px 0', position: 'relative', zIndex: 1 }}
              >
                <button
                  className={`node-big ${state}`}
                  title={lesson.title}
                  // voltooide lessen staan als paspoortstempels nét scheef
                  style={{ '--uc': uc, rotate: state === 'done' ? `${[-6, 5, -3, 7][idxHere % 4]}deg` : undefined } as CSSProperties}
                  onClick={() => {
                    if (state === 'locked') {
                      sfx('tap')
                      return
                    }
                    onStartLesson(course, lesson)
                  }}
                >
                  {state === 'current' && <span className="start-label">Start</span>}
                  {/* jouw personage staat op je route te wachten */}
                  {state === 'current' && (
                    <span style={{ position: 'absolute', bottom: 'calc(100% - 10px)', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                      <Avatar size={58} still level={levelProgress(xpAll).level} courseId={courseId} look={look} meester={meesterNu} />
                    </span>
                  )}
                  {state === 'done' ? (
                    <span className="display" style={{ fontSize: 23 }}>{lesson.title[0]}</span>
                  ) : (
                    <StarIcon filled={state === 'current'} />
                  )}
                </button>
              </div>
            )
            gi++
          }
          }
        }
        return (
          <div className="path-wrap rise" id="leerpad" style={{ scrollMarginTop: 16, '--d': '240ms' } as CSSProperties}>
            <div className="path-line" />
            {elements}
          </div>
        )
      })()}

      <p className="faint center" style={{ fontSize: 12.5, marginTop: 24, order: 2 }}>
        Sectie 4 en verder zijn in de maak. Jouw reis gaat door tot B2.
      </p>

      {guideUnit && (
        <GuideSheet unit={guideUnit} courseId={courseId} ttsLang={course.ttsLang} onClose={() => setGuideUnit(null)} />
      )}

      {skillsOpen && <SkillsSheet onClose={() => setSkillsOpen(false)} />}

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
              <h3 className="display" style={{ fontSize: 23, marginBottom: 4 }}>
                Kies je doel
              </h3>
              <p className="dim" style={{ fontSize: 12.5, marginBottom: 16 }}>
                Haal je het vóór de deadline, dan telt dat, en de XP-beloning is van jou.
              </p>
              <div className="col" style={{ gap: 8 }}>
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
                    <span className="col" style={{ gap: 0, flex: 1 }}>
                      <strong style={{ fontSize: 14 }}>{s.label}</strong>
                      <span className="faint" style={{ fontSize: 12.5 }}>
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

    </div>
  )
}
