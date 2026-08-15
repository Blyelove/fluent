/**
 * Draait de millimetermaat over élk scherm en telt op wat er niet klopt.
 *
 * Gebruik: node scripts/millimeter-run.mjs [breedte] [basis-url]
 */
import { spawn } from 'node:child_process'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BREEDTE = Number(process.argv[2] ?? 375)
const BASIS = (process.argv[3] ?? 'http://localhost:5210/').replace(/\/?$/, '/')
const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Élk scherm en élke overlay, niet alleen de vijf tabbladen.
 *
 * `pad` is de route ernaartoe: de tekst van de knoppen die je achter elkaar
 * moet aantikken. Zonder dat kom je alleen bij de schermen die een eigen link
 * hebben, en dat is precies het deel van de app dat toch al goed was.
 */
const SCHERMEN = [
  { naam: 'Leren', vraag: 'tab=leren' },
  { naam: 'Spelen', vraag: 'tab=spelen' },
  { naam: 'Divisie', vraag: 'tab=divisie' },
  { naam: 'Oefenen', vraag: 'tab=oefenen' },
  { naam: 'Profiel', vraag: 'tab=profiel' },
  { naam: 'Arena', vraag: 'tab=spelen&arena=1' },
  { naam: 'Galerij', vraag: 'gallery=1' },
  { naam: 'Les', vraag: 'tab=leren', pad: ['Doorgaan'] },
  { naam: 'Wereldkaart', vraag: 'tab=leren', pad: ['Reis verder'] },
  { naam: 'Badges', vraag: 'tab=profiel', pad: ['Prestaties & badges'] },
  { naam: 'Reeks', vraag: 'tab=leren', pad: ['34'] },
  { naam: 'Duels', vraag: 'tab=spelen', pad: ['Duels'] },
  { naam: 'Gesprekken', vraag: 'tab=oefenen', pad: ['Gesprekken'] },
  { naam: 'Vaardigheden', vraag: 'tab=leren', pad: ['Bekijk je vaardigheden'] },
  { naam: 'Garderobe', vraag: 'tab=profiel', pad: ['Garderobe'] },
  { naam: 'Proeverij', vraag: 'tab=profiel', pad: ['Momenten en effecten'] },
  { naam: 'Personage', vraag: 'tab=profiel', pad: ['Personage aanpassen'] },
  { naam: 'Wereldkiezer', vraag: 'tab=profiel', pad: ['Taalwereld'] },
  /* De dagtaak heeft drie vormen. Alleen de standaard meten zou betekenen dat
     de andere twee pas stukgaan als iemand ze kiest. */
  { naam: 'Dag orbs', vraag: 'tab=leren&dag=orbs' },
  { naam: 'Dag boog', vraag: 'tab=leren&dag=boog' },
  { naam: 'Dag blad', vraag: 'tab=leren', pad: ['Vandaag'] },
]

const profiel = await mkdtemp(join(tmpdir(), 'mm-'))
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-device-scale-factor=1', `--remote-debugging-port=${POORT}`,
  `--user-data-dir=${profiel}`, `--window-size=${BREEDTE},812`, `${BASIS}?demo=1&tab=leren`,
])
edge.stderr.on('data', () => {})

