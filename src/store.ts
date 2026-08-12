import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card } from 'ts-fsrs'
import type { CourseId } from './types'
import { newCard, nextCard, isDue } from './srs'
import { goalStatus, type CompletedGoal, type Goal } from './goals'
import type { DuelRecord } from './duel'
import { mistakeKey, type MistakeRef } from './mistakes'
import { LEAGUES, eindstand, weekIndex, yourRank, zoneFor } from './leagues'
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
  /** De bewaarde voortgang per account, zodat niemands data ooit overschreven wordt */
  profiles: Record<string, Profiel>
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
  /** Hoeveel eigen fouten je vandaag hebt rechtgezet */
  todayFixed: number
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

  /** Oefeningen die je fout had, om gericht te herhalen */
  mistakes: MistakeRef[]

  /** Laatste dag dat je de app opende (los van of je toen leerde) */
  lastSeenDay: string | null
  /** Aantal dagen dat je weg was bij je laatste terugkeer; 0 = niets te melden */
  comebackDays: number

  /* ---- weekmissies ---- */
  weekLessons: number
  weekArcade: number
  weekDuels: number
  /** Week waarin de grote weekkist al is geopend */
  weekChestWeek: number
  /** Uitslag van de vorige competitieweek, tot hij is weggeklikt */
  weekUitslag: WeekUitslag | null
  clearWeekUitslag: () => void

  /* ---- de wereldreis ---- */
  /** Per cursus: hoeveel veroveringen je op de kaart al gevierd hebt gezien */
  worldSeen: Partial<Record<CourseId, number>>
  markWorldSeen: (c: CourseId, count: number) => void

  /** Namen van oefenbots die je al verslagen hebt — een ladder om te beklimmen */
  botsVerslagen: string[]
  markBotVerslagen: (naam: string) => void

  completeOnboarding: (c: CourseId, goalXp: number) => void
  /** Je dagdoel aanpassen — kan altijd, niet alleen tijdens de onboarding */
  setDailyGoal: (xp: number) => void
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
  /** Bij het openen van de app: kijkt of je terugkomt na een paar dagen weg */
  registerVisit: () => void
  /** Het welkom-terug-bericht wegklikken */
  dismissComeback: () => void
  /** Een fout onthouden zodat je hem gericht kunt herhalen */
  addMistake: (c: CourseId, lessonId: string, index: number) => void
  /** Fout weghalen zodra je hem in een fouten-sessie goed hebt */
  clearMistake: (key: string) => void
  startBoost: (minutes: number) => void
  markBadgesSeen: (map: Record<string, number>) => void
  registerAccount: (email: string, passHash: string, remember: boolean, look: AvatarStyle | Look) => 'ok' | 'bestaat'
  loginAccount: (email: string, passHash: string, remember: boolean) => 'ok' | 'fout'
  logout: () => void
  toggleSound: () => void
  /** Je personage aanpassen — kan altijd, niet alleen bij registratie */
  setAvatarLook: (look: AvatarStyle) => void
  resetAll: () => void
}

const emptyProgress = (): Progress => ({ xp: 0, completed: [] })

/**
 * Alles wat bij ÉÉN account hoort. Wat hier niet in staat, is apparaatbreed:
 * de accountlijst zelf, wie er ingelogd is, "ingelogd blijven" en het geluid.
 *
 * Waarom dit bestaat: eerder deelden alle accounts op één apparaat dezelfde
 * voortgang. Maakte een vriend een account aan op jouw telefoon, dan nam die
 * jouw XP, reeks en lessen over, en schreef er daarna overheen. Nu krijgt elk
 * account zijn eigen profiel, bewaard onder zijn eigen sleutel.
 */
