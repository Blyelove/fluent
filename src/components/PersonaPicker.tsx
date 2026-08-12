import {
  Avatar,
  EXTRA_NAMES,
  GENDER_NAMES,
  HAIR_COLORS,
  HAIR_STYLE_NAMES,
  MOUTH_NAMES,
  OUTFIT_COLORS,
  SKINS,
  type AvatarStyle,
} from './Avatar'
import { sfx } from '../audio'

/** De personage-maker: 10 haarstijlen × 8 huidtinten × 12 haarkleuren × 10 outfits × extra's × monden */
export function PersonaPicker({ value, onChange }: { value: AvatarStyle; onChange: (p: AvatarStyle) => void }) {
  const set = (patch: Partial<AvatarStyle>) => {
    sfx('tap')
    onChange({ ...value, ...patch })
  }

  const Swatches = ({ colors, active, pick }: { colors: string[]; active: number; pick: (i: number) => void }) => (
    <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
      {colors.map((c, i) => (
        <button
          key={c}
          onClick={() => pick(i)}
          aria-label={`kleur ${i + 1}`}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: c,
            border: active === i ? '3px solid var(--hot2)' : '2px solid rgba(255,255,255,0.25)',
            boxShadow: active === i ? '0 0 12px rgba(236,72,153,0.5)' : '0 2px 0 rgba(0,0,0,0.35)',
            transition: 'transform 0.1s ease',
            transform: active === i ? 'scale(1.12)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="glass" style={{ padding: 16, marginBottom: 16 }}>
      <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
        <div className="center" style={{ flexShrink: 0 }}>
          <Avatar size={96} look={value} courseId="es" />
          <p className="faint" style={{ fontSize: 10.5, marginTop: 2 }}>
            Dit ben jij
          </p>
        </div>
        <div className="col" style={{ gap: 10, flex: 1, minWidth: 0 }}>
          <div>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
              Ik ben een...
            </p>
            <div className="row" style={{ gap: 8 }}>
              {GENDER_NAMES.map((name, i) => (
                <button
                  key={name}
                  onClick={() => set({ gender: i, hair: i === 1 ? 1 : 0, extra: i === 1 ? 2 : value.extra })}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 12,
                    fontSize: 13.5,
                    fontWeight: 800,
                    background: (value.gender ?? 0) === i ? 'var(--grad-hot)' : 'var(--surface-2)',
                    color: (value.gender ?? 0) === i ? '#fff' : 'var(--text-dim)',
                    border: (value.gender ?? 0) === i ? 'none' : '1.5px solid var(--line)',
                    boxShadow: (value.gender ?? 0) === i ? '0 3px 0 #7e22ce' : '0 3px 0 rgba(0,0,0,0.3)',
                  }}
                >
                  {i === 0 ? '♂' : '♀'} {name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
              Haarstijl — met jouw kleuren
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {HAIR_STYLE_NAMES.map((name, i) => (
                <button
                  key={name}
                  onClick={() => set({ hair: i })}
                  title={name}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: value.hair === i ? 'rgba(236,72,153,0.16)' : 'var(--surface-2)',
                    border: value.hair === i ? '2px solid var(--hot2)' : '1.5px solid var(--line)',
                    padding: '3px 0 2px',
                  }}
                >
                  <div style={{ height: 38, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                    <Avatar size={56} look={{ ...value, hair: i }} courseId="es" still />
                  </div>
                  <p style={{ fontSize: 9.5, fontWeight: 700, color: value.hair === i ? 'var(--hot2)' : 'var(--text-faint)' }}>{name}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
              Extra
            </p>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
              {EXTRA_NAMES.map((name, i) => (
                <button
                  key={name}
                  onClick={() => set({ extra: i })}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: (value.extra ?? 0) === i ? 'var(--grad-hot)' : 'var(--surface-2)',
                    color: (value.extra ?? 0) === i ? '#fff' : 'var(--text-dim)',
                    border: (value.extra ?? 0) === i ? 'none' : '1.5px solid var(--line)',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
              Mond
            </p>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
              {MOUTH_NAMES.map((name, i) => (
                <button
                  key={name}
                  onClick={() => set({ mouth: i })}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: (value.mouth ?? 0) === i ? 'var(--grad-hot)' : 'var(--surface-2)',
                    color: (value.mouth ?? 0) === i ? '#fff' : 'var(--text-dim)',
                    border: (value.mouth ?? 0) === i ? 'none' : '1.5px solid var(--line)',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
              Huidskleur
            </p>
            <Swatches colors={SKINS} active={value.skin} pick={(i) => set({ skin: i })} />
          </div>
          <div>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
              Haarkleur
            </p>
            <Swatches colors={HAIR_COLORS} active={value.hairColor} pick={(i) => set({ hairColor: i })} />
          </div>
          <div>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
              Outfit
            </p>
            <Swatches colors={OUTFIT_COLORS} active={value.outfit} pick={(i) => set({ outfit: i })} />
          </div>
        </div>
      </div>
      <p className="faint center" style={{ fontSize: 11, marginTop: 10 }}>
        300.000+ combinaties — maak jezelf, en zie jezelf per niveau vetter worden
      </p>
    </div>
  )
}
