/**
 * Prestatie-badges met 5 tiers elk — de verzamelkast.
 * Elke badge telt een statistiek en heeft oplopende drempels, zodat er
 * altijd een volgende mijlpaal binnen bereik ligt.
 */

export interface BadgeDef {
  id: string
  name: string
  icon: string
  color: string
  /** Wat je moet doen, in gewone taal */
  desc: string
  tiers: number[]
  /** Naam per tier (1-5) */
  tierNames: [string, string, string, string, string]
}

export const BADGES: BadgeDef[] = [
  {
    id: 'streak',
    name: 'Vuurspuwer',
    icon: '🔥',
    color: '#F97316',
    desc: 'Dagen op rij geleerd',
    tiers: [3, 7, 30, 100, 365],
    tierNames: ['Vonk', 'Vlam', 'Vuurbal', 'Inferno', 'Eeuwige vlam'],
  },
  {
    id: 'xp',
    name: 'Puntenjager',
    icon: '⚡',
    color: 'var(--gold)',
    desc: 'Totaal XP verdiend',
    tiers: [100, 500, 2000, 7500, 20000],
    tierNames: ['Starter', 'Verzamelaar', 'Jager', 'Grootverdiener', 'XP-koning'],
  },
  {
    id: 'words',
    name: 'Woordenaar',
    icon: '📚',
    color: 'var(--cyan)',
    desc: 'Woorden geleerd',
    tiers: [25, 100, 300, 750, 1500],
    tierNames: ['Beginner', 'Leergierig', 'Belezen', 'Geleerde', 'Wandelend woordenboek'],
  },
  {
    id: 'perfect',
    name: 'Scherpschutter',
    icon: '🎯',
    color: '#4ADE80',
    desc: 'Foutloze lessen',
    tiers: [1, 10, 50, 150, 400],
    tierNames: ['Raak', 'Precies', 'Sluipschutter', 'Feilloos', 'Perfectionist'],
  },
  {
    id: 'countries',
    name: 'Wereldreiziger',
    icon: '🌍',
    color: 'var(--hot1)',
    desc: 'Landen veroverd',
    tiers: [1, 3, 6, 10, 14],
    tierNames: ['Toerist', 'Reiziger', 'Ontdekker', 'Globetrotter', 'Wereldveroveraar'],
  },
  {
    id: 'duels',
    name: 'Duellist',
    icon: '⚔️',
    color: '#FB7185',
    desc: 'Duels gewonnen van vrienden',
    tiers: [1, 5, 15, 40, 100],
    tierNames: ['Uitdager', 'Winnaar', 'Kampioen', 'Meester', 'Onverslaanbaar'],
  },
  {
    id: 'league',
    name: 'Divisiebeest',
    icon: '🏆',
    color: 'var(--gold)',
    desc: 'Keer gepromoveerd',
    tiers: [1, 3, 5, 7, 9],
    tierNames: ['Klimmer', 'Stijger', 'Doorbraak', 'Elite', 'Diamant'],
  },
  {
    id: 'arcade',
    name: 'Arcade-held',
    icon: '🕹️',
    color: '#818CF8',
    desc: 'Minigames gespeeld',
    tiers: [1, 10, 30, 75, 200],
    tierNames: ['Speler', 'Gamer', 'Fanaat', 'Arcade-rat', 'Legende'],
  },
  {
    id: 'tests',
    name: 'Examenkoning',
    icon: '📝',
    color: '#F0ABFC',
    desc: 'Toetsen gehaald',
    tiers: [1, 5, 15, 35, 80],
    tierNames: ['Geslaagd', 'Zeker', 'Routinier', 'Expert', 'Professor'],
  },
  {
    id: 'goals',
    name: 'Doelgericht',
    icon: '🚀',
    color: '#34D399',
    desc: 'Persoonlijke doelen gehaald',
    tiers: [1, 5, 12, 25, 50],
    tierNames: ['Gestart', 'Volhouder', 'Doorzetter', 'Winnaar', 'Onstuitbaar'],
  },
]

export interface BadgeState {
  def: BadgeDef
  value: number
  /** 0 = nog niets, 1-5 = behaalde tier */
  tier: number
  next: number | null
  frac: number
}

export interface BadgeStats {
  streak: number
  xp: number
  words: number
  perfect: number
  countries: number
  duels: number
  league: number
  arcade: number
  tests: number
  goals: number
}

export function badgeState(def: BadgeDef, value: number): BadgeState {
  let tier = 0
  for (let i = 0; i < def.tiers.length; i++) if (value >= def.tiers[i]) tier = i + 1
  const next = tier < def.tiers.length ? def.tiers[tier] : null
  const prev = tier > 0 ? def.tiers[tier - 1] : 0
  const frac = next === null ? 1 : Math.min(1, (value - prev) / (next - prev))
  return { def, value, tier, next, frac }
}

export function allBadges(stats: BadgeStats): BadgeState[] {
  return BADGES.map((d) => badgeState(d, (stats as unknown as Record<string, number>)[d.id] ?? 0))
}

/** Totaal aantal behaalde tiers — je "verzamelscore" */
export function badgePoints(list: BadgeState[]): number {
  return list.reduce((sum, b) => sum + b.tier, 0)
}
