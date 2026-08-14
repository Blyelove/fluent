/**
 * De kleuren van de wereld waarin je nu staat, als echte waarden.
 *
 * Confetti wordt met een tekenblad gemaakt en dat kent geen tokens, dus overal
 * stonden vaste lijsten als ['#FFC53D', '#FFE08A', '#FFFFFF']. Dat is het goud
 * van de neonwereld: vier je een mijlpaal in Sol y sombra, dan regende het
 * daar tot nu toe de kleuren van een andere wereld.
 *
 * Hier worden de kleuren uit de stijl zelf gelezen, dus de confetti heeft
 * altijd de kleur van jouw wereld. Valt er iets weg, dan blijft de oude neon
 * over als vangnet en gaat er nooit iets stuk.
 */

const VANGNET = ['#FFC53D', '#FFE08A', '#FFFFFF']

function lees(naam: string, terugval: string): string {
  try {
    const waarde = getComputedStyle(document.documentElement).getPropertyValue(naam).trim()
    return waarde || terugval
  } catch {
    return terugval
  }
}

/** goud, licht goud en wit: voor een viering die over goud gaat */
export function feestGoud(): string[] {
  const goud = lees('--gold', VANGNET[0])
  const licht = lees('--gold-bright', VANGNET[1])
  return [goud, licht, '#FFFFFF']
}

/** het volle palet van de wereld: voor een viering die over alles gaat */
export function feestPalet(): string[] {
  const uit = [lees('--hot1', '#A855F7'), lees('--hot2', '#EC4899'), lees('--gold', VANGNET[0]), lees('--cyan', '#22D3EE')]
  // dubbelen eruit: sommige werelden gebruiken dezelfde kleur twee keer, en
  // dan zou de confetti ineens uit twee kleuren bestaan
  return [...new Set(uit)]
}
