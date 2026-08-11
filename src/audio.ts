let ctx: AudioContext | null = null
let enabled = true

export function setSoundEnabled(on: boolean) {
  enabled = on
}

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = 'sine', gain = 0.06) {
  const c = ac()
  const t = c.currentTime + at
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

export type SfxKind = 'correct' | 'wrong' | 'complete' | 'tap'

export function sfx(kind: SfxKind) {
  if (!enabled) return
  try {
    switch (kind) {
      case 'correct':
        tone(659.25, 0, 0.16, 'sine', 0.05)
        tone(880, 0.09, 0.22, 'sine', 0.05)
        break
      case 'wrong':
        tone(174.61, 0, 0.22, 'triangle', 0.05)
        break
      case 'complete':
        tone(440, 0, 0.18, 'sine', 0.05)
        tone(554.37, 0.12, 0.18, 'sine', 0.05)
        tone(659.25, 0.24, 0.18, 'sine', 0.05)
        tone(880, 0.36, 0.34, 'sine', 0.06)
        break
      case 'tap':
        tone(800, 0, 0.04, 'sine', 0.02)
        break
    }
  } catch {
    /* audio niet beschikbaar — stil doorgaan */
  }
}

/* ---------- spraak: echte moedertaal-audio eerst ---------- */

/** manifest: `${ttsLang}|${text}` → mp3-pad met neurale moedertaalstem */
let manifest: Record<string, string> = {}
let player: HTMLAudioElement | null = null

export async function initAudioManifest() {
  try {
    const base = import.meta.env.BASE_URL
    const r = await fetch(`${base}audio/manifest.json`, { cache: 'no-cache' })
    if (r.ok) {
      const raw = (await r.json()) as Record<string, string>
      // paden relatief maken zodat de app ook op een sub-pad (bv. GitHub Pages) werkt
      manifest = {}
      for (const [key, path] of Object.entries(raw)) {
        manifest[key] = base + path.replace(/^\//, '')
      }
    }
  } catch {
    /* geen manifest — fallback blijft werken */
  }
}

let voices: SpeechSynthesisVoice[] = []

export function initVoices() {
  if (!('speechSynthesis' in window)) return
  const load = () => {
    voices = window.speechSynthesis.getVoices()
  }
  load()
  window.speechSynthesis.onvoiceschanged = load
}

/** Beste stem voor de taal; null als er géén stem in de juiste taal bestaat */
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const prefix = lang.split('-')[0].toLowerCase()
  const cands = voices.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(prefix))
  if (cands.length === 0) return null
  const score = (v: SpeechSynthesisVoice) =>
    (v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase() ? 4 : 0) +
    (/natural|neural|online|google|premium|enhanced/i.test(v.name) ? 2 : 0) +
    (v.localService ? 0 : 1)
  return [...cands].sort((a, b) => score(b) - score(a))[0]
}

export function speak(text: string, lang: string, rate = 1) {
  // 1) Vooraf gegenereerde neurale moedertaal-audio (altijd het juiste accent)
  const src = manifest[`${lang}|${text}`]
  if (src) {
    try {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      if (player) player.pause()
      player = new Audio(src)
      player.playbackRate = rate
      void player.play().catch(() => speakFallback(text, lang, rate))
    } catch {
      speakFallback(text, lang, rate)
    }
    return
  }
  speakFallback(text, lang, rate)
}

function speakFallback(text: string, lang: string, rate: number) {
  if (!('speechSynthesis' in window)) return
  const voice = pickVoice(lang)
  // Liever stilte dan een verkeerd (bv. Nederlands) accent voor een andere taal
  if (!voice) {
    if (import.meta.env.DEV) console.debug(`[aurea] geen ${lang}-stem beschikbaar; tekst niet uitgesproken:`, text)
    return
  }
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = rate * 0.95
    u.voice = voice
    window.speechSynthesis.speak(u)
  } catch {
    /* stil doorgaan */
  }
}
