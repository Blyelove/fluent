export type CourseId = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt'

export interface Course {
  id: CourseId
  /** Taalnaam in het Nederlands, bv. "Engels" */
  name: string
  flag: string
  /** Korte Nederlandse tagline voor op de cursuskaart */
  tagline: string
  /** BCP-47 code voor tekst-naar-spraak, bv. "en-US" */
  ttsLang: string
  sections: Section[]
}

export interface Section {
  title: string
  cefr: string
  units: Unit[]
}

export interface Unit {
  id: string
  title: string
  icon: string
  lessons: Lesson[]
}

/** Nederlandstalige grammatica-gids bij een unit: legt uit wáárom iets zo is */
export interface UnitGuide {
  /** Eén of twee zinnen: wat leer je hier en waarom is dat handig */
  intro: string
  rules: {
    title: string
    explanation: string
    examples: { target: string; nl: string }[]
  }[]
  /** Kant-en-klare zinnen die je meteen kunt gebruiken */
  phrases: { target: string; nl: string }[]
  /** Valkuil speciaal voor Nederlandstaligen */
  tip?: string
}

export interface Lesson {
  id: string
  title: string
  exercises: Exercise[]
}

export type Exercise = NewWord | Select | WordBank | Match | Listen | TypeAnswer | Fill

/** Introduceert een nieuw woord vóór het geoefend wordt */
export interface NewWord {
  type: 'new'
  /** Het woord in de doeltaal */
  word: string
  /** Nederlandse vertaling */
  nl: string
  /** Voorbeeldzin in de doeltaal */
  example?: string
  /** Nederlandse vertaling van de voorbeeldzin */
  exampleNl?: string
}

/** Kies de juiste vertaling. Richting kan beide kanten op. */
export interface Select {
  type: 'select'
  /** Wat de gebruiker te zien krijgt (NL woord/zin, of doeltaal-woord/zin) */
  prompt: string
  /** Antwoordopties (in de andere taal dan de prompt) */
  options: string[]
  /** Index van het juiste antwoord */
  correct: number
  /** Optioneel: tekst in de doeltaal die uitgesproken wordt bij tonen */
  speak?: string
}

/** Bouw de zin in de doeltaal met woordtegels */
export interface WordBank {
  type: 'wordbank'
  /** De Nederlandse zin die vertaald moet worden */
  nl: string
  /** De correcte zin in de doeltaal (woorden gescheiden door spaties) */
  target: string
  /** Extra afleiders-tegels in de doeltaal */
  distractors: string[]
}

/** Match Nederlandse woorden met doeltaal-woorden */
export interface Match {
  type: 'match'
  /** 4-5 paren */
  pairs: { nl: string; target: string }[]
}

/** Luister en kies wat je hoort */
export interface Listen {
  type: 'listen'
  /** De uitgesproken tekst in de doeltaal */
  target: string
  /** Opties in de doeltaal, waarvan één gelijk is aan target */
  options: string[]
  correct: number
}

/** Typ de vertaling in de doeltaal */
export interface TypeAnswer {
  type: 'type'
  /** De Nederlandse zin of het woord */
  nl: string
  /** Het correcte antwoord in de doeltaal */
  target: string
  /** Alternatieve goedgekeurde antwoorden */
  accept?: string[]
}

/** Vul het gat in de zin (grammatica-focus) */
export interface Fill {
  type: 'fill'
  /** Zinsdeel vóór het gat (doeltaal) */
  before: string
  /** Zinsdeel na het gat (doeltaal) */
  after: string
  /** Nederlandse vertaling van de hele zin */
  nl?: string
  options: string[]
  correct: number
}
