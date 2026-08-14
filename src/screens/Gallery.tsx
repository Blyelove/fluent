import type { CSSProperties, ReactNode } from 'react'
import { levelReward, levelTitle, wardrobeFor, xpToReach } from '../levels'
import { Avatar } from '../components/Avatar'
import { Flag } from '../components/Flag'

/**
 * Interne stijlgids-pagina (?gallery=all) — print-vriendelijk overzicht van
 * alle visuele groeistappen, voor design-review. Geen app-state nodig.
 */

const PAGE: CSSProperties = {
  width: 794,
  minHeight: 1122,
  margin: '0 auto',
  padding: '56px 56px 40px',
  background: '#0B0A08',
  backgroundImage: 'radial-gradient(900px 500px at 50% -10%, rgba(212,175,106,0.09), transparent 60%)',
  breakAfter: 'page',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
}

function Page({ children, title, sub }: { children: ReactNode; title?: string; sub?: string }) {
  return (
    <div style={PAGE}>
      {title && (
        <>
          <p className="eyebrow">{sub ?? 'Fluent · Visuele stijlgids'}</p>
          <h2 className="display" style={{ fontSize: 34, margin: '6px 0 6px' }}>
            {title}
          </h2>
          <div style={{ width: 48, height: 2, background: 'linear-gradient(135deg,#EED9A0,#B08D4C)', borderRadius: 2, marginBottom: 24 }} />
        </>
      )}
      {children}
    </div>
  )
}

const SWATCHES = [
  { hex: '#0E0B1F', name: 'Achtergrond', note: 'diep indigo' },
  { hex: '#F5F3FF', name: 'Tekst', note: 'helder wit' },
  { hex: '#A855F7', name: 'Paars', note: 'primaire actie (gradiënt)' },
  { hex: '#EC4899', name: 'Roze', note: 'primaire actie (gradiënt)' },
  { hex: '#FFC53D', name: 'Amber', note: 'XP en beloningen' },
  { hex: '#22D3EE', name: 'Cyaan', note: 'selectie en focus' },
  { hex: '#4ADE80', name: 'Juist', note: 'goed antwoord' },
  { hex: '#FB7185', name: 'Fout', note: 'fout antwoord' },
]

