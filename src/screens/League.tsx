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
  'Obsidiaanse divisie',
  'Diamanten divisie',
]

const TOTAL_PLAYERS = 30
const HOURS_PER_WEEK = 168

function fmt(n: number): string {
  return n.toLocaleString('nl-NL')
}

/** Donkere of lichte tekst op een gekleurd vlak — op basis van helderheid */
function inkOn(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#1A1033' : '#FFFFFF'
}

/** rgba-string uit een hexkleur, voor gloed en zachte vlakken */
function alpha(hex: string, a: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/* ---------------- medaille ---------------- */

function Medal({ leagueId, calm }: { leagueId: number; calm: boolean }) {
  const league = LEAGUES[leagueId]
  const c = league.color
  const ink = inkOn(c)
  const gid = `medal-face-${leagueId}`
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
        <circle cx="69" cy="69" r="45" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <circle cx="69" cy="69" r="37" fill="none" stroke={alpha(ink === '#1A1033' ? '#1A1033' : '#FFFFFF', 0.28)} strokeWidth="1.5" />

        {/* divisienummer */}
        <text
          x="69"
          y="69"
          textAnchor="middle"
          dominantBaseline="central"
          fill={ink}
          style={{ fontFamily: "'Baloo 2', system-ui, sans-serif", fontSize: 40, fontWeight: 800 }}
        >
          {leagueId + 1}
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
          background: 'linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
        }}
      />
      <div className="spread" style={{ position: 'relative' }}>
        {LEAGUES.map((l) => {
          const done = l.id < leagueId
          const current = l.id === leagueId
          const size = current ? 22 : 12
          return (
            <div key={l.id} className="col" style={{ alignItems: 'center', gap: 5, width: 28 }}>
              <div style={{ height: 22, display: 'flex', alignItems: 'center' }}>
                <motion.div
                  title={DIVISION_LABEL[l.id]}
                  aria-label={DIVISION_LABEL[l.id]}
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
                    border: current ? '2px solid rgba(255,255,255,0.75)' : done ? 'none' : '1.5px solid var(--line)',
                    opacity: current ? 1 : done ? 0.8 : 0.32,
                    boxShadow: current ? `0 0 16px ${alpha(l.color, 0.9)}` : 'none',
                  }}
                />
              </div>
              {current && (
                <span className="display" style={{ fontSize: 9.5, letterSpacing: '0.06em', color: l.color }}>
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
  const glow = promo ? 'rgba(74, 222, 128, 0.45)' : 'rgba(251, 113, 133, 0.45)'
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
          fontSize: 10.5,
          letterSpacing: '0.14em',
          color: c,
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
        gap: 11,
        padding: you ? '11px 12px' : '9px 12px',
        marginBottom: 4,
        borderRadius: 'var(--r-md)',
        minHeight: 48,
        background: you ? 'rgba(236, 72, 153, 0.14)' : 'transparent',
        border: you ? '2px solid var(--hot2)' : '2px solid transparent',
        boxShadow: you ? '0 0 24px rgba(236, 72, 153, 0.35), 0 3px 0 rgba(0,0,0,0.3)' : 'none',
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
          fontSize: 15,
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
        style={{ fontSize: 14.5, color: you ? undefined : 'var(--text-dim)', flexShrink: 0 }}
      >
        {fmt(player.xp)} XP
      </span>
    </motion.div>
  )
}

/* ---------------- scherm ---------------- */

export function LeagueScreen() {
  const leagueId = useStore((s) => s.leagueId)
  const weekXp = useStore((s) => s.weekXp)
  const promotions = useStore((s) => s.promotions)
  const calm = Boolean(useReducedMotion())

  const [hours, setHours] = useState(() => hoursLeftInWeek())
  const [explain, setExplain] = useState(false)

  // aftellen leeft mee: elke minuut opnieuw kijken
  useEffect(() => {
    const t = window.setInterval(() => setHours(hoursLeftInWeek()), 60000)
    return () => window.clearInterval(t)
  }, [])

  const league = LEAGUES[leagueId]
  const color = league.color
  const list = useMemo(() => standings(leagueId, weekXp), [leagueId, weekXp])
  const rank = yourRank(list)
  const zone = zoneFor(leagueId, rank)
  const climb = xpToClimb(list)
  const above = rank > 1 ? list[rank - 2] : null

  const urgent = hours < 24
  const elapsed = Math.min(1, Math.max(0, 1 - hours / HOURS_PER_WEEK))

  // namen van de divisie boven en onder je (leeg als die niet bestaat)
  const nextLabel = leagueId + 1 < LEAGUES.length ? DIVISION_LABEL[leagueId + 1].toLowerCase() : ''
  const prevLabel = leagueId > 0 ? DIVISION_LABEL[leagueId - 1].toLowerCase() : ''
  const thisLabel = DIVISION_LABEL[leagueId].toLowerCase()

  // grens van de degradatiezone (laagste veilige plek)
  const safeRank = TOTAL_PLAYERS - league.demote
  // XP die je nog nodig hebt om de promotiezone te halen / uit de degradatiezone te komen
  const toPromoZone =
    league.promote > 0 && rank > league.promote ? Math.max(1, list[league.promote - 1].xp - weekXp + 1) : 0
  const toSafe = league.demote > 0 && rank > safeRank ? Math.max(1, list[safeRank - 1].xp - weekXp + 1) : 0

  // sta je op promotie? dan een feestje bij het openen van het scherm
  useEffect(() => {
    if (zone !== 'promotie') return
    confetti({
      particleCount: 60,
      spread: 85,
      startVelocity: 34,
      origin: { y: 0.32 },
      colors: [color, '#FFC53D', '#FFFFFF', '#EC4899'],
      disableForReducedMotion: true,
    })
  }, [zone, color])

  const zoneCard =
    zone === 'promotie'
      ? {
          c: 'var(--ok)',
          bg: 'var(--ok-bg)',
          glow: 'rgba(74, 222, 128, 0.3)',
          title: 'Je staat op promotie!',
          body: nextLabel
            ? `Hou dit vol tot zondag en je klimt naar de ${nextLabel}.`
            : 'Je staat bovenaan de hoogste divisie. Niemand komt hier zomaar.',
        }
      : zone === 'degradatie'
        ? {
            c: 'var(--err)',
            bg: 'var(--err-bg)',
            glow: 'rgba(251, 113, 133, 0.3)',
            title: 'Pas op: je zakt uit deze divisie',
            body: `Nog ${fmt(toSafe)} XP en je staat weer veilig op plek ${safeRank}. Eén les kan al genoeg zijn.`,
          }
        : {
            c: 'var(--gold)',
            bg: 'rgba(255, 197, 61, 0.12)',
            glow: 'rgba(255, 197, 61, 0.26)',
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
          style={{ fontSize: 30, color, textShadow: `0 0 26px ${alpha(color, 0.55)}` }}
        >
          {DIVISION_LABEL[leagueId]}
        </motion.h1>
        <p className="dim" style={{ fontSize: 13.5, marginTop: 2 }}>
          Divisie {leagueId + 1} van {LEAGUES.length}
          {promotions > 0 && ` · ${promotions}× gepromoveerd`}
        </p>
      </div>

      <DivisionDots leagueId={leagueId} />

      {/* ---------- eigen stand ---------- */}
      <div className="stat-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
        <div className="glass stat-card" style={{ padding: 14 }}>
          <div className="stat-value hot-text" style={{ fontSize: 26 }}>
            #{rank}
          </div>
          <div className="stat-label">Jouw plek</div>
        </div>
        <div className="glass stat-card" style={{ padding: 14 }}>
          <div className="stat-value gold-text" style={{ fontSize: 26 }}>
            {fmt(weekXp)}
          </div>
          <div className="stat-label">XP deze week</div>
        </div>
        <div className="glass stat-card" style={{ padding: 14 }}>
          <div className="stat-value" style={{ fontSize: 26, color: 'var(--cyan)' }}>
            {TOTAL_PLAYERS}
          </div>
          <div className="stat-label">Spelers</div>
        </div>
      </div>

      {/* ---------- aftelbalk ---------- */}
      <motion.div
        className="glass"
        animate={urgent && !calm ? { boxShadow: ['0 0 0 rgba(251,113,133,0)', '0 0 26px rgba(251,113,133,0.45)', '0 0 0 rgba(251,113,133,0)'] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          padding: '13px 16px',
          marginTop: 14,
          border: urgent ? '1.5px solid var(--err)' : undefined,
        }}
      >
        <div className="spread" style={{ marginBottom: 9 }}>
          <span className="row" style={{ gap: 7, fontWeight: 700, fontSize: 14.5, color: urgent ? 'var(--err)' : 'var(--text)' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            Nog {fmt(hours)} uur deze week
          </span>
          <span className="faint" style={{ fontSize: 12, fontWeight: 700 }}>
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
        <p className="faint" style={{ fontSize: 11.5, marginTop: 7 }}>
          {urgent
            ? 'De week sluit vanavond — dit is je laatste kans om te klimmen.'
            : 'Zondag om middernacht wordt de stand definitief.'}
        </p>
      </motion.div>

      {/* ---------- ranglijst ---------- */}
      <div className="glass" style={{ padding: '12px 10px', marginTop: 16 }}>
        <div className="spread" style={{ padding: '2px 4px 10px' }}>
          <span className="eyebrow">Ranglijst</span>
          <span className="faint" style={{ fontSize: 11.5, fontWeight: 700 }}>
            {league.promote > 0 && `TOP ${league.promote} PROMOVEERT`}
            {league.promote > 0 && league.demote > 0 && ' · '}
            {league.demote > 0 && `LAATSTE ${league.demote} ZAKT`}
          </span>
        </div>

        {list.map((p, i) => {
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
        })}
      </div>

      {/* ---------- motivatie ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="glass"
        style={{
          padding: 18,
          marginTop: 16,
          border: `2px solid ${zoneCard.c}`,
          background: zoneCard.bg,
          boxShadow: `0 0 28px ${zoneCard.glow}`,
        }}
      >
        <p className="display" style={{ fontSize: 19, color: zoneCard.c }}>
          {zoneCard.title}
        </p>
        <p className="dim" style={{ fontSize: 13.5, marginTop: 4 }}>
          {zoneCard.body}
        </p>

        <div className="divider-gold" style={{ margin: '14px 0', width: 44 }} />

        {climb === null || above === null ? (
          <>
            <p className="display" style={{ fontSize: 17 }}>
              Je staat bovenaan. Verdedig je plek!
            </p>
            <p className="faint" style={{ fontSize: 12.5, marginTop: 3 }}>
              {list.length > 1 && `${list[1].name} zit ${fmt(Math.max(0, weekXp - list[1].xp))} XP achter je.`}
            </p>
          </>
        ) : (
          <>
            <p className="display" style={{ fontSize: 17, lineHeight: 1.3 }}>
              Nog <span className="gold-text">{fmt(climb)} XP</span> en je gaat {above.name} voorbij!
            </p>
            <div className="row" style={{ gap: 10, marginTop: 10 }}>
              <div className="progress-track" style={{ height: 8 }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${above.xp > 0 ? Math.round(Math.min(1, weekXp / above.xp) * 100) : 100}%` }}
                  transition={{ delay: 0.35, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
              <span className="faint" style={{ fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
                #{rank - 1}: {fmt(above.xp)}
              </span>
            </div>
            <p className="faint" style={{ fontSize: 12.5, marginTop: 8 }}>
              Dat is ongeveer {Math.max(1, Math.ceil(climb / 20))} les{Math.ceil(climb / 20) === 1 ? '' : 'sen'} — of één
              potje in de arcade.
            </p>
          </>
        )}
      </motion.div>

      {/* ---------- uitleg ---------- */}
      <div className="glass" style={{ padding: '4px 16px', marginTop: 14, marginBottom: 8 }}>
        <button
          className="spread"
          style={{ width: '100%', padding: '14px 0', minHeight: 48 }}
          onClick={() => {
            sfx('tap')
            setExplain((v) => !v)
          }}
          aria-expanded={explain}
        >
          <span style={{ fontWeight: 700, fontSize: 14.5 }}>Hoe werkt de competitie?</span>
          <motion.span animate={{ rotate: explain ? 180 : 0 }} transition={{ duration: 0.2 }} className="faint" style={{ fontSize: 12 }}>
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
              <ul className="dim" style={{ fontSize: 13.5, paddingLeft: 18, paddingBottom: 16, display: 'grid', gap: 7 }}>
                <li>Je speelt elke week tegen {TOTAL_PLAYERS - 1} andere leerlingen in de {thisLabel}.</li>
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
