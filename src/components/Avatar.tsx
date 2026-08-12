import { useId } from 'react'
import { motion } from 'motion/react'
import type { CourseId } from '../types'

/** De 8 kant-en-klare personages (a t/m h) — ook nog steeds de legacy-waarde in de store */
export type Look = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'

/** Vrij samen te stellen personage — 10×8×12×10×4×4×2 = ruim 300.000 combinaties */
export interface AvatarStyle {
  /** 0 kort · 1 lang · 2 krullen · 3 knot · 4 buzz · 5 staart · 6 afro · 7 hanekam · 8 kuif · 9 vlechten */
  hair: number
  skin: number
  hairColor: number
  outfit: number
  /** 0 geen · 1 bril · 2 oorbellen · 3 sproeten */
  extra?: number
  /** 0 man · 1 vrouw */
  gender?: number
  /** 0 glimlach · 1 brede lach · 2 kalm · 3 grijns */
  mouth?: number
}

export const GENDER_NAMES = ['Man', 'Vrouw']

/** index 2 licht · 3 medium · 5 bruin · 6 donker = de vier tinten van de vaste personages */
export const SKINS = ['#FFE4C8', '#FFDBB4', '#F2C094', '#D9A066', '#B07B4F', '#9C6644', '#6B4423', '#4A2E1C']
/** telkens ±15% donkerder dan de huidtint — voor schaduw, sproeten en wangen */
const SKIN_SHADES = ['#F5D2AC', '#EFC392', '#DFA672', '#C48A50', '#96613C', '#7E4E31', '#5B3A1E', '#38200F']
/** mondlijn per huidtint: donkerder bij lichte huid, juist lichter bij donkere huid — altijd leesbaar */
const MOUTH_LINES = ['#C4713A', '#BE6B33', '#B0672E', '#95511F', '#6E3616', '#5E2A0F', '#D0946A', '#BC7F53']
/** 0-6 natuurlijk · 7-11 geverfd (arcade-kleuren) */
export const HAIR_COLORS = [
  '#1E1611',
  '#3A2A1E',
  '#6B4423',
  '#A0522D',
  '#D9A441',
  '#9A93A8',
  '#F2F0F5',
  '#4FA3E3',
  '#F06AA8',
  '#4FC780',
  '#A855F7',
  '#22D3EE',
]
/** vanaf deze index is het haar duidelijk geverfd — wenkbrauwen blijven dan natuurlijk */
const DYED_FROM = 7
const NATURAL_BROW = '#4A3728'
export const OUTFIT_COLORS = ['#7C7694', '#3E5C9A', '#B33A4B', '#2E7D5B', '#8A5BB8', '#C77B3F', '#22D3EE', '#EC4899', '#E8CB2A', '#232733']
export const HAIR_STYLE_NAMES = ['Kort', 'Lang', 'Krullen', 'Knot', 'Buzz', 'Staart', 'Afro', 'Hanekam', 'Kuif', 'Vlechten']
export const EXTRA_NAMES = ['Geen', 'Bril', 'Oorbellen', 'Sproeten']
export const MOUTH_NAMES = ['Glimlach', 'Brede lach', 'Kalm', 'Grijns']
export const DEFAULT_PERSONA: AvatarStyle = { hair: 0, skin: 2, hairColor: 1, outfit: 0, extra: 0, gender: 0, mouth: 0 }

/**
 * De 8 vaste personages: 4 huidtinten (licht · medium · bruin · donker) × 2
 * haarstijlen (kort · lang). Elk personage heeft een eigen haarkleur en één
 * klein kenmerk (sproeten, bril, oorbellen) plus een eigen mondvorm.
 * a t/m d houden bewust de huidtint en haarstijl van de oude vier, zodat
 * bestaande accounts hun personage blijven herkennen.
 */
