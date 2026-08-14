import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../store'
import { courses } from '../content'
import { ShareButton } from '../components/ShareButton'
import { sfx } from '../audio'

/** Mijlpalen in de reeks — elk met een beloning die je echt krijgt */
const MILESTONES: { days: number; naam: string; beloning: string }[] = [
  { days: 3, naam: 'Op dreef', beloning: 'Oranje vlam' },
  { days: 7, naam: 'Week vol', beloning: '+1 reeks-bescherming' },
  { days: 14, naam: 'Twee weken', beloning: 'Blauwe vlam' },
  { days: 30, naam: 'Maandmeester', beloning: 'Gouden vlam · +1 bescherming' },
  { days: 60, naam: 'Onstuitbaar', beloning: 'Paarse vlam' },
  { days: 100, naam: 'Honderd!', beloning: 'Legendarische vlam' },
  { days: 200, naam: 'Twee honderd', beloning: 'Diamanten vlam' },
  { days: 365, naam: 'Heel jaar', beloning: 'Eeuwige regenboogvlam' },
]

/** De vlam verandert echt van uiterlijk naarmate je reeks groeit */
function flameStyle(streak: number): { filter: string; glow: string; naam: string } {
  if (streak >= 365)
    return {
      filter: 'hue-rotate(280deg) saturate(2.4) brightness(1.25)',
      glow: 'drop-shadow(0 0 26px var(--hot-65)) drop-shadow(0 0 46px var(--cyaan-65))',
      naam: 'Eeuwige regenboogvlam',
    }
  if (streak >= 200)
    return { filter: 'hue-rotate(150deg) saturate(1.7) brightness(1.3)', glow: 'drop-shadow(0 0 24px var(--cyaan-65))', naam: 'Diamanten vlam' }
  if (streak >= 100)
    return { filter: 'hue-rotate(255deg) saturate(1.9)', glow: 'drop-shadow(0 0 22px var(--hot-65))', naam: 'Legendarische vlam' }
  if (streak >= 60)
    return { filter: 'hue-rotate(230deg) saturate(1.5)', glow: 'drop-shadow(0 0 18px var(--hot-65))', naam: 'Paarse vlam' }
  if (streak >= 30)
    return { filter: 'saturate(1.5) brightness(1.2)', glow: 'drop-shadow(0 0 20px var(--goud-65))', naam: 'Gouden vlam' }
  if (streak >= 14)
    return { filter: 'hue-rotate(185deg) saturate(1.4)', glow: 'drop-shadow(0 0 14px rgba(59,130,246,0.7))', naam: 'Blauwe vlam' }
  if (streak >= 3) return { filter: 'none', glow: 'drop-shadow(0 0 12px rgba(249,115,22,0.7))', naam: 'Oranje vlam' }
  if (streak >= 1) return { filter: 'none', glow: 'drop-shadow(0 0 8px rgba(249,115,22,0.45))', naam: 'Eerste vonk' }
  return { filter: 'grayscale(1)', glow: 'none', naam: 'Nog geen vlam' }
}

