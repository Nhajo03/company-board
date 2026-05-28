import { useTheme } from '../lib/theme.jsx'

export default function ThemeToggle() {
  const t = useTheme()
  return (
    <button onClick={t.toggle} title={t.dark ? 'Light mode' : 'Dark mode'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs tracking-wide font-medium transition-all"
      style={{ background: t.accentGlow, color: t.accent, border: `1px solid ${t.accent}30` }}>
      {t.dark ? '☀ Light' : '☾ Dark'}
    </button>
  )
}
