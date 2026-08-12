/**
 * Vaardigheden in RuneScape-stijl: elke taal is een skill die je van level 1
 * naar level 99 traint. De curve is kwadratisch: de eerste levels vallen
 * binnen je eerste les (dat voelt meteen als groei), maar de weg naar 99 is
 * een meerjarenreis waar je trots op mag zijn. Net als in RuneScape is 99
 * een prestatie, geen formaliteit.
 *
 * De XP komt uit dezelfde pot als alles: progress[taal].xp. Er bestaat dus
 * geen aparte skill-boekhouding die uit de pas kan lopen. De store blijft
 * de enige waarheid en dit bestand rekent er alleen op.
 */

export const MAX_SKILL_LEVEL = 99

/** Cumulatieve XP die nodig is om level `l` te bereiken (level 1 = 0 XP) */
export function xpVoorSkillLevel(l: number): number {
  const n = Math.max(1, Math.min(MAX_SKILL_LEVEL, Math.floor(l)))
  return 6 * (n - 1) * (n - 1)
}

/** Huidig skill-level bij deze hoeveelheid XP */
export function skillLevel(xp: number): number {
  if (xp <= 0) return 1
  // omgekeerde van 6·(l−1)²
  return Math.min(MAX_SKILL_LEVEL, Math.floor(Math.sqrt(xp / 6)) + 1)
}

export interface SkillStand {
  level: number
  /** XP binnen het huidige level */
  binnen: number
  /** XP die het huidige level breed is */
  breedte: number
  /** 0..1 richting het volgende level; 1 bij level 99 */
  frac: number
  /** true zodra level 99 bereikt is: de meesterstatus */
  meester: boolean
}

export function skillStand(xp: number): SkillStand {
  const level = skillLevel(xp)
  if (level >= MAX_SKILL_LEVEL) return { level: MAX_SKILL_LEVEL, binnen: 0, breedte: 1, frac: 1, meester: true }
  const vloer = xpVoorSkillLevel(level)
  const plafond = xpVoorSkillLevel(level + 1)
  const breedte = plafond - vloer
  const binnen = Math.max(0, xp - vloer)
  return { level, binnen, breedte, frac: Math.min(1, binnen / breedte), meester: false }
}

/** Mijlpalen die het trainen richting geven, in RuneScape-geest */
export function volgendeMijlpaal(level: number): number | null {
  for (const m of [10, 25, 50, 75, 90, 99]) if (level < m) return m
  return null
}
