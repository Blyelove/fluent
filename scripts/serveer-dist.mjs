/**
 * Serveert de gebouwde app uit dist op poort 5210.
 *
 * De proeven draaiden tot nu toe tegen de ontwikkelserver, en die bouwt bij
 * élke navigatie de hele modulegraaf opnieuw op. Achtenveertig navigaties
 * duurden daardoor minuten in plaats van seconden. De gebouwde versie is
 * bovendien eerlijker: dat is wat een bezoeker echt krijgt.
 *
 * Gebruik: node scripts/serveer-dist.mjs   (stoppen met ctrl+c)
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const POORT = Number(process.argv[2] ?? 5210)

const SOORTEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.webmanifest': 'application/manifest+json',
}

createServer(async (verzoek, antwoord) => {
  try {
    const pad = decodeURIComponent(new URL(verzoek.url, 'http://x').pathname)
    let bestand = join(DIST, pad === '/' ? 'index.html' : pad.replace(/^\/+/, ''))
    try {
      const info = await stat(bestand)
      if (info.isDirectory()) bestand = join(bestand, 'index.html')
    } catch {
      // alles wat geen bestand is hoort bij de app zelf: één pagina, dus terug
      // naar index.html en de app leest de route uit de adresbalk
      bestand = join(DIST, 'index.html')
    }
    const inhoud = await readFile(bestand)
    antwoord.writeHead(200, {
      'Content-Type': SOORTEN[extname(bestand)] ?? 'application/octet-stream',
      // nooit cachen: anders meet je bij de volgende proef de vorige bouw
      'Cache-Control': 'no-store',
    })
    antwoord.end(inhoud)
  } catch (fout) {
    antwoord.writeHead(500)
    antwoord.end(String(fout))
  }
}).listen(POORT, () => console.log(`dist staat op http://localhost:${POORT}/`))
