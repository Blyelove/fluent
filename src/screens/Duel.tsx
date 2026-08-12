import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { Course, CourseId, Fill, Listen, Select, TypeAnswer, WordBank } from '../types'
import { courses } from '../content'
import { totalXp, useStore } from '../store'
import { levelForXp } from '../levels'
import { sfx } from '../audio'
import { Avatar } from '../components/Avatar'
import { Flag } from '../components/Flag'
import { courseFlagCode } from '../countries'
import { decodeDuel, duelLink, encodeDuel, seededPick, type DuelPayload } from '../duel'
import { FillEx, ListenEx, SelectEx, TypeEx, WordBankEx, type EvalResult, type Registration } from './exercises'

/** Alleen oefeningen waar je een antwoord op kunt geven — geen 'new' en geen 'match' */
type QuizEx = Select | TypeAnswer | Listen | Fill | WordBank

const QUESTIONS = 10

/* ---------- open uitdagingen (wachten op antwoord van je vriend) ---------- */

interface OpenDuel {
  /** seed — hiermee herkennen we het antwoord van je vriend */
  s: number
  c: CourseId
  score: number
  total: number
  /** de deel-link die je nog eens kunt kopiëren */
  link: string
  day: string
}

const OPEN_KEY = 'fluent-duels-open'

const MAX_OPEN = 8

/** Streng valideren: opslag kan oud, half of door iets anders beschreven zijn */
function isOpenDuel(v: unknown): v is OpenDuel {
  if (typeof v !== 'object' || v === null) return false
  const d = v as Record<string, unknown>
  return (
    typeof d.s === 'number' &&
    Number.isFinite(d.s) &&
    typeof d.c === 'string' &&
    d.c in courses &&
    typeof d.score === 'number' &&
    Number.isFinite(d.score) &&
    typeof d.total === 'number' &&
    d.total > 0 &&
    typeof d.link === 'string' &&
    d.link.length > 0 &&
    typeof d.day === 'string'
  )
}

function readOpen(): OpenDuel[] {
  try {
    const raw = localStorage.getItem(OPEN_KEY)
    if (!raw) return []
    const arr: unknown = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    const seen = new Set<number>()
    const out: OpenDuel[] = []
    // dubbele seeds zouden dubbele React-keys geven — hier meteen filteren
    for (const v of arr) {
      if (!isOpenDuel(v) || seen.has(v.s)) continue
      seen.add(v.s)
      out.push(v)
    }
    return out.slice(-MAX_OPEN)
  } catch {
    return []
  }
}

function writeOpen(list: OpenDuel[]) {
  try {
    localStorage.setItem(OPEN_KEY, JSON.stringify(list.slice(-MAX_OPEN)))
  } catch {
    /* opslag geblokkeerd of vol — niet erg, je link staat ook in je chat */
  }
}

/* ---------- hulpjes ---------- */

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function quizPool(course: Course): QuizEx[] {
  const out: QuizEx[] = []
  for (const s of course.sections)
    for (const u of s.units)
      for (const l of u.lessons)
        for (const e of l.exercises) if (e.type !== 'new' && e.type !== 'match') out.push(e)
  return out
}

function burst() {
  confetti({
    particleCount: 140,
    spread: 110,
    origin: { y: 0.6 },
    colors: ['#A855F7', '#EC4899', '#FFC53D', '#22D3EE'],
    disableForReducedMotion: true,
  })
}

/** Accepteert zowel een losse code als een volledige link */
function codeFromInput(raw: string): string {
  // WhatsApp plakt soms regeleindes of spaties mee
  const t = raw.replace(/\s+/g, '')
  const i = t.indexOf('duel=')
  const rest = i >= 0 ? t.slice(i + 5) : t
  // alles na een & of # hoort niet meer bij de code
  return rest.split('&')[0]?.split('#')[0] ?? ''
}

/** Naam uit een link is vreemde data: alleen tekst, kort genoeg voor de layout */
function safeName(v: unknown, fallback: string): string {
  if (typeof v !== 'string') return fallback
  const t = v.replace(/\s+/g, ' ').trim().slice(0, 16)
  return t || fallback
}

