/**
 * DE DAGTAAK
 *
 * De dagmissies stonden in een kaart van ruim tweehonderdvijftig pixels die
 * bij nul procent helemaal niets liet zien: drie lege rondjes, drie balkjes
 * van vijf pixels hoog die je op een donkere achtergrond niet terugvindt, en
 * een grijze zin die uitlegt wat je krijgt. Precies daarboven stond dezelfde
 * stand nog een keer als chip: "Vandaag 0/3". Twee keer hetzelfde getal binnen
 * honderd pixels, en de duurste ruimte van de app kwijt aan een leeg vinkje.
 *
 * Drie richtingen, alle drie echt te zien via ?dag= in de link:
 *
 *   spoor  Eén doorlopend spoor met drie stations en de kist aan het eind.
 *          Bij nul procent zie je nog steeds de reis van vandaag liggen,
 *          want een spoor is een vorm en geen lege balk.
 *   orbs   Drie ringmeters naast elkaar, RuneScape-stijl. Een ring die voor
 *          een kwart vol is lees je in een oogopslag; een balk van vijf pixels
 *          niet.
 *   boog   De gedurfde: geen kaart meer. Een strook van drie segmenten die
 *          tegen de hero aan ligt, en het leerpad schuift tweehonderdvijftig
 *          pixels omhoog.
 *
 * Alle drie tekenen in svg, want dat blijft scherp op elk scherm en het is de
 * enige manier om een boog eerlijk te vullen.
 */
import { useState, type CSSProperties, type ReactElement } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { sfx } from '../audio'

export type DagVorm = 'spoor' | 'orbs' | 'boog' | 'klassiek'

export type Missie = {
  label: string
  done: boolean
  frac: number
  icon: string
}

/** de vorm uit de link, zodat je alle drie naast elkaar kunt zien */
export function dagVormUitLink(): DagVorm {
  const p = new URLSearchParams(window.location.search).get('dag')
  return p === 'spoor' || p === 'orbs' || p === 'boog' || p === 'klassiek' ? p : 'spoor'
}

/**
 * Een ring die voor een deel vol is.
 *
 * Bewust getekend met een streepje-onderbreking en niet met een pad dat
 * meegroeit: een cirkelomtrek is exact te rekenen, en dan klopt de vulling
 * ook bij drie procent nog op de pixel.
 */
function Ring({ frac, maat, dik }: { frac: number; maat: number; dik: number }) {
  const straal = (maat - dik) / 2
  const omtrek = 2 * Math.PI * straal
  return (
    <svg width={maat} height={maat} viewBox={`0 0 ${maat} ${maat}`} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      {/* 25% wit en niet 13%: op een glazen kaart verdween de lege ring
          helemaal, en dan zie je bij nul procent nog steeds niets */}
      <circle cx={maat / 2} cy={maat / 2} r={straal} fill="none" stroke="var(--glans-25)" strokeWidth={dik} />
      {frac > 0 && (
        <motion.circle
          cx={maat / 2}
          cy={maat / 2}
          r={straal}
          fill="none"
          stroke="var(--gold)"
          strokeWidth={dik}
          strokeLinecap="round"
          strokeDasharray={omtrek}
          initial={{ strokeDashoffset: omtrek }}
          animate={{ strokeDashoffset: omtrek * (1 - frac) }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          transform={`rotate(-90 ${maat / 2} ${maat / 2})`}
        />
      )}
    </svg>
  )
}

/** het station op het spoor: gehaald, waar je nu bent, of nog te gaan */
function Station({ m, nu }: { m: Missie; nu: boolean }) {
  return (
    <span
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        lineHeight: 1,
        position: 'relative',
        zIndex: 1,
        background: m.done ? 'var(--grad-gold)' : 'var(--surface-2)',
        border: m.done ? 'none' : `1px solid ${nu ? 'var(--line-gold)' : 'var(--line)'}`,
        // wat je nog moet doen staat er wel, maar dringt zich niet op
        opacity: m.done || nu ? 1 : 0.62,
        boxShadow: nu && !m.done ? '0 0 0 3px var(--goud-16)' : 'none',
      }}
    >
      {m.done ? '✓' : m.icon}
    </span>
  )
}

/**
 * Het blad achter één tik: de drie missies met hun echte stand erbij, en wat
 * de kist oplevert. In de strook staat alleen wat je in een halve seconde moet
 * kunnen zien; het naadje van "0 van de 40 XP" hoort hier.
 */
