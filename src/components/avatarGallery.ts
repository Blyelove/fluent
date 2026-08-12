/**
 * De personagegalerij: 250+ kant-en-klare helden, elk met een eigen naam en
 * een gegarandeerd uniek uiterlijk. De eerste 24 zijn de oorspronkelijke
 * presets (bestaande accounts herkennen hun personage); de rest wordt
 * deterministisch samengesteld uit alle haarstijlen, huidtinten, haarkleuren,
 * outfits, extra's en monden — geen willekeur, dus de galerij is elke keer
 * exact hetzelfde.
 */
import { AVATAR_PRESETS, AVATAR_STYLES, AVATAR_STYLE_NAMES, HAIR_COLORS, OUTFIT_COLORS, SKINS, type AvatarStyle } from './Avatar'

export interface GalerijHeld {
  naam: string
  stijl: AvatarStyle
}

/* 125 mannennamen en 125 vrouwennamen — Nederlands en herkenbaar */
const MANNEN = [
  'Daan', 'Bram', 'Lucas', 'Milan', 'Levi', 'Luuk', 'Thijs', 'Jesse', 'Ruben', 'Finn',
  'Sem', 'Gijs', 'Teun', 'Cas', 'Mees', 'Stijn', 'Niels', 'Sven', 'Joris', 'Tim',
  'Jort', 'Koen', 'Lars', 'Bas', 'Rick', 'Tom', 'Max', 'Sam', 'Nick', 'Bart',
  'Pim', 'Wout', 'Siem', 'Ties', 'Jens', 'Floris', 'Olivier', 'Hugo', 'Vince', 'Boaz',
  'Ivan', 'Timo', 'Rens', 'Jelle', 'Sander', 'Maarten', 'Pepijn', 'Tobias', 'Julius', 'Melle',
  'Youssef', 'Amir', 'Rayan', 'Bilal', 'Samir', 'Karim', 'Tarik', 'Nassim', 'Zakaria', 'Ilias',
  'Ravi', 'Arjun', 'Dev', 'Kian', 'Aiden', 'Noah', 'Liam', 'Ethan', 'Adam', 'David',
  'Jonas', 'Victor', 'Oscar', 'Felix', 'Emil', 'Anton', 'Leon', 'Mats', 'Ole', 'Björn',
  'Marco', 'Luca', 'Matteo', 'Enzo', 'Diego', 'Pablo', 'Mateo', 'Rafael', 'Tiago', 'Bruno',
  'Kofi', 'Jamal', 'Malik', 'Omar', 'Idris', 'Sekou', 'Kwame', 'Chidi', 'Amara', 'Tunde',
  'Kenji', 'Hiro', 'Jin', 'Minh', 'Arash', 'Dario', 'Nikolai', 'Stefan', 'Andrei', 'Mika',
  'Otis', 'Boris', 'Casper', 'Douwe', 'Egbert', 'Fedde', 'Gerben', 'Hidde', 'IJsbrand', 'Jurre',
  'Karel', 'Lodewijk', 'Menno', 'Nout', 'Okke',
]

