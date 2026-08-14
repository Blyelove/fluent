/**
 * De systematische audit: meet de harde eisen op de pagina zoals die nu staat.
 * Draait in de pagina, niet in Node. De runner (scripts/audit-run.mjs) opent
 * elke combinatie van scherm en wereld via een eigen link en roept dit aan.
 *
 * Gemeten per combinatie: contrast van alle zichtbare tekst, tikdoelen onder
 * 44px, oneindige animaties, echte horizontale scroll en middenstreepjes.
 *
 * Gradiënttekst en elementen die alleen uit emoji bestaan worden overgeslagen:
 * die hebben hun eigen kleuren en meten als tekst geeft valse alarmen. Tekst
 * mét een emoji ertussen wordt wél gemeten, want daar staan echte woorden in.
 */
window.__auditFluent = async function auditFluent() {
  const wacht = (ms) => new Promise((r) => setTimeout(r, ms))
  const el = document.documentElement
  const EMOJI = /\p{Extended_Pictographic}/gu

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
      // Alleen élement dat niets anders dan emoji bevat overslaan. Eerder viel
      // hier ook "🌳 HOUTEN ARENA" af, en zo bleef goud op een lichte muur
      // ongemeten omdat er toevallig een boompje voor stond.
      const zonderEmoji = t.replace(EMOJI, '').replace(/[️‍\s]/g, '')
      if (zonderEmoji.length < 2) return
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

  /**
   * Alles wat eeuwig blijft bewegen, en niet alleen de CSS-animaties.
   *
   * Dit keek eerst alleen naar animationIterationCount, en dat is precies de
   * helft van het verhaal: animaties die vanuit JavaScript lopen staan niet in
   * de berekende stijl. De teller meldde nul op een scherm waar het duidelijk
   * bewoog. document.getAnimations ziet ze allebei.
   */
  function oneindigeAnimaties() {
    const namen = new Set()
    let n = 0
    document.querySelectorAll('body *').forEach((e) => {
      const cs = getComputedStyle(e)
      if (cs.animationName !== 'none' && cs.animationIterationCount === 'infinite') {
        n++
        namen.add(cs.animationName)
      }
    })
    try {
      for (const a of document.getAnimations()) {
        const t = a.effect && a.effect.getTiming ? a.effect.getTiming() : null
        if (!t || t.iterations !== Infinity) continue
        // een CSS-animatie staat hierboven al geteld
        if (a.constructor && a.constructor.name === 'CSSAnimation') continue
        n++
        namen.add(a.constructor ? a.constructor.name : 'script')
      }
    } catch {
      /* oudere browser zonder getAnimations: dan telt alleen de CSS-kant */
    }
    return { aantal: n, soorten: [...namen].slice(0, 6) }
  }

  /**
   * Tekst die buiten zijn vak breekt.
   *
   * Punt 5 zegt: geen tekst die in een andere taal langer wordt en dan breekt.
   * Dat gebeurt niet op een woord maar op een vak dat te krap is gemaakt voor
   * de Nederlandse tekst en dus geen ruimte overhoudt. Hier wordt gemeten of
   * de inhoud breder is dan het vak dat hem moet dragen.
   *
   * Stroken die je bewust met je duim veegt tellen niet mee: die horen breder
   * te zijn dan het scherm.
   */
  function tekstBreekt() {
    const uit = []
    document.querySelectorAll('body *').forEach((e) => {
      const t = (e.textContent || '').trim()
      if (!t || e.children.length > 0) return
      const cs = getComputedStyle(e)
      if (cs.display === 'none' || cs.visibility === 'hidden') return
      if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') return
      // een voorouder die bewust veegt telt ook niet
      let n = e.parentElement
      let veegt = false
      while (n && n !== el) {
        const o = getComputedStyle(n)
        if (o.overflowX === 'auto' || o.overflowX === 'scroll') veegt = true
        n = n.parentElement
      }
      if (veegt) return
      if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0) {
        uit.push({ t: t.slice(0, 24), vak: e.clientWidth, inhoud: e.scrollWidth })
      }
    })
    return uit
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

  /**
   * Eén meting van de pagina zoals die nu staat. De wereld wordt niet meer
   * hier omgezet: de app zet zijn eigen wereld terug zodra hij hertekent, en
   * op de Arena gebeurt dat continu. Dan meet je een donkere wereld terwijl je
   * denkt een lichte te meten en meldt de audit onterecht dat alles schoon is.
   * De runner pint de wereld daarom via ?wereld= in de link, en dit stuk meet
   * alleen nog wat er staat.
   */
  return {
    venster: window.innerWidth,
    wereld: el.getAttribute('data-wereld') ?? 'neon',
    contrastFouten: contrastFouten().slice(0, 4),
    tikdoelenTeKlein: kleineTikdoelen(),
    oneindigeAnimaties: oneindigeAnimaties(),
    horizontaalScroll: echteHorizontaleScroll(),
    middenstreepjes: middenstreepjes(),
    tekstBreekt: tekstBreekt(),
  }
}
'audit geladen'
