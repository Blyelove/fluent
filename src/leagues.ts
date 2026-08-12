/**
 * Wekelijkse competitie — Duolingo's league-systeem, maar eerlijker:
 * 30 spelers per divisie, ranglijst op weekXP, promotie/degradatie op zondag.
 * Tegenstanders zijn realistische bots die door de week heen XP verdienen,
 * deterministisch afgeleid van het weeknummer (dus stabiel bij herladen).
 */

export interface League {
  id: number
  name: string
  color: string
  /** Aantal spelers dat promoveert */
  promote: number
  /** Aantal spelers dat degradeert (onderaan) */
  demote: number
}

export const LEAGUES: League[] = [
  { id: 0, name: 'Brons', color: '#CD7F32', promote: 15, demote: 0 },
  { id: 1, name: 'Zilver', color: '#C0C0C0', promote: 12, demote: 4 },
  { id: 2, name: 'Goud', color: '#FFC53D', promote: 10, demote: 5 },
  { id: 3, name: 'Saffier', color: '#3B82F6', promote: 8, demote: 5 },
  { id: 4, name: 'Robijn', color: '#EF4444', promote: 7, demote: 5 },
  { id: 5, name: 'Smaragd', color: '#10B981', promote: 7, demote: 5 },
  { id: 6, name: 'Amethist', color: '#A855F7', promote: 6, demote: 6 },
  { id: 7, name: 'Parel', color: '#F0ABFC', promote: 5, demote: 6 },
  { id: 8, name: 'Obsidiaan', color: '#6B7280', promote: 5, demote: 7 },
  { id: 9, name: 'Diamant', color: '#22D3EE', promote: 0, demote: 7 },
]

const NAMES = [
  'Sanne', 'Daan', 'Emma', 'Lucas', 'Julia', 'Sem', 'Tess', 'Finn', 'Noa', 'Milan',
  'Lotte', 'Bram', 'Sara', 'Thijs', 'Anna', 'Ruben', 'Fleur', 'Jesse', 'Eva', 'Cas',
  'Lieke', 'Stijn', 'Roos', 'Tim', 'Maud', 'Joris', 'Isa', 'Niels', 'Lynn', 'Sven',
  'Yara', 'Mees', 'Sofie', 'Luuk', 'Nina', 'Gijs', 'Amber', 'Teun', 'Iris', 'Jort',
]

const AVATAR_COLORS = ['#EC4899', '#A855F7', '#22D3EE', '#FFC53D', '#4ADE80', '#FB7185', '#818CF8', '#F97316']

/** Weeknummer sinds epoch — de competitie reset elke maandag */
export function weekIndex(now = new Date()): number {
  const ms = now.getTime() - now.getTimezoneOffset() * 60000
  // 1970-01-01 was een donderdag; +3 dagen zodat weken op maandag beginnen
  return Math.floor((ms / 86400000 + 3) / 7)
}

/** Dagen sinds maandag (0 = maandag … 6 = zondag) */
export function dayOfWeek(now = new Date()): number {
  return (now.getDay() + 6) % 7
}

/** Uren tot het einde van de competitieweek (zondag 23:59) */
export function hoursLeftInWeek(now = new Date()): number {
  const end = new Date(now)
  end.setDate(end.getDate() + (6 - dayOfWeek(now)))
  end.setHours(23, 59, 59, 999)
  return Math.max(0, Math.round((end.getTime() - now.getTime()) / 3600000))
}

/** Deterministische pseudo-random (0-1) uit twee getallen */
function rnd(a: number, b: number): number {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export interface Competitor {
  name: string
  xp: number
  color: string
  isYou: boolean
}

/**
 * De ranglijst van jouw divisie deze week.
 * Bots verdienen meer XP naarmate de divisie hoger is, en bouwen dat
 * geleidelijk op door de week heen — zodat je positie realistisch schuift.
 */
export function standings(leagueId: number, yourWeekXp: number, now = new Date()): Competitor[] {
  const week = weekIndex(now)
  const day = dayOfWeek(now)
  const hour = now.getHours()
  // hoe ver de week gevorderd is (0-1), inclusief de lopende dag
  const progress = Math.min(1, (day + hour / 24) / 7)
  return standingsVoor(leagueId, yourWeekXp, week, progress)
}

/**
 * De EINDstand van een afgelopen week: dezelfde deterministische bots, maar
 * op volle weekvoortgang. Promotie en degradatie worden hieruit afgeleid,
 * zodat de uitslag exact de ranglijst volgt die je de hele week zag.
 */
export function eindstand(leagueId: number, yourWeekXp: number, week: number): Competitor[] {
  return standingsVoor(leagueId, yourWeekXp, week, 1)
}

function standingsVoor(leagueId: number, yourWeekXp: number, week: number, progress: number): Competitor[] {
  // hoger niveau = fanatiekere tegenstanders
  const base = 320 + leagueId * 190

  const bots: Competitor[] = []
  for (let i = 0; i < 29; i++) {
    const seed = rnd(week * 100 + leagueId, i)
    const seed2 = rnd(i * 7 + leagueId, week)
    // spreiding: sommigen zijn fanatiek, anderen doen bijna niets
    const weekTotal = Math.round(base * (0.25 + seed * 1.75))
    // niet iedereen speelt elke dag even hard
    const pace = 0.75 + seed2 * 0.5
    bots.push({
      name: NAMES[(i + week * 3 + leagueId * 5) % NAMES.length],
      xp: Math.max(0, Math.round(weekTotal * Math.min(1, progress * pace))),
      color: AVATAR_COLORS[(i + leagueId) % AVATAR_COLORS.length],
      isYou: false,
    })
  }

  bots.push({ name: 'Jij', xp: yourWeekXp, color: '#EC4899', isYou: true })
  return bots.sort((a, b) => b.xp - a.xp || (a.isYou ? -1 : 1))
}

export function yourRank(list: Competitor[]): number {
  return list.findIndex((c) => c.isYou) + 1
}

export type ZoneKind = 'promotie' | 'veilig' | 'degradatie'

export function zoneFor(leagueId: number, rank: number): ZoneKind {
  const l = LEAGUES[leagueId]
  if (l.promote > 0 && rank <= l.promote) return 'promotie'
  if (l.demote > 0 && rank > 30 - l.demote) return 'degradatie'
  return 'veilig'
}

/** XP die je nodig hebt om de eerstvolgende plek te pakken */
export function xpToClimb(list: Competitor[]): number | null {
  const i = list.findIndex((c) => c.isYou)
  if (i <= 0) return null
  return Math.max(1, list[i - 1].xp - list[i].xp + 1)
}
