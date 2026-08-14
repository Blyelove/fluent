/**
 * Speelt de hele lus van het schaduwduel na en controleert of hij klopt.
 *
 * 1. een potje spelen tot de uitslag (met ?matchpoint=1 duurt dat één slag)
 * 2. de uitdagingslink afvangen die de knop naar het klembord schrijft
 * 3. die link openen als de vriend, en nakijken of de tegenstander de schaduw
 *    is en of de vragen écht dezelfde zijn
 *
 * Zonder stap 3 weet je alleen dat er een link uitkomt, niet dat hij werkt.
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))
const BASIS = process.argv[2] ?? 'http://localhost:5199/'

const profiel = await mkdtemp(join(tmpdir(), 'schaduw-'))
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-device-scale-factor=1', `--remote-debugging-port=${POORT}`,
  `--user-data-dir=${profiel}`, '--window-size=375,812', `${BASIS}?demo=1&tab=leren`,
])
edge.stderr.on('data', () => {})

let fouten = 0
const eis = (waar, wat) => {
  console.log(`${waar ? 'OK  ' : 'FOUT'} ${wat}`)
  if (!waar) fouten++
}

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

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  await wacht(2500)

  /* ---------- 1. een potje spelen ---------- */
  await stuur('Page.navigate', { url: `${BASIS}?demo=1&tab=spelen&arena=1&matchpoint=1` })
  await wacht(2200)
  await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
  // het klembord aftappen vóórdat er iets te kopiëren valt
  await ev(`(() => {
    window.__gekopieerd = null
    try { Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }) } catch {}
    try {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: (t) => { window.__gekopieerd = t; return Promise.resolve() } },
        configurable: true,
      })
    } catch {}
    return 1
  })()`)
  await wacht(5200)

  const eersteVraag = await ev(`(() => {
    const k = document.querySelector('.display')
    return JSON.stringify({
      vraag: [...document.querySelectorAll('h2, .display')].map((n) => n.textContent.trim()).filter(Boolean).slice(0, 3),
      opties: [...document.querySelectorAll('.opt')].map((b) => b.textContent.trim()),
    })
  })()`)
  console.log('eerste vraag:', eersteVraag)

  // met matchpoint staan beide op één schild: één slag beslist het potje
  for (let ronde = 0; ronde < 6; ronde++) {
    const knoppen = await ev(`document.querySelectorAll('.opt').length`)
    if (!knoppen) break
    await ev(`(() => { const b = document.querySelectorAll('.opt')[${ronde % 4}]; if (b) b.click(); return 1 })()`)
    await wacht(2600)
  }
  await wacht(2600)

  const uitslag = await ev(`JSON.stringify({
    tekst: (document.body.innerText || '').replace(/\\n+/g, ' | ').slice(0, 130),
    knoppen: [...document.querySelectorAll('button')].map((b) => b.textContent.trim()),
  })`)
  console.log('uitslag:', uitslag)
  eis(/Overwinning|verloren/.test(uitslag), 'het potje kwam tot een uitslag')

  /* ---------- 2. de uitdaging afvangen ---------- */
  await ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Daag een vriend uit')); if (b) b.click(); return !!b })()`)
  await wacht(700)
  const gekopieerd = await ev(`window.__gekopieerd`)
  eis(typeof gekopieerd === 'string' && gekopieerd.includes('?schaduw='), 'er komt een uitdagingslink uit')
  if (typeof gekopieerd !== 'string') throw new Error('geen link om verder te testen')
  const link = gekopieerd.match(/https?:\/\/\S+/)[0]
  console.log('link lengte:', link.length)

  const s1 = await stuur('Page.captureScreenshot', { format: 'png' })
  await writeFile('C:/Users/Blye/Desktop/aurea/docs/bewijs/schaduw-uitdaging.png', Buffer.from(s1.data, 'base64'))

  /* ---------- 3. de link openen als de vriend ---------- */
  await stuur('Page.navigate', { url: link })
  await wacht(2600)
  await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
  await wacht(600)
  const opkomst = await ev(`JSON.stringify({
    tekst: (document.body.innerText || '').replace(/\\n+/g, ' | ').slice(0, 200),
    adres: location.search,
  })`)
  console.log('opkomst bij de vriend:', opkomst)
  eis(!/schaduw=/.test(JSON.parse(opkomst).adres), 'de code is uit de adresbalk gehaald')
  eis(/Uitdager|Speelde precies deze vragen/.test(opkomst), 'de tegenstander is de schaduw van de uitdager')

  const s2 = await stuur('Page.captureScreenshot', { format: 'png' })
  await writeFile('C:/Users/Blye/Desktop/aurea/docs/bewijs/schaduw-opkomst.png', Buffer.from(s2.data, 'base64'))

  await wacht(5200)
  const vraagBijVriend = await ev(`JSON.stringify({
    vraag: [...document.querySelectorAll('h2, .display')].map((n) => n.textContent.trim()).filter(Boolean).slice(0, 3),
    opties: [...document.querySelectorAll('.opt')].map((b) => b.textContent.trim()),
  })`)
  console.log('vraag bij de vriend:', vraagBijVriend)
  eis(vraagBijVriend === eersteVraag, 'de vriend krijgt exact dezelfde vraag en dezelfde volgorde van opties')

  const s3 = await stuur('Page.captureScreenshot', { format: 'png' })
  await writeFile('C:/Users/Blye/Desktop/aurea/docs/bewijs/schaduw-gevecht.png', Buffer.from(s3.data, 'base64'))
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(900)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

console.log(fouten === 0 ? '\nSCHADUWDUEL KLOPT' : `\n${fouten} PUNTEN STUK`)
process.exit(fouten === 0 ? 0 : 1)
