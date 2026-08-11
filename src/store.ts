import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card } from 'ts-fsrs'
import type { CourseId } from './types'
import { newCard, nextCard, isDue } from './srs'
import { goalStatus, type CompletedGoal, type Goal } from './goals'
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

  completeOnboarding: (c: CourseId, goalXp: number) => void
  setCourse: (c: CourseId) => void
  completeLesson: (c: CourseId, lessonId: string, xp: number, perfect: boolean) => void
  learnWord: (c: CourseId, word: string, nl: string) => void
  reviewWord: (key: string, good: boolean) => void
  addReviewXp: (c: CourseId, xp: number) => void
  addGoal: (g: Goal) => void
  removeGoal: (id: string) => void
  addTestResult: (r: TestResult) => void
  registerAccount: (email: string, passHash: string, remember: boolean, look: AvatarStyle | Look) => 'ok' | 'bestaat'
  loginAccount: (email: string, passHash: string, remember: boolean) => 'ok' | 'fout'
  logout: () => void
  toggleSound: () => void
  resetAll: () => void
}

const emptyProgress = (): Progress => ({ xp: 0, completed: [] })

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
          // elke 7 dagen op rij: een bevriezing erbij (max 2)
          if (streak > 0 && streak % 7 === 0) freezes = Math.min(2, freezes + 1)
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
