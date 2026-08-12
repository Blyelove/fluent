import { useState } from 'react'
import { courses } from '../content'
import { courseProgress, totalXp, useStore, wordsLearned } from '../store'
import { levelProgress, levelTitle, wardrobeFor } from '../levels'
import { courseFlagCode } from '../countries'
import { Flag } from '../components/Flag'
import { Avatar } from '../components/Avatar'
import { BadgesScreen } from './Badges'

export function ProfileScreen() {
  const state = useStore()
  const course = courses[state.courseId]
  const progress = courseProgress(state, state.courseId)
  const lp = levelProgress(totalXp(state))
  const [view, setView] = useState<'profiel' | 'badges'>('profiel')

  if (view === 'badges') {
    return (
      <div>
        <div className="shell" style={{ paddingBottom: 0, minHeight: 0 }}>
          <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14 }} onClick={() => setView('profiel')}>
            ← Terug naar profiel
          </button>
        </div>
        <BadgesScreen />
      </div>
    )
  }

  return (
    <div className="shell">
      <div className="spread">
        <div>
          <p className="eyebrow">Profiel</p>
          <h1 className="display" style={{ fontSize: 30, margin: '8px 0 4px' }}>
            Jouw reis
          </h1>
          <p className="dim row" style={{ fontSize: 14, gap: 6 }}>
            Niveau {lp.level} · {levelTitle(lp.level)} · <Flag code={courseFlagCode[state.courseId]} size={14} /> {course.name}
          </p>
        </div>
        <Avatar size={80} mode="idle" level={lp.level} courseId={state.courseId} look={state.avatarLook} />
      </div>
      <div style={{ margin: '14px 0 24px' }}>
        <div className="progress-track" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${Math.round(lp.frac * 100)}%` }} />
        </div>
        <p className="faint" style={{ fontSize: 12, marginTop: 6 }}>
          Nog {lp.needed - lp.current} XP tot niveau {lp.level + 1} · {levelTitle(lp.level + 1)}
        </p>
      </div>

      <button
        className="glass spread"
        style={{ width: '100%', padding: '16px 18px', marginBottom: 18, textAlign: 'left', borderColor: 'var(--line-hot)' }}
        onClick={() => setView('badges')}
      >
        <span className="row" style={{ gap: 12 }}>
          <span style={{ fontSize: 24 }}>🏅</span>
          <span className="col" style={{ gap: 2 }}>
            <strong style={{ fontSize: 15 }}>Prestaties & badges</strong>
            <span className="faint" style={{ fontSize: 12.5 }}>Bekijk je verzameling en volgende mijlpalen</span>
          </span>
        </span>
        <span className="hot-text" style={{ fontSize: 20, fontWeight: 800 }}>›</span>
      </button>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="glass stat-card">
          <div className="stat-value gold-text">{totalXp(state)}</div>
          <div className="stat-label">Totaal XP</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value">{state.streak}</div>
          <div className="stat-label">{state.streak === 1 ? 'Dag reeks' : 'Dagen reeks'}</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value">{wordsLearned(state, state.courseId)}</div>
          <div className="stat-label">Woorden geleerd</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value">{progress.completed.length}</div>
          <div className="stat-label">Lessen voltooid</div>
        </div>
      </div>

      <div className="glass" style={{ padding: '6px 18px', marginBottom: 24 }}>
        <div className="spread" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontWeight: 500 }}>Beste reeks</span>
          <span className="gold-text" style={{ fontWeight: 700 }}>
            {state.bestStreak} {state.bestStreak === 1 ? 'dag' : 'dagen'}
          </span>
        </div>
        <div className="spread" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontWeight: 500 }}>Reeks-bescherming</span>
          <span style={{ fontWeight: 600 }}>{'❄'.repeat(Math.max(0, state.freezes)) || '—'}</span>
        </div>
        <div className="spread" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontWeight: 500 }}>Doelen gehaald</span>
          <span className="gold-text" style={{ fontWeight: 700 }}>{state.goalsDone.length}</span>
        </div>
        <div className="spread" style={{ padding: '14px 0' }}>
          <span style={{ fontWeight: 500 }}>Dagelijks doel</span>
          <span style={{ fontWeight: 600 }}>{state.dailyGoalXp} XP</span>
        </div>
      </div>

      <div className="glass" style={{ padding: '6px 18px', marginBottom: 24 }}>
        <div className="spread" style={{ padding: '14px 0' }}>
          <span style={{ fontWeight: 500 }}>Geluid</span>
          <button
            onClick={state.toggleSound}
            style={{
              width: 52,
              height: 30,
              borderRadius: 999,
              background: state.soundOn ? 'var(--grad-gold)' : 'var(--surface-3)',
              position: 'relative',
              transition: 'background 0.2s ease',
            }}
            aria-label="Geluid aan of uit"
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: state.soundOn ? 25 : 3,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: state.soundOn ? 'var(--ink-on-gold)' : 'var(--text-dim)',
                transition: 'left 0.2s ease',
              }}
            />
          </button>
        </div>
      </div>

      {state.currentUser && state.accounts[state.currentUser] && (
        <div className="glass" style={{ padding: '6px 18px', marginBottom: 24 }}>
          <div className="spread" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
            <span style={{ fontWeight: 500 }}>Account</span>
            <span className="dim" style={{ fontSize: 13, fontWeight: 600 }}>
              {state.accounts[state.currentUser].email}
            </span>
          </div>
          <div style={{ padding: '12px 0' }}>
            <button className="btn btn-ghost" style={{ padding: 12, fontSize: 14 }} onClick={state.logout}>
              Uitloggen
            </button>
          </div>
        </div>
      )}

      {(() => {
        const wardrobe = wardrobeFor(state.courseId)
        return (
          <div className="glass" style={{ padding: 18, marginBottom: 24 }}>
            <div className="spread">
              <strong style={{ fontSize: 15 }}>Jouw transformatie · {course.name}</strong>
              <span className="faint" style={{ fontSize: 13 }}>
                {wardrobe.filter((w) => lp.level >= w.level).length} / {wardrobe.length}
              </span>
            </div>
            <div className="col" style={{ marginTop: 8 }}>
              {wardrobe.map((w, i) => {
                const unlocked = lp.level >= w.level
                return (
                  <div
                    className="spread"
                    key={w.level}
                    style={{ padding: '10px 0', borderBottom: i < wardrobe.length - 1 ? '1px solid var(--line)' : 'none' }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: unlocked ? 'var(--text)' : 'var(--text-faint)' }}>{w.item}</span>
                    {unlocked ? (
                      <span className="gold-text" style={{ fontWeight: 700, fontSize: 14 }}>
                        ✓
                      </span>
                    ) : (
                      <span className="faint" style={{ fontSize: 12 }}>
                        Niveau {w.level}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="center" style={{ marginTop: 16 }}>
              <Avatar size={110} level={20} courseId={state.courseId} look={state.avatarLook} />
              <p className="faint" style={{ fontSize: 12, marginTop: 4 }}>
                Jij op niveau 20 — Ultiem Fluent, volledig {course.name.toLowerCase()}
              </p>
            </div>
          </div>
        )
      })()}

      <p className="faint center" style={{ fontSize: 13, marginBottom: 16 }}>
        Fluent leert je talen zonder straf: geen hartjes, geen energie, geen limiet. Alleen een reeks die om je geeft — met automatische
        bescherming als het leven ertussen komt.
      </p>

      <button
        className="btn btn-ghost"
        style={{ color: 'var(--err)' }}
        onClick={() => {
          if (window.confirm('Weet je het zeker? Al je voortgang wordt gewist.')) state.resetAll()
        }}
      >
        Alles opnieuw beginnen
      </button>
    </div>
  )
}
