/**
 * Deelbare resultaatplaatjes, volledig in de browser getekend met canvas.
 * Geen server en geen extra pakketten nodig: we tekenen een kaart, en delen
 * die via het deelvenster van de telefoon. Kan dat niet (bijvoorbeeld op een
 * gewone desktopbrowser), dan downloadt de afbeelding gewoon.
 */

export interface DeelKaart {
  /** Groot symbool bovenaan, bijvoorbeeld 🔥 of 🏆 */
  icoon: string
  /** Het getal waar het om gaat */
  waarde: string
  /** Wat dat getal betekent, bijvoorbeeld "dagen op rij" */
  label: string
  /** Regel eronder, bijvoorbeeld "Spaans · Niveau 3 · Reiziger" */
  onderschrift: string
  /** Tekst die meegaat bij het delen */
  bericht: string
}

const BREEDTE = 1080
const HOOGTE = 1350
const LINK = 'blyelove.github.io/fluent'

function rondeRechthoek(ctx: CanvasRenderingContext2D, x: number, y: number, b: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + b, y, x + b, y + h, r)
  ctx.arcTo(x + b, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + b, y, r)
  ctx.closePath()
}

/** Tekent de kaart en geeft hem terug als PNG */
export async function tekenKaart(k: DeelKaart): Promise<Blob | null> {
  try {
    await document.fonts.ready
  } catch {
    /* lettertypen niet beschikbaar — we vallen terug op systeemletters */
  }

  const canvas = document.createElement('canvas')
  canvas.width = BREEDTE
  canvas.height = HOOGTE
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // achtergrond
  ctx.fillStyle = '#0E0B1F'
  ctx.fillRect(0, 0, BREEDTE, HOOGTE)

  // neon-gloed linksboven en rechtsonder
  const gloed1 = ctx.createRadialGradient(180, 120, 0, 180, 120, 900)
  gloed1.addColorStop(0, 'rgba(168, 85, 247, 0.55)')
  gloed1.addColorStop(1, 'rgba(168, 85, 247, 0)')
  ctx.fillStyle = gloed1
  ctx.fillRect(0, 0, BREEDTE, HOOGTE)

  const gloed2 = ctx.createRadialGradient(950, 1250, 0, 950, 1250, 850)
  gloed2.addColorStop(0, 'rgba(236, 72, 153, 0.45)')
  gloed2.addColorStop(1, 'rgba(236, 72, 153, 0)')
  ctx.fillStyle = gloed2
  ctx.fillRect(0, 0, BREEDTE, HOOGTE)

  // kaartvlak
  ctx.save()
  rondeRechthoek(ctx, 80, 150, BREEDTE - 160, HOOGTE - 380, 56)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.055)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()

  ctx.textAlign = 'center'

  // merknaam
  const merk = ctx.createLinearGradient(400, 0, 680, 0)
  merk.addColorStop(0, '#A855F7')
  merk.addColorStop(1, '#EC4899')
  ctx.fillStyle = merk
  ctx.font = '800 74px "Baloo 2", system-ui, sans-serif'
  ctx.fillText('Fluent', BREEDTE / 2, 300)

  // icoon
  ctx.font = '150px system-ui, "Segoe UI Emoji", sans-serif'
  ctx.fillText(k.icoon, BREEDTE / 2, 500)

  // grote waarde in goud
  const goud = ctx.createLinearGradient(0, 540, 0, 720)
  goud.addColorStop(0, '#FFE08A')
  goud.addColorStop(1, '#FFB300')
  ctx.fillStyle = goud
  ctx.font = '800 200px "Baloo 2", system-ui, sans-serif'
  ctx.fillText(k.waarde, BREEDTE / 2, 720)

  // label
  ctx.fillStyle = '#F5F3FF'
  ctx.font = '600 60px "Instrument Sans", system-ui, sans-serif'
  ctx.fillText(k.label, BREEDTE / 2, 810)

  // scheidingslijntje
  const lijn = ctx.createLinearGradient(BREEDTE / 2 - 90, 0, BREEDTE / 2 + 90, 0)
  lijn.addColorStop(0, '#A855F7')
  lijn.addColorStop(1, '#EC4899')
  ctx.fillStyle = lijn
  rondeRechthoek(ctx, BREEDTE / 2 - 90, 862, 180, 8, 4)
  ctx.fill()

  // onderschrift
  ctx.fillStyle = '#A9A1CE'
  ctx.font = '500 42px "Instrument Sans", system-ui, sans-serif'
  ctx.fillText(k.onderschrift, BREEDTE / 2, 940)

  // link onderaan
  ctx.fillStyle = '#6F6794'
  ctx.font = '500 38px "Instrument Sans", system-ui, sans-serif'
  ctx.fillText(LINK, BREEDTE / 2, HOOGTE - 120)

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}

export type DeelResultaat = 'gedeeld' | 'gedownload' | 'mislukt'

/** Deelt de kaart via de telefoon, of downloadt hem als delen niet kan */
export async function deelKaart(k: DeelKaart): Promise<DeelResultaat> {
  const blob = await tekenKaart(k)
  if (!blob) return 'mislukt'

  const bestand = new File([blob], 'fluent.png', { type: 'image/png' })
  const kanDelen =
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [bestand] })

  if (kanDelen) {
    try {
      await navigator.share({ files: [bestand], text: `${k.bericht} — ${LINK}` })
      return 'gedeeld'
    } catch {
      // gebruiker heeft het deelvenster gesloten; dan hoeft er niets te gebeuren
      return 'mislukt'
    }
  }

  try {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fluent.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    return 'gedownload'
  } catch {
    return 'mislukt'
  }
}
