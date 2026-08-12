import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CourseId } from '../types'
import { courseList } from '../content'
import { useStore } from '../store'
import { courseFlagCode } from '../countries'
import { Flag } from '../components/Flag'
import { sfx } from '../audio'

const GOALS = [
  { xp: 20, label: 'Rustig', sub: '±5 min per dag' },
  { xp: 40, label: 'Serieus', sub: '±10 min per dag' },
  { xp: 60, label: 'Gedreven', sub: '±15 min per dag' },
]

export function Onboarding({ onKlaar }: { onKlaar?: (c: CourseId) => void }) {
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const [step, setStep] = useState(0)
  const [courseId, setCourseId] = useState<CourseId | null>(null)

  return (
    <div className="shell shell--bare" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" className="center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }}>
            <motion.div
              className="orb"
              style={{ margin: '0 auto 36px' }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="eyebrow">Welkom bij</p>
            <h1 className="display hot-text" style={{ fontSize: 56, letterSpacing: '0.01em', marginTop: 8 }}>
              Fluent
            </h1>
            <p className="dim" style={{ marginTop: 12, fontSize: 17 }}>
              Taal leren die je niet meer loslaat.
            </p>
            <div className="divider-gold" />
            <p className="faint" style={{ fontSize: 15, maxWidth: 300, margin: '0 auto 36px' }}>
              Geen hartjes die opraken. Geen straf. Alleen jij, een taal, en een methode die werkt.
            </p>
            <button className="btn btn-primary" onClick={() => setStep(1)}>
              Beginnen
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>
            {/* geen "Stap 1 van 2" meer: het personagescherm telde ook al vanaf
                stap 1, en twee tellers naast elkaar leest als teruggaan */}
            <p className="eyebrow center">Nog twee vragen</p>
            <h2 className="display center" style={{ fontSize: 30, margin: '10px 0 28px' }}>
              Welke taal wordt het?
            </h2>
            <div className="col" style={{ gap: 12 }}>
              {courseList.map((c) => (
                <button
                  key={c.id}
                  className={`opt ${courseId === c.id ? 'selected' : ''}`}
                  onClick={() => {
                    sfx('tap')
                    setCourseId(c.id)
                  }}
                >
                  <Flag code={courseFlagCode[c.id]} size={24} />
                  <span className="col" style={{ gap: 2 }}>
                    <strong>{c.name}</strong>
                    <span className="faint" style={{ fontSize: 13 }}>
                      {c.tagline}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 26 }}>
              <button className="btn btn-primary" disabled={!courseId} onClick={() => setStep(2)}>
                Verder
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <p className="eyebrow center">Laatste vraag</p>
            <h2 className="display center" style={{ fontSize: 30, margin: '10px 0 6px' }}>
              Hoeveel tijd per dag?
            </h2>
            {/* de gekozen taal blijft zichtbaar, en is met één tik te wijzigen */}
            {courseId && (
              <button
                className="row"
                onClick={() => {
                  sfx('tap')
                  setStep(1)
                }}
                style={{
                  gap: 7,
                  margin: '0 auto 24px',
                  padding: '8px 14px',
                  minHeight: 44,
                  borderRadius: 999,
                  background: 'var(--surface-2)',
                  border: '1.5px solid var(--line)',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <Flag code={courseFlagCode[courseId]} size={15} />
                {courseList.find((c) => c.id === courseId)?.name}
                <span className="faint" style={{ fontSize: 12 }}>· wijzig</span>
              </button>
            )}
            <div className="col" style={{ gap: 12 }}>
              {GOALS.map((g) => (
                <button
                  key={g.xp}
                  className="opt"
                  onClick={() => {
                    sfx('tap')
                    if (!courseId) return
                    completeOnboarding(courseId, g.xp)
                    // meteen de eerste les in: het startscherm vol tellers heeft
                    // pas betekenis als je je eerste woorden geleerd hebt
                    onKlaar?.(courseId)
                  }}
                >
                  <span className="col" style={{ gap: 2, flex: 1 }}>
                    <strong>{g.label}</strong>
                    <span className="faint" style={{ fontSize: 13 }}>
                      {g.sub}
                    </span>
                  </span>
                  <span className="gold-text" style={{ fontWeight: 700 }}>
                    {g.xp} XP
                  </span>
                </button>
              ))}
            </div>
            <p className="faint center" style={{ fontSize: 13, marginTop: 22 }}>
              Kies en je eerste woorden beginnen meteen. Je kunt dit later altijd aanpassen.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
