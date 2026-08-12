import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import confetti from 'canvas-confetti'
import type { Course } from '../types'
import { countryStates, etappeFrac, type CountryState } from '../countries'
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
  const renPad = useRef<SVGPathElement | null>(null)
  const look = useStore((s) => s.avatarLook)
  const level = useStore((s) => levelForXp(totalXp(s)))
  const worldSeen = useStore((s) => s.worldSeen)
  const markWorldSeen = useStore((s) => s.markWorldSeen)
  const kalm = Boolean(useReducedMotion())

  const landen = useMemo(() => countryStates(course, completedCount), [course, completedCount])
  const hoogte = KOP + VOET + Math.max(1, landen.length - 1) * STAP + 80
  const knopen = useMemo(() => bouwKnopen(landen, hoogte), [landen, hoogte])
  const veroverd = landen.filter((c) => c.conquered).length

  /**
   * De veroveringsviering: is er sinds je laatste bezoek een land bij gekomen,
   * dan rent je held bij het openen over de etappe naar het nieuwe land.
   * Eerste bezoek (nog niets bijgehouden)? Dan stil beginnen — we vieren geen
   * geschiedenis, alleen het moment zelf.
   */
  const gezien = worldSeen[course.id]
  const viering = useMemo(() => {
    if (gezien === undefined || veroverd <= gezien || kalm) return null
    const nieuw = knopen.filter((k) => k.conquered).slice(-1)[0]
    if (!nieuw) return null
    const idx = knopen.indexOf(nieuw)
    const van = idx > 0 ? knopen[idx - 1] : { x: knopen[0]?.x ?? BREEDTE / 2, y: hoogte - 52 }
    return { d: bocht(van, nieuw), doel: nieuw }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /** het nieuwe land blijft grijs tot de held aankomt */
  const [onthuld, setOnthuld] = useState(viering === null)
  const [rennen, setRennen] = useState(viering !== null)
  const [banner, setBanner] = useState<string | null>(null)
  const knoopRefs = useRef<Record<string, HTMLButtonElement | null>>({})

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
    // zelfde meting als het landpaneel gebruikt, uit één bron
    const frac = etappeFrac(landen, doel, completedCount)
    return { d: bocht(van, doel), frac, rustpunt: null, naarLinks: doel.x < van.x }
  }, [knopen, hoogte, completedCount, landen])

  /**
   * De positie van de held loopt via motion-waarden BUITEN React om: tijdens
   * de veroveringsrun verandert hij 60 keer per seconde, en een re-render van
   * de hele kaart per frame zou zichtbaar haperen. mx is in ontwerp-pixels
   * (0-375) en wordt in de stijl geschaald naar containerbreedte.
   */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const kaartVak = useRef<HTMLDivElement | null>(null)
  const [heldKlaar, setHeldKlaar] = useState(false)
  const naarPx = (vx: number) => ((kaartVak.current?.clientWidth ?? BREEDTE) * vx) / BREEDTE

  const zetHeld = (p: { x: number; y: number }) => {
    mx.set(naarPx(p.x))
    my.set(p.y)
    setHeldKlaar(true)
  }

  /** rustpositie: zo ver op de actieve etappe als je lessen reiken */
  const rustpunt = (): { x: number; y: number } | null => {
    if (!actief) return null
    if (actief.rustpunt) return actief.rustpunt
    const pad = actiefPad.current
    if (!pad) return null
    const punt = pad.getPointAtLength(actief.frac * pad.getTotalLength())
    return { x: punt.x, y: punt.y }
  }

  useLayoutEffect(() => {
    if (viering) return // de viering zet de held zelf neer
    const p = rustpunt()
    if (p) zetHeld(p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actief, viering])

  // de veroveringsrun: held rent vloeiend over de etappe, vlag klapt open, confetti
  useEffect(() => {
    if (!viering) return
    const pad = renPad.current
    if (!pad) return
    const lengte = pad.getTotalLength()
    zetHeld(pad.getPointAtLength(0))
    let vervolg: ReturnType<typeof animate> | null = null
    const timer = window.setTimeout(() => {
      const ctrl = animate(0, 1, {
        duration: 2.4,
        ease: 'easeInOut',
        onUpdate: (v) => {
          const punt = pad.getPointAtLength(v * lengte)
          mx.set(naarPx(punt.x))
          my.set(punt.y)
        },
        onComplete: () => {
          setRennen(false)
          setOnthuld(true)
          sfx('complete')
          setBanner(`${viering.doel.name} veroverd!`)
          markWorldSeen(course.id, veroverd)
          // confetti precies vanaf de knoop, in schermfracties
          const el = knoopRefs.current[viering.doel.code + viering.doel.threshold]
          const r = el?.getBoundingClientRect()
          confetti({
            particleCount: 130,
            spread: 85,
            startVelocity: 32,
            origin: r
              ? { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + 32) / window.innerHeight }
              : { y: 0.4 },
            colors: ['#A855F7', '#EC4899', '#FFC53D', '#22D3EE'],
            disableForReducedMotion: true,
          })
          // daarna wandelt de held rustig door naar zijn plek op de volgende etappe
          window.setTimeout(() => {
            setBanner(null)
            const doorPad = actiefPad.current
            if (doorPad && actief && !actief.rustpunt && actief.frac > 0) {
              const doorLengte = doorPad.getTotalLength()
              vervolg = animate(0, actief.frac, {
                duration: 0.9,
                ease: 'easeInOut',
                onUpdate: (v) => {
                  const punt = doorPad.getPointAtLength(v * doorLengte)
                  mx.set(naarPx(punt.x))
                  my.set(punt.y)
                },
              })
            } else {
              const p = rustpunt()
              if (p) zetHeld(p)
            }
          }, 2600)
        },
      })
      return () => ctrl.stop()
    }, 700)
    return () => {
      window.clearTimeout(timer)
      vervolg?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // wie geen viering krijgt maar de kaart voor het eerst opent: stand vastleggen
  useEffect(() => {
    if (gezien === undefined || (gezien < veroverd && kalm)) markWorldSeen(course.id, veroverd)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // bij openen: het volgende land (of het gevierde land) rond 55% van het scherm
  useLayoutEffect(() => {
    const el = scroller.current
    if (!el) return
    const doel = viering?.doel ?? knopen.find((k) => k.isVolgende) ?? knopen[knopen.length - 1]
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
                transition={{ duration: 0.9, ease: 'easeInOut', delay: viering ? 3.4 : 0.25 }}
              />
              {/* onzichtbaar meetpad voor de veroveringsrun */}
              {viering && <path ref={renPad} d={viering.d} fill="none" stroke="none" />}
            </svg>
          )}

          {/* jouw held — positie via motion-waarden, buiten React om (vloeiend op 60fps) */}
          {heldKlaar && (
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                x: mx,
                y: my,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <div style={{ transform: 'translate(-50%, -88%)', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.35 }}
                  style={actief?.naarLinks && !rennen ? { transform: 'scaleX(-1)' } : undefined}
                >
                  <Avatar size={84} mode={rennen ? 'run' : 'idle'} level={level} courseId={course.id} look={look} />
                </motion.div>
              </div>
            </motion.div>
          )}

          {knopen.map((k) => {
            const resterend = Math.max(0, k.threshold - completedCount)
            // het net veroverde land blijft grijs tot de held aankomt
            const verborgen = !!viering && !onthuld && viering.doel === k
            const alsVeroverd = k.conquered && !verborgen
            return (
              <button
                key={k.code + k.threshold}
                ref={(el) => {
                  knoopRefs.current[k.code + k.threshold] = el
                }}
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
                  <motion.div
                    key={alsVeroverd ? 'open' : 'dicht'}
                    initial={alsVeroverd && verborgen === false && viering?.doel === k ? { scale: 0.5 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      background: alsVeroverd ? 'rgba(255, 197, 61, 0.16)' : 'var(--surface-2)',
                      border: alsVeroverd
                        ? '3px solid var(--gold)'
                        : k.isVolgende
                          ? '3px solid var(--gold)'
                          : '2.5px solid var(--line)',
                      boxShadow: alsVeroverd ? '0 0 22px rgba(255, 197, 61, 0.35)' : '0 3px 0 rgba(0,0,0,0.35)',
                      // verte blijft herkenbaar: te grijs oogt als een kapotte
                      // afbeelding in plaats van als een bestemming die wacht
                      opacity: alsVeroverd || k.isVolgende ? 1 : 0.62,
                      filter: alsVeroverd || k.isVolgende ? undefined : 'grayscale(0.45) brightness(0.85)',
                      transition: 'background 0.4s ease, border 0.4s ease, opacity 0.4s ease, filter 0.4s ease',
                    }}
                  >
                    <Flag code={k.code} size={40} />
                  </motion.div>
                  {alsVeroverd && (
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
                    color: alsVeroverd ? 'var(--gold)' : k.isVolgende ? 'var(--text)' : 'var(--text-faint)',
                    textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  }}
                >
                  {k.name}
                </p>
                <p className="faint" style={{ fontSize: 10.5, marginTop: 1 }}>
                  {alsVeroverd
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

      {/* altijd één zichtbare hoofdactie: de kaart is een vertrekpunt, geen museum */}
      {onVerderLeren && !gekozen && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 26 }}
          style={{
            padding: '12px 16px calc(14px + env(safe-area-inset-bottom, 0px))',
            borderTop: '1.5px solid var(--line)',
            background: 'rgba(14, 11, 31, 0.94)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <button
            className="btn btn-primary"
            style={{ padding: 15, fontSize: 15.5 }}
            onClick={() => {
              sfx('tap')
              onVerderLeren()
            }}
          >
            {(() => {
              const doel = knopen.find((k) => k.isVolgende)
              if (!doel) return '▶ Verder leren'
              const rest = Math.max(0, doel.threshold - completedCount)
              return `▶ Verder leren — nog ${rest} ${rest === 1 ? 'les' : 'lessen'} tot ${doel.name}`
            })()}
          </button>
        </motion.div>
      )}

      {/* de veroveringsbanner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -26, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              position: 'absolute',
              top: 86,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 65,
              padding: '12px 22px',
              borderRadius: 999,
              background: 'var(--grad-hot)',
              boxShadow: '0 6px 26px rgba(168, 85, 247, 0.55)',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="display" style={{ fontSize: 17, color: '#fff' }}>
              🏆 {banner}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
                      style={{ width: `${Math.round(etappeFrac(landen, gekozen, completedCount) * 100)}%` }}
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
                  🔭 Dit land komt met nieuwe lessen. Jouw wereld groeit vanzelf: geen slot, alleen toekomst.
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
