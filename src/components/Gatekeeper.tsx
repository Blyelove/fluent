import { motion } from 'motion/react'
import { Flag } from './Flag'

/**
 * De Poortwachter: de eindbaas van elk land in De Wereldreis.
 *
 * Eén figuur voor alle 65 landen, want zijn schild draagt de vlag van het land
 * waar hij de poort van bewaakt. Zo krijgt elk land automatisch zijn eigen
 * baas, zonder 65 tekeningen.
 *
 * Hij kan je niets afnemen: er is geen levensbalk voor de speler. Alleen zijn
 * pantser gaat eraf, per goed antwoord één segment. Verliezen bestaat hier
 * niet, hooguit "nog niet".
 */
export function Gatekeeper({
  code,
  size = 150,
  /** 0-8: hoeveel pantsersegmenten er nog over zijn */
  pantser = 8,
  /** wiegt hij spottend na jouw misser? */
  spot = false,
  /** verslagen: helm gebogen, gloed dooft */
  verslagen = false,
}: {
  code: string
  size?: number
  pantser?: number
  spot?: boolean
  verslagen?: boolean
}) {
  return (
    <motion.div
      style={{ width: size, position: 'relative' }}
      animate={spot ? { rotate: [0, -5, 5, -3, 0] } : verslagen ? { rotate: 4, y: 6 } : { rotate: 0, y: 0 }}
      transition={{ duration: spot ? 0.55 : 0.5 }}
    >
      <svg viewBox="0 0 120 150" width={size} height={size * 1.25} aria-hidden="true" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gk-harnas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2A2440" />
            <stop offset="1" stopColor="#151129" />
          </linearGradient>
          <clipPath id="gk-schild">
            <circle cx="0" cy="0" r="21" />
          </clipPath>
        </defs>

        {/* cape achter hem, geeft massa */}
        <path
          d="M32 58 Q22 100 26 132 L94 132 Q98 100 88 58 Z"
          fill="#1A1533"
          stroke={verslagen ? 'rgba(34,211,238,0.2)' : 'rgba(34,211,238,0.45)'}
          strokeWidth={1.5}
        />

        {/* torso */}
        <path d="M38 60 L82 60 L86 118 L34 118 Z" fill="url(#gk-harnas)" stroke="rgba(34,211,238,0.55)" strokeWidth={2} />
        {/* borstplaat-lijnen */}
        <path d="M60 62 L60 116" stroke="rgba(34,211,238,0.35)" strokeWidth={1.5} />
        <path d="M42 78 L78 78" stroke="rgba(34,211,238,0.25)" strokeWidth={1.5} />

        {/* schouderstukken */}
        <path d="M30 58 Q26 68 32 76 L44 72 L42 56 Z" fill="#241E3C" stroke="rgba(34,211,238,0.5)" strokeWidth={1.5} />
        <path d="M90 58 Q94 68 88 76 L76 72 L78 56 Z" fill="#241E3C" stroke="rgba(34,211,238,0.5)" strokeWidth={1.5} />

        {/* helm met T-vizier */}
        <path d="M42 20 Q60 8 78 20 L78 46 Q60 56 42 46 Z" fill="url(#gk-harnas)" stroke="rgba(34,211,238,0.6)" strokeWidth={2} />
        <path d="M56 24 L64 24 L64 44 L56 44 Z" fill="#0A0818" />
        <path d="M46 26 L74 26 L74 33 L46 33 Z" fill="#0A0818" />
        {/* ogen: knipperen zolang hij nog staat */}
        {!verslagen && (
          <>
            <motion.rect
              x="49" y="28" width="7" height="4" rx="1.5" fill="#FFC53D"
              animate={{ opacity: [1, 1, 0.25, 1] }}
              transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.82, 0.88, 0.94] }}
            />
            <motion.rect
              x="64" y="28" width="7" height="4" rx="1.5" fill="#FFC53D"
              animate={{ opacity: [1, 1, 0.25, 1] }}
              transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.82, 0.88, 0.94] }}
            />
          </>
        )}
        {/* helmkam */}
        <path d="M60 8 L60 2" stroke="#EC4899" strokeWidth={3} strokeLinecap="round" />

        {/* het schild met de vlag van dit land */}
        <g transform="translate(30, 92)">
          <circle cx="0" cy="0" r="25" fill="#171232" stroke="rgba(255,197,61,0.75)" strokeWidth={3} />
          <g clipPath="url(#gk-schild)">
            <foreignObject x="-21" y="-21" width="42" height="42">
              <div style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flag code={code} size={42} />
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>

      {/* pantserbalk: acht segmenten die je eraf slaat */}
      <div className="row" style={{ gap: 4, justifyContent: 'center', marginTop: 6 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <motion.span
            key={i}
            animate={
              i < pantser
                ? { opacity: 1, y: 0, rotate: 0, scaleY: 1 }
                : { opacity: 0, y: -22, rotate: (i % 2 ? 1 : -1) * 40, scaleY: 0.6 }
            }
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            style={{
              width: 15,
              height: 9,
              borderRadius: 3,
              background: 'var(--grad-gold)',
              boxShadow: '0 1px 0 rgba(0,0,0,0.5)',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
