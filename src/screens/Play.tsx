import { useCallback, useState } from 'react'
import { motion } from 'motion/react'
import type { DuelPayload } from '../duel'
import type { SchaduwDuel } from '../arena-duel'
import { ArcadeScreen } from './Arcade'
import { ArenaScreen } from './Arena'
import { DuelScreen } from './Duel'
import { sfx } from '../audio'

/** Speel-tabblad: minigames én vrienden-duels onder één dak */
export function PlayScreen({
  incomingDuel,
  schaduw,
  onPlayingChange: meldOuder,
}: {
  incomingDuel?: DuelPayload | null
  /** een vriend die zijn potje opnam en jou uitdaagt in de arena */
  schaduw?: SchaduwDuel | null
  /** Zodat de app-brede onderbalk óók verdwijnt tijdens een potje — één misveeg op een tab kostte anders je hele run */
  onPlayingChange?: (playing: boolean) => void
}) {
  const [tab, setTab] = useState<'arcade' | 'duel' | 'arena'>(() => {
    // een schaduwuitdaging hoort meteen in de arena te openen: dat is het hele punt
    if (schaduw) return 'arena'
    if (incomingDuel) return 'duel'
    // ?arena=1 opent de arena direct, voor een gedeelde link of een beeld
    if (new URLSearchParams(window.location.search).has('arena')) return 'arena'
    return 'arcade'
  })
  const [playing, setPlaying] = useState(false)

  const onPlayingChange = useCallback(
    (p: boolean) => {
      setPlaying(p)
      meldOuder?.(p)
    },
    [meldOuder]
  )

  return (
    <div>
      {!playing && (
        <div className="shell" style={{ paddingBottom: 0, minHeight: 0 }}>
          <div className="row" style={{ gap: 8 }}>
            {(
              [
                ['arcade', '🕹️', 'Minigames'],
                ['arena', '🏟️', 'Arena'],
                // "Vrienden" verborg dat je hier ook alleen tegen een bot kunt duelleren
                ['duel', '🤝', 'Duels'],
              ] as const
            ).map(([id, icon, label]) => (
              <button
                key={id}
                className={tab === id ? 'btn btn-primary' : 'btn btn-ghost'}
                style={{ padding: '13px 10px', fontSize: 15 }}
                onClick={() => {
                  sfx('tap')
                  setTab(id)
                }}
              >
                <span style={{ fontSize: 17 }}>{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        {tab === 'arcade' ? (
          <ArcadeScreen onPlayingChange={onPlayingChange} onDuels={() => setTab('duel')} />
        ) : tab === 'arena' ? (
          <ArenaScreen
            onTerug={() => { setTab('arcade'); onPlayingChange(false) }}
            onPlayingChange={onPlayingChange}
            schaduw={schaduw}
          />
        ) : (
          <DuelScreen incoming={incomingDuel} onPlayingChange={onPlayingChange} />
        )}
      </motion.div>
    </div>
  )
}
