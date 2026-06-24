/* A physical keycap. The brand identity is the shortcut Ctrl + Shift + AI,
   so the keycap is a real, tactile object: beveled top, seated shadow, and
   when active a cyan->magenta brand-gradient underglow.                   */
const seated =
  'inset 0 1px 0 oklch(0.4 0.018 258), 0 2px 0 oklch(0.09 0.012 258), 0 4px 6px oklch(0.07 0.01 258 / 0.6)'
const brandGlow =
  ', 0 0 16px -3px rgba(34, 211, 238, 0.55), 0 10px 26px -8px rgba(232, 121, 249, 0.5)'

function Keycap({ children, active = false }: { children: string; active?: boolean }) {
  return (
    <span
      className={`relative inline-flex select-none items-center justify-center rounded-md border px-3 pb-2 pt-1.5 font-mono text-sm uppercase tracking-wide transition-colors ${
        active ? 'border-signal/60 text-signal' : 'border-line text-ink'
      }`}
      style={{
        background:
          'linear-gradient(180deg, var(--color-surface-2), var(--color-surface))',
        boxShadow: active ? seated + brandGlow : seated,
      }}
    >
      {children}
    </span>
  )
}

export default Keycap