export function Gallery() {
  return (
    <div style={{ background: '#0B0A08' }}>
      {/* ======== omslag ======== */}
      <div style={{ ...PAGE, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Avatar size={170} level={10} courseId="es" still />
        <p className="eyebrow" style={{ marginTop: 32 }}>
          Visuele stijlgids & groeisysteem
        </p>
        <h1 className="display hot-text" style={{ fontSize: 64, letterSpacing: '0.02em', margin: '10px 0' }}>
          Fluent
        </h1>
        <p className="dim" style={{ fontSize: 16 }}>
          Taal leren die je niet meer loslaat.
        </p>
        <div style={{ width: 48, height: 2, background: 'linear-gradient(135deg,#EED9A0,#B08D4C)', borderRadius: 2, margin: '22px 0' }} />
        <p className="faint" style={{ fontSize: 14, maxWidth: 420 }}>
          Compleet overzicht van alle visuele groeistappen: kleuren, typografie, Auro's evolutie per niveau, het gouden leerpad en elk
          UI-element — om samen te beoordelen.
        </p>
        <p className="faint" style={{ fontSize: 12.5, position: 'absolute', bottom: 40 }}>
          Conceptversie · augustus 2026
        </p>
      </div>

      {/* ======== kleuren & typografie ======== */}
      <Page title="Kleuren & typografie">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          {SWATCHES.map((s) => (
            <div key={s.hex} className="glass" style={{ padding: 12, borderRadius: 14 }}>
              <div style={{ height: 56, borderRadius: 10, background: s.hex, border: '1px solid rgba(255,255,255,0.12)' }} />
              <p style={{ fontSize: 12.5, fontWeight: 700, marginTop: 8 }}>{s.name}</p>
              <p className="faint" style={{ fontSize: 11 }}>
                {s.hex} · {s.note}
              </p>
            </div>
          ))}
        </div>
        <div className="glass" style={{ padding: 24, marginTop: 24 }}>
          <p className="eyebrow">Baloo 2 — voor titels en momenten</p>
          <p className="display" style={{ fontSize: 34, margin: '4px 0 18px' }}>
            Prachtig. Vlekkeloos. Veroverd.
          </p>
          <p className="eyebrow">Instrument Sans — voor interface en leestekst</p>
          <p style={{ fontSize: 16, marginTop: 4 }}>
            Heldere, moderne interfacetekst. <strong>Vet voor nadruk</strong>, <span className="dim">gedempt voor bijzaken</span>,{' '}
            <span className="gold-text" style={{ fontWeight: 700 }}>
              goud voor beloning
            </span>
            .
          </p>
        </div>
        <div className="glass" style={{ padding: 24, marginTop: 16 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>
            De zes cursussen
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {(
              [
                ['gb', 'Engels'],
                ['es', 'Spaans'],
                ['fr', 'Frans'],
                ['de', 'Duits'],
                ['it', 'Italiaans'],
                ['pt', 'Portugees'],
              ] as const
            ).map(([code, name]) => (
              <span key={code} className="row" style={{ gap: 8, fontSize: 14, fontWeight: 600 }}>
                <Flag code={code} size={18} /> {name}
              </span>
            ))}
          </div>
        </div>
      </Page>

      {/* ======== Auro evolutie 1-5 ======== */}
      <Page title="Jouw transformatie — niveau 1 t/m 5" sub="Groeisysteem (voorbeeld: Spaans) · jij wordt steeds meer van de cultuur">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div key={lvl} className="glass" style={{ padding: '18px 20px', textAlign: 'center' }}>
              <Avatar size={130} level={lvl} courseId="es" still />
              <p className="display gold-text" style={{ fontSize: 19, marginTop: 4 }}>
                Niveau {lvl} · {levelTitle(lvl)}
              </p>
              <p className="dim" style={{ fontSize: 12.5 }}>
                {lvl === 1 ? 'Startpunt — hier begint iedereen' : `Nieuw: ${levelReward('es', lvl)}`}
              </p>
              <p className="faint" style={{ fontSize: 11, marginTop: 0 }}>
                vanaf {xpToReach(lvl)} XP
              </p>
            </div>
          ))}
        </div>
      </Page>

      {/* ======== Auro evolutie 6-10 ======== */}
      <Page title="Jouw transformatie — niveau 6 t/m 10" sub="Groeisysteem (voorbeeld: Spaans) · de late niveaus zijn een échte prestatie">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[6, 7, 8, 9, 10].map((lvl) => (
            <div key={lvl} className="glass" style={{ padding: '18px 20px', textAlign: 'center' }}>
              <Avatar size={130} level={lvl} courseId="es" still />
              <p className="display gold-text" style={{ fontSize: 19, marginTop: 4 }}>
                Niveau {lvl} · {levelTitle(lvl)}
              </p>
              <p className="dim" style={{ fontSize: 12.5 }}>
                Nieuw: {levelReward('es', lvl)}
              </p>
              <p className="faint" style={{ fontSize: 11, marginTop: 0 }}>
                vanaf {xpToReach(lvl)} XP
              </p>
            </div>
          ))}
        </div>
        <p className="faint" style={{ fontSize: 12.5, marginTop: 16 }}>
          XP-curve: elk niveau kost 35% meer dan het vorige — niveau 2 haal je op dag één, niveau 10 is weken werk. Boven niveau 10:{' '}
          <strong style={{ color: '#D4AF6A' }}>Legende</strong>.
        </p>
      </Page>

      {/* ======== Auro standen ======== */}
      <Page title="De drie standen van jouw personage" sub="Wanneer je jezelf ziet bewegen">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {(
            [
              ['idle', 'Rustig', 'Op je startscherm en profiel — altijd aanwezig, knippert af en toe'],
              ['run', 'Rennend', 'Bij een landverovering ren jij over het scherm het nieuwe land binnen'],
              ['cheer', 'Juichend', 'Bij niveau-omhoog, gehaalde doelen en foutloze lessen'],
            ] as const
          ).map(([mode, name, desc]) => (
            <div key={mode} className="glass" style={{ padding: 16, textAlign: 'center' }}>
              <Avatar size={125} mode={mode} level={5} courseId="es" still />
              <p className="display gold-text" style={{ fontSize: 19, marginTop: 8 }}>
                {name}
              </p>
              <p className="dim" style={{ fontSize: 12.5, marginTop: 4 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <h3 className="display" style={{ fontSize: 23, margin: '34px 0 16px' }}>
          De beloningsketen na elke les
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['1 · Les voltooid', 'XP telt op met combo- en foutloos-bonus, reeks-vlam groeit'],
            ['2 · Dagelijkse missies', 'drie doelen per dag — alle drie gehaald = bonuskist +15 XP'],
            ['3 · Persoonlijk doel gehaald', 'met deadline — "2 dagen vóór je deadline!" + XP-beloning'],
            ['4 · Land veroverd', 'Auro rent over het scherm het nieuwe land binnen, vlag licht op'],
            ['5 · Niveau omhoog', 'confetti, nieuwe titel én een nieuw garderobe-item voor Auro'],
          ].map(([step, desc]) => (
            <div key={step} className="glass row" style={{ padding: '13px 18px', gap: 12 }}>
              <span className="gold-text display" style={{ fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {step}
              </span>
              <span className="dim" style={{ fontSize: 14 }}>
                {desc}
              </span>
            </div>
          ))}
        </div>
      </Page>

      {/* ======== het pad ======== */}
      <Page title="Het gouden leerpad" sub="Kernscherm · slingerende route per onderwerp">
        <div style={{ position: 'relative', width: 480, margin: '0 auto' }}>
          <div className="path-line" style={{ top: 10, bottom: 10 }} />
          <div className="unit-banner unit-banner-done" style={{ margin: '0 0 6px' }}>
            <span style={{ fontSize: 23 }}>👋</span>
            <strong style={{ flex: 1, fontSize: 14 }}>Begroetingen & basis</strong>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>✓ Voltooid</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '22px 0' }}>
            <button className="node-big done">
              <span style={{ fontSize: 23, fontWeight: 800 }}>✓</span>
            </button>
          </div>
          <div className="unit-banner unit-banner-active" style={{ margin: '24px 0 6px' }}>
            <span style={{ fontSize: 23 }}>☕</span>
            <strong style={{ flex: 1, fontSize: 14 }}>Eten & drinken</strong>
            <span className="faint" style={{ fontSize: 12.5, fontWeight: 700 }}>1/3</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateX(58px)', margin: '30px 0' }}>
            <button className="node-big current">
              <span className="start-label">Start</span>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z" />
              </svg>
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '22px 0' }}>
            <button className="node-big locked">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z" />
              </svg>
            </button>
          </div>
          <div className="unit-banner" style={{ margin: '24px 0 6px' }}>
            <span style={{ fontSize: 23 }}>💛</span>
            <strong style={{ flex: 1, fontSize: 14 }}>Mensen & familie</strong>
            <span className="faint" style={{ fontSize: 12.5, fontWeight: 700 }}>0/3</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateX(-58px)', margin: '22px 0 8px' }}>
            <button className="node-big open">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z" />
              </svg>
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 24 }}>
          {[
            ['Goud gevuld + vinkje', 'les voltooid'],
            ['Groot, gloeiend + Start-label', 'de aanbevolen volgende les'],
            ['Gouden rand, open ster', 'vrij te beginnen (ander onderwerp)'],
            ['Gedimd', 'nog vergrendeld binnen het onderwerp'],
          ].map(([a, b]) => (
            <p key={a} style={{ fontSize: 12.5 }}>
              <strong style={{ color: '#D4AF6A' }}>{a}</strong> <span className="dim">— {b}</span>
            </p>
          ))}
        </div>
      </Page>

      {/* ======== UI-elementen ======== */}
      <Page title="Interface-elementen" sub="Bouwstenen · knoppen, antwoorden en feedback">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              Antwoordopties
            </p>
            <div className="col" style={{ gap: 8 }}>
              <div className="opt">een antwoord</div>
              <div className="opt selected">gekozen antwoord</div>
              <div className="opt correct">juist antwoord</div>
              <div className="opt wrong" style={{ animation: 'none' }}>
                fout antwoord
              </div>
            </div>
            <p className="eyebrow" style={{ margin: '20px 0 10px' }}>
              Woordtegels
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tile">woord</span>
              <span className="tile tile-picked">gekozen</span>
              <span className="tile used">gebruikt</span>
            </div>
            <p className="eyebrow" style={{ margin: '20px 0 10px' }}>
              Knoppen
            </p>
            <div className="col" style={{ gap: 8 }}>
              <button className="btn btn-primary">Controleren</button>
              <button className="btn btn-ghost">+ Doel stellen</button>
            </div>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              Les-feedback
            </p>
            <div className="sheet-inner good" style={{ borderRadius: 18, marginBottom: 12 }}>
              <p className="feedback-title ok-text">Uitstekend.</p>
              <button className="btn btn-primary" style={{ marginTop: 8 }}>
                Verder
              </button>
            </div>
            <div className="sheet-inner bad" style={{ borderRadius: 18 }}>
              <p className="feedback-title err-text">Bijna.</p>
              <p className="dim" style={{ fontSize: 14 }}>
                Juiste antwoord: <strong style={{ color: '#F2ECDF' }}>buenos días</strong>
              </p>
              <button className="btn btn-primary" style={{ marginTop: 8 }}>
                Verder
              </button>
            </div>
            <p className="eyebrow" style={{ margin: '20px 0 10px' }}>
              Statistieken
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div className="glass stat-card">
                <div className="stat-value gold-text">+17</div>
                <div className="stat-label">XP verdiend</div>
              </div>
              <div className="glass stat-card">
                <div className="stat-value">7</div>
                <div className="stat-label">dagen reeks</div>
              </div>
            </div>
          </div>
        </div>

        <p className="eyebrow" style={{ margin: '26px 0 10px' }}>
          Wereldverovering — vlaggen gloeien goud zodra veroverd
        </p>
        <div className="glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {(['es', 'mx', 'co', 'ar', 'pe', 'cl', 'ec', 'gt', 'cu', 'bo', 'do', 'uy', 'cr', 'pa'] as const).map((code, i) => (
              <span key={code} className={i < 3 ? 'flag-conquered' : ''} style={{ opacity: i < 3 ? 1 : 0.25, lineHeight: 0 }}>
                <Flag code={code} size={22} />
              </span>
            ))}
            <span className="dim" style={{ fontSize: 12.5, marginLeft: 8 }}>
              3 van 14 veroverd — steeds meer lessen per land
            </span>
          </div>
        </div>

        <p className="eyebrow" style={{ margin: '22px 0 10px' }}>
          Garderobe-ladder
        </p>
        <div className="glass" style={{ padding: '8px 20px' }}>
          {wardrobeFor('es').map((w, i) => (
            <div key={w.level} className="spread" style={{ padding: '9px 0', borderBottom: i < 8 ? '1px solid rgba(255,255,255,0.09)' : 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{w.item}</span>
              <span className="faint" style={{ fontSize: 12.5 }}>
                Niveau {w.level}
              </span>
            </div>
          ))}
        </div>
      </Page>
    </div>
  )
}