/** Getal uit een link: nooit NaN, altijd binnen redelijke grenzen */
function safeInt(v: unknown, fallback: number, min: number, max: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return fallback
  return Math.min(max, Math.max(min, Math.round(v)))
}

/**
 * Een gedecodeerde duel-link komt van buiten de app. Alles wat we tonen of
 * opslaan gaat hier eerst doorheen — een kapotte of gerommelde link mag
 * nooit het scherm laten crashen.
 */
function sanitize(p: DuelPayload | null): DuelPayload | null {
  if (!p || typeof p.c !== 'string' || !(p.c in courses)) return null
  return {
    c: p.c,
    s: safeInt(p.s, 0, 0, 2147483647),
    n: safeName(p.n, ''),
    x: safeInt(p.x, -1, -1, 999),
    q: safeInt(p.q, QUESTIONS, 1, 50),
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/* ---------- deelblok: kopiëren + WhatsApp ---------- */

function ShareBox({ value, waText, copyLabel }: { value: string; waText: string; copyLabel: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')
  // levend houden zodat we na unmount geen state meer zetten
  const alive = useRef(true)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <div>
      <input
        className="type-input"
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        style={{ fontSize: 13, marginBottom: 10, letterSpacing: '0.01em' }}
        aria-label="Jouw duel-code"
      />
      <button
        className="btn btn-primary"
        style={{ marginBottom: 10 }}
        onClick={() => {
          sfx('tap')
          void copyText(value).then((ok) => {
            if (!alive.current) return
            setState(ok ? 'ok' : 'fail')
            if (timer.current !== null) window.clearTimeout(timer.current)
            timer.current = window.setTimeout(() => {
              if (alive.current) setState('idle')
            }, 2600)
          })
        }}
      >
        {state === 'ok' ? '✅ Gekopieerd!' : state === 'fail' ? '👆 Selecteer hierboven en kopieer' : `📋 ${copyLabel}`}
      </button>
      <a
        className="btn btn-ghost"
        href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: 'none', color: 'var(--text)' }}
        onClick={() => sfx('tap')}
      >
        💬 Deel via WhatsApp
      </a>
    </div>
  )
}

/* ---------- scorebord tijdens het duel ---------- */

