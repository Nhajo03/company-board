// Theme context for dark/light mode
import { createContext, useContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = () => setDark(d => !d)

  const t = {
    dark,
    toggle,
    bg: dark ? '#0a0a0a' : '#00ff87',
    bgCard: dark ? '#111' : '#00e87a',
    bgNav: dark ? 'rgba(10,10,10,0.95)' : 'rgba(0,255,135,0.95)',
    text: dark ? '#fff' : '#000',
    textMuted: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    textDim: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
    border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
    borderHover: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
    accent: '#00ff87',
    accentText: dark ? '#00ff87' : '#000',
    btnBg: dark ? '#00ff87' : '#000',
    btnText: dark ? '#000' : '#fff',
    gridLine: dark ? 'rgba(0,255,135,0.07)' : 'rgba(0,0,0,0.08)',
    scrollTrack: dark ? '#111' : '#00cc6a',
    scrollThumb: dark ? '#00ff87' : '#000',
  }

  return (
    <ThemeContext.Provider value={t}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
