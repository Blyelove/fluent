import { useEffect, useRef, useState } from 'react'
import { deelKaart, type DeelKaart } from '../share'
import { sfx } from '../audio'

/** Knop die een resultaatplaatje tekent en deelt (of downloadt als delen niet kan) */
export function ShareButton({
  kaart,
  label = 'Deel je resultaat',
  variant = 'ghost',
  style,
}: {
  /**
   * De kaart, of een functie die hem maakt. Gebruik de functievorm zodra de
   * kaart iets uit de pagina nodig heeft (zoals je personage): een object dat
   * tijdens het renderen wordt opgebouwd, ziet refs nog als null.
   */
  kaart: DeelKaart | (() => DeelKaart)
  label?: string
  variant?: 'ghost' | 'primary'
  style?: React.CSSProperties
}) {
  const [status, setStatus] = useState<'rust' | 'bezig' | 'gedeeld' | 'gedownload' | 'mislukt'>('rust')
  const levend = useRef(true)
  const timer = useRef<number | null>(null)

  // niets meer bijwerken zodra het scherm weg is, en de teruglooptimer netjes opruimen
  useEffect(() => {
    levend.current = true
    return () => {
      levend.current = false
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  const tekst =
    status === 'bezig'
      ? 'Plaatje maken…'
      : status === 'gedeeld'
        ? '✅ Gedeeld!'
        : status === 'gedownload'
          ? '✅ Opgeslagen als afbeelding'
          : status === 'mislukt'
            ? 'Niet gelukt — probeer opnieuw'
            : `📤 ${label}`

  return (
    <button
      className={variant === 'primary' ? 'btn btn-primary' : 'btn btn-ghost'}
      style={{ fontSize: 14, padding: 12, ...style }}
      disabled={status === 'bezig'}
      onClick={() => {
        sfx('tap')
        setStatus('bezig')
        void deelKaart(typeof kaart === 'function' ? kaart() : kaart).then((r) => {
          if (!levend.current) return
          setStatus(r)
          timer.current = window.setTimeout(() => {
            if (levend.current) setStatus('rust')
          }, 3000)
        })
      }}
    >
      {tekst}
    </button>
  )
}
