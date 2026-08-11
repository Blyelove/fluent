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
]

export function levelTitle(level: number): string {
  return level <= TITLES.length ? TITLES[level - 1] : 'Legende'
}

/**
 * XP-kosten per niveau: begint laag (snelle eerste winst), maar groeit 35% per
 * niveau — hoog komen is een échte prestatie. Nv1→2: 50 XP, Nv9→10: ~555 XP,
 * cumulatief tot niveau 10 ≈ 2.000 XP (weken werk).
 */
export function xpCost(level: number): number {
  return Math.round((50 * Math.pow(1.35, level - 1)) / 5) * 5
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

export function wardrobeFor(c: CourseId): { level: number; item: string }[] {
  return ITEM_NAMES[c].map((item, i) => ({ level: i + 2, item }))
}

export function levelReward(c: CourseId, level: number): string | null {
  return level >= 2 && level <= 10 ? ITEM_NAMES[c][level - 2] : null
}

/** De eerstvolgende unlock boven dit niveau (voor anticipatie) */
export function nextReward(c: CourseId, level: number): { level: number; item: string } | null {
  return wardrobeFor(c).find((w) => w.level > level) ?? null
}