const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]
const DAGEN = ['M', 'D', 'W', 'D', 'V', 'Z', 'Z']

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function StreakScreen({ onBack, onLeren }: { onBack?: () => void; onLeren?: () => void }) {
  const streak = useStore((s) => s.streak)
  const bestStreak = useStore((s) => s.bestStreak)
  const freezes = useStore((s) => s.freezes)
  const activeDays = useStore((s) => s.activeDays)
  const lastDay = useStore((s) => s.lastDay)
  const courseId = useStore((s) => s.courseId)
  const vandaagGeleerd = lastDay === new Date().toISOString().slice(0, 10)
  const course = courses[courseId]
  const [monthOffset, setMonthOffset] = useState(0)

  const active = useMemo(() => new Set(activeDays), [activeDays])

  const { cells, label } = useMemo(() => {
    const now = new Date()
    const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    const year = first.getFullYear()
    const month = first.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // maandag = 0
    const startPad = (first.getDay() + 6) % 7
    const list: { day: number | null; key: string; isToday: boolean; done: boolean }[] = []
    for (let i = 0; i < startPad; i++) list.push({ day: null, key: `pad-${i}`, isToday: false, done: false })
    const todayKey = dayKey(now)
    for (let d = 1; d <= daysInMonth; d++) {
      const k = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      list.push({ day: d, key: k, isToday: k === todayKey, done: active.has(k) })
    }
    return { cells: list, label: `${MAANDEN[month]} ${year}` }
  }, [monthOffset, active])

  const doneThisMonth = cells.filter((c) => c.done).length
  const next = MILESTONES.find((m) => m.days > streak) ?? null
  const reached = MILESTONES.filter((m) => streak >= m.days)
  const flame = flameStyle(streak)

  return (
    <div className="shell">
      {onBack && (
        <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14, marginBottom: 16 }} onClick={onBack}>
          ← Terug
        </button>
      )}

      {/* grote vlam */}
      <div className="center" style={{ marginBottom: 24 }}>
        <motion.div
          style={{ fontSize: 96, lineHeight: 1, filter: `${flame.filter} ${flame.glow}` }}
          animate={streak > 0 ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔥
        </motion.div>
        <h1 className="display gold-text" style={{ fontSize: 48, margin: '2px 0 0' }}>
          {streak}
        </h1>
        <p className="dim" style={{ fontSize: 16, marginTop: -2 }}>
          {streak === 1 ? 'dag op rij' : 'dagen op rij'}
        </p>
        <p className="hot-text" style={{ fontSize: 14, fontWeight: 800, marginTop: 4 }}>
          {flame.naam}
        </p>
        {streak === 0 && (
          <p className="faint" style={{ fontSize: 12.5, marginTop: 8 }}>
            Doe vandaag één les en je reeks begint.
          </p>
        )}
      </div>

      {/* het scherm vertelde wat je moest doen, maar bood geen manier om het te doen */}
      {onLeren && (
        <div style={{ marginBottom: 16 }}>
          <button
            className="btn btn-primary"
            style={{ padding: 16, fontSize: 16 }}
            onClick={() => {
              sfx('tap')
              onLeren()
            }}
          >
            {streak === 0 ? '▶ Ontsteek je vlam' : vandaagGeleerd ? '▶ Nog een les erbij' : '▶ Houd je vlam brandend'}
          </button>
        </div>
      )}

      {streak > 0 && (
        <div style={{ marginBottom: 16 }}>
          <ShareButton
            variant="primary"
            label="Deel je reeks"
            kaart={{
              icoon: '🔥',
              waarde: String(streak),
              label: streak === 1 ? 'dag op rij' : 'dagen op rij',
              onderschrift: `${course.name} · ${flame.naam}`,
              bericht: `Ik zit op ${streak} ${streak === 1 ? 'dag' : 'dagen'} op rij ${course.name} leren met Fluent!`,
            }}
          />
        </div>
      )}

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="glass stat-card">
          <div className="stat-value">{bestStreak}</div>
          <div className="stat-label">Beste reeks</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value">{'❄'.repeat(Math.max(0, freezes)) || '—'}</div>
          <div className="stat-label">Bescherming</div>
        </div>
      </div>

      {/* volgende mijlpaal */}
      {next && (
        <div className="glass" style={{ padding: 16, marginBottom: 16, borderColor: 'var(--line-gold)' }}>
          <div className="spread" style={{ marginBottom: 8 }}>
            <strong style={{ fontSize: 14 }}>Volgende mijlpaal: {next.naam}</strong>
            <span className="gold-text" style={{ fontWeight: 800, fontSize: 14 }}>
              {next.days} dagen
            </span>
          </div>
          <div className="progress-track" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${Math.max(3, Math.round((streak / next.days) * 100))}%` }} />
          </div>
          <p className="faint" style={{ fontSize: 12.5, marginTop: 8 }}>
            Nog {next.days - streak} {next.days - streak === 1 ? 'dag' : 'dagen'} · beloning: {next.beloning}
          </p>
        </div>
      )}

      {/* kalender */}
      <div className="glass" style={{ padding: 16, marginBottom: 16 }}>
        <div className="spread" style={{ marginBottom: 12 }}>
          <button className="btn-quiet" style={{ fontSize: 19, padding: '4px 12px' }} onClick={() => setMonthOffset((m) => m - 1)}>
            ‹
          </button>
          <strong style={{ fontSize: 14, textTransform: 'capitalize' }}>{label}</strong>
          <button
            className="btn-quiet"
            style={{ fontSize: 19, padding: '4px 12px', opacity: monthOffset >= 0 ? 0.3 : 1 }}
            disabled={monthOffset >= 0}
            onClick={() => setMonthOffset((m) => Math.min(0, m + 1))}
          >
            ›
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {DAGEN.map((d, i) => (
            <div key={i} className="faint center" style={{ fontSize: 11, fontWeight: 700, paddingBottom: 4 }}>
              {d}
            </div>
          ))}
          {cells.map((c) => (
            <div
              key={c.key}
              className="center"
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 700,
                background: c.done ? 'var(--grad-gold)' : c.day ? 'var(--surface)' : 'transparent',
                color: c.done ? 'var(--ink-on-gold)' : 'var(--text-faint)',
                border: c.isToday ? '2px solid var(--hot2)' : c.day ? '1px solid var(--line)' : 'none',
                boxShadow: c.done ? '0 0 10px var(--goud-35)' : 'none',
              }}
            >
              {c.day ?? ''}
            </div>
          ))}
        </div>
        <p className="faint center" style={{ fontSize: 12.5, marginTop: 12 }}>
          {doneThisMonth} {doneThisMonth === 1 ? 'actieve dag' : 'actieve dagen'} deze maand
        </p>
      </div>

      {/* mijlpalen-lijst */}
      <div className="glass" style={{ padding: '8px 18px', marginBottom: 12 }}>
        <p className="eyebrow" style={{ padding: '12px 0 6px' }}>
          Alle mijlpalen
        </p>
        {MILESTONES.map((m, i) => {
          const done = streak >= m.days
          return (
            <div
              key={m.days}
              className="spread"
              style={{ padding: '11px 0', borderBottom: i < MILESTONES.length - 1 ? '1px solid var(--line)' : 'none', opacity: done ? 1 : 0.65 }}
            >
              <span className="row" style={{ gap: 8 }}>
                <span style={{ fontSize: 19, filter: done ? 'none' : 'grayscale(1)' }}>{done ? '🔥' : '🔒'}</span>
                <span className="col" style={{ gap: 0 }}>
                  <strong style={{ fontSize: 14 }}>{m.naam}</strong>
                  <span className="faint" style={{ fontSize: 12.5 }}>
                    {m.days} dagen · {m.beloning}
                  </span>
                </span>
              </span>
              {done && (
                <span className="gold-text" style={{ fontWeight: 800 }}>
                  ✓
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className="faint center" style={{ fontSize: 12.5, marginBottom: 8 }}>
        Mis je een dag? Je bescherming vangt dat automatisch op — {reached.length > 0 ? 'je hebt al ' + reached.length + ' mijlpalen gehaald.' : 'geen straf, ooit.'}
      </p>
    </div>
  )
}
