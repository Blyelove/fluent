import type { Course, CourseId } from './types'

export interface Country {
  name: string
  code: string // ISO 3166-1 alpha-2, voor SVG-vlag
}

/** SVG-vlagcode per cursus (emoji-vlaggen renderen niet op Windows) */
export const courseFlagCode: Record<CourseId, string> = {
  en: 'gb',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
}

/** Per taal: de wereld die je verovert, in volgorde van verovering */
export const COUNTRIES: Record<CourseId, Country[]> = {
  en: [
    { name: 'Verenigd Koninkrijk', code: 'gb' },
    { name: 'Ierland', code: 'ie' },
    { name: 'Verenigde Staten', code: 'us' },
    { name: 'Canada', code: 'ca' },
    { name: 'Australië', code: 'au' },
    { name: 'Nieuw-Zeeland', code: 'nz' },
    { name: 'Zuid-Afrika', code: 'za' },
    { name: 'Malta', code: 'mt' },
    { name: 'Singapore', code: 'sg' },
    { name: 'India', code: 'in' },
    { name: 'Jamaica', code: 'jm' },
    { name: 'Kenia', code: 'ke' },
    { name: 'Nigeria', code: 'ng' },
    { name: 'Filipijnen', code: 'ph' },
  ],
  es: [
    { name: 'Spanje', code: 'es' },
    { name: 'Mexico', code: 'mx' },
    { name: 'Colombia', code: 'co' },
    { name: 'Argentinië', code: 'ar' },
    { name: 'Peru', code: 'pe' },
    { name: 'Chili', code: 'cl' },
    { name: 'Ecuador', code: 'ec' },
    { name: 'Guatemala', code: 'gt' },
    { name: 'Cuba', code: 'cu' },
    { name: 'Bolivia', code: 'bo' },
    { name: 'Dominicaanse Republiek', code: 'do' },
    { name: 'Uruguay', code: 'uy' },
    { name: 'Costa Rica', code: 'cr' },
    { name: 'Panama', code: 'pa' },
  ],
  fr: [
    { name: 'Frankrijk', code: 'fr' },
    { name: 'België', code: 'be' },
    { name: 'Zwitserland', code: 'ch' },
    { name: 'Canada', code: 'ca' },
    { name: 'Luxemburg', code: 'lu' },
    { name: 'Monaco', code: 'mc' },
    { name: 'Senegal', code: 'sn' },
    { name: 'Ivoorkust', code: 'ci' },
    { name: 'Marokko', code: 'ma' },
    { name: 'Tunesië', code: 'tn' },
    { name: 'Congo-Kinshasa', code: 'cd' },
    { name: 'Madagaskar', code: 'mg' },
    { name: 'Haïti', code: 'ht' },
    { name: 'Kameroen', code: 'cm' },
  ],
  de: [
    { name: 'Duitsland', code: 'de' },
    { name: 'Oostenrijk', code: 'at' },
    { name: 'Zwitserland', code: 'ch' },
    { name: 'Liechtenstein', code: 'li' },
    { name: 'Luxemburg', code: 'lu' },
    { name: 'Oost-België', code: 'be' },
    { name: 'Zuid-Tirol', code: 'it' },
    { name: 'Namibië', code: 'na' },
  ],
  it: [
    { name: 'Italië', code: 'it' },
    { name: 'San Marino', code: 'sm' },
    { name: 'Vaticaanstad', code: 'va' },
    { name: 'Ticino (Zwitserland)', code: 'ch' },
    { name: 'Malta', code: 'mt' },
    { name: 'Istrië (Kroatië)', code: 'hr' },
  ],
  pt: [
    { name: 'Portugal', code: 'pt' },
    { name: 'Brazilië', code: 'br' },
    { name: 'Angola', code: 'ao' },
    { name: 'Mozambique', code: 'mz' },
    { name: 'Kaapverdië', code: 'cv' },
    { name: 'Guinee-Bissau', code: 'gw' },
    { name: 'Sao Tomé en Principe', code: 'st' },
    { name: 'Oost-Timor', code: 'tl' },
    { name: 'Macau', code: 'mo' },
  ],
}

export function totalLessons(course: Course): number {
  let n = 0
  for (const s of course.sections) for (const u of s.units) n += u.lessons.length
  return n
}

export interface CountryState extends Country {
  /** Aantal voltooide lessen nodig om dit land te veroveren */
  threshold: number
  conquered: boolean
  /** Is dit land al haalbaar met de huidige lessen, of komt het met nieuwe content? */
  inCourse: boolean
}

/**
 * Landen-voortgang met oplopende moeilijkheid: het eerste land kost 3 lessen
 * (een volledige unit), daarna wordt elk land stap voor stap duurder
 * (3, 6, 10, 14, 19, 24, 30, ...). Landen voorbij de huidige cursusomvang
 * blijven zichtbaar als vooruitblik — die komen met nieuwe lessen.
 */
export function countryStates(course: Course, completedCount: number): CountryState[] {
  const list = COUNTRIES[course.id]
  const total = totalLessons(course)
  let cum = 0
  return list.map((c, i) => {
    cum += 3 + Math.floor(i / 2)
    return { ...c, threshold: cum, conquered: completedCount >= cum, inCourse: cum <= total }
  })
}

/**
 * Hoe ver je op de etappe náár dit land bent (0-1). Meet vanaf het vórige
 * land, niet vanaf nul: anders zegt het paneel "74%" terwijl je held nog aan
 * het begin van de etappe staat.
 */
export function etappeFrac(landen: CountryState[], doel: CountryState, completedCount: number): number {
  const i = landen.findIndex((c) => c.code === doel.code && c.threshold === doel.threshold)
  const vorige = i > 0 ? landen[i - 1].threshold : 0
  const span = Math.max(1, doel.threshold - vorige)
  return Math.min(1, Math.max(0, (completedCount - vorige) / span))
}

export function nextCountry(course: Course, completedCount: number): CountryState | null {
  return countryStates(course, completedCount).find((c) => !c.conquered) ?? null
}
