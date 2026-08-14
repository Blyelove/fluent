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
  // bewust geen hout- of steenemoji uit 2020: die missen in de lettertypes van
  // oudere toestellen en verschijnen dan als leeg blokje, gezien op Windows 10
  { naam: 'Houten Arena', emoji: '🌳', vanaf: 0 },
  { naam: 'Stenen Arena', emoji: '🗿', vanaf: 90 },
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

/**
 * Schudden met of zonder zaad. Met zaad krijgen twee spelers exact dezelfde
 * vragen in dezelfde volgorde, en dat is de hele voorwaarde voor een eerlijk
 * schaduwduel: anders vecht je vriend tegen andere woorden dan jij.
 */
function schud<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** een eenvoudige, overal gelijke toevalsbron uit één getal */
function uitZaad(zaad: number): () => number {
  let s = zaad >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/**
 * Snelle strijdvragen uit de woorden van de cursus: betekenis gevraagd, vier
 * opties in de doeltaal. Kort genoeg om op tempo te spelen, echt genoeg om
 * van te leren.
 */
export function arenaVragen(course: Course, aantal: number, zaad?: number): ArenaVraag[] {
  const rand = zaad === undefined ? Math.random : uitZaad(zaad)
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
  for (const p of schud(paren, rand).slice(0, aantal)) {
    const anderen = schud(paren.filter((x) => x.word !== p.word), rand).slice(0, 3).map((x) => x.word)
    const opties = schud([p.word, ...anderen], rand)
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

/** wat de tegenstander deze beurt doet, en hoe dat eruitziet */
export interface BotBeurt {
  /** hoelang hij erover doet, in ms */
  denktijd: number
  /** heeft hij hem goed */
  goed: boolean
  /** hij doet er opvallend lang over: dat mag je zien */
  aarzelt: boolean
  /** hij ruikt bloed en versnelt: dat mag je ook zien */
  versnelt: boolean
}

/**
 * De beurt van de tegenstander, als één berekening.
 *
 * Alleen spreiding op de denktijd maakt hem nog geen levend wezen. Hij moet
 * reageren op de stand, en dat moet je kunnen zien:
 *
 * - staat hij voor, dan ruikt hij bloed en gaat hij sneller spelen;
 * - staat hij achter, dan neemt hij zijn tijd en wordt hij voorzichtiger,
 *   want wie op zijn laatste schild staat gokt niet meer;
 * - antwoord jij snel, dan raakt hij van zijn stuk: zijn kans zakt en zijn
 *   tempo wordt grillig in plaats van gelijkmatig sneller.
 *
 * Bewust een pure functie met de toevalsbron erin geknoopt: het gevecht mag
 * nooit van een animatieframe afhangen, en zo is deze los na te rekenen.
 */
export function botBeurt(
  g: Gladiator,
  stand: { zijnSchilden: number; mijnSchilden: number; druk: number },
): BotBeurt {
  const voorsprong = stand.zijnSchilden - stand.mijnSchilden

  // staat hij voor, dan versnelt hij; staat hij achter, dan neemt hij de tijd
  let factor = voorsprong > 0 ? Math.pow(0.82, voorsprong) : Math.pow(1.26, -voorsprong)

  // op zijn laatste schild speelt hij op zeker: langzamer én scherper
  const opScherp = stand.zijnSchilden === 1
  if (opScherp) factor *= 1.22

  // jouw tempo maakt hem grillig: hoe meer druk, hoe wilder de uitschieters
  const grilligheid = 0.34 + stand.druk * 2.2
  const wiegen = 1 - grilligheid / 2 + Math.random() * grilligheid

  const denktijd = Math.max(650, Math.round(g.tempo * factor * wiegen))
  const kans = Math.max(0.15, Math.min(0.95, g.kans - stand.druk + (opScherp ? 0.08 : 0)))

  return {
    denktijd,
    goed: Math.random() < kans,
    // opvallend lang voor deze tegenstander, dus niet zomaar elke trage beurt
    aarzelt: denktijd > g.tempo * 1.35,
    versnelt: denktijd < g.tempo * 0.72,
  }
}

export type { CourseId }
