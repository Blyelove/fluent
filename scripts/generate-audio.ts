/**
 * Genereert per taal echte neurale moedertaal-audio (MP3) voor alle
 * uitspreekbare teksten in de cursussen, via Microsoft Edge neural TTS.
 *
 * Uitvoer: public/audio/{ttsLang}/{hash}.mp3 + public/audio/manifest.json
 * Draaien: npx tsx scripts/generate-audio.ts
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'
import { courseList } from '../src/content'
import { GESPREKKEN } from '../src/content/gesprekken'
import { RESTAURANT, VRIJ_GESPREK } from '../src/content/gesprekkenExtra'
import type { Course } from '../src/types'

const VOICES: Record<string, string> = {
  'en-GB': 'en-GB-SoniaNeural',
  'es-ES': 'es-ES-ElviraNeural',
  'fr-FR': 'fr-FR-DeniseNeural',
  'de-DE': 'de-DE-KatjaNeural',
  'it-IT': 'it-IT-ElsaNeural',
  'pt-PT': 'pt-PT-RaquelNeural',
}

const OUT_ROOT = path.resolve(import.meta.dirname, '..', 'public', 'audio')

/** Zinnen uit de grammatica-gids van deze taal (voorbeelden + kant-en-klare zinnen) */
async function collectGuides(courseId: string): Promise<string[]> {
  try {
    const mod = (await import(`../src/content/guides/${courseId}`)) as {
      guides: Record<string, { rules: { examples: { target: string }[] }[]; phrases: { target: string }[] }>
    }
    const out: string[] = []
    for (const g of Object.values(mod.guides ?? {})) {
      for (const r of g.rules ?? []) for (const e of r.examples ?? []) out.push(e.target)
      for (const p of g.phrases ?? []) out.push(p.target)
    }
    return out
  } catch {
    // nog geen gids voor deze taal
    return []
  }
}

function collect(course: Course): Set<string> {
  const texts = new Set<string>()
  for (const s of course.sections)
    for (const u of s.units)
      for (const l of u.lessons)
        for (const e of l.exercises) {
          if (e.type === 'new') {
            texts.add(e.word)
            if (e.example) texts.add(e.example)
          }
          if (e.type === 'select' && e.speak) texts.add(e.speak)
          // zonder speak is de prompt Nederlands en zijn de OPTIES doeltaal:
          // het juiste antwoord wordt na een fout uitgesproken
          if (e.type === 'select' && !e.speak) texts.add(e.options[e.correct])
          if (e.type === 'listen') texts.add(e.target)
          if (e.type === 'match') for (const p of e.pairs) texts.add(p.target)
          // de drie types die stil waren: na een fout (of een tikfout) spreekt
          // de app nu het juiste antwoord uit, dus die zinnen horen in het manifest
          if (e.type === 'type') texts.add(e.target)
          if (e.type === 'wordbank') texts.add(e.target)
          if (e.type === 'fill') texts.add(`${e.before} ${e.options[e.correct]} ${e.after}`.replace(/\s+/g, ' ').trim())
        }
  return texts
}

const hash = (s: string) => createHash('sha1').update(s).digest('hex').slice(0, 12)

async function exists(p: string) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function synth(tts: MsEdgeTTS, text: string, outFile: string) {
  const res = (tts as unknown as { toStream: (t: string) => unknown }).toStream(text) as
    | NodeJS.ReadableStream
    | { audioStream: NodeJS.ReadableStream }
  const stream: NodeJS.ReadableStream = 'audioStream' in (res as object) ? (res as { audioStream: NodeJS.ReadableStream }).audioStream : (res as NodeJS.ReadableStream)
  const chunks: Buffer[] = []
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (c: Buffer) => chunks.push(c))
    stream.on('end', () => resolve())
    stream.on('error', reject)
  })
  const buf = Buffer.concat(chunks)
  if (buf.length < 200) throw new Error(`lege audio voor: ${text}`)
  await writeFile(outFile, buf)
}

async function main() {
  const manifest: Record<string, string> = {}
  let made = 0
  let skipped = 0
  let failed = 0

  for (const course of courseList) {
    const voice = VOICES[course.ttsLang]
    if (!voice) {
      console.warn(`geen stem voor ${course.ttsLang}, overslaan`)
      continue
    }
    const dir = path.join(OUT_ROOT, course.ttsLang)
    await mkdir(dir, { recursive: true })
    const uitCursus = collect(course)
    for (const zin of await collectGuides(course.id)) uitCursus.add(zin)
    // gesprekken: de partner spreekt elke beurt hardop, en wie op een
    // partnerbel tikt hoort hem opnieuw — dus álle gesprekslijnen mee
    for (const scenario of [...(GESPREKKEN[course.id] ?? []), RESTAURANT[course.id]]) {
      for (const stap of scenario.stappen) {
        uitCursus.add(stap.zeg)
        for (const a of stap.antwoorden) uitCursus.add(a.tekst)
      }
      uitCursus.add(scenario.slot.zeg)
    }
    // het vrije gesprek: intro, keuzevragen, alle onderwerpbeurten en het slot
    const vrij = VRIJ_GESPREK[course.id]
    if (vrij) {
      const stappen = [vrij.intro, ...vrij.onderwerpen.flatMap((o) => o.stappen)]
      for (const stap of stappen) {
        uitCursus.add(stap.zeg)
        for (const a of stap.antwoorden) uitCursus.add(a.tekst)
      }
      uitCursus.add(vrij.keuzevraag.zeg)
      uitCursus.add(vrij.vervolgvraag.zeg)
      uitCursus.add(vrij.afscheid.tekst)
      uitCursus.add(vrij.slot.zeg)
    }
    const texts = [...uitCursus]
    console.log(`\n${course.flag} ${course.name} (${voice}): ${texts.length} teksten (inclusief gids)`)

    let tts = new MsEdgeTTS()
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)

    for (const text of texts) {
      const file = `${hash(text)}.mp3`
      const outFile = path.join(dir, file)
      const key = `${course.ttsLang}|${text}`
      if (await exists(outFile)) {
        manifest[key] = `/audio/${course.ttsLang}/${file}`
        skipped++
        continue
      }
      let ok = false
      for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
        try {
          await synth(tts, text, outFile)
          ok = true
        } catch (err) {
          if (attempt === 3) {
            failed++
            console.warn(`  MISLUKT: "${text}" — ${(err as Error).message}`)
          } else {
            // nieuwe verbinding en even wachten
            await new Promise((r) => setTimeout(r, 800 * attempt))
            tts = new MsEdgeTTS()
            await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)
          }
        }
      }
      if (ok) {
        manifest[key] = `/audio/${course.ttsLang}/${file}`
        made++
        if (made % 25 === 0) console.log(`  ...${made} gegenereerd`)
        await new Promise((r) => setTimeout(r, 120))
      }
    }
  }

  await writeFile(path.join(OUT_ROOT, 'manifest.json'), JSON.stringify(manifest, null, 1))
  console.log(`\nKlaar: ${made} nieuw, ${skipped} bestond al, ${failed} mislukt. Manifest: ${Object.keys(manifest).length} entries.`)
}

void main()
