import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Course } from '../types'
import { countryStates, type CountryState } from '../countries'
import { Flag } from '../components/Flag'
import { Avatar } from '../components/Avatar'
import { levelForXp } from '../levels'
import { totalXp, useStore } from '../store'
import { sfx } from '../audio'

/**
 * De Wereldreis — fase 1: de kaart.
 *
 * Een verticale neon-sagakaart: onderaan begint de reis, elk land is een
 * knooppunt op een slingerend pad en je klimt omhoog naarmate je meer lessen
 * voltooit. Veroverde etappes gloeien in het paars-roze verloop, het volgende
 * land lonkt met een pulserende amber ring, en de toekomst is gedimd — nooit
 * op slot, hooguit nog in de mist.
 *
 * Prestatiecontract (uit WERELDREIS.md): één gememoïseerde SVG, landknopen
 * als HTML-knoppen erboven, native scroll, en maximaal één oneindige
 * animatie (de amber ring).
 */

/** Ontwerpbreedte; de SVG rekt mee met het scherm via preserveAspectRatio */
const BREEDTE = 375
/** Verticale afstand tussen twee landen */
const STAP = 190
/** Ruimte boven het hoogste en onder het laagste land */
const KOP = 130
const VOET = 150

/** Deterministische zigzag: geen willekeur, dus een stabiele kaart */
const XS = [96, 272, 132, 252]

interface Knoop extends CountryState {
  x: number
  y: number
  /** eerste onveroverde land dat met de huidige lessen haalbaar is */
  isVolgende: boolean
}

function bouwKnopen(landen: CountryState[], hoogte: number): Knoop[] {
  const volgende = landen.find((c) => !c.conquered)
  return landen.map((c, i) => ({
    ...c,
    x: XS[i % XS.length],
    y: hoogte - VOET - i * STAP,
    isVolgende: !!volgende && volgende.code === c.code && volgende.threshold === c.threshold,
  }))
}

/** Kubische S-bocht tussen twee knopen — de controlepunten op halve hoogte */
function bocht(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const mid = (a.y + b.y) / 2
  return `M ${a.x} ${a.y} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`
}

