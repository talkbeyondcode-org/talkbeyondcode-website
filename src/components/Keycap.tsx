/* A physical keycap for the Ctrl + Shift + AI lockup. On the Vibrant theme
   inactive caps are pale wells; the “AI” cap carries the brand gradient.   */
function Keycap({
  children,
  gradient = false,
  size = 'md',
}: {
  children: string
  gradient?: boolean
  size?: 'sm' | 'md'
}) {
  const dims =
    size === 'sm'
      ? 'h-12 w-16 text-base rounded-[11px]'
      : 'h-16 w-[86px] text-lg rounded-[13px]'
  return (
    <span
      className={`inline-flex select-none items-center justify-center font-mono font-bold tracking-tight text-ink ${dims} ${
        gradient
          ? 'bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-magenta'
          : 'border border-line bg-panel'
      }`}
    >
      {children}
    </span>
  )
}

export default Keycap
