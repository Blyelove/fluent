/**
 * De gezichtstrekken van je personage, elk met acht varianten.
 *
 * Hiervoor bestonden alleen haar, huid, outfit en mond, en dan lijkt iedereen
 * op elkaar: twee mensen met dezelfde haarkleur waren niet uit elkaar te
 * houden. Een gezicht wordt herkenbaar van de vórm ervan, de ogen, de
 * wenkbrauwen en de neus, en die waren er niet of maar in één soort.
 *
 * Alles wordt getekend binnen dezelfde omtrek: de kruin blijft op y 32 en de
 * breedte op x 66 tot 134. Dat is geen detail maar de voorwaarde, want alle
 * tien de haarstijlen, de oren, de hoeden en de brillen zijn op die maten
 * getekend. Wat varieert is de kaak, de kin en wat erin staat.
 */
import type { ReactNode } from 'react'

export const GEZICHT_NAMEN = ['Rond', 'Ovaal', 'Hart', 'Vierkant', 'Lang', 'Breed', 'Spits', 'Zacht']
export const OOG_NAMEN = ['Rond', 'Amandel', 'Groot', 'Smal', 'Opgewekt', 'Dromerig', 'Scherp', 'Wijd']
export const BROW_NAMEN = ['Recht', 'Gebogen', 'Dik', 'Dun', 'Hoog', 'Laag', 'Schuin', 'Wenkbrauw op']
export const NEUS_NAMEN = ['Klein', 'Knopje', 'Recht', 'Breed', 'Smal', 'Wipneus', 'Hoekig', 'Geen']
export const BOUW_NAMEN = ['Gemiddeld', 'Slank', 'Stevig', 'Breed', 'Tenger', 'Sportief', 'Lang', 'Compact']

/** het middelpunt en de straal van het hoofd; alles hangt hieraan */
export const KOP = { x: 100, y: 66, r: 34 }

/**
 * De vorm van het hoofd. De bovenkant blijft altijd een halve cirkel met
 * straal 34, want daar zit het haar op vast. De onderkant is waar een gezicht
 * zijn karakter vandaan haalt: een brede kaak, een spitse kin, een hartvorm.
 */
export function Gezicht({ vorm, huid, schaduw }: { vorm: number; huid: string; schaduw: string }): ReactNode {
  const { x, y, r } = KOP
  // elke vorm is dezelfde kruin plus een eigen onderhelft
  const onder: Record<number, string> = {
    // rond: gewoon de cirkel afmaken
    0: `M${x - r} ${y} A${r} ${r} 0 0 0 ${x + r} ${y} Z`,
    // ovaal: iets langer en smaller naar onderen
    1: `M${x - r} ${y} C${x - r} ${y + 30} ${x - 16} ${y + 38} ${x} ${y + 38} C${x + 16} ${y + 38} ${x + r} ${y + 30} ${x + r} ${y} Z`,
    // hart: brede wangen, smalle kin
    2: `M${x - r} ${y} C${x - r} ${y + 22} ${x - 14} ${y + 36} ${x} ${y + 36} C${x + 14} ${y + 36} ${x + r} ${y + 22} ${x + r} ${y} Z`,
    // vierkant: rechte kaaklijn met zachte hoeken
    3: `M${x - r} ${y} L${x - r} ${y + 22} Q${x - r} ${y + 32} ${x - 22} ${y + 32} L${x + 22} ${y + 32} Q${x + r} ${y + 32} ${x + r} ${y + 22} L${x + r} ${y} Z`,
    // lang: de kin steekt verder door
    4: `M${x - r} ${y} C${x - r} ${y + 34} ${x - 15} ${y + 44} ${x} ${y + 44} C${x + 15} ${y + 44} ${x + r} ${y + 34} ${x + r} ${y} Z`,
    // breed: laag en vol
    5: `M${x - r} ${y} C${x - r} ${y + 20} ${x - 20} ${y + 28} ${x} ${y + 28} C${x + 20} ${y + 28} ${x + r} ${y + 20} ${x + r} ${y} Z`,
    // spits: een echte punt aan de kin
    6: `M${x - r} ${y} C${x - r} ${y + 24} ${x - 10} ${y + 42} ${x} ${y + 42} C${x + 10} ${y + 42} ${x + r} ${y + 24} ${x + r} ${y} Z`,
    // zacht: bijna rond, maar net iets voller onderin
    7: `M${x - r} ${y} C${x - r} ${y + 28} ${x - 18} ${y + 35} ${x} ${y + 35} C${x + 18} ${y + 35} ${x + r} ${y + 28} ${x + r} ${y} Z`,
  }
  return (
    <>
      {/* de kruin, gelijk voor elke vorm zodat al het haar blijft passen */}
      <path d={`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`} fill={huid} />
      <path d={onder[vorm] ?? onder[0]} fill={huid} />
      {/* de schaduw aan de rechterkant geeft het hoofd diepte */}
      <path d={`M${x + 26} ${y - 22} A${r} ${r} 0 0 1 ${x + 26} ${y + 22} A44 44 0 0 0 ${x + 26} ${y - 22} Z`} fill={schaduw} opacity="0.4" />
    </>
  )
}

