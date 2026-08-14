/**
 * Meet de twee dingen die tot nu toe alleen op papier stonden.
 *
 * 1. De niveaumomenten: komen de mijlpalen 10, 25, 50, 75, 92 en 99 echt
 *    anders binnen dan een gewoon niveau, en staat bij 92 dat de helft binnen
 *    is. Een grotere kaart moet ook echt groter zijn, dus dat wordt gemeten en
 *    niet bekeken.
 * 2. De meestermantel bij 99: hangt hij op je personage, en overal, dus ook op
 *    het leerscherm en in de arena en niet alleen op je profiel.
 *
 * En daaroverheen: hetzelfde moment in élke taalwereld, want een moment dat
 * in twaalf werelden klopt en in vier niet, klopt niet.
 *
 * Gebruik: node scripts/momenten-proef.mjs [basis-url]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASIS = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/')
const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))
const WERELDEN = [
  'neon', 'azulejo', 'flamenco', 'trencadis', 'solysombra', 'encre', 'nuit', 'papier',
  'raster', 'schwarzwald', 'fresco', 'notte', 'calcada', 'saudade', 'messing', 'soho',
]

let fouten = 0
const eis = (waar, wat) => {
  console.log(`${waar ? 'OK  ' : 'FOUT'} ${wat}`)
  if (!waar) fouten++
}

/** leest de vieringkaart: tekst, hoogte en of hij als mijlpaal is opgemaakt */
const LEES_VIERING = [
  '(() => {',
  '  // innerText geeft de gerenderde tekst, dus een kop met text-transform',
  '  // komt er in hoofdletters uit; daarom overal hoofdletterongevoelig zoeken.',
  '  const t = (document.body.innerText || "").replace(/\\s+/g, " ");',
  '  // de kleinste div die de kaart is, niet de eerste: die eerste is een',
  '  // voorouder van het hele scherm en dan meet je 7205 pixels hoogte',
  '  const kandidaten = [...document.querySelectorAll("div")].filter((d) =>',
  '    /mijlpaal bereikt|niveau omhoog/i.test(d.textContent || "") && d.getBoundingClientRect().height > 80);',
  '  const kaart = kandidaten.sort((a, b) =>',
  '    a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];',
  '  const r = kaart ? kaart.getBoundingClientRect() : null;',
  '  return JSON.stringify({',
  '    zichtbaar: !!kaart,',
  '    mijlpaal: /mijlpaal bereikt/i.test(t),',
  '    helft: /helft/i.test(t),',
  '    kaartTekst: kaart ? kaart.textContent.replace(/\\s+/g, " ").slice(0, 120) : "",',
  '    hoogte: r ? Math.round(r.height) : 0,',
  '  });',
  '})()',
].join('\n')

/** zoekt de meestermantel: een pad met de meester-verloop erin */
const LEES_MANTEL = [
  '(() => {',
  '  const alles = [...document.querySelectorAll("path, [fill]")];',
  '  const mantels = alles.filter((n) => /meester-/.test(n.getAttribute("fill") || ""));',
  '  return JSON.stringify({',
  '    aantal: mantels.length,',
  '    negenennegentig: /\\b99\\b/.test(document.body.innerText || ""),',
  '  });',
  '})()',
].join('\n')

const profiel = await mkdtemp(join(tmpdir(), 'momenten-'))
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-device-scale-factor=1', `--remote-debugging-port=${POORT}`,
  `--user-data-dir=${profiel}`, '--window-size=375,812', `${BASIS}?demo=1&tab=leren`,
])
edge.stderr.on('data', () => {})

try {
  let doel
  for (let i = 0; i < 40 && !doel; i++) {
    try {
      const l = await fetch(`http://127.0.0.1:${POORT}/json/list`).then((r) => r.json())
      doel = l.find((t) => t.type === 'page' && t.webSocketDebuggerUrl && t.url.includes(new URL(BASIS).host))
    } catch { /* nog aan het opstarten */ }
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
  const stuur = (m, p = {}) => new Promise((a, b) => { const n = ++id; open.set(n, [a, b]); ws.send(JSON.stringify({ id: n, method: m, params: p })) })
  const ev = async (expr) => (await stuur('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value
  const ga = async (vraag, schaal = 1) => {
    await stuur('Page.navigate', { url: `${BASIS}?${vraag}` })
    await wacht(2100)
    await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: schaal, mobile: false })
    await wacht(500)
  }
  const schiet = async (naam) => {
    const s = await stuur('Page.captureScreenshot', { format: 'png' })
    await writeFile(`C:/Users/Blye/Desktop/aurea/docs/bewijs/${naam}.png`, Buffer.from(s.data, 'base64'))
  }

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  await wacht(2500)

  /* ---------- 1. gewoon niveau tegenover mijlpaal ---------- */
  const maten = {}
  for (const niveau of [11, 10, 25, 50, 75, 92, 99]) {
    await ga(`demo=1&tab=leren&levelup=${niveau}`, 2)
    await wacht(900)
    const v = JSON.parse(await ev(LEES_VIERING))
    maten[niveau] = v
    console.log(`niveau ${String(niveau).padStart(2)}: mijlpaal=${v.mijlpaal} hoogte=${v.hoogte} ${v.kaartTekst.slice(0, 70)}`)
    if ([92, 99, 11].includes(niveau)) await schiet(`levelup-${niveau}`)
  }
  eis(maten[11].zichtbaar, 'een gewoon niveau geeft een viering')
  eis(!maten[11].mijlpaal, 'een gewoon niveau is géén mijlpaal')
  for (const m of [10, 25, 50, 75, 92, 99]) eis(maten[m].mijlpaal, `niveau ${m} komt binnen als mijlpaal`)
  eis(maten[92].hoogte > maten[11].hoogte, `een mijlpaal is groter dan een gewoon niveau (${maten[92].hoogte} tegen ${maten[11].hoogte})`)
  eis(maten[92].helft, 'bij 92 staat dat de helft binnen is')

  /* ---------- 2. hetzelfde moment in élke wereld ---------- */
  const stukkeWerelden = []
  for (const wereld of WERELDEN) {
    await ga(`demo=1&tab=leren&levelup=92&wereld=${wereld}`, 1)
    await wacht(800)
    const v = JSON.parse(await ev(LEES_VIERING))
    const echteWereld = await ev('document.documentElement.getAttribute("data-wereld")')
    if (echteWereld !== wereld) throw new Error(`wereld klopt niet: ${echteWereld}`)
    if (!v.zichtbaar || !v.mijlpaal || !v.helft) stukkeWerelden.push(wereld)
  }
  eis(stukkeWerelden.length === 0, `de mijlpaal van 92 komt in alle 16 werelden binnen${stukkeWerelden.length ? ': stuk in ' + stukkeWerelden.join(', ') : ''}`)

  /* ---------- 3. de meestermantel bij 99, overal ---------- */
  for (const [naam, vraag] of [
    ['meester-profiel', 'meester=1&tab=profiel'],
    ['meester-leren', 'meester=1&tab=leren'],
    ['meester-arena', 'meester=1&tab=spelen&arena=1'],
  ]) {
    await ga(vraag, 2)
    await wacht(1400)
    const m = JSON.parse(await ev(LEES_MANTEL))
    console.log(`${naam}: mantels=${m.aantal}`)
    eis(m.aantal > 0, `de meestermantel hangt op je personage bij ${naam.replace('meester-', '')}`)
    await schiet(naam)
  }
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

console.log(fouten === 0 ? '\nMOMENTEN KLOPPEN' : `\n${fouten} PUNTEN STUK`)
process.exit(fouten === 0 ? 0 : 1)
