/**
 * Draait de audit uit scripts/audit.js over élke combinatie van scherm en
 * taalwereld, in een echte headless browser op een echte telefoonbreedte.
 *
 * Twee dingen die eerder misgingen, en waarom het nu zo werkt:
 *
 * 1. Het browserpaneel in de editor springt terug naar zijn eigen breedte. Op
 *    465 valt alles net binnen het scherm en zie je de echte problemen niet.
 *    De breedte wordt hier afgedwongen én nagemeten voordat er geteld wordt.
 * 2. De wereld werd vroeger door de audit zelf op het document gezet, maar de
 *    app zet zijn eigen wereld terug zodra hij hertekent, en op de Arena
 *    gebeurt dat continu. Dan meet je een donkere wereld terwijl je denkt een
 *    lichte te meten, en meldt de audit onterecht dat alles schoon is. Nu pint
 *    elke combinatie zichzelf via ?wereld= in de link, en de meting weigert
 *    als de wereld of de breedte niet klopt.
 *
 * Gebruik: node scripts/audit-run.mjs [breedte] [basis-url]
 * De basis-url is standaard de ontwikkelserver; geef de live link mee om te
 * meten wat er écht bij een bezoeker aankomt.
 */
import { spawn } from 'node:child_process'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BREEDTE = Number(process.argv[2] ?? 375)
const BASIS = (process.argv[3] ?? 'http://localhost:5199/').replace(/\/?$/, '/')
const GASTHEER = new URL(BASIS).host
const HOOGTE = 812
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
// elke draaibeurt een eigen poort: een Edge die van een vorige poging is
// blijven hangen, houdt de oude poort vast en dan meet je zijn tabblad
const POORT = 9300 + (process.pid % 600)

const SCHERMEN = [
  { naam: 'Leren', vraag: 'tab=leren' },
  { naam: 'Spelen', vraag: 'tab=spelen' },
  { naam: 'Divisie', vraag: 'tab=divisie' },
  { naam: 'Oefenen', vraag: 'tab=oefenen' },
  { naam: 'Profiel', vraag: 'tab=profiel' },
  { naam: 'Arena', vraag: 'tab=spelen&arena=1' },
]
const WERELDEN = [
  'neon', 'azulejo', 'flamenco', 'trencadis', 'solysombra', 'encre', 'nuit', 'papier',
  'raster', 'schwarzwald', 'fresco', 'notte', 'calcada', 'saudade', 'messing', 'soho',
]

const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

/** het prestatiecontract: hoogstens drie dingen die eeuwig blijven bewegen */
const MAX_ANIMATIES = 3

const telFouten = (u) =>
  u.contrastFouten.length +
  u.tikdoelenTeKlein.length +
  u.middenstreepjes.length +
  (u.tekstBreekt ? u.tekstBreekt.length : 0) +
  (u.horizontaalScroll ? 1 : 0) +
  // deze werd wel gemeten maar niet meegeteld, dus de grens uit het doel stond
  // er alleen op papier
  (u.oneindigeAnimaties.aantal > MAX_ANIMATIES ? 1 : 0)

async function haalDoel() {
  for (let poging = 0; poging < 40; poging++) {
    try {
      const lijst = await fetch(`http://127.0.0.1:${POORT}/json/list`).then((r) => r.json())
      // op de url matchen en niet zomaar de eerste pagina pakken: anders meet
      // je een willekeurig ander tabblad en hangt de audit voor altijd
      const pagina = lijst.find((t) => t.type === 'page' && t.webSocketDebuggerUrl && t.url.includes(GASTHEER))
      if (pagina) return pagina
    } catch {
      /* de browser is nog aan het opstarten */
    }
    await wacht(250)
  }
  throw new Error(`geen debugdoel gevonden op ${GASTHEER}; draait de server?`)
}

function verbind(ws) {
  let id = 0
  const open = new Map()
  ws.addEventListener('message', (e) => {
    const bericht = JSON.parse(e.data)
    const belofte = open.get(bericht.id)
    if (!belofte) return
    open.delete(bericht.id)
    if (bericht.error) belofte.mis(new Error(bericht.error.message))
    else belofte.raak(bericht.result)
  })
  return (methode, params = {}) =>
    new Promise((raak, mis) => {
      const n = ++id
      open.set(n, { raak, mis })
      ws.send(JSON.stringify({ id: n, method: methode, params }))
    })
}

const profiel = await mkdtemp(join(tmpdir(), 'fluent-audit-'))
const edge = spawn(EDGE, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--force-device-scale-factor=1',
  `--remote-debugging-port=${POORT}`,
  `--user-data-dir=${profiel}`,
  `--window-size=${BREEDTE},${HOOGTE}`,
  `${BASIS}?demo=1&tab=leren`,
])
edge.stderr.on('data', () => { /* Edge klaagt over taakproviders, dat is ruis */ })

