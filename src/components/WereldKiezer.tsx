import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { WERELDEN, pasWereldToe } from '../werelden'
import { useStore } from '../store'
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
  const [open, setOpen] = useState(false)

  // de gekozen wereld staat op <html>, dus elk scherm erft hem
  useEffect(() => {
    pasWereldToe(wereld)
  }, [wereld])

  if (verborgen) return null
  const huidig = WERELDEN.find((w) => w.id === wereld) ?? WERELDEN[0]

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
              <p className="dim" style={{ fontSize: 12.5, marginBottom: 14 }}>
                Elke taal verdient zijn eigen beeld. Tik een wereld aan en de hele app spreekt hem meteen. Sluiten en rondkijken mag:
                je keuze blijft staan.
              </p>

              <div className="col" style={{ gap: 9 }}>
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
                Nu aan: {huidig.naam}. Dit is een proeverij; straks kiest de app zelf de wereld die bij je taal hoort.
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