export function WorldMapScreen({
  course,
  completedCount,
  onBack,
  onVerderLeren,
}: {
  course: Course
  completedCount: number
  onBack: () => void
  /** Sluit de kaart en start meteen de eerstvolgende les — de kaart is een lanceerplatform, geen galerij */
  onVerderLeren?: () => void
}) {
  const [gekozen, setGekozen] = useState<Knoop | null>(null)
  const scroller = useRef<HTMLDivElement | null>(null)
  const actiefPad = useRef<SVGPathElement | null>(null)
  const look = useStore((s) => s.avatarLook)
  const level = useStore((s) => levelForXp(totalXp(s)))

  const landen = useMemo(() => countryStates(course, completedCount), [course, completedCount])
  const hoogte = KOP + VOET + Math.max(1, landen.length - 1) * STAP + 80
  const knopen = useMemo(() => bouwKnopen(landen, hoogte), [landen, hoogte])
  const veroverd = landen.filter((c) => c.conquered).length

  /**
   * De actieve etappe: van je laatst veroverde land (of het vertrekpunt) naar
   * je volgende bestemming. Jouw held staat op dit pad, precies zo ver als je
   * lessen vorderen — elke les is letterlijk een stap op de wereld.
   */
  const actief = useMemo(() => {
    const start = { x: knopen[0]?.x ?? BREEDTE / 2, y: hoogte - 52 }
    const volgendeIdx = knopen.findIndex((k) => k.isVolgende)
    if (volgendeIdx === -1) {
      // alles veroverd: de held staat triomfantelijk bij het hoogste land
      const top = knopen[knopen.length - 1]
      return top ? { d: '', frac: 1, rustpunt: { x: top.x, y: top.y }, naarLinks: false } : null
    }
    const doel = knopen[volgendeIdx]
    const vorige = volgendeIdx > 0 ? knopen[volgendeIdx - 1] : null
    const van = vorige ?? start
    const vorigeDrempel = vorige ? vorige.threshold : 0
    const frac = Math.min(1, Math.max(0, (completedCount - vorigeDrempel) / Math.max(1, doel.threshold - vorigeDrempel)))
    return { d: bocht(van, doel), frac, rustpunt: null, naarLinks: doel.x < van.x }
  }, [knopen, hoogte, completedCount])

  // positie van de held op het actieve pad — gemeten aan het échte SVG-pad
  const [held, setHeld] = useState<{ x: number; y: number } | null>(null)
  useLayoutEffect(() => {
    if (!actief) return
    if (actief.rustpunt) {
      setHeld(actief.rustpunt)
      return
    }
    const pad = actiefPad.current
    if (!pad) return
    const punt = pad.getPointAtLength(actief.frac * pad.getTotalLength())
    setHeld({ x: punt.x, y: punt.y })
  }, [actief])

  // de hele route als één gememoïseerde SVG — knopen komen er als HTML overheen
  const kaart = useMemo(() => {
    const segmenten = knopen.slice(1).map((doel, i) => ({
      d: bocht(knopen[i], doel),
      klaar: doel.conquered,
      key: doel.code + doel.threshold,
    }))
    // het startpunt van de reis, onder het eerste land
    const start = { x: knopen[0]?.x ?? BREEDTE / 2, y: hoogte - 52 }
    const eerste = knopen[0] ? `M ${start.x} ${start.y} L ${knopen[0].x} ${knopen[0].y}` : ''
    return (
      <svg
        viewBox={`0 0 ${BREEDTE} ${hoogte}`}
        width="100%"
        height={hoogte}
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="reis-hot" x1="0" y1="1" x2="0.6" y2="0">
            <stop offset="0" stopColor="#A855F7" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        {/* gestippelde basislijn: de hele route, ook wat nog komt */}
        {eerste && <path d={eerste} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={5} strokeDasharray="3 13" strokeLinecap="round" />}
        {segmenten.map((s) => (
          <path key={`basis-${s.key}`} d={s.d} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={5} strokeDasharray="3 13" strokeLinecap="round" />
        ))}
        {/* veroverde etappes: eerst een brede zachte gloed, dan de hete lijn */}
        {knopen[0]?.conquered && eerste && (
          <>
            <path d={eerste} fill="none" stroke="url(#reis-hot)" strokeWidth={13} strokeLinecap="round" opacity={0.22} />
            <path d={eerste} fill="none" stroke="url(#reis-hot)" strokeWidth={6} strokeLinecap="round" />
          </>
        )}
        {segmenten
          .filter((s) => s.klaar)
          .map((s) => (
            <g key={`klaar-${s.key}`}>
              <path d={s.d} fill="none" stroke="url(#reis-hot)" strokeWidth={13} strokeLinecap="round" opacity={0.22} />
              <path d={s.d} fill="none" stroke="url(#reis-hot)" strokeWidth={6} strokeLinecap="round" />
            </g>
          ))}
        {/* het vertrekpunt */}
        <circle cx={start.x} cy={start.y} r={9} fill={knopen[0]?.conquered ? 'url(#reis-hot)' : 'rgba(255,255,255,0.25)'} />
      </svg>
    )
  }, [knopen, hoogte])

  // bij openen: het volgende land rond 55% van het scherm zetten
  useLayoutEffect(() => {
    const el = scroller.current
    if (!el) return
    const doel = knopen.find((k) => k.isVolgende) ?? knopen[knopen.length - 1]
    if (!doel) return
    el.scrollTop = Math.max(0, doel.y - el.clientHeight * 0.55)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* sticky kop */}
      <div
        className="spread"
        style={{
          padding: '14px 16px',
          borderBottom: '1.5px solid var(--line)',
          background: 'rgba(14, 11, 31, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <button
          className="btn-quiet"
          style={{ minWidth: 44, minHeight: 44, fontSize: 21, lineHeight: 1 }}
          onClick={() => {
            sfx('tap')
            onBack()
          }}
          aria-label="Terug"
        >
          ←
        </button>
        <div className="center">
          <p className="eyebrow" style={{ fontSize: 10.5 }}>
            De Wereldreis
          </p>
          <p className="display" style={{ fontSize: 17 }}>
            {course.name}
          </p>
        </div>
        <span className="gold-text" style={{ fontWeight: 800, fontSize: 14, minWidth: 44, textAlign: 'right' }}>
          {veroverd}/{landen.length}
        </span>
      </div>

      {/* de kaart zelf */}
      <div ref={scroller} className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        <div style={{ position: 'relative', height: hoogte, maxWidth: 520, margin: '0 auto' }}>
          {kaart}

          {/* de actieve etappe vult live mee met je lesvoortgang */}
          {actief && !actief.rustpunt && (
            <svg
              viewBox={`0 0 ${BREEDTE} ${hoogte}`}
              width="100%"
              height={hoogte}
              preserveAspectRatio="none"
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              <defs>
                <linearGradient id="reis-actief" x1="0" y1="1" x2="0.6" y2="0">
                  <stop offset="0" stopColor="#EC4899" />
                  <stop offset="1" stopColor="#FFC53D" />
                </linearGradient>
              </defs>
              <motion.path
                ref={actiefPad}
                d={actief.d}
                fill="none"
                stroke="url(#reis-actief)"
                strokeWidth={6}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                initial={{ strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: 1 - actief.frac }}
                transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.25 }}
              />
            </svg>
          )}

          {/* jouw held, precies zo ver als je lessen reiken */}
          {held && (
            <div
              style={{
                position: 'absolute',
                left: `${(held.x / BREEDTE) * 100}%`,
                top: held.y,
                transform: 'translate(-50%, -88%)',
                pointerEvents: 'none',
                zIndex: 2,
                filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: -14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.35 }}
                style={actief?.naarLinks ? { transform: 'scaleX(-1)' } : undefined}
              >
                <Avatar size={84} mode="idle" level={level} courseId={course.id} look={look} />
              </motion.div>
            </div>
          )}

          {knopen.map((k) => {
            const resterend = Math.max(0, k.threshold - completedCount)
            return (
              <button
                key={k.code + k.threshold}
                aria-label={k.name}
                onClick={() => {
                  sfx('tap')
                  setGekozen(k)
                }}
                style={{
                  position: 'absolute',
                  left: `${(k.x / BREEDTE) * 100}%`,
                  top: k.y,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 130,
                  textAlign: 'center',
                }}
              >
                <div style={{ position: 'relative', width: 64, height: 64 }}>
                  {/* de amber ring die het volgende land laat lonken — de enige oneindige animatie op de kaart */}
                  {k.isVolgende && (
                    <motion.span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        inset: -7,
                        borderRadius: '50%',
                        border: '3px solid var(--gold)',
                      }}
                      animate={{ scale: [1, 1.22, 1], opacity: [0.9, 0.25, 0.9] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      background: k.conquered ? 'rgba(255, 197, 61, 0.16)' : 'var(--surface-2)',
                      border: k.conquered
                        ? '3px solid var(--gold)'
                        : k.isVolgende
                          ? '3px solid var(--gold)'
                          : '2.5px solid var(--line)',
                      boxShadow: k.conquered ? '0 0 22px rgba(255, 197, 61, 0.35)' : '0 3px 0 rgba(0,0,0,0.35)',
                      opacity: k.conquered || k.isVolgende ? 1 : 0.35,
                      filter: k.conquered || k.isVolgende ? undefined : 'grayscale(0.85)',
                    }}
                  >
                    <Flag code={k.code} size={40} />
                  </div>
                  {k.conquered && (
                    <span
                      style={{
                        position: 'absolute',
                        right: -3,
                        top: -3,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'var(--grad-gold)',
                        color: 'var(--ink-on-gold)',
                        fontSize: 13,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <p
                  style={{
                    marginTop: 7,
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: k.conquered ? 'var(--gold)' : k.isVolgende ? 'var(--text)' : 'var(--text-faint)',
                    textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  }}
                >
                  {k.name}
                </p>
                <p className="faint" style={{ fontSize: 10.5, marginTop: 1 }}>
                  {k.conquered
                    ? 'veroverd'
                    : !k.inCourse
                      ? '🔭 komt met nieuwe lessen'
                      : k.isVolgende
                        ? `nog ${resterend} ${resterend === 1 ? 'les' : 'lessen'}`
                        : `na ${k.threshold} lessen`}
                </p>
              </button>
            )
          })}

          {/* het vertrekbordje onderaan de reis */}
          <p
            className="faint"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: hoogte - 34,
              fontSize: 11,
              whiteSpace: 'nowrap',
            }}
          >
            ⛺ Hier begon jouw reis
          </p>
        </div>
      </div>

      {/* het land-paneel: per status een eigen verhaal, nooit een slot */}
      <AnimatePresence>
        {gekozen && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGekozen(null)}
            style={{ zIndex: 70 }}
          >
            <motion.div
              className="modal-panel"
              initial={{ y: 90 }}
              animate={{ y: 0 }}
              exit={{ y: 130 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ width: 44, height: 5, borderRadius: 999, background: 'var(--line)', margin: '0 auto 16px' }} />
              <div className="row" style={{ gap: 14, marginBottom: 12 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: gekozen.conquered ? '3px solid var(--gold)' : '2.5px solid var(--line)',
                    background: 'var(--surface-2)',
                    flexShrink: 0,
                    filter: gekozen.conquered || gekozen.isVolgende ? undefined : 'grayscale(0.7)',
                  }}
                >
                  <Flag code={gekozen.code} size={36} />
                </div>
                <div>
                  <h3 className="display" style={{ fontSize: 24 }}>
                    {gekozen.name}
                  </h3>
                  {gekozen.conquered ? (
                    <span
                      className="gold-text"
                      style={{ fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                    >
                      🏆 Veroverd
                    </span>
                  ) : (
                    <span className="dim" style={{ fontSize: 13 }}>
                      {gekozen.inCourse ? `Etappe ${gekozen.threshold} lessen` : 'Toekomstige bestemming'}
                    </span>
                  )}
                </div>
              </div>

              {gekozen.conquered ? (
                <p className="dim" style={{ fontSize: 14, marginBottom: 16 }}>
                  Dit land is van jou — veroverd na {gekozen.threshold} lessen. Jouw personage reisde hier doorheen op weg naar de
                  volgende bestemming.
                </p>
              ) : gekozen.isVolgende ? (
                <>
                  <p className="dim" style={{ fontSize: 14, marginBottom: 10 }}>
                    Jouw volgende bestemming. Nog{' '}
                    <strong style={{ color: 'var(--gold)' }}>
                      {Math.max(0, gekozen.threshold - completedCount)}{' '}
                      {gekozen.threshold - completedCount === 1 ? 'les' : 'lessen'}
                    </strong>{' '}
                    en de vlag van {gekozen.name} is van jou.
                  </p>
                  <div className="progress-track" style={{ height: 8, marginBottom: 16 }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(100, (completedCount / gekozen.threshold) * 100)}%` }}
                    />
                  </div>
                  {onVerderLeren && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: 15, fontSize: 15.5, marginBottom: 10 }}
                      onClick={() => {
                        sfx('tap')
                        setGekozen(null)
                        onVerderLeren()
                      }}
                    >
                      ▶ Verder leren →
                    </button>
                  )}
                </>
              ) : gekozen.inCourse ? (
                <p className="dim" style={{ fontSize: 14, marginBottom: 16 }}>
                  Deze bestemming ligt verderop langs de route — je bereikt haar na {gekozen.threshold} lessen. Eerst het land hiervoor
                  veroveren.
                </p>
              ) : (
                <p className="dim" style={{ fontSize: 14, marginBottom: 16 }}>
                  🔭 Dit land komt met nieuwe lessen — jouw wereld groeit vanzelf. Geen slot, alleen toekomst.
                </p>
              )}

              <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14 }} onClick={() => setGekozen(null)}>
                Terug naar de kaart
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
