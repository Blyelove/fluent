import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { BADGES, allBadges, badgePoints, type BadgeDef, type BadgeState, type BadgeStats } from '../achievements'
import { courses } from '../content'
import { countryStates } from '../countries'
import { totalXp, useStore, wordsLearned } from '../store'
import { sfx } from '../audio'
import type { Course } from '../types'
import { feestPalet } from '../wereldkleuren'

/**
 * De verzamelkast: alle 10 badges met 5 tiers elk (50 te verdienen sterren).
 * Alles is altijd zichtbaar — ook wat je nog niet hebt — zodat er altijd
 * een volgende mijlpaal lonkt.
 */

type State = ReturnType<typeof useStore.getState>

const MAX_TIER = 5
const MAX_POINTS = BADGES.length * MAX_TIER

/** Statistieken uit de store omzetten naar badge-tellers */
function statsOf(s: State): BadgeStats {
  // opgeslagen data van een oudere versie kan een cursus bevatten die niet meer bestaat
  const course = courses[s.courseId] as Course | undefined
  const completedCount = (s.progress[s.courseId]?.completed ?? []).length
  return {
    streak: s.streak,
    xp: totalXp(s),
    words: wordsLearned(s, s.courseId),
    perfect: s.perfectLessons,
    countries: course ? countryStates(course, completedCount).filter((c) => c.conquered).length : 0,
    duels: s.duelsWon,
    league: s.promotions,
    arcade: s.arcadePlays,
    tests: (s.tests ?? []).filter((t) => t.passed).length,
    goals: (s.goalsDone ?? []).length,
  }
}

/** Korte aansporing per badge — "nog X te gaan" in gewone taal */
const CTA: Record<string, (n: number) => string> = {
  streak: (n) => `Nog ${n} ${n === 1 ? 'dag' : 'dagen'} op rij leren`,
  xp: (n) => `Nog ${fmt(n)} XP verdienen`,
  words: (n) => `Nog ${fmt(n)} ${n === 1 ? 'woord' : 'woorden'} leren`,
  perfect: (n) => `Nog ${fmt(n)} foutloze ${n === 1 ? 'les' : 'lessen'}`,
  countries: (n) => `Nog ${n} ${n === 1 ? 'land' : 'landen'} veroveren`,
  duels: (n) => `Nog ${n} ${n === 1 ? 'duel' : 'duels'} winnen`,
  league: (n) => `Nog ${n} keer promoveren`,
  arcade: (n) => `Nog ${n} ${n === 1 ? 'minigame' : 'minigames'} spelen`,
  tests: (n) => `Nog ${n} ${n === 1 ? 'toets' : 'toetsen'} halen`,
  goals: (n) => `Nog ${n} ${n === 1 ? 'doel' : 'doelen'} halen`,
}

function fmt(n: number): string {
  return Number.isFinite(n) ? Math.round(n).toLocaleString('nl-NL') : '0'
}

/** Percentage veilig maken: nooit NaN en altijd binnen 0-100 */
function pctOf(frac: number): number {
  if (!Number.isFinite(frac)) return 0
  return Math.max(0, Math.min(100, Math.round(frac * 100)))
}

function ctaFor(b: BadgeState): string {
  if (b.next === null) return 'Alles behaald — maximale tier!'
  const left = Math.max(1, b.next - b.value)
  const fn = CTA[b.def.id]
  return fn ? fn(left) : `Nog ${fmt(left)} te gaan`
}

/** Vijf stipjes die laten zien hoever je in deze badge bent */
function TierPips({ tier, color }: { tier: number; color: string }) {
  return (
    <span className="row" style={{ gap: 4 }}>
      {Array.from({ length: MAX_TIER }, (_, i) => i + 1).map((t) => (
        <span
          key={t}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: t <= tier ? color : 'var(--glans-16)',
            boxShadow: t <= tier ? `0 0 6px ${color}` : 'none',
          }}
        />
      ))}
    </span>
  )
}

