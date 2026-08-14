import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CourseId, Unit, UnitGuide } from '../types'
import { loadGuides } from '../content/guides'
import { speak, sfx } from '../audio'

/** Uitklapbaar gidspaneel: legt in het Nederlands uit wáárom iets zo is */
export function GuideSheet({
  unit,
  courseId,
  ttsLang,
  onClose,
}: {
  unit: Unit
  courseId: CourseId
  ttsLang: string
  onClose: () => void
}) {
  const [guide, setGuide] = useState<UnitGuide | null>(null)
  const [bezig, setBezig] = useState(true)

  useEffect(() => {
    let levend = true
    void loadGuides(courseId).then((g) => {
      if (!levend) return
      setGuide(g[unit.id] ?? null)
      setBezig(false)
    })
    return () => {
      levend = false
    }
  }, [courseId, unit.id])

  const Zin = ({ target, nl }: { target: string; nl: string }) => (
    <button
      className="row"
      style={{ gap: 8, width: '100%', textAlign: 'left', padding: '9px 0', minHeight: 44 }}
      onClick={() => {
        sfx('tap')
        speak(target, ttsLang)
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          flexShrink: 0,
          background: 'var(--hot-25)',
          border: '1px solid var(--hot-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12.5,
        }}
      >
        ▶
      </span>
      <span className="col" style={{ gap: 0, flex: 1, minWidth: 0 }}>
        <strong style={{ fontSize: 14 }}>{target}</strong>
        <span className="faint" style={{ fontSize: 12.5 }}>
          {nl}
        </span>
      </span>
    </button>
  )

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-panel"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="row" style={{ gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>{unit.icon}</span>
            <span className="col" style={{ gap: 0, flex: 1 }}>
              <span className="eyebrow" style={{ fontSize: 11 }}>
                Gids
              </span>
              <strong className="display" style={{ fontSize: 19 }}>
                {unit.title}
              </strong>
            </span>
          </div>

          {bezig && (
            <p className="dim" style={{ fontSize: 14, padding: '18px 0' }}>
              Gids wordt geladen…
            </p>
          )}

          {!bezig && !guide && (
            <p className="dim" style={{ fontSize: 14, padding: '14px 0' }}>
              Voor dit onderwerp is nog geen gids geschreven. Hij komt eraan.
            </p>
          )}

          {guide && (
            <>
              <p className="dim" style={{ fontSize: 14, margin: '8px 0 16px', lineHeight: 1.5 }}>
                {guide.intro}
              </p>

              {guide.rules.map((r, i) => (
                <div
                  key={i}
                  className="glass"
                  style={{ padding: '14px 16px', marginBottom: 12, background: 'var(--glans-05)' }}
                >
                  <strong className="hot-text" style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                    {r.title}
                  </strong>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-dim)' }}>{r.explanation}</p>
                  <div style={{ marginTop: 8, borderTop: '1px solid var(--line)' }}>
                    {r.examples.map((e, j) => (
                      <Zin key={j} target={e.target} nl={e.nl} />
                    ))}
                  </div>
                </div>
              ))}

              {guide.phrases.length > 0 && (
                <div className="glass" style={{ padding: '10px 16px', marginBottom: 12 }}>
                  <p className="eyebrow" style={{ fontSize: 11, padding: '6px 0' }}>
                    Meteen te gebruiken
                  </p>
                  {guide.phrases.map((p, i) => (
                    <Zin key={i} target={p.target} nl={p.nl} />
                  ))}
                </div>
              )}

              {guide.tip && (
                <div
                  className="glass row"
                  style={{ padding: '13px 16px', gap: 12, alignItems: 'flex-start', borderColor: 'var(--line-gold)' }}
                >
                  <span style={{ fontSize: 19, lineHeight: 1 }}>💡</span>
                  <span className="col" style={{ gap: 0 }}>
                    <strong className="gold-text" style={{ fontSize: 14 }}>
                      Let op als Nederlandstalige
                    </strong>
                    <span style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text-dim)' }}>{guide.tip}</span>
                  </span>
                </div>
              )}
            </>
          )}

          <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={onClose}>
            Sluiten
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
