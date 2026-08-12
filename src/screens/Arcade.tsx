import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { Course } from '../types'
import { courses } from '../content'
import { useStore } from '../store'
import { kanKlinken, sfx, speak } from '../audio'
import { ShareButton } from '../components/ShareButton'

/* ============================================================
   De speelhal: drie minigames met woorden uit je eigen cursus.
   ============================================================ */

type GameId = 'bliksem' | 'storm' | 'luister'

/** Een woordpaar: het woord in de doeltaal + de Nederlandse vertaling */
interface Pair {
  word: string
  nl: string
}

/** Minimaal aantal geleerde woorden voordat een spel speelbaar is */
const MIN_WORDS = 8

const CONFETTI = ['#A855F7', '#EC4899', '#FFC53D', '#22D3EE', '#4ADE80']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Willekeurig element; `undefined` bij een lege lijst zodat de aanroeper dat afvangt */
function pick<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Alle woordparen uit de cursus; met `only` beperk je het tot bepaalde lessen */
function vocabFrom(course: Course, only?: Set<string>): Pair[] {
  const out: Pair[] = []
  const seen = new Set<string>()
  for (const s of course.sections) {
    for (const u of s.units) {
      for (const l of u.lessons) {
        if (only && !only.has(l.id)) continue
        for (const e of l.exercises) {
          if (e.type !== 'new') continue
          const key = e.word.toLowerCase()
          if (seen.has(key)) continue
          seen.add(key)
          out.push({ word: e.word, nl: e.nl })
        }
      }
    }
  }
  return out
}

interface GameDef {
  id: GameId
  name: string
  emoji: string
  tagline: string
  /** Korte uitleg op de spelkaart */
  how: string
  grad: string
  /** Donkere onderrand voor het 3D-effect */
  shade: string
  glow: string
  /** Scores voor brons, zilver en goud — zonder doel valt er na één potje niets meer te jagen */
  medailles: [number, number, number]
}

/** Welke medaille hoort bij deze score, en hoeveel scheelt het tot de volgende? */
function medailleVoor(def: GameDef, score: number): { nu: string; volgende: string | null; tekort: number } {
  const [brons, zilver, goud] = def.medailles
  if (score >= goud) return { nu: '🥇', volgende: null, tekort: 0 }
  if (score >= zilver) return { nu: '🥈', volgende: '🥇', tekort: goud - score }
  if (score >= brons) return { nu: '🥉', volgende: '🥈', tekort: zilver - score }
  return { nu: '', volgende: '🥉', tekort: brons - score }
}

const GAMES: GameDef[] = [
  {
    id: 'bliksem',
    name: 'Bliksemronde',
    emoji: '⚡',
    tagline: '60 seconden pure snelheid',
    how: 'Zoveel mogelijk vertalingen goed. Elke 5 op rij verhoogt je multiplier.',
    grad: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    shade: '#6b21a8',
    glow: 'rgba(236, 72, 153, 0.45)',
    medailles: [60, 110, 170],
  },
  {
    id: 'storm',
    name: 'Woordstorm',
    emoji: '🌀',
    tagline: '8 paren, zo snel als je kunt',
    how: 'Tik twee tegels die bij elkaar horen. De klok tikt door — missen kost 3 seconden.',
    grad: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)',
    shade: '#0e7490',
    glow: 'rgba(34, 211, 238, 0.42)',
    medailles: [120, 180, 230],
  },
  {
    id: 'luister',
    name: 'Luisterjacht',
    emoji: '🎧',
    tagline: '10 rondes op je gehoor',
    how: 'Je hoort een woord en kiest razendsnel de juiste betekenis.',
    grad: 'linear-gradient(135deg, #ffe08a 0%, #f59e0b 100%)',
    shade: '#b45309',
    glow: 'rgba(255, 197, 61, 0.45)',
    medailles: [60, 105, 145],
  },
]

/**
 * XP-formule per spel — zo blijft de beloning tussen de spellen in balans.
 * Een sterke ronde levert overal grofweg 55-70 XP op; geen enkel spel is
 * dus veel lucratiever dan de andere twee.
 */
function xpFor(game: GameId, score: number): number {
  if (game === 'bliksem') return Math.max(3, Math.round(score * 0.5))
  if (game === 'storm') return Math.max(5, Math.round(score / 4))
  return Math.max(5, Math.round(score / 3))
}

type Phase =
  | { name: 'hub' }
  | { name: 'play'; game: GameId }
  | { name: 'done'; game: GameId; score: number; xp: number; boosted: boolean; prevBest: number; record: boolean; detail: string }

/* ============================================================
   Hoofdscherm
   ============================================================ */