export type Profiel = Pick<
  AureaState,
  | 'avatarLook'
  | 'onboarded'
  | 'courseId'
  | 'dailyGoalXp'
  | 'streak'
  | 'bestStreak'
  | 'lastDay'
  | 'freezes'
  | 'todayDay'
  | 'todayXp'
  | 'todayLessons'
  | 'todayPerfect'
  | 'todayFixed'
  | 'questBonusDay'
  | 'progress'
  | 'srs'
  | 'goals'
  | 'goalsDone'
  | 'tests'
  | 'leagueId'
  | 'leagueWeek'
  | 'weekXp'
  | 'promotions'
  | 'perfectLessons'
  | 'arcadePlays'
  | 'arcadeBest'
  | 'duelsWon'
  | 'duelHistory'
  | 'seenBadgeTiers'
  | 'boostUntil'
  | 'activeDays'
  | 'mistakes'
  | 'lastSeenDay'
  | 'comebackDays'
  | 'weekLessons'
  | 'weekArcade'
  | 'weekDuels'
  | 'weekChestWeek'
  | 'weekUitslag'
  | 'worldSeen'
  | 'botsVerslagen'
>

/** Een kersvers profiel: waar elk nieuw account mee begint */
function nieuwProfiel(): Profiel {
  return {
    avatarLook: 'a',
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
    todayFixed: 0,
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
    mistakes: [],
    lastSeenDay: null,
    comebackDays: 0,

    weekLessons: 0,
    weekArcade: 0,
    weekDuels: 0,
    weekChestWeek: -1,
    weekUitslag: null,
    worldSeen: {},
    botsVerslagen: [],
  }
}

/** De huidige voortgang uit de actieve state plukken, om onder een account te bewaren */
function pakProfiel(s: AureaState): Profiel {
  const leeg = nieuwProfiel()
  const uit = {} as Record<string, unknown>
  for (const sleutel of Object.keys(leeg)) uit[sleutel] = (s as unknown as Record<string, unknown>)[sleutel]
  return uit as Profiel
}

/**
 * Rolt de competitieweek door als er een nieuwe week is begonnen:
 * bij genoeg XP promoveer je, bij te weinig zak je terug.
 * Geeft de bij te werken velden terug (weekXp is dan al gereset).
 */
/** Uitslag van de afgelopen competitieweek, te tonen tot hij is weggeklikt */
export interface WeekUitslag {
  /** Plek 1-30 in de eindstand */
  rank: number
  /** Divisie waarin die week gespeeld werd */
  leagueId: number
  /** Divisie waar je nu in zit */
  nieuwLeagueId: number
  uitkomst: 'promotie' | 'veilig' | 'degradatie'
}

interface WeekState {
  leagueWeek: number
  weekXp: number
  leagueId: number
  promotions: number
  weekLessons: number
  weekArcade: number
  weekDuels: number
  weekUitslag: WeekUitslag | null
}

interface ReeksState {
  streak: number
  bestStreak: number
  freezes: number
  lastDay: string | null
  activeDays: string[]
}

/**
 * De reeks, de bescherming en de kalender bijwerken voor vandaag.
 *
 * Dit stond eerst alleen in completeLesson, waardoor een dag vol herhalen,
 * fouten wegwerken, toetsen of minigames 's nachts alsnog je reeks brak en een
 * leeg vakje op de kalender achterliet. De app belooft nergens dat alleen
 * lessen tellen — en een gebroken belofte voelt als straf, precies wat hier
 * niet mag. Iedere leeractiviteit loopt nu door deze functie.
 */