function DagBlad({ missies, kistOpen, sluit }: { missies: Missie[]; kistOpen: boolean; sluit: () => void }) {
  const klaar = missies.filter((m) => m.done).length
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => { sfx('tap'); sluit() }}
      style={{ zIndex: 90 }}
    >
      <motion.div
        className="modal-panel"
        initial={{ y: 90 }}
        animate={{ y: 0 }}
        exit={{ y: 130 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="display" style={{ fontSize: 23, marginBottom: 0 }}>
          ⚜️ Vandaag
        </h3>
        <p className="dim" style={{ fontSize: 12.5, marginBottom: 16 }}>
          Drie dingen, elke dag opnieuw. Alle drie gehaald opent je kist: +15 XP en een kwartier dubbele XP.
        </p>
        <div className="col" style={{ gap: 12 }}>
          {missies.map((m) => (
            <div key={m.label} className="row" style={{ gap: 12, alignItems: 'center' }}>
              <span style={{ position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ring frac={m.frac} maat={40} dik={3} />
                <span style={{ fontSize: 16, lineHeight: 1 }}>{m.done ? '✓' : m.icon}</span>
              </span>
              <span className="col" style={{ gap: 0, minWidth: 0, flex: 1 }}>
                <strong style={{ fontSize: 14, color: m.done ? 'var(--gold)' : 'var(--text)' }}>{m.label}</strong>
                <span className="faint" style={{ fontSize: 12.5 }}>
                  {m.done ? 'gehaald' : `${Math.round(m.frac * 100)}% onderweg`}
                </span>
              </span>
            </div>
          ))}
        </div>
        <div
          className="row"
          style={{
            gap: 12,
            marginTop: 16,
            padding: '12px 16px',
            borderRadius: 16,
            background: klaar === missies.length ? 'var(--goud-10)' : 'var(--surface-2)',
            border: `1px solid ${klaar === missies.length ? 'var(--line-gold)' : 'var(--line)'}`,
          }}
        >
          <span style={{ fontSize: 23, lineHeight: 1, opacity: klaar === missies.length ? 1 : 0.62 }}>🎁</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: klaar === missies.length ? 'var(--gold)' : 'var(--text-dim)' }}>
            {kistOpen
              ? 'Kist geopend: +15 XP en 15 minuten dubbele XP'
              : klaar === missies.length
                ? 'Je kist staat klaar'
                : `Nog ${missies.length - klaar} te gaan voor je kist`}
          </span>
        </div>
        <button className="btn btn--ghost" style={{ marginTop: 16 }} onClick={() => { sfx('tap'); sluit() }}>
          Sluiten
        </button>
      </motion.div>
    </motion.div>
  )
}

