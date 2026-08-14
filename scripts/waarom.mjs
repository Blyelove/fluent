/**
 * Wijst aan wáárom een stuk tekst zakt: welke kleur het heeft en welke vlakken
 * eronder liggen. De audit meldt alleen de verhouding; dit laat de stapel zien.
 *
 * Gebruik: node scripts/waarom.mjs "<stuk tekst>" <wereld> <tab> [arena]
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ZOEK = process.argv[2] ?? ''
const WERELD = process.argv[3] ?? 'papier'
const TAB = process.argv[4] ?? 'leren'
const EXTRA = process.argv[5] ? `&${process.argv[5]}` : ''
const POORT = 9300 + (process.pid % 600)
const wacht = (ms) => new Promise((r) => setTimeout(r, ms))

const profiel = await mkdtemp(join(tmpdir(), 'waarom-'))
const edge = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--force-device-scale-factor=1', `--remote-debugging-port=${POORT}`,
  `--user-data-dir=${profiel}`, '--window-size=375,812',
  `http://localhost:5199/?demo=1&tab=${TAB}&wereld=${WERELD}${EXTRA}`,
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
  await stuur('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: false })
  await wacht(3200)

  const r = await stuur('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const zoek = ${JSON.stringify(ZOEK)}
      const treffers = [...document.querySelectorAll('body *')]
        .filter((e) => e.children.length === 0 && (e.textContent || '').includes(zoek))
      if (!treffers.length) return JSON.stringify({ fout: 'niets gevonden voor ' + zoek })
      return JSON.stringify(treffers.slice(0, 2).map((e) => {
        const stapel = []
        let n = e
        while (n && n !== document.documentElement) {
          const cs = getComputedStyle(n)
          stapel.push({
            tag: n.tagName.toLowerCase() + (n.className ? '.' + String(n.className).split(' ').slice(0, 2).join('.') : ''),
            bg: cs.backgroundColor,
            bgi: cs.backgroundImage === 'none' ? '' : cs.backgroundImage.slice(0, 46),
          })
          n = n.parentElement
        }
        return { tekst: (e.textContent || '').trim().slice(0, 30), kleur: getComputedStyle(e).color, stapel: stapel.slice(0, 5) }
      }))
    })()`,
  })
  console.log(r.result.value)
} finally {
  spawn('taskkill', ['/PID', String(edge.pid), '/T', '/F'], { stdio: 'ignore' })
  await wacht(800)
  await rm(profiel, { recursive: true, force: true }).catch(() => {})
}
