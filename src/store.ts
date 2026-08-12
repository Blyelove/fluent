import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card } from 'ts-fsrs'
import type { CourseId } from './types'
import { newCard, nextCard, isDue } from './srs'
import { goalStatus, type CompletedGoal, type Goal } from './goals'
import type { DuelRecord } from './duel'
import { LEAGUES, weekIndex } from './leagues'
import type { AvatarStyle, Look } from './components/Avatar'
import { setSoundEnabled } from './audio'

export interface SrsEntry {
  word: string
  nl: string
  courseId: CourseId
  card: Card
}

export interface Progress {
  xp: number
  completed: string[]
}

export interface TestResult {
  label: string
  score: number
  total: number
  passed: boolean
  day: string
}

export interface Account {
  email: string
  passHash: string
  createdAt: string
  name?: string
}

function todayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

interface AureaState {
  /** Lokale accounts (sleutel = naam in kleine letters); sync via server komt later */
  accounts: Record<string, Account>
  currentUser: string | null
  /** "Ingelogd blijven" — true = nooit meer het inlogscherm */
  rememberMe: boolean
  /** Gekozen personage (4 stijlen) */
  avatarLook: AvatarStyle | Look

  onboarded: boolean
  courseId: CourseId
  dailyGoalXp: number
  soundOn: boolean

  streak: number
  bestStreak: number
  lastDay: string | null
  freezes: number

  todayDay: string
  todayXp: number
  todayLessons: number
  todayPerfect: number
  /** Dag waarop de dagelijkse-missies-bonus al is uitgekeerd */
  questBonusDay: string | null

  progress: Partial<Record<CourseId, Progress>>
  srs: Record<string, SrsEntry>

  goals: Goal[]
  goalsDone: CompletedGoal[]

  /** Zelf samengestelde toetsen — resultaat wordt onthouden */
  tests: TestResult[]

  /* ---- competitie ---- */
  /** Huidige divisie (0 = Brons … 9 = Diamant) */
  leagueId: number
  /** Weeknummer waarvoor weekXp geldt */
  leagueWeek: number
  /** XP verdiend in de lopende competitieweek */
  weekXp: number
  /** Aantal keer gepromoveerd */
  promotions: number

  /* ---- verzamelen & spelen ---- */
  /** Aantal foutloze lessen ooit */
  perfectLessons: number
  /** Gespeelde minigames */
  arcadePlays: number
  /** Hoogste score per minigame */
  arcadeBest: Record<string, number>
  /** Gewonnen duels van vrienden */
  duelsWon: number
  duelHistory: DuelRecord[]
  /** Behaalde badge-tiers (voor "nieuw!"-melding) */
  seenBadgeTiers: Record<string, number>

  /** Actieve XP-boost: tijdstip (ms) waarop hij afloopt */
  boostUntil: number

  /** Alle dagen waarop je geleerd hebt (YYYY-MM-DD) — voor de streak-kalender */
  activeDays: string[]

  /* ---- weekmissies ---- */
  weekLessons: number
  weekArcade: number
  weekDuels: number
  /** Week waarin de grote weekkist al is geopend */
  weekChestWeek: number

  completeOnboarding: (c: CourseId, goalXp: number) => void
  setCourse: (c: CourseId) => void
  completeLesson: (c: CourseId, lessonId: string, xp: number, perfect: boolean) => void
  learnWord: (c: CourseId, word: string, nl: string) => void
  reviewWord: (key: string, good: boolean) => void
  addReviewXp: (c: CourseId, xp: number) => void
  addGoal: (g: Goal) => void
  removeGoal: (id: string) => void
  addTestResult: (r: TestResult) => void
  /** XP toekennen buiten lessen om (minigames, duels) — telt mee voor competitie */
  awardXp: (xp: number, opts?: { arcade?: string; score?: number }) => void
  recordDuel: (r: DuelRecord) => void
  /** Grote weekkist openen: +100 XP en 30 minuten dubbele XP */
  claimWeekChest: () => void
  startBoost: (minutes: number) => void
  markBadgesSeen: (map: Record<string, number>) => void
  registerAccount: (email: string, passHash: string, remember: boolean, look: AvatarStyle | Look) => 'ok' | 'bestaat'
  loginAccount: (email: string, passHash: string, remember: boolean) => 'ok' | 'fout'
  logout: () => void
  toggleSound: () => void
  resetAll: () => void
}

