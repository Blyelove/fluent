import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../store'
import { Avatar, DEFAULT_PERSONA, type AvatarStyle } from '../components/Avatar'
import { GALERIJ } from '../components/avatarGallery'
import { sfx } from '../audio'

/** Wachtwoord-hash: SHA-256 waar beschikbaar, anders een simpele fallback (http op wifi-IP) */
async function hash(s: string): Promise<string> {
  try {
    if (crypto?.subtle) {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`fluent:${s}`))
      return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
    }
  } catch {
    /* val terug op simpele hash */
  }
  let h1 = 0x811c9dc5
  let h2 = 0x1505
  const t = `fluent:${s}`
  for (let i = 0; i < t.length; i++) {
    h1 = Math.imul(h1 ^ t.charCodeAt(i), 0x01000193) >>> 0
    h2 = (Math.imul(h2, 33) ^ t.charCodeAt(i)) >>> 0
  }
  return `f${h1.toString(16)}${h2.toString(16)}`
}

export function AuthScreen() {
  const registerAccount = useStore((s) => s.registerAccount)
  const loginAccount = useStore((s) => s.loginAccount)
  const startGuest = useStore((s) => s.startGuest)
  const hasAccounts = useStore((s) => Object.keys(s.accounts).length > 0)

  const [tab, setTab] = useState<'nieuw' | 'inloggen'>(hasAccounts ? 'inloggen' : 'nieuw')
  // een gelote startheld staat al klaar; aanpassen kan altijd nog op je profiel
  const [look] = useState<AvatarStyle>(() => {
    const g = GALERIJ[Math.floor(Math.random() * GALERIJ.length)]
    return g ? { ...g.stijl } : DEFAULT_PERSONA
  })
  const [email, setEmail] = useState('')
  const [ww, setWw] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setError(null)
    if (!email.includes('@') || email.trim().length < 5) return setError('Vul een geldig e-mailadres in.')
    if (ww.length < 4) return setError('Je wachtwoord moet minstens 4 tekens zijn.')
    setBusy(true)
    const h = await hash(ww)
    setBusy(false)
    if (tab === 'nieuw') {
      const r = registerAccount(email, h, remember, look)
      if (r === 'bestaat') return setError('Dit e-mailadres heeft al een account. Log in.')
      sfx('complete')
    } else {
      const r = loginAccount(email, h, remember)
      if (r === 'fout') return setError('E-mailadres of wachtwoord klopt niet.')
      sfx('correct')
    }
  }

  const segment = (actief: boolean) =>
    actief
      ? { borderColor: 'var(--hot2)', background: 'rgba(236, 72, 153, 0.14)', color: '#fff', boxShadow: '0 0 14px rgba(236, 72, 153, 0.25)' }
      : undefined

  return (
    <div className="shell shell--bare" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="ambient-orb orb-a" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="center">
          <h1 className="display hot-text" style={{ fontSize: 46, margin: '0 0 2px' }}>
            Fluent
          </h1>
          <p className="dim" style={{ fontSize: 14, marginBottom: 16 }}>
            {tab === 'nieuw' ? 'Start direct, je held staat al klaar.' : 'Welkom terug.'}
          </p>
        </div>

        {/* de snelste route: één tik en je leert je eerste woord */}
        {tab === 'nieuw' && (
          <div className="card-hero center" style={{ padding: '20px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar size={84} look={look} />
            </div>
            <p className="dim" style={{ fontSize: 13, margin: '8px 0 12px' }}>
              Dit is jouw startheld. Aanpassen kan altijd, met meer dan 300.000 combinaties.
            </p>
            <motion.button
              className="btn btn-primary"
              animate={{ scale: [1, 1.025, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
              onClick={() => {
                sfx('complete')
                startGuest(look)
              }}
            >
              ▶ Start direct, zonder account
            </motion.button>
            <p className="faint" style={{ fontSize: 11.5, marginTop: 8 }}>
              Je voortgang wordt op dit apparaat bewaard. Een account maken kan altijd nog.
            </p>
          </div>
        )}

        <div className="row" style={{ gap: 8, marginBottom: 14 }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '11px 12px', fontSize: 14, ...segment(tab === 'nieuw') }}
            onClick={() => {
              sfx('tap')
              setTab('nieuw')
              setError(null)
            }}
          >
            Account maken
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '11px 12px', fontSize: 14, ...segment(tab === 'inloggen') }}
            onClick={() => {
              sfx('tap')
              setTab('inloggen')
              setError(null)
            }}
          >
            Inloggen
          </button>
        </div>

        {/* een echt formulier: wachtwoordmanagers en Enter doen gewoon mee */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
        >
          <div className="col" style={{ gap: 10 }}>
            <input
              className="type-input"
              placeholder="E-mailadres"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="off"
              autoComplete="email"
              inputMode="email"
              enterKeyHint="next"
              spellCheck={false}
            />
            <input
              className="type-input"
              placeholder="Wachtwoord"
              type="password"
              value={ww}
              onChange={(e) => setWw(e.target.value)}
              autoComplete={tab === 'nieuw' ? 'new-password' : 'current-password'}
              enterKeyHint="go"
            />
          </div>

          <button type="button" className="row" style={{ gap: 10, padding: '14px 2px', width: '100%' }} onClick={() => setRemember(!remember)}>
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 8,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 14,
                background: remember ? 'var(--grad-hot)' : 'var(--surface-2)',
                border: remember ? 'none' : '2px solid var(--line)',
                color: '#fff',
              }}
            >
              {remember ? '✓' : ''}
            </span>
            <span style={{ fontSize: 14.5, fontWeight: 600 }}>Ingelogd blijven</span>
            <span className="faint" style={{ fontSize: 12 }}>
              zo zie je dit scherm nooit meer
            </span>
          </button>

          {error && <p style={{ color: 'var(--err)', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{error}</p>}

          <button type="submit" className={tab === 'nieuw' ? 'btn btn-ghost' : 'btn btn-primary'} disabled={busy}>
            {tab === 'nieuw' ? 'Account maken met e-mail' : 'Inloggen'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
