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

/**
 * De ECHTE RuneScape-curve, geschaald naar onze XP-economie.
 *
 * RuneScape: xp(l) = som over 1..l−1 van floor((l + 300·2^(l/7)) / 4),
 * waardoor elk level ruwweg 10% duurder is dan het vorige en level 92
 * precies de helft van 99 is. Daar kost 99 dertien miljoen XP; hier delen we
 * door 217 zodat 99 op ±60.000 XP landt. Wie elke dag zijn dagdoel haalt is
 * daar jaren mee bezig, net zo lang als een echte 99. De eerste levels
 * regenen juist binnen, ook dat is RuneScape.
 */
const SCHAAL = 217

const RS_TABEL: number[] = (() => {
  const cum = [0, 0] // index = level; level 1 = 0 XP
  let punten = 0
  for (const l of Array.from({ length: MAX_SKILL_LEVEL - 1 }, (_, i) => i + 1)) {
    punten += Math.floor(l + 300 * Math.pow(2, l / 7))
    // strikt stijgend houden: door het schalen zou level 2 anders nul XP
    // kosten, en een level van nul breed maakt de voortgangsbalk kapot
    cum.push(Math.max(Math.floor(punten / 4 / SCHAAL), cum[cum.length - 1] + 1))
  }
  return cum
})()

/** Cumulatieve XP die nodig is om level `l` te bereiken (level 1 = 0 XP) */
export function xpVoorSkillLevel(l: number): number {
  const n = Math.max(1, Math.min(MAX_SKILL_LEVEL, Math.floor(l)))
  return RS_TABEL[n]
}

/** Huidig skill-level bij deze hoeveelheid XP */
export function skillLevel(xp: number): number {
  if (xp <= 0) return 1
  let level = 1
  for (let l = MAX_SKILL_LEVEL; l >= 1; l--) {
    if (xp >= RS_TABEL[l]) {
      level = l
      break
    }
  }
  return level
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
