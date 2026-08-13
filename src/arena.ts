import type { Course, CourseId } from './types'

/**
 * De Arena: één tegen één, drie schilden elk, wie het eerst door zijn
 * schilden heen is verliest. Bekers bepalen je rang, en de ladder loopt van
 * de Houten Arena naar de Meesterarena, zoals de dorpen van toen.
 *
 * Alles hier is puur rekenwerk zonder React: de ladder, de gladiatoren en
 * de vragenbouwer. Het scherm leest, de store boekt.
 */

export const SCHILDEN = 3

export interface ArenaRang {
  naam: string
  emoji: string
  /** bekers die de poort openen */
  vanaf: number
}

/** De ladder. Winst levert 30 bekers op, verlies kost er 10. */
export const ARENAS: ArenaRang[] = [
  { naam: 'Houten Arena', emoji: '🪵', vanaf: 0 },
  { naam: 'Stenen Arena', emoji: '🪨', vanaf: 90 },
  { naam: 'Bronzen Arena', emoji: '🥉', vanaf: 210 },
  { naam: 'Zilveren Arena', emoji: '🥈', vanaf: 390 },
  { naam: 'Gouden Arena', emoji: '🥇', vanaf: 630 },
  { naam: 'Kristallen Arena', emoji: '💎', vanaf: 930 },
  { naam: 'Meesterarena', emoji: '👑', vanaf: 1290 },
]

export function arenaVoor(bekers: number): ArenaRang {
  let huidige = ARENAS[0]
  for (const a of ARENAS) if (bekers >= a.vanaf) huidige = a
  return huidige
}

/** De volgende poort, of null als je bovenaan staat */
export function volgendeArena(bekers: number): ArenaRang | null {
  for (const a of ARENAS) if (bekers < a.vanaf) return a
  return null
}

export const WINST_BEKERS = 30
export const VERLIES_BEKERS = 10

export interface Gladiator {
  naam: string
  /** kans dat hij een vraag goed heeft, in rust */
  kans: number
  /** hoe snel hij denkt, in ms (gemiddeld) */
  tempo: number
  uitleg: string
}

/**
 * Per arena een eigen poortwachter om te verslaan. Hoe hoger de rang, hoe
 * scherper en sneller. Ze voelen live: hun denktijd wiegt, ze versnellen
 * onder druk en soms herstellen ze zich net op tijd.
 */
export function gladiatorVoor(bekers: number): Gladiator {
  const rang = ARENAS.indexOf(arenaVoor(bekers))
  const lijst: Gladiator[] = [
    { naam: 'Splinter Sam', kans: 0.45, tempo: 5200, uitleg: 'Zwaait met zijn houten zwaard, mist vaker dan hij raakt' },
    { naam: 'Rots Rik', kans: 0.55, tempo: 4600, uitleg: 'Traag maar degelijk, laat zich niet opjagen' },
    { naam: 'Bronzen Bo', kans: 0.62, tempo: 4100, uitleg: 'Geslepen in honderd gevechten' },
    { naam: 'Zilveren Sanne', kans: 0.7, tempo: 3600, uitleg: 'Snijdt door vragen heen als door zijde' },
    { naam: 'Gouden Guusje', kans: 0.76, tempo: 3100, uitleg: 'Bijna niemand houdt dit tempo bij' },
    { naam: 'Kristal Cas', kans: 0.82, tempo: 2700, uitleg: 'Ziet het antwoord voordat jij de vraag las' },
    { naam: 'De Meester', kans: 0.88, tempo: 2300, uitleg: 'De laatste poort. Wie hem verslaat, hoort hier thuis' },
  ]
  return lijst[Math.min(rang, lijst.length - 1)]
}

export interface ArenaVraag {
  /** de vraag in het Nederlands */
  prompt: string
  /** vier opties in de doeltaal */
  opties: string[]
  juist: number
  /** het juiste antwoord, om na afloop uit te spreken */
  zeg: string
}

function schud<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Snelle strijdvragen uit de woorden van de cursus: betekenis gevraagd, vier
 * opties in de doeltaal. Kort genoeg om op tempo te spelen, echt genoeg om
 * van te leren.
 */
export function arenaVragen(course: Course, aantal: number): ArenaVraag[] {
  const paren: { word: string; nl: string }[] = []
  const gezien = new Set<string>()
  for (const s of course.sections)
    for (const u of s.units)
      for (const l of u.lessons)
        for (const e of l.exercises) {
          if (e.type !== 'new') continue
          const k = e.word.toLowerCase()
          if (gezien.has(k)) continue
          gezien.add(k)
          paren.push({ word: e.word, nl: e.nl })
        }
  if (paren.length < 4) return []
  const vragen: ArenaVraag[] = []
  for (const p of schud(paren).slice(0, aantal)) {
    const anderen = schud(paren.filter((x) => x.word !== p.word)).slice(0, 3).map((x) => x.word)
    const opties = schud([p.word, ...anderen])
    vragen.push({ prompt: p.nl, opties, juist: opties.indexOf(p.word), zeg: p.word })
  }
  return vragen
}

/** hoe hard je slaat: sneller goed antwoorden zet de tegenstander onder druk */
export function drukVan(antwoordMs: number): number {
  if (antwoordMs < 2500) return 0.18
  if (antwoordMs < 4500) return 0.1
  if (antwoordMs < 7000) return 0.04
  return 0
}

export type { CourseId }
