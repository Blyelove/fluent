import { useState } from 'react'
import { motion } from 'motion/react'
import type { DuelPayload } from '../duel'
import { ArcadeScreen } from './Arcade'
import { DuelScreen } from './Duel'
import { sfx } from '../audio'

/** Speel-tabblad: minigames én vrienden-duels onder één dak */
export function PlayScreen({ incomingDuel }: { incomingDuel?: DuelPayload | null }) {
  const [tab, setTab] = useState<'arcade' | 'duel'>(incomingDuel ? 'duel' : 'arcade')

  return (
    <div>
      <div className="shell" style={{ paddingBottom: 0, minHeight: 0 }}>
        <div className="row" style={{ gap: 8 }}>
          {(
            [
              ['arcade', '🕹️', 'Minigames'],
              ['duel', '⚔️', 'Vrienden'],
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
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        {tab === 'arcade' ? <ArcadeScreen /> : <DuelScreen incoming={incomingDuel} />}
      </motion.div>
    </div>
  )
}
