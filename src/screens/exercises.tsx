import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { Fill, Listen, Match, NewWord, Select, TypeAnswer, WordBank } from '../types'
import { sfx, speak } from '../audio'

export interface EvalResult {
  correct: boolean
  correctAnswer?: string
}

export interface Registration {
  ready: boolean
  evaluate: () => EvalResult
}

interface Common {
  ttsLang: string
  locked: boolean
  register: (r: Registration) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'’"«»¿¡]/g, '')
    .replace(/\s+/g, ' ')
}

const SpeakerIcon = ({ size = 26 }: { size?: number }) => (
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
      <p className="eyebrow" style={{ marginBottom: 20 }}>
        Nieuw woord
      </p>
      <button className="speaker-btn" style={{ color: 'var(--gold-bright)' }} onClick={() => speak(ex.word, ttsLang)} aria-label="Luister">
        <SpeakerIcon size={34} />
      </button>
      <h2 className="display gold-text" style={{ fontSize: 40 }}>
        {ex.word}
      </h2>
      <p className="dim" style={{ fontSize: 19, marginTop: 6 }}>
        {ex.nl}
      </p>
      {ex.example && (
        <div className="glass" style={{ marginTop: 26, padding: '16px 18px', textAlign: 'left' }}>
          <div className="row" style={{ gap: 10 }}>
            <button className="speaker-sm" style={{ color: 'var(--gold)' }} onClick={() => speak(ex.example ?? '', ttsLang)} aria-label="Luister voorbeeld">
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
      evaluate: () => ({ correct: chosen === juist, correctAnswer: ex.options[ex.correct] }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen])

  return (
    <div className="float-in">
      <p className="eyebrow">Kies de juiste vertaling</p>
      <div className="row" style={{ gap: 10 }}>
        <h2 className="prompt-big" style={{ flex: 1 }}>
          {ex.prompt}
        </h2>
        {ex.speak && (
          <button className="speaker-sm" style={{ color: 'var(--gold)' }} onClick={() => speak(ex.speak ?? '', ttsLang)} aria-label="Luister">
            <SpeakerIcon size={18} />
          </button>
        )}
      </div>
      <div className="col" style={{ gap: 10 }}>
        {opties.map((opt, i) => (
          <button
            key={i}
            className={`opt ${chosen === i ? 'selected' : ''}`}
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
            className="tile tile-gold"
            disabled={locked}
            onClick={() => setPicked((p) => p.filter((x) => x !== ti))}
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
          setTimeout(() => onAuto({ correct: wrongCount === 0 }), 500)
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
      <p className="eyebrow" style={{ marginBottom: 18 }}>
        Match de paren
      </p>
      <div className="match-grid">
        <div className="col" style={{ gap: 10 }}>
          {left.map((v) => (
            <button key={v} className={cls(v, 'l')} style={{ justifyContent: 'center', textAlign: 'center' }} onClick={() => setSelL(v)}>
              {v}
            </button>
          ))}
        </div>
        <div className="col" style={{ gap: 10 }}>
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
      evaluate: () => ({ correct: chosen === juist, correctAnswer: ex.target }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen])

  return (
    <div className="float-in center">
      <p className="eyebrow" style={{ marginBottom: 20 }}>
        Wat hoor je?
      </p>
      <button className="speaker-btn" style={{ color: 'var(--gold-bright)' }} onClick={() => speak(ex.target, ttsLang)} aria-label="Opnieuw luisteren">
        <SpeakerIcon size={34} />
      </button>
      <div className="col" style={{ gap: 10, textAlign: 'left' }}>
        {opties.map((opt, i) => (
          <button
            key={i}
            className={`opt ${chosen === i ? 'selected' : ''}`}
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

export function TypeEx({ ex, locked, register }: Common & { ex: TypeAnswer }) {
  const [val, setVal] = useState('')

  useEffect(() => {
    const answers = [ex.target, ...(ex.accept ?? [])].map(norm)
    register({
      ready: val.trim().length > 0,
      evaluate: () => ({ correct: answers.includes(norm(val)), correctAnswer: ex.target }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val])

  return (
    <div className="float-in">
      <p className="eyebrow">Typ de vertaling</p>
      <h2 className="prompt-big">{ex.nl}</h2>
      <input
        className="type-input"
        value={val}
        disabled={locked}
        onChange={(e) => setVal(e.target.value)}
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
            borderBottom: '2px solid var(--gold)',
            color: 'var(--gold-bright)',
            textAlign: 'center',
          }}
        >
          {chosen !== null ? opties[chosen] : ''}
        </span>{' '}
        {ex.after}
      </h2>
      {ex.nl && (
        <p className="dim" style={{ marginTop: -16, marginBottom: 22, fontSize: 15 }}>
          {ex.nl}
        </p>
      )}
      <div className="col" style={{ gap: 10 }}>
        {opties.map((opt, i) => (
          <button
            key={i}
            className={`opt ${chosen === i ? 'selected' : ''}`}
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
