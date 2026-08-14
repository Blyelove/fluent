import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { Fill, Listen, Match, NewWord, Select, TypeAnswer, WordBank } from '../types'
import { sfx, speak } from '../audio'

export interface EvalResult {
  correct: boolean
  correctAnswer?: string
  /**
   * Gevuld wanneer het antwoord goed gerekend is ondanks een tikfout of een
   * gemist accent — het feedbackpaneel toont dan de juiste spelling. Eén
   * letter verkeerd is niet hetzelfde als het woord niet kennen.
   */
  spellingTip?: string
  /**
   * Het juiste antwoord in de DOELTAAL, om na een fout (of tikfout) uit te
   * spreken. Alleen gevuld als de tekst zeker in de doeltaal is — een
   * Nederlandse zin door een Spaanse stem is net zo fout als andersom.
   */
  speakAnswer?: string
  /** Kwam dit uit een match-oefening? Alle paren zijn dan hoe dan ook gevonden. */
  match?: boolean
  /** Hoeveel keer je een verkeerd paar probeerde voordat alles klopte */
  misPogingen?: number
}

export interface Registration {
  ready: boolean
  evaluate: () => EvalResult
}

interface Common {
  ttsLang: string
  locked: boolean
  register: (r: Registration) => void
  /** Enter of "Ga" in een invoerveld: meteen controleren, zonder het toetsenbord weg te vegen */
  onSubmit?: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'’"«»¿¡]/g, '')
    .replace(/\s+/g, ' ')
}

/** Accenten weg (café → cafe) — voor de vergelijking, nooit voor de weergave */
export function zonderAccenten(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Precies één tikfout (letter te veel, te weinig of verkeerd)? */
function eenTikfout(a: string, b: string): boolean {
  if (a === b) return false
  if (Math.abs(a.length - b.length) > 1) return false
  // zelfde lengte: precies één positie mag verschillen
  if (a.length === b.length) {
    let verschillen = 0
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) verschillen++
    return verschillen === 1
  }
  // één letter langer: kort moet in lang passen met één overgeslagen letter
  const [kort, lang] = a.length < b.length ? [a, b] : [b, a]
  let i = 0
  let j = 0
  let overgeslagen = false
  while (i < kort.length && j < lang.length) {
    if (kort[i] === lang[j]) {
      i++
      j++
    } else {
      if (overgeslagen) return false
      overgeslagen = true
      j++
    }
  }
  return true
}

/**
 * Beoordeelt een getypt antwoord met menselijke maat: exact goed is goed,
 * en een gemist accent of één tikfout (bij woorden van 4+ tekens) is óók
 * goed — met een spellingtip erbij. Een tikfout is geen onwetendheid.
 */
export function beoordeelTypen(invoer: string, doelen: string[]): EvalResult {
  const gegeven = norm(invoer)
  const hoofd = doelen[0] ?? ''
  for (const doel of doelen) if (norm(doel) === gegeven) return { correct: true, correctAnswer: hoofd, speakAnswer: hoofd }
  for (const doel of doelen) {
    const d = norm(doel)
    // accentfout: zonder accenten gelijk
    if (zonderAccenten(d) === zonderAccenten(gegeven))
      return { correct: true, correctAnswer: hoofd, spellingTip: doel, speakAnswer: doel }
    // tikfout: één letter afwijking op een woord dat lang genoeg is om dat te vergeven
    if (d.length >= 4 && eenTikfout(zonderAccenten(d), zonderAccenten(gegeven)))
      return { correct: true, correctAnswer: hoofd, spellingTip: doel, speakAnswer: doel }
  }
  return { correct: false, correctAnswer: hoofd, speakAnswer: hoofd }
}

export const SpeakerIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9.5 9.5 0 0 1 0 13" />
  </svg>
)

/* ---------- Nieuw woord ---------- */

