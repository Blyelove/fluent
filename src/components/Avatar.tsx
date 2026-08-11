import { motion } from 'motion/react'
import type { CourseId } from '../types'

/**
 * Jouw personage — wordt per taal steeds meer "van die cultuur" naarmate je
 * niveau stijgt. Per niveau komt er een cultureel item bij:
 * 2 halsdoek · 3 hoofddeksel · 4 outfit · 5 attribuut · 6 zonnebril ·
 * 7 embleem · 8 vlaggen-cape · 9 gouden aura · 10 kroon + vlag
 */

interface CourseStyle {
  c1: string
  c2: string
  c3: string
  hat: 'cordobes' | 'beret' | 'tirol' | 'coppola' | 'bowler' | 'fisher'
  shirt: string
  accent: string
  stripes?: boolean
  item: 'guitar' | 'baguette' | 'pretzel' | 'pizza' | 'umbrella' | 'football'
}

const STYLE: Record<CourseId, CourseStyle> = {
  es: { c1: '#C60B1E', c2: '#FFC400', c3: '#C60B1E', hat: 'cordobes', shirt: '#C60B1E', accent: '#FFC400', item: 'guitar' },
  fr: { c1: '#0055A4', c2: '#FFFFFF', c3: '#EF4135', hat: 'beret', shirt: '#F4F1E8', accent: '#0055A4', stripes: true, item: 'baguette' },
  de: { c1: '#1A1A1A', c2: '#DD0000', c3: '#FFCE00', hat: 'tirol', shirt: '#2E5E3A', accent: '#FFCE00', item: 'pretzel' },
  it: { c1: '#009246', c2: '#FFFFFF', c3: '#CE2B37', hat: 'coppola', shirt: '#F5F2EA', accent: '#009246', item: 'pizza' },
  en: { c1: '#012169', c2: '#FFFFFF', c3: '#C8102E', hat: 'bowler', shirt: '#5B6C8F', accent: '#C8102E', item: 'umbrella' },
  pt: { c1: '#046A38', c2: '#FFE900', c3: '#DA291C', hat: 'fisher', shirt: '#DA291C', accent: '#046A38', item: 'football' },
}

