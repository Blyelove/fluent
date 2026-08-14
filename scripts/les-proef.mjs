/**
 * Speelt een echte les en controleert of de XP-momenten werkelijk gebeuren.
 *
 * Punt 1 van het doel staat op papier als gebouwd, maar dat werd van de Arena
 * ook gedacht voordat het gemeten werd. Dit script kijkt niet naar de code
 * maar naar het scherm: valt er een XP-drop na een goed antwoord, en staat het
 * vaardigheidsraster met de RuneScape-doelen op het profiel.
 *
 * Gebruik: node scripts/les-proef.mjs [basis-url]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASIS = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/')
const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

let fouten = 0
const eis = (waar, wat) => {
  console.log(`${waar ? 'OK  ' : 'FOUT'} ${wat}`)
  if (!waar) fouten++
}

// De losse stukjes paginacode staan hier als gewone strings, niet in geneste
// sjabloonliteralen: dubbel ontsnappen ging een keer mis en dan meet je een
// kapot script in plaats van de app.
const LEES_STAND = [
  '(() => {',
  '  const knoppen = [...document.querySelectorAll("button")].map((b) => b.textContent.trim()).filter(Boolean);',
  '  return JSON.stringify({',
  '    opties: document.querySelectorAll(".opt").length,',
  '    knoppen: knoppen.slice(0, 7),',
  '    tekst: (document.body.innerText || "").replace(/\\s+/g, " ").slice(0, 110),',
  '  });',
  '})()',
].join('\n')

const KLIK_DOOR = [
  '(() => {',
  '  const b = [...document.querySelectorAll("button")].find((x) =>',
  '    /Begrepen|Verder|Volgende|Doorgaan|Check|Nakijken|Snap|Start/.test(x.textContent));',
  '  if (b) b.click();',
  '  return !!b;',
  '})()',
].join('\n')

const ZOEK_DROP = [
  '(() => {',
  '  const m = (document.body.innerText || "").match(/\\+\\s?\\d+(\\s?XP)?/);',
  '  return m ? m[0] : null;',
  '})()',
].join('\n')

const profiel = await mkdtemp(join(tmpdir(), 'les-'))
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
  const stand = async () => JSON.parse(await ev(LEES_STAND))

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  await wacht(3000)
  await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
  await wacht(600)

  const voorXp = await ev('(() => { const st = JSON.parse(localStorage.getItem("aurea-v1") || "{}"); return (st.state && st.state.progress && st.state.progress.es && st.state.progress.es.xp) || -1 })()')
  eis(voorXp > 0, `het demoprofiel heeft XP om mee te rekenen (${voorXp})`)

  await ev(KLIK_DOOR)
  await wacht(2600)

  /* Een les begint met woordkaarten zonder antwoordknoppen. Eerst doorklikken
     tot er echt iets te beantwoorden valt, anders meet je een kaart die geen
     XP kan opleveren en denk je dat de drop stuk is. Dat kostte de eerste
     poging een vals alarm. */
  let inOefening = null
  for (let i = 0; i < 14 && !inOefening; i++) {
    const nu = await stand()
    if (nu.opties > 0) { inOefening = nu; break }
    if (!(await ev(KLIK_DOOR))) break
    await wacht(900)
  }
  console.log('eerste echte oefening:', JSON.stringify(inOefening))
  eis(!!inOefening, 'de les komt bij een oefening met antwoordknoppen')

  /* Alle opties langs tot er een goed antwoord tussen zit. Na een goed
     antwoord hoort er een XP-drop in beeld te komen. */
  let drop = null
  for (let ronde = 0; ronde < 20 && !drop; ronde++) {
    const nu = await stand()
    if (nu.opties > 0) {
      await ev(`(() => { const k = [...document.querySelectorAll(".opt")]; const b = k[${ronde} % k.length]; if (b) b.click(); return 1 })()`)
      await wacht(260)
      drop = await ev(ZOEK_DROP)
      if (drop) break
    }
    await ev(KLIK_DOOR)
    await wacht(800)
  }
  eis(!!drop, `er verschijnt een XP-drop na een goed antwoord (${drop ?? 'niets gezien'})`)
  const s1 = await stuur('Page.captureScreenshot', { format: 'png' })
  await writeFile('C:/Users/Blye/Desktop/aurea/docs/bewijs/les-xpdrop.png', Buffer.from(s1.data, 'base64'))

  /* ---------- het vaardigheidsraster op het profiel ---------- */
  await stuur('Page.navigate', { url: `${BASIS}?demo=1&tab=profiel` })
  await wacht(2600)
  await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
  await wacht(600)
  const raster = JSON.parse(await ev([
    '(() => {',
    '  const t = document.body.innerText || "";',
    '  return JSON.stringify({',
    '    negenennegentig: (t.match(/99/g) || []).length,',
    '    totaal: /Totaalniveau/.test(t),',
    '    arena: /Arena/.test(t),',
    '  });',
    '})()',
  ].join('\n')))
  console.log('vaardigheidsraster:', JSON.stringify(raster))
  eis(raster.negenennegentig >= 6, `elke taal toont 99 als doel (${raster.negenennegentig} keer)`)
  eis(raster.totaal, 'het totaalniveau staat op het profiel')
  eis(raster.arena, 'de arenarang staat op het profiel')
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

console.log(fouten === 0 ? '\nPIJLER 1 KLOPT' : `\n${fouten} PUNTEN STUK`)
process.exit(fouten === 0 ? 0 : 1)