const VROUWEN = [
  'Emma', 'Julia', 'Tess', 'Sophie', 'Zoë', 'Sara', 'Anna', 'Eva', 'Lotte', 'Noa',
  'Lieke', 'Roos', 'Maud', 'Isa', 'Lynn', 'Fleur', 'Amber', 'Iris', 'Yara', 'Nina',
  'Luna', 'Mila', 'Sofie', 'Elin', 'Fenna', 'Jasmijn', 'Kiki', 'Livia', 'Merel', 'Nora',
  'Olivia', 'Puck', 'Quinty', 'Rosa', 'Saar', 'Tessa', 'Veerle', 'Wies', 'Xena', 'Yfke',
  'Zara', 'Anouk', 'Britt', 'Celine', 'Demi', 'Esmee', 'Femke', 'Gioia', 'Hannah', 'Ilse',
  'Amira', 'Layla', 'Nour', 'Salma', 'Yasmin', 'Zainab', 'Fatima', 'Rania', 'Dounia', 'Imane',
  'Priya', 'Anaya', 'Diya', 'Aisha', 'Chloe', 'Grace', 'Ruby', 'Ella', 'Mia', 'Lily',
  'Freja', 'Ingrid', 'Astrid', 'Sigrid', 'Maja', 'Elsa', 'Alma', 'Saga', 'Tuva', 'Linnea',
  'Chiara', 'Giulia', 'Elena', 'Lucia', 'Carmen', 'Ines', 'Paula', 'Alba', 'Vera', 'Bianca',
  'Amina', 'Zuri', 'Nia', 'Adaeze', 'Femi', 'Abena', 'Kessie', 'Makena', 'Sanaa', 'Talia',
  'Yuki', 'Hana', 'Mei', 'Linh', 'Shirin', 'Dilara', 'Katja', 'Milena', 'Anika', 'Selin',
  'Odile', 'Benthe', 'Cato', 'Dieuwke', 'Evi', 'Floor', 'Gerdien', 'Hille', 'Imke', 'Jet',
  'Karlijn', 'Loes', 'Mare', 'Nienke', 'Oda',
]

/** Deterministische pseudo-random uit een index — stabiel over elke sessie */
function rnd(i: number, zout: number): number {
  const x = Math.sin(i * 127.1 + zout * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const sleutel = (s: AvatarStyle) =>
  `${s.hair}|${s.skin}|${s.hairColor}|${s.outfit}|${s.extra ?? 0}|${s.gender ?? 0}|${s.mouth ?? 0}`

function bouwGalerij(): GalerijHeld[] {
  const uit: GalerijHeld[] = []
  const gezien = new Set<string>()

  // de oorspronkelijke 24 voorop — bestaande accounts herkennen hun personage
  for (const l of AVATAR_STYLES) {
    const stijl = { ...AVATAR_PRESETS[l] }
    uit.push({ naam: AVATAR_STYLE_NAMES[l], stijl })
    gezien.add(sleutel(stijl))
  }

  // daarna aanvullen tot minstens 1000 helden uit alle taalwerelden, in
  // themagolven zodat het raster overal anders aanvoelt: klassiek, neon,
  // fel gekleed en wild door elkaar
  const mannenHaar = [0, 2, 4, 6, 7, 8]
  const vrouwenHaar = [1, 2, 3, 5, 6, 9]
  let m = 0
  let v = 0
  let i = 0
  while (uit.length < 1000 && i < 40000) {
    i++
    const gender = i % 2
    const haarPool = gender === 0 ? mannenHaar : vrouwenHaar
    // 0 = klassiek (natuurlijk haar) · 1 = neon (geverfd) · 2 = fel gekleed · 3 = wild
    const thema = Math.floor(uit.length / 40) % 4
    const geverfd =
      thema === 1 ? true : thema === 3 ? rnd(i, 3) < 0.5 : rnd(i, 3) < 0.15
    const stijl: AvatarStyle = {
      gender,
      hair: haarPool[Math.floor(rnd(i, 1) * haarPool.length)],
      skin: Math.floor(rnd(i, 2) * SKINS.length),
      hairColor: geverfd ? 7 + Math.floor(rnd(i, 4) * (HAIR_COLORS.length - 7)) : Math.floor(rnd(i, 4) * 7),
      // fel geklede golf pakt de sprekende outfits (cyaan, roze, geel …)
      outfit: thema === 2 ? [6, 7, 8, 4, 2][Math.floor(rnd(i, 5) * 5)] : Math.floor(rnd(i, 5) * OUTFIT_COLORS.length),
      extra: rnd(i, 6) < (thema === 3 ? 0.3 : 0.55) ? 0 : 1 + Math.floor(rnd(i, 7) * 3),
      mouth: Math.floor(rnd(i, 8) * 4),
    }
    const k = sleutel(stijl)
    if (gezien.has(k)) continue
    gezien.add(k)
    const naam = gender === 0 ? MANNEN[m++ % MANNEN.length] : VROUWEN[v++ % VROUWEN.length]
    uit.push({ naam, stijl })
  }
  return uit
}

export const GALERIJ: GalerijHeld[] = bouwGalerij()
