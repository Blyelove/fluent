import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { courses } from '../content'
import { useStore } from '../store'
import { MIJLPALEN, skillLevel, volgendeMijlpaal } from '../skills'
import type { CourseId } from '../types'
import { sfx } from '../audio'
import confetti from 'canvas-confetti'

/**
 * De XP-drops en het niveau-omhoog-moment, in RuneScape-geest.
 *
 * Eén luisteraar op de store ziet elke échte XP-boeking en elk echt
 * niveau: er wordt nergens nagerekend, alleen getoond wat de store al
 * besloot. Elke boeking laat een klein "+X" omhoog zweven zoals de
 * XP-drops van toen, en een niveausprong opent de viering: fanfare,
 * lichtflits, en bij de mijlpalen 10, 25, 50, 75, 92 en 99 groter dan
 * ertussen.
 */

interface Drop {
  id: number
  xp: number
  taal: CourseId
}

interface Viering {
  taal: CourseId
  level: number
  mijlpaal: boolean
}

let dropTeller = 0

export function XpDrops() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [viering, setViering] = useState<Viering | null>(null)
  const kalm = Boolean(useReducedMotion())

  useEffect(() => {
    // vorige stand per taal, om echte boekingen en echte sprongen te zien
    let vorige = useStore.getState().progress
    const los = useStore.subscribe((s) => {
      const nu = s.progress
      if (nu === vorige) return
      for (const taal of Object.keys(nu) as CourseId[]) {
        const xpNu = nu[taal]?.xp ?? 0
        const xpVorig = vorige[taal]?.xp ?? 0
        if (xpNu > xpVorig) {
          const erbij = xpNu - xpVorig
          const id = ++dropTeller
          setDrops((d) => [...d.slice(-2), { id, xp: erbij, taal }])
          window.setTimeout(() => setDrops((d) => d.filter((x) => x.id !== id)), 1400)

          const levelNu = skillLevel(xpNu)
          if (levelNu > skillLevel(xpVorig)) {
            const mijlpaal = (MIJLPALEN as readonly number[]).includes(levelNu)
            // de viering wacht heel even zodat de drop eerst valt
            window.setTimeout(() => {
              setViering({ taal, level: levelNu, mijlpaal })
              sfx('complete')
              confetti({
                particleCount: mijlpaal ? 160 : 70,
                spread: mijlpaal ? 110 : 70,
                startVelocity: mijlpaal ? 42 : 30,
                origin: { y: 0.4 },
                colors: ['#FFC53D', '#FFE08A', '#FFFFFF'],
                disableForReducedMotion: true,
              })
            }, 500)
          }
        }
      }
      vorige = nu
    })
    return los
  }, [])

  // proeven en vastleggen via de link: ?levelup=50 of ?levelup=92
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const l = Number(p.get('levelup'))
    if (l >= 2 && l <= 99) {
      const t = window.setTimeout(() => setViering({ taal: useStore.getState().courseId, level: l, mijlpaal: (MIJLPALEN as readonly number[]).includes(l) }), 600)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <>
      {/* de vallende XP, rechtsboven waar je voortgang leeft */}
      <div style={{ position: 'fixed', top: 64, right: 18, zIndex: 60, pointerEvents: 'none' }} aria-hidden="true">
        <AnimatePresence>
          {drops.map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 14, scale: 0.85 }}
              animate={{ opacity: 1, y: kalm ? 0 : -34, scale: 1 }}
              exit={{ opacity: 0, y: kalm ? 0 : -52 }}
              transition={{ duration: 1.1, ease: [0.2, 0.7, 0.3, 1] }}
              className="num"
              style={{
                position: 'absolute',
                right: 0,
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 17,
                color: 'var(--gold-bright)',
                textShadow: '0 1px 3px rgba(0,0,0,0.65), 0 0 14px rgba(255,197,61,0.55)',
              }}
            >
              +{d.xp} xp
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* het niveau-omhoog-moment: heilig */}
      <AnimatePresence>
        {viering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViering(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 85,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(4, 2, 12, 0.66)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              padding: 24,
            }}
          >
            {/* de lichtflits als vuurwerk, één keer */}
            {!kalm && (
              <motion.div
                initial={{ opacity: 0.9, scale: 0.2 }}
                animate={{ opacity: 0, scale: viering.mijlpaal ? 3.4 : 2.4 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,224,138,0.85) 0%, rgba(255,197,61,0.3) 45%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
            )}
            <motion.div
              initial={{ scale: 0.7, y: 22 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 17 }}
              onClick={(e) => e.stopPropagation()}
              className="card-hero center"
              style={{ padding: viering.mijlpaal ? '30px 26px' : '24px 24px', maxWidth: 320, width: '100%' }}
            >
              <p className="eyebrow" style={{ color: 'var(--hero-eyebrow)' }}>
                {viering.mijlpaal ? 'Mijlpaal bereikt' : 'Niveau omhoog'}
              </p>
              <p style={{ fontSize: viering.mijlpaal ? 58 : 44, lineHeight: 1.1, margin: '6px 0 2px' }} aria-hidden="true">
                {viering.level >= 99 ? '👑' : viering.mijlpaal ? '🎇' : '✨'}
              </p>
              <h3 className="display" style={{ fontSize: viering.mijlpaal ? 28 : 24, marginBottom: 4 }}>
                Je {courses[viering.taal].name} is nu{' '}
                <span className="gold-text num">niveau {viering.level}</span>
              </h3>
              {viering.level === 92 && (
                <p className="dim" style={{ fontSize: 13.5 }}>
                  Niveau 92: de helft van de XP naar 99 is binnen. Wie dit snapt, speelde RuneScape.
                </p>
              )}
              {viering.level === 99 && (
                <p className="gold-text" style={{ fontSize: 14, fontWeight: 700 }}>
                  Meester. De mantel is van jou.
                </p>
              )}
              {viering.level !== 92 && viering.level !== 99 && (
                <p className="dim" style={{ fontSize: 13 }}>
                  {volgendeMijlpaal(viering.level)
                    ? `Volgende mijlpaal: niveau ${volgendeMijlpaal(viering.level)}`
                    : 'De top is in zicht.'}
                </p>
              )}
              <button
                className="btn btn-primary"
                style={{ marginTop: 14, padding: 12, fontSize: 14.5 }}
                onClick={() => { sfx('tap'); setViering(null) }}
              >
                Verder trainen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
