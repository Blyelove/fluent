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
