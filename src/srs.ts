import { createEmptyCard, fsrs, generatorParameters, Rating, type Card } from 'ts-fsrs'

const f = fsrs(generatorParameters({ enable_fuzz: true }))

export function newCard(): Card {
  return createEmptyCard(new Date())
}

/** Na JSON-persistentie zijn datums strings — herstel naar Date */
export function reviveCard(c: Card): Card {
  return {
    ...c,
    due: new Date(c.due),
    last_review: c.last_review ? new Date(c.last_review) : undefined,
  }
}

export function nextCard(c: Card, good: boolean): Card {
  const result = f.next(reviveCard(c), new Date(), good ? Rating.Good : Rating.Again)
  return result.card
}

export function isDue(c: Card): boolean {
  return new Date(c.due).getTime() <= Date.now()
}

/** Wanneer is de eerstvolgende herhaling? (null = niets geleerd) */
export function nextDueDate(cards: Card[]): Date | null {
  if (cards.length === 0) return null
  let min = new Date(cards[0].due)
  for (const c of cards) {
    const d = new Date(c.due)
    if (d < min) min = d
  }
  return min
}
