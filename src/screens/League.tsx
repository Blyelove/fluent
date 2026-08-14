import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import confetti from 'canvas-confetti'
import {
  LEAGUES,
  standings,
  yourRank,
  zoneFor,
  xpToClimb,
  hoursLeftInWeek,
  type Competitor,
} from '../leagues'
import { useStore } from '../store'
import { sfx } from '../audio'

/** Nette Nederlandse divisienamen ("Goud" → "Gouden divisie") */
const DIVISION_LABEL = [
  'Bronzen divisie',
  'Zilveren divisie',
  'Gouden divisie',
  'Saffieren divisie',
  'Robijnen divisie',
  'Smaragden divisie',
  'Amethisten divisie',
  'Parelen divisie',
  'Obsidianen divisie',
  'Diamanten divisie',
]

const HOURS_PER_WEEK = 168
const FALLBACK_COLOR = '#A855F7'

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '0'
  return Math.round(n).toLocaleString('nl-NL')
}

/** Veilige divisie-index — vangt een oude of kapotte opgeslagen waarde op */
function clampLeague(id: number): number {
  if (!Number.isFinite(id)) return 0
  return Math.min(LEAGUES.length - 1, Math.max(0, Math.floor(id)))
}

/** Divisienaam met terugval, mocht de lijst ooit langer worden dan de labels */
function divisionLabel(id: number): string {
  return DIVISION_LABEL[id] ?? `Divisie ${id + 1}`
}

/** Hex → rgb, met terugval bij een ongeldige of ontbrekende kleur */
function rgbOf(hex: string): [number, number, number] {
  const raw = (hex || FALLBACK_COLOR).replace('#', '')
  const h = raw.length === 3 ? raw.charAt(0).repeat(2) + raw.charAt(1).repeat(2) + raw.charAt(2).repeat(2) : raw
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return [168, 85, 247]
  return [r, g, b]
}

