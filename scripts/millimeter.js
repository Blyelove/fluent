/**
 * DE MILLIMETERMAAT
 *
 * De audit meet of iets stuk is. Deze meet of iets klópt. Dat is een ander
 * soort vraag: niet "valt tekst weg" maar "staat alles op dezelfde lijn",
 * "zit er ritme in de ruimte", "reageert elke knop op je duim".
 *
 * Vier dingen die je met het oog nooit optelt en die samen bepalen of een
 * scherm rommelig of verzorgd aanvoelt:
 *
 * 1. UITLIJNING. Alles in een kolom hoort op dezelfde linkerlijn te beginnen.
 *    Vijf verschillende linkerlijnen zie je niet als fout, je voelt ze als
 *    slordigheid.
 * 2. RITME. De verticale ruimtes tussen blokken horen uit de maatladder te
 *    komen. Elf verschillende afstanden op één scherm is geen ritme.
 * 3. AANRAKING. Elke knop hoort te reageren op je duim. Een knop die niets
 *    doet bij het indrukken voelt kapot, ook al werkt hij.
 * 4. RAND. Niets hoort tegen de schermrand te plakken of onder de onderbalk
 *    te verdwijnen.
 */
window.__millimeter = function millimeter() {
  const el = document.documentElement
  const LADDER = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96]
  const opLadder = (n) => LADDER.some((x) => Math.abs(x - n) < 0.6)

  const zichtbaar = (n) => {
    const cs = getComputedStyle(n)
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return false
    const r = n.getBoundingClientRect()
    return r.width > 2 && r.height > 2
  }

  /**
   * Het vlak dat nu bovenop ligt.
   *
   * Eerst was dat altijd `.shell`, en dat gaf twee blinde vlekken: een open
   * paneel werd niet gemeten maar het scherm eronder, en schermen zonder schil
   * werden helemaal niet gemeten en meldden vrolijk nul fouten. Een maat die
   * stilzwijgend niets meet is erger dan geen maat.
   */
  const vlak = () => {
    const paneel = [...document.querySelectorAll('.modal-panel')].filter(zichtbaar).pop()
    if (paneel) return paneel
    const schil = document.querySelector('.shell')
    if (schil && zichtbaar(schil)) return schil
    // geen schil en geen paneel: dan het grootste blok dat de pagina draagt
    const kandidaten = [...document.querySelectorAll('body > div > *, #root > *')].filter(zichtbaar)
    return kandidaten.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0] ?? null
  }

  /**
   * De blokken die het scherm dragen: directe kinderen van het bovenste vlak,
   * op volgorde van hoe ze op het scherm staan.
   *
   * Dat laatste is geen detail. Het leerscherm zet blokken om met `order`, dus
   * de volgorde in de code is niet de volgorde die je ziet. Zolang deze maat
   * de kinderen op codevolgorde afliep, vergeleek hij afstanden tussen blokken
   * die helemaal niet naast elkaar staan: sommige gaten kwamen er negatief uit
   * en vielen weg, andere waren een optelsom van alles ertussen. De ene keer
   * meldde hij een fout en de andere keer niet, met precies dezelfde stijlen.
   */
  const blokken = () => {
    const schil = vlak()
    if (!schil) return []
    return [...schil.children]
      .filter((n) => {
        if (!zichtbaar(n)) return false
        // decor telt niet mee voor ritme en lijn: het hoort juist los te zweven
        const pos = getComputedStyle(n).position
        return pos !== 'absolute' && pos !== 'fixed'
      })
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
  }

  function uitlijning() {
    /* Alleen blokken die het scherm dragen tellen mee. Decor dat bewust buiten
       beeld begint en losse knopen die in het midden staan zijn geen
       uitlijnfout: die hóren daar. De maat daarvoor is de breedte, want een
       dragend blok vult het scherm en een versiering niet. */
    const schil = vlak()
    const schilBreed = schil ? schil.getBoundingClientRect().width : 375
    const dragend = blokken().filter((n) => {
      // decor zweeft los boven het scherm en draagt dus niets
      const pos = getComputedStyle(n).position
      if (pos === 'absolute' || pos === 'fixed') return false
      return n.getBoundingClientRect().width > schilBreed * 0.6
    })
    const links = dragend.map((n) => Math.round(n.getBoundingClientRect().left))
    const uniek = [...new Set(links)]
    return { lijnen: uniek.sort((a, b) => a - b), blokken: links.length }
  }

  function ritme() {
    const b = blokken()
    const gaten = []
    const waar = []
    for (let i = 1; i < b.length; i++) {
      const vorige = b[i - 1].getBoundingClientRect()
      const nu = b[i].getBoundingClientRect()
      const gat = Math.round(nu.top - vorige.bottom)
      if (gat >= 0 && gat < 200) {
        gaten.push(gat)
        waar.push({ gat, na: (b[i - 1].textContent || '').trim().slice(0, 20), voor: (b[i].textContent || '').trim().slice(0, 20) })
      }
    }
    return { gaten, buitenLadder: gaten.filter((g) => !opLadder(g)), waar: waar.filter((w) => !opLadder(w.gat)) }
  }

  /**
   * Reageert een knop op je duim?
   *
   * Eerst keek dit naar de berekende stijl, en dat is de verkeerde plek: een
   * regel met :active geldt alleen tijdens het indrukken en staat er dus nooit
   * in. Zo werden zevenentwintig knoppen als kapot gemeld die het prima doen.
   * Nu worden de stijlbladen zelf gelezen: welke keuzes hebben een :active, en
   * past deze knop op zo'n keuze.
   */
  function aanraking() {
    const drukKeuzes = []
    try {
      for (const blad of document.styleSheets) {
        let regels
        try {
          regels = blad.cssRules
        } catch {
          continue // een blad van elders mag je niet lezen
        }
        for (const regel of regels) {
          if (!regel.selectorText || regel.selectorText.indexOf(':active') < 0) continue
          for (const keuze of regel.selectorText.split(',')) {
            const kaal = keuze.replace(/:active/g, '').trim()
            if (kaal) drukKeuzes.push(kaal)
          }
        }
      }
    } catch {
      /* geen stijlbladen te lezen: dan meten we alleen de berekende stijl */
    }
    const zonder = []
    for (const b of document.querySelectorAll('button, a[href], [role="button"]')) {
      if (!zichtbaar(b)) continue
      const cs = getComputedStyle(b)
      const heeftOvergang = cs.transitionDuration !== '0s' && cs.transitionProperty !== 'none'
      let heeftDruk = false
      for (const keuze of drukKeuzes) {
        try {
          if (b.matches(keuze)) { heeftDruk = true; break }
        } catch { /* een keuze die deze browser niet snapt */ }
      }
      if (!heeftOvergang && !heeftDruk) {
        zonder.push({ t: (b.textContent || '').trim().slice(0, 22) || b.getAttribute('aria-label') || '?', klasse: String(b.className).slice(0, 24) })
      }
    }
    return zonder
  }

  function rand() {
    const uit = []
    const breed = el.clientWidth
    const hoog = window.innerHeight
    /* De onderbalk staat vast onderin; inhoud die eronderdoor schuift is
       normaal en geen fout. Wat wél fout is: als je helemaal naar beneden hebt
       gescrold en er dan nog iets onder die balk verdwijnt. Dan is de
       onderruimte van het scherm te krap. */
    const balk = document.querySelector('.nav')
    const balkHoog = balk ? balk.getBoundingClientRect().height : 0
    const onderruimte = document.body.scrollHeight - (window.scrollY + hoog)
    const veegt = (n) => {
      let p = n
      while (p && p !== el) {
        const o = getComputedStyle(p).overflowX
        if (o === 'auto' || o === 'scroll') return true
        p = p.parentElement
      }
      return false
    }
    const opper = vlak()
    for (const n of opper ? opper.querySelectorAll('*') : []) {
      if (!zichtbaar(n)) continue
      const t = (n.textContent || '').trim()
      if (!t || n.children.length > 0) continue
      // wat je met je duim opzij veegt hoort breder te zijn dan het scherm
      if (veegt(n)) continue
      const r = n.getBoundingClientRect()
      if (r.left < 6 || r.right > breed - 6) uit.push({ t: t.slice(0, 20), reden: `zijrand links ${Math.round(r.left)} rechts ${Math.round(breed - r.right)}` })
    }
    // en de onderruimte: helemaal onderaan moet de laatste inhoud vrij staan
    const schil = vlak()
    if (schil && onderruimte <= 1) {
      const laatste = [...schil.children].filter(zichtbaar).pop()
      if (laatste && laatste.getBoundingClientRect().bottom > hoog - balkHoog + 4) {
        uit.push({ t: 'de laatste inhoud', reden: 'verdwijnt onder de onderbalk' })
      }
    }
    return uit.slice(0, 6)
  }

  if (window.innerWidth < 300) return { fout: `venster te smal: ${window.innerWidth}` }

  const schil = vlak()
  return {
    venster: window.innerWidth,
    // een vlak dat niet te vinden is, is een fout en geen nul
    geenVlak: schil ? 0 : 1,
    wereld: el.getAttribute('data-wereld') ?? 'neon',
    // waar de schil zelf staat: schuift die, dan schuift alles mee en zijn de
    // randmetingen daaronder een gevolg en geen eigen fout
    schilLinks: schil ? Math.round(schil.getBoundingClientRect().left) : null,
    schilBreed: schil ? Math.round(schil.getBoundingClientRect().width) : null,
    uitlijning: uitlijning(),
    ritme: ritme(),
    zonderAanraking: aanraking(),
    randfouten: rand(),
  }
}
'millimeter geladen'
