import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../store'
import { Avatar } from '../components/Avatar'
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
  const hasAccounts = useStore((s) => Object.keys(s.accounts).length > 0)

  const [tab, setTab] = useState<'nieuw' | 'inloggen'>(hasAccounts ? 'inloggen' : 'nieuw')
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [ww, setWw] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setError(null)
    if (naam.trim().length < 2) return setError('Kies een naam van minstens 2 tekens.')
    if (tab === 'nieuw' && !email.includes('@')) return setError('Vul een geldig e-mailadres in.')
    if (ww.length < 4) return setError('Je wachtwoord moet minstens 4 tekens zijn.')
    setBusy(true)
    const h = await hash(ww)
    setBusy(false)
    if (tab === 'nieuw') {
      const r = registerAccount(naam, email, h, remember)
      if (r === 'bestaat') return setError('Deze naam bestaat al op dit apparaat — log in.')
      sfx('complete')
    } else {
      const r = loginAccount(naam, h, remember)
      if (r === 'fout') return setError('Naam of wachtwoord klopt niet.')
      sfx('correct')
    }
  }

  return (
    <div className="shell shell--bare" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="center">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar size={92} level={1} courseId="es" />
          </div>
          <h1 className="display hot-text" style={{ fontSize: 44, margin: '6px 0 2px' }}>
            Fluent
          </h1>
          <p className="dim" style={{ fontSize: 14, marginBottom: 22 }}>
            {tab === 'nieuw' ? 'Maak je account — je voortgang wordt onthouden.' : 'Welkom terug.'}
          </p>
        </div>

        <div className="row" style={{ gap: 8, marginBottom: 16 }}>
          <button
            className={tab === 'nieuw' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ padding: '11px 12px', fontSize: 14 }}
            onClick={() => {
              setTab('nieuw')
              setError(null)
            }}
          >
            Account maken
          </button>
          <button
            className={tab === 'inloggen' ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ padding: '11px 12px', fontSize: 14 }}
            onClick={() => {
              setTab('inloggen')
              setError(null)
            }}
          >
            Inloggen
          </button>
        </div>

        <div className="col" style={{ gap: 10 }}>
          <input className="type-input" placeholder="Je naam" value={naam} onChange={(e) => setNaam(e.target.value)} autoCapitalize="off" />
          {tab === 'nieuw' && (
            <input
              className="type-input"
              placeholder="E-mailadres (voor je welkomstmail)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="off"
            />
          )}
          <input
            className="type-input"
            placeholder="Wachtwoord"
            type="password"
            value={ww}
            onChange={(e) => setWw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void submit()
            }}
          />
        </div>

        <button className="row" style={{ gap: 10, padding: '14px 2px', width: '100%' }} onClick={() => setRemember(!remember)}>
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
            — je ziet dit scherm nooit meer
          </span>
        </button>

        {error && (
          <p style={{ color: 'var(--err)', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{error}</p>
        )}

        <button className="btn btn-primary" disabled={busy} onClick={() => void submit()}>
          {tab === 'nieuw' ? 'Start direct' : 'Inloggen'}
        </button>
        {tab === 'nieuw' && (
          <p className="faint center" style={{ fontSize: 12, marginTop: 12 }}>
            Geen bevestigingsmail, geen gedoe — je gaat meteen door.
          </p>
        )}
      </motion.div>
    </div>
  )
}
