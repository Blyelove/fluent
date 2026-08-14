import { useId } from 'react'
import { Flag } from './Flag'

/**
 * Eén paspoortstempel: een scheef geslagen inktcirkel met de vlag, de landnaam
 * gebogen langs de rand en de datum eronder.
 *
 * De scheefstand is afgeleid van de landcode, dus elk land staat altijd op
 * precies dezelfde hoek. Willekeur zou bij elke render dansen, en dan voelt het
 * als versiering in plaats van als een stempel die er ooit op is gezet.
 */
function hoekVoor(code: string): number {
  let h = 0
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) % 1000
  // tussen -14 en +10 graden
  return -14 + (h % 25)
}

export function PassportStamp({
  code,
  naam,
  datum,
  size = 96,
}: {
  code: string
  naam: string
  /** dagstring; leeg = nog niet verdiend */
  datum?: string
  size?: number
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const behaald = !!datum
  const hoek = behaald ? hoekVoor(code) : 0

  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          transform: `rotate(${hoek}deg)`,
          opacity: behaald ? 0.94 : 0.5,
        }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
          <defs>
            <path id={`ring-${uid}`} d="M 50,50 m -37,0 a 37,37 0 1,1 74,0" fill="none" />
          </defs>
          {/* buitenrand: doorgetrokken als je hem hebt, gestippeld als hij nog wacht */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={behaald ? 'var(--gold)' : 'var(--line)'}
            strokeWidth={behaald ? 3 : 2}
            strokeDasharray={behaald ? undefined : '5 6'}
          />
          <circle cx="50" cy="50" r="37" fill="none" stroke={behaald ? 'var(--goud-50)' : 'var(--line)'} strokeWidth={1.5} />
          {behaald && (
            <text fill="var(--gold)" fontSize="10" fontWeight="800" letterSpacing="1.1">
              <textPath href={`#ring-${uid}`} startOffset="50%" textAnchor="middle">
                {naam.toUpperCase().slice(0, 16)}
              </textPath>
            </text>
          )}
        </svg>

        {/* midden: de vlag of een vraagteken */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {behaald ? (
            <>
              <Flag code={code} size={26} />
              <span className="gold-text" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.04em' }}>
                {datum?.slice(8, 10)}-{datum?.slice(5, 7)}-{datum?.slice(2, 4)}
              </span>
            </>
          ) : (
            <span className="faint" style={{ fontSize: 28, fontWeight: 800 }}>
              ?
            </span>
          )}
        </div>
      </div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          marginTop: 0,
          color: behaald ? 'var(--text)' : 'var(--text-faint)',
        }}
      >
        {naam}
      </p>
    </div>
  )
}