/** Rond icoon met de badgekleur; op tier 0 grijs en op slot */
function BadgeOrb({ b, size }: { b: BadgeState; size: number }) {
  const locked = b.tier === 0
  const maxed = b.tier === MAX_TIER
  const color = b.def.color
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <motion.div
        animate={maxed ? { boxShadow: [`0 0 10px ${color}55`, `0 0 26px ${color}aa`, `0 0 10px ${color}55`] } : {}}
        transition={maxed ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : {}}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.round(size * 0.46),
          lineHeight: 1,
          background: locked
            ? 'var(--surface-2)'
            : `radial-gradient(circle at 38% 30%, ${color}dd, ${color}55 62%, ${color}22 100%)`,
          border: `2px solid ${locked ? 'var(--line)' : maxed ? 'var(--gold)' : `${color}aa`}`,
          filter: locked ? 'grayscale(1)' : 'none',
          opacity: locked ? 0.5 : 1,
        }}
      >
        <span style={{ filter: locked ? 'none' : 'drop-shadow(0 2px 4px var(--inkt-50))' }}>{b.def.icon}</span>
      </motion.div>
      {locked && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: -2,
            bottom: -2,
            fontSize: Math.round(size * 0.26),
            lineHeight: 1,
            background: 'var(--bg-2)',
            borderRadius: '50%',
            padding: 4,
            border: '1.5px solid var(--line)',
          }}
        >
          🔒
        </span>
      )}
    </div>
  )
}