function registreerLeerdag(s: ReeksState, today: string): ReeksState {
  if (s.lastDay === today) {
    // vandaag al geteld — alleen de kalender nog zeker stellen
    return {
      streak: s.streak,
      bestStreak: Math.max(s.bestStreak, s.streak),
      freezes: s.freezes,
      lastDay: s.lastDay,
      activeDays: s.activeDays.includes(today) ? s.activeDays : [...s.activeDays.slice(-400), today],
    }
  }

  let streak: number
  let freezes = s.freezes
  if (s.lastDay === null) {
    streak = 1
  } else {
    const gap = daysBetween(s.lastDay, today)
    if (gap === 1) {
      streak = s.streak + 1
    } else if (gap === 2 && freezes > 0) {
      freezes -= 1
      streak = s.streak + 1
    } else {
      streak = 1
    }
  }

  // elke 7 dagen op rij een bescherming erbij; het maximum groeit mee met je reeks
  const maxFreezes = streak >= 100 ? 4 : streak >= 30 ? 3 : 2
  if (streak > 0 && streak % 7 === 0) freezes = Math.min(maxFreezes, freezes + 1)
  // extra bescherming cadeau op de grote mijlpalen
  if ([30, 60, 100, 200, 365].includes(streak)) freezes = Math.min(maxFreezes, freezes + 1)

  return {
    streak,
    bestStreak: Math.max(s.bestStreak, streak),
    freezes,
    lastDay: today,
    activeDays: s.activeDays.includes(today) ? s.activeDays : [...s.activeDays.slice(-400), today],
  }
}

/**
 * Dubbele XP geldt voor ALLES wat je verdient, niet alleen voor de speelhal.
 * De bonus werd beloofd bij de dagmissies, bij de weekkist en bij een comeback,
 * maar werkte tot nu toe niet in een les of een herhaling — dus juist niet waar
 * de gebruiker hem het hardst verwacht.
 */
function metBoost(boostUntil: number, xp: number): number {
  return boostUntil > Date.now() ? xp * 2 : xp
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
      weekUitslag: s.weekUitslag,
    }

  // promotie en degradatie volgen de EINDSTAND van de ranglijst die je de
  // hele week zag — niet een verborgen XP-drempel. Wie bij de promotieplekken
  // eindigt, promoveert; wie in de degradatiezone eindigt, zakt.
  const stand = eindstand(s.leagueId, s.weekXp, s.leagueWeek)
  const rank = yourRank(stand)
  const uitkomst = zoneFor(s.leagueId, rank)
  let leagueId = s.leagueId
  let promotions = s.promotions
  if (uitkomst === 'promotie') {
    leagueId = Math.min(LEAGUES.length - 1, s.leagueId + 1)
    if (leagueId !== s.leagueId) promotions += 1
  } else if (uitkomst === 'degradatie') {
    leagueId = Math.max(0, s.leagueId - 1)
  }
  // deed je vorige week niets (0 XP), dan is er geen uitslag om te vieren of
  // te betreuren — stil doorrollen, geen scherm
  const weekUitslag: WeekUitslag | null = s.weekXp > 0 ? { rank, leagueId: s.leagueId, nieuwLeagueId: leagueId, uitkomst } : null
  return { leagueWeek: now, weekXp: 0, leagueId, promotions, weekLessons: 0, weekArcade: 0, weekDuels: 0, weekUitslag }
}