export function ArcadeScreen({ onPlayingChange, onDuels }: { onPlayingChange?: (playing: boolean) => void; onDuels?: () => void } = {}) {
  const courseId = useStore((s) => s.courseId)
  const progress = useStore((s) => s.progress)
  const srs = useStore((s) => s.srs)
  const arcadeBest = useStore((s) => s.arcadeBest)
  const arcadePlays = useStore((s) => s.arcadePlays)
  const weekArcade = useStore((s) => s.weekArcade)
  const awardXp = useStore((s) => s.awardXp)

  const [phase, setPhase] = useState<Phase>({ name: 'hub' })

  // de speelhal-tabs verbergen zodra een spel begint (volledig spelgevoel)
  useEffect(() => {
    onPlayingChange?.(phase.name !== 'hub')
    return () => onPlayingChange?.(false)
  }, [phase.name, onPlayingChange])

  const course = courses[courseId]

  /** Alle woorden van de cursus — prima als afleiders, ook de nog niet geleerde */
  const allWords = useMemo(() => vocabFrom(course), [course])

  /** Woorden die je écht al gezien hebt: uit afgeronde lessen + je herhaalkaarten */
  const myWords = useMemo(() => {
    const done = new Set(progress[courseId]?.completed ?? [])
    const out = vocabFrom(course, done)
    const seen = new Set(out.map((p) => p.word.toLowerCase()))
    for (const e of Object.values(srs)) {
      if (e.courseId !== courseId) continue
      const key = e.word.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ word: e.word, nl: e.nl })
    }
    return out
  }, [course, courseId, progress, srs])

  /**
   * Nieuwe spelers meteen laten spelen: heb je nog geen 8 geleerde woorden,
   * dan pak je de eerste woorden van de cursus — leren terwijl je speelt.
   * Alleen als de cursus zelf te weinig woorden heeft blijft het spel dicht.
   */
  const usingStarter = myWords.length < MIN_WORDS && allWords.length >= MIN_WORDS
  // gememoiseerd: anders krijgt elk spel bij elke render een nieuwe array-referentie
  // binnen, wat de timer-effects daar onnodig opnieuw laat opstarten
  const playWords = useMemo(
    () => (usingStarter ? allWords.slice(0, 16) : myWords),
    [usingStarter, allWords, myWords]
  )
  const locked = playWords.length < MIN_WORDS

  const finish = useCallback(
    (game: GameId, score: number, detail: string) => {
      const st = useStore.getState()
      const prevBest = st.arcadeBest[game] ?? 0
      const boosted = st.boostUntil > Date.now()
      const record = score > prevBest
      const xp = xpFor(game, score)
      awardXp(xp, { arcade: game, score })
      sfx('complete')
      if (record) {
        confetti({ particleCount: 150, spread: 105, origin: { y: 0.62 }, colors: CONFETTI, disableForReducedMotion: true })
        window.setTimeout(
          () => confetti({ particleCount: 90, spread: 120, origin: { y: 0.5 }, colors: CONFETTI, disableForReducedMotion: true }),
          260
        )
      }
      setPhase({ name: 'done', game, score, xp, boosted, prevBest, record, detail })
    },
    [awardXp]
  )

  const toHub = useCallback(() => setPhase({ name: 'hub' }), [])

  if (phase.name === 'play') {
    const shared = { words: playWords, all: allWords, ttsLang: course.ttsLang, onExit: toHub }
    if (phase.game === 'bliksem') return <Bliksem {...shared} onFinish={(s, d) => finish('bliksem', s, d)} />
    if (phase.game === 'storm') return <Storm {...shared} onFinish={(s, d) => finish('storm', s, d)} />
    return <Luister {...shared} onFinish={(s, d) => finish('luister', s, d)} />
  }

  if (phase.name === 'done') {
    const def = GAMES.find((g) => g.id === phase.game) ?? GAMES[0]
    return <Result phase={phase} def={def} onAgain={() => setPhase({ name: 'play', game: phase.game })} onHub={toHub} />
  }

  return (
    <div className="shell">
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p className="eyebrow">Speelhal</p>
        <h1 className="display" style={{ fontSize: 30, marginTop: 4 }}>
          Leren dat <span className="hot-text">niet voelt</span> als leren
        </h1>
        <p className="dim" style={{ fontSize: 14, marginTop: 6 }}>
          {arcadePlays > 0 ? `Je speelde al ${arcadePlays} ${arcadePlays === 1 ? 'potje' : 'potjes'}. Nog één dan?` : 'Kies een spel en verdien XP terwijl je speelt.'}
        </p>
        {/* de weekmissie telt hier mee, dus hier hoor je te zien hoe ver je bent */}
        <div
          className="row"
          style={{
            gap: 8,
            marginTop: 12,
            padding: '8px 13px',
            borderRadius: 999,
            border: `1.5px solid ${weekArcade >= 3 ? 'var(--line-gold)' : 'var(--line)'}`,
            background: weekArcade >= 3 ? 'rgba(255, 197, 61, 0.12)' : 'var(--surface-2)',
            width: 'fit-content',
          }}
        >
          <span style={{ fontSize: 15 }}>🎁</span>
          <span style={{ fontSize: 12.5, fontWeight: 800 }}>
            {weekArcade >= 3 ? (
              <span className="gold-text">Weekmissie gehaald: 3/3 potjes</span>
            ) : (
              <>
                Weekmissie: {weekArcade}/3 potjes
                <span className="dim"> · nog {3 - weekArcade} tot de kist</span>
              </>
            )}
          </span>
        </div>
      </motion.div>

      {locked && (
        <motion.div
          className="glass"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ padding: 16, marginTop: 18, borderColor: 'var(--line-gold)', background: 'rgba(255, 197, 61, 0.09)' }}
        >
          <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 26, lineHeight: 1 }}>🔒</span>
            <div>
              <p className="display" style={{ fontSize: 16 }}>
                Deze cursus heeft nog te weinig woorden
              </p>
              <p className="dim" style={{ fontSize: 13, marginTop: 4 }}>
                Er zijn minstens {MIN_WORDS} woorden nodig om te spelen.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {usingStarter && (
        <motion.div
          className="glass"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ padding: 14, marginTop: 18, borderColor: 'var(--line-hot)' }}
        >
          <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>✨</span>
            <div>
              <p className="display" style={{ fontSize: 15 }}>
                Je speelt met de startwoorden
              </p>
              <p className="dim" style={{ fontSize: 12.5, marginTop: 3 }}>
                Leer terwijl je speelt — hoe meer lessen je doet, hoe meer eigen woorden in de spellen komen.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="col" style={{ gap: 16, marginTop: 20 }}>
        {GAMES.map((g, i) => {
          const best = arcadeBest[g.id] ?? 0
          return (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: locked ? 0.55 : 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.06 * i }}
              whileTap={locked ? undefined : { scale: 0.975, y: 4 }}
              disabled={locked}
              onClick={() => {
                sfx('tap')
                setPhase({ name: 'play', game: g.id })
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '20px 20px 18px',
                borderRadius: 26,
                background: g.grad,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                cursor: locked ? 'default' : 'pointer',
                boxShadow: `0 7px 0 ${g.shade}, 0 16px 36px ${g.glow}`,
                textShadow: '0 1px 2px rgba(0,0,0,0.25)',
              }}
            >
              {/* glans over de kaart */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(120deg, rgba(255,255,255,0.28) 0%, transparent 42%)',
                  pointerEvents: 'none',
                }}
              />
              <span
                aria-hidden
                style={{ position: 'absolute', right: -12, bottom: -22, fontSize: 108, opacity: 0.24, lineHeight: 1, pointerEvents: 'none' }}
              >
                {g.emoji}
              </span>

              <span style={{ position: 'relative', display: 'block' }}>
                <span style={{ fontSize: 34, lineHeight: 1, display: 'block' }}>{g.emoji}</span>
                <span className="display" style={{ fontSize: 25, display: 'block', marginTop: 8 }}>
                  {g.name}
                </span>
                <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, opacity: 0.92 }}>{g.tagline}</span>
                <span style={{ display: 'block', fontSize: 13, marginTop: 8, opacity: 0.85, maxWidth: 260, lineHeight: 1.45 }}>{g.how}</span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 14,
                    padding: '7px 13px',
                    borderRadius: 999,
                    background: 'rgba(0,0,0,0.26)',
                    fontSize: 12.5,
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                  }}
                >
                  {locked
                    ? '🔒 Vergrendeld'
                    : best > 0
                      ? (() => {
                          const m = medailleVoor(g, best)
                          return m.volgende
                            ? `${m.nu || '🏆'} ${best} · nog ${m.tekort} tot ${m.volgende}`
                            : `🥇 ${best} · goud gehaald`
                        })()
                      : `✨ Nog niet gespeeld · ${g.medailles[0]} voor 🥉`}
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* de botduels zaten achter een tab die "Vrienden" heette; wie geen vriend
          met de app heeft, keek daar nooit */}
      {onDuels && !locked && (
        <motion.button
          className="glass"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => {
            sfx('tap')
            onDuels()
          }}
          style={{
            width: '100%',
            marginTop: 14,
            padding: '16px 18px',
            textAlign: 'left',
            borderColor: 'var(--line-hot)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 30, lineHeight: 1 }}>🤖</span>
          <span className="col" style={{ gap: 3, flex: 1, minWidth: 0 }}>
            <strong style={{ fontSize: 15.5 }}>Duel tegen een bot</strong>
            <span className="faint" style={{ fontSize: 12.5 }}>
              Versla Robo Rens, Turbo Tessa of Meester Milan. Telt mee voor je weekkist.
            </span>
          </span>
          <span className="hot-text" style={{ fontSize: 20, fontWeight: 800 }}>
            ›
          </span>
        </motion.button>
      )}

      <p className="faint center" style={{ fontSize: 12.5, marginTop: 22, lineHeight: 1.5 }}>
        Alle spellen gebruiken woorden uit je cursus {course.name}.
        <br />
        Punten worden omgezet in XP voor je divisie.
      </p>
    </div>
  )
}