/** Donkere of lichte tekst op een gekleurd vlak — op basis van helderheid */
function inkOn(hex: string): string {
  const [r, g, b] = rgbOf(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#1A1033' : '#FFFFFF'
}

/** rgba-string uit een hexkleur, voor gloed en zachte vlakken */
function alpha(hex: string, a: number): string {
  const [r, g, b] = rgbOf(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/**
 * Een divisiekleur als tekst op de pagina. Brons, zilver en goud zijn echte
 * metalen en staan vast, dus in een lichte wereld zijn ze te licht om te
 * lezen. --metaal-verdiepen staat daar aan en trekt de kleur naar de inkt toe;
 * in een donkere wereld is hij nul en verandert er niets.
 */
function metaalInkt(kleur: string): string {
  return `color-mix(in srgb, ${kleur}, var(--text) var(--metaal-verdiepen))`
}

/* ---------------- medaille ---------------- */

function Medal({ leagueId, calm }: { leagueId: number; calm: boolean }) {
  const id = clampLeague(leagueId)
  const c = LEAGUES[id]?.color ?? FALLBACK_COLOR
  const ink = inkOn(c)
  const gid = `medal-face-${id}`
  const rays = Array.from({ length: 12 }, (_, i) => i * 30)

  return (
    <motion.div
      initial={{ scale: 0.62, rotate: -14, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 190, damping: 14 }}
      style={{ width: 138, height: 138, position: 'relative', flexShrink: 0 }}
    >
      {/* zachte gloed achter de medaille */}
      <motion.div
        aria-hidden
        animate={calm ? {} : { opacity: [0.55, 0.95, 0.55], scale: [0.94, 1.06, 0.94] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: -14,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(c, 0.5)}, transparent 68%)`,
          filter: 'blur(14px)',
          pointerEvents: 'none',
        }}
      />
      <svg width="138" height="138" viewBox="0 0 138 138" style={{ position: 'relative', display: 'block' }}>
        <defs>
          <radialGradient id={gid} cx="36%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="42%" stopColor={c} stopOpacity="1" />
            <stop offset="100%" stopColor={c} stopOpacity="0.72" />
          </radialGradient>
        </defs>

        {/* draaiende stralenkrans */}
        <motion.g
          animate={calm ? {} : { rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '69px 69px' }}
          opacity={0.5}
        >
          {rays.map((deg) => (
            <path key={deg} d="M69 4 L74 26 L64 26 Z" fill={c} opacity={0.5} transform={`rotate(${deg} 69 69)`} />
          ))}
        </motion.g>

        {/* getande rand */}
        <circle cx="69" cy="69" r="53" fill="none" stroke={alpha(c, 0.55)} strokeWidth="3" strokeDasharray="5 7" strokeLinecap="round" />
        {/* medailleschijf */}
        <circle cx="69" cy="69" r="45" fill={`url(#${gid})`} />
        <circle cx="69" cy="69" r="45" fill="none" stroke="var(--glans-50)" strokeWidth="2" />
        <circle cx="69" cy="69" r="37" fill="none" stroke={alpha(ink === '#1A1033' ? '#1A1033' : '#FFFFFF', 0.28)} strokeWidth="1.5" />

        {/* divisienummer */}
        <text
          x="69"
          y="69"
          textAnchor="middle"
          dominantBaseline="central"
          fill={ink}
          style={{ fontFamily: "'Baloo 2', system-ui, sans-serif", fontSize: 34, fontWeight: 800 }}
        >
          {id + 1}
        </text>

        {/* glans */}
        <ellipse cx="55" cy="46" rx="19" ry="11" fill="#FFFFFF" opacity="0.28" transform="rotate(-28 55 46)" />
      </svg>
    </motion.div>
  )
}

/* ---------------- divisiebolletjes ---------------- */

function DivisionDots({ leagueId }: { leagueId: number }) {
  return (
    <div style={{ position: 'relative', padding: '14px 2px 2px' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 6,
          right: 6,
          top: 24,
          height: 2,
          borderRadius: 2,
          background: 'linear-gradient(90deg, var(--glans-16), var(--glans-05))',
        }}
      />
      <div className="spread" style={{ position: 'relative' }}>
        {LEAGUES.map((l) => {
          const done = l.id < leagueId
          const current = l.id === leagueId
          const size = current ? 22 : 12
          return (
            <div key={l.id} className="col" style={{ alignItems: 'center', gap: 4, width: 28 }}>
              <div style={{ height: 22, display: 'flex', alignItems: 'center' }}>
                <motion.div
                  title={divisionLabel(l.id)}
                  aria-label={divisionLabel(l.id)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.05 + l.id * 0.02, type: 'spring', stiffness: 320, damping: 18 }}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: current
                      ? `radial-gradient(circle at 35% 30%, #fff, ${l.color} 65%)`
                      : done
                        ? l.color
                        : 'var(--surface-2)',
                    border: current ? '2px solid var(--glans-65)' : done ? 'none' : '1.5px solid var(--line)',
                    opacity: current ? 1 : done ? 0.8 : 0.32,
                    boxShadow: current ? `0 0 16px ${alpha(l.color, 0.9)}` : 'none',
                  }}
                />
              </div>
              {current && (
                <span className="display" style={{ fontSize: 11, letterSpacing: '0.06em', color: metaalInkt(l.color) }}>
                  NU
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- scheidslijn in de ranglijst ---------------- */

function ZoneDivider({ kind }: { kind: 'promotie' | 'degradatie' }) {
  const promo = kind === 'promotie'
  const c = promo ? 'var(--ok)' : 'var(--err)'
  const glow = promo ? 'rgba(74, 222, 128, 0.45)' : 'var(--hot-50)'
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.7 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay: 0.24, duration: 0.3 }}
      className="row"
      style={{ gap: 8, padding: '10px 2px 8px' }}
    >
      <span style={{ flex: 1, height: 2, borderRadius: 2, background: `linear-gradient(90deg, transparent, ${c})` }} />
      <span
        className="display"
        style={{
          fontSize: 11,
          letterSpacing: '0.14em',
          color: metaalInkt(c),
          padding: '4px 10px',
          borderRadius: 999,
          border: `1.5px solid ${c}`,
          background: promo ? 'var(--ok-bg)' : 'var(--err-bg)',
          boxShadow: `0 0 14px ${glow}`,
          whiteSpace: 'nowrap',
        }}
      >
        {promo ? '↑ PROMOTIEZONE' : 'DEGRADATIEZONE ↓'}
      </span>
      <span style={{ flex: 1, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${c}, transparent)` }} />
    </motion.div>
  )
}

/* ---------------- ranglijstrij ---------------- */

const MEDAL_TINT: Record<number, string | undefined> = { 1: '#FFC53D', 2: '#D8D8E6', 3: '#CD7F32' }

function Row({ player, rank, delay }: { player: Competitor; rank: number; delay: number }) {
  const you = player.isYou
  const tint = MEDAL_TINT[rank]
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
      className="row"
      style={{
        gap: 12,
        padding: you ? '11px 12px' : '9px 12px',
        marginBottom: 4,
        borderRadius: 'var(--r-md)',
        minHeight: 48,
        background: you ? 'var(--hot-16)' : 'transparent',
        border: you ? '2px solid var(--hot2)' : '2px solid transparent',
        boxShadow: you ? '0 0 24px var(--hot-35), 0 3px 0 var(--inkt-25)' : 'none',
      }}
    >
      <span
        className="display"
        style={{
          width: 24,
          textAlign: 'right',
          fontSize: tint ? 17 : 15,
          color: tint ?? (you ? 'var(--text)' : 'var(--text-faint)'),
          textShadow: tint ? `0 0 12px ${alpha(tint, 0.6)}` : 'none',
          flexShrink: 0,
        }}
      >
        {rank}
      </span>

      <span
        className="display"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 14,
          color: inkOn(player.color),
          background: `radial-gradient(circle at 34% 28%, #fff, ${player.color} 72%)`,
          boxShadow: you ? `0 0 16px ${alpha(player.color, 0.75)}` : `0 2px 0 ${alpha(player.color, 0.45)}`,
        }}
      >
        {player.name.charAt(0)}
      </span>

      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontWeight: you ? 800 : 600,
          fontSize: you ? 16 : 15,
          color: you ? 'var(--text)' : 'var(--text-dim)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {player.name}
      </span>

      <span
        className={you ? 'display gold-text' : 'display'}
        style={{ fontSize: 14, color: you ? undefined : 'var(--text-dim)', flexShrink: 0 }}
      >
        {fmt(player.xp)} XP
      </span>
    </motion.div>
  )
}

/* ---------------- scherm ---------------- */

export function LeagueScreen({ onLeren }: { onLeren?: () => void } = {}) {
  const storedLeagueId = useStore((s) => s.leagueId)
  const storedWeekXp = useStore((s) => s.weekXp)
  const promotions = useStore((s) => s.promotions)
  const uitslag = useStore((s) => s.weekUitslag)
  const clearWeekUitslag = useStore((s) => s.clearWeekUitslag)
  const calm = Boolean(useReducedMotion())

  // opgeslagen waarden altijd eerst gezond maken
  const leagueId = clampLeague(storedLeagueId)
  const weekXp = Number.isFinite(storedWeekXp) ? Math.max(0, storedWeekXp) : 0

  const [hours, setHours] = useState(() => hoursLeftInWeek())
  const [explain, setExplain] = useState(false)

  // aftellen leeft mee: elke minuut opnieuw kijken (interval wordt opgeruimd bij unmount)
  useEffect(() => {
    const t = window.setInterval(() => setHours(hoursLeftInWeek()), 60000)
    return () => window.clearInterval(t)
  }, [])

  const league = LEAGUES[leagueId] ?? LEAGUES[0]
  // brons en zilver zijn vaste metalen en dus te licht voor een lichte wereld;
  // --metaal-verdiepen staat daar aan en trekt ze naar de inkt toe
  const color = league.color
  const inkt = metaalInkt(league.color)
  // `hours` verandert hooguit één keer per uur, dus de ranglijst ververst netjes mee
  // zonder dat we elke minuut opnieuw rekenen
  const list = useMemo(() => standings(leagueId, weekXp), [leagueId, weekXp, hours])
  const total = list.length
  const empty = total === 0
  const rawRank = yourRank(list)
  // yourRank geeft 0 als je (onverwacht) niet in de lijst staat — dan onderaan zetten
  const rank = rawRank > 0 ? rawRank : total
  const zone = zoneFor(leagueId, Math.max(1, rank))
  const climb = xpToClimb(list)
  const above = rank > 1 ? (list[rank - 2] ?? null) : null
  // nummer 2 (alleen relevant als jij bovenaan staat)
  const runnerUp = list[1] ?? null
  // ruwe schatting: ±20 XP per les
  const lessons = climb !== null ? Math.max(1, Math.ceil(climb / 20)) : 0

  const urgent = hours < 24
  const elapsed = Math.min(1, Math.max(0, 1 - hours / HOURS_PER_WEEK))

  // namen van de divisie boven en onder je (leeg als die niet bestaat)
  const nextLabel = leagueId + 1 < LEAGUES.length ? divisionLabel(leagueId + 1).toLowerCase() : ''
  const prevLabel = leagueId > 0 ? divisionLabel(leagueId - 1).toLowerCase() : ''
  const thisLabel = divisionLabel(leagueId).toLowerCase()

  // grens van de degradatiezone (laagste veilige plek)
  const safeRank = Math.max(1, total - league.demote)
  // XP die je nog nodig hebt om de promotiezone te halen / uit de degradatiezone te komen
  const promoTarget = league.promote > 0 ? list[league.promote - 1] : undefined
  const safeTarget = league.demote > 0 ? list[safeRank - 1] : undefined
  const toPromoZone = promoTarget && rank > league.promote ? Math.max(1, promoTarget.xp - weekXp + 1) : 0
  const toSafe = safeTarget && rank > safeRank ? Math.max(1, safeTarget.xp - weekXp + 1) : 0

  // gepromoveerd vorige week? dan knalt het bij het zien van de uitslag
  useEffect(() => {
    if (uitslag?.uitkomst !== 'promotie') return
    confetti({
      particleCount: 130,
      spread: 100,
      startVelocity: 38,
      origin: { y: 0.28 },
      colors: ['#A855F7', '#EC4899', '#FFC53D', '#FFFFFF'],
      disableForReducedMotion: true,
    })
    sfx('complete')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // sta je op promotie? dan een feestje bij het openen van het scherm
  useEffect(() => {
    if (empty || zone !== 'promotie') return
    confetti({
      particleCount: 60,
      spread: 85,
      startVelocity: 34,
      origin: { y: 0.32 },
      colors: [color, '#FFC53D', '#FFFFFF', '#EC4899'],
      disableForReducedMotion: true,
    })
  }, [empty, zone, color])

  // Cyaan is de systeemkleur; goud blijft voor echte beloningen. Bewust de
  // tekstvarianten: deze kaart is de heldkaart en die is ook in een lichte
  // wereld donker, dus het donkere cyaan van zo'n wereld zou erin verdwijnen.
  const zoneCard = empty
    ? {
        c: 'var(--cyaan-tekst, var(--cyan))',
        bg: 'var(--cyaan-10)',
        glow: 'var(--cyaan-25)',
        title: 'De competitie start binnenkort',
        body: 'Zodra de week loopt zie je hier je plek, je tegenstanders en wat je nodig hebt om te klimmen.',
      }
    : zone === 'promotie'
      ? {
          c: 'var(--ok-tekst, var(--ok))',
          bg: 'var(--ok-bg)',
          glow: 'rgba(74, 222, 128, 0.3)',
          title: 'Je staat op promotie!',
          body: nextLabel
            ? `Hou dit vol tot zondag en je klimt naar de ${nextLabel}.`
            : 'Je staat bovenaan de hoogste divisie. Niemand komt hier zomaar.',
        }
      : zone === 'degradatie'
        ? {
            c: 'var(--err-tekst, var(--err))',
            bg: 'var(--err-bg)',
            glow: 'var(--hot-25)',
            title: 'Pas op: je zakt uit deze divisie',
            body: `Nog ${fmt(toSafe)} XP en je staat weer veilig op plek ${safeRank}. Eén les kan al genoeg zijn.`,
          }
        : {
            c: 'var(--cyaan-tekst, var(--cyan))',
            bg: 'var(--cyaan-10)',
            glow: 'var(--cyaan-25)',
            title: `Veilig in de ${thisLabel}`,
            body:
              league.promote > 0
                ? `Nog ${fmt(toPromoZone)} XP tot de promotiezone (top ${league.promote}).`
                : 'De hoogste divisie: hier kun je alleen nog zakken. Blijf oefenen.',
          }

  return (
    <div className="shell">
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />

      {/* ---------- uitslag van vorige week ---------- */}
      {uitslag && (
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          style={{
            padding: 16,
            marginBottom: 16,
            borderColor:
              uitslag.uitkomst === 'promotie' ? 'var(--ok)' : uitslag.uitkomst === 'degradatie' ? 'var(--line)' : 'var(--line-gold)',
          }}
        >
          <p className="eyebrow" style={{ fontSize: 11 }}>
            Uitslag vorige week
          </p>
          <p className="display" style={{ fontSize: 23, margin: '8px 0 4px' }}>
            {uitslag.uitkomst === 'promotie'
              ? `🎉 Plek #${uitslag.rank}: gepromoveerd!`
              : uitslag.uitkomst === 'degradatie'
                ? `Plek #${uitslag.rank}, een stapje terug.`
                : `Plek #${uitslag.rank}: je blijft ${divisionLabel(uitslag.nieuwLeagueId).toLowerCase()}.`}
          </p>
          <p className="dim" style={{ fontSize: 14, marginBottom: 12 }}>
            {uitslag.uitkomst === 'promotie'
              ? `Je eindigde in de promotiezone van de ${divisionLabel(uitslag.leagueId).toLowerCase()} en speelt nu in de ${divisionLabel(uitslag.nieuwLeagueId).toLowerCase()}.`
              : uitslag.uitkomst === 'degradatie'
                ? `Vanuit hier kan het alleen maar omhoog. Eén goede week en je bent terug in de ${divisionLabel(uitslag.leagueId).toLowerCase()}.`
                : 'Precies de ranglijst gevolgd die je de hele week zag. Deze week pak je die promotiezone.'}
          </p>
          <button
            className="btn btn-primary"
            style={{ padding: 12, fontSize: 14 }}
            onClick={() => {
              sfx('tap')
              clearWeekUitslag()
            }}
          >
            {uitslag.uitkomst === 'promotie' ? 'Op naar meer!' : 'Nieuwe week, nieuwe kansen'}
          </button>
        </motion.div>
      )}

      {/* ---------- kop ---------- */}
      <div className="center">
        <p className="eyebrow">Wekelijkse competitie</p>
        <div className="center" style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 4px' }}>
          <Medal leagueId={leagueId} calm={calm} />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.3 }}
          className="display"
          style={{ fontSize: 28, color: inkt, textShadow: `0 0 26px ${alpha(color, 0.55)}` }}
        >
          {divisionLabel(leagueId)}
        </motion.h1>
        <p className="dim" style={{ fontSize: 14, marginTop: 0 }}>
          Divisie {leagueId + 1} van {LEAGUES.length}
          {promotions > 0 && ` · ${promotions}× gepromoveerd`}
        </p>
      </div>

      <DivisionDots leagueId={leagueId} />

      {/* ---------- eigen stand ---------- */}
      <div className="stat-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
        <div className="glass stat-card" style={{ padding: 12 }}>
          <div className="stat-value hot-text" style={{ fontSize: 28 }}>
            {empty ? '—' : `#${rank}`}
          </div>
          <div className="stat-label">Jouw plek</div>
        </div>
        <div className="glass stat-card" style={{ padding: 12 }}>
          <div className="stat-value gold-text" style={{ fontSize: 28 }}>
            {fmt(weekXp)}
          </div>
          <div className="stat-label">XP deze week</div>
        </div>
        {/* "Spelers: 30" stond hier altijd hetzelfde; dit getal beweegt met elke les */}
        <div className="glass stat-card" style={{ padding: 12 }}>
          <div className="stat-value" style={{ fontSize: 28, color: 'var(--cyan)' }}>
            {empty ? '—' : zone === 'promotie' ? '✓' : fmt(toPromoZone || 1)}
          </div>
          <div className="stat-label">{zone === 'promotie' ? 'In promotiezone' : 'XP tot promotie'}</div>
        </div>
      </div>

      {/* één duidelijke actie: de ranglijst is geen kijkspel */}
      {!empty && onLeren && (
        <div style={{ marginTop: 12 }}>
          <button
            className="btn btn-primary"
            style={{ padding: 16, fontSize: 16 }}
            onClick={() => {
              sfx('tap')
              onLeren()
            }}
          >
            {zone === 'promotie'
              ? '▶ Houd je plek vast: doe een les'
              : climb !== null && above
                ? `▶ Nog ${fmt(climb)} XP en je gaat ${above.name} voorbij`
                : '▶ Pak die plek: start een les'}
          </button>
        </div>
      )}

      {/* ---------- aftelbalk ---------- */}
      <motion.div
        className="glass"
        animate={urgent && !calm ? { boxShadow: ['0 0 0 var(--hot-05)', '0 0 26px var(--hot-50)', '0 0 0 var(--hot-05)'] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          padding: '13px 16px',
          marginTop: 12,
          border: urgent ? '1.5px solid var(--err)' : undefined,
        }}
      >
        <div className="spread" style={{ marginBottom: 8 }}>
          <span className="row" style={{ gap: 8, fontWeight: 700, fontSize: 14, color: urgent ? 'var(--err)' : 'var(--text)' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            Nog {fmt(hours)} uur deze week
          </span>
          <span className="faint" style={{ fontSize: 12.5, fontWeight: 700 }}>
            {urgent ? 'LAATSTE DAG' : `${Math.round(elapsed * 100)}% voorbij`}
          </span>
        </div>
        <div className="progress-track" style={{ height: 9 }}>
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(elapsed * 100)}%` }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ background: urgent ? 'linear-gradient(135deg, #FB7185, #EF4444)' : undefined }}
          />
        </div>
        <p className="faint" style={{ fontSize: 11, marginTop: 8 }}>
          {urgent
            ? 'De week sluit vanavond. Dit is je laatste kans om te klimmen.'
            : 'Zondag om middernacht wordt de stand definitief.'}
        </p>
      </motion.div>

      {/* ---------- motivatie ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="card-hero"
        style={{
          padding: 16,
          marginTop: 16,
          borderLeft: `4px solid ${zoneCard.c}`,
          boxShadow: `0 0 28px ${zoneCard.glow}`,
        }}
      >
        <p className="display" style={{ fontSize: 19, color: zoneCard.c }}>
          {zoneCard.title}
        </p>
        <p className="dim" style={{ fontSize: 14, marginTop: 4 }}>
          {zoneCard.body}
        </p>
        {weekXp === 0 && !empty && (
          <p className="faint" style={{ fontSize: 12.5, marginTop: 4 }}>
            Je hebt deze week nog geen XP verdiend. Je eerste les zet je meteen in beweging.
          </p>
        )}

        <div className="divider-gold" style={{ margin: '14px 0', width: 44 }} />

        {climb === null || above === null ? (
          <>
            <p className="display" style={{ fontSize: 16 }}>
              {empty ? 'Nog geen tegenstanders' : 'Je staat bovenaan. Verdedig je plek!'}
            </p>
            {runnerUp && (
              <p className="faint" style={{ fontSize: 12.5, marginTop: 4 }}>
                {runnerUp.name} zit {fmt(Math.max(0, weekXp - runnerUp.xp))} XP achter je.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="display" style={{ fontSize: 16, lineHeight: 1.3 }}>
              Nog <span className="gold-text">{fmt(climb)} XP</span> en je gaat {above.name} voorbij!
            </p>
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
              <div className="progress-track" style={{ height: 8 }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${above.xp > 0 ? Math.round(Math.min(1, weekXp / above.xp) * 100) : 100}%` }}
                  transition={{ delay: 0.35, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
              <span className="faint" style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                #{rank - 1}: {fmt(above.xp)}
              </span>
            </div>
            <p className="faint" style={{ fontSize: 12.5, marginTop: 8 }}>
              Dat is ongeveer {lessons} les{lessons === 1 ? '' : 'sen'}, of één potje in de arcade.
            </p>
          </>
        )}
      </motion.div>


      {/* ---------- ranglijst ---------- */}
      <div className="glass" style={{ padding: '12px 10px', marginTop: 16 }}>
        <div className="spread" style={{ padding: '2px 4px 10px' }}>
          <span className="eyebrow">Ranglijst</span>
          <span className="faint" style={{ fontSize: 11, fontWeight: 700 }}>
            {league.promote > 0 && `TOP ${league.promote} PROMOVEERT`}
            {league.promote > 0 && league.demote > 0 && ' · '}
            {league.demote > 0 && `LAATSTE ${league.demote} ZAKKEN`}
          </span>
        </div>

        {empty ? (
          <div className="center" style={{ padding: '26px 12px' }}>
            <p className="display" style={{ fontSize: 16 }}>
              De ranglijst wordt klaargezet
            </p>
            <p className="faint" style={{ fontSize: 12.5, marginTop: 4 }}>
              Zodra de week begint zie je hier je tegenstanders.
            </p>
          </div>
        ) : (
          list.map((p, i) => {
            const r = i + 1
            const showPromo = league.promote > 0 && r === league.promote + 1
            const showDemo = league.demote > 0 && r === safeRank + 1
            return (
              <div key={`${p.name}-${i}`}>
                {showPromo && <ZoneDivider kind="promotie" />}
                {showDemo && <ZoneDivider kind="degradatie" />}
                <Row player={p} rank={r} delay={Math.min(0.3, i * 0.01)} />
              </div>
            )
          })
        )}
      </div>

      {/* ---------- uitleg ---------- */}
      <div className="glass" style={{ padding: '4px 16px', marginTop: 12, marginBottom: 8 }}>
        <button
          type="button"
          className="spread"
          style={{ width: '100%', padding: '14px 0', minHeight: 48, textAlign: 'left' }}
          onClick={() => {
            sfx('tap')
            setExplain((v) => !v)
          }}
          aria-expanded={explain}
        >
          <span style={{ fontWeight: 700, fontSize: 14 }}>Hoe werkt de competitie?</span>
          <motion.span animate={{ rotate: explain ? 180 : 0 }} transition={{ duration: 0.2 }} className="faint" style={{ fontSize: 12.5 }}>
            ▾
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {explain && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <ul className="dim" style={{ fontSize: 14, paddingLeft: 18, paddingBottom: 16, display: 'grid', gap: 8 }}>
                <li>Je speelt elke week tegen {Math.max(1, total - 1)} andere leerlingen in de {thisLabel}.</li>
                <li>Alle XP telt mee: lessen, herhalen, minigames en duels.</li>
                {league.promote > 0 && (
                  <li>
                    De <strong style={{ color: 'var(--ok)' }}>top {league.promote}</strong> promoveert zondagnacht naar de{' '}
                    {nextLabel || 'volgende divisie'}.
                  </li>
                )}
                {league.demote > 0 && (
                  <li>
                    De <strong style={{ color: 'var(--err)' }}>laatste {league.demote}</strong> zakken naar de{' '}
                    {prevLabel || 'vorige divisie'}.
                  </li>
                )}
                <li>Maandag begint iedereen weer op 0 XP — een nieuwe kans, elke week.</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
