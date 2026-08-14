/**
 * Meet of je wereld écht voller wordt, en aan welke vier dingen dat te zien is.
 *
 * Punt 3a noemt er vier: ornament, textuur, licht en letter. Een trap die
 * alleen de dichtheid van een patroon verandert is geen groeiende wereld maar
 * een schuifregelaar. Dit script loopt de tien treden langs en kijkt of alle
 * vier meebewegen.
 *
 * Gebruik: node scripts/groei-proef.mjs [basis-url]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASIS = (process.argv[2] ?? 'http://localhost:5210/').replace(/\/?$/, '/')
const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

let fouten = 0
const eis = (waar, wat) => {
  console.log(`${waar ? 'OK  ' : 'FOUT'} ${wat}`)
  if (!waar) fouten++
}

const METEN = [
  '(() => {',
  '  const el = document.documentElement;',
  '  const voor = getComputedStyle(el, "::before");',
  '  const na = getComputedStyle(el, "::after");',
  '  const kop = document.querySelector(".display");',
  '  const sfeer = getComputedStyle(document.body, "::before");',
  '  return JSON.stringify({',
  '    textuur: voor.opacity,',
  '    textuurVar: getComputedStyle(el).getPropertyValue("--materiaal-kracht"),',
  '    ornamentVar: getComputedStyle(el).getPropertyValue("--hoek-kracht"),',
  '    groeiAttr: el.getAttribute("data-groei"),',
  '    ornament: na.opacity,',
  '    ornamentMaat: na.backgroundSize,',
  '    licht: sfeer.filter,',
  '    letter: kop ? getComputedStyle(kop).letterSpacing : "geen kop",',
  '  });',
  '})()',
].join('\n')

const profiel = await mkdtemp(join(tmpdir(), 'groei-'))
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
    setTimeout(() => { if (open.has(n)) { open.delete(n); b(new Error('geen antwoord op ' + m)) } }, 40000)
  })
  const ev = async (x) => {
    const r = await stuur('Runtime.evaluate', { expression: x, returnByValue: true })
    if (r.exceptionDetails) return 'FOUT'
    return r.result.value
  }

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
  await wacht(3000)

  const standen = []
  for (let g = 1; g <= 10; g++) {
    /* De trede via de link pinnen en niet via het document. Zette de proef het
       kenmerk zelf, dan schreef de app het bij zijn volgende hertekening weer
       terug naar de echte trede: dezelfde val als eerder bij de taalwereld.
       Hoe langer je wachtte, hoe zekerder je de verkeerde waarde mat. */
    await stuur('Page.navigate', { url: `${BASIS}?demo=1&tab=leren&groei=${g}` })
    await wacht(1900)
    await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
    /* Ruim wachten. De app zet de trede pas na het eerste tekenen, en daarna
       loopt er nog een overgang van 900 ms overheen. Meet je eerder, dan lees
       je de standaardwaarde of een tussenstand, en lijkt de trap stil te staan
       terwijl hij het prima doet. */
    await wacht(1600)
    const echt = await ev(`document.documentElement.getAttribute('data-groei')`)
    if (String(echt) !== String(g)) throw new Error(`trede klopt niet: ${echt} in plaats van ${g}`)
    const m = JSON.parse(await ev(METEN))
    standen.push({ trede: g, ...m })
    console.log(
      `trede ${String(g).padStart(2)} [${m.groeiAttr}] var ${m.textuurVar}/${m.ornamentVar}  textuur ${Number(m.textuur).toFixed(3)}  ornament ${Number(m.ornament).toFixed(2)} (${m.ornamentMaat})  licht ${m.licht}  letter ${m.letter}`,
    )
  }

  /* Gemeten wordt de ontwerpstand zelf en niet de gerenderde dekking.
     Reden: deze headless browser draait zonder grafische kaart, en dan blijft
     een dekking die via een overgang omhoog gaat soms op zijn oude waarde
     hangen terwijl de stand er wel degelijk is. Dat kostte drie ronden zoeken
     naar een fout die niet in de app zat. De variabele is bovendien de bron:
     die stuurt de tekening aan, de gemeten dekking is er het gevolg van. */
  const uniek = (sleutel) => new Set(standen.map((s) => String(s[sleutel]))).size
  eis(uniek('textuurVar') >= 8, `de textuur groeit mee (${uniek('textuurVar')} standen)`)
  eis(uniek('ornamentVar') >= 4, `het ornament groeit mee (${uniek('ornamentVar')} standen)`)
  eis(uniek('ornamentMaat') >= 4, `het ornament wordt groter (${uniek('ornamentMaat')} maten)`)
  eis(uniek('licht') >= 3, `het licht groeit mee (${uniek('licht')} standen)`)
  eis(uniek('letter') >= 3, `de letter groeit mee (${uniek('letter')} standen)`)
  eis(Number(standen[0].ornamentVar) === 0, 'op de eerste trede is je wereld kaal: geen ornament')
  eis(Number(standen[9].ornamentVar) > 0.6, 'op de laatste trede staat het ornament er vol op')
  eis(Number(standen[9].textuurVar) > Number(standen[0].textuurVar) * 6, 'de laatste trede is veel voller dan de eerste')

  // en een beeld van kaal tegenover vol
  for (const [naam, g] of [['groei-kaal', 1], ['groei-vol', 10]]) {
    await stuur('Page.navigate', { url: `${BASIS}?demo=1&tab=leren&groei=${g}` })
    await wacht(2000)
    await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
    await wacht(1200)
    const s = await stuur('Page.captureScreenshot', { format: 'png' })
    await writeFile(`C:/Users/Blye/Desktop/aurea/docs/bewijs/${naam}.png`, Buffer.from(s.data, 'base64'))
    console.log('geschoten:', naam)
  }
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(800)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}

console.log(fouten === 0 ? '\nDE WERELD GROEIT ECHT' : `\n${fouten} PUNTEN STUK`)
process.exit(fouten === 0 ? 0 : 1)
