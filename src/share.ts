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
  /**
   * Optioneel: een SVG uit de pagina (bijvoorbeeld je personage) die op de
   * kaart getekend wordt in plaats van het icoon. Zo laat je bij een
   * niveau-sprong zien hoe jouw figuur eruitziet.
   */
  svg?: SVGSVGElement | null
}

/**
 * Zet een SVG uit de pagina om naar een tekenbare afbeelding.
 * De kopie krijgt bewust een veel groter formaat dan op het scherm: de browser
 * rastert een SVG op zijn eigen maat, dus op schermformaat zou het figuur op de
 * kaart uitgesmeerd worden.
 */
async function svgNaarAfbeelding(svg: SVGSVGElement, doelHoogte = 640): Promise<HTMLImageElement | null> {
  try {
    const kopie = svg.cloneNode(true) as SVGSVGElement
    // expliciete maten en naamruimte, anders weigert de browser hem te laden
    const box = svg.getBoundingClientRect()
    const h = Math.max(1, box.height)
    const b = Math.max(1, box.width)
    kopie.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    kopie.setAttribute('width', String(Math.round((b / h) * doelHoogte)))
    kopie.setAttribute('height', String(Math.round(doelHoogte)))
    // de animatie kan het figuur net buiten beeld duwen; op de kaart willen we
    // hem recht en heel, dus de bewegingstransform gaat eruit
    kopie.style.transform = 'none'
    const tekst = new XMLSerializer().serializeToString(kopie)
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(tekst)}`
    return await new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = url
    })
  } catch {
    return null
  }
}

/**
 * Zoekt het echte beeldvlak van een afbeelding met doorzichtige randen.
 * Een personage-SVG heeft flink wat lege ruimte in zijn viewBox; zonder deze
 * uitsnede zou het figuur op de kaart half zo groot ogen als het mag zijn.
 */
function inhoudsvlak(img: HTMLImageElement): { x: number; y: number; b: number; h: number } {
  const val = { x: 0, y: 0, b: img.width, h: img.height }
  try {
    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext('2d', { willReadFrequently: true })
    if (!ctx) return val
    ctx.drawImage(img, 0, 0)
    const d = ctx.getImageData(0, 0, c.width, c.height).data
    let x0 = c.width
    let y0 = c.height
    let x1 = -1
    let y1 = -1
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        // alles onder ~10% dekking telt als leegte (zachte schaduwranden)
        if (d[(y * c.width + x) * 4 + 3] > 25) {
          if (x < x0) x0 = x
          if (x > x1) x1 = x
          if (y < y0) y0 = y
          if (y > y1) y1 = y
        }
      }
    }
    if (x1 < x0 || y1 < y0) return val
    return { x: x0, y: y0, b: x1 - x0 + 1, h: y1 - y0 + 1 }
  } catch {
    // een SVG uit een andere herkomst zou het canvas besmetten — dan maar heel
    return val
  }
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

  // Staat er een personage op de kaart, dan is dát het onderwerp: de merknaam
  // schuift omhoog en al het onderstaande zakt, zodat het figuur groot mag zijn.
  const figuur = k.svg ? await svgNaarAfbeelding(k.svg) : null
  const heeftFiguur = !!(figuur && figuur.width > 0)
  const zak = heeftFiguur ? 38 : 0

  // merknaam
  const merk = ctx.createLinearGradient(400, 0, 680, 0)
  merk.addColorStop(0, '#A855F7')
  merk.addColorStop(1, '#EC4899')
  ctx.fillStyle = merk
  ctx.font = '800 74px "Baloo 2", system-ui, sans-serif'
  ctx.fillText('Fluent', BREEDTE / 2, heeftFiguur ? 262 : 300)

  // personage als dat meegegeven is, anders het icoon
  if (figuur && heeftFiguur) {
    // tussen de merknaam en de kaplijn van het grote getal (rond y 614)
    const vlak = inhoudsvlak(figuur)
    const schaal = Math.min(320 / vlak.h, 440 / vlak.b)
    const b = vlak.b * schaal
    const h = vlak.h * schaal
    ctx.drawImage(figuur, vlak.x, vlak.y, vlak.b, vlak.h, BREEDTE / 2 - b / 2, 600 - h, b, h)
  } else {
    ctx.font = '150px system-ui, "Segoe UI Emoji", sans-serif'
    ctx.fillText(k.icoon, BREEDTE / 2, 500)
  }

  // grote waarde in goud
  const goud = ctx.createLinearGradient(0, 540 + zak, 0, 720 + zak)
  goud.addColorStop(0, '#FFE08A')
  goud.addColorStop(1, '#FFB300')
  ctx.fillStyle = goud
  // krimpen tot het binnen de kaart past — "Niveau 12" en een lange landnaam
  // mogen er nooit aan beide kanten uit lopen
  let maat = 200
  do {
    ctx.font = `800 ${maat}px "Baloo 2", system-ui, sans-serif`
    if (ctx.measureText(k.waarde).width <= BREEDTE - 260) break
    maat -= 8
  } while (maat > 60)
  ctx.fillText(k.waarde, BREEDTE / 2, 720 + zak)

  // label
  ctx.fillStyle = '#F5F3FF'
  ctx.font = '600 60px "Instrument Sans", system-ui, sans-serif'
  ctx.fillText(k.label, BREEDTE / 2, 810 + zak)

  // scheidingslijntje
  const lijn = ctx.createLinearGradient(BREEDTE / 2 - 90, 0, BREEDTE / 2 + 90, 0)
  lijn.addColorStop(0, '#A855F7')
  lijn.addColorStop(1, '#EC4899')
  ctx.fillStyle = lijn
  rondeRechthoek(ctx, BREEDTE / 2 - 90, 862 + zak, 180, 8, 4)
  ctx.fill()

  // onderschrift
  ctx.fillStyle = '#A9A1CE'
  ctx.font = '500 42px "Instrument Sans", system-ui, sans-serif'
  ctx.fillText(k.onderschrift, BREEDTE / 2, 940 + zak)

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
