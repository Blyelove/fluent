/**
 * Sluit de laatste gaten in het bewijs van pijler 1 en 3.
 *
 * Wat hier gemeten wordt, en waarom het niet vanzelf spreekt:
 *
 * 1a. De XP-drop moet omhoog zweven, subtiel. Dat hij bestáát was al gemeten,
 *     maar niet dat hij beweegt. Een drop die stil blijft hangen is geen drop.
 *     Er worden dus drie monsters genomen over ruim een seconde, en de
 *     bovenkant moet duidelijk omhoog zijn gekropen. Twee monsters vlak na
 *     elkaar gaven eerder twee keer exact dezelfde stand en dus een vals
 *     alarm over een drop die het prima deed.
 * 1d. Alles uit de winkel, niets rekent na. Daarom rekent dit script de
 *     RuneScape-curve zélf uit vanuit de opgeslagen XP en legt dat naast wat
 *     het scherm toont. Wijkt er één getal af, dan rekent er ergens iets na.
 * 3.  Dezelfde vaardigheidsmomenten in élke taalwereld, niet alleen in de
 *     wereld die toevallig aanstond.
 *
 * Gebruik: node scripts/pijler-proef.mjs [basis-url]
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

/**
 * De echte RuneScape-curve, hier apart uitgerekend. Als deze en de app
 * hetzelfde antwoord geven, dan komt het getal op het scherm uit de opgeslagen
 * XP en niet uit een teller die ergens meeloopt.
 */
const SCHAAL = 217
function xpTabel() {
  const cum = [0, 0]
  let punten = 0
  for (let l = 1; l <= 98; l++) {
    punten += Math.floor(l + 300 * Math.pow(2, l / 7))
    cum.push(Math.max(Math.floor(punten / 4 / SCHAAL), cum[cum.length - 1] + 1))
  }
  return cum
}
const TABEL = xpTabel()
function niveauVan(xp) {
  let l = 1
  while (l < 99 && xp >= TABEL[l + 1]) l++
  return l
}

/**
 * Leest de zwevende XP-drops. Bewust zonder reguliere expressie: die moest
 * door twee lagen ontsnapping heen en kwam er een keer als /^+d+ xp$/ uit,
 * wat de meting liet klappen in plaats van iets te meten.
 */
const LEES_DROPS = [
  '(() => {',
  '  const alle = [...document.querySelectorAll("*")].filter((x) => {',
  '    const t = (x.textContent || "").trim();',
  '    return x.children.length === 0 && t.startsWith("+") && t.endsWith("xp");',
  '  });',
  '  if (!alle.length) return JSON.stringify({ gevonden: 0, top: null, grootte: null, opacity: null, tekst: "" });',
  '  const n = alle[0];',
  '  const r = n.getBoundingClientRect();',
  '  return JSON.stringify({',
  '    gevonden: alle.length,',
  '    top: Math.round(r.top * 100) / 100,',
  '    grootte: parseFloat(getComputedStyle(n).fontSize),',
  '    opacity: Number(getComputedStyle(n).opacity),',
  '    tekst: n.textContent.trim(),',
  '  });',
  '})()',
].join('\n')

/** drukt op de afspeelknop van de XP-drop in de proeverij: een echte boeking */
const SPEEL_DROP_AF = [
  '(() => {',
  '  const knoppen = [...document.querySelectorAll("button")];',
  '  const af = knoppen.find((b) => /Speel af/.test(b.textContent || ""));',
  '  if (af) { af.click(); return "gespeeld"; }',
  '  const moment = knoppen.find((b) => /Momenten en effecten/.test(b.textContent || ""));',
  '  if (moment) { moment.click(); return "paneel geopend"; }',
  '  const inst = knoppen.find((b) => /Instellingen/.test(b.textContent || ""));',
  '  if (inst) { inst.click(); return "instellingen geopend"; }',
  '  return "niets gevonden";',
  '})()',
].join('\n')

