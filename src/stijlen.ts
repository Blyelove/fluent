/**
 * De proeverij: per beslissing drie of vier volledig uitgewerkte richtingen,
 * live naast elkaar te kiezen. Eén ervan is altijd de gedurfde.
 *
 * De keuze staat in de store en stuurt echte componenten aan, dus wat je
 * kiest is precies wat je overal in de app krijgt. Geen mockups.
 */

export interface Richting {
  id: string
  naam: string
  /** in één regel: wat maakt deze anders */
  kern: string
  /** true = de gedurfde optie die niemand zou aandurven */
  gedurfd?: boolean
}

/** Hoe de XP omhoog zweeft na een goed antwoord */
export const XP_STIJLEN: Richting[] = [
  { id: 'klassiek', naam: 'Klassiek', kern: 'Eén gouden "+10" die rustig omhoog zweeft, precies zoals toen' },
  { id: 'stapel', naam: 'Stapel', kern: 'Elke drop schuift de vorige omhoog, dus je ziet je reeks staan' },
  { id: 'inslag', naam: 'Inslag', kern: 'Het getal slaat groot in en krimpt weg, met een schokje' },
  { id: 'regen', naam: 'Regen', kern: 'Het bedrag valt uiteen in losse cijfers die wegdwarrelen', gedurfd: true },
]

/** Het niveau-omhoog-moment */
export const LEVELUP_STIJLEN: Richting[] = [
  { id: 'kaart', naam: 'Kaart', kern: 'Een heldkaart die opveert met een lichtflits en confetti' },
  { id: 'banier', naam: 'Banier', kern: 'Een brede banier schuift van boven binnen, als een toernooivlag' },
  { id: 'inslag', naam: 'Inslag', kern: 'Het niveaugetal knalt beeldvullend in en schudt het scherm' },
  { id: 'zonsopgang', naam: 'Zonsopgang', kern: 'Het scherm wordt licht, alsof de zon opkomt achter je niveau', gedurfd: true },
]

/** Hoe de arena zich opent */
export const ARENA_STIJLEN: Richting[] = [
  { id: 'duel', naam: 'Duel', kern: 'Beide vechters schuiven van opzij binnen, VS in het midden' },
  { id: 'poort', naam: 'Poort', kern: 'Twee poortdeuren zwaaien open en onthullen de arena' },
  { id: 'spot', naam: 'Spotlicht', kern: 'Donker, dan valt er één spot op jou en één op je tegenstander', gedurfd: true },
]

/** Wat er gebeurt op het moment dat een schild breekt */
export const BREUK_STIJLEN: Richting[] = [
  { id: 'scherven', naam: 'Scherven', kern: 'Het schild spat uiteen in scherven die alle kanten op vliegen' },
  { id: 'barst', naam: 'Barst', kern: 'Eerst loopt er een barst doorheen, dan valt hij in twee helften weg' },
  { id: 'schok', naam: 'Schokgolf', kern: 'Hij klapt naar binnen en er rolt een ring over het scherm' },
  { id: 'as', naam: 'As', kern: 'Hij brandt van de rand naar binnen weg en dwarrelt als sintels op', gedurfd: true },
]

/** Hoe het materiaal van je taalwereld op het scherm ligt */
export const MATERIAAL_STIJLEN: Richting[] = [
  { id: 'waas', naam: 'Waas', kern: 'Het patroon ligt gelijkmatig over het hele scherm, rustig en overal' },
  { id: 'rand', naam: 'Rand', kern: 'Alleen langs de randen, zodat het midden helemaal leeg blijft' },
  { id: 'diep', naam: 'Diep', kern: 'Voller en zwaarder, het materiaal is duidelijk aanwezig' },
  { id: 'adem', naam: 'Ademend', kern: 'Het patroon zwelt heel traag op en weer weg, als een levende muur', gedurfd: true },
]

/** Hoe je wereld groeit op het moment dat je een trede stijgt */
export const GROEI_STIJLEN: Richting[] = [
  { id: 'aangroeien', naam: 'Aangroeien', kern: 'Het ornament komt groot binnen, schiet door en zakt naar zijn nieuwe stand' },
  { id: 'oplichten', naam: 'Oplichten', kern: 'De hele wereld licht één keer op en staat daarna voller' },
  { id: 'opbouwen', naam: 'Opbouwen', kern: 'Het patroon schuift van onder naar boven op zijn plek' },
  { id: 'omslag', naam: 'Omslag', kern: 'Het scherm klapt om als een tegel en de nieuwe wereld staat er', gedurfd: true },
]

export type StijlSleutel = 'xp' | 'levelup' | 'arena' | 'breuk' | 'materiaal' | 'groei'

export const STANDAARD_STIJLEN: Record<StijlSleutel, string> = {
  xp: 'klassiek',
  levelup: 'kaart',
  arena: 'duel',
  breuk: 'scherven',
  materiaal: 'waas',
  groei: 'aangroeien',
}

/** Een stijl uit de link halen, om te proeven of vast te leggen */
export function stijlUitLink(sleutel: StijlSleutel): string | undefined {
  try {
    return new URLSearchParams(window.location.search).get(sleutel) ?? undefined
  } catch {
    return undefined
  }
}
