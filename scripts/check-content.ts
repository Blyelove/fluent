/**
 * Poortwachter voor de cursusinhoud. Draait vóór elke build en laat hem
 * FALEN zodra er content in zit die de app stuk maakt of oneerlijk maakt.
 *
 * Aanleiding (ronde 18): het paar `hallo → hallo` in Duits les 1 zette de
 * match-oefening voorgoed vast, en alle 71 Duitse invuloefeningen hadden het
 * juiste antwoord op knop 1. Allebei was in één seconde te vangen geweest met
 * een controle als deze — mensen zien zoiets pas als het te laat is.
 *
 *   npx tsx scripts/check-content.ts
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { courses } from '../src/content'
import type { Course, Exercise } from '../src/types'

const wortel = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const fouten: string[] = []
const waarschuwingen: string[] = []

/* ---------- structurele controles: deze BREKEN de build ---------- */

function controleerOefening(waar: string, ex: Exercise) {
  if (ex.type === 'select' || ex.type === 'listen' || ex.type === 'fill') {
    if (ex.options.length < 2) fouten.push(`${waar}: minder dan 2 antwoordopties`)
    if (ex.correct < 0 || ex.correct >= ex.options.length)
      fouten.push(`${waar}: correct-index ${ex.correct} valt buiten de ${ex.options.length} opties`)
    const dubbel = ex.options.filter((o, i) => ex.options.indexOf(o) !== i)
    if (dubbel.length > 0)
      fouten.push(`${waar}: dubbele antwoordoptie "${dubbel[0]}" — twee knoppen met dezelfde tekst`)
  }
  if (ex.type === 'listen' && !ex.options.includes(ex.target))
    fouten.push(`${waar}: de uitgesproken tekst "${ex.target}" zit niet bij de opties`)
  if (ex.type === 'match') {
    if (ex.pairs.length < 2) fouten.push(`${waar}: match met minder dan 2 paren`)
    // dubbele woorden BINNEN één kolom maken het paar onoplosbaar dubbelzinnig:
    // welke van de twee gelijke tegels hoort bij welke vertaling?
    const links = ex.pairs.map((p) => p.nl)
    const rechts = ex.pairs.map((p) => p.target)
    for (const [kolom, naam] of [[links, 'links (NL)'], [rechts, 'rechts (doeltaal)']] as const) {
      const dub = kolom.filter((v, i) => kolom.indexOf(v) !== i)
      if (dub.length > 0) fouten.push(`${waar}: "${dub[0]}" staat twee keer in de kolom ${naam}`)
    }
  }
  if (ex.type === 'wordbank') {
    const woorden = ex.target.split(' ')
    if (woorden.length < 2) fouten.push(`${waar}: woordtegel-zin van één woord — dan is er niets te bouwen`)
  }
}

/* ---------- audiodekking: waarschuwt (wordt fout zodra de generator alles dekt) ---------- */

interface Manifest {
  [sleutel: string]: string
}

function audioSleutels(ex: Exercise): string[] {
  // wat de gebruiker daadwerkelijk te horen kan krijgen
  switch (ex.type) {
    case 'new':
      return [ex.word, ...(ex.example ? [ex.example] : [])]
    case 'listen':
      return [ex.target]
    case 'select':
      return ex.speak ? [ex.speak] : []
    default:
      return []
  }
}

function controleerAudio(course: Course, manifest: Manifest) {
  let stil = 0
  const voorbeelden: string[] = []
  for (const s of course.sections)
    for (const u of s.units)
      for (const l of u.lessons)
        for (const ex of l.exercises)
          for (const tekst of audioSleutels(ex)) {
            if (!manifest[`${course.ttsLang}|${tekst.toLowerCase()}`] && !manifest[`${course.ttsLang}|${tekst}`]) {
              stil++
              if (voorbeelden.length < 3) voorbeelden.push(tekst)
            }
          }
  if (stil > 0)
    waarschuwingen.push(
      `${course.name}: ${stil} hoorbare teksten zonder audiofragment (bijv. ${voorbeelden.map((v) => `"${v}"`).join(', ')}) — draai npx tsx scripts/generate-audio.ts`
    )
}

/* ---------- uitvoeren ---------- */

let manifest: Manifest = {}
try {
  manifest = JSON.parse(readFileSync(resolve(wortel, 'public/audio/manifest.json'), 'utf-8'))
} catch {
  waarschuwingen.push('public/audio/manifest.json ontbreekt of is onleesbaar — audiodekking niet gecontroleerd')
}

for (const course of Object.values(courses)) {
  for (const s of course.sections)
    for (const u of s.units)
      for (const l of u.lessons)
        l.exercises.forEach((ex, i) => controleerOefening(`${course.name} · ${u.title} · ${l.title} · oefening ${i + 1} (${ex.type})`, ex))
  if (Object.keys(manifest).length > 0) controleerAudio(course, manifest)
}

if (waarschuwingen.length > 0) {
  console.log(`⚠ ${waarschuwingen.length} waarschuwing(en):`)
  for (const w of waarschuwingen) console.log(`  - ${w}`)
}

if (fouten.length > 0) {
  console.error(`\n✗ ${fouten.length} fout(en) in de cursusinhoud:`)
  for (const f of fouten) console.error(`  - ${f}`)
  process.exit(1)
}

console.log(`\n✓ Cursusinhoud in orde: ${Object.keys(courses).length} cursussen gecontroleerd, 0 structurele fouten.`)