/** de acht oogvormen, elk met eigen wit, pupil en lidstand */
export function Ogen({ vorm }: { vorm: number }): ReactNode {
  const L = 87
  const R = 113
  const y = 66
  const pupil = '#2B1A4D'
  // rx, ry, pupilstraal, hoeveel de pupil naar buiten staat, ooglid
  const maten: Record<number, { rx: number; ry: number; p: number; uit: number; lid?: number }> = {
    0: { rx: 7.5, ry: 8.5, p: 4, uit: 2 },
    1: { rx: 8.5, ry: 6.5, p: 3.6, uit: 2 },
    2: { rx: 9, ry: 10, p: 4.6, uit: 1.6 },
    3: { rx: 8, ry: 4.6, p: 3.2, uit: 2 },
    4: { rx: 8, ry: 8, p: 4.2, uit: 1.4, lid: -2.4 },
    5: { rx: 8.2, ry: 7.4, p: 3.8, uit: 1.8, lid: 2.6 },
    6: { rx: 8.8, ry: 5.6, p: 3.4, uit: 2.4 },
    7: { rx: 7, ry: 9, p: 4, uit: 1.2 },
  }
  const m = maten[vorm] ?? maten[0]
  return (
    <>
      <ellipse cx={L} cy={y} rx={m.rx} ry={m.ry} fill="#fff" />
      <ellipse cx={R} cy={y} rx={m.rx} ry={m.ry} fill="#fff" />
      <circle cx={L + m.uit} cy={y + 1.5} r={m.p} fill={pupil} />
      <circle cx={R + m.uit} cy={y + 1.5} r={m.p} fill={pupil} />
      <circle cx={L + m.uit + 1.5} cy={y - 0.2} r="1.5" fill="#fff" />
      <circle cx={R + m.uit + 1.5} cy={y - 0.2} r="1.5" fill="#fff" />
      {/* een ooglid maakt het verschil tussen opgewekt en dromerig */}
      {m.lid !== undefined && (
        <>
          <path
            d={`M${L - m.rx} ${y + (m.lid < 0 ? -m.ry : m.lid - m.ry)} Q${L} ${y - m.ry + m.lid} ${L + m.rx} ${y + (m.lid < 0 ? -m.ry : m.lid - m.ry)}`}
            stroke="#2B1A4D"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${R - m.rx} ${y + (m.lid < 0 ? -m.ry : m.lid - m.ry)} Q${R} ${y - m.ry + m.lid} ${R + m.rx} ${y + (m.lid < 0 ? -m.ry : m.lid - m.ry)}`}
            stroke="#2B1A4D"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
    </>
  )
}

/** acht wenkbrauwen: stand en dikte doen meer voor een gezicht dan wat ook */
export function Wenkbrauwen({ vorm, kleur }: { vorm: number; kleur: string }): ReactNode {
  const L = 87
  const R = 113
  const soorten: Record<number, { b: number; h: number; y: number; hoek: number; boog?: number }> = {
    0: { b: 14, h: 3.5, y: 52, hoek: 4 },
    1: { b: 14, h: 3.2, y: 52, hoek: 0, boog: 3 },
    2: { b: 15, h: 5, y: 51, hoek: 3 },
    3: { b: 13, h: 2.2, y: 53, hoek: 4 },
    4: { b: 14, h: 3.4, y: 47, hoek: 3 },
    5: { b: 14, h: 3.4, y: 56, hoek: 4 },
    6: { b: 14, h: 3.6, y: 52, hoek: 12 },
    7: { b: 14, h: 3.6, y: 52, hoek: 4 },
  }
  const s = soorten[vorm] ?? soorten[0]
  // de opgetrokken wenkbrauw: alleen links omhoog, en dat leest meteen als karakter
  const linksY = vorm === 7 ? s.y - 5 : s.y
  if (s.boog) {
    // een gewone boog: begin en eind liggen even hoog, de top ertussen. Eerder
    // stond hier een vermenigvuldiging met nul, waardoor het eindpunt op y 0
    // belandde en de wenkbrauw als een streep naar de bovenrand schoot.
    const boog = (cx: number) =>
      `M${cx - s.b / 2} ${s.y + s.boog!} Q${cx} ${s.y - s.boog!} ${cx + s.b / 2} ${s.y + s.boog!}`
    return (
      <>
        <path d={boog(L)} stroke={kleur} strokeWidth={s.h + 0.6} strokeLinecap="round" fill="none" />
        <path d={boog(R)} stroke={kleur} strokeWidth={s.h + 0.6} strokeLinecap="round" fill="none" />
      </>
    )
  }
  return (
    <>
      <rect x={L - s.b / 2} y={linksY} width={s.b} height={s.h} rx={s.h / 2} fill={kleur} transform={`rotate(${-s.hoek} ${L} ${linksY + s.h / 2})`} />
      <rect x={R - s.b / 2} y={s.y} width={s.b} height={s.h} rx={s.h / 2} fill={kleur} transform={`rotate(${s.hoek} ${R} ${s.y + s.h / 2})`} />
    </>
  )
}

/**
 * De neus. Er was er geen, en juist daardoor leek elk gezicht op elk ander
 * gezicht. Hij blijft klein en in de schaduwkleur van de huid, zodat hij op
 * 56 pixels niet als een vlek gaat werken.
 */
export function Neus({ vorm, kleur }: { vorm: number; kleur: string }): ReactNode {
  const x = 100
  const y = 74
  switch (vorm) {
    case 1:
      return <circle cx={x} cy={y + 1} r="3" fill={kleur} opacity="0.75" />
    case 2:
      return <path d={`M${x} ${y - 5} L${x} ${y + 3} L${x + 3.5} ${y + 3}`} stroke={kleur} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    case 3:
      return <ellipse cx={x} cy={y + 1} rx="5.5" ry="2.8" fill={kleur} opacity="0.7" />
    case 4:
      return <path d={`M${x} ${y - 4} L${x} ${y + 3}`} stroke={kleur} strokeWidth="2.4" strokeLinecap="round" />
    case 5:
      return <path d={`M${x - 3} ${y + 2} Q${x} ${y - 4} ${x + 3} ${y + 2}`} stroke={kleur} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    case 6:
      return <path d={`M${x - 3} ${y + 3} L${x} ${y - 5} L${x + 3} ${y + 3} Z`} fill={kleur} opacity="0.72" />
    case 7:
      return null
    default:
      return <ellipse cx={x} cy={y + 1} rx="3.4" ry="2.4" fill={kleur} opacity="0.7" />
  }
}

/** acht monden, allemaal leesbaar tot op 56 pixels */
export function Mond({ vorm, lijn }: { vorm: number; lijn: string }): ReactNode {
  switch (vorm) {
    case 1:
      return (
        <g>
          <path d="M87 82 Q100 98 113 82 Z" fill="#8E3B22" />
          <path d="M89.5 83.6 L110.5 83.6 Q100 89 89.5 83.6 Z" fill="#FFF8F2" />
        </g>
      )
    case 2:
      return <path d="M91 85 Q100 89 109 85" stroke={lijn} strokeWidth="3" strokeLinecap="round" fill="none" />
    case 3:
      return <path d="M88 85 Q100 93 112 79" stroke={lijn} strokeWidth="3" strokeLinecap="round" fill="none" />
    case 4:
      // tuitmondje
      return <ellipse cx="100" cy="85" rx="4.2" ry="3.4" fill={lijn} opacity="0.85" />
    case 5:
      // streep: onverstoorbaar
      return <path d="M91 85 L109 85" stroke={lijn} strokeWidth="3" strokeLinecap="round" />
    case 6:
      // open lach met tanden
      return (
        <g>
          <path d="M88 81 Q100 96 112 81 Z" fill="#8E3B22" />
          <path d="M90.5 82.4 L109.5 82.4 L109.5 85.4 Q100 87 90.5 85.4 Z" fill="#FFF8F2" />
        </g>
      )
    case 7:
      // scheve grijns naar de andere kant
      return <path d="M88 79 Q100 93 112 85" stroke={lijn} strokeWidth="3" strokeLinecap="round" fill="none" />
    default:
      return <path d="M89 84 Q100 92 111 84" stroke={lijn} strokeWidth="3" strokeLinecap="round" fill="none" />
  }
}

/**
 * De lichaamsbouw: hoe breed de schouders zijn, hoe vol de torso en hoe ver de
 * benen uit elkaar staan. Alles als factor op de bestaande maten, zodat de
 * kleding en de emblemen die erop staan gewoon blijven kloppen.
 */
export interface Bouw {
  /** breedte van de torso als factor */
  breed: number
  /** hoogte van de torso als factor */
  hoog: number
  /** hoeveel de benen uit elkaar staan, in eenheden */
  spreid: number
}

export const BOUWEN: Bouw[] = [
  { breed: 1, hoog: 1, spreid: 0 },
  { breed: 0.88, hoog: 1.04, spreid: -1.5 },
  { breed: 1.14, hoog: 0.97, spreid: 1.5 },
  { breed: 1.24, hoog: 0.94, spreid: 3 },
  { breed: 0.8, hoog: 1, spreid: -2.5 },
  { breed: 1.06, hoog: 1.02, spreid: 0.5 },
  { breed: 0.94, hoog: 1.1, spreid: -1 },
  { breed: 1.12, hoog: 0.9, spreid: 2 },
]