export function Avatar({
  size = 120,
  mode = 'idle',
  level = 1,
  courseId = 'es',
  still = false,
}: {
  size?: number
  mode?: 'idle' | 'run' | 'cheer'
  level?: number
  courseId?: CourseId
  still?: boolean
}) {
  const s = STYLE[courseId]
  const running = mode === 'run'
  const cheering = mode === 'cheer'

  const hasScarf = level >= 2
  const hasHat = level >= 3
  const hasOutfit = level >= 4
  const hasItem = level >= 5
  const hasGlasses = level >= 6
  const hasBadge = level >= 7
  const hasCape = level >= 8
  const hasGlow = level >= 9
  const hasCrown = level >= 10

  const shirtFill = hasOutfit ? s.shirt : '#7C7694'

  return (
    <motion.svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 200 230"
      initial={still ? false : { scale: 0, rotate: -6 }}
      animate={{
        scale: cheering ? [1, 1.06, 1] : 1,
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
        <radialGradient id={`av-glow-${courseId}`}>
          <stop offset="0%" stopColor="#FFC53D" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#EC4899" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`av-torso-${courseId}`}>
          <rect x="68" y="106" width="64" height="66" rx="20" />
        </clipPath>
      </defs>

      {/* gouden aura (niveau 9+) */}
      {hasGlow && (
        <motion.circle
          cx="100"
          cy="110"
          r="95"
          fill={`url(#av-glow-${courseId})`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* vaartlijnen bij rennen */}
      {running && (
        <motion.g animate={{ opacity: [0.5, 0.15, 0.5] }} transition={{ duration: 0.4, repeat: Infinity }}>
          <rect x="8" y="90" width="30" height="4" rx="2" fill="#EC4899" opacity="0.5" />
          <rect x="2" y="112" width="24" height="4" rx="2" fill="#A855F7" opacity="0.4" />
          <rect x="10" y="134" width="28" height="4" rx="2" fill="#EC4899" opacity="0.45" />
        </motion.g>
      )}

      {/* vlaggen-cape (niveau 8+), achter het lijf */}
      {hasCape && (
        <motion.g
          animate={{ rotate: running ? [0, 4, 0] : [0, 1.5, 0] }}
          transition={{ duration: running ? 0.32 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '100px', originY: '110px' }}
        >
          <path d="M72 112 Q56 160 62 196 L138 196 Q144 160 128 112 Z" fill={s.c1} />
          <path d="M84 112 Q76 158 78 196 L122 196 Q124 158 116 112 Z" fill={s.c2} />
          <path d="M95 112 Q92 158 94 196 L106 196 Q108 158 105 112 Z" fill={s.c3} />
        </motion.g>
      )}

      {/* benen */}
      <motion.rect
        x="82"
        y="166"
        width="14"
        height="42"
        rx="7"
        fill="#3D3654"
        animate={running ? { rotate: [22, -22, 22] } : {}}
        transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '89px', originY: '170px' }}
      />
      <motion.rect
        x="104"
        y="166"
        width="14"
        height="42"
        rx="7"
        fill="#332C48"
        animate={running ? { rotate: [-22, 22, -22] } : {}}
        transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '111px', originY: '170px' }}
      />
      <ellipse cx="89" cy="211" rx="11" ry="6" fill="#241E38" />
      <ellipse cx="111" cy="211" rx="11" ry="6" fill="#241E38" />

      {/* armen */}
      <motion.rect
        x="56"
        y="112"
        width="13"
        height="46"
        rx="6.5"
        fill={shirtFill}
        animate={running ? { rotate: [-28, 28, -28] } : cheering ? { rotate: [-150, -170, -150] } : { rotate: [0, 3, 0] }}
        transition={{ duration: running || cheering ? (running ? 0.32 : 0.7) : 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '62.5px', originY: '116px' }}
      />
      <motion.rect
        x="131"
        y="112"
        width="13"
        height="46"
        rx="6.5"
        fill={shirtFill}
        animate={running ? { rotate: [28, -28, 28] } : cheering ? { rotate: [150, 170, 150] } : { rotate: [0, -3, 0] }}
        transition={{ duration: running || cheering ? (running ? 0.32 : 0.7) : 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '137.5px', originY: '116px' }}
      />
      <circle cx="62" cy="158" r="7.5" fill="#F2C094" />
      <circle cx="138" cy="158" r="7.5" fill="#F2C094" />

      {/* torso */}
      <rect x="68" y="106" width="64" height="66" rx="20" fill={shirtFill} />
      {hasOutfit && s.stripes && (
        <g clipPath={`url(#av-torso-${courseId})`}>
          <rect x="68" y="114" width="64" height="9" fill={s.accent} />
          <rect x="68" y="132" width="64" height="9" fill={s.accent} />
          <rect x="68" y="150" width="64" height="9" fill={s.accent} />
        </g>
      )}
      {hasOutfit && !s.stripes && <rect x="68" y="106" width="64" height="10" rx="5" fill={s.accent} opacity="0.9" />}

      {/* vlag-embleem op de borst (niveau 7+) */}
      {hasBadge && (
        <g>
          <rect x="80" y="124" width="18" height="12" rx="2.5" fill={s.c2} stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
          <rect x="80" y="124" width="6" height="12" fill={s.c1} />
          <rect x="92" y="124" width="6" height="12" fill={s.c3} />
        </g>
      )}

      {/* halsdoek (niveau 2+) */}
      {hasScarf && (
        <g>
          <path d="M74 102 Q100 118 126 102 L122 112 Q100 124 78 112 Z" fill={s.c1} />
          <path d="M96 114 L91 136 L103 132 Z" fill={s.c1} />
          <circle cx="86" cy="107" r="1.8" fill={s.c2} />
          <circle cx="100" cy="112" r="1.8" fill={s.c2} />
          <circle cx="114" cy="107" r="1.8" fill={s.c2} />
        </g>
      )}

      {/* hoofd */}
      <circle cx="100" cy="66" r="34" fill="#F2C094" />
      {/* haar */}
      <path d="M66 62 Q66 30 100 30 Q134 30 134 62 Q126 44 100 44 Q74 44 66 62 Z" fill="#3A2A1E" />
      {/* oren */}
      <circle cx="66" cy="68" r="6" fill="#F2C094" />
      <circle cx="134" cy="68" r="6" fill="#F2C094" />

      {/* ogen */}
      <ellipse cx="87" cy="66" rx="7.5" ry="8.5" fill="#fff" />
      <ellipse cx="113" cy="66" rx="7.5" ry="8.5" fill="#fff" />
      <motion.g
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.88, 0.94, 1] }}
        style={{ originX: '100px', originY: '66px' }}
      >
        <circle cx="89" cy="67.5" r="4" fill="#2B1A4D" />
        <circle cx="115" cy="67.5" r="4" fill="#2B1A4D" />
        <circle cx="90.5" cy="65.8" r="1.5" fill="#fff" />
        <circle cx="116.5" cy="65.8" r="1.5" fill="#fff" />
      </motion.g>
      {/* mond */}
      <path d="M89 84 Q100 92 111 84" stroke="#B0672E" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* blos */}
      <circle cx="76" cy="78" r="4.5" fill="#E89B6F" opacity="0.55" />
      <circle cx="124" cy="78" r="4.5" fill="#E89B6F" opacity="0.55" />

      {/* zonnebril (niveau 6+) */}
      {hasGlasses && (
        <g>
          <rect x="78" y="59" width="19" height="13" rx="5" fill="#1C1631" opacity="0.92" />
          <rect x="103" y="59" width="19" height="13" rx="5" fill="#1C1631" opacity="0.92" />
          <rect x="96" y="63" width="8" height="3" rx="1.5" fill="#1C1631" />
          <rect x="80" y="61" width="7" height="3" rx="1.5" fill="#4A4470" opacity="0.8" />
          <rect x="105" y="61" width="7" height="3" rx="1.5" fill="#4A4470" opacity="0.8" />
        </g>
      )}

      {/* hoofddeksel (niveau 3+) */}
      {hasHat && !hasCrown && <Hat type={s.hat} />}

      {/* kroon (niveau 10) */}
      {hasCrown && (
        <motion.g
          animate={cheering ? { y: [0, -4, 0], rotate: [0, -5, 0] } : {}}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '100px', originY: '30px' }}
        >
          <path d="M76 40 L79 16 L91 28 L100 10 L109 28 L121 16 L124 40 Q100 49 76 40 Z" fill="#FFE08A" stroke="#D97706" strokeWidth="2" />
          <circle cx="86" cy="37" r="2.6" fill={s.c1} />
          <circle cx="100" cy="39" r="2.6" fill={s.c2} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
          <circle cx="114" cy="37" r="2.6" fill={s.c3} />
        </motion.g>
      )}

      {/* attribuut in de hand (niveau 5+) */}
      {hasItem && (
        <motion.g
          animate={cheering ? { rotate: [0, 10, 0] } : {}}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '138px', originY: '158px' }}
        >
          <HandItem type={s.item} />
        </motion.g>
      )}

      {/* vlaggetje in de andere hand (niveau 10) */}
      {hasCrown && (
        <g>
          <rect x="59" y="120" width="2.5" height="40" fill="#8A8398" />
          <rect x="61.5" y="120" width="20" height="13" fill={s.c1} />
          <rect x="68" y="120" width="7" height="13" fill={s.c2} />
          <rect x="75" y="120" width="6.5" height="13" fill={s.c3} />
        </g>
      )}

      {/* sparkles bij feest of maximale status */}
      {(cheering || hasCrown) && (
        <motion.g animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.9, repeat: Infinity }}>
          <path d="M158 34 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#FFE08A" />
          <path d="M36 26 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#EC4899" />
          <path d="M170 110 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#22D3EE" />
        </motion.g>
      )}
    </motion.svg>
  )
}

