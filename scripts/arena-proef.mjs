/**
 * Speelt een echt potje in de arena en legt de schildbreuk vast.
 *
 * Waarom een script en geen handmatige klik: de breuk duurt een halve
 * seconde, en die moet je precies op het juiste moment fotograferen. Het
 * script antwoordt bewust fout, wacht een paar frames en schiet dan.
 *
 * Gebruik: node scripts/arena-proef.mjs <breukstijl> [wereld]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const STIJL = process.argv[2] ?? 'scherven'
const WERELD = process.argv[3] ?? 'neon'
const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

const profiel = await mkdtemp(join(tmpdir(), 'arena-proef-'))
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-device-scale-factor=1', `--remote-debugging-port=${POORT}`,
  `--user-data-dir=${profiel}`, '--window-size=375,812',
  'http://localhost:5199/?demo=1&tab=leren',
])
edge.stderr.on('data', () => {})

try {
  let doel
  for (let i = 0; i < 40 && !doel; i++) {
    try {
      const l = await fetch(`http://127.0.0.1:${POORT}/json/list`).then((r) => r.json())
      doel = l.find((t) => t.type === 'page' && t.webSocketDebuggerUrl && t.url.includes('localhost:5199'))
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
  const evalueer = async (expr) => (await stuur('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value

  await stuur('Page.enable')
  await stuur('Runtime.enable')
  await wacht(2500)

  await stuur('Page.navigate', { url: `http://localhost:5199/?demo=1&tab=spelen&arena=1&breuk=${STIJL}&wereld=${WERELD}` })
  await wacht(2200)
  await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: false })
  // de opkomst telt af; die tijd moeten we gewoon uitzitten
  await wacht(5200)

  const lees = async () =>
    JSON.parse(
      await evalueer(`JSON.stringify({
        wereld: document.documentElement.getAttribute('data-wereld'),
        schilden: [...document.querySelectorAll('[aria-label$="schilden over"]')].map((n) => n.getAttribute('aria-label')),
        knoppen: [...document.querySelectorAll('.opt')].length,
        stemming: (document.body.innerText.match(/(aarzelt…|ruikt bloed|denkt na…)/) || [null])[0],
      })`),
    )

  const begin = await lees()
  console.log('bij aanvang:', JSON.stringify(begin))
  if (begin.wereld !== WERELD) throw new Error(`wereld klopt niet: ${begin.wereld}`)

  /* Bewust net zolang doorspelen tot er écht een schild sneuvelt. Een gokje
     kan toevallig goed zijn, en dan breekt er niets en fotografeer je een
     leeg moment. De klap komt meteen na een fout antwoord, dus 180 ms later
     zit je midden in de animatie. */
  const stemmingen = new Set()
  let geraakt = false
  for (let ronde = 0; ronde < 10 && !geraakt; ronde++) {
    const voor = await lees()
    if (!voor.knoppen) break
    await evalueer(`(() => { const b = document.querySelectorAll('.opt')[${ronde % 4}]; if (b) b.click(); return 1 })()`)
    await wacht(150)
    const na = await lees()
    if (JSON.stringify(na.schilden) !== JSON.stringify(voor.schilden)) {
      // eerst nakijken of de breuk écht in de DOM staat; een foto van niets
      // ziet er precies hetzelfde uit als een foto van een kapotte animatie
      const bewijs = await evalueer(`JSON.stringify((() => {
        const rij = document.querySelector('[aria-label$="schilden over"]')
        const vak = [...rij.children].find((v) => v.children.length > 1)
        if (!vak) return { fout: 'geen brekend vakje' }
        const laag = vak.children[1]
        const scherven = [...laag.children].map((n) => {
          const r = n.getBoundingClientRect()
          const cs = getComputedStyle(n)
          return { x: Math.round(r.left), y: Math.round(r.top), b: Math.round(r.width), h: Math.round(r.height), op: cs.opacity, tr: cs.transform.slice(0, 34) }
        })
        // knipt een voorouder ze weg?
        const knippers = []
        let n = vak
        while (n && n !== document.documentElement) {
          const cs = getComputedStyle(n)
          if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') knippers.push(n.tagName + '.' + String(n.className).slice(0, 24) + ':' + cs.overflow)
          n = n.parentElement
        }
        return { aantal: scherven.length, scherven: scherven.slice(0, 4), knippers }
      })())`)
      console.log('  in de DOM:', bewijs)
      /* Een reeks frames in plaats van één moment: de breuk duurt zes tiende
         seconde en één schot valt makkelijk net ervoor of erna. Bij elk frame
         wordt ook geteld hoeveel scherven er dan echt staan, zodat een lege
         foto niet als bewijs kan doorgaan. */
      for (let f = 0; f < 5; f++) {
        const tel = await evalueer(`(() => {
          const rij = document.querySelector('[aria-label$="schilden over"]')
          const vak = [...rij.children].find((v) => v.children.length > 1)
          if (!vak) return 0
          return [...vak.children[1].children].filter((n) => Number(getComputedStyle(n).opacity) > 0.15).length
        })()`)
        const s = await stuur('Page.captureScreenshot', { format: 'png' })
        await writeFile(`C:/Users/Blye/Desktop/aurea/docs/bewijs/breuk-${STIJL}-${f}.png`, Buffer.from(s.data, 'base64'))
        console.log(`  frame ${f}: ${tel} zichtbare delen`)
        await wacht(90)
      }
      console.log(`klap in ronde ${ronde + 1}: ${voor.schilden} -> ${na.schilden}`)
      geraakt = true
    }
    // de beurt van de tegenstander uitzitten en zijn stemming opvangen
    for (let t = 0; t < 14; t++) {
      await wacht(320)
      const tussen = await lees()
      if (tussen.stemming) stemmingen.add(tussen.stemming)
      if (tussen.knoppen && !tussen.stemming) break
    }
  }
  console.log('gedrag gezien:', [...stemmingen].join(', ') || 'niets opgevangen')
  console.log(geraakt ? `geschoten: breuk-${STIJL}` : 'geen enkele klap gevallen')
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(800)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}
