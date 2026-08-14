import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { courseList } from '../content'
import { useStore } from '../store'
import { MAX_SKILL_LEVEL, skillStand, volgendeMijlpaal } from '../skills'
import { countryStates, courseFlagCode } from '../countries'
import type { CourseId } from '../types'
import { Flag } from './Flag'
import { sfx } from '../audio'
import { AANTAL_FAMILIES, FAMILIES, type WoordFamilie } from '../content/cognaten'
import { WoordBoom } from './WoordBoom'

/**
 * Het vaardighedenpaneel, gebouwd naar het beroemde RuneScape-scherm: een
 * compact raster van drie kolommen, per vakje het icoon links en rechts twee
 * gouden getallen diagonaal boven elkaar (jouw niveau boven, 99 onder), met
 * het totaalniveau in de balk eronder. Tik een vaardigheid aan en je ziet de
 * details: XP, wat er nog tot het volgende niveau bij moet, je mijlpaal en
 * alle soorten van die taal.
 */

interface Rij {
  id: CourseId
  naam: string
  xp: number
  stand: ReturnType<typeof skillStand>
  lessen: number
  woorden: number
  gesprekken: number
  stempels: number
  landen: ReturnType<typeof countryStates>
}

/** Eén vaardigheidsvakje in RuneScape-stijl */
function SkillTegel({ r, actief, onClick }: { r: Rij; actief: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={`${r.naam}: niveau ${r.stand.level} van ${MAX_SKILL_LEVEL}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '9px 8px',
        minHeight: 52,
        borderRadius: 12,
        background: actief ? 'rgba(255, 197, 61, 0.12)' : 'var(--surface-2)',
        border: `1.5px solid ${actief ? 'var(--gold)' : r.stand.meester ? 'var(--line-gold)' : 'var(--line)'}`,
        boxShadow: r.stand.meester ? 'var(--glow-gold)' : 'inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <Flag code={courseFlagCode[r.id]} size={22} />
      {/* de twee getallen diagonaal, precies zoals in RuneScape */}
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1, flex: 1 }}>
        <span
          className="num"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--goud-tekst)', alignSelf: 'flex-start' }}
        >
          {r.stand.level}
        </span>
        <span
          className="num"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--goud-tekst-dim)', opacity: 0.8, alignSelf: 'flex-end', marginTop: 1 }}
        >
          {MAX_SKILL_LEVEL}
        </span>
      </span>
    </button>
  )
}

/** Alle vaardigheidsrijen uit de store, op één plek berekend */
function useSkillRijen(): Rij[] {
  const progress = useStore((s) => s.progress)
  const srs = useStore((s) => s.srs)
  const gesprekken = useStore((s) => s.gesprekken)
  const stamps = useStore((s) => s.stamps)
  return courseList.map((c) => {
    const xp = progress[c.id]?.xp ?? 0
    const lessen = progress[c.id]?.completed.length ?? 0
    return {
      id: c.id,
      naam: c.name,
      xp,
      stand: skillStand(xp),
      lessen,
      woorden: Object.values(srs).filter((e) => e.courseId === c.id).length,
      gesprekken: gesprekken[c.id]?.length ?? 0,
      stempels: Object.keys(stamps[c.id] ?? {}).length,
      // alle soorten van deze taal: elk land op de route is een variant
      landen: countryStates(c, lessen),
    }
  })
}

/**
 * Het RuneScape-raster los bruikbaar: drie kolommen vakjes plus de
 * totaalniveaubalk. Staat op het profiel zonder één tik, en in het paneel.
 */
export function SkillRaster({ actief, onTegel }: { actief?: CourseId; onTegel: (id: CourseId) => void }) {
  const rijen = useSkillRijen()
  const totaal = rijen.reduce((n, r) => n + r.stand.level, 0)
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
        {rijen.map((r) => (
          <SkillTegel key={r.id} r={r} actief={r.id === actief} onClick={() => onTegel(r.id)} />
        ))}
      </div>
      <div
        className="spread"
        style={{
          marginTop: 7,
          padding: '11px 14px',
          borderRadius: 12,
          background: 'rgba(255, 197, 61, 0.1)',
          border: '1.5px solid var(--line-gold)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Totaalniveau</span>
        <span className="gold-text num" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>
          {totaal}
        </span>
      </div>
    </>
  )
}

export function SkillsSheet({ onClose }: { onClose: () => void }) {
  const huidig = useStore((s) => s.courseId)
  const ontdekteIds = useStore((s) => s.ontdekteFamilies)
  const [open, setOpen] = useState<CourseId>(huidig)
  /** familie die je uit je verzameling terugkijkt */
  const [familie, setFamilie] = useState<WoordFamilie | null>(null)
  const ontdekt = FAMILIES.filter((f) => ontdekteIds.includes(f.id))

  const rijen = useSkillRijen()
  const detail = rijen.find((r) => r.id === open) ?? rijen[0]
  const mijlpaal = volgendeMijlpaal(detail.stand.level)

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { sfx('tap'); onClose() }}
        style={{ zIndex: 70 }}
      >
        <motion.div
          className="modal-panel"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 130 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="display" style={{ fontSize: 24, marginBottom: 2 }}>
            🎓 Vaardigheden
          </h3>
          <p className="dim" style={{ fontSize: 12.5, marginBottom: 14 }}>
            Elke taal train je van 1 naar 99. Tik een taal aan voor de details.
          </p>

          {/* het raster van drie kolommen, het hart van het RuneScape-scherm */}
          <SkillRaster actief={open} onTegel={(id) => { sfx('tap'); setOpen(id) }} />

          {/* de details van de aangetikte vaardigheid */}
          <motion.div
            key={detail.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass"
            style={{ padding: '14px 16px', marginTop: 14, borderColor: detail.stand.meester ? 'var(--line-gold)' : undefined }}
          >
            <div className="row" style={{ gap: 10 }}>
              <Flag code={courseFlagCode[detail.id]} size={24} />
              <strong className="card-title" style={{ flex: 1 }}>
                {detail.naam}
              </strong>
              <span className={`num ${detail.stand.meester ? 'gold-text' : ''}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19 }}>
                {detail.stand.meester && '🏆 '}
                {detail.stand.level}
                <span className="faint" style={{ fontSize: 12, fontWeight: 700 }}> /{MAX_SKILL_LEVEL}</span>
              </span>
            </div>

            <div className="progress-track" style={{ height: 8, margin: '10px 0 7px' }}>
              <div
                className={`progress-fill ${detail.stand.meester ? 'progress-fill--gold' : ''}`}
                style={{ width: `${Math.max(detail.xp > 0 ? 3 : 0, Math.round(detail.stand.frac * 100))}%` }}
              />
            </div>

            <p className="faint num" style={{ fontSize: 11.5 }}>
              {detail.stand.meester
                ? `${detail.xp} XP · meester van het ${detail.naam}`
                : `${detail.xp} XP · nog ${detail.stand.breedte - detail.stand.binnen} XP tot niveau ${detail.stand.level + 1}${
                    mijlpaal && mijlpaal > detail.stand.level + 1 ? ` · mijlpaal: ${mijlpaal}` : ''
                  }`}
            </p>

            {detail.xp > 0 && (
              <>
                <p className="faint num" style={{ fontSize: 11, marginTop: 5 }}>
                  {detail.lessen} {detail.lessen === 1 ? 'les' : 'lessen'} · {detail.woorden} {detail.woorden === 1 ? 'woord' : 'woorden'} ·{' '}
                  {detail.gesprekken} {detail.gesprekken === 1 ? 'gesprek' : 'gesprekken'} · {detail.stempels}{' '}
                  {detail.stempels === 1 ? 'stempel' : 'stempels'}
                </p>
                <div className="spread" style={{ marginTop: 9 }}>
                  <span className="faint" style={{ fontSize: 11 }}>
                    Soorten {detail.naam}
                  </span>
                  <span className="faint num" style={{ fontSize: 11 }}>
                    {detail.landen.filter((l) => l.conquered).length}/{detail.landen.length}
                  </span>
                </div>
                <div className="row" style={{ flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
                  {detail.landen.map((l) => (
                    <span
                      key={l.name + l.threshold}
                      title={l.conquered ? `${l.name}: veroverd` : `${l.name}: na ${l.threshold} lessen`}
                      style={{
                        lineHeight: 0,
                        opacity: l.conquered ? 1 : 0.25,
                        filter: l.conquered ? 'drop-shadow(0 0 5px rgba(255,197,61,0.55))' : 'grayscale(0.8)',
                      }}
                    >
                      <Flag code={l.code} size={17} />
                    </span>
                  ))}
                </div>
              </>
            )}
            {detail.xp === 0 && (
              <p className="dim" style={{ fontSize: 12.5, marginTop: 6 }}>
                Nog niet begonnen. Eén les en je staat al op niveau 10.
              </p>
            )}

            {/* de meestermantel: het eindbeeld waar alles naartoe werkt. Tot
                niveau 99 hangt hij hier als silhouet te wachten. */}
            <div className="row" style={{ gap: 11, marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--line)' }}>
              <svg
                width="34"
                height="40"
                viewBox="0 0 34 40"
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  filter: detail.stand.meester ? 'drop-shadow(0 0 8px rgba(255,197,61,0.6))' : 'none',
                  opacity: detail.stand.meester ? 1 : 0.5,
                }}
              >
                {/* de kap */}
                <path
                  d="M 17 1 L 27 6 L 24 10 L 10 10 L 7 6 Z"
                  fill={detail.stand.meester ? 'var(--gold)' : 'var(--surface-3)'}
                  stroke={detail.stand.meester ? 'var(--gold-bright)' : 'var(--line)'}
                  strokeWidth="1.2"
                />
                {/* de mantel zelf, wapperend */}
                <path
                  d="M 10 10 L 24 10 L 29 34 L 23 31 L 17 36 L 11 31 L 5 34 Z"
                  fill={detail.stand.meester ? 'url(#mantelverloop)' : 'var(--surface-2)'}
                  stroke={detail.stand.meester ? 'var(--gold)' : 'var(--line)'}
                  strokeWidth="1.2"
                />
                <defs>
                  <linearGradient id="mantelverloop" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--hot1)" />
                    <stop offset="55%" stopColor="var(--hot2)" />
                    <stop offset="100%" stopColor="var(--gold)" />
                  </linearGradient>
                </defs>
                {/* het embleem op de borst */}
                <circle cx="17" cy="18" r="3.4" fill={detail.stand.meester ? 'var(--gold-bright)' : 'var(--line)'} />
              </svg>
              <div className="col" style={{ gap: 1, minWidth: 0 }}>
                <strong style={{ fontSize: 13, fontWeight: 700 }}>
                  {detail.stand.meester ? `De meestermantel van het ${detail.naam}` : 'De meestermantel'}
                </strong>
                <span className="faint" style={{ fontSize: 11.5 }}>
                  {detail.stand.meester
                    ? 'Verdiend op niveau 99. Je personage draagt hem overal.'
                    : 'Wacht op je bij niveau 99, in de kleuren van jouw taalwereld.'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* De Woordenstamboom: je verzameling ontdekte woordfamilies */}
          <div className="glass" style={{ padding: '13px 15px', marginTop: 12 }}>
            <div className="spread">
              <span className="row" style={{ gap: 10 }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(74,222,128,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🌳</span>
                <strong className="card-title">Woordenstamboom</strong>
              </span>
              <span className="gold-text num" style={{ fontWeight: 700, fontSize: 13.5 }}>
                {ontdekt.length}/{AANTAL_FAMILIES}
              </span>
            </div>
            <p className="dim" style={{ fontSize: 12.5, margin: '7px 0 9px' }}>
              {ontdekt.length === 0
                ? 'Leer een nieuw woord en ontdek zijn familie in de andere talen. Elke ontdekking maakt je in meerdere talen beter.'
                : 'Woorden die over de talen heen dezelfde stam delen. Tik een familie aan om hem terug te zien.'}
            </p>
            {ontdekt.length > 0 && (
              <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
                {ontdekt.slice(0, 12).map((f) => (
                  <button
                    key={f.id}
                    className="tile"
                    style={{ fontSize: 12.5, minHeight: 36, padding: '7px 11px' }}
                    onClick={() => { sfx('tap'); setFamilie(f) }}
                  >
                    {f.stam}
                  </button>
                ))}
              </div>
            )}
          </div>

          {familie && (
            <WoordBoom familie={familie} jouwTaal={huidig} ontdekt={false} onSluiten={() => setFamilie(null)} />
          )}

          <p className="faint center" style={{ fontSize: 11.5, marginTop: 12 }}>
            Niveau 99 is een echte prestatie: wie hem haalt, is meester van die taal.
          </p>
          <button className="btn btn-ghost" style={{ marginTop: 10, padding: 12, fontSize: 14 }} onClick={() => { sfx('tap'); onClose() }}>
            Sluiten
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
