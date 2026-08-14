/**
 * De punten uit het doel die tot nu toe alleen beweerd waren.
 *
 * 1b  De garderobe: zeven plekken, en wat je nog niet hebt staat er anders bij.
 * 1d  De houdingen: staan, lopen, juichen, verslagen en nadenken moeten alle
 *     vijf een andere tekening opleveren. Een houding die er hetzelfde uitziet
 *     als staan is geen houding.
 * 1e  Alles in svg: geen enkele afbeelding, nergens.
 * 3c  De achtergrond van elke wereld is echt materiaal en geen kleurverloop.
 * 3d  Twee spelers krijgen een andere wereld, en dezelfde speler altijd
 *     dezelfde: een toevallige draai die elke sessie verspringt is geen eigen
 *     wereld maar ruis.
 *
 * Gebruik: node scripts/ontwerp-proef.mjs [basis-url]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASIS = (process.argv[2] ?? 'http://localhost:5210/').replace(/\/?$/, '/')
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

const profiel = await mkdtemp(join(tmpdir(), 'ontwerp-'))
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
  const ev = async (x) => {
    const r = await stuur('Runtime.evaluate', { expression: x, returnByValue: true })
    if (r.exceptionDetails) return 'FOUT: ' + String(r.exceptionDetails.exception?.description ?? '').slice(0, 130)
    return r.result.value
  }
  const ga = async (vraag) => {
    await stuur('Page.navigate', { url: `${BASIS}?${vraag}` })
    await wacht(2000)
    await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: false })
    await wacht(600)
  }

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  await wacht(2500)

  /* ---------- 1b: de garderobe ---------- */
  await ga('demo=1&tab=profiel')
  await ev('(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim().startsWith("Garderobe")); if (b) b.click(); return !!b })()')
  await wacht(1400)
  const kast = JSON.parse(await ev([
    '(() => {',
    '  const plekken = [...document.querySelectorAll("strong")].map((n) => n.textContent.trim())',
    '    .filter((t) => ["Hoofd","Boven","Onder","Schoenen","Rug","In de hand","Aura"].includes(t));',
    '  const tegels = [...document.querySelectorAll("div")].filter((d) => (d.getAttribute("title") || "") !== "");',
    '  const verborgen = [...document.querySelectorAll("div")].filter((d) => (d.getAttribute("style") || "").indexOf("brightness(0)") >= 0);',
    '  const eisen = [...document.querySelectorAll("p")].map((p) => p.textContent.trim())',
    '    .filter((t) => t === "in bezit" || /^Niveau [0-9]+$/.test(t) || /^Vanaf het begin$/.test(t) || /niveau 99/.test(t));',
    '  return JSON.stringify({ plekken: plekken.length, tegels: tegels.length, verborgen: verborgen.length, eisen: eisen.length });',
    '})()',
  ].join('\n')))
  console.log('garderobe:', JSON.stringify(kast))
  eis(kast.plekken === 7, `de garderobe heeft zeven plekken (${kast.plekken})`)
  eis(kast.tegels >= 25, `de garderobe toont alle stukken (${kast.tegels})`)
  eis(kast.verborgen >= 1, `wat je nog niet hebt staat er anders bij (${kast.verborgen} verborgen)`)
  eis(kast.eisen >= 25, `bij elk stuk staat wat je ervoor moet doen (${kast.eisen})`)

  /* ---------- 1d: vijf houdingen, vijf tekeningen ---------- */
  const AFDRUK = [
    '(() => {',
    '  const svg = [...document.querySelectorAll("svg")].find((s) => (s.getAttribute("viewBox") || "").indexOf("200 230") >= 0);',
    '  if (!svg) return "geen personage";',
    '  const g = svg.querySelector("g") || svg;',
    '  const delen = [];',
    '  for (const n of svg.querySelectorAll("path, circle, ellipse, rect, g")) {',
    '    const cs = getComputedStyle(n);',
    '    delen.push((n.getAttribute("d") || "") + "|" + cs.transform + "|" + cs.opacity);',
    '  }',
    '  return delen.join("//");',
    '})()',
  ].join(String.fromCharCode(10))
  const houdingen = new Map()
  for (const h of ['idle', 'run', 'cheer', 'verslagen', 'denk']) {
    await ga(`demo=1&tab=profiel&houding=${h}`)
    // de houding even laten inzakken: verslagen kantelt en nadenken wiegt
    await wacht(900)
    const a = await ev(AFDRUK)
    const al = houdingen.get(a)
    if (al !== undefined) console.log(`  houding ${h} tekent hetzelfde als ${al}`)
    else houdingen.set(a, h)
  }
  eis(houdingen.size === 5, `vijf houdingen geven vijf verschillende tekeningen (${houdingen.size} uniek)`)

  /* ---------- 1e: geen enkele afbeelding ---------- */
  const beelden = JSON.parse(await ev([
    '(() => {',
    '  // svg telt als tekening en niet als afbeelding: het is scherp op elk',
    '  // scherm, en dat is precies wat het doel bedoelt. Alleen raster valt af.',
    '  const isSvg = (t) => t.indexOf("data:image/svg") >= 0 || t.indexOf(".svg") >= 0;',
    '  const imgs = [...document.querySelectorAll("img")].map((n) => n.getAttribute("src") || "").filter((t) => !isSvg(t));',
    '  const achtergronden = [];',
    '  for (const n of document.querySelectorAll("body *, html")) {',
    '    const b = getComputedStyle(n).backgroundImage;',
    '    if (b && b.indexOf("url(") >= 0 && !isSvg(b)) achtergronden.push(b.slice(0, 40));',
    '    for (const p of ["::before", "::after"]) {',
    '      const q = getComputedStyle(n, p).backgroundImage;',
    '      if (q && q.indexOf("url(") >= 0 && !isSvg(q)) achtergronden.push(p + " " + q.slice(0, 40));',
    '    }',
    '  }',
    '  return JSON.stringify({ imgs, achtergronden: [...new Set(achtergronden)] });',
    '})()',
  ].join('\n')))
  console.log('afbeeldingen:', JSON.stringify(beelden).slice(0, 200))
  eis(beelden.imgs.length === 0, `geen enkele afbeelding op het scherm (${beelden.imgs.length})`)
  eis(beelden.achtergronden.length === 0, `elke achtergrond is svg, nergens een rasterbeeld (${beelden.achtergronden.length} uitzonderingen)`)

  /* ---------- 3c: elke wereld heeft echt materiaal ---------- */
  const zonderMateriaal = []
  for (const wereld of WERELDEN) {
    await ga(`demo=1&tab=leren&wereld=${wereld}`)
    const echt = await ev('document.documentElement.getAttribute("data-wereld")')
    if (echt !== wereld && !(wereld === 'neon' && echt === null)) throw new Error(`wereld klopt niet: ${echt}`)
    const mat = await ev('getComputedStyle(document.documentElement).getPropertyValue("--materiaal")')
    if (typeof mat !== 'string' || mat.indexOf('data:image/svg') < 0) zonderMateriaal.push(wereld)
  }
  eis(zonderMateriaal.length === 0, `alle 16 werelden hebben echt materiaal${zonderMateriaal.length ? ': niet in ' + zonderMateriaal.join(', ') : ''}`)

  /* ---------- 3d: jouw eigen wereld, en die blijft van jou ---------- */
  const draaien = new Map()
  for (const naam of ['blye', 'wesley', 'sofia', 'blye']) {
    await ev(`(() => { const st = JSON.parse(localStorage.getItem('aurea-v1')||'{}'); if (st.state) { st.state.currentUser = ${JSON.stringify(naam)}; localStorage.setItem('aurea-v1', JSON.stringify(st)); } return 1 })()`)
    await ga('tab=leren&wereld=calcada')
    const d = await ev('getComputedStyle(document.documentElement).getPropertyValue("--eigen-draai") + "/" + getComputedStyle(document.documentElement).getPropertyValue("--eigen-maat")')
    if (!draaien.has(naam)) draaien.set(naam, d)
    else eis(draaien.get(naam) === d, `dezelfde speler krijgt altijd dezelfde wereld (${naam}: ${draaien.get(naam)} en ${d})`)
    console.log(`${naam}: ${d}`)
  }
  eis(new Set(draaien.values()).size === 3, `drie spelers krijgen drie verschillende werelden (${new Set(draaien.values()).size})`)
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

console.log(fouten === 0 ? '\nHET ONTWERP KLOPT' : `\n${fouten} PUNTEN STUK`)
process.exit(fouten === 0 ? 0 : 1)
