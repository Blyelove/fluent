/**
 * Vrienden-duels zonder server: je maakt een uitdaging, deelt de link via
 * WhatsApp, je vriend speelt exact dezelfde vragen en stuurt zijn code terug.
 * De code bevat alles: cursus, vragen-seed, naam en score.
 */
import type { CourseId } from './types'

export interface DuelPayload {
  /** Cursus waarin gespeeld wordt */
  c: CourseId
  /** Seed waarmee beide spelers dezelfde vragen krijgen */
  s: number
  /** Naam van de uitdager */
  n: string
  /** Score van de uitdager (aantal goed), -1 = nog niet gespeeld */
  x: number
  /** Aantal vragen */
  q: number
  /**
   * 1 = dit is het ANTWOORD van je vriend op jouw uitdaging.
   * Ontbreekt of 0 = dit is een uitdaging die nog gespeeld moet worden.
   * Zonder dit onderscheid zou je eigen uitdaging-link, geopend op je eigen
   * telefoon, worden aangezien voor een antwoord en een nepduel opleveren.
   */
  r?: 0 | 1
}

function b64encode(s: string): string {
  return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64decode(s: string): string {
  const t = s.replace(/-/g, '+').replace(/_/g, '/')
  return decodeURIComponent(escape(atob(t + '==='.slice((t.length + 3) % 4))))
}

export function encodeDuel(p: DuelPayload): string {
  return b64encode(JSON.stringify(p))
}

export function decodeDuel(code: string): DuelPayload | null {
  try {
    const raw = JSON.parse(b64decode(code.trim())) as DuelPayload
    if (!raw || typeof raw.s !== 'number' || typeof raw.c !== 'string') return null
    return raw
  } catch {
    return null
  }
}

/** Deterministische shuffle zodat beide spelers exact dezelfde vragen zien */
export function seededPick<T>(items: T[], count: number, seed: number): T[] {
  const arr = [...items]
  let s = seed >>> 0
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count)
}

export function duelLink(code: string): string {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}?duel=${code}`
}

export function readDuelFromUrl(): DuelPayload | null {
  const p = new URLSearchParams(window.location.search).get('duel')
  if (!p) return null
  // de code meteen uit de adresbalk halen: anders komt dezelfde uitdaging bij
  // elke herlading terug en kon je hem eindeloos opnieuw laten uitbetalen
  try {
    const url = new URL(window.location.href)
    url.searchParams.delete('duel')
    window.history.replaceState({}, '', url.pathname + url.search + url.hash)
  } catch {
    /* oudere browser zonder history-API: dan blijft de code staan */
  }
  return decodeDuel(p)
}

/** Seeds van duels die al afgerekend zijn, zodat XP nooit twee keer valt */
const AFGEROND_KEY = 'fluent-duels-afgerond'

export function duelAfgerond(seed: number): boolean {
  try {
    const lijst = JSON.parse(localStorage.getItem(AFGEROND_KEY) ?? '[]')
    return Array.isArray(lijst) && lijst.includes(seed)
  } catch {
    return false
  }
}

export function markeerDuelAfgerond(seed: number) {
  try {
    const lijst = JSON.parse(localStorage.getItem(AFGEROND_KEY) ?? '[]')
    const uit = Array.isArray(lijst) ? lijst.filter((v) => typeof v === 'number') : []
    if (!uit.includes(seed)) uit.push(seed)
    // ruim genoeg voor een mensenleven aan duels, en toch begrensd
    localStorage.setItem(AFGEROND_KEY, JSON.stringify(uit.slice(-200)))
  } catch {
    /* geen opslag beschikbaar: dan valt de bescherming weg, maar de app werkt */
  }
}

export interface DuelRecord {
  opponent: string
  yourScore: number
  theirScore: number
  total: number
  won: boolean
  day: string
}
