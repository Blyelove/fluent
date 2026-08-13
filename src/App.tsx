import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { WereldKiezer } from './components/WereldKiezer'
import { pasWereldToe } from './werelden'
import { skillStand } from './skills'
import type { Course, Lesson } from './types'
import { courses } from './content'
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
import { GesprekkenScreen } from './screens/Gesprek'

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

  // de taalwereld hoort op élk scherm te staan, ook op het inlogscherm; de
  // kiezer laadt daar niet, dus zetten we hem hier op het document
  const wereldKeuze = useStore((s) => s.wereld)
  const taalNu = useStore((s) => s.courseId)
  const niveauNu = useStore((s) => skillStand(s.progress[s.courseId]?.xp ?? 0).level)
  useEffect(() => {
    pasWereldToe(wereldKeuze, taalNu, niveauNu)
  }, [wereldKeuze, taalNu, niveauNu])

  const [tab, setTab] = useState<Tab>('home')
  const [lesson, setLesson] = useState<{ course: Course; lesson: Lesson } | null>(null)
  // het gespreksscherm ligt als volledig scherm over de tabs heen
  const [praten, setPraten] = useState(false)
  // tijdens een minigame of duel verdwijnt de onderbalk: vijf tabs onder je
  // duim tijdens een potje op de klok = één misveeg en je run is weg
  const [gamePlaying, setGamePlaying] = useState(false)

  // duel-uitnodiging uit de link halen (eenmalig bij het openen)
  const incomingDuel = useMemo(() => readDuelFromUrl(), [])

  /**
   * Nieuwe versies mogen nooit onzichtbaar blijven hangen: de service worker
   * checkt elke minuut (en bij terugkeren naar het tabblad) of er een deploy
   * is, en dan verschijnt de verversknop. Pas na een tik wisselt de versie,
   * dus een lopende les kan nooit halverwege breken.
   */
  const {
    needRefresh: [nieuweVersie],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      if (!reg) return
      setInterval(() => void reg.update(), 60_000)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void reg.update()
      })
    },
  })

  useEffect(() => {
    initVoices()
    void initAudioManifest()
    setSoundEnabled(soundOn)
    useStore.getState().registerVisit()
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

  if (!onboarded)
    return (
      <Onboarding
        onKlaar={(c) => {
          // rechtstreeks de eerste les van de gekozen cursus starten
          const cursus = courses[c]
          const eerste = cursus?.sections[0]?.units[0]?.lessons[0]
          if (cursus && eerste) setLesson({ course: cursus, lesson: eerste })
        }}
      />
    )

  if (lesson) {
    return (
      <LessonScreen
        key={lesson.lesson.id}
        course={lesson.course}
        lesson={lesson.lesson}
        onExit={() => setLesson(null)}
        onNext={(l) => setLesson({ course: lesson.course, lesson: l })}
      />
    )
  }

  if (praten) return <GesprekkenScreen onExit={() => setPraten(false)} />

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
          onPraten={() => setPraten(true)}
        />
      )}
      {tab === 'play' && <PlayScreen incomingDuel={incomingDuel} onPlayingChange={setGamePlaying} />}
      {tab === 'league' && <LeagueScreen onLeren={() => setTab('home')} />}
      {tab === 'review' && <ReviewScreen onGoLearn={() => setTab('home')} onPraten={() => setPraten(true)} />}
      {tab === 'profile' && <ProfileScreen />}

      {/* het ornament van je taalwereld, dat met je niveau meegroeit */}
      <div className="wereld-laag" aria-hidden="true" />

      {/* de proeverij van taalwerelden: vergelijk ze op je eigen scherm */}
      <WereldKiezer verborgen={gamePlaying} />

      {/* er staat een nieuwe versie klaar: één tik en je kijkt weer live */}
      {nieuweVersie && (
        <div style={{ position: 'fixed', left: 14, right: 14, bottom: gamePlaying ? 14 : 96, zIndex: 40, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => void updateServiceWorker(true)}
            className="row"
            style={{
              gap: 10,
              padding: '12px 18px',
              borderRadius: 999,
              background: 'var(--grad-gold)',
              color: 'var(--ink-on-gold)',
              fontWeight: 700,
              fontSize: 14,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 18px rgba(255,197,61,0.45)',
              minHeight: 44,
            }}
          >
            ⚡ Nieuwe versie klaar · tik om te verversen
          </button>
        </div>
      )}

      {!gamePlaying && (
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
      )}
    </>
  )
}