const uitslagen = []
try {
  let doel
  for (let i = 0; i < 40 && !doel; i++) {
    try {
      const l = await fetch(`http://127.0.0.1:${POORT}/json/list`).then((r) => r.json())
      doel = l.find((t) => t.type === 'page' && t.webSocketDebuggerUrl && t.url.includes(new URL(BASIS).host))
    } catch { /* opstarten */ }
    if (!doel) await wacht(250)
  }
  const ws = new WebSocket(doel.webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r, { once: true }))
  let id = 0
  const open = new Map()
  ws.addEventListener('message', (e) => {
    const b = JSON.parse(e.data)
    const w = open.get(b.id)
    if (!w) return
    open.delete(b.id)
    b.error ? w[1](new Error(b.error.message)) : w[0](b.result)
  })
  const stuur = (m, p = {}) => new Promise((a, b) => {
    const n = ++id
    open.set(n, [a, b])
    ws.send(JSON.stringify({ id: n, method: m, params: p }))
    setTimeout(() => { if (open.has(n)) { open.delete(n); b(new Error('geen antwoord op ' + m)) } }, 30000)
  })

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  const bron = await readFile(new URL('./millimeter.js', import.meta.url), 'utf8')
  const maat = { width: BREEDTE, height: 812, deviceScaleFactor: 1, mobile: false }

  for (const scherm of SCHERMEN) {
    await stuur('Page.navigate', { url: `${BASIS}?demo=1&${scherm.vraag}` })
    await wacht(2200)
    await stuur('Emulation.setDeviceMetricsOverride', maat)
    await wacht(600)
    // de route naar dit scherm aflopen, knop voor knop
    let bereikt = true
    for (const knop of scherm.pad ?? []) {
      const raak = await stuur('Runtime.evaluate', {
        expression: `(() => {
          const t = ${JSON.stringify(knop)}
          const b = [...document.querySelectorAll('button, [role="button"], a')]
            .find((x) => (x.textContent || '').includes(t) || (x.getAttribute('aria-label') || '').includes(t))
          if (b) { b.click(); return true }
          return false
        })()`,
        returnByValue: true,
      })
      if (!raak.result.value) {
        console.log(`${scherm.naam.padEnd(12)} overgeslagen: knop "${knop}" niet gevonden`)
        bereikt = false
        break
      }
      await wacht(1500)
    }
    if (!bereikt) continue
    /* Wachten tot het scherm stilstaat. De binnenkomst van een scherm duurt
       190 milliseconde, maar op de Arena begint die pas na de opkomst. Meten
       tijdens die beweging gaf zes randfouten die er geen waren: alles stond
       toen nog zestien pixels naar rechts. */
    for (let poging = 0; poging < 12; poging++) {
      const stil = await stuur('Runtime.evaluate', {
        expression: '(() => { const s = document.querySelector(".shell"); if (!s) return false; const p = s.parentElement; return !p || getComputedStyle(p).transform === "none" })()',
        returnByValue: true,
      })
      if (stil.result.value) break
      await wacht(250)
    }
    await stuur('Runtime.evaluate', { expression: bron })
    const roep = await stuur('Runtime.evaluate', {
      expression: 'JSON.stringify(window.__millimeter())',
      returnByValue: true,
      timeout: 20000,
    })
    const r = JSON.parse(roep.result.value)
    uitslagen.push({ scherm: scherm.naam, ...r })
    console.log(
      `${scherm.naam.padEnd(12)} schil ${String(r.schilLinks).padStart(3)}+${r.schilBreed}  lijnen ${String(r.uitlijning.lijnen.length).padStart(2)} van ${String(r.uitlijning.blokken).padStart(2)} blokken` +
        `  ritme buiten ladder ${String(r.ritme.buitenLadder.length).padStart(2)} (${r.ritme.buitenLadder.slice(0, 6).join(', ')})` +
        `  zonder aanraking ${String(r.zonderAanraking.length).padStart(2)}` +
        `  randfouten ${r.randfouten.length}`,
    )
    if (r.geenVlak) console.log('   GEEN VLAK GEVONDEN: dit scherm wordt niet gemeten')
    if (r.uitlijning.lijnen.length > 1) console.log('   linkerlijnen: ' + r.uitlijning.lijnen.join(', '))
    if (r.ritme.buitenLadder.length)
      console.log('   ritme: ' + (r.ritme.waar || []).map((w) => `${w.gat} tussen "${w.na}" en "${w.voor}"`).join(' | '))
    if (r.zonderAanraking.length) console.log('   knoppen zonder reactie: ' + r.zonderAanraking.slice(0, 5).map((z) => `"${z.t}"`).join(', '))
    if (r.randfouten.length) console.log('   rand: ' + r.randfouten.map((z) => `"${z.t}" ${z.reden}`).join(' | '))
  }
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

const totaal = uitslagen.reduce(
  (n, u) =>
    n +
    (u.geenVlak ?? 0) +
    Math.max(0, u.uitlijning.lijnen.length - 1) +
    u.ritme.buitenLadder.length +
    u.zonderAanraking.length +
    u.randfouten.length,
  0,
)
console.log(`\n${totaal} punten waar het niet klopt over ${uitslagen.length} schermen`)
console.log(totaal === 0 ? 'ELKE MILLIMETER KLOPT' : 'werk aan de winkel')
process.exit(totaal === 0 ? 0 : 1)
