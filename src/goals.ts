import type { Course, CourseId } from './types'
import { levelForXp, levelProgress, levelTitle, xpToReach } from './levels'
import { countryStates } from './countries'

/**
 * De vier dagdoelen, op één plek: de onboarding en de dagdoel-modal op Home
 * tonen dezelfde lijst, dus ook de fanatieke starter kan meteen goed kiezen.
 */
export const DAGDOELEN = [
  { xp: 20, label: 'Rustig', sub: '±5 min per dag' },
  { xp: 40, label: 'Serieus', sub: '±10 min per dag' },
  { xp: 60, label: 'Gedreven', sub: '±15 min per dag' },
  { xp: 100, label: 'Fanatiek', sub: '±25 min per dag' },
] as const

export type GoalType = 'streak' | 'level' | 'country' | 'lessons'

export interface Goal {
  id: string
  type: GoalType
  /** streak: dagen · level: niveaunummer · country/lessons: aantal voltooide lessen in de cursus */
  target: number
  label: string
  courseId?: CourseId
  deadline: string // YYYY-MM-DD
  createdAt: string
  rewardXp: number
}

export interface CompletedGoal {
  label: string
  rewardXp: number
  /** Dagen vóór de deadline gehaald (0 = op of na de deadline) */
  earlyDays: number
  day: string
}

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addDaysStr(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function daysUntil(deadline: string): number {
  return Math.round((new Date(deadline).getTime() - new Date(todayStr()).getTime()) / 86400000)
}

export interface GoalSuggestion {
  type: GoalType
  target: number
  label: string
  deadlineDays: number
  rewardXp: number
  courseId?: CourseId
}

/** Slimme doel-suggesties op basis van waar de speler nu staat */
export function suggestGoals(opts: {
  streak: number
  totalXp: number
  course: Course
  completedCount: number
  active: Goal[]
}): GoalSuggestion[] {
  const out: GoalSuggestion[] = []
  const has = (t: GoalType, target: number) => opts.active.some((g) => g.type === t && g.target === target)

  const streakNext = [3, 7, 14, 30, 50, 100].find((m) => m > opts.streak)
  if (streakNext && !has('streak', streakNext)) {
    out.push({
      type: 'streak',
      target: streakNext,
      label: `Bereik een reeks van ${streakNext} dagen`,
      deadlineDays: streakNext - opts.streak + 2,
      rewardXp: streakNext * 3,
    })
  }

  const nextLvl = levelForXp(opts.totalXp) + 1
  if (!has('level', nextLvl)) {
    const lp = levelProgress(opts.totalXp)
    const days = Math.max(3, Math.ceil((lp.needed - lp.current) / 40) + 2)
    out.push({
      type: 'level',
      target: nextLvl,
      label: `Word niveau ${nextLvl} · ${levelTitle(nextLvl)}`,
      deadlineDays: days,
      rewardXp: 20 + nextLvl * 10,
    })
  }

  const country = countryStates(opts.course, opts.completedCount).find((c) => !c.conquered && c.inCourse)
  if (country && !has('country', country.threshold)) {
    out.push({
      type: 'country',
      target: country.threshold,
      label: `Verover ${country.name}`,
      courseId: opts.course.id,
      deadlineDays: Math.max(3, country.threshold - opts.completedCount + 2),
      rewardXp: 30,
    })
  }

  const lessonsTarget = opts.completedCount + 10
  if (!has('lessons', lessonsTarget)) {
    out.push({
      type: 'lessons',
      target: lessonsTarget,
      label: `Voltooi 10 lessen ${opts.course.name}`,
      courseId: opts.course.id,
      deadlineDays: 7,
      rewardXp: 35,
    })
  }

  return out
}

/** Actuele voortgang op een doel */
export function goalStatus(
  g: Goal,
  ctx: { streak: number; totalXp: number; completedByCourse: (c: CourseId) => number }
): { current: number; target: number; frac: number; done: boolean } {
  let current = 0
  if (g.type === 'streak') current = ctx.streak
  else if (g.type === 'level') current = levelForXp(ctx.totalXp)
  else current = g.courseId ? ctx.completedByCourse(g.courseId) : 0
  const done = current >= g.target
  let frac = g.target > 0 ? Math.min(1, current / g.target) : 0
  if (g.type === 'level' && !done) frac = Math.min(1, ctx.totalXp / xpToReach(g.target))
  return { current, target: g.target, frac, done }
}
