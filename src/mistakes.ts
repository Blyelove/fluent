import type { Course, CourseId, Exercise } from './types'

/**
 * Een fout die je maakte, opgeslagen als verwijzing in plaats van als kopie:
 * cursus + les + positie van de oefening. Zo blijft de opslag klein en
 * verandert de oefening automatisch mee als de cursusinhoud wordt bijgewerkt.
 */
export interface MistakeRef {
  /** cursus */
  c: CourseId
  /** les-id */
  l: string
  /** positie van de oefening binnen die les */
  i: number
  /** hoe vaak je hem fout had */
  n: number
  /** wanneer je hem voor het laatst fout had (ms) */
  t: number
}

export function mistakeKey(r: Pick<MistakeRef, 'c' | 'l' | 'i'>): string {
  return `${r.c}:${r.l}:${r.i}`
}

/** Oefeningen die zinnig terug te geven zijn in een fouten-sessie */
export function isHerhaalbaar(ex: Exercise): boolean {
  return ex.type !== 'new' && ex.type !== 'match'
}

/** Zoekt de daadwerkelijke oefening op bij een bewaarde fout; null als die niet meer bestaat */
export function resolveMistake(course: Course, ref: MistakeRef): { ex: Exercise; lessonTitle: string; unitTitle: string } | null {
  for (const sec of course.sections) {
    for (const u of sec.units) {
      for (const l of u.lessons) {
        if (l.id !== ref.l) continue
        const ex = l.exercises[ref.i]
        if (!ex || !isHerhaalbaar(ex)) return null
        return { ex, lessonTitle: l.title, unitTitle: u.title }
      }
    }
  }
  return null
}

/** Meest hardnekkige fouten eerst: vaak fout weegt zwaarder dan lang geleden */
export function sorteerFouten(list: MistakeRef[]): MistakeRef[] {
  return [...list].sort((a, b) => b.n - a.n || b.t - a.t)
}
