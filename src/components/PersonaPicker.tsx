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
import { GALERIJ } from './avatarGallery'
import { BOUW_NAMEN, BROW_NAMEN, GEZICHT_NAMEN, NEUS_NAMEN, OOG_NAMEN } from './avatar-trekken'
import { sfx } from '../audio'

/**
 * De personage-maker. Tien haarstijlen maal acht huidtinten maal twaalf
 * haarkleuren maal tien outfits maal acht gezichtsvormen maal acht oogvormen
 * maal acht wenkbrauwen maal acht neuzen maal acht monden maal acht bouwen.
 */
export function PersonaPicker({ value, onChange }: { value: AvatarStyle; onChange: (p: AvatarStyle) => void }) {
  const set = (patch: Partial<AvatarStyle>) => {
    sfx('tap')
    onChange({ ...value, ...patch })
  }

  /**
   * Eén rij keuzes voor één trek, elk als een echt personage in het klein.
   *
   * Woorden als "Tuit" en "Streep" zeggen niets over hoe een mond eruitziet;
   * je moet het zien. Elke tegel tekent dus jouw eigen personage met alleen
   * díe trek veranderd, zodat je vergelijkt wat je werkelijk krijgt.
   */
  const TrekRij = ({
    titel,
    sleutel,
    namen,
    heel,
  }: {
    titel: string
    sleutel: keyof AvatarStyle
    namen: string[]
    /** het hele lijf laten zien in plaats van alleen het hoofd */
    heel?: boolean
  }) => (
    <div>
      <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5, color: 'var(--text-faint)' }}>
        {titel}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: 6 }}>
        {namen.map((naam, i) => {
          const aan = ((value[sleutel] as number | undefined) ?? 0) === i
          return (
            <button
              key={naam}
              onClick={() => set({ [sleutel]: i } as Partial<AvatarStyle>)}
              title={naam}
              aria-label={`${titel}: ${naam}`}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                background: aan ? 'rgba(236,72,153,0.16)' : 'var(--surface-2)',
                border: aan ? '2px solid var(--hot2)' : '1.5px solid var(--line)',
                padding: '3px 0 2px',
                minHeight: 44,
              }}
            >
              {/* een venster op de tekening: bij een gezichtstrek kijk je naar
                  het hoofd, bij de bouw naar het hele lijf */}
              <div
                style={{
                  height: heel ? 54 : 40,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <Avatar size={heel ? 54 : 62} look={{ ...value, [sleutel]: i }} courseId="es" still />
              </div>
              <p style={{ fontSize: 9.5, fontWeight: 700, color: aan ? 'var(--hot2)' : 'var(--text-faint)' }}>{naam}</p>
            </button>
          )
        })}
      </div>
    </div>
  )

  const Swatches = ({ colors, active, pick }: { colors: string[]; active: number; pick: (i: number) => void }) => (
    <div className="row" style={{ gap: 2, flexWrap: 'wrap', marginLeft: -7 }}>
      {colors.map((c, i) => (
        <button
          key={c}
          onClick={() => pick(i)}
          aria-label={`kleur ${i + 1}`}
          // 44px raakvlak met een cirkel van 30px erin: goed te raken zonder
          // dat het rooster uit elkaar valt
          style={{
            width: 44,
            height: 44,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
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
        </button>
      ))}
    </div>
  )

  // dezelfde vergelijking als de galerij gebruikt om dubbelen te weren
  const zelfde = (q: AvatarStyle) =>
    q.hair === value.hair &&
    q.skin === value.skin &&
    q.hairColor === value.hairColor &&
    q.outfit === value.outfit &&
    (q.extra ?? 0) === (value.extra ?? 0) &&
    (q.gender ?? 0) === (value.gender ?? 0) &&
    (q.mouth ?? 0) === (value.mouth ?? 0)

  // eerst man of vrouw kiezen — de galerij toont daarna alleen díe helden
  const geslacht = value.gender ?? 0
  const helden = GALERIJ.filter((h) => (h.stijl.gender ?? 0) === geslacht)

  return (
    <div className="glass" style={{ padding: 16, marginBottom: 16 }}>
      <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
        Stap 1: ik ben een...
      </p>
      <div className="row" style={{ gap: 8, marginBottom: 14 }}>
        {GENDER_NAMES.map((name, gi) => (
          <button
            key={name}
            // wisselen van geslacht gooit je gekozen kapsel niet meer weg
            onClick={() => set({ gender: gi })}
            style={{
              flex: 1,
              padding: '11px 10px',
              borderRadius: 12,
              fontSize: 14.5,
              fontWeight: 800,
              background: geslacht === gi ? 'var(--grad-hot)' : 'var(--surface-2)',
              color: geslacht === gi ? '#fff' : 'var(--text-dim)',
              border: geslacht === gi ? 'none' : '1.5px solid var(--line)',
              boxShadow: geslacht === gi ? '0 3px 0 #7e22ce' : '0 3px 0 rgba(0,0,0,0.3)',
            }}
          >
            {gi === 0 ? '♂' : '♀'} {name}
          </button>
        ))}
      </div>

      <div className="spread" style={{ marginBottom: 6 }}>
        <p className="eyebrow" style={{ fontSize: 10 }}>
          Stap 2: kies je held ({helden.length} karakters)
        </p>
        <button
          onClick={() => {
            sfx('tap')
            const kies = helden[Math.floor(Math.random() * helden.length)]
            if (kies) onChange({ ...kies.stijl })
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            background: 'var(--surface-2)',
            border: '1.5px solid var(--line-hot)',
            color: 'var(--hot2)',
            minHeight: 32,
          }}
        >
          🎲 Verras me
        </button>
      </div>
      <p className="faint" style={{ fontSize: 11.5, marginBottom: 10 }}>
        Allemaal uniek en direct te kiezen. Onderaan stel je hem zelf samen uit ruim 300.000 combinaties.
      </p>
      {/* de helden van jouw keuze in één raster; .galerij-cel rendert alleen
          wat in beeld is, dus ook honderden figuren scrollen soepel */}
      <div
        className="no-scrollbar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(58px, 1fr))',
          gap: 6,
          marginBottom: 12,
          maxHeight: 340,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          borderBottom: '1.5px solid var(--line)',
          paddingBottom: 8,
        }}
      >
        {helden.map((h, i) => {
          const actief = zelfde(h.stijl)
          return (
            <button
              key={i}
              className="galerij-cel"
              onClick={() => {
                sfx('tap')
                onChange({ ...h.stijl })
              }}
              title={h.naam}
              style={{
                minHeight: 76,
                borderRadius: 14,
                padding: '3px 0 2px',
                background: actief ? 'rgba(236,72,153,0.16)' : 'var(--surface-2)',
                border: actief ? '2px solid var(--hot2)' : '1.5px solid var(--line)',
              }}
            >
              <div style={{ height: 46, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                <Avatar size={62} look={h.stijl} courseId="es" still />
              </div>
              <p style={{ fontSize: 9.5, fontWeight: 700, color: actief ? 'var(--hot2)' : 'var(--text-faint)' }}>{h.naam}</p>
            </button>
          )
        })}
      </div>
      {/* Het voorbeeld hoort bovenaan te blijven plakken en de keuzes horen de
          volle breedte te krijgen. Eerder stonden ze naast elkaar, en dan hield
          een telefoon van 375 nog ongeveer 190 pixels over voor de keuzes: acht
          varianten pasten daar in twee kolommen, dus vier rijen per trek. Nu
          zie je je personage de hele tijd terwijl je eronder doorloopt. */}
      <div className="col" style={{ gap: 12 }}>
        <div
          className="center"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            paddingBottom: 6,
            background: 'linear-gradient(var(--surface) 72%, transparent)',
          }}
        >
          <Avatar size={96} look={value} courseId="es" />
          <p className="faint" style={{ fontSize: 10.5, marginTop: 2 }}>
            Dit ben jij
          </p>
        </div>
        <div className="col" style={{ gap: 10, minWidth: 0 }}>
          <div>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5 }}>
              Stap 3 (mag ook): maak hem helemaal eigen
            </p>
            <p className="eyebrow" style={{ fontSize: 10, marginBottom: 5, color: 'var(--text-faint)' }}>
              Haarstijl, met jouw kleuren
            </p>
            {/* minimaal 60px per tegel: op 375px werden vijf kolommen te smal
                voor de 56px-avatar en de 44px-tikgrens */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: 6 }}>
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
                    padding: '11px 14px',
                    minHeight: 44,
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
          {/* De trekken die een gezicht herkenbaar maken. Ze stonden er niet
              in, en daardoor leken twee personages met dezelfde haarkleur
              precies op elkaar. */}
          <TrekRij titel="Gezichtsvorm" sleutel="face" namen={GEZICHT_NAMEN} />
          <TrekRij titel="Ogen" sleutel="eyes" namen={OOG_NAMEN} />
          <TrekRij titel="Wenkbrauwen" sleutel="brows" namen={BROW_NAMEN} />
          <TrekRij titel="Neus" sleutel="nose" namen={NEUS_NAMEN} />
          <TrekRij titel="Mond" sleutel="mouth" namen={MOUTH_NAMES} />
          <TrekRij titel="Lichaamsbouw" sleutel="build" namen={BOUW_NAMEN} heel />
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
        Ruim 300.000 combinaties. Maak jezelf, en zie jezelf per niveau vetter worden.
      </p>
    </div>
  )
}
