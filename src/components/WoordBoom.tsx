import { AnimatePresence, motion } from 'motion/react'
import { courses } from '../content'
import { courseFlagCode } from '../countries'
import type { WoordFamilie } from '../content/cognaten'
import type { CourseId } from '../types'
import { Flag } from './Flag'
import { sfx, speak } from '../audio'

/**
 * De Woordenstamboom.
 *
 * Geen enkele taal-app doet dit: zodra je een woord leert, laten we zien uit
 * welke stam het komt en welke woorden in de andere vijf talen diezelfde stam
 * delen. Leer "amigo" en je krijgt ami, amico, amigo en amicable er gratis
 * bij, met het Latijnse amicus als wortel. Zo maakt elke les je niet in één
 * taal beter maar in vijf.
 *
 * Het beeld is een boom: de stam als gloeiende wortelknoop bovenin, met neon
 * takken naar elk familielid eronder. Elk lid is aantikbaar en spreekt zichzelf
 * uit met een moedertaalstem.
 */

const TAALVOLGORDE: CourseId[] = ['es', 'it', 'pt', 'fr', 'en', 'de']

export function WoordBoom({
  familie,
  jouwTaal,
  bonusTalen,
  ontdekt,
  onSluiten,
}: {
  familie: WoordFamilie
  /** de taal waarin je het woord zojuist leerde; die krijgt de kroon */
  jouwTaal: CourseId
  /** talen die XP kregen (leeg bij bladeren in je verzameling) */
  bonusTalen?: CourseId[]
  /** true = ontdekmoment met feest, false = rustig bekijken */
  ontdekt: boolean
  onSluiten: () => void
}) {
  const leden = TAALVOLGORDE.filter((t) => familie.leden[t]).map((t) => ({ taal: t, ...familie.leden[t]! }))
  const anderen = leden.filter((l) => l.taal !== jouwTaal)

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { sfx('tap'); onSluiten() }}
        style={{ zIndex: 80 }}
      >
        <motion.div
          className="modal-panel"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 130 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="eyebrow center" style={{ color: 'var(--hero-eyebrow)' }}>
            {ontdekt ? 'Woordfamilie ontdekt' : 'Woordfamilie'}
          </p>
          <h3 className="display center" style={{ fontSize: 23, margin: '6px 0 14px' }}>
            🌳 Eén woord, {leden.length} talen
          </h3>

          {/* de wortel: de stam waar alles uit voortkomt */}
          <motion.div
            initial={ontdekt ? { scale: 0.7, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="center"
            style={{
              padding: '14px 16px',
              borderRadius: 18,
              background: 'var(--goud-10)',
              border: '1.5px solid var(--line-gold)',
              boxShadow: 'var(--glow-gold)',
            }}
          >
            <p className="faint" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              {familie.herkomst}
            </p>
            <p className="display gold-text" style={{ fontSize: 28, lineHeight: 1.15, margin: '2px 0' }}>
              {familie.stam}
            </p>
            <p className="dim" style={{ fontSize: 14 }}>
              {familie.stamBetekenis}
            </p>
          </motion.div>

          {/* de takken: één neon lijn per familielid */}
          <svg viewBox="0 0 300 34" width="100%" height="34" aria-hidden="true" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="tak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" />
                <stop offset="100%" stopColor="var(--hot2)" />
              </linearGradient>
            </defs>
            {leden.map((l, i) => {
              const x = leden.length === 1 ? 150 : 26 + (i * (248 / (leden.length - 1)))
              return (
                <motion.path
                  key={l.taal}
                  d={`M 150 0 C 150 18, ${x} 14, ${x} 34`}
                  fill="none"
                  stroke="url(#tak)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={0.75}
                  initial={ontdekt ? { pathLength: 0 } : false}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
                />
              )
            })}
          </svg>

          {/* de familieleden, jouw taal met de kroon bovenaan */}
          <div className="col" style={{ gap: 8 }}>
            {leden.map((l, i) => {
              const jouwe = l.taal === jouwTaal
              const kreegXp = bonusTalen?.includes(l.taal)
              return (
                <motion.button
                  key={l.taal}
                  initial={ontdekt ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="row"
                  onClick={() => { sfx('tap'); speak(l.woord, courses[l.taal].ttsLang) }}
                  style={{
                    gap: 12,
                    padding: '11px 13px',
                    minHeight: 48,
                    borderRadius: 14,
                    textAlign: 'left',
                    background: jouwe ? 'var(--hot-16)' : 'var(--surface-2)',
                    border: `1.5px solid ${jouwe ? 'var(--line-hot)' : 'var(--line)'}`,
                  }}
                >
                  <Flag code={courseFlagCode[l.taal]} size={22} />
                  <span className="col" style={{ flex: 1, minWidth: 0, gap: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{l.woord}</span>
                    <span className="faint" style={{ fontSize: 12.5 }}>
                      {l.nl}
                    </span>
                  </span>
                  {jouwe ? (
                    <span className="hot-text" style={{ fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                      JIJ LEERDE DIT
                    </span>
                  ) : kreegXp ? (
                    <span className="gold-text num" style={{ fontSize: 12.5, fontWeight: 800, flexShrink: 0 }}>
                      +3 XP
                    </span>
                  ) : (
                    <span className="faint" style={{ fontSize: 14, flexShrink: 0 }}>
                      🔊
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>

          <p className="dim" style={{ fontSize: 12.5, marginTop: 12, lineHeight: 1.5 }}>
            💡 {familie.weetje}
          </p>

          {ontdekt && anderen.length > 0 && (
            <p className="gold-text center" style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>
              Je werd zojuist beter in {anderen.length} andere {anderen.length === 1 ? 'taal' : 'talen'}
            </p>
          )}

          <button className="btn btn-primary" style={{ marginTop: 12, padding: 12, fontSize: 14 }} onClick={() => { sfx('tap'); onSluiten() }}>
            {ontdekt ? 'Verder leren' : 'Sluiten'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
