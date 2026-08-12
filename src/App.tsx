import { useEffect, useMemo, useState, type ComponentType } from 'react'
import type { Course, Lesson } from './types'
import { dueEntries, useStore } from './store'
import { initAudioManifest, initVoices, setSoundEnabled } from './audio'
import { LEAGUES, standings, yourRank } from './leagues'
import { readDuelFromUrl } from './duel'
import { Onboarding } from './screens/Onboarding'
import { AuthScreen } from './screens/Auth'
import { Gallery } from './screens/Gallery'
import { HomeScreen } from './screens/Home'
import { LessonScreen } from './screens/Lesson'
import { ReviewScreen } from './screens/Review'
import { ProfileScreen } from './screens/Profile'
import { LeagueScreen } from './screens/League'
import { PlayScreen } from './screens/Play'

type Tab = 'home' | 'play' | 'league' | 'review' | 'profile'

const PathIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z" />
  </svg>
)

const PlayIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="12" rx="5" />
    <path d="M7 11v4M5 13h4M15.5 12.5h.01M18 15h.01" />
  </svg>
)

const TrophyIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
    <path d="M12 14v4M8 20h8" />
  </svg>
)

const ReviewIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
)

const ProfileIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-3.8 4.5-5.5 8-5.5s6.5 1.7 8 5.5" />
  </svg>
)

export default function App() {
  const onboarded = useStore((s) => s.onboarded)
  const currentUser = useStore((s) => s.currentUser)
  const rememberMe = useStore((s) => s.rememberMe)
  const soundOn = useStore((s) => s.soundOn)
  const dueCount = useStore((s) => dueEntries(s, s.courseId).length)
  const leagueId = useStore((s) => s.leagueId)
  const weekXp = useStore((s) => s.weekXp)

  const [tab, setTab] = useState<Tab>('home')
  const [lesson, setLesson] = useState<{ course: Course; lesson: Lesson } | null>(null)

  // duel-uitnodiging uit de link halen (eenmalig bij het openen)
  const incomingDuel = useMemo(() => readDuelFromUrl(), [])

  useEffect(() => {
    initVoices()
    void initAudioManifest()
    setSoundEnabled(soundOn)
    if (incomingDuel) setTab('play')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rank = useMemo(() => yourRank(standings(leagueId, weekXp)), [leagueId, weekXp])

  if (new URLSearchParams(window.location.search).has('gallery')) return <Gallery />

  let sessionOk = false
  try {
    sessionOk = sessionStorage.getItem('fluent-session') === '1'
  } catch {
    sessionOk = true
  }
  if (!currentUser || (!rememberMe && !sessionOk)) return <AuthScreen />

  if (!onboarded) return <Onboarding />

  if (lesson) {
    return <LessonScreen course={lesson.course} lesson={lesson.lesson} onExit={() => setLesson(null)} />
  }

  const items: { id: Tab; icon: ComponentType; label: string; badge?: string }[] = [
    { id: 'home', icon: PathIcon, label: 'Leren' },
    { id: 'play', icon: PlayIcon, label: 'Spelen' },
    { id: 'league', icon: TrophyIcon, label: 'Divisie', badge: `#${rank}` },
    { id: 'review', icon: ReviewIcon, label: 'Oefenen', badge: dueCount > 0 ? String(dueCount) : undefined },
    { id: 'profile', icon: ProfileIcon, label: 'Profiel' },
  ]

  return (
    <>
      {tab === 'home' && (
        <HomeScreen
          onStartLesson={(course, l) => setLesson({ course, lesson: l })}
          onReview={() => setTab('review')}
          onLeague={() => setTab('league')}
          onPlay={() => setTab('play')}
        />
      )}
      {tab === 'play' && <PlayScreen incomingDuel={incomingDuel} />}
      {tab === 'league' && <LeagueScreen />}
      {tab === 'review' && <ReviewScreen />}
      {tab === 'profile' && <ProfileScreen />}

      <nav className="nav">
        <div className="nav-inner">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <button
                key={it.id}
                className={`nav-item ${tab === it.id ? 'active' : ''}`}
                onClick={() => setTab(it.id)}
                style={{ padding: '6px 10px', minWidth: 60 }}
              >
                {it.badge && (
                  <span
                    className="nav-badge"
                    style={it.id === 'league' ? { background: LEAGUES[leagueId].color, color: '#1a1033' } : undefined}
                  >
                    {it.badge}
                  </span>
                )}
                <Icon />
                {it.label}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
