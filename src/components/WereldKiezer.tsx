import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { WERELDEN, WERELD_PER_TAAL, pasWereldToe, rijkdomVoor } from '../werelden'
import { useStore } from '../store'
import { skillStand } from '../skills'
import { sfx } from '../audio'

/**
 * De wereldkiezer: vergelijk de taalwerelden op je eigen scherm.
 *
 * Geen mockups en geen plaatjes naast elkaar, maar de échte app die per tik
 * van dialect wisselt. Zo zie je meteen of een wereld het houdt op elk scherm
 * dat je normaal gebruikt, en niet alleen op een mooi uitgekozen voorbeeld.
 */
export function WereldKiezer({ verborgen }: { verborgen?: boolean }) {
  const wereld = useStore((s) => s.wereld)
  const setWereld = useStore((s) => s.setWereld)
  const taal = useStore((s) => s.courseId)
  const niveau = useStore((s) => skillStand(s.progress[s.courseId]?.xp ?? 0).level)
  const [open, setOpen] = useState(false)

  // wereld en rijkdom staan op <html>, dus elk scherm erft ze
  useEffect(() => {
    pasWereldToe(wereld, taal, niveau)
  }, [wereld, taal, niveau])

  if (verborgen) return null
  const automatisch = WERELD_PER_TAAL[taal]
  const actiefId = wereld || automatisch
  const huidig = WERELDEN.find((w) => w.id === actiefId)
  const trap = rijkdomVoor(niveau)

  return (
    <>
      <button
        onClick={() => { sfx('tap'); setOpen(true) }}
        aria-label="Kies een taalwereld"
        style={{
          position: 'fixed',
          right: 14,
          bottom: 92,
          zIndex: 45,
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          background: 'var(--grad-hot)',
          boxShadow: 'var(--glow-hot)',
        }}
      >
        🎨
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { sfx('tap'); setOpen(false) }}
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
              <h3 className="display" style={{ fontSize: 23, marginBottom: 2 }}>
                🎨 Kies je taalwereld
              </h3>
              <p className="dim" style={{ fontSize: 12.5, marginBottom: 12 }}>
                Elke taal heeft zijn eigen beeld. Normaal kiest de app hem bij je taal; hier mag je zelf proeven. Tik een wereld aan en
                de hele app spreekt hem meteen.
              </p>

              {/* de rijkdomtrap: je wereld groeit mee met je niveau */}
              <div className="glass" style={{ padding: '11px 13px', marginBottom: 12 }}>
                <div className="spread">
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>Rijkdom van je wereld</span>
                  <span className="gold-text num" style={{ fontWeight: 800, fontSize: 13 }}>
                    {trap} / 5
                  </span>
                </div>
                <div className="row" style={{ gap: 4, marginTop: 7 }}>
                  {[1, 2, 3, 4, 5].map((t) => (
                    <span
                      key={t}
                      style={{
                        flex: 1,
                        height: 5,
                        borderRadius: 999,
                        background: t <= trap ? 'var(--grad-gold)' : 'var(--surface-3)',
                      }}
                    />
                  ))}
                </div>
                <p className="faint" style={{ fontSize: 11, marginTop: 6 }}>
                  Niveau {niveau} in het {huidig?.naam ?? 'Spaans'}. Hoe dichter bij 99, hoe voller je wereld wordt: het ornament komt op,
                  het licht wordt dieper.
                </p>
              </div>

              <div className="col" style={{ gap: 9 }}>
                {/* automatisch: de app volgt gewoon de taal die je leert */}
                <button
                  onClick={() => { sfx('tap'); setWereld('') }}
                  className="row"
                  style={{
                    gap: 12,
                    padding: '12px 14px',
                    minHeight: 56,
                    borderRadius: 16,
                    textAlign: 'left',
                    background: wereld === '' ? 'var(--surface-3)' : 'var(--surface)',
                    border: `1.5px solid ${wereld === '' ? 'var(--line-hot)' : 'var(--line)'}`,
                    boxShadow: wereld === '' ? 'var(--glow-hot)' : undefined,
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0, width: 45, textAlign: 'center' }}>🌍</span>
                  <span className="col" style={{ flex: 1, minWidth: 0, gap: 1 }}>
                    <strong className="card-title">Volg mijn taal</strong>
                    <span className="faint" style={{ fontSize: 12 }}>
                      De app kiest de wereld die bij je taal hoort
                    </span>
                  </span>
                  {wereld === '' && (
                    <span className="hot-text" style={{ fontWeight: 800, fontSize: 12.5, flexShrink: 0 }}>
                      AAN
                    </span>
                  )}
                </button>

                {WERELDEN.map((w) => {
                  const actief = w.id === wereld
                  return (
                    <button
                      key={w.id || 'neon'}
                      onClick={() => { sfx('tap'); setWereld(w.id) }}
                      className="row"
                      style={{
                        gap: 12,
                        padding: '12px 14px',
                        minHeight: 56,
                        borderRadius: 16,
                        textAlign: 'left',
                        background: actief ? 'var(--surface-3)' : 'var(--surface)',
                        border: `1.5px solid ${actief ? 'var(--line-hot)' : 'var(--line)'}`,
                        boxShadow: actief ? 'var(--glow-hot)' : undefined,
                      }}
                    >
                      {/* de drie dragende kleuren als staaltjes */}
                      <span className="row" style={{ gap: 0, flexShrink: 0 }}>
                        {w.proef.map((c, i) => (
                          <span
                            key={c}
                            style={{
                              width: 15,
                              height: 30,
                              background: c,
                              borderTopLeftRadius: i === 0 ? 8 : 0,
                              borderBottomLeftRadius: i === 0 ? 8 : 0,
                              borderTopRightRadius: i === 2 ? 8 : 0,
                              borderBottomRightRadius: i === 2 ? 8 : 0,
                            }}
                          />
                        ))}
                      </span>
                      <span className="col" style={{ flex: 1, minWidth: 0, gap: 1 }}>
                        <strong className="card-title">{w.naam}</strong>
                        <span className="faint" style={{ fontSize: 12 }}>
                          {w.herkomst}
                        </span>
                      </span>
                      {actief && (
                        <span className="hot-text" style={{ fontWeight: 800, fontSize: 12.5, flexShrink: 0 }}>
                          AAN
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <p className="faint center" style={{ fontSize: 11.5, marginTop: 12 }}>
                Nu aan: {huidig?.naam ?? 'Neon arcade'}
                {wereld === '' ? ', automatisch gekozen bij je taal' : ', jouw eigen keuze'}
              </p>
              <button className="btn btn-ghost" style={{ marginTop: 10, padding: 12, fontSize: 14 }} onClick={() => { sfx('tap'); setOpen(false) }}>
                Sluiten en rondkijken
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