function Hat({ type }: { type: CourseStyle['hat'] }) {
  switch (type) {
    case 'cordobes':
      return (
        <g>
          <ellipse cx="100" cy="41" rx="38" ry="8" fill="#23202B" />
          <rect x="82" y="24" width="36" height="18" rx="8" fill="#23202B" />
          <rect x="82" y="35" width="36" height="5" fill="#C60B1E" />
        </g>
      )
    case 'beret':
      return (
        <g>
          <ellipse cx="98" cy="35" rx="30" ry="12" fill="#B3232E" transform="rotate(-6 98 35)" />
          <circle cx="98" cy="24" r="3" fill="#7E1922" />
        </g>
      )
    case 'tirol':
      return (
        <g>
          <path d="M70 42 Q100 8 130 42 Q100 50 70 42 Z" fill="#2E5E3A" />
          <rect x="72" y="37" width="56" height="6" rx="3" fill="#1F4128" />
          <path d="M120 20 Q132 8 138 14 Q130 20 124 28 Z" fill="#FFCE00" />
        </g>
      )
    case 'coppola':
      return (
        <g>
          <path d="M66 44 Q70 22 100 22 Q130 22 134 44 Q100 36 66 44 Z" fill="#4A3B2A" />
          <path d="M96 40 Q116 36 136 42 Q118 48 98 46 Z" fill="#3A2E20" />
        </g>
      )
    case 'bowler':
      return (
        <g>
          <ellipse cx="100" cy="42" rx="40" ry="7" fill="#22252B" />
          <path d="M74 42 Q74 16 100 16 Q126 16 126 42 Z" fill="#22252B" />
          <rect x="74" y="35" width="52" height="5" fill="#3A3F49" />
        </g>
      )
    case 'fisher':
      return (
        <g>
          <path d="M72 42 Q72 18 100 18 Q128 18 128 42 Z" fill="#1F2A44" />
          <rect x="70" y="38" width="60" height="9" rx="4.5" fill="#2C3B5E" />
        </g>
      )
  }
}

