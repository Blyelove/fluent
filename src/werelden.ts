import type { CourseId } from './types'

/**
 * De taalwerelden.
 *
 * Elke wereld is een compleet visueel dialect: palet, ornament, materiaal en
 * lichtval van de cultuur waarvan je de taal leert. De tokens staan in
 * src/styles/werelden.css en werelden-talen.css; dit bestand is de catalogus
 * plus de koppeling naar je taal en je niveau.
 */
export interface Wereld {
  /** waarde voor het data-wereld-attribuut */
  id: string
  naam: string
  /** waar het palet vandaan komt, in één regel */
  herkomst: string
  /** de drie kleuren die de wereld dragen, voor het kiezervoorbeeld */
  proef: [string, string, string]
  /** bij welke taal deze wereld hoort */
  taal: CourseId
}

/** De wereld die standaard bij elke taal hoort */
export const WERELD_PER_TAAL: Record<CourseId, string> = {
  es: 'azulejo',
  fr: 'encre',
  de: 'raster',
  it: 'fresco',
  pt: 'calcada',
  en: 'messing',
}

export const WERELDEN: Wereld[] = [
  { id: 'azulejo', naam: 'Azulejo', herkomst: 'Spaans · geglazuurd tegelwerk uit een Sevilliaans binnenhof', proef: ['#2f7be8', '#e4572e', '#ffc53d'], taal: 'es' },
  { id: 'flamenco', naam: 'Flamenco', herkomst: 'Spaans · nacht, karmijn en messing onder één spot', proef: ['#a10f3a', '#ff2d55', '#e0a53c'], taal: 'es' },
  { id: 'trencadis', naam: 'Trencadís', herkomst: 'Spaans · het gebroken mozaïek van Gaudí in Barcelona', proef: ['#00b39a', '#ff7a4d', '#ffcf5c'], taal: 'es' },
  { id: 'solysombra', naam: 'Sol y sombra', herkomst: 'Spaans · gebleekt pleisterwerk om vijf uur, schaduw als vorm', proef: ['#c2410c', '#9d174d', '#b45309'], taal: 'es' },
  { id: 'encre', naam: 'Encre', herkomst: 'Frans · inkt, art nouveau en bladgoud', proef: ['#3b3a8c', '#d66e8c', '#d9b26a'], taal: 'fr' },
  { id: 'raster', naam: 'Raster', herkomst: 'Duits · bauhaus, millimeterpapier en precisie', proef: ['#1f4ed8', '#d62828', '#f2b705'], taal: 'de' },
  { id: 'fresco', naam: 'Fresco', herkomst: 'Italiaans · pleisterkleur, marmeraders en dieppgroen', proef: ['#1f6f54', '#c55a3a', '#e0b64d'], taal: 'it' },
  { id: 'calcada', naam: 'Calçada', herkomst: 'Portugees · de oceaan en de golf in de stoeptegels', proef: ['#0e7c8c', '#ff6f59', '#ffc94d'], taal: 'pt' },
  { id: 'messing', naam: 'Messing', herkomst: 'Engels · mist, diep petrol en messing', proef: ['#1c4a3f', '#9b2c3c', '#c6964a'], taal: 'en' },
  { id: 'neon', naam: 'Neon arcade', herkomst: 'Onze oude wereld, gelijk voor elke taal', proef: ['#a855f7', '#ec4899', '#ffc53d'], taal: 'es' },
]

/**
 * Vijf trappen van rijkdom, gekoppeld aan je vaardigheidsniveau. Op niveau 1
 * is de wereld een schets; hoe dichter bij 99, hoe voller. Zo zie je aan je
 * scherm hoe ver je bent zonder één cijfer te lezen.
 */
export function rijkdomVoor(level: number): 1 | 2 | 3 | 4 | 5 {
  if (level >= 75) return 5
  if (level >= 50) return 4
  if (level >= 25) return 3
  if (level >= 10) return 2
  return 1
}

/**
 * Zet wereld en rijkdom op het document. Een lege keuze betekent: volg de
 * taal die je leert, want dat is het hele idee.
 */
export function pasWereldToe(keuze: string, taal: CourseId, level: number): void {
  const el = document.documentElement
  const id = keuze || WERELD_PER_TAAL[taal] || ''
  if (id && id !== 'neon') el.setAttribute('data-wereld', id)
  else el.removeAttribute('data-wereld')
  el.setAttribute('data-rijkdom', String(rijkdomVoor(level)))
}
