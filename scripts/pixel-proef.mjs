/**
 * DE PIXELAUDIT
 *
 * Punt 2 van het doel zegt: één maatladder, één typeladder, en alles wat
 * daarbuiten valt is een fout. Zoiets is niet met het oog te controleren, want
 * het verschil tussen 13 en 14 pixels zie je niet en zeshonderd van die
 * verschillen bij elkaar zie je wél.
 *
 * Dit script leest de broncode en telt wat er buiten de ladders valt:
 * lettergroottes, ruimtes, en losse kleuren die uit een token hadden moeten
 * komen. Het meldt de ergste plekken eerst, zodat opruimen ergens begint.
 *
 * Gebruik: node scripts/pixel-proef.mjs [--alles]
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('../src/', import.meta.url))
const ALLES = process.argv.includes('--alles')

/**
 * De maatladder uit het doel: 4, 8, 12, 16, 24, 32, 48. Nul telt mee, en zo ook
 * de haarlijnen 1 en 2, want een rand van vier pixels is geen rand meer.
 */
const MAATLADDER = new Set([0, 1, 1.5, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96])
/**
 * De typeladder: acht tekstmaten en drie displaymaten. Meer heeft een app niet
 * nodig, en meer is precies waarom achttien verschillende groottes op één
 * scherm stonden voordat dit werd rechtgetrokken.
 */
const TYPELADDER = new Set([11, 12.5, 14, 16, 19, 23, 28, 34, 48, 64, 96])

const RUIMTE_VELDEN = ['padding', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'gap', 'rowGap', 'columnGap']

async function bestanden(map) {
  const uit = []
  for (const item of await readdir(map, { withFileTypes: true })) {
    const pad = join(map, item.name)
    if (item.isDirectory()) uit.push(...(await bestanden(pad)))
    else if (['.tsx', '.ts'].includes(extname(item.name))) uit.push(pad)
  }
  return uit
}

const lijst = await bestanden(SRC)
const perBestand = new Map()

for (const pad of lijst) {
  const bron = await readFile(pad, 'utf8')
  const kort = pad.slice(SRC.length).replace(/\\/g, '/')
  const gevonden = { type: [], ruimte: [], kleur: [] }

  // lettergroottes buiten de typeladder
  for (const m of bron.matchAll(/fontSize:\s*([0-9.]+)/g)) {
    const n = Number(m[1])
    if (!TYPELADDER.has(n)) gevonden.type.push(n)
  }

  // ruimtes buiten de maatladder
  for (const veld of RUIMTE_VELDEN) {
    for (const m of bron.matchAll(new RegExp(`${veld}:\\s*([0-9.]+)`, 'g'))) {
      const n = Number(m[1])
      if (!MAATLADDER.has(n)) gevonden.ruimte.push(`${veld}:${n}`)
    }
  }

  /* Losse kleuren in een component. De tekening van het personage en de
     wereldstijlen mogen ze wél hebben: dáár zijn kleuren de inhoud en geen
     opmaak. Overal anders hoort het uit een token te komen. */
  const magKleuren = /Avatar|avatar-|Schildbreuk|avatarGallery|werelden|stijlen|leagues|arena\.ts|countries/.test(kort)
  if (!magKleuren) {
    for (const m of bron.matchAll(/(rgba?\([^)]*\)|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b)/g)) {
      gevonden.kleur.push(m[1])
    }
  }

  const totaal = gevonden.type.length + gevonden.ruimte.length + gevonden.kleur.length
  if (totaal) perBestand.set(kort, { ...gevonden, totaal })
}

const gesorteerd = [...perBestand.entries()].sort((a, b) => b[1].totaal - a[1].totaal)
const som = (sleutel) => gesorteerd.reduce((n, [, v]) => n + v[sleutel].length, 0)

console.log(`${lijst.length} bestanden gelezen\n`)
console.log(`lettergroottes buiten de typeladder : ${som('type')}`)
console.log(`ruimtes buiten de maatladder        : ${som('ruimte')}`)
console.log(`losse kleuren in componenten        : ${som('kleur')}`)
console.log(`\nde ${ALLES ? gesorteerd.length : 12} zwaarste bestanden:`)
for (const [naam, v] of gesorteerd.slice(0, ALLES ? gesorteerd.length : 12)) {
  const delen = []
  if (v.type.length) delen.push(`type ${v.type.length} (${[...new Set(v.type)].slice(0, 6).join(', ')})`)
  if (v.ruimte.length) delen.push(`ruimte ${v.ruimte.length} (${[...new Set(v.ruimte)].slice(0, 5).join(', ')})`)
  if (v.kleur.length) delen.push(`kleur ${v.kleur.length}`)
  console.log(`${String(v.totaal).padStart(4)}  ${naam.padEnd(34)} ${delen.join(' · ')}`)
}