const uitslagen = []
try {
  const doel = await haalDoel()
  const ws = new WebSocket(doel.webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r, { once: true }))
  const stuur = verbind(ws)
  await stuur('Page.enable')
  await stuur('Runtime.enable')

  const bron = await readFile(new URL('./audit.js', import.meta.url), 'utf8')
  // Bewust mobile: false. Met mobile: true valt een pagina zonder eigen
  // viewport-regel terug op de oude bureaubladbreedte van 980, en dan meet je
  // een maat die geen enkel apparaat heeft.
  const maat = { width: BREEDTE, height: HOOGTE, deviceScaleFactor: 1, mobile: false }

  for (const scherm of SCHERMEN) {
    for (const wereld of WERELDEN) {
      /* Meten, en de meting weggooien als de condities niet kloppen. Een trage
         start levert soms een pagina op die de wereld nog niet heeft gezet;
         dan is nog een poging met meer geduld het juiste antwoord, en niet
         een uitslag die je toch maar opschrijft. Blijft het misgaan, dan is er
         echt iets stuk en moet het hard stukgaan. */
      let r = null
      for (let poging = 0; poging < 3 && !r; poging++) {
        await stuur('Page.navigate', { url: `${BASIS}?demo=1&${scherm.vraag}&wereld=${wereld}` })
        await wacht(2100 + poging * 1500)
        // de schaalinstelling van Windows rekt het venster na het laden weer
        // op, dus de maat wordt na élke navigatie opnieuw vastgezet
        await stuur('Emulation.setDeviceMetricsOverride', maat)
        await wacht(450)
        await stuur('Runtime.evaluate', { expression: bron })
        const roep = await stuur('Runtime.evaluate', {
          expression: 'window.__auditFluent().then((x) => JSON.stringify(x))',
          awaitPromise: true,
          returnByValue: true,
          timeout: 30000,
        })
        const kandidaat = JSON.parse(roep.result.value)
        if (kandidaat.venster === BREEDTE && kandidaat.wereld === wereld) r = kandidaat
        else console.log(`  opnieuw: ${scherm.naam}/${wereld} gaf ${kandidaat.wereld} op ${kandidaat.venster}px`)
      }
      if (!r) throw new Error(`${scherm.naam}/${wereld} kwam na drie pogingen niet in de juiste staat`)
      uitslagen.push({ scherm: scherm.naam, wereld, ...r })
    }
    const stuk = uitslagen.filter((u) => u.scherm === scherm.naam && telFouten(u) > 0)
    console.log(
      `${scherm.naam.padEnd(8)} ${stuk.length ? `${stuk.length}/16 werelden stuk: ${stuk.map((u) => u.wereld).join(', ')}` : '16/16 schoon'}`,
    )
  }
} finally {
  // Edge zet zichzelf voort in kindprocessen, dus alleen de ouder afsluiten
  // laat de poort bezet achter; de hele boom moet weg
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

const stuk = uitslagen.filter((u) => telFouten(u) > 0)
console.log(`\n${uitslagen.length} combinaties gemeten op ${BREEDTE}px`)
console.log(
  'gemeten per combinatie: contrast onder 3 op 1, tikdoelen onder 44 pixels, horizontale scroll,
' +
    'middenstreepjes, tekst die uit zijn vak breekt, en hoogstens drie oneindige animaties',
)
if (!stuk.length) {
  console.log('SCHOON')
  process.exit(0)
}
console.log(`${stuk.length} STUK\n`)
for (const u of stuk.slice(0, 24)) {
  const delen = []
  if (u.contrastFouten.length) delen.push('contrast ' + u.contrastFouten.map((c) => `"${c.t}" ${c.c}`).join(' | '))
  if (u.tikdoelenTeKlein.length) delen.push('tikdoel ' + u.tikdoelenTeKlein.map((t) => `"${t.t}" ${t.w}x${t.h}`).join(' | '))
  if (u.horizontaalScroll) delen.push('horizontale scroll')
  if (u.middenstreepjes.length) delen.push('middenstreepje ' + u.middenstreepjes.join(' | '))
  if (u.tekstBreekt && u.tekstBreekt.length)
    delen.push('tekst breekt uit zijn vak: ' + u.tekstBreekt.map((b) => `"${b.t}" ${b.inhoud}>${b.vak}`).join(' | '))
  if (u.oneindigeAnimaties.aantal > MAX_ANIMATIES)
    delen.push(`${u.oneindigeAnimaties.aantal} oneindige animaties (${u.oneindigeAnimaties.soorten.join(', ')}), hoogstens ${MAX_ANIMATIES}`)
  console.log(`${u.scherm}/${u.wereld}: ${delen.join('; ')}`)
}
process.exit(1)
