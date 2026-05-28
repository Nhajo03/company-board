import { createContext, useContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light')

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = () => setDark(d => !d)

  const t = {
    dark,
    toggle,
    // Backgrounds
    bg:      dark ? '#0f172a' : '#f8fafc',
    bgCard:  dark ? '#1e293b' : '#fff',
    bgNav:   dark ? 'rgba(15,23,42,0.95)' : 'rgba(248,250,252,0.95)',
    // Text
    text:      dark ? '#f1f5f9' : '#0f172a',
    textMuted: dark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)',
    textDim:   dark ? 'rgba(71,85,105,1)' : 'rgba(148,163,184,1)',
    // Borders
    border:      dark ? 'rgba(30,41,59,1)' : 'rgba(226,232,240,1)',
    borderHover: dark ? 'rgba(51,65,85,1)' : 'rgba(148,163,184,1)',
    // Accent bleu électrique
    accent:     '#60a5fa',
    accentDark: '#3b82f6',
    accentGlow: dark ? 'rgba(96,165,250,0.15)' : 'rgba(59,130,246,0.1)',
    // Buttons
    btnBg:   '#3b82f6',
    btnText: '#fff',
    // Misc
    gridLine: dark ? 'rgba(96,165,250,0.04)' : 'rgba(59,130,246,0.06)',
    shadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(15,23,42,0.08)',
  }

  return (
    <ThemeContext.Provider value={t}>
      <div style={{ background: t.bg, minHeight: '100vh', transition: 'background 0.3s, color 0.3s' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
