/**
 * Draait de audit uit scripts/audit.js in een echte headless Edge op een
 * echte telefoonbreedte. Het browserpaneel in de editor springt telkens terug
 * naar zijn eigen breedte, en dan meet je tikdoelen en horizontale scroll op
 * de verkeerde maat. Hier staat de breedte vast.
 *
 * Gebruik: node scripts/audit-run.mjs [breedte] [url]
 */
import { spawn } from 'node:child_process'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BREEDTE = Number(process.argv[2] ?? 375)
const HOOGTE = 812
const URL_BASIS = process.argv[3] ?? 'http://localhost:5199/?demo=1&tab=leren'
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
// elke draaibeurt een eigen poort: een Edge die van een vorige poging is
// blijven hangen, houdt de oude poort vast en dan meet je zijn tabblad
const POORT = 9300 + (process.pid % 600)

const SCHERMEN = [
  { naam: 'Leren', knop: 'Leren' },
  { naam: 'Spelen', knop: 'Spelen' },
  { naam: 'Divisie', knop: 'Divisie' },
  { naam: 'Oefenen', knop: 'Oefenen' },
  { naam: 'Profiel', knop: 'Profiel' },
]
const WERELDEN = [
  'neon', 'azulejo', 'flamenco', 'trencadis', 'solysombra', 'encre', 'nuit', 'papier',
  'raster', 'schwarzwald', 'fresco', 'notte', 'calcada', 'saudade', 'messing', 'soho',
]

const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

async function haalDoel() {
  for (let poging = 0; poging < 40; poging++) {
    try {
      const lijst = await fetch(`http://127.0.0.1:${POORT}/json/list`).then((r) => r.json())
      // op de url matchen en niet zomaar de eerste pagina pakken: anders meet
      // je een willekeurig ander tabblad en hangt de audit voor altijd
      const pagina = lijst.find((t) => t.type === 'page' && t.webSocketDebuggerUrl && t.url.includes('localhost:5199'))
      if (pagina) return pagina
    } catch {
      /* de browser is nog aan het opstarten */
    }
    await wacht(250)
  }
  throw new Error('geen debugdoel gevonden; start Edge niet al ergens anders')
}

function verbind(ws) {
  let id = 0
  const open = new Map()
  ws.addEventListener('message', (e) => {
    const bericht = JSON.parse(e.data)
    const wacht = open.get(bericht.id)
    if (!wacht) return
    open.delete(bericht.id)
    if (bericht.error) wacht.mis(new Error(bericht.error.message))
    else wacht.raak(bericht.result)
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
  URL_BASIS,
])
edge.stderr.on('data', () => { /* Edge klaagt over taakproviders, dat is ruis */ })

let uit = { fout: 'niet gedraaid' }
try {
  const doel = await haalDoel()
  const ws = new WebSocket(doel.webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r, { once: true }))
  const stuur = verbind(ws)

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  // De echte telefoonmaat afdwingen, los van het venster van de browser.
  // Bewust mobile: false. Met mobile: true valt een pagina zonder eigen
  // viewport-regel terug op de oude bureaubladbreedte van 980, en dan meet je
  // een maat die geen enkel apparaat heeft.
  await stuur('Emulation.setDeviceMetricsOverride', {
    width: BREEDTE, height: HOOGTE, deviceScaleFactor: 1, mobile: false,
  })
  await stuur('Page.reload', { ignoreCache: true })
  await wacht(3500)

  // de schaalinstelling van Windows rekt het venster na het laden weer op, dus
  // de maat wordt hier nog een keer vastgezet en daarna echt nagemeten
  await stuur('Emulation.setDeviceMetricsOverride', {
    width: BREEDTE, height: HOOGTE, deviceScaleFactor: 1, mobile: false,
  })
  await wacht(500)
  const gemeten = (await stuur('Runtime.evaluate', { expression: 'window.innerWidth', returnByValue: true })).result.value
  if (gemeten !== BREEDTE) throw new Error(`breedte klopt niet: ${gemeten} in plaats van ${BREEDTE}`)

  const bron = await readFile(new URL('./audit.js', import.meta.url), 'utf8')
  await stuur('Runtime.evaluate', { expression: bron })

  const roep = await Promise.race([
    stuur('Runtime.evaluate', {
      expression: `window.__auditFluent(${JSON.stringify(SCHERMEN)}, ${JSON.stringify(WERELDEN)}).then(r => JSON.stringify(r))`,
      awaitPromise: true,
      returnByValue: true,
      timeout: 300000,
    }),
    wacht(240000).then(() => { throw new Error('de audit gaf binnen vier minuten geen antwoord') }),
  ])
  uit = JSON.parse(roep.result.value)
} finally {
  // Edge zet zichzelf voort in kindprocessen, dus alleen de ouder afsluiten
  // laat de poort bezet achter; de hele boom moet weg
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

// kort verslag: alleen wat stuk is telt
const regels = []
let fouten = 0
for (const [scherm, d] of Object.entries(uit.schermen ?? {})) {
  const werelden = Object.keys(d.contrastFouten)
  const n = werelden.length + d.tikdoelenTeKlein.length + d.middenstreepjes.length + (d.horizontaalScroll ? 1 : 0)
  fouten += n
  regels.push(
    `${scherm.padEnd(9)} contrast:${werelden.length ? werelden.join(',') : 'schoon'}` +
      `  tikdoelen:${d.tikdoelenTeKlein.length}  scroll:${d.horizontaalScroll}  streepjes:${d.middenstreepjes.length}`,
  )
}
console.log(`venster: ${uit.venster}px`)
console.log(regels.join('\n'))
console.log(fouten === 0 ? '\nSCHOON' : `\n${fouten} PUNTEN OPEN\n` + JSON.stringify(uit.schermen, null, 1).slice(0, 2600))
process.exit(fouten === 0 ? 0 : 1)