const profiel = await mkdtemp(join(tmpdir(), 'pijler-'))
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
    await wacht(2200)
    await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: schaal, mobile: false })
    await wacht(500)
  }

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  await wacht(2500)

  /* ---------- 1d: rekent er iets na? ---------- */
  await ga('demo=1&tab=profiel', 1)
  const opgeslagen = JSON.parse(await ev([
    '(() => {',
    '  const st = JSON.parse(localStorage.getItem("aurea-v1") || "{}");',
    '  const p = (st.state && st.state.progress) || {};',
    '  const uit = {};',
    '  for (const k of Object.keys(p)) uit[k] = p[k].xp || 0;',
    '  return JSON.stringify(uit);',
    '})()',
  ].join('\n')))
  /* De vaardigheidstegels dragen hun niveau in hun aria-label ("Spaans:
     niveau 74 van 99"). Dat is de betrouwbaarste bron: op de zichtbare tekst
     zoeken ging mis omdat de vlag geen img en geen svg is, en op losse cijfers
     zoeken vangt ook getallen die er niet bij horen. */
  const opScherm = JSON.parse(await ev([
    '(() => {',
    '  const uit = [];',
    '  for (const b of document.querySelectorAll("button[aria-label]")) {',
    '    const m = b.getAttribute("aria-label").match(/niveau ([0-9]+) van 99/);',
    '    if (m) uit.push(Number(m[1]));',
    '  }',
    '  return JSON.stringify(uit);',
    '})()',
  ].join('\n')))
  const verwacht = ['en', 'es', 'fr', 'de', 'it', 'pt'].map((k) => niveauVan(opgeslagen[k] ?? 0))
  const getoond = opScherm
  console.log('opgeslagen XP:', JSON.stringify(opgeslagen))
  console.log('zelf uitgerekend:', verwacht.join(', '), '| op het scherm:', getoond.join(', '))
  eis(getoond.length >= 6, `het raster toont zes vaardigheden (${getoond.length})`)
  eis(
    verwacht.every((n) => getoond.includes(n)),
    'elk niveau op het scherm komt uit de opgeslagen XP, dus er rekent niets na',
  )

  /* ---------- 1a: zweeft de drop echt omhoog, en subtiel ---------- */
  await ga('demo=1&tab=profiel', 1)
  // eerst het paneel openen, dán pas de boeking doen: anders gaat de wachttijd
  // van het openen van je meetvenster af en mis je de hele vlucht
  for (let poging = 0; poging < 3; poging++) {
    const uit = await ev(SPEEL_DROP_AF)
    if (uit === 'gespeeld') break
    await wacht(900)
  }
  /* Meteen bemonsteren en dan nog twee keer. De drop duurt 1,1 seconde, dus
     wie eerst zevenhonderd milliseconde wacht en dán twee monsters vlak na
     elkaar neemt, meet twee keer hetzelfde en concludeert dat hij stilstaat. */
  const baan = []
  for (let i = 0; i < 3; i++) {
    baan.push(JSON.parse(await ev(LEES_DROPS)))
    await wacht(420)
  }
  console.log('baan van de drop:', baan.map((m) => `top=${m.top} op=${m.opacity}`).join('  ->  '))
  const start = baan[0]
  const laatste = baan.filter((m) => m.top !== null).pop()
  eis(start.gevonden > 0, `er staat een XP-drop in beeld (${start.tekst || 'niets'})`)
  eis(
    start.top !== null && laatste && laatste.top < start.top - 4,
    `de drop zweeft omhoog (${start.top} naar ${laatste ? laatste.top : 'weg'})`,
  )
  eis(start.grootte !== null && start.grootte <= 24, `de drop blijft subtiel (${start.grootte}px)`)
  eis(start.gevonden <= 6, `hoogstens een handvol drops tegelijk (${start.gevonden})`)
  const s = await stuur('Page.captureScreenshot', { format: 'png' })
  await writeFile('C:/Users/Blye/Desktop/aurea/docs/bewijs/xpdrop-zweeft.png', Buffer.from(s.data, 'base64'))

  /* ---------- 3: de mantel in élke taalwereld ---------- */
  const zonderMantel = []
  for (const wereld of WERELDEN) {
    // met geduld opnieuw proberen: een trage start levert soms een pagina op
    // die de wereld nog niet heeft gezet, en dan meet je de verkeerde
    let echt = null
    for (let poging = 0; poging < 3 && echt !== wereld; poging++) {
      await ga(`meester=1&tab=leren&wereld=${wereld}`, 1)
      await wacht(poging * 1200)
      echt = await ev('document.documentElement.getAttribute("data-wereld")')
    }
    if (echt !== wereld) throw new Error(`wereld bleef ${echt} in plaats van ${wereld}`)
    const aantal = await ev('[...document.querySelectorAll("[fill]")].filter((n) => (n.getAttribute("fill") || "").indexOf("meester-") >= 0).length')
    if (!aantal) zonderMantel.push(wereld)
  }
  eis(zonderMantel.length === 0, `de meestermantel hangt in alle 16 werelden${zonderMantel.length ? ': niet in ' + zonderMantel.join(', ') : ''}`)
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

console.log(fouten === 0 ? '\nPIJLERS KLOPPEN' : `\n${fouten} PUNTEN STUK`)
process.exit(fouten === 0 ? 0 : 1)
