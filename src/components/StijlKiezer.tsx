import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../store'
import { ARENA_STIJLEN, BREUK_STIJLEN, LEVELUP_STIJLEN, STANDAARD_STIJLEN, XP_STIJLEN, type Richting } from '../stijlen'
import { Schildbreuk, type BreukStijl } from './Schildbreuk'
import { sfx } from '../audio'

/**
 * De proeverij: kies per moment welke richting wint.
 *
 * Geen beschrijvingen of plaatjes, maar de echte app. Elke keuze stuurt
 * meteen het echte component aan, en met de knop ernaast speel je het
 * moment af zodat je het ziet voordat je kiest.
 */

type Sleutel = 'xp' | 'levelup' | 'arena' | 'breuk'

const GROEPEN: { sleutel: Sleutel; titel: string; uitleg: string; opties: Richting[] }[] = [
  { sleutel: 'xp', titel: 'De XP-drop', uitleg: 'Wat je ziet na elk goed antwoord', opties: XP_STIJLEN },
  { sleutel: 'levelup', titel: 'Het niveau omhoog', uitleg: 'Het moment waar alles voor gebeurt', opties: LEVELUP_STIJLEN },
  { sleutel: 'breuk', titel: 'De schildbreuk', uitleg: 'De klap als er in de arena een schild sneuvelt', opties: BREUK_STIJLEN },
  { sleutel: 'arena', titel: 'De arena-opkomst', uitleg: 'Hoe het gevecht zich opent', opties: ARENA_STIJLEN },
]

export function StijlKiezer() {
  const stijlen = useStore((s) => s.stijlen)
  const setStijl = useStore((s) => s.setStijl)
  const awardXp = useStore((s) => s.awardXp)
  const [open, setOpen] = useState(false)
  /* de breuk speelt hier écht af, met hetzelfde component als in het gevecht;
     de teller dwingt een nieuwe mount af zodat je hem opnieuw kunt zien */
  const [breukTik, setBreukTik] = useState(0)

  const nu = (sleutel: Sleutel) => stijlen[sleutel] ?? STANDAARD_STIJLEN[sleutel]

  return (
    <>
      <button
        className="spread"
        style={{ width: '100%', padding: '14px 0', minHeight: 44, borderBottom: '1px solid var(--line)', textAlign: 'left' }}
        onClick={() => { sfx('tap'); setOpen(true) }}
      >
        <span style={{ fontWeight: 500 }}>Momenten en effecten</span>
        <span className="row" style={{ gap: 8 }}>
          <span className="dim" style={{ fontSize: 14 }}>
            {XP_STIJLEN.find((x) => x.id === nu('xp'))?.naam ?? 'Klassiek'}
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
                ✨ Momenten en effecten
              </h3>
              <p className="dim" style={{ fontSize: 12.5, marginBottom: 16 }}>
                Kies per moment welke richting wint. Je keuze werkt meteen in de hele app, dus wat je hier kiest is precies wat je krijgt.
              </p>

              {GROEPEN.map((g) => (
                <div key={g.sleutel} style={{ marginBottom: 16 }}>
                  <div className="spread" style={{ marginBottom: 8 }}>
                    <strong className="card-title">{g.titel}</strong>
                    {g.sleutel !== 'arena' && (
                      <button
                        className="tile"
                        style={{ minHeight: 36, fontSize: 12.5, padding: '7px 12px' }}
                        onClick={() => {
                          sfx('tap')
                          if (g.sleutel === 'breuk') {
                            sfx('wrong')
                            setBreukTik((t) => t + 1)
                            return
                          }
                          // een echte boeking van 1 XP: de drop en, als je toevallig
                          // over een grens gaat, ook de viering komen vanzelf
                          awardXp(1)
                        }}
                      >
                        ▶ Speel af
                      </button>
                    )}
                  </div>
                  <p className="faint" style={{ fontSize: 11, marginBottom: 8 }}>
                    {g.uitleg}
                  </p>
                  {g.sleutel === 'breuk' && (
                    <div className="row center" style={{ gap: 4, marginBottom: 8, justifyContent: 'center' }}>
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          style={{ position: 'relative', width: 22, height: 24, display: 'inline-grid', placeItems: 'center' }}
                        >
                          <span style={{ fontSize: 19, opacity: i === 2 && breukTik > 0 ? 0 : 1, filter: 'drop-shadow(0 0 6px var(--cyaan-65))' }}>
                            🛡️
                          </span>
                          {i === 2 && breukTik > 0 && (
                            <Schildbreuk key={breukTik} stijl={nu('breuk') as BreukStijl} kalm={false} />
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="col" style={{ gap: 8 }}>
                    {g.opties.map((o) => {
                      const actief = o.id === nu(g.sleutel)
                      return (
                        <button
                          key={o.id}
                          onClick={() => {
                            sfx('tap')
                            setStijl(g.sleutel, o.id)
                            // meteen laten zien wat je net koos
                            if (g.sleutel === 'breuk') setBreukTik((t) => t + 1)
                          }}
                          className="row"
                          style={{
                            gap: 12,
                            padding: '11px 13px',
                            minHeight: 52,
                            borderRadius: 14,
                            textAlign: 'left',
                            background: actief ? 'var(--surface-3)' : 'var(--surface)',
                            border: `1.5px solid ${actief ? 'var(--line-hot)' : 'var(--line)'}`,
                            boxShadow: actief ? 'var(--glow-hot)' : undefined,
                          }}
                        >
                          <span className="col" style={{ flex: 1, minWidth: 0, gap: 0 }}>
                            <span className="row" style={{ gap: 8 }}>
                              <strong style={{ fontSize: 14, fontWeight: 700 }}>{o.naam}</strong>
                              {o.gedurfd && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    letterSpacing: '0.06em',
                                    color: 'var(--cyan)',
                                    border: '1px solid var(--cyan)',
                                    borderRadius: 6,
                                    padding: '1px 5px',
                                  }}
                                >
                                  GEDURFD
                                </span>
                              )}
                            </span>
                            <span className="faint" style={{ fontSize: 12.5 }}>
                              {o.kern}
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
                </div>
              ))}

              <p className="faint center" style={{ fontSize: 11, marginBottom: 8 }}>
                De arena-opkomst zie je bij je volgende gevecht. Proeven kan ook via de link, met ?arena=spot, ?breuk=as of ?levelup=92.
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