export function NewWordEx({ ex, ttsLang, register }: Common & { ex: NewWord }) {
  useEffect(() => {
    register({ ready: true, evaluate: () => ({ correct: true }) })
    const t = setTimeout(() => speak(ex.word, ttsLang), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="center float-in">
      {/* het nieuwe woord is de held van dit scherm; goud blijft voor beloningen */}
      <div className="card-hero" style={{ padding: '30px 20px 26px' }}>
        <p className="eyebrow" style={{ marginBottom: 16, color: 'var(--hero-eyebrow)' }}>
          Nieuw woord
        </p>
        <button className="speaker-btn" onClick={() => speak(ex.word, ttsLang)} aria-label="Luister">
          <SpeakerIcon size={34} />
        </button>
        <h2 className="display hot-text" style={{ fontSize: 34 }}>
          {ex.word}
        </h2>
        <p className="dim" style={{ fontSize: 19, marginTop: 4 }}>
          {ex.nl}
        </p>
      </div>
      {ex.example && (
        <div className="glass" style={{ marginTop: 16, padding: '16px 18px', textAlign: 'left' }}>
          <div className="row" style={{ gap: 8 }}>
            <button className="speaker-sm" onClick={() => speak(ex.example ?? '', ttsLang)} aria-label="Luister voorbeeld">
              <SpeakerIcon size={17} />
            </button>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500 }}>{ex.example}</p>
              {ex.exampleNl && (
                <p className="faint" style={{ fontSize: 14 }}>
                  {ex.exampleNl}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * De kleur van een antwoordknop nadat je gecontroleerd hebt: jouw foute keuze
 * schudt rood, het juiste antwoord licht groen op. Zonder dit moest je de
 * balk onderin lezen om te weten wat er gebeurde.
 */
function optKlasse(i: number, gekozen: number | null, juist: number, vast: boolean): string {
  if (!vast || gekozen === null) return `opt ${gekozen === i ? 'selected' : ''}`
  if (i === juist) return 'opt correct'
  if (i === gekozen) return 'opt wrong'
  return 'opt'
}

/**
 * Antwoordopties in willekeurige volgorde, één keer geschud per oefening.
 * In de content staat het juiste antwoord vaak op een vaste plek (bij Duits
 * zelfs overal op knop 1) — wie dat doorheeft, leert knoppen in plaats van
 * taal. Schudden bij het renderen houdt de content simpel en het spel eerlijk.
 */
function useGeschud(options: string[], correct: number): { opties: string[]; juist: number } {
  return useMemo(() => {
    const volgorde = shuffle(options.map((_, i) => i))
    return { opties: volgorde.map((i) => options[i]), juist: volgorde.indexOf(correct) }
  }, [options, correct])
}

/* ---------- Kies de vertaling ---------- */

export function SelectEx({ ex, ttsLang, locked, register }: Common & { ex: Select }) {
  const { opties, juist } = useGeschud(ex.options, ex.correct)
  const [chosen, setChosen] = useState<number | null>(null)

  useEffect(() => {
    if (ex.speak) {
      const t = setTimeout(() => speak(ex.speak ?? '', ttsLang), 300)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    register({
      ready: chosen !== null,
      evaluate: () => ({
        correct: chosen === juist,
        correctAnswer: ex.options[ex.correct],
        // zonder speak zijn de opties doeltaal — dan mag het juiste antwoord klinken
        speakAnswer: ex.speak ? undefined : ex.options[ex.correct],
      }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen])

  return (
    <div className="float-in">
      <p className="eyebrow">Kies de juiste vertaling</p>
      <div className="row" style={{ gap: 8 }}>
        <h2 className="prompt-big" style={{ flex: 1 }}>
          {ex.prompt}
        </h2>
        {ex.speak && (
          <button className="speaker-sm" onClick={() => speak(ex.speak ?? '', ttsLang)} aria-label="Luister">
            <SpeakerIcon size={18} />
          </button>
        )}
      </div>
      <div className="col" style={{ gap: 8 }}>
        {opties.map((opt, i) => (
          <button
            key={i}
            className={optKlasse(i, chosen, juist, locked)}
            disabled={locked}
            onClick={() => {
              sfx('tap')
              setChosen(i)
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Woordtegels ---------- */

export function WordBankEx({ ex, locked, register }: Common & { ex: WordBank }) {
  const tiles = useMemo(() => shuffle([...ex.target.split(' '), ...ex.distractors]), [ex])
  const [picked, setPicked] = useState<number[]>([])

  useEffect(() => {
    register({
      ready: picked.length > 0,
      evaluate: () => ({
        correct: norm(picked.map((i) => tiles[i]).join(' ')) === norm(ex.target),
        correctAnswer: ex.target,
        speakAnswer: ex.target,
      }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked])

  return (
    <div className="float-in">
      <p className="eyebrow">Vertaal deze zin</p>
      <h2 className="prompt-big">{ex.nl}</h2>
      <div className="answer-row">
        {picked.length === 0 && <span className="faint">Tik de woorden in de juiste volgorde…</span>}
        {picked.map((ti, i) => (
          <motion.button
            layout
            key={`${ti}`}
            className="tile tile-picked"
            disabled={locked}
            onClick={() => { sfx('tap'); setPicked((p) => p.filter((x) => x !== ti)) }}
          >
            {tiles[ti]}
          </motion.button>
        ))}
      </div>
      <div className="tile-pool">
        {tiles.map((w, i) => (
          <button
            key={i}
            className={`tile ${picked.includes(i) ? 'used' : ''}`}
            disabled={locked}
            onClick={() => {
              sfx('tap')
              setPicked((p) => [...p, i])
            }}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Match de paren ---------- */

export function MatchEx({
  ex,
  ttsLang,
  onAuto,
}: {
  ex: Match
  ttsLang: string
  onAuto: (r: EvalResult) => void
}) {
  const left = useMemo(() => shuffle(ex.pairs.map((p) => p.nl)), [ex])
  const right = useMemo(() => shuffle(ex.pairs.map((p) => p.target)), [ex])
  const [selL, setSelL] = useState<string | null>(null)
  const [selR, setSelR] = useState<string | null>(null)
  const [done, setDone] = useState<Set<string>>(new Set())
  const [flash, setFlash] = useState<Set<string>>(new Set())
  const [wrongCount, setWrongCount] = useState(0)

  useEffect(() => {
    if (selL && selR) {
      const pair = ex.pairs.find((p) => p.nl === selL)
      if (pair && pair.target === selR) {
        // markeer per KANT, niet per woord: bij een paar waarvan beide talen
        // hetzelfde woord zijn (Duits: hallo → hallo) zou één set met kale
        // strings op 7 van de 8 blijven steken en de les voorgoed vastzetten
        const next = new Set(done)
        next.add(`l:${selL}`)
        next.add(`r:${selR}`)
        setDone(next)
        sfx('correct')
        if (next.size === ex.pairs.length * 2) {
          // je hebt álle paren gevonden, dus dit is nooit een mislukking:
          // hooguit ging het met een omweg. "Bijna." past daar niet bij.
          setTimeout(
            () =>
              onAuto({
                correct: wrongCount === 0,
                match: true,
                misPogingen: wrongCount,
              }),
            500
          )
        }
      } else {
        sfx('wrong')
        setWrongCount((w) => w + 1)
        const f = new Set([`l:${selL}`, `r:${selR}`])
        setFlash(f)
        setTimeout(() => setFlash(new Set()), 450)
      }
      setSelL(null)
      setSelR(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selL, selR])

  const cls = (v: string, side: 'l' | 'r') => {
    if (done.has(`${side}:${v}`)) return 'opt correct dimmed'
    if (flash.has(`${side}:${v}`)) return 'opt wrong'
    const sel = side === 'l' ? selL : selR
    return `opt ${sel === v ? 'selected' : ''}`
  }

  return (
    <div className="float-in">
      <p className="eyebrow" style={{ marginBottom: 16 }}>
        Match de paren
      </p>
      <div className="match-grid">
        <div className="col" style={{ gap: 8 }}>
          {left.map((v) => (
            <button key={v} className={cls(v, 'l')} style={{ justifyContent: 'center', textAlign: 'center' }} onClick={() => { sfx('tap'); setSelL(v) }}>
              {v}
            </button>
          ))}
        </div>
        <div className="col" style={{ gap: 8 }}>
          {right.map((v) => (
            <button
              key={v}
              className={cls(v, 'r')}
              style={{ justifyContent: 'center', textAlign: 'center' }}
              onClick={() => {
                speak(v, ttsLang)
                setSelR(v)
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Luister ---------- */

export function ListenEx({ ex, ttsLang, locked, register }: Common & { ex: Listen }) {
  const { opties, juist } = useGeschud(ex.options, ex.correct)
  const [chosen, setChosen] = useState<number | null>(null)

  useEffect(() => {
    const t = setTimeout(() => speak(ex.target, ttsLang), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    register({
      ready: chosen !== null,
      evaluate: () => ({ correct: chosen === juist, correctAnswer: ex.target, speakAnswer: ex.target }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen])

  return (
    <div className="float-in center">
      <p className="eyebrow" style={{ marginBottom: 16 }}>
        Wat hoor je?
      </p>
      <div className="row" style={{ gap: 12, justifyContent: 'center' }}>
        <button className="speaker-btn" onClick={() => speak(ex.target, ttsLang)} aria-label="Opnieuw luisteren">
          <SpeakerIcon size={34} />
        </button>
        {/* langzaam luisteren: bij een snelle moedertaalspreker valt een zin
            soms pas op de helft van de snelheid uiteen in losse woorden */}
        <button
          className="speaker-sm"
          style={{ color: 'var(--cyan)', fontSize: 19 }}
          onClick={() => speak(ex.target, ttsLang, 0.6)}
          aria-label="Langzaam afspelen"
          title="Langzaam"
        >
          🐢
        </button>
      </div>
      <div className="col" style={{ gap: 8, textAlign: 'left' }}>
        {opties.map((opt, i) => (
          <button
            key={i}
            className={optKlasse(i, chosen, juist, locked)}
            disabled={locked}
            onClick={() => {
              sfx('tap')
              setChosen(i)
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Typ de vertaling ---------- */

/** Accenttekens per taal, tikbaar boven het typveld: een Nederlands
 *  toetsenbord heeft geen ñ of ç en zonder deze rij voelt typen als straf */
const ACCENTEN: Record<string, string[]> = {
  'es-ES': ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'],
  'fr-FR': ['é', 'è', 'ê', 'à', 'ç', 'ô', 'û'],
  'de-DE': ['ä', 'ö', 'ü', 'ß'],
  'pt-PT': ['ã', 'á', 'é', 'ê', 'ç', 'õ', 'ó'],
  'it-IT': ['à', 'è', 'é', 'ì', 'ò', 'ù'],
}

export function TypeEx({ ex, ttsLang, locked, register, onSubmit }: Common & { ex: TypeAnswer }) {
  const [val, setVal] = useState('')

  useEffect(() => {
    const answers = [ex.target, ...(ex.accept ?? [])]
    register({
      ready: val.trim().length > 0,
      evaluate: () => beoordeelTypen(val, answers),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val])

  const accenten = ACCENTEN[ttsLang]

  return (
    <div className="float-in">
      <p className="eyebrow">Typ de vertaling</p>
      <h2 className="prompt-big">{ex.nl}</h2>
      {accenten && !locked && (
        <div className="row" style={{ flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          {accenten.map((a) => (
            <button
              key={a}
              className="tile"
              style={{ minWidth: 44, justifyContent: 'center' }}
              onClick={() => {
                sfx('tap')
                setVal((v) => v + a)
              }}
            >
              {a}
            </button>
          ))}
        </div>
      )}
      <input
        className="type-input"
        value={val}
        disabled={locked}
        onChange={(e) => setVal(e.target.value)}
        // op de telefoon staat Controleren achter het toetsenbord: met Ga
        // (of Enter) hoef je dat nooit weg te vegen
        onKeyDown={(e) => {
          if (e.key === 'Enter' && val.trim().length > 0) {
            e.preventDefault()
            onSubmit?.()
          }
        }}
        enterKeyHint="go"
        placeholder="Typ hier…"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  )
}

/* ---------- Vul in ---------- */

export function FillEx({ ex, locked, register }: Common & { ex: Fill }) {
  const { opties, juist } = useGeschud(ex.options, ex.correct)
  const [chosen, setChosen] = useState<number | null>(null)

  useEffect(() => {
    register({
      ready: chosen !== null,
      evaluate: () => ({
        correct: chosen === juist,
        correctAnswer: `${ex.before} ${ex.options[ex.correct]} ${ex.after}`.replace(/\s+/g, ' ').trim(),
        speakAnswer: `${ex.before} ${ex.options[ex.correct]} ${ex.after}`.replace(/\s+/g, ' ').trim(),
      }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen])

  return (
    <div className="float-in">
      <p className="eyebrow">Vul het gat in</p>
      <h2 className="prompt-big">
        {ex.before}{' '}
        <span
          style={{
            display: 'inline-block',
            minWidth: 70,
            // cyaan = selectie; goud blijft voor beloningen
            borderBottom: '2px solid var(--cyan)',
            color: 'var(--cyan)',
            textAlign: 'center',
          }}
        >
          {chosen !== null ? opties[chosen] : ''}
        </span>{' '}
        {ex.after}
      </h2>
      {ex.nl && (
        <p className="dim" style={{ marginTop: -16, marginBottom: 24, fontSize: 14 }}>
          {ex.nl}
        </p>
      )}
      <div className="col" style={{ gap: 8 }}>
        {opties.map((opt, i) => (
          <button
            key={i}
            className={optKlasse(i, chosen, juist, locked)}
            disabled={locked}
            onClick={() => {
              sfx('tap')
              setChosen(i)
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
