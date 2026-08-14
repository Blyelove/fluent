/**
 * Het schaduwduel: een vriendengevecht in dezelfde arena-jas.
 *
 * Er is geen server, dus twee mensen kunnen niet tegelijk in één arena staan.
 * Dat hoeft ook niet. Je speelt je potje, en elke beurt wordt opgenomen: had
 * je hem goed, en hoelang deed je erover. Die opname gaat als link naar je
 * vriend, en bij hem staat jouw schaduw in de arena. Dezelfde vragen, in
 * dezelfde volgorde, met jouw tempo. Wie sneller antwoordde zet de ander
 * onder druk, precies zoals tegen een poortwachter.
 *
 * Zo voelt het als een echt gevecht in plaats van twee losse scores die
 * achteraf worden vergeleken. Online matchmaking klikt hier later zo in: dan
 * komt de opname van een server in plaats van uit een link.
 */
import type { CourseId } from './types'

/** één opgenomen beurt: goed of fout, en hoelang erover gedaan */
export interface SchaduwBeurt {
  /** 1 = goed */
  g: 0 | 1
  /** milliseconden, afgerond op tienden van een seconde om de link kort te houden */
  t: number
}

export interface SchaduwDuel {
  /** versie, zodat een oude link nooit stilletjes verkeerd wordt gelezen */
  v: 1
  c: CourseId
  /** het zaad waarmee beide spelers exact dezelfde vragen krijgen */
  s: number
  /** naam van wie de uitdaging maakte */
  n: string
  /** zijn opgenomen beurten, op volgorde van vraag */
  b: SchaduwBeurt[]
  /** hoeveel schilden hij overhield; 0 betekent dat hij zelf verloor */
  o: number
}

function b64encode(s: string): string {
  return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64decode(s: string): string {
  const t = s.replace(/-/g, '+').replace(/\//g, '/').replace(/_/g, '/')
  return decodeURIComponent(escape(atob(t + '==='.slice((t.length + 3) % 4))))
}

export function encodeSchaduw(d: SchaduwDuel): string {
  return b64encode(JSON.stringify(d))
}

export function decodeSchaduw(code: string): SchaduwDuel | null {
  try {
    const raw = JSON.parse(b64decode(code.trim())) as SchaduwDuel
    if (!raw || raw.v !== 1 || typeof raw.s !== 'number' || typeof raw.c !== 'string') return null
    if (!Array.isArray(raw.b) || !raw.b.length) return null
    // een kapotte of geknutselde link mag nooit het gevecht laten vastlopen
    raw.b = raw.b
      .filter((x) => x && (x.g === 0 || x.g === 1) && typeof x.t === 'number' && x.t >= 0)
      .slice(0, 60)
    return raw.b.length ? raw : null
  } catch {
    return null
  }
}

/** de link waarmee je vriend jouw schaduw in zijn eigen arena krijgt */
export function schaduwLink(code: string): string {
  const basis = `${window.location.origin}${window.location.pathname}`
  return `${basis}?schaduw=${code}`
}

/**
 * De uitdaging uit de adresbalk halen en die daarna wissen: anders komt
 * dezelfde schaduw bij elke herlading terug en kun je hem eindeloos opnieuw
 * verslaan voor bekers.
 */
export function leesSchaduwUitLink(): SchaduwDuel | null {
  const p = new URLSearchParams(window.location.search).get('schaduw')
  if (!p) return null
  try {
    const url = new URL(window.location.href)
    url.searchParams.delete('schaduw')
    window.history.replaceState({}, '', url.pathname + url.search + url.hash)
  } catch {
    /* oudere browser zonder history-API: dan blijft de code staan */
  }
  return decodeSchaduw(p)
}
