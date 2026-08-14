import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { totalXp, useStore } from '../store'
import { isMeester, skillStand } from '../skills'
import { levelProgress } from '../levels'
import { KAST, PLEKKEN, heeft, kastStand, volgendStuk, type Stuk } from '../garderobe'
import { Avatar } from './Avatar'
import { STANDAARD_STIJLEN, stijlUitLink } from '../stijlen'
import { sfx } from '../audio'

/**
 * De garderobe: alles wat je personage kan dragen, op een rij.
 *
 * Waarom dit er moest komen: de spullen kwamen stilletjes. Op niveau 8 hing er
 * ineens een cape en je wist niet dat hij eraan kwam. Wat je niet ziet
 * aankomen kun je ook niet willen, en dus werkt het niet.
 *
 * Elk stuk dat je nog niet hebt staat er als silhouet: je ziet dát het er is
 * en wat het kost, maar nog niet hoe het eruitziet. Dat is het verschil tussen
 * een lijst met beloftes en een kast waar je naar toe wil.
 */
export function Garderobe() {
  const [open, setOpen] = useState(false)
  const xpAll = useStore((s) => totalXp(s))
  const courseId = useStore((s) => s.courseId)
  const look = useStore((s) => s.avatarLook)
  const meester = useStore((s) => isMeester(s.progress[s.courseId]?.xp ?? 0))
  const taalNiveau = useStore((s) => skillStand(s.progress[s.courseId]?.xp ?? 0).level)
  const kastStijl = useStore((s) => stijlUitLink('kast') ?? s.stijlen.kast ?? STANDAARD_STIJLEN.kast)
  const niveau = levelProgress(xpAll).level
  const stand = kastStand(niveau, meester)
  const volgende = volgendStuk(niveau, meester)

  /* Een stuk laten zien betekent: het personage tekenen op het niveau waarop
     dat stuk erbij komt. Zo kijk je naar het echte ding en niet naar een
     pictogram dat erop lijkt. */
  const Tegel = ({ stuk }: { stuk: Stuk }) => {
    const heb = heeft(stuk, niveau, meester)
    return (
      <div
        title={stuk.naam}
        style={{
          borderRadius: 12,
          background: heb ? 'var(--surface-2)' : 'var(--surface)',
          border: `1.5px solid ${heb ? 'var(--line-gold)' : 'var(--line)'}`,
          padding: '4px 2px 3px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: 52,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            /* Wat je nog niet hebt, laat zien dát het er is zonder al te
               verklappen hoe mooi het is. Vier richtingen, want dit is precies
               het soort beslissing waar smaak over gaat. */
            filter: heb
              ? undefined
              : kastStijl === 'nevel'
                ? 'blur(3px) grayscale(0.7) opacity(0.5)'
                : kastStijl === 'omtrek'
                  ? 'brightness(0) opacity(0.22) drop-shadow(0 0 1px var(--text))'
                  : kastStijl === 'kier'
                    ? 'brightness(0) opacity(0.12)'
                    : 'brightness(0) opacity(0.34)',
          }}
        >
          <Avatar
            size={58}
            still
            level={Math.max(1, Math.min(20, stuk.vanaf))}
            courseId={courseId}
            look={look}
            meester={stuk.vanaf >= 99}
          />
        </div>
        {!heb && kastStijl === 'kier' && (
          /* één streep licht over het verborgen stuk: je weet dat er iets is */
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 24,
              height: 2,
              background: 'linear-gradient(90deg, transparent, var(--goud-50), transparent)',
            }}
          />
        )}
        <p style={{ fontSize: 11, fontWeight: 700, color: heb ? 'var(--text)' : 'var(--text-faint)', lineHeight: 1.15 }}>
          {stuk.naam}
        </p>
        <p style={{ fontSize: 11, color: heb ? 'var(--goud-tekst-dim)' : 'var(--text-faint)', lineHeight: 1.2 }}>
          {heb ? 'in bezit' : stuk.eis}
        </p>
      </div>
    )
  }

  return (
    <>
      <button
        className="spread"
        style={{ width: '100%', padding: '14px 0', minHeight: 44, borderBottom: '1px solid var(--line)', textAlign: 'left' }}
        onClick={() => { sfx('tap'); setOpen(true) }}
      >
        <span style={{ fontWeight: 500 }}>Garderobe</span>
        <span className="row" style={{ gap: 8 }}>
          <span className="dim num" style={{ fontSize: 14 }}>
            {stand.heb} van {stand.totaal}
          </span>
          <span className="faint" style={{ fontSize: 16 }}>
            ›
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { sfx('tap'); setOpen(false) }}
            style={{ zIndex: 88 }}
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
                Garderobe
              </h3>
              <p className="dim" style={{ fontSize: 12.5, marginBottom: 4 }}>
                Alles wat je personage kan dragen. Wat je nog niet hebt staat er als silhouet, met wat je ervoor moet doen.
              </p>
              <p className="faint num" style={{ fontSize: 11, marginBottom: 12 }}>
                {stand.heb} van de {stand.totaal} stukken in bezit
                {volgende ? ` · hierna: ${volgende.naam}, ${volgende.eis.toLowerCase()}` : ' · de kast is compleet'}
              </p>

              {PLEKKEN.map((p) => (
                <div key={p.plek} style={{ marginBottom: 16 }}>
                  <div className="spread" style={{ marginBottom: 4 }}>
                    <strong className="card-title" style={{ fontSize: 14 }}>
                      {p.naam}
                    </strong>
                    <span className="faint" style={{ fontSize: 11 }}>
                      {p.uitleg}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 4 }}>
                    {KAST[p.plek].map((stuk) => (
                      <Tegel key={stuk.id} stuk={stuk} />
                    ))}
                  </div>
                </div>
              ))}

              <p className="faint center" style={{ fontSize: 11, marginBottom: 8 }}>
                Je draagt wat bij je taalwereld hoort: hetzelfde stuk valt in elke wereld anders. Je bent nu niveau {taalNiveau} in deze taal.
              </p>
              <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14 }} onClick={() => { sfx('tap'); setOpen(false) }}>
                Sluiten
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
