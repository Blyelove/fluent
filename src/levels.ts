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

/** Wat Auro per niveau verdient — de garderobe die spelers verzamelen */
export const WARDROBE: { level: number; item: string }[] = [
  { level: 2, item: 'Bordeauxrode sjaal' },
  { level: 3, item: 'Gouden monocle' },
  { level: 4, item: 'Gouden kroontje' },
  { level: 5, item: 'Koninklijke cape' },
  { level: 6, item: 'Glanzende manen' },
  { level: 7, item: 'Gouden medaille' },
  { level: 8, item: 'Juwelenkroon' },
  { level: 9, item: 'Gouden aura' },
  { level: 10, item: 'Diamanten kroon' },
]

export function levelReward(level: number): string | null {
  return WARDROBE.find((w) => w.level === level)?.item ?? null
}

/** De eerstvolgende garderobe-unlock boven dit niveau (voor anticipatie) */
export function nextReward(level: number): { level: number; item: string } | null {
  return WARDROBE.find((w) => w.level > level) ?? null
}
