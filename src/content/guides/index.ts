import type { CourseId, UnitGuide } from '../../types'

type GuideModule = { guides: Record<string, UnitGuide> }

/**
 * Grammatica-gidsen per unit, in het Nederlands. Ze worden lui ingeladen:
 * de gids van een taal komt pas binnen als je hem opent, zodat het opstarten
 * van de app licht blijft. Talen waarvoor nog geen gids bestaat, worden
 * automatisch overgeslagen — de knop toont dan een nette melding.
 */
const MODULES = import.meta.glob<GuideModule>('./*.ts')

const cache: Partial<Record<CourseId, Record<string, UnitGuide>>> = {}

/** Woorden uit een zin, zonder leestekens — voor het matchen van een regel */
function woorden(tekst: string): string[] {
  return tekst
    .toLowerCase()
    .replace(/[.,!?;:'’"«»¿¡()]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1)
}

/**
 * Zoekt de regel uit de gids die het best past bij wat je zojuist fout deed.
 * Scoort op overlap tussen het juiste antwoord en de voorbeelden van elke regel;
 * een woord dat in de titel van de regel staat telt extra zwaar.
 */
export function pickRule(guide: UnitGuide | undefined, juisteAntwoord: string, vraag?: string): UnitGuide['rules'][number] | null {
  if (!guide || guide.rules.length === 0) return null
  const doel = new Set([...woorden(juisteAntwoord), ...woorden(vraag ?? '')])
  if (doel.size === 0) return guide.rules[0]

  let beste = guide.rules[0]
  let besteScore = -1
  for (const regel of guide.rules) {
    let score = 0
    for (const v of regel.examples) {
      for (const w of woorden(v.target)) if (doel.has(w)) score += 1
    }
    for (const w of woorden(regel.title)) if (doel.has(w)) score += 2
    if (score > besteScore) {
      besteScore = score
      beste = regel
    }
  }
  // geen enkele overlap? dan is de eerste regel van de unit nog altijd nuttiger dan niets
  return beste
}

export async function loadGuides(courseId: CourseId): Promise<Record<string, UnitGuide>> {
  const bestaand = cache[courseId]
  if (bestaand) return bestaand
  const laad = MODULES[`./${courseId}.ts`]
  if (!laad) {
    cache[courseId] = {}
    return {}
  }
  try {
    const mod = await laad()
    const guides = mod.guides ?? {}
    cache[courseId] = guides
    return guides
  } catch {
    cache[courseId] = {}
    return {}
  }
}