export const AVATAR_PRESETS: Record<Look, AvatarStyle> = {
  // licht + kort, donkerbruin haar — de standaard
  a: { hair: 0, skin: 2, hairColor: 1, outfit: 0, extra: 0, gender: 0, mouth: 0 },
  // licht + lang, blond haar en sproeten
  b: { hair: 1, skin: 2, hairColor: 4, outfit: 7, extra: 3, gender: 1, mouth: 1 },
  // bruin + kort, zwart haar met bril
  c: { hair: 0, skin: 5, hairColor: 0, outfit: 3, extra: 1, gender: 0, mouth: 0 },
  // bruin + lang, cyaan geverfd haar en oorbellen
  d: { hair: 1, skin: 5, hairColor: 11, outfit: 4, extra: 2, gender: 1, mouth: 3 },
  // medium + kort, roodbruin haar en sproeten
  e: { hair: 0, skin: 3, hairColor: 3, outfit: 5, extra: 3, gender: 0, mouth: 1 },
  // medium + lang, paars geverfd haar en oorbellen
  f: { hair: 1, skin: 3, hairColor: 10, outfit: 6, extra: 2, gender: 1, mouth: 2 },
  // donker + kort, platinawit haar met bril
  g: { hair: 0, skin: 6, hairColor: 6, outfit: 1, extra: 1, gender: 0, mouth: 3 },
  // donker + lang, zwart haar en oorbellen
  h: { hair: 1, skin: 6, hairColor: 0, outfit: 8, extra: 2, gender: 1, mouth: 1 },
}