const emptyProgress = (): Progress => ({ xp: 0, completed: [] })

/**
 * Rolt de competitieweek door als er een nieuwe week is begonnen:
 * bij genoeg XP promoveer je, bij te weinig zak je terug.
 * Geeft de bij te werken velden terug (weekXp is dan al gereset).
 */
interface WeekState {
  leagueWeek: number
  weekXp: number
  leagueId: number
  promotions: number
  weekLessons: number
  weekArcade: number
  weekDuels: number
}

function rollWeek(s: WeekState): WeekState {
  const now = weekIndex()
  // let op: alleen de weekvelden teruggeven — een spread van de hele state
  // zou bij set() de zojuist bijgewerkte voortgang weer overschrijven
  if (now === s.leagueWeek)
    return {
      leagueWeek: s.leagueWeek,
      weekXp: s.weekXp,
      leagueId: s.leagueId,
      promotions: s.promotions,
      weekLessons: s.weekLessons,
      weekArcade: s.weekArcade,
      weekDuels: s.weekDuels,
    }

  const l = LEAGUES[s.leagueId]
  // grofweg: bots in deze divisie halen gemiddeld dit per week
  const par = 320 + s.leagueId * 190
  let leagueId = s.leagueId
  let promotions = s.promotions
  if (l.promote > 0 && s.weekXp >= par * 1.15) {
    leagueId = Math.min(LEAGUES.length - 1, s.leagueId + 1)
    if (leagueId !== s.leagueId) promotions += 1
  } else if (l.demote > 0 && s.weekXp < par * 0.3) {
    leagueId = Math.max(0, s.leagueId - 1)
  }
  return { leagueWeek: now, weekXp: 0, leagueId, promotions, weekLessons: 0, weekArcade: 0, weekDuels: 0 }
}