export function BadgesScreen() {
  const state = useStore()
  const [open, setOpen] = useState<BadgeDef | null>(null)

  const stats = useMemo(() => statsOf(state), [state])
  const list = useMemo(() => allBadges(stats), [stats])
  const points = badgePoints(list)

  // momentopname van "wat had je al gezien" — blijft staan terwijl we hem wegschrijven
  const seenAtOpen = useRef<Record<string, number>>(state.seenBadgeTiers ?? {})
  const marked = useRef(false)

  useEffect(() => {
    if (marked.current) return
    marked.current = true
    const s = useStore.getState()
    const fresh = allBadges(statsOf(s))
    const map: Record<string, number> = {}
    let nieuw = 0
    for (const b of fresh) {
      const seen = seenAtOpen.current[b.def.id] ?? 0
      if (b.tier > seen) {
        map[b.def.id] = b.tier
        nieuw += b.tier - seen
      }
    }
    if (nieuw > 0) {
      s.markBadgesSeen(map)
      confetti({
        particleCount: 40 + nieuw * 20,
        spread: 95,
        origin: { y: 0.35 },
        colors: feestPalet(),
        disableForReducedMotion: true,
      })
    }
  }, [])

  // Escape sluit het detailvenster — luisteraar wordt netjes opgeruimd
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isNew = (b: BadgeState): boolean => b.tier > (seenAtOpen.current[b.def.id] ?? 0)

  // dichtst bij de volgende tier — alleen badges die nog te winnen zijn
  // (filter geeft al een nieuwe array terug, sorteren is dus veilig)
  const almost = useMemo(() => list.filter((b) => b.next !== null).sort((a, b) => b.frac - a.frac).slice(0, 3), [list])

  const started = list.filter((b) => b.tier > 0).length
  const maxed = list.filter((b) => b.tier === MAX_TIER).length
  // helemaal verse gebruiker: nergens nog een teller boven nul
  const heeftData = list.some((b) => b.value > 0)

  return (
    <div className="shell">
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />

      <p className="eyebrow">Verzamelkast</p>
      <h1 className="display" style={{ fontSize: 28, margin: '8px 0 16px' }}>
        Jouw <span className="gold-text">prestaties</span>
      </h1>

      {/* ---------- totaalscore ---------- */}
      <motion.div
        className="glass"
        style={{ padding: 16, marginBottom: 24 }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      >
        <div className="spread" style={{ alignItems: 'flex-end' }}>
          <div className="col">
            <span className="display gold-text" style={{ fontSize: 48, lineHeight: 1 }}>
              {points}
              <span className="faint display" style={{ fontSize: 23, WebkitTextFillColor: 'var(--text-faint)' }}>
                {' '}
                / {MAX_POINTS}
              </span>
            </span>
            <span className="stat-label" style={{ marginTop: 4 }}>
              Behaalde tiers
            </span>
          </div>
          <motion.span
            style={{ fontSize: 48, lineHeight: 1 }}
            animate={{ rotate: [0, -7, 7, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            🏅
          </motion.span>
        </div>

        <div className="progress-track" style={{ marginTop: 16, height: 14 }}>
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pctOf(points / MAX_POINTS)}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.15 }}
          />
        </div>

        <p className="dim" style={{ fontSize: 12.5, marginTop: 8 }}>
          {started === 0 ? `Nog geen van de ${BADGES.length} badges gestart` : `${started} van de ${BADGES.length} badges gestart`}
          {maxed > 0 && (
            <>
              {' · '}
              <span className="gold-text" style={{ fontWeight: 800 }}>
                {maxed} op MAX
              </span>
            </>
          )}
        </p>
      </motion.div>

      {/* ---------- lege staat: nog helemaal niets verzameld ---------- */}
      {!heeftData && (
        <motion.div
          className="glass center"
          style={{ padding: 16, marginBottom: 24 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 24 }}
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>✨</span>
          <p className="display" style={{ fontSize: 16, marginTop: 8 }}>
            Nog niets verzameld
          </p>
          <p className="dim" style={{ fontSize: 12.5, marginTop: 4 }}>
            Rond je eerste les af en de eerste tier is meteen binnen. Hieronder zie je precies wat er te veroveren valt.
          </p>
        </motion.div>
      )}

      {/* ---------- bijna binnen ---------- */}
      {almost.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <div className="spread" style={{ marginBottom: 8 }}>
            <h2 className="display" style={{ fontSize: 19 }}>
              {heeftData ? 'Bijna binnen!' : 'Hier begin je'}
            </h2>
            <span className="faint" style={{ fontSize: 12.5 }}>
              {heeftData ? 'dichtstbij' : 'eerste mijlpalen'}
            </span>
          </div>
          <div className="col" style={{ gap: 8 }}>
            {almost.map((b, i) => (
              <motion.button
                key={b.def.id}
                className="opt"
                style={{ borderColor: `${b.def.color}66`, minHeight: 44 }}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i, type: 'spring', stiffness: 240, damping: 26 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  sfx('tap')
                  setOpen(b.def)
                }}
                aria-label={`${b.def.name} bekijken`}
              >
                <BadgeOrb b={b} size={44} />
                <span className="col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: 14 }}>{b.def.name}</strong>
                  <span className="faint" style={{ fontSize: 12.5, fontWeight: 500 }}>
                    {ctaFor(b)} → {b.def.tierNames[b.tier]}
                  </span>
                  {/* flex uitzetten: .progress-track heeft flex:1, dat zou in een kolom de hoogte kapen */}
                  <span className="progress-track" style={{ flex: '0 0 auto', height: 6, marginTop: 0 }}>
                    <motion.span
                      style={{ display: 'block', height: '100%', borderRadius: 999, background: b.def.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pctOf(b.frac)}%` }}
                      transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.2 + 0.08 * i }}
                    />
                  </span>
                </span>
                <span className="display" style={{ fontSize: 14, color: b.def.color, fontWeight: 800 }}>
                  {pctOf(b.frac)}%
                </span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ---------- alle badges ---------- */}
      <h2 className="display" style={{ fontSize: 19, marginBottom: 8 }}>
        Alle badges
      </h2>
      <div className="stat-grid" style={{ gap: 12 }}>
        {list.map((b, i) => {
          const locked = b.tier === 0
          const maxedOut = b.tier === MAX_TIER
          const pct = pctOf(b.frac)
          return (
            <motion.button
              key={b.def.id}
              className="glass"
              style={{
                padding: '16px 14px 14px',
                textAlign: 'center',
                position: 'relative',
                minHeight: 178,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                borderColor: maxedOut ? 'var(--line-gold)' : locked ? 'var(--line)' : `${b.def.color}55`,
                boxShadow: maxedOut ? 'var(--shadow), var(--glow-gold)' : 'var(--shadow)',
              }}
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.03 * i, type: 'spring', stiffness: 260, damping: 24 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sfx('tap')
                setOpen(b.def)
              }}
              aria-label={`${b.def.name}, ${b.tier === 0 ? 'nog niet behaald' : b.def.tierNames[b.tier - 1]}`}
            >
              {maxedOut && (
                <span
                  className="display"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: 'var(--grad-gold)',
                    color: 'var(--ink-on-gold)',
                    fontWeight: 800,
                  }}
                >
                  MAX
                </span>
              )}
              {isNew(b) && !maxedOut && (
                <motion.span
                  className="display"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: 'var(--grad-hot)',
                    color: '#fff',
                    fontWeight: 800,
                  }}
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  NIEUW
                </motion.span>
              )}

              <BadgeOrb b={b} size={62} />

              <span className="col" style={{ gap: 0, alignItems: 'center' }}>
                <strong style={{ fontSize: 14, lineHeight: 1.2 }}>{b.def.name}</strong>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: locked ? 'var(--text-faint)' : b.def.color,
                  }}
                >
                  {locked ? 'Nog niet behaald' : b.def.tierNames[b.tier - 1]}
                </span>
              </span>

              <TierPips tier={b.tier} color={locked ? 'var(--text-faint)' : b.def.color} />

              <div style={{ width: '100%', marginTop: 'auto' }}>
                <span className="progress-track" style={{ display: 'block', flex: '0 0 auto', height: 7 }}>
                  <motion.span
                    style={{
                      display: 'block',
                      height: '100%',
                      borderRadius: 999,
                      background: maxedOut ? 'var(--grad-gold)' : b.def.color,
                      boxShadow: maxedOut ? 'var(--glow-gold)' : 'none',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.1 + 0.03 * i }}
                  />
                </span>
                <span className="faint" style={{ display: 'block', fontSize: 11, marginTop: 4, fontWeight: 600 }}>
                  {b.next === null ? `${fmt(b.value)} · voltooid` : `${fmt(b.value)} / ${fmt(b.next)}`}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <p className="faint center" style={{ fontSize: 12.5, margin: '26px 0 4px' }}>
        Elke badge heeft vijf tiers. Tik op een badge om te zien wat er nog te veroveren valt.
      </p>

      {/* ---------- detailvenster ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              className="modal-panel"
              role="dialog"
              aria-modal="true"
              aria-label={`Badge ${open.name}`}
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const b = list.find((x) => x.def.id === open.id)
                // kan in principe niet gebeuren, maar zonder sluitknop zit je vast
                if (!b)
                  return (
                    <div className="col" style={{ gap: 12 }}>
                      <p className="dim" style={{ fontSize: 14 }}>
                        Deze badge kon niet worden geladen.
                      </p>
                      <button className="btn btn-ghost" onClick={() => setOpen(null)}>
                        Sluiten
                      </button>
                    </div>
                  )
                return (
                  <>
                    <div className="row" style={{ gap: 12, marginBottom: 4 }}>
                      <BadgeOrb b={b} size={64} />
                      <div className="col" style={{ gap: 0, flex: 1 }}>
                        <h3 className="display" style={{ fontSize: 23 }}>
                          {b.def.name}
                        </h3>
                        <p className="dim" style={{ fontSize: 12.5 }}>
                          {b.def.desc}
                        </p>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: b.def.color }}>
                          {b.tier === 0 ? 'Nog niet behaald' : `Tier ${b.tier} · ${b.def.tierNames[b.tier - 1]}`}
                        </p>
                      </div>
                    </div>

                    <div className="glass" style={{ padding: '12px 14px', margin: '14px 0 18px' }}>
                      <div className="spread">
                        <span className="dim" style={{ fontSize: 12.5, fontWeight: 600 }}>
                          Jouw stand
                        </span>
                        <span className="display gold-text" style={{ fontSize: 19 }}>
                          {fmt(b.value)}
                        </span>
                      </div>
                      <p className="faint" style={{ fontSize: 12.5, marginTop: 4 }}>
                        {ctaFor(b)}
                      </p>
                    </div>

                    <div className="col" style={{ gap: 8 }}>
                      {b.def.tiers.map((drempel, idx) => {
                        const done = b.tier >= idx + 1
                        const current = b.tier === idx
                        return (
                          <div
                            key={drempel}
                            className="row"
                            style={{
                              gap: 12,
                              padding: '12px 14px',
                              borderRadius: 'var(--r-md)',
                              background: done ? `${b.def.color}1f` : 'var(--surface)',
                              border: `2px solid ${done ? `${b.def.color}88` : current ? 'var(--line-hot)' : 'var(--line)'}`,
                              opacity: done || current ? 1 : 0.75,
                            }}
                          >
                            <span
                              className="display center"
                              style={{
                                width: 32,
                                height: 32,
                                flexShrink: 0,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                                background: done ? b.def.color : 'var(--surface-2)',
                                color: done ? 'var(--ink-on-gold)' : 'var(--text-faint)',
                                fontWeight: 800,
                              }}
                            >
                              {done ? '✓' : idx + 1}
                            </span>
                            <span className="col" style={{ gap: 0, flex: 1 }}>
                              <strong style={{ fontSize: 14, color: done ? 'var(--text)' : 'var(--text-dim)' }}>
                                {b.def.tierNames[idx]}
                              </strong>
                              <span className="faint" style={{ fontSize: 12.5 }}>
                                {b.def.desc}: {fmt(drempel)}
                              </span>
                            </span>
                            {current && (
                              <span className="hot-text display" style={{ fontSize: 12.5, letterSpacing: '0.08em' }}>
                                NU BEZIG
                              </span>
                            )}
                            {idx + 1 === MAX_TIER && done && (
                              <span className="gold-text display" style={{ fontSize: 12.5, letterSpacing: '0.1em' }}>
                                MAX
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => setOpen(null)}>
                      Sluiten
                    </button>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
