import { useLayoutEffect, useRef, useState } from 'react'
import type { Course } from '../types'
import { countryStates, etappeFrac } from '../countries'
import { Flag } from './Flag'
import { Avatar } from './Avatar'
import { levelForXp } from '../levels'
import { totalXp, useStore } from '../store'
import { sfx } from '../audio'

/**
 * De Wereldreis in het klein: het stukje route waar je nu op staat.
 *
 * Waar het oude blok veertien vlaggetjes op een rij zette, laat dit zien wat er
 * echt toe doet: waar je vandaan komt, waar je heen loopt, en dat jij daar zelf
 * loopt. Eén statische SVG, geen oneindige animaties, geen scroll — de grote
 * kaart is één tik verder en die mag het spektakel doen.
 */

const B = 340
const H = 96
/** de route slingert van links (achter je) naar rechts (voor je) */
const START = { x: 30, y: 72 }
const EIND = { x: 310, y: 32 }
const PAD = `M ${START.x} ${START.y} C 130 ${START.y + 8}, 200 ${EIND.y - 8}, ${EIND.x} ${EIND.y}`

export function WorldPeek({
  course,
  completedCount,
  onOpen,
}: {
  course: Course
  completedCount: number
  onOpen: () => void
}) {
  const look = useStore((s) => s.avatarLook)
  const level = useStore((s) => levelForXp(totalXp(s)))
  const pad = useRef<SVGPathElement | null>(null)
  const [held, setHeld] = useState<{ x: number; y: number } | null>(null)

  const landen = countryStates(course, completedCount)
  const veroverd = landen.filter((c) => c.conquered).length
  const doel = landen.find((c) => !c.conquered)
  const vorige = doel ? landen[landen.indexOf(doel) - 1] : landen[landen.length - 1]
  const frac = doel ? etappeFrac(landen, doel, completedCount) : 1
  const restLessen = doel ? Math.max(0, doel.threshold - completedCount) : 0

  // de held staat precies zo ver op de bocht als je lessen reiken; dezelfde
  // meting als de grote kaart, uit dezelfde functie, dus de twee kunnen niet
  // uit elkaar lopen
  useLayoutEffect(() => {
    const p = pad.current
    if (!p) return
    const punt = p.getPointAtLength(frac * p.getTotalLength())
    setHeld({ x: punt.x, y: punt.y })
  }, [frac])

  return (
    <div className="glass unit-card" style={{ order: 1 }}>
      <div className="spread">
        <span className="row" style={{ gap: 8 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--cyaan-16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🌍</span>
          <strong className="card-title">Wereldverovering</strong>
        </span>
        <span className="gold-text num" style={{ fontWeight: 700, fontSize: 14 }}>
          {veroverd} / {landen.length}
        </span>
      </div>

      <div style={{ position: 'relative', marginTop: 8, width: '100%' }}>
        <svg viewBox={`0 0 ${B} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
          <defs>
            <linearGradient id="peek-route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--hot1)" />
              <stop offset="100%" stopColor="var(--hot2)" />
            </linearGradient>
          </defs>
          {/* de route die nog voor je ligt: gestippeld */}
          <path d={PAD} fill="none" stroke="var(--line)" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 9" />
          {/* het stuk dat je al gelopen hebt, in het verloop */}
          <path
            ref={pad}
            d={PAD}
            fill="none"
            stroke="url(#peek-route)"
            strokeWidth="5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - frac}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        {/* achter je: het laatste land dat je veroverde, in volle kleur */}
        <Vlag x={START.x} y={START.y} code={vorige?.code ?? landen[0]?.code ?? 'es'} veroverd={!!vorige?.conquered} />
        {/* voor je: het volgende land, gedimd met een amber randje */}
        {doel && <Vlag x={EIND.x} y={EIND.y} code={doel.code} veroverd={false} />}

        {/* en daartussen loop jij */}
        {held && (
          <div
            style={{
              position: 'absolute',
              left: `${(held.x / B) * 100}%`,
              top: `${(held.y / H) * 100}%`,
              transform: 'translate(-50%, -78%)',
              pointerEvents: 'none',
              transition: 'left 0.8s ease, top 0.8s ease',
            }}
          >
            <Avatar size={44} still level={level} courseId={course.id} look={look} />
          </div>
        )}
      </div>

      {doel ? (
        <div style={{ marginTop: 4 }}>
          <div className="spread" style={{ marginBottom: 4 }}>
            <span className="dim row" style={{ fontSize: 12.5, gap: 4 }}>
              Volgende: <Flag code={doel.code} size={14} /> {doel.name}
            </span>
            <span className="faint" style={{ fontSize: 12.5 }}>
              {doel.inCourse ? `nog ${restLessen} ${restLessen === 1 ? 'les' : 'lessen'}` : 'komt met nieuwe lessen'}
            </span>
          </div>
          <div className="progress-track" style={{ height: 6 }}>
            <div className="progress-fill" style={{ width: `${Math.round(frac * 100)}%` }} />
          </div>
        </div>
      ) : (
        <p className="gold-text" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>
          De hele {course.name}talige wereld is van jou. Meesterlijk.
        </p>
      )}

      <button
        className="btn btn-primary"
        /* minHeight erbij: met padding 12 en tekst van 14 komt deze knop op
           43 pixels uit, net onder de tikgrens van 44. De maatladder mag nooit
           een knop kleiner maken dan een duim aankan. */
        style={{ marginTop: 12, padding: 12, fontSize: 14, minHeight: 44 }}
        onClick={() => {
          sfx('tap')
          onOpen()
        }}
      >
        🗺️ Reis verder →
      </button>
    </div>
  )
}

/** vlagpen op de mini-route, geplaatst in procenten zodat hij met de SVG meerekt */
function Vlag({ x, y, code, veroverd }: { x: number; y: number; code: string; veroverd: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${(x / B) * 100}%`,
        top: `${(y / H) * 100}%`,
        transform: 'translate(-50%, -50%)',
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: veroverd ? 'var(--goud-16)' : 'var(--surface-2)',
        border: veroverd ? '2.5px solid var(--gold)' : '2px solid var(--goud-50)',
        boxShadow: veroverd ? '0 0 14px var(--goud-35)' : 'none',
        opacity: veroverd ? 1 : 0.72,
        pointerEvents: 'none',
      }}
    >
      <Flag code={code} size={19} />
    </div>
  )
}