/** Alle vaste personages op volgorde — schermen kunnen hierover itereren */
export const AVATAR_STYLES: Look[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

/** Nederlandse namen bij de acht personages, voor keuzeschermen */
export const AVATAR_STYLE_NAMES: Record<Look, string> = {
  a: 'Sem',
  b: 'Noor',
  c: 'Kian',
  d: 'Yara',
  e: 'Finn',
  f: 'Luna',
  g: 'Amir',
  h: 'Zara',
}

export function normalizePersona(p?: AvatarStyle | Look | null): AvatarStyle {
  // altijd een kopie teruggeven — anders kan een aanroeper per ongeluk
  // DEFAULT_PERSONA of een preset aanpassen en zijn alle personages stuk
  if (!p) return { ...DEFAULT_PERSONA }
  if (typeof p === 'string') return { ...(AVATAR_PRESETS[p] ?? DEFAULT_PERSONA) }
  const clamp = (v: number | undefined, max: number, fallback: number) =>
    typeof v === 'number' && v >= 0 && v <= max ? Math.floor(v) : fallback
  return {
    hair: clamp(p.hair, HAIR_STYLE_NAMES.length - 1, 0),
    skin: clamp(p.skin, SKINS.length - 1, 2),
    hairColor: clamp(p.hairColor, HAIR_COLORS.length - 1, 1),
    outfit: clamp(p.outfit, OUTFIT_COLORS.length - 1, 0),
    extra: clamp(p.extra, EXTRA_NAMES.length - 1, 0),
    gender: clamp(p.gender, 1, 0),
    mouth: clamp(p.mouth, MOUTH_NAMES.length - 1, 0),
  }
}

/**
 * Jouw personage — wordt per taal steeds meer "van die cultuur" naarmate je
 * niveau stijgt. Per niveau komt er iets bij:
 * 2 halsdoek · 3 hoofddeksel · 4 outfit · 5 attribuut · 6 zonnebril ·
 * 7 embleem · 8 vlaggen-cape · 9 gouden aura · 10 kroon + vlag ·
 * 11 gouden ketting · 12 neon-rand · 13 vuur-aura · 14 diamanten horloge ·
 * 15 platina kroon · 16 energievleugels · 17 bliksem · 18 sterrencape ·
 * 19 kosmische aura · 20 halo (het maximum, zie MAX_LEVEL in levels.ts)
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
  look = 'a',
  still = false,
  label,
}: {
  size?: number
  mode?: 'idle' | 'run' | 'cheer'
  level?: number
  courseId?: CourseId
  /** legacy: los personage a t/m h; nieuw: AvatarStyle-object uit de personage-maker */
  look?: AvatarStyle | Look
  /** Geen entree-animatie en geen sfeer-animaties (voor miniaturen en de galerij) */
  still?: boolean
  /** Voorleestekst; zonder label is het personage decoratief en slaat de schermlezer het over */
  label?: string
}) {
  // unieke id's per personage — anders botsen de gradiënten en het clip-pad
  // zodra er meerdere personages tegelijk op het scherm staan (galerij, maker)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  // courseId kan uit een gedeelde duel-link of uit oude opslag komen en dus
  // onzin zijn — dan vallen we terug op Spaans in plaats van te crashen
  const s: CourseStyle = STYLE[courseId] ?? STYLE.es
  // een negatieve of ontbrekende maat maakt de SVG ongeldig
  const w = typeof size === 'number' && size > 0 ? size : 120
  const p = normalizePersona(look)
  // bij `still` staan de eindeloze sfeer-animaties uit; 'run' en 'cheer' blijven wel bewegen
  const amb = <T,>(a: T): T | undefined => (still ? undefined : a)
  const lk = { skin: SKINS[p.skin], shade: SKIN_SHADES[p.skin], hair: HAIR_COLORS[p.hairColor] }
  // geverfd haar? dan houden we de wenkbrauwen natuurlijk — anders vervaagt het gezicht
  const browColor = p.hairColor >= DYED_FROM ? NATURAL_BROW : lk.hair
  const mouthLine = MOUTH_LINES[p.skin]
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
  const hasChain = level >= 11
  const hasNeon = level >= 12
  const hasFire = level >= 13
  const hasWatch = level >= 14
  const platinum = level >= 15
  const hasWings = level >= 16
  const hasLightning = level >= 17
  const starCape = level >= 18
  const cosmic = level >= 19
  const hasHalo = level >= 20

  const shirtFill = hasOutfit ? s.shirt : OUTFIT_COLORS[p.outfit]

  return (
    <motion.svg
      width={w}
      height={w * 1.15}
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
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={`av-glow-${uid}`}>
          <stop offset="0%" stopColor="#FFC53D" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#EC4899" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`av-cosmic-${uid}`}>
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#A855F7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`av-torso-${uid}`}>
          <rect x="68" y="106" width="64" height="66" rx="20" />
        </clipPath>
      </defs>

      {/* aura (niveau 9+; kosmisch vanaf 19) */}
      {hasGlow && (
        <motion.circle
          cx="100"
          cy="110"
          r="95"
          fill={cosmic ? `url(#av-cosmic-${uid})` : `url(#av-glow-${uid})`}
          animate={amb({ opacity: [0.7, 1, 0.7] })}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* vuur-aura (niveau 13+) */}
      {hasFire && (
        <motion.g
          animate={amb({ opacity: [0.65, 1, 0.65], scaleY: [1, 1.08, 1] })}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '100px', originY: '170px' }}
        >
          <ellipse cx="58" cy="148" rx="10" ry="28" fill="#FF8A3D" opacity="0.5" />
          <ellipse cx="142" cy="148" rx="10" ry="28" fill="#FF8A3D" opacity="0.5" />
          <ellipse cx="58" cy="140" rx="5" ry="17" fill="#FFC53D" opacity="0.75" />
          <ellipse cx="142" cy="140" rx="5" ry="17" fill="#FFC53D" opacity="0.75" />
        </motion.g>
      )}

      {/* energievleugels (niveau 16+) */}
      {hasWings && (
        <motion.g
          animate={amb({ rotate: [-4, 4, -4] })}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '100px', originY: '118px' }}
        >
          <path d="M70 112 Q26 84 24 126 Q42 146 70 134 Z" fill="#22D3EE" opacity="0.7" />
          <path d="M130 112 Q174 84 176 126 Q158 146 130 134 Z" fill="#A855F7" opacity="0.7" />
        </motion.g>
      )}

      {/* bliksem-aura (niveau 17+) */}
      {hasLightning && (
        <motion.g animate={amb({ opacity: [0, 1, 0] })} transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 0.7 }}>
          <path d="M38 94 l-7 13 h5 l-8 16" stroke="#FFE95E" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M164 90 l-7 13 h5 l-8 16" stroke="#FFE95E" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      )}

      {/* kosmische ster in een baan (niveau 19+) */}
      {cosmic && (
        <motion.g
          animate={amb({ rotate: 360 })}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '100px', originY: '110px' }}
        >
          <path d="M100 8 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" fill="#22D3EE" />
        </motion.g>
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
          animate={running ? { rotate: [0, 4, 0] } : amb({ rotate: [0, 1.5, 0] })}
          transition={{ duration: running ? 0.32 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '100px', originY: '110px' }}
        >
          <path d="M72 112 Q56 160 62 196 L138 196 Q144 160 128 112 Z" fill={s.c1} />
          <path d="M84 112 Q76 158 78 196 L122 196 Q124 158 116 112 Z" fill={s.c2} />
          <path d="M95 112 Q92 158 94 196 L106 196 Q108 158 105 112 Z" fill={s.c3} />
          {starCape && (
            <g opacity="0.95">
              <circle cx="74" cy="138" r="2" fill="#fff" />
              <circle cx="68" cy="168" r="1.6" fill="#fff" />
              <circle cx="80" cy="186" r="2" fill="#fff" />
              <circle cx="126" cy="142" r="2" fill="#fff" />
              <circle cx="132" cy="176" r="1.6" fill="#fff" />
              <circle cx="120" cy="190" r="2" fill="#fff" />
            </g>
          )}
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
      <ellipse cx="89" cy="209" rx="11" ry="6" fill="#2C2640" />
      <ellipse cx="111" cy="209" rx="11" ry="6" fill="#2C2640" />
      <ellipse cx="89" cy="213" rx="11.5" ry="2.6" fill="#E8E6F5" />
      <ellipse cx="111" cy="213" rx="11.5" ry="2.6" fill="#E8E6F5" />

      {/* armen */}
      <motion.rect
        x="56"
        y="112"
        width="13"
        height="46"
        rx="6.5"
        fill={shirtFill}
        animate={running ? { rotate: [-28, 28, -28] } : cheering ? { rotate: [-150, -170, -150] } : amb({ rotate: [0, 3, 0] })}
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
        animate={running ? { rotate: [28, -28, 28] } : cheering ? { rotate: [150, 170, 150] } : amb({ rotate: [0, -3, 0] })}
        transition={{ duration: running || cheering ? (running ? 0.32 : 0.7) : 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '137.5px', originY: '116px' }}
      />
      <circle cx="62" cy="158" r="7.5" fill={lk.skin} />
      <circle cx="138" cy="158" r="7.5" fill={lk.skin} />

      {/* diamanten horloge (niveau 14+) */}
      {hasWatch && (
        <g>
          <rect x="54" y="147" width="16" height="7" rx="3.5" fill="#FFD75E" />
          <circle cx="62" cy="150.5" r="4.2" fill="#E8F1F8" stroke="#D97706" strokeWidth="1.3" />
        </g>
      )}

      {/* torso */}
      <rect x="68" y="106" width="64" height="66" rx="20" fill={shirtFill} />
      <ellipse cx="100" cy="168" rx="30" ry="8" fill="rgba(0,0,0,0.16)" />
      <path d="M90 106 L100 116 L110 106 Z" fill="rgba(0,0,0,0.22)" />
      {hasOutfit && s.stripes && (
        <g clipPath={`url(#av-torso-${uid})`}>
          <rect x="68" y="114" width="64" height="9" fill={s.accent} />
          <rect x="68" y="132" width="64" height="9" fill={s.accent} />
          <rect x="68" y="150" width="64" height="9" fill={s.accent} />
        </g>
      )}
      {hasOutfit && !s.stripes && <rect x="68" y="106" width="64" height="10" rx="5" fill={s.accent} opacity="0.9" />}
      {/* neon-rand (niveau 12+) */}
      {hasNeon && (
        <>
          <rect x="68" y="106" width="64" height="66" rx="20" fill="none" stroke="#22D3EE" strokeWidth="2.5" opacity="0.95" />
          <rect x="66" y="104" width="68" height="70" rx="22" fill="none" stroke="#22D3EE" strokeWidth="1" opacity="0.4" />
        </>
      )}

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

      {/* gouden ketting (niveau 11+) */}
      {hasChain && (
        <g>
          <path d="M79 110 Q100 128 121 110" stroke="#FFD75E" strokeWidth="3.5" fill="none" />
          <circle cx="100" cy="126" r="6" fill="#FFD75E" stroke="#D97706" strokeWidth="1.5" />
          <path d="M100 122.5 l1.1 2.3 2.5 0.3 -1.8 1.7 0.5 2.5 -2.3 -1.2 -2.3 1.2 0.5 -2.5 -1.8 -1.7 2.5 -0.3 z" fill="#B45309" />
        </g>
      )}

      {/* hoofd */}
      <circle cx="100" cy="66" r="34" fill={lk.skin} />
      <path d="M126 44 A34 34 0 0 1 126 88 A44 44 0 0 0 126 44 Z" fill={lk.shade} opacity="0.4" />
      {/* haar — 10 stijlen, zie HAIR_STYLE_NAMES */}
      {p.hair === 0 && <path d="M66 62 Q66 30 100 30 Q134 30 134 62 Q126 44 100 44 Q74 44 66 62 Z" fill={lk.hair} />}
      {p.hair === 1 && (
        <g>
          <path d="M64 58 Q58 100 68 114 L80 106 Q71 84 73 58 Z" fill={lk.hair} />
          <path d="M136 58 Q142 100 132 114 L120 106 Q129 84 127 58 Z" fill={lk.hair} />
          <path d="M64 64 Q64 28 100 28 Q136 28 136 64 Q126 42 100 42 Q74 42 64 64 Z" fill={lk.hair} />
        </g>
      )}
      {p.hair === 2 && (
        <g>
          <circle cx="74" cy="46" r="12" fill={lk.hair} />
          <circle cx="92" cy="36" r="13" fill={lk.hair} />
          <circle cx="112" cy="38" r="13" fill={lk.hair} />
          <circle cx="128" cy="50" r="11" fill={lk.hair} />
          <circle cx="66" cy="60" r="9" fill={lk.hair} />
          <circle cx="134" cy="62" r="9" fill={lk.hair} />
        </g>
      )}
      {p.hair === 3 && (
        <g>
          <path d="M66 62 Q66 30 100 30 Q134 30 134 62 Q126 44 100 44 Q74 44 66 62 Z" fill={lk.hair} />
          <circle cx="100" cy="26" r="10" fill={lk.hair} />
          <rect x="92" y="32" width="16" height="4" rx="2" fill={s.accent} opacity="0.9" />
        </g>
      )}
      {p.hair === 4 && <path d="M68 52 Q100 26 132 52 Q100 38 68 52 Z" fill={lk.hair} opacity="0.95" />}
      {p.hair === 5 && (
        <g>
          <path d="M66 62 Q66 30 100 30 Q134 30 134 62 Q126 44 100 44 Q74 44 66 62 Z" fill={lk.hair} />
          <path d="M128 42 Q146 66 138 98 Q132 98 128 92 Q136 68 122 46 Z" fill={lk.hair} />
          <circle cx="128" cy="46" r="4" fill={s.accent} />
        </g>
      )}
      {p.hair === 6 && (
        <g>
          <circle cx="100" cy="38" r="30" fill={lk.hair} />
          <circle cx="72" cy="52" r="15" fill={lk.hair} />
          <circle cx="128" cy="52" r="15" fill={lk.hair} />
        </g>
      )}
      {p.hair === 7 && (
        <g>
          <path d="M70 52 Q100 40 130 52 Q100 46 70 52 Z" fill={lk.hair} opacity="0.85" />
          <path d="M86 44 L90 14 L96 42 L100 8 L106 42 L112 14 L116 44 Q100 50 86 44 Z" fill={lk.hair} />
        </g>
      )}
      {p.hair === 8 && (
        <g>
          <path d="M66 60 Q66 34 96 32 Q130 28 134 58 Q124 44 100 44 Q76 46 66 60 Z" fill={lk.hair} />
          <path d="M96 34 Q112 14 132 22 Q136 34 126 40 Q114 32 96 38 Z" fill={lk.hair} />
        </g>
      )}
      {p.hair === 9 && (
        <g>
          <path d="M66 62 Q66 30 100 30 Q134 30 134 62 Q126 44 100 44 Q74 44 66 62 Z" fill={lk.hair} />
          <circle cx="70" cy="76" r="7" fill={lk.hair} />
          <circle cx="68" cy="90" r="6.2" fill={lk.hair} />
          <circle cx="67" cy="103" r="5.4" fill={lk.hair} />
          <circle cx="130" cy="76" r="7" fill={lk.hair} />
          <circle cx="132" cy="90" r="6.2" fill={lk.hair} />
          <circle cx="133" cy="103" r="5.4" fill={lk.hair} />
          <circle cx="67" cy="110" r="2.6" fill={s.accent} />
          <circle cx="133" cy="110" r="2.6" fill={s.accent} />
        </g>
      )}
      {/* wenkbrauwen */}
      <rect x="80" y="52" width="14" height="3.5" rx="1.75" fill={browColor} transform="rotate(-4 87 54)" />
      <rect x="106" y="52" width="14" height="3.5" rx="1.75" fill={browColor} transform="rotate(4 113 54)" />
      {/* oren */}
      <circle cx="66" cy="68" r="6" fill={lk.skin} />
      <circle cx="134" cy="68" r="6" fill={lk.skin} />

      {/* ogen — het oogwit knippert mee, anders verdwijnen alleen de pupillen */}
      <motion.g
        animate={amb({ scaleY: [1, 1, 0.1, 1] })}
        transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.88, 0.94, 1] }}
        style={{ originX: '100px', originY: '66px' }}
      >
        <ellipse cx="87" cy="66" rx="7.5" ry="8.5" fill="#fff" />
        <ellipse cx="113" cy="66" rx="7.5" ry="8.5" fill="#fff" />
        <circle cx="89" cy="67.5" r="4" fill="#2B1A4D" />
        <circle cx="115" cy="67.5" r="4" fill="#2B1A4D" />
        <circle cx="90.5" cy="65.8" r="1.5" fill="#fff" />
        <circle cx="116.5" cy="65.8" r="1.5" fill="#fff" />
      </motion.g>
      {/* wimpers (vrouw) */}
      {p.gender === 1 && (
        <g stroke="#2B1A4D" strokeWidth="1.6" strokeLinecap="round">
          <path d="M79 59 L75 56" />
          <path d="M81 56.5 L78 53" />
          <path d="M121 59 L125 56" />
          <path d="M119 56.5 L122 53" />
        </g>
      )}
      {/* mond — 4 vormen, blijft ook op 56px leesbaar */}
      {p.mouth === 1 ? (
        <g>
          <path d="M87 82 Q100 98 113 82 Z" fill="#8E3B22" />
          <path d="M89.5 83.6 L110.5 83.6 Q100 89 89.5 83.6 Z" fill="#FFF8F2" />
        </g>
      ) : p.mouth === 2 ? (
        <path d="M91 85 Q100 89 109 85" stroke={mouthLine} strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : p.mouth === 3 ? (
        <path d="M88 85 Q100 93 112 79" stroke={mouthLine} strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M89 84 Q100 92 111 84" stroke={mouthLine} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      {/* blos */}
      <circle cx="76" cy="78" r="4.5" fill="#E89B6F" opacity="0.55" />
      <circle cx="124" cy="78" r="4.5" fill="#E89B6F" opacity="0.55" />

      {/* extra's: bril · oorbellen · sproeten */}
      {p.extra === 1 && !hasGlasses && (
        <g>
          <circle cx="87" cy="66" r="10" fill="none" stroke="#2B2436" strokeWidth="2.6" />
          <circle cx="113" cy="66" r="10" fill="none" stroke="#2B2436" strokeWidth="2.6" />
          <path d="M97 66 L103 66" stroke="#2B2436" strokeWidth="2.6" />
        </g>
      )}
      {p.extra === 2 && (
        <g>
          <circle cx="65" cy="76" r="3" fill="#FFD75E" stroke="#D97706" strokeWidth="1" />
          <circle cx="135" cy="76" r="3" fill="#FFD75E" stroke="#D97706" strokeWidth="1" />
        </g>
      )}
      {p.extra === 3 && (
        <g fill={lk.shade} opacity="0.85">
          <circle cx="79" cy="79" r="1.4" />
          <circle cx="85" cy="82" r="1.4" />
          <circle cx="91" cy="79" r="1.4" />
          <circle cx="109" cy="79" r="1.4" />
          <circle cx="115" cy="82" r="1.4" />
          <circle cx="121" cy="79" r="1.4" />
        </g>
      )}

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
          <path
            d="M76 40 L79 16 L91 28 L100 10 L109 28 L121 16 L124 40 Q100 49 76 40 Z"
            fill={platinum ? '#E8EDF5' : '#FFE08A'}
            stroke={platinum ? '#9FB2C8' : '#D97706'}
            strokeWidth="2"
          />
          <circle cx="86" cy="37" r="2.6" fill={s.c1} />
          <circle cx="100" cy="39" r="2.6" fill={s.c2} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
          <circle cx="114" cy="37" r="2.6" fill={s.c3} />
          {platinum && <path d="M100 0 L105 7 L100 15 L95 7 Z" fill="#E8F1F8" stroke="#9FBAD1" strokeWidth="1.2" />}
        </motion.g>
      )}

      {/* Legende-halo (niveau 20) */}
      {hasHalo && (
        <motion.ellipse
          cx="100"
          cy="2"
          rx="25"
          ry="6"
          fill="none"
          stroke="#FFE08A"
          strokeWidth="4.5"
          animate={amb({ y: [0, -4, 0], opacity: [0.8, 1, 0.8] })}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
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
        <motion.g animate={cheering ? { opacity: [0, 1, 0] } : amb({ opacity: [0, 1, 0] })} transition={{ duration: 0.9, repeat: Infinity }}>
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
    default:
      return null
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
    default:
      return null
  }
}
