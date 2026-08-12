import { AnimatePresence, motion } from 'motion/react'
import { courseList } from '../content'
import { useStore } from '../store'
import { MAX_SKILL_LEVEL, skillStand, volgendeMijlpaal } from '../skills'
import { countryStates, courseFlagCode } from '../countries'
import { Flag } from './Flag'
import { sfx } from '../audio'

/**
 * Het vaardighedenpaneel, in RuneScape-geest: druk op je poppetje en zie per
 * taal je level richting 99, met een totaalniveau bovenaan. Elke taal die je
 * ooit aanraakte telt mee; talen op level 1 lonken als volgende skill.
 */
export function SkillsSheet({ onClose }: { onClose: () => void }) {
  const progress = useStore((s) => s.progress)
  const srs = useStore((s) => s.srs)
  const gesprekken = useStore((s) => s.gesprekken)
  const stamps = useStore((s) => s.stamps)

  const rijen = courseList.map((c) => {
    const xp = progress[c.id]?.xp ?? 0
    const stand = skillStand(xp)
    const lessen = progress[c.id]?.completed.length ?? 0
    return {
      id: c.id,
      naam: c.name,
      xp,
      stand,
      lessen,
      woorden: Object.values(srs).filter((e) => e.courseId === c.id).length,
      gesprekken: gesprekken[c.id]?.length ?? 0,
      stempels: Object.keys(stamps[c.id] ?? {}).length,
      // alle soorten van deze taal: elk land op de route is een variant die
      // je kan veroveren, van Spanje-Spaans tot Mexicaans-Spaans
      landen: countryStates(c, lessen),
    }
  })
  // actiefste taal bovenaan, maar alles blijft zichtbaar: ook een level 1
  // skill is een uitnodiging
  rijen.sort((a, b) => b.xp - a.xp)
  const totaal = rijen.reduce((n, r) => n + r.stand.level, 0)

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
          <div className="spread" style={{ marginBottom: 4 }}>
            <h3 className="display" style={{ fontSize: 24 }}>
              🎓 Vaardigheden
            </h3>
            <span
              className="gold-text num"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}
              title="Som van al je taalniveaus"
            >
              Totaal {totaal}
            </span>
          </div>
          <p className="dim" style={{ fontSize: 13, marginBottom: 16 }}>
            Elke taal train je van level 1 naar 99. Alles wat je doet telt mee: lessen, herhalen, spelen, duelleren en praten.
          </p>

          <div className="col" style={{ gap: 10 }}>
            {rijen.map((r) => {
              const mijlpaal = volgendeMijlpaal(r.stand.level)
              return (
                <div
                  key={r.id}
                  className="glass"
                  style={{
                    padding: '12px 14px',
                    borderColor: r.stand.meester ? 'var(--line-gold)' : undefined,
                    boxShadow: r.stand.meester ? 'var(--glow-gold)' : undefined,
                  }}
                >
                  <div className="row" style={{ gap: 12 }}>
                    <Flag code={courseFlagCode[r.id]} size={26} />
                    <strong className="card-title" style={{ flex: 1 }}>
                      {r.naam}
                    </strong>
                    <span
                      className={`num ${r.stand.meester ? 'gold-text' : ''}`}
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19 }}
                    >
                      {r.stand.meester && '🏆 '}
                      {r.stand.level}
                      <span className="faint" style={{ fontSize: 12, fontWeight: 700 }}> /{MAX_SKILL_LEVEL}</span>
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 7, margin: '9px 0 7px' }}>
                    <div
                      className={`progress-fill ${r.stand.meester ? 'progress-fill--gold' : ''}`}
                      style={{ width: `${Math.max(r.xp > 0 ? 3 : 0, Math.round(r.stand.frac * 100))}%` }}
                    />
                  </div>
                  <div className="spread">
                    <span className="faint num" style={{ fontSize: 11.5 }}>
                      {r.stand.meester
                        ? `${r.xp} XP · meester van het ${r.naam}`
                        : `${r.xp} XP · nog ${r.stand.breedte - r.stand.binnen} tot level ${r.stand.level + 1}${mijlpaal && mijlpaal > r.stand.level + 1 ? ` · mijlpaal: ${mijlpaal}` : ''}`}
                    </span>
                  </div>
                  {r.xp > 0 && (
                    <>
                      <p className="faint num" style={{ fontSize: 11, marginTop: 4 }}>
                        {r.lessen} {r.lessen === 1 ? 'les' : 'lessen'} · {r.woorden} {r.woorden === 1 ? 'woord' : 'woorden'} · {r.gesprekken}{' '}
                        {r.gesprekken === 1 ? 'gesprek' : 'gesprekken'} · {r.stempels} {r.stempels === 1 ? 'stempel' : 'stempels'}
                      </p>
                      {/* alle soorten van deze taal: veroverde varianten in kleur */}
                      <div className="spread" style={{ marginTop: 8 }}>
                        <span className="faint" style={{ fontSize: 11 }}>
                          Soorten {r.naam}
                        </span>
                        <span className="faint num" style={{ fontSize: 11 }}>
                          {r.landen.filter((l) => l.conquered).length}/{r.landen.length}
                        </span>
                      </div>
                      <div className="row" style={{ flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
                        {r.landen.map((l) => (
                          <span
                            key={l.name + l.threshold}
                            title={l.conquered ? `${l.name}: veroverd` : `${l.name}: na ${l.threshold} lessen`}
                            style={{
                              lineHeight: 0,
                              opacity: l.conquered ? 1 : 0.25,
                              filter: l.conquered ? 'drop-shadow(0 0 5px rgba(255,197,61,0.55))' : 'grayscale(0.8)',
                            }}
                          >
                            <Flag code={l.code} size={16} />
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <p className="faint center" style={{ fontSize: 11.5, marginTop: 14 }}>
            Level 99 is een echte prestatie: wie hem haalt, is meester van die taal.
          </p>
          <button className="btn btn-ghost" style={{ marginTop: 10, padding: 12, fontSize: 14 }} onClick={() => { sfx('tap'); onClose() }}>
            Sluiten
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