export function DagTaak({
  vorm,
  missies,
  kistOpen,
}: {
  vorm: DagVorm
  missies: Missie[]
  kistOpen: boolean
}) {
  const [blad, zetBlad] = useState(false)
  const klaar = missies.filter((m) => m.done).length
  const alles = klaar === missies.length
  /* Het station waar je nú staat: de eerste die nog niet af is. Zonder dat
     ziet alles er even ver weg uit en weet je niet waar je moet beginnen. */
  const nuIdx = missies.findIndex((m) => !m.done)
  // hoe ver de reis van vandaag is: het gemiddelde van de drie, niet het
  // aantal afgevinkte, want dan springt de lijn van nul naar een derde
  const reis = missies.reduce((n, m) => n + m.frac, 0) / missies.length
  const tik = () => {
    sfx('tap')
    zetBlad(true)
  }
  /* Het blad hangt aan alle drie de vormen. Eerst zat de open-staat in het
     scherm eromheen, en toen kreeg de gedurfde vorm hem per ongeluk niet: de
     vorm die het blad het hardst nodig heeft, want daar staan de cijfers
     nergens anders. */
  const metBlad = (strook: ReactElement) => (
    <>
      {strook}
      <AnimatePresence>{blad && <DagBlad missies={missies} kistOpen={kistOpen} sluit={() => zetBlad(false)} />}</AnimatePresence>
    </>
  )

  /* ---------------- SPOOR ---------------- */
  if (vorm === 'spoor') {
    return metBlad(
      <button
        type="button"
        onClick={tik}
        className="glass unit-card rise dagtaak"
        id="vandaag"
        aria-label={`Dagelijkse missies, ${klaar} van ${missies.length} gehaald`}
        style={{ order: 0, scrollMarginTop: 16, width: '100%', textAlign: 'left', display: 'block', '--d': '180ms' } as CSSProperties}
      >
        <div className="spread" style={{ marginBottom: 16 }}>
          <strong className="card-title">Vandaag</strong>
          <span className={`num ${alles ? 'gold-text' : 'faint'}`} style={{ fontWeight: 700, fontSize: 14 }}>
            {klaar} / {missies.length}
          </span>
        </div>
        {/* het spoor zelf: één lijn onder de stations door, met de kist aan
            het eind. De lijn ligt achter de stations, dus hij loopt door en
            wordt niet in stukjes geknipt. */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            aria-hidden="true"
            style={{ position: 'absolute', left: 16, right: 16, top: 'calc(50% - 1px)', height: 2, borderRadius: 2, background: 'var(--glans-25)' }}
          />
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: reis }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: 'calc(50% - 1px)',
              height: 2,
              borderRadius: 2,
              background: 'var(--grad-gold)',
              transformOrigin: 'left center',
            }}
          />
          {missies.map((m, i) => (
            <Station key={m.label} m={m} nu={i === nuIdx} />
          ))}
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              lineHeight: 1,
              position: 'relative',
              zIndex: 1,
              background: alles ? 'var(--grad-gold)' : 'var(--surface-2)',
              border: alles ? 'none' : '1px solid var(--line)',
              opacity: alles ? 1 : 0.62,
            }}
          >
            🎁
          </span>
        </div>
        {/* één regel eronder: waar je nú staat, of wat de kist oplevert */}
        <p className="faint" style={{ fontSize: 12.5, marginTop: 12 }}>
          {kistOpen
            ? 'Kist geopend: +15 XP en 15 minuten dubbele XP'
            : alles
              ? 'Alle drie gehaald. Tik om je kist te openen.'
              : `Nu: ${missies[nuIdx].label} · alle drie = kist met +15 XP`}
        </p>
      </button>
    )
  }

  /* ---------------- ORBS ---------------- */
  if (vorm === 'orbs') {
    return metBlad(
      <button
        type="button"
        onClick={tik}
        className="glass unit-card rise dagtaak"
        id="vandaag"
        aria-label={`Dagelijkse missies, ${klaar} van ${missies.length} gehaald`}
        style={{ order: 0, scrollMarginTop: 16, width: '100%', textAlign: 'left', display: 'block', '--d': '180ms' } as CSSProperties}
      >
        <div className="spread" style={{ marginBottom: 16 }}>
          <strong className="card-title">Vandaag</strong>
          <span className={`num ${alles ? 'gold-text' : 'faint'}`} style={{ fontWeight: 700, fontSize: 14 }}>
            {klaar} / {missies.length}
          </span>
        </div>
        <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
          {missies.map((m, i) => (
            <span key={m.label} className="col center" style={{ gap: 8, flex: '1 1 0', minWidth: 0 }}>
              <span style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ring frac={m.frac} maat={56} dik={4} />
                <span
                  style={{
                    fontSize: 19,
                    lineHeight: 1,
                    // de ring draagt de stand, dus het teken erbinnen mag rustig
                    // blijven; alleen als je klaar bent wisselt hij naar een vink
                    opacity: m.done || i === nuIdx ? 1 : 0.62,
                  }}
                >
                  {m.done ? '✓' : m.icon}
                </span>
              </span>
              <span
                className="center"
                style={{
                  fontSize: 11.5,
                  lineHeight: 1.25,
                  fontWeight: 600,
                  color: m.done ? 'var(--text)' : 'var(--text-dim)',
                  // twee regels ruimte voor alle drie, ook als er maar één woord
                  // staat: anders zakt de rij scheef zodra "Speel een foutloze
                  // les" afbreekt en de andere twee op één regel blijven
                  minHeight: 32,
                  hyphens: 'auto',
                }}
              >
                {m.label}
              </span>
            </span>
          ))}
        </div>
        <p className="faint" style={{ fontSize: 12.5, marginTop: 16 }}>
          {kistOpen
            ? 'Kist geopend: +15 XP en 15 minuten dubbele XP'
            : alles
              ? 'Alle drie gehaald. Tik om je kist te openen.'
              : 'Alle drie = kist met +15 XP'}
        </p>
      </button>
    )
  }

  /* ---------------- BOOG: de gedurfde ---------------- */
  if (vorm === 'boog') {
    return metBlad(
      <button
        type="button"
        onClick={tik}
        id="vandaag"
        className="rise dagtaak dagtaak--boog"
        aria-label={`Dagelijkse missies, ${klaar} van ${missies.length} gehaald`}
        style={{ order: 0, scrollMarginTop: 16, width: '100%', '--d': '180ms' } as CSSProperties}
      >
        {/* Geen kaart. Drie segmenten die samen de dag zijn, plus de kist. De
            hele uitleg zit achter één tik, want die zin lees je één keer en
            daarna kost hij alleen nog ruimte. */}
        <span className="row" style={{ gap: 12, width: '100%', alignItems: 'center' }}>
          {missies.map((m, i) => (
            <span key={m.label} style={{ flex: '1 1 0', minWidth: 0, display: 'block' }}>
              <span
                aria-hidden="true"
                style={{ display: 'block', height: 6, borderRadius: 3, background: 'var(--glans-25)', overflow: 'hidden' }}
              >
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: m.frac }}
                  transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: i * 0.06 }}
                  style={{ display: 'block', height: '100%', borderRadius: 3, background: 'var(--grad-gold)', transformOrigin: 'left center' }}
                />
              </span>
              <span
                className="center"
                style={{
                  display: 'block',
                  marginTop: 8,
                  fontSize: 11.5,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: m.done ? 'var(--gold)' : 'var(--text-dim)',
                }}
              >
                {m.done ? '✓ ' : ''}
                {m.label}
              </span>
            </span>
          ))}
          <span
            style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              lineHeight: 1,
              alignSelf: 'flex-start',
              marginTop: -12,
              background: alles ? 'var(--grad-gold)' : 'var(--surface-2)',
              border: alles ? 'none' : '1px solid var(--line)',
              opacity: alles ? 1 : 0.62,
            }}
          >
            🎁
          </span>
        </span>
      </button>
    )
  }

  return null
}
