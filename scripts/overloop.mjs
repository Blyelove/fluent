/**
 * Wijst aan wélk element buiten het scherm steekt. De audit meldt alleen dát
 * er horizontaal gescrold kan worden; dit zoekt de schuldige op.
 *
 * Gebruik: node scripts/overloop.mjs [breedte] [tab]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BREEDTE = Number(process.argv[2] ?? 375)
const TAB = process.argv[3] ?? 'leren'
const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

const profiel = await mkdtemp(join(tmpdir(), 'overloop-'))
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-device-scale-factor=1', `--remote-debugging-port=${POORT}`,
  `--user-data-dir=${profiel}`, `--window-size=${BREEDTE},812`,
  `http://localhost:5199/?demo=1&tab=${TAB}`,
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

  await stuur('Runtime.enable')
  await stuur('Emulation.setDeviceMetricsOverride', { width: BREEDTE, height: 812, deviceScaleFactor: 1, mobile: false })
  await wacht(3000)
  await stuur('Emulation.setDeviceMetricsOverride', { width: BREEDTE, height: 812, deviceScaleFactor: 1, mobile: false })
  await wacht(400)

  const r = await stuur('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const breed = document.documentElement.clientWidth
      const uit = []
      document.querySelectorAll('body *').forEach((e) => {
        const r = e.getBoundingClientRect()
        if (r.width < 2 || r.height < 2) return
        // alleen wat écht rechts buiten beeld steekt, met een marge van 1px
        if (r.right <= breed + 1 && r.left >= -1) return
        const cs = getComputedStyle(e)
        if (cs.position === 'fixed') return
        uit.push({
          tag: e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ').slice(0, 2).join('.') : ''),
          links: Math.round(r.left), rechts: Math.round(r.right), breedte: Math.round(r.width),
          tekst: (e.textContent || '').trim().slice(0, 24),
          ouder: e.parentElement ? e.parentElement.tagName.toLowerCase() + '.' + String(e.parentElement.className).split(' ').slice(0, 2).join('.') : '',
          ouderOverflow: e.parentElement ? getComputedStyle(e.parentElement).overflowX : '',
        })
      })
      // de buitenste schuldigen eerst: een kind van een te breed blok telt niet apart
      const voor = window.scrollX
      window.scrollTo(600, window.scrollY)
      const naScroll = window.scrollX
      window.scrollTo(voor, window.scrollY)
      const csHtml = getComputedStyle(document.documentElement)
      const csBody = getComputedStyle(document.body)
      return JSON.stringify({
        breed, scrollBreed: document.documentElement.scrollWidth, aantal: uit.length,
        naScroll, htmlOverflow: csHtml.overflowX + '/' + csHtml.overflowY,
        bodyOverflow: csBody.overflowX + '/' + csBody.overflowY, bodyScrollBreed: document.body.scrollWidth,
        eerste: uit.slice(0, 3),
      })
    })()`,
  })
  console.log(r.result.value)
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(800)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}