/* ============================================================
   Gedeelde onderdelen
   ============================================================ */

interface GameProps {
  words: Pair[]
  all: Pair[]
  ttsLang: string
  onExit: () => void
  onFinish: (score: number, detail: string) => void
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Terug naar de speelhal"
      onClick={() => {
        sfx('tap')
        onClick()
      }}
      style={{
        width: 46,
        height: 46,
        borderRadius: 15,
        flexShrink: 0,
        background: 'var(--surface-2)',
        border: '1.5px solid var(--line)',
        color: 'var(--text-dim)',
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ×
    </button>
  )
}

/** Balk die leegloopt; onder de 25% wordt hij rood en pulseert hij */
function TimerBar({ pct, danger }: { pct: number; danger: boolean }) {
  return (
    <div
      style={{
        height: 18,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(1, pct)) * 100}%`,
          height: '100%',
          borderRadius: 999,
          transition: 'width 0.12s linear, background 0.3s ease',
          background: danger ? 'linear-gradient(90deg, #f43f5e, #fb7185)' : 'var(--grad-gold)',
          boxShadow: danger ? '0 0 20px rgba(251,113,133,0.65)' : 'var(--glow-gold)',
          animation: danger ? 'breathe 0.7s ease-in-out infinite' : undefined,
        }}
      />
    </div>
  )
}

function SpeakerIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

/** Vangnet: zonder woorden valt er niets te spelen — nooit een leeg of vastgelopen scherm */
function NoWords({ onExit }: { onExit: () => void }) {
  return (
    <div className="shell">
      <div className="ambient-orb orb-a" />
      <div className="row" style={{ marginBottom: 24 }}>
        <CloseBtn onClick={onExit} />
      </div>
      <div className="glass center" style={{ padding: '30px 20px', borderColor: 'var(--line-gold)' }}>
        <p style={{ fontSize: 42, lineHeight: 1 }}>🔒</p>
        <p className="display" style={{ fontSize: 18, marginTop: 12 }}>
          Nog te weinig woorden
        </p>
        <p className="dim" style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.5 }}>
          Doe eerst een paar lessen — daarna vullen de spellen zich vanzelf met jouw woorden.
        </p>
      </div>
      <button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={onExit}>
        Terug naar de speelhal
      </button>
    </div>
  )
}

/**
 * Aftellen voordat de klok gaat lopen. Tikken slaat het over: wie net op
 * "Nog een keer" drukte, wil spelen en niet wachten. De spelregels staan hier
 * groot, want tijdens het potje leest niemand meer.
 */
function Countdown({ onDone, uitleg }: { onDone: () => void; uitleg?: string }) {
  const [n, setN] = useState(3)
  const firedRef = useRef(false)

  const start = useCallback(() => {
    if (firedRef.current) return
    firedRef.current = true
    onDone()
  }, [onDone])

  useEffect(() => {
    const iv = window.setInterval(() => setN((v) => v - 1), 700)
    return () => window.clearInterval(iv)
  }, [])

  useEffect(() => {
    if (n > -1) return
    start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  return (
    <button
      className="center"
      onClick={() => {
        sfx('tap')
        start()
      }}
      style={{ padding: '48px 16px', width: '100%', display: 'block' }}
      aria-label="Nu starten"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={n}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="display gold-text"
          style={{ fontSize: n <= 0 ? 62 : 96, lineHeight: 1 }}
        >
          {n > 0 ? n : 'GO!'}
        </motion.div>
      </AnimatePresence>
      {uitleg && (
        <p className="dim" style={{ fontSize: 15, maxWidth: 300, margin: '18px auto 0', lineHeight: 1.45 }}>
          {uitleg}
        </p>
      )}
      <p className="faint" style={{ fontSize: 12.5, marginTop: 16 }}>
        Tik om meteen te beginnen
      </p>
    </button>
  )
}

/* ============================================================
   Spel 1 — Bliksemronde
   ============================================================ */

const ROUND_MS = 60000

interface Question {
  prompt: string
  answer: string
  options: string[]
  /** true = je ziet Nederlands en kiest de doeltaal */
  toTarget: boolean
  word: string
}

function makeQuestion(words: Pair[], all: Pair[], avoid: string, optionCount: number): Question | null {
  const cands = words.length > 1 ? words.filter((p) => p.word !== avoid) : words
  const target = pick(cands) ?? pick(words)
  if (!target) return null
  const toTarget = Math.random() < 0.5
  const answer = toTarget ? target.word : target.nl
  const prompt = toTarget ? target.nl : target.word

  const others: string[] = []
  for (const p of shuffle(all)) {
    if (p.word.toLowerCase() === target.word.toLowerCase()) continue
    const v = toTarget ? p.word : p.nl
    if (v.toLowerCase() === answer.toLowerCase()) continue
    if (others.some((o) => o.toLowerCase() === v.toLowerCase())) continue
    others.push(v)
    if (others.length >= optionCount - 1) break
  }

  const options = shuffle([answer, ...others])
  return { prompt, answer, options, toTarget, word: target.word }
}

function Bliksem({ words, all, onExit, onFinish }: GameProps) {
  const [running, setRunning] = useState(false)
  const [over, setOver] = useState(false)
  const [remaining, setRemaining] = useState(ROUND_MS)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [pop, setPop] = useState<{ id: number; text: string; good: boolean } | null>(null)
  const [q, setQ] = useState<Question | null>(() => makeQuestion(words, all, '', 3))

  const endRef = useRef(0)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const bestComboRef = useRef(0)
  const doneRef = useRef(false)
  const timers = useRef<number[]>([])

  const later = (fn: () => void, ms: number) => {
    // afgelopen timers meteen uit de lijst halen: over 60 seconden lopen er
    // anders tientallen id's op te hopen die nooit worden opgeruimd
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id)
      fn()
    }, ms)
    timers.current.push(id)
  }

  useEffect(() => {
    const list = timers
    return () => {
      for (const t of list.current) window.clearTimeout(t)
      list.current = []
    }
  }, [])

  const stop = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    // `over` apart van `running`: anders valt het scherm terug op de aftelling
    setOver(true)
    setRunning(false)
    onFinish(scoreRef.current, `${scoreRef.current} punten · beste combo ${bestComboRef.current}`)
  }, [onFinish])

  // de klok: telt af en stopt het spel op nul
  useEffect(() => {
    if (!running) return
    const iv = window.setInterval(() => {
      const left = endRef.current - Date.now()
      setRemaining(Math.max(0, left))
      if (left <= 0) {
        window.clearInterval(iv)
        stop()
      }
    }, 100)
    return () => window.clearInterval(iv)
  }, [running, stop])

  const start = () => {
    endRef.current = Date.now() + ROUND_MS
    setRemaining(ROUND_MS)
    setRunning(true)
  }

  const multiplier = Math.min(5, 1 + Math.floor(combo / 5))

  const answer = (i: number) => {
    if (!q || picked !== null || !running || doneRef.current) return
    setPicked(i)
    const good = q.options[i] === q.answer

    if (good) {
      const mult = Math.min(5, 1 + Math.floor(comboRef.current / 5))
      const gain = mult
      scoreRef.current += gain
      comboRef.current += 1
      bestComboRef.current = Math.max(bestComboRef.current, comboRef.current)
      endRef.current += 500 // een halve seconde erbij als beloning
      setScore(scoreRef.current)
      setCombo(comboRef.current)
      setBestCombo(bestComboRef.current)
      setPop({ id: Date.now(), text: `+${gain}`, good: true })
      sfx('correct')
    } else {
      comboRef.current = 0
      endRef.current -= 2000 // twee seconden straf
      setCombo(0)
      setPop({ id: Date.now(), text: '−2s', good: false })
      sfx('wrong')
    }

    later(() => {
      setPop(null)
      setPicked(null)
      setQ(makeQuestion(words, all, q.word, 3))
    }, good ? 260 : 520)
  }

  const secs = Math.ceil(remaining / 1000)
  const danger = remaining <= 10000

  if (!q) return <NoWords onExit={onExit} />

  return (
    <div className="shell">
      <div className="ambient-orb orb-a" />

      <div className="row" style={{ gap: 14, marginBottom: 18 }}>
        <CloseBtn onClick={onExit} />
        <div style={{ flex: 1 }}>
          <TimerBar pct={remaining / ROUND_MS} danger={danger} />
        </div>
        <div
          className="display"
          style={{ fontSize: 22, minWidth: 46, textAlign: 'right', color: danger ? 'var(--err)' : 'var(--gold)' }}
        >
          {secs}s
        </div>
      </div>

      {!running && !over ? (
        <Countdown onDone={start} uitleg="Zoveel mogelijk vertalingen goed in 60 seconden. Elke 5 op rij verhoogt je multiplier — tot 5×." />
      ) : (
        <>
          <div className="spread" style={{ marginBottom: 6 }}>
            <div>
              <p className="eyebrow">Punten</p>
              <motion.p key={score} initial={{ scale: 1.35 }} animate={{ scale: 1 }} className="display gold-text" style={{ fontSize: 40, lineHeight: 1 }}>
                {score}
              </motion.p>
            </div>

            <div style={{ position: 'relative', textAlign: 'right' }}>
              <AnimatePresence>
                {pop && (
                  <motion.div
                    key={pop.id}
                    initial={{ opacity: 0, y: 6, scale: 0.7 }}
                    animate={{ opacity: 1, y: -22, scale: 1 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="display"
                    style={{ position: 'absolute', right: 0, top: -6, fontSize: 24, color: pop.good ? 'var(--ok)' : 'var(--err)' }}
                  >
                    {pop.text}
                  </motion.div>
                )}
              </AnimatePresence>
              {combo >= 2 && (
                <motion.div
                  key={multiplier}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="display"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 999,
                    background: multiplier > 1 ? 'var(--grad-hot)' : 'var(--surface-2)',
                    boxShadow: multiplier > 1 ? '0 0 22px rgba(236,72,153,0.5)' : undefined,
                    fontSize: 16,
                    color: '#fff',
                  }}
                >
                  🔥 {combo} op rij {multiplier > 1 && <span style={{ fontSize: 18 }}>×{multiplier}</span>}
                </motion.div>
              )}
            </div>
          </div>

          <motion.div key={q.prompt + q.word} initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}>
            <div
              className="glass center"
              style={{ padding: '26px 18px', marginTop: 14, marginBottom: 18, borderColor: 'var(--line-hot)', background: 'rgba(168,85,247,0.1)' }}
            >
              <p className="eyebrow">{q.toTarget ? 'Hoe zeg je dit?' : 'Wat betekent dit?'}</p>
              <p className="display" style={{ fontSize: 30, marginTop: 8 }}>
                {q.prompt}
              </p>
            </div>

            <div className="col" style={{ gap: 12 }}>
              {q.options.map((opt, i) => {
                const isRight = opt === q.answer
                const cls = picked === null ? 'opt' : isRight ? 'opt correct' : picked === i ? 'opt wrong' : 'opt dimmed'
                return (
                  <button
                    key={opt + i}
                    className={cls}
                    style={{ justifyContent: 'center', textAlign: 'center', minHeight: 62, fontSize: 18 }}
                    onClick={() => answer(i)}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>

          <p className="faint center" style={{ fontSize: 12, marginTop: 18 }}>
            Goed = +0,5 seconde · fout = −2 seconden · elke 5 goed op rij verhoogt je multiplier (tot ×5)
          </p>
          {bestCombo > 0 && (
            <p className="faint center" style={{ fontSize: 12, marginTop: 4 }}>
              Beste combo deze ronde: {bestCombo}
            </p>
          )}
        </>
      )}
    </div>
  )
}

/* ============================================================
   Spel 2 — Woordstorm
   ============================================================ */

interface StormTile {
  id: number
  pairId: number
  text: string
  side: 'nl' | 't'
  done: boolean
}

const STORM_PAIRS = 8
const STORM_PENALTY = 3000

function buildTiles(words: Pair[]): StormTile[] {
  // korte woorden passen netter in het raster
  const short = words.filter((p) => p.word.length <= 13 && p.nl.length <= 13)
  const source = short.length >= STORM_PAIRS ? short : words
  const chosen = shuffle(source).slice(0, STORM_PAIRS)
  const tiles: StormTile[] = []
  chosen.forEach((p, i) => {
    tiles.push({ id: i * 2, pairId: i, text: p.nl, side: 'nl', done: false })
    tiles.push({ id: i * 2 + 1, pairId: i, text: p.word, side: 't', done: false })
  })
  return shuffle(tiles)
}

function Storm({ words, onExit, onFinish }: GameProps) {
  const [running, setRunning] = useState(false)
  const [over, setOver] = useState(false)
  const [tiles, setTiles] = useState<StormTile[]>(() => buildTiles(words))
  const [selected, setSelected] = useState<number | null>(null)
  const [wrong, setWrong] = useState<number[]>([])
  const [matched, setMatched] = useState(0)
  const [misses, setMisses] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  const startRef = useRef(0)
  const penaltyRef = useRef(0)
  const doneRef = useRef(false)
  const matchedRef = useRef(0)
  const missesRef = useRef(0)
  const timers = useRef<number[]>([])

  // écht aantal paren op het bord: met een kleine cursus kunnen dat er minder
  // dan STORM_PAIRS zijn — dan mag de eindvoorwaarde daar niet op wachten
  const totalPairs = tiles.length / 2

  useEffect(() => {
    const list = timers
    return () => {
      for (const t of list.current) window.clearTimeout(t)
      list.current = []
    }
  }, [])

  // de klok telt op zolang je bezig bent
  useEffect(() => {
    if (!running) return
    const iv = window.setInterval(() => {
      setElapsed(Date.now() - startRef.current + penaltyRef.current)
    }, 100)
    return () => window.clearInterval(iv)
  }, [running])

  const start = () => {
    startRef.current = Date.now()
    penaltyRef.current = 0
    setElapsed(0)
    setRunning(true)
  }

  const tap = (t: StormTile) => {
    if (!running || doneRef.current || t.done || wrong.length > 0) return
    if (selected === t.id) {
      setSelected(null)
      return
    }
    if (selected === null) {
      sfx('tap')
      setSelected(t.id)
      return
    }
    const first = tiles.find((x) => x.id === selected)
    if (!first) {
      setSelected(t.id)
      return
    }

    if (first.pairId === t.pairId) {
      sfx('correct')
      setTiles((prev) => prev.map((x) => (x.pairId === t.pairId ? { ...x, done: true } : x)))
      setSelected(null)
      // via een ref geteld: twee tikken binnen één frame zouden anders
      // dezelfde `matched`-waarde lezen en een match kwijtraken
      matchedRef.current += 1
      const n = matchedRef.current
      setMatched(n)
      if (n >= totalPairs) {
        doneRef.current = true
        setOver(true)
        setRunning(false)
        const total = Date.now() - startRef.current + penaltyRef.current
        const secs = Math.max(1, Math.round(total / 1000))
        const score = Math.max(10, 300 - secs * 3)
        const m = missesRef.current
        setElapsed(total) // eindtijd op het scherm gelijk aan de gerapporteerde tijd
        timers.current.push(window.setTimeout(() => onFinish(score, `${secs} seconden · ${m} ${m === 1 ? 'misser' : 'missers'}`), 460))
      }
    } else {
      sfx('wrong')
      penaltyRef.current += STORM_PENALTY
      missesRef.current += 1
      setMisses(missesRef.current)
      setWrong([first.id, t.id])
      setSelected(null)
      timers.current.push(window.setTimeout(() => setWrong([]), 520))
    }
  }

  const secs = elapsed / 1000

  if (totalPairs < 2) return <NoWords onExit={onExit} />

  return (
    <div className="shell">
      <div className="ambient-orb orb-b" />

      <div className="row" style={{ gap: 14, marginBottom: 20 }}>
        <CloseBtn onClick={onExit} />
        <div style={{ flex: 1 }}>
          <p className="eyebrow">Woordstorm</p>
          <p className="dim" style={{ fontSize: 13 }}>
            {matched} van {totalPairs} paren
          </p>
        </div>
        <div className="display" style={{ fontSize: 26, color: 'var(--cyan)', minWidth: 76, textAlign: 'right' }}>
          {secs.toFixed(1)}s
        </div>
      </div>

      {!running && !over ? (
        <Countdown onDone={start} uitleg="Tik twee tegels die bij elkaar horen. Hoe sneller je alle 8 paren vindt, hoe hoger je score — missen kost 3 seconden." />
      ) : (
        <>
          <div className="progress-track" style={{ marginBottom: 18 }}>
            <div
              className="progress-fill"
              style={{ width: `${(matched / totalPairs) * 100}%`, background: 'linear-gradient(90deg,#22d3ee,#6366f1)', transition: 'width 0.3s ease' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 9 }}>
            {tiles.map((t) => {
              const isSel = selected === t.id
              const isWrong = wrong.includes(t.id)
              const nl = t.side === 'nl'
              return (
                <motion.button
                  key={t.id}
                  onClick={() => tap(t)}
                  animate={
                    t.done
                      ? { scale: [1, 1.22, 0], opacity: [1, 1, 0] }
                      : isWrong
                        ? { x: [0, -7, 7, -5, 5, 0], scale: 1, opacity: 1 }
                        : { scale: isSel ? 1.06 : 1, opacity: 1, x: 0 }
                  }
                  transition={{ duration: t.done ? 0.38 : isWrong ? 0.42 : 0.16 }}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: 16,
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontWeight: 700,
                    lineHeight: 1.15,
                    overflowWrap: 'anywhere',
                    hyphens: 'auto',
                    fontSize: t.text.length > 10 ? 10.5 : t.text.length > 7 ? 12 : 13.5,
                    pointerEvents: t.done ? 'none' : 'auto',
                    color: isSel ? '#fff' : 'var(--text)',
                    background: isSel
                      ? 'var(--grad-hot)'
                      : isWrong
                        ? 'var(--err-bg)'
                        : nl
                          ? 'rgba(168,85,247,0.14)'
                          : 'rgba(34,211,238,0.13)',
                    border: `2px solid ${isSel ? 'transparent' : isWrong ? 'var(--err)' : nl ? 'rgba(168,85,247,0.42)' : 'rgba(34,211,238,0.42)'}`,
                    boxShadow: isSel ? '0 4px 0 #6b21a8, 0 0 20px rgba(236,72,153,0.45)' : '0 4px 0 rgba(0,0,0,0.35)',
                  }}
                >
                  {t.text}
                </motion.button>
              )
            })}
          </div>

          <div className="row" style={{ justifyContent: 'center', gap: 18, marginTop: 20 }}>
            <span className="faint" style={{ fontSize: 12 }}>
              <span style={{ color: 'var(--hot1)' }}>■</span> Nederlands
            </span>
            <span className="faint" style={{ fontSize: 12 }}>
              <span style={{ color: 'var(--cyan)' }}>■</span> Vertaling
            </span>
          </div>
          <p className="faint center" style={{ fontSize: 12, marginTop: 6 }}>
            Elke misser kost 3 seconden{misses > 0 ? ` · ${misses} tot nu toe` : ''}
          </p>
        </>
      )}
    </div>
  )
}

/* ============================================================
   Spel 3 — Luisterjacht
   ============================================================ */

const LUISTER_ROUNDS = 10
const LUISTER_MS = 8000

interface ListenQ {
  word: string
  nl: string
  options: string[]
}

function buildRounds(words: Pair[], all: Pair[]): ListenQ[] {
  const base = shuffle(words)
  const out: ListenQ[] = []
  if (base.length === 0) return out // anders wordt `i % 0` NaN en crasht de ronde
  for (let i = 0; i < LUISTER_ROUNDS; i++) {
    const target = base[i % base.length]
    const others: string[] = []
    for (const p of shuffle(all)) {
      if (p.nl.toLowerCase() === target.nl.toLowerCase()) continue
      if (others.some((o) => o.toLowerCase() === p.nl.toLowerCase())) continue
      others.push(p.nl)
      if (others.length >= 3) break
    }
    out.push({ word: target.word, nl: target.nl, options: shuffle([target.nl, ...others]) })
  }
  return out
}

function Luister({ words, all, ttsLang, onExit, onFinish }: GameProps) {
  const [rounds] = useState<ListenQ[]>(() => buildRounds(words, all))
  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const [state, setState] = useState<'ask' | 'feedback'>('ask')
  const [picked, setPicked] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(LUISTER_MS)
  const [correct, setCorrect] = useState(0)
  const [bonus, setBonus] = useState(0)

  const endRef = useRef(0)
  const correctRef = useRef(0)
  const bonusRef = useRef(0)
  const doneRef = useRef(false)

  const q = rounds[Math.min(idx, rounds.length - 1)]

  /** kan dit toestel de doeltaal überhaupt laten klinken? */
  const stil = useMemo(() => (q ? !kanKlinken(q.word, ttsLang) : false), [q, ttsLang])
  /** vangnet bij stilte: na drie seconden zie je het woord alsnog */
  const [toonWoord, setToonWoord] = useState(false)

  // ronde starten: woord uitspreken en de klok laten lopen
  useEffect(() => {
    if (!q || !started || state !== 'ask' || doneRef.current) return
    endRef.current = Date.now() + LUISTER_MS
    setRemaining(LUISTER_MS)
    setToonWoord(false)
    const vangnet = stil ? window.setTimeout(() => setToonWoord(true), 3000) : null
    const t = window.setTimeout(() => speak(q.word, ttsLang), 220)
    const iv = window.setInterval(() => {
      const left = endRef.current - Date.now()
      setRemaining(Math.max(0, left))
      if (left <= 0) {
        window.clearInterval(iv)
        setPicked(null)
        setState('feedback')
        sfx('wrong')
      }
    }, 100)
    return () => {
      window.clearTimeout(t)
      window.clearInterval(iv)
      if (vangnet !== null) window.clearTimeout(vangnet)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, state, started])

  // korte terugkoppeling, daarna door naar de volgende ronde
  useEffect(() => {
    if (state !== 'feedback' || doneRef.current || rounds.length === 0) return
    const t = window.setTimeout(() => {
      if (idx + 1 >= rounds.length) {
        doneRef.current = true
        const score = correctRef.current * 10 + bonusRef.current
        onFinish(score, `${correctRef.current} van ${rounds.length} goed · ${bonusRef.current} tijdbonus`)
      } else {
        setPicked(null)
        setIdx(idx + 1)
        setState('ask')
      }
    }, 1050)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, idx])

  const answer = (i: number) => {
    if (!q || state !== 'ask' || picked !== null || doneRef.current) return
    setPicked(i)
    const good = q.options[i] === q.nl
    if (good) {
      const gain = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000))
      correctRef.current += 1
      bonusRef.current += gain
      setCorrect(correctRef.current)
      setBonus(bonusRef.current)
      sfx('correct')
    } else {
      sfx('wrong')
    }
    setState('feedback')
  }

  if (!q) return <NoWords onExit={onExit} />

  if (!started) {
    return (
      <div className="shell">
        <div className="ambient-orb orb-a" />
        <div className="row" style={{ marginBottom: 10 }}>
          <CloseBtn onClick={onExit} />
        </div>
        <Countdown onDone={() => setStarted(true)} uitleg="Je hoort een woord en kiest de juiste betekenis. Elke ronde duurt 8 seconden: hoe sneller je kiest, hoe meer tijdbonus." />
        {stil ? (
          // zonder geluid is dit spel onspeelbaar; dat zeggen we vóór de klok loopt
          <div
            className="glass"
            style={{ padding: 14, marginTop: 6, borderColor: 'var(--line-gold)', background: 'rgba(255,197,61,0.09)' }}
          >
            <p style={{ fontSize: 13.5, fontWeight: 700 }}>🔇 Geen geluid beschikbaar</p>
            <p className="faint" style={{ fontSize: 12.5, marginTop: 4 }}>
              Je toestel heeft hiervoor geen stem. Het woord verschijnt na drie seconden in beeld, zodat je toch kunt spelen.
            </p>
          </div>
        ) : (
          <p className="dim center" style={{ fontSize: 14 }}>
            Zet je geluid aan — je hoort steeds één woord.
          </p>
        )}
      </div>
    )
  }

  const pctRound = remaining / LUISTER_MS

  return (
    <div className="shell">
      <div className="ambient-orb orb-a" />

      <div className="row" style={{ gap: 14, marginBottom: 16 }}>
        <CloseBtn onClick={onExit} />
        <div style={{ flex: 1 }}>
          <div className="spread" style={{ marginBottom: 6 }}>
            <span className="eyebrow">
              Ronde {idx + 1}/{rounds.length}
            </span>
            <span className="display gold-text" style={{ fontSize: 16 }}>
              {correct * 10 + bonus} pnt
            </span>
          </div>
          <TimerBar pct={pctRound} danger={remaining <= 3000} />
        </div>
      </div>

      <div className="center" style={{ marginTop: 8 }}>
        <motion.button
          key={idx}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.93 }}
          className="speaker-btn"
          style={{ color: 'var(--gold-bright)', width: 104, height: 104, marginBottom: 18 }}
          onClick={() => speak(q.word, ttsLang)}
          aria-label="Woord opnieuw afspelen"
        >
          <SpeakerIcon size={42} />
        </motion.button>
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          {state === 'feedback' || (stil && toonWoord) ? q.word : 'Wat hoor je?'}
        </p>
      </div>

      <div className="col" style={{ gap: 12 }}>
        {q.options.map((opt, i) => {
          const isRight = opt === q.nl
          const cls =
            state === 'ask' ? 'opt' : isRight ? 'opt correct' : picked === i ? 'opt wrong' : 'opt dimmed'
          return (
            <button
              key={opt + i}
              className={cls}
              style={{ justifyContent: 'center', textAlign: 'center', minHeight: 60, fontSize: 17 }}
              onClick={() => answer(i)}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <p className="faint center" style={{ fontSize: 12, marginTop: 18 }}>
        Goed = 10 punten + 1 punt per resterende seconde
      </p>
    </div>
  )
}

/* ============================================================
   Eindscherm
   ============================================================ */

function Result({
  phase,
  def,
  onAgain,
  onHub,
}: {
  phase: Extract<Phase, { name: 'done' }>
  def: GameDef
  onAgain: () => void
  onHub: () => void
}) {
  const best = Math.max(phase.prevBest, phase.score)
  const shownXp = phase.boosted ? phase.xp * 2 : phase.xp

  return (
    <div className="shell">
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />

      <div className="row" style={{ marginBottom: 8 }}>
        <CloseBtn onClick={onHub} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="center" style={{ marginTop: 14 }}>
        <motion.div
          initial={{ scale: 0.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 12 }}
          style={{ fontSize: 74, lineHeight: 1 }}
        >
          {phase.record ? '🏆' : def.emoji}
        </motion.div>

        <h1 className="display" style={{ fontSize: 28, marginTop: 10 }}>
          {phase.record ? <span className="gold-text">Nieuw record!</span> : 'Goed gespeeld!'}
        </h1>
        <p className="dim" style={{ fontSize: 14, marginTop: 4 }}>
          {def.name} · {phase.detail}
        </p>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.14, type: 'spring', stiffness: 200, damping: 14 }}
          className="glass"
          style={{ padding: '26px 18px', marginTop: 22, background: 'rgba(255,255,255,0.05)' }}
        >
          <p className="eyebrow">Jouw score</p>
          <p className="display gold-text" style={{ fontSize: 62, lineHeight: 1.05 }}>
            {phase.score}
          </p>
          <div className="divider-gold" />
          <div className="stat-grid">
            <div className="glass stat-card">
              <p className="stat-value" style={{ fontSize: 26 }}>
                {best}
              </p>
              <p className="stat-label">Beste ooit</p>
            </div>
            <div className="glass stat-card">
              <p className="stat-value hot-text" style={{ fontSize: 26 }}>
                +{shownXp}
              </p>
              <p className="stat-label">{phase.boosted ? 'XP (2× boost)' : 'XP verdiend'}</p>
            </div>
          </div>
          {/* iets om op te jagen: zonder volgend doel is één potje genoeg geweest */}
          {(() => {
            const m = medailleVoor(def, phase.score)
            return (
              <p style={{ fontSize: 14, marginTop: 16, fontWeight: 700 }}>
                {m.volgende ? (
                  <>
                    {m.nu && <span style={{ fontSize: 18 }}>{m.nu} </span>}
                    <span className="dim">Nog </span>
                    <span className="gold-text">{m.tekort}</span>
                    <span className="dim"> {m.tekort === 1 ? 'punt' : 'punten'} tot </span>
                    <span style={{ fontSize: 18 }}>{m.volgende}</span>
                  </>
                ) : (
                  <span className="gold-text">🥇 Goud gehaald. Hoger dan dit gaat niet.</span>
                )}
              </p>
            )
          })()}
        </motion.div>

        <div className="col" style={{ gap: 12, marginTop: 26 }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              sfx('tap')
              onAgain()
            }}
          >
            🔁 Nog een keer
          </button>
          <ShareButton
            label={phase.record ? 'Deel je record' : 'Deel je score'}
            kaart={{
              icoon: phase.record ? '🏆' : def.emoji,
              waarde: String(phase.score),
              label: `punten · ${def.name}`,
              onderschrift: phase.record ? 'Nieuw persoonlijk record' : `Beste ooit: ${best}`,
              bericht: phase.record
                ? `Nieuw record bij ${def.name}: ${phase.score} punten in Fluent!`
                : `${phase.score} punten bij ${def.name} in Fluent!`,
            }}
          />
          <button
            className="btn btn-ghost"
            onClick={() => {
              sfx('tap')
              onHub()
            }}
          >
            Terug naar de speelhal
          </button>
        </div>
      </motion.div>
    </div>
  )
}
