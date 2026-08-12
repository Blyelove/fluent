import { useState } from 'react'
import { courseList, courses } from '../content'
import { courseProgress, totalXp, useStore, wordsLearned } from '../store'
import { levelProgress, levelTitle, nextReward, wardrobeFor } from '../levels'
import { skillStand } from '../skills'
import { SkillsSheet } from '../components/SkillsSheet'
import { courseFlagCode } from '../countries'
import { Flag } from '../components/Flag'
import { Avatar, normalizePersona } from '../components/Avatar'
import { PersonaPicker } from '../components/PersonaPicker'
import { BadgesScreen } from './Badges'
import { sfx } from '../audio'

export function ProfileScreen() {
  const state = useStore()
  const course = courses[state.courseId]
  const progress = courseProgress(state, state.courseId)
  const lp = levelProgress(totalXp(state))
  const [view, setView] = useState<'profiel' | 'badges'>('profiel')
  const [bewerkt, setBewerkt] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  /** aangetikt stadium in de evolutierij */
  const [toonNiveau, setToonNiveau] = useState<number | null>(null)

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
        <button
          onClick={() => {
            sfx('tap')
            setBewerkt((b) => !b)
          }}
          aria-label="Personage aanpassen"
          style={{ position: 'relative' }}
        >
          <Avatar size={80} mode="idle" level={lp.level} courseId={state.courseId} look={state.avatarLook} />
          <span
            style={{
              position: 'absolute',
              right: -4,
              bottom: -2,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--grad-hot)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              boxShadow: '0 2px 6px rgba(0,0,0,0.45)',
            }}
          >
            ✏️
          </span>
        </button>
      </div>
      <div style={{ margin: '14px 0 18px' }}>
        <div className="progress-track" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${Math.round(lp.frac * 100)}%` }} />
        </div>
        <p className="faint" style={{ fontSize: 12, marginTop: 6 }}>
          Nog {lp.needed - lp.current} XP tot niveau {lp.level + 1} · {levelTitle(lp.level + 1)}
        </p>
      </div>

      {/* vaardigheden in RuneScape-stijl: elke taal een level richting 99 */}
      <button className="glass spread" style={{ width: '100%', padding: '13px 16px', marginBottom: 24, textAlign: 'left' }} onClick={() => { sfx('tap'); setSkillsOpen(true) }}>
        <span className="row" style={{ gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,197,61,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎓</span>
          <span className="col" style={{ gap: 1 }}>
            <strong className="card-title">Vaardigheden</strong>
            <span className="faint" style={{ fontSize: 12 }}>
              {course.name} niveau {skillStand(progress.xp).level} van 99
            </span>
          </span>
        </span>
        <span className="gold-text num" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17 }}>
          Totaal {courseList.reduce((n, c) => n + skillStand(state.progress[c.id]?.xp ?? 0).level, 0)}
        </span>
      </button>

      {skillsOpen && <SkillsSheet onClose={() => setSkillsOpen(false)} />}

      {bewerkt && (
        <div style={{ marginBottom: 18 }}>
          {/* live opslaan: elke tik past je personage direct aan, overal in de app */}
          <PersonaPicker value={normalizePersona(state.avatarLook)} onChange={state.setAvatarLook} />
          <button className="btn btn-primary" style={{ padding: 13, fontSize: 14.5 }} onClick={() => setBewerkt(false)}>
            Klaar, zo wil ik eruitzien
          </button>
        </div>
      )}

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
          <span style={{ fontWeight: 500 }}>Reeksbescherming</span>
          <span style={{ fontWeight: 600 }}>{'❄'.repeat(Math.max(0, state.freezes)) || '—'}</span>
        </div>
        <div className="spread" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontWeight: 500 }}>Doelen gehaald</span>
          <span className="gold-text" style={{ fontWeight: 700 }}>{state.goalsDone.length}</span>
        </div>
        {/* stond hier als dode tekst; nu draai je er zo doorheen */}
        <div className="spread" style={{ padding: '10px 0' }}>
          <span style={{ fontWeight: 500 }}>Dagelijks doel</span>
          <div className="row" style={{ gap: 6 }}>
            {[20, 40, 60, 100].map((xp) => (
              <button
                key={xp}
                onClick={() => {
                  sfx('tap')
                  state.setDailyGoal(xp)
                }}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  padding: '6px 10px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 800,
                  background: state.dailyGoalXp === xp ? 'var(--grad-gold)' : 'var(--surface-2)',
                  color: state.dailyGoalXp === xp ? 'var(--ink-on-gold)' : 'var(--text-dim)',
                  border: state.dailyGoalXp === xp ? 'none' : '1.5px solid var(--line)',
                }}
              >
                {xp}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '6px 18px', marginBottom: 24 }}>
        <div className="spread" style={{ padding: '14px 0' }}>
          <span style={{ fontWeight: 500 }}>Geluid</span>
          <button
            onClick={state.toggleSound}
            // 52×30 was te klein om te raken; de schakelaar zelf blijft even
            // groot, maar het raakvlak eromheen is nu 44px hoog
            style={{
              width: 52,
              height: 44,
              padding: '7px 0',
              borderRadius: 999,
              position: 'relative',
            }}
            aria-label="Geluid aan of uit"
          >
            <span
              style={{
                position: 'absolute',
                inset: '7px 0',
                borderRadius: 999,
                background: state.soundOn ? 'var(--grad-gold)' : 'var(--surface-3)',
                transition: 'background 0.2s ease',
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: 10,
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
        const volgendItem = nextReward(state.courseId, lp.level)
        return (
          <div className="glass" style={{ padding: 18, marginBottom: 24 }}>
            <div className="spread">
              <strong style={{ fontSize: 15 }}>Jouw transformatie · {course.name}</strong>
              <span className="faint" style={{ fontSize: 13 }}>
                {wardrobe.filter((w) => lp.level >= w.level).length} / {wardrobe.length}
              </span>
            </div>
            {/* de evolutierij: zie in één blik hoe je figuur meegroeit. Dit was
                een lijst van negentien tekstregels, terwijl juist dit het
                verhaal van de app vertelt. */}
            <div
              className="no-scrollbar row"
              style={{ gap: 10, overflowX: 'auto', padding: '14px 2px 6px', scrollSnapType: 'x mandatory' }}
            >
              {[1, 5, 10, 15, 20].map((niv) => {
                const bereikt = lp.level >= niv
                const huidig = lp.level >= niv && lp.level < niv + 5
                return (
                  <button
                    key={niv}
                    onClick={() => {
                      sfx('tap')
                      setToonNiveau(niv === toonNiveau ? null : niv)
                    }}
                    style={{
                      flexShrink: 0,
                      width: 92,
                      padding: '10px 4px 8px',
                      borderRadius: 16,
                      scrollSnapAlign: 'start',
                      background: huidig ? 'rgba(255,197,61,0.12)' : 'var(--surface-2)',
                      border: huidig ? '2px solid var(--gold)' : '1.5px solid var(--line)',
                    }}
                  >
                    <div
                      style={{
                        height: 84,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        // nog niet bereikt? dan een silhouet: je ziet dát er iets
                        // komt, maar nog niet wát
                        filter: bereikt ? undefined : 'brightness(0) opacity(0.32)',
                      }}
                    >
                      <Avatar size={78} level={niv} courseId={state.courseId} look={state.avatarLook} still />
                    </div>
                    <p
                      style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        marginTop: 4,
                        color: huidig ? 'var(--gold)' : bereikt ? 'var(--text)' : 'var(--text-faint)',
                      }}
                    >
                      {bereikt ? `Niveau ${niv}` : `Niveau ${niv} 🔒`}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* tik een stadium aan en je ziet welke items daarbij horen */}
            {toonNiveau !== null && (
              <div className="glass" style={{ padding: '10px 14px', marginTop: 10, background: 'var(--surface-2)' }}>
                <p className="eyebrow" style={{ fontSize: 10, marginBottom: 6 }}>
                  Wat je tot niveau {toonNiveau} verdient
                </p>
                {wardrobe.filter((w) => w.level <= toonNiveau).length === 0 ? (
                  <p className="faint" style={{ fontSize: 12.5 }}>
                    Hier begin je: je eigen personage, nog zonder culturele items.
                  </p>
                ) : (
                  <div className="col" style={{ gap: 5 }}>
                    {wardrobe
                      .filter((w) => w.level <= toonNiveau)
                      .map((w) => (
                        <div className="spread" key={w.level}>
                          <span style={{ fontSize: 13, color: lp.level >= w.level ? 'var(--text)' : 'var(--text-faint)' }}>
                            {lp.level >= w.level ? '✓ ' : ''}
                            {w.item}
                          </span>
                          <span className="faint" style={{ fontSize: 11.5 }}>
                            nv. {w.level}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            <p className="faint center" style={{ fontSize: 12, marginTop: 12 }}>
              {volgendItem
                ? `Nog ${volgendItem.level - lp.level} ${volgendItem.level - lp.level === 1 ? 'niveau' : 'niveaus'} tot je ${volgendItem.item.toLowerCase()}.`
                : `Je bent volledig ${course.name}. Niemand die je nog voor een toerist aanziet.`}
            </p>
          </div>
        )
      })()}

      <p className="faint center" style={{ fontSize: 13, marginBottom: 16 }}>
        Fluent leert je talen zonder straf: geen hartjes, geen energie, geen limiet. Alleen een reeks die om je geeft, met automatische
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

      {/* de bouwstempel: zo zie je op de live site wélke versie er draait */}
      <p className="faint center" style={{ fontSize: 11.5, marginTop: 14 }}>
        Fluent · versie van {__BOUWSTEMPEL__}
      </p>
    </div>
  )
}
