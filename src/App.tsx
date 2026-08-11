import { useEffect, useState } from 'react'
import type { Course, Lesson } from './types'
import { dueEntries, useStore } from './store'
import { initAudioManifest, initVoices, setSoundEnabled } from './audio'
import { Onboarding } from './screens/Onboarding'
import { AuthScreen } from './screens/Auth'
import { Gallery } from './screens/Gallery'
import { HomeScreen } from './screens/Home'
import { LessonScreen } from './screens/Lesson'
import { ReviewScreen } from './screens/Review'
import { ProfileScreen } from './screens/Profile'

type Tab = 'home' | 'review' | 'profile'

const PathIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z" />
  </svg>
)

const ReviewIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
)

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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

  const [tab, setTab] = useState<Tab>('home')
  const [lesson, setLesson] = useState<{ course: Course; lesson: Lesson } | null>(null)

  useEffect(() => {
    initVoices()
    void initAudioManifest()
    setSoundEnabled(soundOn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // interne stijlgids voor design-review en PDF-export
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

  return (
    <>
      {tab === 'home' && <HomeScreen onStartLesson={(course, l) => setLesson({ course, lesson: l })} onReview={() => setTab('review')} />}
      {tab === 'review' && <ReviewScreen />}
      {tab === 'profile' && <ProfileScreen />}

      <nav className="nav">
        <div className="nav-inner">
          <button className={`nav-item ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
            <PathIcon />
            Leren
          </button>
          <button className={`nav-item ${tab === 'review' ? 'active' : ''}`} onClick={() => setTab('review')}>
            {dueCount > 0 && <span className="nav-badge">{dueCount}</span>}
            <ReviewIcon />
            Oefenen
          </button>
          <button className={`nav-item ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            <ProfileIcon />
            Profiel
          </button>
        </div>
      </nav>
    </>
  )
}
