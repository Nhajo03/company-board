import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/theme.jsx'
import ThemeToggle from '../components/ThemeToggle'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const t = useTheme()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message) } else { navigate('/admin') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`}</style>

      <div className="absolute top-5 right-8"><ThemeToggle /></div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}>CB</div>
          <h1 className="text-xl font-bold" style={{ color: t.text }}>Welcome back</h1>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>Sign in to your admin dashboard</p>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: t.bgCard, borderColor: t.border, boxShadow: t.shadow }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}
          <div className="space-y-4">
            {[
              { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'admin@company.com' },
              { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••' },
            ].map(({ label, type, value, set, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: t.textMuted }}>{label}</label>
                <input type={type} value={value} placeholder={placeholder}
                  onChange={e => set(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                  style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}
                  onFocus={e => { e.target.style.borderColor = t.accent; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}` }}
                  onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }} />
              </div>
            ))}
            <button onClick={handleLogin} disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 mt-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 4px 16px rgba(59,130,246,0.35)', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </div>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-xs transition-colors hover:opacity-80" style={{ color: t.textDim }}>← Back to website</a>
        </p>
      </div>
    </div>
  )
}
