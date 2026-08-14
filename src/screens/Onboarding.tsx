import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CourseId } from '../types'
import { courseList } from '../content'
import { useStore } from '../store'
import { courseFlagCode } from '../countries'
import { Flag } from '../components/Flag'
import { sfx } from '../audio'
import { DAGDOELEN } from '../goals'

export function Onboarding({ onKlaar }: { onKlaar?: (c: CourseId) => void }) {
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const [step, setStep] = useState(1)
  const [courseId, setCourseId] = useState<CourseId | null>(null)

  return (
    <div className="shell shell--bare" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>
            {/* geen "Stap 1 van 2" meer: het personagescherm telde ook al vanaf
                stap 1, en twee tellers naast elkaar leest als teruggaan */}
            <p className="eyebrow center">Twee korte vragen</p>
            <h2 className="display center" style={{ fontSize: 28, margin: '10px 0 28px' }}>
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
                  <span className="col" style={{ gap: 0 }}>
                    <strong>{c.name}</strong>
                    <span className="faint" style={{ fontSize: 12.5 }}>
                      {c.tagline}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <button className="btn btn-primary" disabled={!courseId} onClick={() => setStep(2)}>
                Verder
              </button>
            </div>
            <p className="faint center" style={{ fontSize: 12.5, marginTop: 16 }}>
              Geen hartjes die opraken. Geen straf. Alleen jij en een taal.
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <p className="eyebrow center">Laatste vraag</p>
            <h2 className="display center" style={{ fontSize: 28, margin: '10px 0 6px' }}>
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
                  gap: 8,
                  margin: '0 auto 24px',
                  padding: '8px 14px',
                  minHeight: 44,
                  borderRadius: 999,
                  background: 'var(--surface-2)',
                  border: '1.5px solid var(--line)',
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                <Flag code={courseFlagCode[courseId]} size={15} />
                {courseList.find((c) => c.id === courseId)?.name}
                <span className="faint" style={{ fontSize: 12.5 }}>· wijzig</span>
              </button>
            )}
            <div className="col" style={{ gap: 12 }}>
              {DAGDOELEN.map((g) => (
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
                  <span className="col" style={{ gap: 0, flex: 1 }}>
                    <strong>{g.label}</strong>
                    <span className="faint" style={{ fontSize: 12.5 }}>
                      {g.sub}
                    </span>
                  </span>
                  <span className="gold-text" style={{ fontWeight: 700 }}>
                    {g.xp} XP
                  </span>
                </button>
              ))}
            </div>
            <p className="faint center" style={{ fontSize: 12.5, marginTop: 24 }}>
              Kies en je eerste woorden beginnen meteen. Je kunt dit later altijd aanpassen.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
