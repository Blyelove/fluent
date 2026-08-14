/**
 * De systematische audit: loopt élk scherm langs in élke taalwereld en meet
 * de harde eisen. Draait in de pagina, niet in Node.
 *
 * Gemeten per combinatie: contrast van alle zichtbare tekst, tikdoelen onder
 * 44px, oneindige animaties, echte horizontale scroll en middenstreepjes.
 *
 * Emoji en gradiënttekst worden overgeslagen: die hebben hun eigen kleuren
 * en meten als tekst geeft valse alarmen.
 */
window.__auditFluent = async function auditFluent(schermen, werelden) {
  const wacht = (ms) => new Promise((r) => setTimeout(r, ms))
  const el = document.documentElement
  const EMOJI = /\p{Extended_Pictographic}/u

  const f = (v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const lum = ([r, g, b]) => 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  const num = (x) => {
    const m = x.match(/[\d.]+%?/g)
    if (!m) return []
    return m.map((v) => (v.endsWith('%') ? parseFloat(v) * 2.55 : x.startsWith('color(') && parseFloat(v) <= 1 ? parseFloat(v) * 255 : parseFloat(v)))
  }
  const meng = (voor, achter, a) => voor.map((v, i) => v * a + achter[i] * (1 - a))

  function contrastFouten() {
    const PAGINA = num(getComputedStyle(document.body).backgroundColor).slice(0, 3)
    const achter = (e) => {
      let n = e
      let res = PAGINA
      const stapel = []
      while (n && n !== el) {
        const cs = getComputedStyle(n)
        const bi = cs.backgroundImage
        if (bi && bi !== 'none' && /gradient/.test(bi)) {
          const m = bi.match(/rgba?\([^)]+\)/)
          if (m) stapel.push([num(m[0]).slice(0, 3), num(m[0])[3] ?? 1])
        }
        const p = num(cs.backgroundColor)
        if (p.length >= 3 && (p[3] === undefined || p[3] > 0)) stapel.push([p.slice(0, 3), p[3] ?? 1])
        n = n.parentElement
      }
      for (let i = stapel.length - 1; i >= 0; i--) res = meng(stapel[i][0], res, stapel[i][1])
      return res
    }
    const uit = []
    document.querySelectorAll('body *').forEach((e) => {
      const t = (e.textContent || '').trim()
      if (!t || t.length > 60 || e.children.length > 0) return
      if (EMOJI.test(t)) return
      const cs = getComputedStyle(e)
      if (cs.visibility === 'hidden' || cs.display === 'none') return
      if (/rgba\(0, 0, 0, 0\)/.test(cs.color)) return
      const r = e.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) return
      const fg = num(cs.color).slice(0, 3)
      if (fg.length < 3) return
      const l1 = lum(fg)
      const l2 = lum(achter(e))
      const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
      const c = (hi + 0.05) / (lo + 0.05)
      if (c < 3 && c > 0) uit.push({ t: t.slice(0, 22), c: +c.toFixed(2) })
    })
    return uit
  }

  function kleineTikdoelen() {
    const uit = []
    document.querySelectorAll('button, a, input, [role="button"]').forEach((b) => {
      const r = b.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      const cs = getComputedStyle(b)
      if (cs.display === 'none' || cs.visibility === 'hidden') return
      if (r.height < 43.5 || r.width < 43.5) uit.push({ t: (b.textContent || '').trim().slice(0, 18), w: Math.round(r.width), h: Math.round(r.height) })
    })
    return uit
  }

  function oneindigeAnimaties() {
    let n = 0
    document.querySelectorAll('body *').forEach((e) => {
      const cs = getComputedStyle(e)
      if (cs.animationName !== 'none' && cs.animationIterationCount === 'infinite') n++
    })
    return n
  }

  function echteHorizontaleScroll() {
    const voor = window.scrollX
    window.scrollTo(600, window.scrollY)
    const uit = window.scrollX !== 0
    window.scrollTo(voor, window.scrollY)
    return uit
  }

  function middenstreepjes() {
    const uit = []
    document.querySelectorAll('body *').forEach((e) => {
      if (e.children.length > 0) return
      const t = (e.textContent || '').trim()
      if (t.includes('—')) uit.push(t.slice(0, 30))
    })
    return uit
  }

  if (window.innerWidth < 300) return { fout: `venster te smal om te meten: ${window.innerWidth}px` }

  const rapport = { venster: window.innerWidth, schermen: {} }
  for (const scherm of schermen) {
    // naar het scherm toe via de knop in de onderbalk
    const nav = [...document.querySelectorAll('.nav-item, button')].find((b) => (b.textContent || '').trim() === scherm.knop)
    if (nav) {
      nav.click()
      await wacht(700)
    }
    const perWereld = {}
    for (const wereld of werelden) {
      if (wereld === 'neon') el.removeAttribute('data-wereld')
      else el.setAttribute('data-wereld', wereld)
      await wacht(60)
      const c = contrastFouten()
      if (c.length) perWereld[wereld] = c.slice(0, 3)
    }
    el.removeAttribute('data-wereld')
    rapport.schermen[scherm.naam] = {
      contrastFouten: perWereld,
      tikdoelenTeKlein: kleineTikdoelen(),
      oneindigeAnimaties: oneindigeAnimaties(),
      horizontaalScroll: echteHorizontaleScroll(),
      middenstreepjes: middenstreepjes(),
    }
  }
  return rapport
}
'audit geladen'