export const useStore = create<AureaState>()(
  persist(
    (set, get) => ({
      accounts: {},
      currentUser: null,
      rememberMe: true,
      avatarLook: 'a',

      onboarded: false,
      courseId: 'en',
      dailyGoalXp: 40,
      soundOn: true,

      streak: 0,
      bestStreak: 0,
      lastDay: null,
      freezes: 1,

      todayDay: todayStr(),
      todayXp: 0,
      todayLessons: 0,
      todayPerfect: 0,
      questBonusDay: null,

      progress: {},
      srs: {},

      goals: [],
      goalsDone: [],
      tests: [],

      leagueId: 0,
      leagueWeek: weekIndex(),
      weekXp: 0,
      promotions: 0,

      perfectLessons: 0,
      arcadePlays: 0,
      arcadeBest: {},
      duelsWon: 0,
      duelHistory: [],
      seenBadgeTiers: {},

      boostUntil: 0,
      activeDays: [],

      weekLessons: 0,
      weekArcade: 0,
      weekDuels: 0,
      weekChestWeek: -1,

      completeOnboarding: (c, goalXp) => set({ onboarded: true, courseId: c, dailyGoalXp: goalXp }),

      setCourse: (c) => set({ courseId: c }),

      completeLesson: (c, lessonId, xp, perfect) => {
        const s = get()
        const today = todayStr()
        const prev = s.progress[c] ?? emptyProgress()
        const completed = prev.completed.includes(lessonId) ? prev.completed : [...prev.completed, lessonId]

        // reeks bijwerken — met vergevingsgezinde bevriezing
        let { streak, freezes, lastDay, bestStreak } = s
        if (lastDay !== today) {
          if (lastDay === null) {
            streak = 1
          } else {
            const gap = daysBetween(lastDay, today)
            if (gap === 1) {
              streak += 1
            } else if (gap === 2 && freezes > 0) {
              freezes -= 1
              streak += 1
            } else {
              streak = 1
            }
          }
          lastDay = today
          // elke 7 dagen op rij een bescherming erbij; het maximum groeit mee met je reeks
          const maxFreezes = streak >= 100 ? 4 : streak >= 30 ? 3 : 2
          if (streak > 0 && streak % 7 === 0) freezes = Math.min(maxFreezes, freezes + 1)
          // extra bescherming cadeau op de grote mijlpalen
          if ([30, 60, 100, 200, 365].includes(streak)) freezes = Math.min(maxFreezes, freezes + 1)
        }
        if (streak > bestStreak) bestStreak = streak

        const sameDay = s.todayDay === today
        let todayXp = (sameDay ? s.todayXp : 0) + xp
        const todayLessons = (sameDay ? s.todayLessons : 0) + 1
        const todayPerfect = (sameDay ? s.todayPerfect : 0) + (perfect ? 1 : 0)

        // dagelijkse missies: doel-XP + 2 lessen + 1 foutloze les → bonuskist
        let totalXpForCourse = prev.xp + xp
        let questBonusDay = s.questBonusDay
        const allQuestsDone = todayXp >= s.dailyGoalXp && todayLessons >= 2 && todayPerfect >= 1
        if (allQuestsDone && questBonusDay !== today) {
          totalXpForCourse += 15
          todayXp += 15
          questBonusDay = today
        }

        // persoonlijke doelen evalueren — gehaald? beloning + archiveren
        const otherXp = Object.entries(s.progress)
          .filter(([id]) => id !== c)
          .reduce((sum, [, p]) => sum + (p?.xp ?? 0), 0)
        const ctx = {
          streak,
          totalXp: otherXp + totalXpForCourse,
          completedByCourse: (cid: CourseId) => (cid === c ? completed.length : (s.progress[cid]?.completed ?? []).length),
        }
        const remaining: Goal[] = []
        const doneNow: CompletedGoal[] = []
        for (const g of s.goals) {
          if (goalStatus(g, ctx).done) {
            doneNow.push({
              label: g.label,
              rewardXp: g.rewardXp,
              earlyDays: Math.max(0, daysBetween(today, g.deadline)),
              day: today,
            })
            totalXpForCourse += g.rewardXp
            todayXp += g.rewardXp
          } else {
            remaining.push(g)
          }
        }

        // competitie: alle verdiende XP van deze les telt mee voor de weekstand
        const gainedTotal = totalXpForCourse - prev.xp
        const league = rollWeek(s)

        set({
          progress: { ...s.progress, [c]: { xp: totalXpForCourse, completed } },
          streak,
          bestStreak,
          freezes,
          lastDay,
          todayDay: today,
          todayXp,
          todayLessons,
          todayPerfect,
          questBonusDay,
          goals: remaining,
          goalsDone: [...s.goalsDone, ...doneNow],
          perfectLessons: s.perfectLessons + (perfect ? 1 : 0),
          activeDays: s.activeDays.includes(today) ? s.activeDays : [...s.activeDays.slice(-400), today],
          ...league,
          weekXp: league.weekXp + gainedTotal,
          weekLessons: league.weekLessons + 1,
          // alle dagmissies gehaald? 15 minuten dubbele XP cadeau
          boostUntil: allQuestsDone && s.questBonusDay !== today ? Date.now() + 15 * 60000 : s.boostUntil,
        })
      },

      learnWord: (c, word, nl) => {
        const key = `${c}:${word.toLowerCase()}`
        const s = get()
        if (s.srs[key]) return
        set({ srs: { ...s.srs, [key]: { word, nl, courseId: c, card: newCard() } } })
      },

      reviewWord: (key, good) => {
        const s = get()
        const entry = s.srs[key]
        if (!entry) return
        set({ srs: { ...s.srs, [key]: { ...entry, card: nextCard(entry.card, good) } } })
      },

      addReviewXp: (c, xp) => {
        const s = get()
        const today = todayStr()
        const prev = s.progress[c] ?? emptyProgress()
        set({
          progress: { ...s.progress, [c]: { ...prev, xp: prev.xp + xp } },
          todayDay: today,
          todayXp: (s.todayDay === today ? s.todayXp : 0) + xp,
        })
      },

      addGoal: (g) => {
        const s = get()
        if (s.goals.length >= 3) return
        set({ goals: [...s.goals, g] })
      },

      removeGoal: (id) => set({ goals: get().goals.filter((g) => g.id !== id) }),

      addTestResult: (r) => set({ tests: [...get().tests.slice(-19), r] }),

      awardXp: (xp, opts) => {
        const s = get()
        const today = todayStr()
        const c = s.courseId
        const prev = s.progress[c] ?? emptyProgress()
        const boosted = s.boostUntil > Date.now() ? xp * 2 : xp
        const league = rollWeek(s)
        set({
          progress: { ...s.progress, [c]: { ...prev, xp: prev.xp + boosted } },
          todayDay: today,
          todayXp: (s.todayDay === today ? s.todayXp : 0) + boosted,
          ...league,
          weekXp: league.weekXp + boosted,
          weekArcade: league.weekArcade + (opts?.arcade ? 1 : 0),
          arcadePlays: opts?.arcade ? s.arcadePlays + 1 : s.arcadePlays,
          arcadeBest: opts?.arcade
            ? { ...s.arcadeBest, [opts.arcade]: Math.max(s.arcadeBest[opts.arcade] ?? 0, opts.score ?? 0) }
            : s.arcadeBest,
        })
      },

      recordDuel: (r) => {
        const s = get()
        const league = rollWeek(s)
        set({
          duelHistory: [...s.duelHistory.slice(-19), r],
          duelsWon: s.duelsWon + (r.won ? 1 : 0),
          ...league,
          weekDuels: league.weekDuels + 1,
        })
      },

      claimWeekChest: () => {
        const s = get()
        const week = weekIndex()
        if (s.weekChestWeek === week) return
        const c = s.courseId
        const prev = s.progress[c] ?? emptyProgress()
        const league = rollWeek(s)
        set({
          progress: { ...s.progress, [c]: { ...prev, xp: prev.xp + 100 } },
          ...league,
          weekXp: league.weekXp + 100,
          todayXp: s.todayDay === todayStr() ? s.todayXp + 100 : 100,
          todayDay: todayStr(),
          weekChestWeek: week,
          boostUntil: Math.max(s.boostUntil, Date.now() + 30 * 60000),
        })
      },

      startBoost: (minutes) => set({ boostUntil: Date.now() + minutes * 60000 }),

      markBadgesSeen: (map) => set({ seenBadgeTiers: { ...get().seenBadgeTiers, ...map } }),

      registerAccount: (email, passHash, remember, look) => {
        const key = email.trim().toLowerCase()
        const s = get()
        if (s.accounts[key]) return 'bestaat'
        try {
          sessionStorage.setItem('fluent-session', '1')
        } catch {
          /* geen sessionStorage — rememberMe vangt dit op */
        }
        set({
          accounts: { ...s.accounts, [key]: { email: email.trim(), passHash, createdAt: todayStr() } },
          currentUser: key,
          rememberMe: remember,
          avatarLook: look,
        })
        return 'ok'
      },

      loginAccount: (email, passHash, remember) => {
        const key = email.trim().toLowerCase()
        const acc = get().accounts[key]
        if (!acc || acc.passHash !== passHash) return 'fout'
        try {
          sessionStorage.setItem('fluent-session', '1')
        } catch {
          /* geen sessionStorage — rememberMe vangt dit op */
        }
        set({ currentUser: key, rememberMe: remember })
        return 'ok'
      },

      logout: () => {
        try {
          sessionStorage.removeItem('fluent-session')
        } catch {
          /* niets te verwijderen */
        }
        set({ currentUser: null })
      },

      toggleSound: () => {
        const on = !get().soundOn
        setSoundEnabled(on)
        set({ soundOn: on })
      },

      resetAll: () =>
        set({
          onboarded: false,
          courseId: 'en',
          dailyGoalXp: 40,
          streak: 0,
          bestStreak: 0,
          lastDay: null,
          freezes: 1,
          todayDay: todayStr(),
          todayXp: 0,
          todayLessons: 0,
          todayPerfect: 0,
          questBonusDay: null,
          progress: {},
          srs: {},
          goals: [],
          goalsDone: [],
          tests: [],
          leagueId: 0,
          leagueWeek: weekIndex(),
          weekXp: 0,
          promotions: 0,
          perfectLessons: 0,
          arcadePlays: 0,
          arcadeBest: {},
          duelsWon: 0,
          duelHistory: [],
          seenBadgeTiers: {},
          boostUntil: 0,
          activeDays: [],
          weekLessons: 0,
          weekArcade: 0,
          weekDuels: 0,
          weekChestWeek: -1,
        }),
    }),
    { name: 'aurea-v1' }
  )
)

/* ---------- afgeleide helpers ---------- */

export function courseProgress(state: AureaState, c: CourseId): Progress {
  return state.progress[c] ?? emptyProgress()
}

export function totalXp(state: AureaState): number {
  return Object.values(state.progress).reduce((sum, p) => sum + (p?.xp ?? 0), 0)
}

export function dueEntries(state: AureaState, c: CourseId): [string, SrsEntry][] {
  return Object.entries(state.srs).filter(([, e]) => e.courseId === c && isDue(e.card))
}

export function wordsLearned(state: AureaState, c: CourseId): number {
  return Object.values(state.srs).filter((e) => e.courseId === c).length
}
