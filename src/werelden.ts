import type { CourseId } from './types'

/**
 * De taalwerelden.
 *
 * Elke wereld is een compleet visueel dialect: palet, ornament, materiaal en
 * lichtval van de cultuur waarvan je de taal leert. De tokens staan in
 * src/styles/werelden.css; dit bestand is alleen de catalogus.
 */
export interface Wereld {
  /** waarde voor het data-wereld-attribuut; leeg = de standaard neonwereld */
  id: string
  naam: string
  /** waar het palet vandaan komt, in één regel */
  herkomst: string
  /** de drie kleuren die de wereld dragen, voor het kiezervoorbeeld */
  proef: [string, string, string]
  /** bij welke taal deze wereld hoort */
  taal: CourseId
}

export const NEON: Wereld = {
  id: '',
  naam: 'Neon arcade',
  herkomst: 'Onze huidige wereld, gelijk voor elke taal',
  proef: ['#a855f7', '#ec4899', '#ffc53d'],
  taal: 'es',
}

export const WERELDEN: Wereld[] = [
  NEON,
  {
    id: 'azulejo',
    naam: 'Azulejo',
    herkomst: 'Geglazuurd tegelwerk uit een Sevilliaans binnenhof',
    proef: ['#2f7be8', '#e4572e', '#ffc53d'],
    taal: 'es',
  },
  {
    id: 'flamenco',
    naam: 'Flamenco',
    herkomst: 'Nacht, karmijn en messing onder één spot',
    proef: ['#a10f3a', '#ff2d55', '#e0a53c'],
    taal: 'es',
  },
  {
    id: 'trencadis',
    naam: 'Trencadís',
    herkomst: 'Het gebroken mozaïek van Gaudí in Barcelona',
    proef: ['#00b39a', '#ff7a4d', '#ffcf5c'],
    taal: 'es',
  },
  {
    id: 'solysombra',
    naam: 'Sol y sombra',
    herkomst: 'Gebleekt pleisterwerk om vijf uur, met schaduw als vorm',
    proef: ['#c2410c', '#9d174d', '#b45309'],
    taal: 'es',
  },
]

/** Zet de wereld op het document; lege id betekent terug naar neon */
export function pasWereldToe(id: string): void {
  const el = document.documentElement
  if (id) el.setAttribute('data-wereld', id)
  else el.removeAttribute('data-wereld')
}
