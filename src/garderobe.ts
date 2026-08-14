/**
 * DE GARDEROBE
 *
 * Je personage kreeg zijn spullen tot nu toe stilletjes: op niveau 8 hing er
 * ineens een cape, en je wist niet dat hij eraan kwam. Wat je niet ziet
 * aankomen kun je ook niet willen.
 *
 * Hier staat de hele kast op een rij, verdeeld over de plekken waar iets kan
 * hangen. Elk stuk hoort bij een niveau, een land of een prestatie, en wat je
 * nog niet hebt zie je als silhouet: je ziet dát er iets komt, en waarvoor,
 * maar nog niet hoe mooi het is.
 */
import type { CourseId } from './types'

export type Plek = 'hoofd' | 'boven' | 'onder' | 'schoenen' | 'rug' | 'hand' | 'aura'

export interface Stuk {
  id: string
  naam: string
  /** wat je ervoor moet doen, in één regel */
  eis: string
  /** vanaf welk niveau je hem hebt */
  vanaf: number
  /** alleen in deze taal, als het stuk uit één land komt */
  taal?: CourseId
}

export const PLEKKEN: { plek: Plek; naam: string; uitleg: string }[] = [
  { plek: 'hoofd', naam: 'Hoofd', uitleg: 'Wat je op hebt' },
  { plek: 'boven', naam: 'Boven', uitleg: 'Wat je draagt' },
  { plek: 'onder', naam: 'Onder', uitleg: 'Broek en riem' },
  { plek: 'schoenen', naam: 'Schoenen', uitleg: 'Waar je op loopt' },
  { plek: 'rug', naam: 'Rug', uitleg: 'Wat er achter je hangt' },
  { plek: 'hand', naam: 'In de hand', uitleg: 'Wat je vasthoudt' },
  { plek: 'aura', naam: 'Aura', uitleg: 'Wat er om je heen gebeurt' },
]

/**
 * De kast. De niveaus komen overeen met wat het personage al deed, zodat
 * niemand iets kwijtraakt wat hij al had: de halsdoek zat altijd al op 2, de
 * hoed op 3, de cape op 8. Wat nieuw is, is dat je ze nu ziet aankomen.
 */
export const KAST: Record<Plek, Stuk[]> = {
  hoofd: [
    { id: 'hoofd-niets', naam: 'Blote kop', eis: 'Vanaf het begin', vanaf: 1 },
    { id: 'hoofd-hoed', naam: 'Hoed van je land', eis: 'Niveau 3', vanaf: 3 },
    { id: 'hoofd-bril', naam: 'Zonnebril', eis: 'Niveau 6', vanaf: 6 },
    { id: 'hoofd-kroon', naam: 'Kroon', eis: 'Niveau 10', vanaf: 10 },
    { id: 'hoofd-halo', naam: 'Halo van de legende', eis: 'Niveau 20', vanaf: 20 },
  ],
  boven: [
    { id: 'boven-shirt', naam: 'Gewoon shirt', eis: 'Vanaf het begin', vanaf: 1 },
    { id: 'boven-sjaal', naam: 'Halsdoek', eis: 'Niveau 2', vanaf: 2 },
    { id: 'boven-tenue', naam: 'Tenue van je land', eis: 'Niveau 4', vanaf: 4 },
    { id: 'boven-embleem', naam: 'Vlagembleem', eis: 'Niveau 7', vanaf: 7 },
    { id: 'boven-ketting', naam: 'Gouden ketting', eis: 'Niveau 11', vanaf: 11 },
    { id: 'boven-horloge', naam: 'Diamanten horloge', eis: 'Niveau 14', vanaf: 14 },
  ],
  onder: [
    { id: 'onder-broek', naam: 'Spijkerbroek', eis: 'Vanaf het begin', vanaf: 1 },
    { id: 'onder-pak', naam: 'Nette broek', eis: 'Niveau 4', vanaf: 4 },
    { id: 'onder-goud', naam: 'Gouden zoom', eis: 'Niveau 15', vanaf: 15 },
  ],
  schoenen: [
    { id: 'schoen-wit', naam: 'Witte sneakers', eis: 'Vanaf het begin', vanaf: 1 },
    { id: 'schoen-leer', naam: 'Leren schoenen', eis: 'Niveau 4', vanaf: 4 },
    { id: 'schoen-goud', naam: 'Gouden schoenen', eis: 'Niveau 18', vanaf: 18 },
  ],
  rug: [
    { id: 'rug-niets', naam: 'Niets', eis: 'Vanaf het begin', vanaf: 1 },
    { id: 'rug-cape', naam: 'Vlaggencape', eis: 'Niveau 8', vanaf: 8 },
    { id: 'rug-vleugels', naam: 'Energievleugels', eis: 'Niveau 16', vanaf: 16 },
    { id: 'rug-mantel', naam: 'Meestermantel', eis: 'Een taal op niveau 99', vanaf: 99 },
  ],
  hand: [
    { id: 'hand-niets', naam: 'Lege handen', eis: 'Vanaf het begin', vanaf: 1 },
    { id: 'hand-item', naam: 'Attribuut van je land', eis: 'Niveau 5', vanaf: 5 },
    { id: 'hand-vlag', naam: 'Vlaggetje', eis: 'Niveau 10', vanaf: 10 },
  ],
  aura: [
    { id: 'aura-niets', naam: 'Geen aura', eis: 'Vanaf het begin', vanaf: 1 },
    { id: 'aura-gloed', naam: 'Gloed', eis: 'Niveau 9', vanaf: 9 },
    { id: 'aura-neon', naam: 'Neonrand', eis: 'Niveau 12', vanaf: 12 },
    { id: 'aura-vuur', naam: 'Vuur', eis: 'Niveau 13', vanaf: 13 },
    { id: 'aura-bliksem', naam: 'Bliksem', eis: 'Niveau 17', vanaf: 17 },
    { id: 'aura-kosmos', naam: 'Kosmisch', eis: 'Niveau 19', vanaf: 19 },
  ],
}

/** heb je dit stuk al */
export function heeft(stuk: Stuk, niveau: number, meester: boolean): boolean {
  if (stuk.vanaf >= 99) return meester
  return niveau >= stuk.vanaf
}

/** hoeveel stukken je hebt van hoeveel er zijn */
export function kastStand(niveau: number, meester: boolean): { heb: number; totaal: number } {
  let heb = 0
  let totaal = 0
  for (const plek of PLEKKEN) {
    for (const stuk of KAST[plek.plek]) {
      totaal++
      if (heeft(stuk, niveau, meester)) heb++
    }
  }
  return { heb, totaal }
}

/** het eerstvolgende stuk dat je gaat verdienen, of null als je alles hebt */
export function volgendStuk(niveau: number, meester: boolean): Stuk | null {
  let beste: Stuk | null = null
  for (const plek of PLEKKEN) {
    for (const stuk of KAST[plek.plek]) {
      if (heeft(stuk, niveau, meester)) continue
      if (!beste || stuk.vanaf < beste.vanaf) beste = stuk
    }
  }
  return beste
}