export const useStore = create<AureaState>()(
  persist(
    (set, get) => ({
      // apparaatbreed: geldt voor iedereen die deze telefoon gebruikt
      accounts: {},
      profiles: {},
      currentUser: null,
      rememberMe: true,
      soundOn: true,

      // en hier de voortgang van wie er nu ingelogd is
      ...nieuwProfiel(),

      completeOnboarding: (c, goalXp) => set({ onboarded: true, courseId: c, dailyGoalXp: goalXp }),

      // je dagdoel mag altijd mee veranderen met je leven, niet alleen bij de start
      setDailyGoal: (xp) => set({ dailyGoalXp: Math.min(200, Math.max(10, Math.round(xp))) }),

      setCourse: (c) => set({ courseId: c }),

      completeLesson: (c, lessonId, xp, perfect) => {
        const s = get()
        const today = todayStr()
        const prev = s.progress[c] ?? emptyProgress()
        const completed = prev.completed.includes(lessonId) ? prev.completed : [...prev.completed, lessonId]

        // reeks, bescherming en kalender — gedeeld met herhalen, toetsen en spelen
        const reeks = registreerLeerdag(s, today)
        const { streak, bestStreak, freezes, lastDay } = reeks

        // dubbele XP telt ook hier: dat was de hele belofte van de bonus
        const verdiend = metBoost(s.boostUntil, xp)

        const sameDay = s.todayDay === today
        let todayXp = (sameDay ? s.todayXp : 0) + verdiend
        const todayLessons = (sameDay ? s.todayLessons : 0) + 1
        const todayPerfect = (sameDay ? s.todayPerfect : 0) + (perfect ? 1 : 0)
        const todayFixed = sameDay ? s.todayFixed : 0

        // dagelijkse missies: doel-XP + 2 lessen + (foutloze les OF 3 fouten rechtgezet) → bonuskist
        let totalXpForCourse = prev.xp + verdiend
        let questBonusDay = s.questBonusDay
        const allQuestsDone = todayXp >= s.dailyGoalXp && todayLessons >= 2 && (todayPerfect >= 1 || todayFixed >= 3)
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
          todayFixed,
          questBonusDay,
          goals: remaining,
          goalsDone: [...s.goalsDone, ...doneNow],
          perfectLessons: s.perfectLessons + (perfect ? 1 : 0),
          activeDays: reeks.activeDays,
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
        const verdiend = metBoost(s.boostUntil, xp)
        // herhalen, je fouten wegwerken en een toets zijn net zo goed leren als
        // een les: ze houden je reeks in leven en tellen mee voor je divisie
        const reeks = registreerLeerdag(s, today)
        const league = rollWeek(s)
        set({
          progress: { ...s.progress, [c]: { ...prev, xp: prev.xp + verdiend } },
          ...reeks,
          todayDay: today,
          todayXp: (s.todayDay === today ? s.todayXp : 0) + verdiend,
          ...league,
          weekXp: league.weekXp + verdiend,
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
        const boosted = metBoost(s.boostUntil, xp)
        // ook een potje in de speelhal houdt je reeks in leven
        const reeks = registreerLeerdag(s, today)
        const league = rollWeek(s)
        set({
          progress: { ...s.progress, [c]: { ...prev, xp: prev.xp + boosted } },
          ...reeks,
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

      registerVisit: () => {
        const s = get()
        const today = todayStr()
        // de competitieweek rolt door zodra je de app ópent, niet pas bij je
        // eerste voltooide les. Anders zie je maandagochtend nog de stand van
        // vorige week, met valse promotie-verwachting — en kon je de weekkist
        // claimen met oude voortgang, waarmee je de kist van de nieuwe week
        // opbrandde.
        const league = rollWeek(s)
        const weekGerold = league.leagueWeek !== s.leagueWeek
        if (s.lastSeenDay === today && !weekGerold) return
        const weg = s.lastSeenDay ? daysBetween(s.lastSeenDay, today) : 0
        // twee dagen of langer weg? dan een warm welkom en een half uur dubbele XP cadeau
        if (weg >= 2) {
          set({ ...league, lastSeenDay: today, comebackDays: weg, boostUntil: Math.max(s.boostUntil, Date.now() + 30 * 60000) })
        } else {
          set({ ...league, lastSeenDay: today })
        }
      },

      dismissComeback: () => set({ comebackDays: 0 }),

      addMistake: (c, lessonId, index) => {
        const s = get()
        const key = mistakeKey({ c, l: lessonId, i: index })
        const bestaand = s.mistakes.find((m) => mistakeKey(m) === key)
        if (bestaand) {
          set({
            mistakes: s.mistakes.map((m) => (mistakeKey(m) === key ? { ...m, n: m.n + 1, t: Date.now() } : m)),
          })
          return
        }
        // hoogstens 60 bewaren: de oudste valt af zodat de opslag klein blijft
        const nieuw: MistakeRef = { c, l: lessonId, i: index, n: 1, t: Date.now() }
        const lijst = [...s.mistakes, nieuw]
        set({ mistakes: lijst.length > 60 ? lijst.slice(lijst.length - 60) : lijst })
      },

      clearMistake: (key) => {
        const s = get()
        const today = todayStr()
        const sameDay = s.todayDay === today
        set({
          mistakes: s.mistakes.filter((m) => mistakeKey(m) !== key),
          todayDay: today,
          todayFixed: (sameDay ? s.todayFixed : 0) + 1,
          // dag gewisseld? dan tellen de andere dagtellers ook opnieuw
          todayXp: sameDay ? s.todayXp : 0,
          todayLessons: sameDay ? s.todayLessons : 0,
          todayPerfect: sameDay ? s.todayPerfect : 0,
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
          // de voortgang van wie er nu inlogde eerst veilig wegzetten, anders
          // zou het nieuwe account zijn XP en reeks erven
          profiles: s.currentUser ? { ...s.profiles, [s.currentUser]: pakProfiel(s) } : s.profiles,
          currentUser: key,
          rememberMe: remember,
          // een nieuw account begint schoon, met het gekozen personage
          ...nieuwProfiel(),
          avatarLook: look,
        })
        return 'ok'
      },

      loginAccount: (email, passHash, remember) => {
        const key = email.trim().toLowerCase()
        const s = get()
        const acc = s.accounts[key]
        if (!acc || acc.passHash !== passHash) return 'fout'
        try {
          sessionStorage.setItem('fluent-session', '1')
        } catch {
          /* geen sessionStorage — rememberMe vangt dit op */
        }
        // huidige voortgang bewaren, daarna die van dit account terugzetten
        const bewaard = s.currentUser ? { ...s.profiles, [s.currentUser]: pakProfiel(s) } : s.profiles
        const eigen = bewaard[key]
        set({
          profiles: bewaard,
          currentUser: key,
          rememberMe: remember,
          ...(eigen ?? nieuwProfiel()),
        })
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

      setAvatarLook: (look) => set({ avatarLook: look }),

      clearWeekUitslag: () => set({ weekUitslag: null }),

      markWorldSeen: (c, count) => set({ worldSeen: { ...get().worldSeen, [c]: count } }),

      // eenmaal verslagen blijft verslagen: vrijspelen mag, afpakken nooit
      markBotVerslagen: (naam) => {
        const s = get()
        if (s.botsVerslagen.includes(naam)) return
        set({ botsVerslagen: [...s.botsVerslagen, naam] })
      },

      // alleen het profiel van dit account wissen; de personagekeuze en de
      // accounts van anderen op dit apparaat blijven staan
      resetAll: () => set({ ...nieuwProfiel(), avatarLook: get().avatarLook }),
    }),
    {
      name: 'aurea-v1',
      /**
       * Versienummer van de opslag. Verandert de vorm van de gegevens ooit,
       * dan draait migrate() en blijft bestaande voortgang behouden. Zonder
       * dit zou één verkeerde wijziging iedereen zijn account kosten.
       */
      version: 2,
      migrate: (opgeslagen) => opgeslagen as AureaState,
      /**
       * Bij elke wijziging schrijven we de actieve voortgang meteen onder het
       * ingelogde account. Zo staat er altijd een actuele kopie klaar, ook als
       * de app onverwacht sluit.
       */
      partialize: (s) => {
        const profiel = pakProfiel(s)
        return {
          accounts: s.accounts,
          currentUser: s.currentUser,
          rememberMe: s.rememberMe,
          soundOn: s.soundOn,
          profiles: s.currentUser ? { ...s.profiles, [s.currentUser]: profiel } : s.profiles,
          // ook los meeschrijven: zo blijft een oude opslag zonder profielen werken
          ...profiel,
        } as unknown as AureaState
      },
      /**
       * Bij het opstarten laden we het profiel van wie er ingelogd is. Velden
       * die nog niet bestonden krijgen automatisch hun nieuwe standaardwaarde,
       * dus een update voegt hooguit iets toe en haalt nooit iets weg.
       */
      merge: (opgeslagenRuw, huidig) => {
        const p = (opgeslagenRuw ?? {}) as Partial<AureaState>
        const basis = { ...huidig, ...p }
        const eigen = p.currentUser ? p.profiles?.[p.currentUser] : undefined
        return eigen ? { ...basis, ...eigen } : basis
      },
    }
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
