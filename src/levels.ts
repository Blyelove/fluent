import type { CourseId } from './types'

/** XP-niveaucurve met titels — elk niveau kost iets meer dan het vorige */

const TITLES = [
  'Nieuwkomer',
  'Ontdekker',
  'Reiziger',
  'Verkenner',
  'Kenner',
  'Gevorderde',
  'Expert',
  'Virtuoos',
  'Meester',
  'Grootmeester',
  'Legende',
  'Elite',
  'Kampioen',
  'Ster',
  'Idool',
  'Fenomeen',
  'Titaan',
  'Onsterfelijke',
  'Mythe',
  'Ultiem Fluent',
]

export const MAX_LEVEL = TITLES.length

export function levelTitle(level: number): string {
  return level <= TITLES.length ? TITLES[level - 1] : 'Ultiem Fluent'
}

/**
 * XP-kosten per niveau: begint laag (snelle eerste winst), groeit 35% per
 * niveau tot 10 (Nv1→2: 50 XP, Nv9→10: ~745 XP), daarna 15% per niveau —
 * de weg naar niveau 20 is een lange, ultra-verslavende berg (±17.000 XP).
 */
export function xpCost(level: number): number {
  if (level <= 10) return Math.round((50 * Math.pow(1.35, level - 1)) / 5) * 5
  return Math.round((xpCost(10) * Math.pow(1.15, level - 10)) / 5) * 5
}

/** Cumulatieve XP nodig om dit niveau te BEREIKEN (niveau 1 = 0 XP) */
export function xpToReach(level: number): number {
  let total = 0
  for (let l = 1; l < level; l++) total += xpCost(l)
  return total
}

export function levelForXp(xp: number): number {
  let level = 1
  while (xp >= xpToReach(level + 1)) level++
  return level
}

export function levelProgress(xp: number): { level: number; current: number; needed: number; frac: number } {
  const level = levelForXp(xp)
  const cur = xpToReach(level)
  const next = xpToReach(level + 1)
  return { level, current: xp - cur, needed: next - cur, frac: (xp - cur) / (next - cur) }
}

/**
 * Per taal een eigen culturele transformatie: jouw personage wordt met elk
 * niveau meer "van die cultuur". Index 0 = niveau 2, t/m niveau 10.
 */
const ITEM_NAMES: Record<CourseId, [string, string, string, string, string, string, string, string, string]> = {
  es: ['Rode halsdoek', 'Cordobés-hoed', 'Flamenco-outfit', 'Spaanse gitaar', 'Zonnebril', 'Spanje-embleem', 'Vlaggen-cape', 'Gouden aura', 'Spaanse kroon'],
  fr: ['Franse halsdoek', 'Baret', 'Marinière', 'Stokbrood', 'Zonnebril', 'Frankrijk-embleem', 'Vlaggen-cape', 'Gouden aura', 'Franse kroon'],
  de: ['Duitse halsdoek', 'Tirolerhoed', 'Trachten-outfit', 'Pretzel', 'Zonnebril', 'Duitsland-embleem', 'Vlaggen-cape', 'Gouden aura', 'Duitse kroon'],
  it: ['Italiaanse halsdoek', 'Coppola-pet', 'Italiaanse stijl', 'Pizzapunt', 'Zonnebril', 'Italië-embleem', 'Vlaggen-cape', 'Gouden aura', 'Italiaanse kroon'],
  en: ['Britse halsdoek', 'Bowlerhoed', 'Britse stijl', 'Paraplu', 'Zonnebril', 'VK-embleem', 'Vlaggen-cape', 'Gouden aura', 'Britse kroon'],
  pt: ['Portugese halsdoek', 'Vissersmuts', 'Portugese stijl', 'Voetbal', 'Zonnebril', 'Portugal-embleem', 'Vlaggen-cape', 'Gouden aura', 'Portugese kroon'],
}

/** Niveau 11-20: universele prestige-upgrades — steeds vetter, voor elke taal */
const PRESTIGE_ITEMS = [
  'Gouden ketting',
  'Neon-outfit',
  'Vuur-aura',
  'Diamanten horloge',
  'Platina kroon',
  'Energievleugels',
  'Bliksem-aura',
  'Sterrenmantel',
  'Kosmische gloed',
  'Legende-halo',
] as const

export function wardrobeFor(c: CourseId): { level: number; item: string }[] {
  return [
    ...ITEM_NAMES[c].map((item, i) => ({ level: i + 2, item })),
    ...PRESTIGE_ITEMS.map((item, i) => ({ level: i + 11, item })),
  ]
}

export function levelReward(c: CourseId, level: number): string | null {
  if (level >= 2 && level <= 10) return ITEM_NAMES[c][level - 2]
  if (level >= 11 && level <= 20) return PRESTIGE_ITEMS[level - 11]
  return null
}

/** De eerstvolgende unlock boven dit niveau (voor anticipatie) */
export function nextReward(c: CourseId, level: number): { level: number; item: string } | null {
  return wardrobeFor(c).find((w) => w.level > level) ?? null
}
