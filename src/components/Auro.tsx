import { motion } from 'motion/react'

/**
 * Auro — de gouden leeuw van Aurea. Groeit mee met je niveau:
 * 2 sjaal · 3 monocle · 4 kroontje · 5 cape · 6 glanzende manen ·
 * 7 medaille · 8 juwelenkroon · 9 gouden aura · 10 diamanten kroon
 * mode 'idle': rustig · 'run': rent · 'cheer': viert feest
 */
export function Auro({
  size = 120,
  mode = 'idle',
  level = 1,
  still = false,
}: {
  size?: number
  mode?: 'idle' | 'run' | 'cheer'
  level?: number
  /** true = direct volledig zichtbaar (voor print/galerij), geen intro-animatie */
  still?: boolean
}) {
  const running = mode === 'run'
  const cheering = mode === 'cheer'

  const hasScarf = level >= 2
  const hasMonocle = level >= 3
  const hasSmallCrown = level >= 4 && level < 8
  const hasCape = level >= 5
  const hasShinyMane = level >= 6
  const hasMedal = level >= 7
  const hasBigCrown = level >= 8
  const hasGlow = level >= 9
  const hasDiamond = level >= 10

  return (
    <motion.svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 200 160"
      initial={still ? false : { scale: 0, rotate: -8 }}
      animate={{
        scale: cheering ? [1, 1.07, 1] : 1,
        rotate: 0,
        y: running ? [0, -7, 0] : cheering ? [0, -4, 0] : 0,
      }}
      transition={{
        scale: cheering ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } : { type: 'spring', stiffness: 260, damping: 18 },
        y: { duration: running ? 0.32 : 0.7, repeat: running || cheering ? Infinity : 0, ease: 'easeInOut' },
      }}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="auro-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE08A" />
          <stop offset="55%" stopColor="#FFC53D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="auro-mane" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8A3D" />
          <stop offset="100%" stopColor="#E85D2A" />
        </linearGradient>
        <linearGradient id="auro-mane-shiny" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB25C" />
          <stop offset="100%" stopColor="#F07C33" />
        </linearGradient>
        <linearGradient id="auro-cape" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <radialGradient id="auro-glow-grad">
          <stop offset="0%" stopColor="#FFC53D" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#EC4899" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* gouden aura (niveau 9+) */}
      {hasGlow && (
        <motion.circle
          cx="92"
          cy="88"
          r="78"
          fill="url(#auro-glow-grad)"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* vaartlijnen bij rennen */}
      {running && (
        <motion.g animate={{ opacity: [0.5, 0.15, 0.5] }} transition={{ duration: 0.4, repeat: Infinity }}>
          <rect x="150" y="70" width="34" height="4" rx="2" fill="#D4AF6A" opacity="0.45" />
          <rect x="160" y="88" width="26" height="4" rx="2" fill="#D4AF6A" opacity="0.3" />
          <rect x="154" y="106" width="30" height="4" rx="2" fill="#D4AF6A" opacity="0.35" />
        </motion.g>
      )}

      {/* koninklijke cape (niveau 5+), achter het lijf */}
      {hasCape && (
        <motion.path
          d="M80 76 Q124 58 152 100 Q124 86 92 98 Z"
          fill="url(#auro-cape)"
          stroke="#D4AF6A"
          strokeWidth="1.6"
          animate={{ rotate: running ? [0, 4, 0] : [0, 1.5, 0] }}
          transition={{ duration: running ? 0.32 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '84px', originY: '80px' }}
        />
      )}

      {/* staart */}
      <motion.path
        d="M138 100 Q166 92 162 68"
        stroke="url(#auro-gold)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        animate={{ rotate: running ? [0, 9, 0] : [0, 4, 0] }}
        transition={{ duration: running ? 0.32 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '138px', originY: '100px' }}
      />

      {/* achterpoten */}
      <motion.rect
        x="118"
        y="112"
        width="11"
        height="30"
        rx="5.5"
        fill="url(#auro-mane)"
        animate={running ? { rotate: [24, -24, 24] } : {}}
        transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '123px', originY: '114px' }}
      />
      {/* lijf */}
      <ellipse cx="100" cy="102" rx="46" ry="30" fill="url(#auro-gold)" />
      <motion.rect
        x="100"
        y="114"
        width="11"
        height="30"
        rx="5.5"
        fill="url(#auro-gold)"
        animate={running ? { rotate: [-24, 24, -24] } : {}}
        transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '105px', originY: '116px' }}
      />

      {/* voorpoten */}
      <motion.rect
        x="70"
        y="114"
        width="10"
        height="28"
        rx="5"
        fill="url(#auro-mane)"
        animate={running ? { rotate: [-26, 26, -26] } : cheering ? { rotate: [-40, -60, -40] } : {}}
        transition={{ duration: running ? 0.32 : 0.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '75px', originY: '116px' }}
      />
      <motion.rect
        x="86"
        y="116"
        width="10"
        height="28"
        rx="5"
        fill="url(#auro-gold)"
        animate={running ? { rotate: [26, -26, 26] } : cheering ? { rotate: [40, 60, 40] } : {}}
        transition={{ duration: running ? 0.32 : 0.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '91px', originY: '118px' }}
      />

      {/* gouden medaille (niveau 7+) */}
      {hasMedal && (
        <g>
          <path d="M66 88 Q76 98 88 94" stroke="#B08D4C" strokeWidth="2" fill="none" />
          <circle cx="78" cy="97" r="6" fill="url(#auro-gold)" stroke="#8F7038" strokeWidth="1.2" />
          <path d="M78 93.5 l1.1 2.3 2.5 0.3 -1.8 1.7 0.5 2.5 -2.3 -1.2 -2.3 1.2 0.5 -2.5 -1.8 -1.7 2.5 -0.3 z" fill="#6E5426" />
        </g>
      )}

      {/* manen */}
      <motion.g
        animate={{ rotate: running ? 0 : [0, 2.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '58px', originY: '66px' }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={i}
            cx="58"
            cy="34"
            rx="10"
            ry="19"
            fill={hasShinyMane ? 'url(#auro-mane-shiny)' : 'url(#auro-mane)'}
            stroke={hasShinyMane ? '#EED9A0' : 'none'}
            strokeWidth={hasShinyMane ? 1.1 : 0}
            transform={`rotate(${i * 30} 58 66)`}
          />
        ))}
      </motion.g>

      {/* kop */}
      <circle cx="58" cy="66" r="25" fill="url(#auro-gold)" />
      {/* grote levendige ogen */}
      <ellipse cx="48" cy="60" rx="5.6" ry="6.6" fill="#FFFFFF" />
      <ellipse cx="67" cy="60" rx="5.6" ry="6.6" fill="#FFFFFF" />
      <motion.g
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.88, 0.94, 1] }}
        style={{ originX: '57px', originY: '60px' }}
      >
        <circle cx="49.5" cy="61.2" r="3.1" fill="#2B1A4D" />
        <circle cx="68.5" cy="61.2" r="3.1" fill="#2B1A4D" />
        <circle cx="50.7" cy="59.9" r="1.2" fill="#FFFFFF" />
        <circle cx="69.7" cy="59.9" r="1.2" fill="#FFFFFF" />
      </motion.g>
      {/* snuit met grote glimlach */}
      <ellipse cx="57" cy="78" rx="11" ry="7.5" fill="#FFE08A" />
      <path d="M53 73 L57 69.5 L61 73 L57 76 Z" fill="#E85D2A" />
      <path d="M50 80 Q57 85 64 80" stroke="#E85D2A" strokeWidth="2.4" strokeLinecap="round" fill="none" />

      {/* monocle (niveau 3+) */}
      {hasMonocle && (
        <g>
          <circle cx="48" cy="60" r="9.5" fill="rgba(255,255,255,0.07)" stroke="#FFE08A" strokeWidth="2.2" />
          <path d="M54 68 Q60 78 58 88" stroke="#FFC53D" strokeWidth="1.4" fill="none" />
        </g>
      )}

      {/* knalrode sjaal (niveau 2+) */}
      {hasScarf && (
        <motion.g
          animate={running ? { rotate: [0, 3, 0] } : {}}
          transition={{ duration: 0.32, repeat: Infinity }}
          style={{ originX: '70px', originY: '86px' }}
        >
          <path d="M64 84 Q78 97 96 90" stroke="#FF4D6D" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M64 84 Q78 97 96 90" stroke="#FFE08A" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" fill="none" />
          <path d="M72 90 L67 110" stroke="#FF4D6D" strokeWidth="8" strokeLinecap="round" />
          <path d="M67 108 L67 112" stroke="#FFE08A" strokeWidth="8" strokeLinecap="round" />
        </motion.g>
      )}

      {/* kroontje (niveau 4-7) */}
      {hasSmallCrown && (
        <motion.g
          animate={cheering ? { y: [0, -4, 0], rotate: [0, -6, 0] } : {}}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '62px', originY: '36px' }}
        >
          <path d="M50 42 L52 30 L59 37 L66 27 L73 37 L79 31 L80 44 Q65 49 50 42 Z" fill="#EED9A0" stroke="#B08D4C" strokeWidth="1.6" />
          <circle cx="66" cy="27" r="2.4" fill="#EED9A0" stroke="#B08D4C" strokeWidth="1" />
        </motion.g>
      )}

      {/* juwelenkroon (niveau 8+) */}
      {hasBigCrown && (
        <motion.g
          animate={cheering ? { y: [0, -4, 0], rotate: [0, -5, 0] } : {}}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '64px', originY: '32px' }}
        >
          <path d="M46 44 L48 20 L58 32 L66 14 L74 32 L84 20 L86 44 Q66 52 46 44 Z" fill="#EED9A0" stroke="#B08D4C" strokeWidth="1.8" />
          <rect x="47" y="40" width="38" height="7" rx="3" fill="#D4AF6A" stroke="#B08D4C" strokeWidth="1" />
          <circle cx="54" cy="43.5" r="2.6" fill="#C0392B" />
          <circle cx="66" cy="43.5" r="2.6" fill="#2E8B57" />
          <circle cx="78" cy="43.5" r="2.6" fill="#2E5FA3" />
          {hasDiamond && (
            <motion.path
              d="M66 4 L71 11 L66 20 L61 11 Z"
              fill="#E8F1F8"
              stroke="#9FBAD1"
              strokeWidth="1.2"
              animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '66px', originY: '12px' }}
            />
          )}
        </motion.g>
      )}

      {/* sparkles bij feest of hoge status */}
      {(cheering || hasDiamond) && (
        <motion.g animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.9, repeat: Infinity }}>
          <path d="M150 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#EED9A0" />
          <path d="M28 22 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#D4AF6A" />
          <path d="M172 90 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#D4AF6A" />
        </motion.g>
      )}
    </motion.svg>
  )
}
