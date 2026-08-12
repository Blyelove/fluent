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
  return p ? decodeDuel(p) : null
}

export interface DuelRecord {
  opponent: string
  yourScore: number
  theirScore: number
  total: number
  won: boolean
  day: string
}
