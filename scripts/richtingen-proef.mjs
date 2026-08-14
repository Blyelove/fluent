/**
 * Controleert dat élke richting uit de proeverij ook echt gebouwd is.
 *
 * Een keuzelijst met vijftien namen is makkelijk. De vraag is of achter elke
 * naam ook code zit, of dat er stilletjes op de standaard wordt teruggevallen.
 * Dit script legt de catalogus (stijlen.ts) naast de componenten die de
 * richtingen tekenen, en meldt elke id die nergens wordt afgehandeld.
 *
 * Gebruik: node scripts/richtingen-proef.mjs
 */
import { readFile } from 'node:fs/promises'

const WORTEL = new URL('../src/', import.meta.url)

const lees = (pad) => readFile(new URL(pad, WORTEL), 'utf8')

const catalogus = await lees('stijlen.ts')

/** haalt de ids uit één lijst in de catalogus */
function idsVan(lijstNaam) {
  const blok = catalogus.split(`export const ${lijstNaam}`)[1]
  if (!blok) return []
  const eind = blok.indexOf('\n]')
  const stuk = blok.slice(0, eind === -1 ? 400 : eind)
  return [...stuk.matchAll(/id: '([a-z0-9]+)'/g)].map((m) => m[1])
}

/* per groep: waar de richting getekend hoort te worden. De standaardrichting
   mag met een laatste `return` worden afgehandeld en heeft dus geen eigen
   vergelijking nodig; die staat hier apart genoemd zodat het bewust is. */
const GROEPEN = [
  { naam: 'De XP-drop', lijst: 'XP_STIJLEN', bestand: 'components/XpDrops.tsx', standaard: 'klassiek' },
  { naam: 'Het niveau omhoog', lijst: 'LEVELUP_STIJLEN', bestand: 'components/XpDrops.tsx', standaard: 'kaart' },
  { naam: 'De schildbreuk', lijst: 'BREUK_STIJLEN', bestand: 'components/Schildbreuk.tsx', standaard: 'scherven' },
  { naam: 'De arena-opkomst', lijst: 'ARENA_STIJLEN', bestand: 'screens/Arena.tsx', standaard: 'duel' },
  { naam: 'Het materiaal', lijst: 'MATERIAAL_STIJLEN', bestand: 'styles/werelden-materiaal.css', standaard: 'waas' },
  { naam: 'De wereldgroei', lijst: 'GROEI_STIJLEN', bestand: 'styles/werelden-materiaal.css', standaard: 'aangroeien' },
]

let fouten = 0
let totaal = 0
let gedurfd = 0

for (const g of GROEPEN) {
  const ids = idsVan(g.lijst)
  const bron = await lees(g.bestand)
  const ontbreekt = []
  for (const id of ids) {
    totaal++
    if (id === g.standaard) continue
    // de richting moet in de tekencode voorkomen, niet alleen in de catalogus
    if (!bron.includes(`'${id}'`)) ontbreekt.push(id)
  }
  const gedurfdInGroep = (catalogus.split(`export const ${g.lijst}`)[1] ?? '').split('\n]')[0].includes('gedurfd: true')
  if (gedurfdInGroep) gedurfd++
  const goed = ontbreekt.length === 0 && ids.length >= 3 && gedurfdInGroep
  if (!goed) fouten++
  console.log(
    `${goed ? 'OK  ' : 'FOUT'} ${g.naam.padEnd(20)} ${ids.length} richtingen (${ids.join(', ')})` +
      `${gedurfdInGroep ? ', met een gedurfde' : ', ZONDER gedurfde'}` +
      `${ontbreekt.length ? `, niet gebouwd: ${ontbreekt.join(', ')}` : ''}`,
  )
}

// elke richting moet ook in de kiezer te kiezen zijn
const kiezer = await lees('components/StijlKiezer.tsx')
for (const g of GROEPEN) {
  if (!kiezer.includes(g.lijst)) {
    console.log(`FOUT ${g.naam} staat niet in de proeverij`)
    fouten++
  }
}

console.log(`\n${totaal} richtingen over ${GROEPEN.length} groepen, ${gedurfd} groepen met een gedurfde optie`)
console.log(fouten === 0 ? 'ALLE RICHTINGEN ZIJN GEBOUWD' : `${fouten} GROEPEN STUK`)
process.exit(fouten === 0 ? 0 : 1)