function HandItem({ type }: { type: CourseStyle['item'] }) {
  switch (type) {
    case 'guitar':
      return (
        <g>
          <rect x="143" y="108" width="4" height="34" rx="2" fill="#6B4B2A" transform="rotate(18 145 125)" />
          <circle cx="152" cy="152" r="14" fill="#B3763C" />
          <circle cx="152" cy="152" r="5.5" fill="#4A3018" />
          <rect x="150" y="118" width="7" height="5" fill="#4A3018" transform="rotate(18 153 120)" />
        </g>
      )
    case 'baguette':
      return (
        <g transform="rotate(-32 142 148)">
          <rect x="132" y="140" width="52" height="13" rx="6.5" fill="#D9A45B" />
          <path d="M142 143 L146 150 M152 142 L156 149 M162 141 L166 148" stroke="#A9763B" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )
    case 'pretzel':
      return (
        <g>
          <circle cx="152" cy="148" r="13" fill="none" stroke="#9A5B24" strokeWidth="7" />
          <path d="M145 143 Q152 155 159 143" stroke="#9A5B24" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="147" cy="141" r="1.3" fill="#F4E3C4" />
          <circle cx="156" cy="140" r="1.3" fill="#F4E3C4" />
          <circle cx="152" cy="157" r="1.3" fill="#F4E3C4" />
        </g>
      )
    case 'pizza':
      return (
        <g transform="rotate(12 150 148)">
          <path d="M138 136 L166 142 L142 164 Z" fill="#F2C879" stroke="#D99C43" strokeWidth="2" />
          <circle cx="149" cy="145" r="2.6" fill="#C0392B" />
          <circle cx="146" cy="153" r="2.2" fill="#C0392B" />
          <circle cx="155" cy="149" r="2.2" fill="#C0392B" />
        </g>
      )
    case 'umbrella':
      return (
        <g>
          <path d="M134 132 Q152 118 170 132 Q164 128 158 132 Q152 127 146 132 Q140 128 134 132 Z" fill="#C8102E" />
          <rect x="150.5" y="130" width="3" height="30" rx="1.5" fill="#4A4470" />
          <path d="M151 160 Q151 166 157 164" stroke="#4A4470" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'football':
      return (
        <g>
          <circle cx="152" cy="150" r="13" fill="#fff" stroke="#C9C4D8" strokeWidth="1.5" />
          <path d="M152 143 l5.5 4 -2 6.5 -7 0 -2 -6.5 z" fill="#22252B" />
          <circle cx="144" cy="145" r="2.2" fill="#22252B" />
          <circle cx="160" cy="145" r="2.2" fill="#22252B" />
          <circle cx="146" cy="158" r="2.2" fill="#22252B" />
          <circle cx="158" cy="158" r="2.2" fill="#22252B" />
        </g>
      )
  }
}
