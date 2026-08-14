/**
 * Legt de gezichtstrekken naast elkaar en controleert dat ze écht verschillen.
 *
 * Acht namen in een lijst zetten is makkelijk. De vraag is of variant 3 er ook
 * anders uitziet dan variant 4. Daarom wordt van elke variant de getekende
 * vorm uit de pagina gehaald en vergeleken: twee varianten die precies
 * dezelfde vorm opleveren zijn geen twee varianten.
 *
 * Gebruik: node scripts/personage-proef.mjs [basis-url]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASIS = (process.argv[2] ?? 'http://localhost:5210/').replace(/\/?$/, '/')
const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

/* Álle onderdelen die punt 1a noemt, en van elk moeten er minstens acht zijn
   die ook echt anders tekenen. Een lijst met acht namen is makkelijk; acht
   verschillende tekeningen is het bewijs. */
const TREKKEN = [
  { sleutel: 'face', naam: 'gezichtsvorm', aantal: 8 },
  { sleutel: 'eyes', naam: 'ogen', aantal: 8 },
  { sleutel: 'brows', naam: 'wenkbrauwen', aantal: 8 },
  { sleutel: 'nose', naam: 'neus', aantal: 8 },
  { sleutel: 'mouth', naam: 'mond', aantal: 8 },
  { sleutel: 'build', naam: 'lichaamsbouw', aantal: 8 },
  { sleutel: 'hair', naam: 'haarmodel', aantal: 10 },
  // huid en haar zijn kleuren, dus die moeten mét kleur worden vergeleken
  { sleutel: 'skin', naam: 'huidtint', aantal: 8, kleur: true },
  { sleutel: 'hairColor', naam: 'haarkleur', aantal: 12, kleur: true },
  { sleutel: 'outfit', naam: 'kledingkleur', aantal: 10, kleur: true },
]

let fouten = 0
const eis = (waar, wat) => {
  console.log(`${waar ? 'OK  ' : 'FOUT'} ${wat}`)
  if (!waar) fouten++
}

/**
 * De vingerafdruk van het getekende personage: alle vormgegevens uit de eerste
 * svg op het scherm. Kleuren blijven erbuiten, want die veranderen ook van de
 * taalwereld; het gaat om de vorm.
 */
const VINGERAFDRUK = [
  '(() => {',
  '  // gericht op de tekening van het personage: die heeft als enige dit',
  '  // viewBox. De eerste svg op het scherm pakken gaf soms een vlag.',
  '  const svg = [...document.querySelectorAll("svg")].find((s) => (s.getAttribute("viewBox") || "").indexOf("200 230") >= 0);',
  '  if (!svg) return "geen personage-svg";',
  '  // álle vormeigenschappen meenemen. Eerder ontbraken y, r en transform, en',
  '  // laat dat nou net de eigenschappen zijn waarmee wenkbrauwen van elkaar',
  '  // verschillen: de meting meldde dubbelen die er niet waren.',
  '  const velden = ["d", "cx", "cy", "r", "rx", "ry", "x", "y", "width", "height", "transform", "points"];',
  '  if (METKLEUR) velden.push("fill", "stroke");',
  '  const delen = [];',
  '  for (const n of svg.querySelectorAll("path, circle, ellipse, rect, polygon, line")) {',
  '    let stuk = n.tagName;',
  '    for (const v of velden) { const a = n.getAttribute(v); if (a) stuk += "|" + v + "=" + a; }',
  '    delen.push(stuk);',
  '  }',
  '  return delen.join("//");',
  '})()',
].join('\n')

/* De vingerafdruk met of zonder kleur. Bij haar- en kledingkleur is de kleur
   juist het verschil; bij een vorm is hij ruis, want dan zou een andere
   taalwereld al voor een andere afdruk zorgen. De vlag wordt hier ingebakken
   en niet op window gezet, want elke navigatie wist dat weer. */
const afdrukVoor = (metKleur) => VINGERAFDRUK.replace('METKLEUR', metKleur ? 'true' : 'false')

