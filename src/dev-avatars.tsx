// TIJDELIJKE controlepagina voor de 8 personages — wordt na de check verwijderd
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Avatar, AVATAR_STYLES, AVATAR_STYLE_NAMES, DEFAULT_PERSONA, type AvatarStyle, type Look } from './components/Avatar'
import { PersonaPicker } from './components/PersonaPicker'
import './styles/global.css'

const label: React.CSSProperties = { fontSize: 12, color: '#fff', textAlign: 'center', fontFamily: 'sans-serif' }

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ color: '#FFC53D', fontFamily: 'sans-serif', fontSize: 13, margin: '0 0 4px' }}>{title}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-end' }}>{children}</div>
    </div>
  )
}

function Preview() {
  const [persona, setPersona] = useState<AvatarStyle>(DEFAULT_PERSONA)
  const big: Look[][] = [
    ['a', 'b', 'c', 'd'],
    ['e', 'f', 'g', 'h'],
  ]
  return (
    <div style={{ padding: 12, background: '#0E0B1F', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{ width: 460, flexShrink: 0 }}>
        <p style={{ color: '#FFC53D', fontFamily: 'sans-serif', fontSize: 13 }}>PersonaPicker op 460px (telefoonbreedte)</p>
        <PersonaPicker value={persona} onChange={setPersona} />
      </div>
      <div>
        <Row title="size 62 — niveau 1">
          {AVATAR_STYLES.map((l) => (
            <div key={l}>
              <Avatar size={62} look={l} courseId="es" level={1} still />
              <p style={label}>{l}</p>
            </div>
          ))}
        </Row>
        <Row title="size 56 — niveau 10">
          {AVATAR_STYLES.map((l) => (
            <Avatar key={l} size={56} look={l} courseId="fr" level={10} still />
          ))}
        </Row>
        <Row title="size 56 — niveau 20">
          {AVATAR_STYLES.map((l) => (
            <Avatar key={l} size={56} look={l} courseId="de" level={20} still />
          ))}
        </Row>
        {big.map((group, gi) => (
          <Row key={gi} title={`size 200 — niveau 1 (${group.join(' ')})`}>
            {group.map((l) => (
              <div key={l}>
                <Avatar size={200} look={l} courseId="es" level={1} still />
                <p style={label}>
                  {l} · {AVATAR_STYLE_NAMES[l]}
                </p>
              </div>
            ))}
          </Row>
        ))}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
