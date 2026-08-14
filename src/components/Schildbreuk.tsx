import { motion } from 'motion/react'

/**
 * Het moment dat een schild breekt.
 *
 * Een schild dat alleen wegpoft voelt als een teller die eentje omlaag gaat.
 * Een schild dat versplintert voelt als een klap. Dat is het hele verschil
 * tussen een spel en een ervaring, dus het krijgt vier richtingen.
 *
 * Belangrijk: dit is puur decor. Het gevecht loopt op timers in Arena.tsx en
 * hangt nergens van een animatieframe af, want in een achtergrondtab komen
 * die frames niet en dan zou het gevecht bevriezen.
 */

export type BreukStijl = 'scherven' | 'barst' | 'schok' | 'as'

/**
 * De scherven vliegen elk een eigen kant op, maar altijd dezelfde kanten.
 *
 * Bewust naar opzij en omlaag en niet omhoog: de schildenbalk staat bovenaan
 * het scherm, en scherven die omhoog vliegen worden door de rand weggeknipt.
 * Onder de balk is juist alle ruimte. Gemeten, niet gegokt: van de eerste zes
 * hoeken bleven er drie onzichtbaar.
 */
const SCHERVEN = [
  { hoek: -162, ver: 46, draai: -140, maat: 0.78 },
  { hoek: -22, ver: 44, draai: 95, maat: 0.62 },
  { hoek: 34, ver: 56, draai: 165, maat: 0.72 },
  { hoek: 84, ver: 48, draai: -110, maat: 0.56 },
  { hoek: 132, ver: 54, draai: 130, maat: 0.68 },
  { hoek: 178, ver: 42, draai: -75, maat: 0.5 },
]

/** de sintels dwarrelen op, licht uiteen */
const SINTELS = [
  { x: -9, ver: 30, traag: 0 },
  { x: -3, ver: 38, traag: 0.06 },
  { x: 4, ver: 33, traag: 0.03 },
  { x: 10, ver: 41, traag: 0.09 },
  { x: 0, ver: 27, traag: 0.13 },
]

export function Schildbreuk({ stijl, kalm }: { stijl: BreukStijl; kalm: boolean }) {
  // wie beweging heeft uitgezet krijgt geen scherven om de oren; het schild
  // dooft dan gewoon en dat is even duidelijk
  if (kalm) {
    return (
      <motion.span
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 23 }}
      >
        🛡️
      </motion.span>
    )
  }

  const laag = { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' } as const

  /* De flits op het moment van inslag. Die hoort bij elke richting, want dat
     ene frame licht is wat een breuk tot een klap maakt; de scherven daarna
     vertellen alleen nog het verhaal. */
  const flits = (
    <motion.span
      initial={{ opacity: 0.95, scale: 0.5 }}
      animate={{ opacity: 0, scale: 2.6 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff 0%, rgba(255,255,255,0.55) 45%, transparent 72%)',
      }}
    />
  )

  if (stijl === 'as') {
    return (
      <span aria-hidden style={laag}>
        {flits}
        {/* de gloed die van de rand naar binnen vreet */}
        <motion.span
          initial={{ opacity: 1, filter: 'brightness(1)' }}
          animate={{ opacity: [1, 1, 0], filter: ['brightness(1)', 'brightness(2.4)', 'brightness(3)'] }}
          transition={{ duration: 0.62, times: [0, 0.45, 1] }}
          style={{ position: 'absolute', fontSize: 23 }}
        >
          🛡️
        </motion.span>
        {SINTELS.map((s, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: s.x, y: 2, scale: 0.9 }}
            animate={{ opacity: [0, 1, 0], y: -s.ver, x: s.x * 1.7, scale: [0.9, 1, 0.4] }}
            transition={{ duration: 0.85, delay: 0.16 + s.traag, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: 'var(--gold-bright, #ffe08a)',
              boxShadow: '0 0 6px 1px rgba(255, 176, 60, 0.9)',
            }}
          />
        ))}
      </span>
    )
  }

  if (stijl === 'schok') {
    return (
      <span aria-hidden style={laag}>
        {flits}
        <motion.span
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: [1, 1.15, 0.05], opacity: [1, 1, 0] }}
          transition={{ duration: 0.34, times: [0, 0.3, 1], ease: 'easeIn' }}
          style={{ position: 'absolute', fontSize: 23 }}
        >
          🛡️
        </motion.span>
        <motion.span
          initial={{ scale: 0.1, opacity: 0.85 }}
          animate={{ scale: 3.4, opacity: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 27,
            height: 27,
            borderRadius: '50%',
            border: '2px solid var(--cyan, #22d3ee)',
          }}
        />
      </span>
    )
  }

  if (stijl === 'barst') {
    return (
      <span aria-hidden style={laag}>
        {flits}
        {/* twee helften: eerst even trillen, dan uit elkaar en omlaag */}
        {[-1, 1].map((kant) => (
          <motion.span
            key={kant}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: kant * 13, y: 26, rotate: kant * 42, opacity: [1, 1, 0] }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.4, 0, 0.7, 1], times: [0, 0.5, 1] }}
            style={{
              position: 'absolute',
              fontSize: 23,
              // elke helft toont maar de helft van het schild
              clipPath: kant === -1 ? 'polygon(0 0, 52% 0, 44% 100%, 0 100%)' : 'polygon(52% 0, 100% 0, 100% 100%, 44% 100%)',
            }}
          >
            🛡️
          </motion.span>
        ))}
        {/* de barst zelf: een lichtlijn die er in een flits doorheen schiet */}
        <motion.span
          initial={{ scaleY: 0, opacity: 1 }}
          animate={{ scaleY: 1, opacity: [1, 1, 0] }}
          transition={{ duration: 0.26, times: [0, 0.6, 1] }}
          style={{
            position: 'absolute',
            width: 2,
            height: 27,
            background: 'var(--gold-bright, #ffe08a)',
            boxShadow: '0 0 8px 2px rgba(255, 224, 138, 0.9)',
            transform: 'rotate(8deg)',
          }}
        />
      </span>
    )
  }

  // scherven: de standaard, en de meest voelbare
  return (
    <span aria-hidden style={laag}>
      {flits}
      <motion.span
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.22, 1.05], opacity: [1, 1, 0] }}
        transition={{ duration: 0.2, times: [0, 0.5, 1] }}
        style={{ position: 'absolute', fontSize: 23 }}
      >
        🛡️
      </motion.span>
      {SCHERVEN.map((s, i) => {
        const rad = (s.hoek * Math.PI) / 180
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: Math.cos(rad) * s.ver,
              y: Math.sin(rad) * s.ver + 18,
              rotate: s.draai,
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.62, delay: 0.08, ease: [0.15, 0.7, 0.4, 1], times: [0, 0.55, 1] }}
            style={{
              position: 'absolute',
              // Bewust geen uitgeknipt stukje schildemoji: dat is donker, en
              // een donkere splinter op een donkere arena zie je niet. Een
              // eigen lichte scherf leest in elke taalwereld.
              width: 13 * s.maat + 5,
              height: 15 * s.maat + 6,
              background: 'linear-gradient(140deg, #fff 0%, var(--cyan, #22d3ee) 55%, rgba(34,211,238,0.35) 100%)',
              clipPath: 'polygon(52% 0, 100% 46%, 68% 100%, 4% 66%)',
              filter: 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.85))',
            }}
          />
        )
      })}
    </span>
  )
}