function ScoreBar({ you, them, name, total }: { you: number; them: number; name: string; total: number }) {
  return (
    <div className="row" style={{ gap: 10, marginBottom: 18 }}>
      <motion.div
        className="glass"
        key={`you-${you}`}
        initial={{ scale: 0.94 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 16 }}
        style={{ flex: 1, minWidth: 0, padding: '10px 12px', borderColor: 'var(--line-hot)' }}
      >
        <p className="eyebrow" style={{ fontSize: 10 }}>
          Jij
        </p>
        <strong className="display hot-text" style={{ fontSize: 24 }}>
          {you}
        </strong>
      </motion.div>
      <span className="faint display" style={{ fontSize: 17 }}>
        vs
      </span>
      <div className="glass" style={{ flex: 1, minWidth: 0, padding: '10px 12px', textAlign: 'right' }}>
        <p className="eyebrow" style={{ fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </p>
        <strong className="display gold-text" style={{ fontSize: 24 }}>
          {them >= 0 ? them : '?'}
          {them >= 0 && <span className="faint display" style={{ fontSize: 14 }}>/{total}</span>}
        </strong>
      </div>
    </div>
  )
}

/* ---------- state-machine ---------- */

type Phase =
  | { name: 'hub' }
  | { name: 'play'; payload: DuelPayload; items: QuizEx[]; theirScore: number }
  | { name: 'result'; payload: DuelPayload; score: number; total: number; theirScore: number; xp: number }
  | { name: 'settled'; opponent: string; yours: number; theirs: number; total: number; xp: number }

export function DuelScreen({
  incoming,
  onPlayingChange,
}: {
  incoming?: DuelPayload | null
  onPlayingChange?: (playing: boolean) => void
}) {
  const courseId = useStore((s) => s.courseId)
  const duelHistory = useStore((s) => s.duelHistory)
  const duelsWon = useStore((s) => s.duelsWon)
  const recordDuel = useStore((s) => s.recordDuel)
  const awardXp = useStore((s) => s.awardXp)
  const look = useStore((s) => s.avatarLook)
  const curLevel = useStore((s) => levelForXp(totalXp(s)))

  const [phase, setPhase] = useState<Phase>({ name: 'hub' })

  // tabs verbergen zodra het duel begint — volledig spelgevoel
  useEffect(() => {
    onPlayingChange?.(phase.name !== 'hub')
    return () => onPlayingChange?.(false)
  }, [phase.name, onPlayingChange])
  const [open, setOpen] = useState<OpenDuel[]>(() => readOpen())
  const [myName, setMyName] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState<string | null>(null)
  const [hideIncoming, setHideIncoming] = useState(false)

  // per vraag
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState<EvalResult | null>(null)
  const [ready, setReady] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [marks, setMarks] = useState<boolean[]>([])
  const evalRef = useRef<(() => EvalResult) | null>(null)

  const nameOrDefault = myName.trim().slice(0, 16) || 'Uitdager'

  // de uitnodiging komt uit de URL: pas na opschonen vertrouwen we hem
  const safeIncoming = useMemo(() => sanitize(incoming ?? null), [incoming])

  const myCourse = courses[courseId]
  // hele cursusboom doorlopen is niet gratis — één keer per cursus is genoeg
  const myPoolSize = useMemo(() => (myCourse ? quizPool(myCourse).length : 0), [myCourse])

  const register = useCallback((r: Registration) => {
    evalRef.current = r.evaluate
    setReady(r.ready)
  }, [])

  const saveOpen = (list: OpenDuel[]) => {
    // zelfde grens als de opslag, anders toont het scherm meer dan er bewaard blijft
    const capped = list.slice(-MAX_OPEN)
    setOpen(capped)
    writeOpen(capped)
  }

  /* ---- een duel starten ---- */

  const startPlay = (payload: DuelPayload) => {
    const course = courses[payload.c]
    if (!course) {
      setCodeError('Die cursus kennen we niet. Vraag je vriend om een nieuwe link.')
      return
    }
    const wanted = payload.q > 0 ? payload.q : QUESTIONS
    const items = seededPick(quizPool(course), wanted, payload.s)
    if (items.length === 0) {
      setCodeError('Er zijn nog geen vragen voor deze cursus.')
      return
    }
    setIdx(0)
    setCorrect(0)
    setMarks([])
    setAnswered(null)
    setReady(false)
    setCodeError(null)
    evalRef.current = null
    sfx('tap')
    setPhase({ name: 'play', payload, items, theirScore: payload.x })
  }

  const challengeFriend = () => {
    const seed = Math.floor(Math.random() * 1e9)
    startPlay({ c: courseId, s: seed, n: nameOrDefault, x: -1, q: QUESTIONS })
  }

  /* ---- uitslag van je vriend verwerken (jij speelde deze al) ---- */

  const settle = (p: DuelPayload, mine: OpenDuel) => {
    const total = Math.max(mine.total, p.q > 0 ? p.q : QUESTIONS)
    const yours = Math.min(mine.score, total)
    // score uit een link mag nooit buiten 0..total vallen
    const theirs = Math.min(Math.max(0, p.x), total)
    const won = yours > theirs
    const tie = yours === theirs
    const xp = won ? 25 : tie ? 15 : 10
    recordDuel({ opponent: p.n || 'Je vriend', yourScore: yours, theirScore: theirs, total, won, day: today() })
    awardXp(xp)
    saveOpen(open.filter((d) => d.s !== mine.s))
    setCodeInput('')
    setCodeError(null)
    if (won) burst()
    sfx(won ? 'complete' : 'wrong')
    setPhase({ name: 'settled', opponent: p.n || 'Je vriend', yours, theirs, total, xp })
  }

  const submitCode = () => {
    const p = sanitize(decodeDuel(codeFromInput(codeInput)))
    if (!p) {
      sfx('wrong')
      setCodeError('Deze code klopt niet. Plak hem helemaal — de hele link mag ook.')
      return
    }
    const mine = open.find((d) => d.s === p.s)
    if (mine) {
      settle(p, mine)
      return
    }
    setCodeInput('')
    startPlay(p)
  }

  /* ---- antwoord controleren / doorgaan ---- */

  const onCheck = () => {
    // answered-check vangt een dubbele tik op: anders telt één vraag twee keer
    if (phase.name !== 'play' || answered !== null || !evalRef.current) return
    if (idx >= phase.items.length) return
    const r = evalRef.current()
    setAnswered(r)
    setMarks((m) => [...m, r.correct])
    if (r.correct) {
      sfx('correct')
      setCorrect((c) => c + 1)
    } else {
      sfx('wrong')
    }
  }

  const advance = () => {
    // answered-check voorkomt dat een dubbele tik tijdens de exit-animatie
    // de uitslag twee keer opslaat (en dus twee keer XP geeft)
    if (phase.name !== 'play' || answered === null) return
    setAnswered(null)
    setReady(false)
    evalRef.current = null

    if (idx + 1 < phase.items.length) {
      setIdx(idx + 1)
      return
    }

    const total = phase.items.length
    const score = correct
    const theirs = phase.theirScore
    sfx('complete')

    if (theirs >= 0) {
      // inkomend duel: nu is de uitslag bekend
      const won = score > theirs
      const tie = score === theirs
      const xp = won ? 25 : tie ? 15 : 10
      recordDuel({ opponent: phase.payload.n || 'Je vriend', yourScore: score, theirScore: theirs, total, won, day: today() })
      awardXp(xp)
      if (won) burst()
      setPhase({ name: 'result', payload: phase.payload, score, total, theirScore: theirs, xp })
    } else {
      // je eigen nieuwe duel: jouw ronde zit erop, nu je vriend nog
      const xp = Math.max(5, score * 2)
      awardXp(xp)
      const link = duelLink(encodeDuel({ ...phase.payload, n: nameOrDefault, x: score }))
      saveOpen([...open.filter((d) => d.s !== phase.payload.s), { s: phase.payload.s, c: phase.payload.c, score, total, link, day: today() }])
      burst()
      setPhase({ name: 'result', payload: phase.payload, score, total, theirScore: -1, xp })
    }
  }

  const backToHub = () => {
    setPhase({ name: 'hub' })
    setHideIncoming(true)
  }

  /* ================= SPELEN ================= */

  if (phase.name === 'play') {
    const course = courses[phase.payload.c]
    const ex: QuizEx | undefined = phase.items[idx]
    const opponentName = phase.theirScore >= 0 ? phase.payload.n || 'Je vriend' : 'Je vriend'

    // zou niet mogen gebeuren, maar liever een nette uitweg dan een wit scherm
    if (!course || !ex) {
      return (
        <div className="shell center" style={{ paddingTop: 40 }}>
          <p className="dim" style={{ fontSize: 15, marginBottom: 18 }}>
            Er ging iets mis met dit duel. Probeer het opnieuw.
          </p>
          <button className="btn btn-primary" onClick={() => setPhase({ name: 'hub' })}>
            Terug
          </button>
        </div>
      )
    }

    return (
      <div className="shell shell--bare" style={{ paddingBottom: 180 }}>
        <div className="lesson-top" style={{ marginBottom: 16 }}>
          <button
            className="btn-quiet"
            style={{ minWidth: 44, minHeight: 44, fontSize: 22, lineHeight: 1, padding: 8 }}
            onClick={() => setPhase({ name: 'hub' })}
            aria-label="Duel stoppen"
          >
            ×
          </button>
          <span className="eyebrow" style={{ whiteSpace: 'nowrap' }}>
            Vraag {idx + 1}/{phase.items.length}
          </span>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              animate={{ width: `${Math.max(4, ((answered !== null ? idx + 1 : idx) / phase.items.length) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            />
          </div>
          <Flag code={courseFlagCode[phase.payload.c]} size={18} />
        </div>

        <ScoreBar you={correct} them={phase.theirScore} name={opponentName} total={phase.items.length} />

        <div className="row" style={{ gap: 5, justifyContent: 'center', marginBottom: 18 }}>
          {phase.items.map((_, i) => (
            <span
              key={i}
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                background:
                  i < marks.length
                    ? marks[i]
                      ? 'var(--ok)'
                      : 'var(--err)'
                    : i === marks.length
                      ? 'var(--gold)'
                      : 'rgba(255,255,255,0.16)',
                boxShadow: i === marks.length ? '0 0 10px rgba(255,197,61,0.7)' : undefined,
              }}
            />
          ))}
        </div>

        <div className="lesson-body" key={idx}>
          {ex.type === 'select' && <SelectEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
          {ex.type === 'type' && <TypeEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
          {ex.type === 'wordbank' && <WordBankEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
          {ex.type === 'listen' && <ListenEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
          {ex.type === 'fill' && <FillEx ex={ex} ttsLang={course.ttsLang} locked={answered !== null} register={register} />}
        </div>

        <div className="sheet">
          <AnimatePresence mode="wait">
            {answered === null ? (
              <motion.div key="check" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.18 }}>
                <div className="sheet-inner">
                  <button className="btn btn-primary" disabled={!ready} onClick={onCheck}>
                    Controleren
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="fb" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.18 }}>
                <div className={`sheet-inner ${answered.correct ? 'good' : 'bad'}`}>
                  <p className={`feedback-title ${answered.correct ? 'ok-text' : 'err-text'}`} style={{ marginBottom: 10 }}>
                    {answered.correct ? 'Punt voor jou!' : 'Punt gemist.'}
                  </p>
                  {!answered.correct && answered.correctAnswer && (
                    <p className="dim" style={{ fontSize: 15, marginBottom: 10, marginTop: -6 }}>
                      Juiste antwoord: <strong style={{ color: 'var(--text)' }}>{answered.correctAnswer}</strong>
                    </p>
                  )}
                  <button className="btn btn-primary" onClick={advance}>
                    {idx + 1 === phase.items.length ? 'Naar de uitslag' : 'Volgende vraag'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  /* ================= UITSLAG NA JOUW RONDE ================= */

  if (phase.name === 'result') {
    const { score, total, theirScore } = phase
    const won = theirScore >= 0 && score > theirScore
    const tie = theirScore >= 0 && score === theirScore
    const lost = theirScore >= 0 && score < theirScore
    const opponent = phase.payload.n || 'Je vriend'
    const returnCode = encodeDuel({ ...phase.payload, n: nameOrDefault, x: score })
    const link = duelLink(returnCode)

    return (
      <div className="shell" style={{ paddingTop: 8 }}>
        <div className="ambient-orb orb-a" />
        <div className="ambient-orb orb-b" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="center">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar size={100} mode={lost ? 'idle' : 'cheer'} level={curLevel} courseId={phase.payload.c} look={look} />
          </div>
          <p className="eyebrow" style={{ marginTop: 8 }}>
            {theirScore >= 0 ? 'Duel afgerond' : 'Jouw ronde zit erop'}
          </p>
          <h1 className="display" style={{ fontSize: 34, margin: '8px 0' }}>
            {won
              ? 'Jij wint! 🏆'
              : tie
                ? 'Gelijkspel!'
                : lost
                  ? theirScore - score === 1
                    ? 'Nipt verloren.'
                    : 'Verloren.'
                  : 'Netjes gespeeld!'}
          </h1>

          {theirScore >= 0 ? (
            <motion.div
              className="row"
              style={{ justifyContent: 'center', gap: 14, margin: '6px 0 4px' }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <span className="display hot-text" style={{ fontSize: 52 }}>
                {score}
              </span>
              <span className="faint display" style={{ fontSize: 30 }}>
                –
              </span>
              <span className="display gold-text" style={{ fontSize: 52 }}>
                {theirScore}
              </span>
            </motion.div>
          ) : (
            <p className="display gold-text" style={{ fontSize: 48, margin: '6px 0' }}>
              {score}/{total}
            </p>
          )}

          <p className="dim" style={{ fontSize: 15 }}>
            {theirScore >= 0 ? `Jij tegen ${opponent} · ${total} vragen` : `${score} van de ${total} goed`}
          </p>
          <div className="divider-gold" />
          <p className="gold-text display" style={{ fontSize: 20 }}>
            +{phase.xp} XP
          </p>
        </motion.div>

        <motion.div
          className="glass"
          style={{ padding: 20, marginTop: 22 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <strong style={{ fontSize: 16 }}>{theirScore >= 0 ? '📨 Stuur je uitslag terug' : '🔗 Stuur de uitdaging door'}</strong>
          <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 14px' }}>
            {theirScore >= 0 ? (
              <>
                Stuur deze link terug naar {opponent}. Als {opponent} hem opent, ziet die meteen de uitslag van jullie duel —{' '}
                {won ? 'en dat jij gewonnen hebt.' : 'inclusief jouw score.'}
              </>
            ) : (
              <>
                Jij scoorde {score} van de {total}. Stuur deze link naar je vriend: die krijgt exact dezelfde {total} vragen. Speelt die
                de ronde, dan stuurt hij zijn link terug — plak hem hier en je ziet wie gewonnen heeft.
              </>
            )}
          </p>
          <ShareBox
            value={link}
            copyLabel="Kopieer link"
            waText={
              theirScore >= 0
                ? `Duel gespeeld! Ik scoorde ${score} van de ${total}. Open deze link voor de uitslag: ${link}`
                : `Ik daag je uit in Fluent! Ik scoorde ${score} van de ${total}. Durf jij? ${link}`
            }
          />
        </motion.div>

        <div style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={backToHub}>
            Klaar
          </button>
        </div>
      </div>
    )
  }

  /* ================= UITSLAG VIA TERUGGESTUURDE CODE ================= */

  if (phase.name === 'settled') {
    const won = phase.yours > phase.theirs
    const tie = phase.yours === phase.theirs
    return (
      <div className="shell center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80dvh' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar size={100} mode={won ? 'cheer' : 'idle'} level={curLevel} courseId={courseId} look={look} />
          </div>
          <p className="eyebrow" style={{ marginTop: 8 }}>
            Antwoord binnen van {phase.opponent}
          </p>
          <h1 className="display" style={{ fontSize: 34, margin: '8px 0', overflowWrap: 'anywhere' }}>
            {won ? 'Jij wint! 🏆' : tie ? 'Gelijkspel!' : `${phase.opponent} wint.`}
          </h1>
          <div className="row" style={{ justifyContent: 'center', gap: 14, margin: '6px 0' }}>
            <span className="display hot-text" style={{ fontSize: 52 }}>
              {phase.yours}
            </span>
            <span className="faint display" style={{ fontSize: 30 }}>
              –
            </span>
            <span className="display gold-text" style={{ fontSize: 52 }}>
              {phase.theirs}
            </span>
          </div>
          <p className="dim" style={{ fontSize: 15 }}>
            Jij tegen {phase.opponent} · {phase.total} vragen
          </p>
          <div className="divider-gold" />
          <p className="gold-text display" style={{ fontSize: 20 }}>
            +{phase.xp} XP
          </p>
          <div style={{ marginTop: 30 }}>
            <button className="btn btn-primary" onClick={backToHub}>
              Klaar
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  /* ================= HUB ================= */

  const openForIncoming = safeIncoming ? open.find((d) => d.s === safeIncoming.s) : undefined
  const showIncoming = !!safeIncoming && !hideIncoming
  const history = [...duelHistory].reverse().slice(0, 6)

  return (
    <div className="shell" style={{ paddingTop: 12 }}>
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />

      <div className="spread" style={{ marginBottom: 18 }}>
        <div>
          <p className="eyebrow">Vrienden</p>
          <h1 className="display" style={{ fontSize: 28, margin: '6px 0 0' }}>
            Duel om de eer
          </h1>
        </div>
        {duelsWon > 0 && (
          <div className="glass" style={{ padding: '8px 14px', textAlign: 'center' }}>
            <strong className="display gold-text" style={{ fontSize: 22 }}>
              {duelsWon}
            </strong>
            <p className="stat-label" style={{ marginTop: 0 }}>
              gewonnen
            </p>
          </div>
        )}
      </div>

      {/* --- uitnodiging uit de link --- */}
      {showIncoming && safeIncoming && (
        <motion.div
          className="glass"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: 22,
            marginBottom: 16,
            borderColor: 'var(--line-hot)',
            boxShadow: '0 0 30px rgba(236,72,153,0.28)',
          }}
        >
          <div className="row" style={{ gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 26 }}>⚔️</span>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontSize: 17 }}>{safeIncoming.n || 'Een vriend'} daagt je uit!</strong>
              <p className="dim" style={{ fontSize: 13 }}>
                <Flag code={courseFlagCode[safeIncoming.c]} size={13} /> {courses[safeIncoming.c]?.name ?? 'Onbekende cursus'} ·{' '}
                {safeIncoming.q} vragen
              </p>
            </div>
          </div>
          {openForIncoming ? (
            <>
              <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 14px' }}>
                Dit is het antwoord op jouw uitdaging. Jij scoorde {openForIncoming.score} van de {openForIncoming.total} — benieuwd of
                dat genoeg was?
              </p>
              <button className="btn btn-primary" onClick={() => settle(safeIncoming, openForIncoming)}>
                🥁 Toon de uitslag
              </button>
            </>
          ) : (
            <>
              <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 14px' }}>
                {safeIncoming.x >= 0
                  ? `${safeIncoming.n || 'Je vriend'} scoorde ${safeIncoming.x} van de ${safeIncoming.q}. Jij krijgt exact dezelfde vragen — versla die score.`
                  : 'Jij krijgt exact dezelfde vragen als je vriend. Wie scoort er hoger?'}
              </p>
              <button className="btn btn-primary" onClick={() => startPlay(safeIncoming)}>
                Neem de uitdaging aan
              </button>
            </>
          )}
          {codeError && (
            <p style={{ color: 'var(--err)', fontSize: 13.5, margin: '12px 0 0', fontWeight: 600 }}>{codeError}</p>
          )}
          <button
            className="btn-quiet"
            style={{ width: '100%', marginTop: 4, minHeight: 44 }}
            onClick={() => setHideIncoming(true)}
          >
            Later
          </button>
        </motion.div>
      )}

      {/* --- zelf uitdagen --- */}
      <div className="glass" style={{ padding: 22, marginBottom: 16 }}>
        <strong style={{ fontSize: 16 }}>⚔️ Daag een vriend uit</strong>
        <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 14px' }}>
          Jij speelt eerst {QUESTIONS} vragen {myCourse ? `in het ${myCourse.name}` : 'in jouw cursus'}. Daarna krijg je een link met
          jouw score erin — stuur die naar je vriend en die krijgt precies dezelfde vragen. Geen account nodig.
        </p>
        <input
          className="type-input"
          value={myName}
          onChange={(e) => setMyName(e.target.value)}
          placeholder="Jouw naam (optioneel)"
          maxLength={16}
          style={{ marginBottom: 12, fontSize: 16 }}
          aria-label="Jouw naam"
        />
        {myPoolSize === 0 ? (
          <p className="dim" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--err)' }}>
            Er zijn nog geen vragen in deze cursus. Doe eerst een les.
          </p>
        ) : (
          <button className="btn btn-primary" onClick={challengeFriend}>
            {myCourse && <Flag code={courseFlagCode[courseId]} size={16} />} Start mijn ronde
          </button>
        )}
      </div>

      {/* --- open uitdagingen --- */}
      {open.length > 0 && (
        <div className="glass" style={{ padding: 22, marginBottom: 16 }}>
          <strong style={{ fontSize: 16 }}>⏳ Wacht op antwoord</strong>
          <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 12px' }}>
            Deze uitdagingen staan nog open. Kwijtgeraakt? Kopieer de link hier opnieuw.
          </p>
          <div className="col" style={{ gap: 12 }}>
            {open.map((d) => (
              <div key={d.s} style={{ borderTop: '1.5px solid var(--line)', paddingTop: 12 }}>
                <div className="spread" style={{ marginBottom: 8 }}>
                  <span className="row" style={{ gap: 8, fontSize: 14, fontWeight: 700 }}>
                    <Flag code={courseFlagCode[d.c]} size={14} /> Jouw score: {d.score}/{d.total}
                  </span>
                  <button
                    className="btn-quiet"
                    style={{ minWidth: 44, minHeight: 44, padding: '4px 8px', fontSize: 18, lineHeight: 1, flexShrink: 0 }}
                    onClick={() => saveOpen(open.filter((x) => x.s !== d.s))}
                    aria-label="Uitdaging verwijderen"
                  >
                    ×
                  </button>
                </div>
                <ShareBox
                  value={d.link}
                  copyLabel="Kopieer link opnieuw"
                  waText={`Ik daag je uit in Fluent! Ik scoorde ${d.score} van de ${d.total}. Durf jij? ${d.link}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- code invoeren --- */}
      <div className="glass" style={{ padding: 22, marginBottom: 16 }}>
        <strong style={{ fontSize: 16 }}>📥 Code van je vriend</strong>
        <p className="dim" style={{ fontSize: 13.5, margin: '8px 0 12px' }}>
          Link of code gekregen? Plak hem hier. Is het een nieuwe uitdaging, dan speel je meteen. Is het het antwoord op jouw
          uitdaging, dan zie je direct de uitslag.
        </p>
        <input
          className="type-input"
          value={codeInput}
          onChange={(e) => {
            setCodeInput(e.target.value)
            setCodeError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && codeInput.trim()) submitCode()
          }}
          placeholder="Plak hier de link of code…"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          style={{ marginBottom: 12, fontSize: 15 }}
          aria-label="Duel-code van je vriend"
        />
        {codeError && (
          <p style={{ color: 'var(--err)', fontSize: 13.5, marginBottom: 12, fontWeight: 600 }}>
            {codeError}
          </p>
        )}
        <button className="btn btn-ghost" disabled={codeInput.trim().length === 0} onClick={submitCode}>
          Duel openen
        </button>
      </div>

      {/* --- geschiedenis --- */}
      <div className="glass" style={{ padding: 22 }}>
        <strong style={{ fontSize: 16 }}>📜 Laatste duels</strong>
        {history.length === 0 ? (
          <p className="dim" style={{ fontSize: 13.5, marginTop: 8 }}>
            Nog geen duels gespeeld. Daag iemand uit — winnen levert 25 XP op, meedoen altijd nog 10.
          </p>
        ) : (
          <div style={{ marginTop: 10 }}>
            {history.map((d, i) => (
              <div
                key={i}
                className="spread"
                style={{ padding: '9px 0', borderTop: i === 0 ? 'none' : '1.5px solid var(--line)' }}
              >
                <div style={{ minWidth: 0 }}>
                  <strong
                    style={{ fontSize: 14.5, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {d.opponent}
                  </strong>
                  <p className="faint" style={{ fontSize: 12 }}>
                    {d.day} · {d.total} vragen
                  </p>
                </div>
                <div className="row" style={{ gap: 8, flexShrink: 0 }}>
                  <span
                    className="display"
                    style={{ fontSize: 18, fontWeight: 800, color: d.won ? 'var(--ok)' : d.yourScore === d.theirScore ? 'var(--gold)' : 'var(--err)' }}
                  >
                    {d.yourScore}-{d.theirScore}
                  </span>
                  <span style={{ fontSize: 15 }}>{d.won ? '🏆' : d.yourScore === d.theirScore ? '🤝' : '💀'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