const profiel = await mkdtemp(join(tmpdir(), 'persona-'))
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
  /* Elk verzoek krijgt een tijdslimiet. Zonder die limiet blijft het script
     eeuwig wachten zodra de browser eronderuit valt, en dan zie je niet dat er
     iets stuk is maar alleen dat er niets gebeurt. */
  const stuur = (m, p = {}) =>
    new Promise((a, b) => {
      const n = ++id
      open.set(n, [a, b])
      ws.send(JSON.stringify({ id: n, method: m, params: p }))
      setTimeout(() => {
        if (open.has(n)) {
          open.delete(n)
          b(new Error(`geen antwoord op ${m} binnen 20 seconden`))
        }
      }, 20000)
    })
  const ev = async (expr) => {
    const r = await stuur('Runtime.evaluate', { expression: expr, returnByValue: true })
    if (r.exceptionDetails) return 'FOUT: ' + String(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text).slice(0, 140)
    return r.result.value
  }

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  await wacht(2500)

  for (const trek of TREKKEN) {
    const afdrukken = new Map()
    for (let n = 0; n < trek.aantal; n++) {
      await stuur('Page.navigate', { url: `${BASIS}?demo=1&tab=profiel&persona=${trek.sleutel}:${n}` })
      await wacht(1500)
      await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: false })
      await wacht(280)
      const afdruk = await ev(afdrukVoor(trek.kleur))
      if (typeof afdruk !== 'string' || afdruk.startsWith('FOUT') || afdruk === 'geen svg') {
        console.log(`  ${trek.naam} ${n}: ${afdruk}`)
        continue
      }
      const al = afdrukken.get(afdruk)
      if (al !== undefined) console.log(`  ${trek.naam}: variant ${n} tekent precies hetzelfde als variant ${al}`)
      else afdrukken.set(afdruk, n)
    }
    eis(
      afdrukken.size === trek.aantal,
      `${trek.naam}: ${trek.aantal} varianten die allemaal anders tekenen (${afdrukken.size} uniek)`,
    )
  }

  /* en een plaatje van vier heel verschillende personages naast elkaar, want
     een tabel met getallen bewijst niet dat het er ook goed uitziet */
  const POSEN = [
    ['persona-a', 'face:0,eyes:0,brows:0,nose:0,mouth:0,build:0,hair:0,skin:1,hairColor:1'],
    ['persona-b', 'face:2,eyes:1,brows:1,nose:1,mouth:6,build:1,hair:6,skin:5,hairColor:0'],
    ['persona-c', 'face:3,eyes:6,brows:2,nose:6,mouth:5,build:3,hair:7,skin:6,hairColor:9'],
    ['persona-d', 'face:6,eyes:4,brows:7,nose:5,mouth:3,build:4,hair:9,skin:3,hairColor:4'],
  ]
  for (const [naam, vraag] of POSEN) {
    await stuur('Page.navigate', { url: `${BASIS}?demo=1&tab=profiel&persona=${vraag}` })
    await wacht(2100)
    await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
    await wacht(700)
    /* Bewust geen extra vergroting in de uitsnede: schaal 3 bovenop een
       schermdichtheid van 3 vraagt een beeld van negen keer de oppervlakte en
       dan geeft de browser gewoon geen antwoord meer. */
    const s = await stuur('Page.captureScreenshot', {
      format: 'png',
      // alleen de kop van het profiel: daar staat het personage groot in beeld
      clip: { x: 0, y: 0, width: 375, height: 230, scale: 2 },
    })
    await writeFile(`C:/Users/Blye/Desktop/aurea/docs/bewijs/${naam}.png`, Buffer.from(s.data, 'base64'))
    console.log('geschoten:', naam)
  }
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

console.log(fouten === 0 ? '\nDE TREKKEN VERSCHILLEN ECHT' : `\n${fouten} TREKKEN STUK`)
process.exit(fouten === 0 ? 0 : 1)
