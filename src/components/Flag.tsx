/** SVG-landvlag (flag-icons) — emoji-vlaggen renderen niet op Windows */
export function Flag({ code, size = 20, round = false }: { code: string; size?: number; round?: boolean }) {
  return (
    <span
      className={`fi fi-${code}${round ? ' fis' : ''}`}
      style={{
        fontSize: size,
        borderRadius: round ? '50%' : 4,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.12)',
        flexShrink: 0,
      }}
    />
  )
}
