import { useEffect, useState } from 'react'
import { useTheme } from '../lib/theme.jsx'
import ThemeToggle from '../components/ThemeToggle'

const FEATURES = [
  { icon: '⚡', title: 'Dynamic Slides', desc: 'Automated announcements cycle through your screen with smooth transitions.' },
  { icon: '🌤', title: 'Live Weather & Time', desc: 'Real-time local weather and clock keep your team informed at a glance.' },
  { icon: '📢', title: 'Alert Ticker', desc: 'Urgent messages scroll across the screen so nothing gets missed.' },
  { icon: '🎛', title: 'Admin Control', desc: 'Manage all content from a private dashboard — no technical skills needed.' },
  { icon: '🖼', title: 'Image Support', desc: 'Attach company or product visuals to every announcement for maximum impact.' },
  { icon: '🔄', title: 'Auto Refresh', desc: 'Content updates every 5 minutes automatically, keeping displays current.' },
]

const STEPS = [
  { num: '01', title: 'Setup your screen', desc: 'Open the kiosk URL on any TV or monitor.' },
  { num: '02', title: 'Log into admin', desc: 'Access your private dashboard to manage content.' },
  { num: '03', title: 'Create announces', desc: 'Add title, content, image, and expiry date.' },
  { num: '04', title: 'Go live', desc: 'Your content displays instantly on all screens.' },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const t = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ color: t.text, fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        .a1{animation:fadeUp .6s ease .1s both} .a2{animation:fadeUp .6s ease .2s both}
        .a3{animation:fadeUp .6s ease .35s both} .a4{animation:fadeUp .6s ease .5s both}
        @keyframes pulse-dot { 0%,100%{opacity:.4} 50%{opacity:1} }
        .pulse { animation: pulse-dot 2s ease infinite; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 transition-all duration-300"
        style={{ background: scrolled ? t.bgNav : 'transparent', borderBottom: scrolled ? `1px solid ${t.border}` : 'none', backdropFilter: scrolled ? 'blur(12px)' : 'none' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>CB</div>
          <span className="font-semibold tracking-wide" style={{ color: t.text }}>Company Board</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm transition-colors hover:opacity-100" style={{ color: t.textMuted }}>Features</a>
          <a href="#how" className="text-sm transition-colors hover:opacity-100" style={{ color: t.textMuted }}>How it works</a>
          <ThemeToggle />
          <a href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
            Admin →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden pt-20">
        {/* Glow bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        </div>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(${t.accent} 1px, transparent 1px), linear-gradient(90deg, ${t.accent} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="a1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 border"
            style={{ background: t.accentGlow, color: t.accent, borderColor: `${t.accent}30` }}>
            <span className="w-1.5 h-1.5 rounded-full pulse" style={{ background: t.accent }} />
            Digital Signage Platform
          </div>
          <h1 className="a2 text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ color: t.text }}>
            Your company,<br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              beautifully displayed.
            </span>
          </h1>
          <p className="a3 text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: t.textMuted }}>
            A modern digital signage system for lobbies and break rooms. Real-time, effortless to manage, and stunning on any screen.
          </p>
          <div className="a4 flex flex-wrap items-center justify-center gap-4">
            <a href="/kiosk" target="_blank" rel="noopener noreferrer"
              className="px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}>
              View Live Screen ↗
            </a>
            <a href="/login" className="px-7 py-3 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
              style={{ borderColor: t.border, color: t.textMuted }}>
              Go to Admin
            </a>
          </div>
        </div>

        {/* Scroll */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: t.textDim }}>
          <div className="w-px h-10 rounded-full pulse" style={{ background: `linear-gradient(to bottom, ${t.accent}, transparent)` }} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: t.accentGlow, color: t.accent }}>Features</span>
          <h2 className="text-3xl font-bold mt-4" style={{ color: t.text }}>Everything you need</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border transition-all hover:scale-[1.02]"
              style={{ background: t.bgCard, borderColor: t.border, boxShadow: t.shadow }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: t.accentGlow }}>{f.icon}</div>
              <h3 className="font-semibold mb-2" style={{ color: t.text }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: t.accentGlow, color: t.accent }}>Process</span>
            <h2 className="text-3xl font-bold mt-4" style={{ color: t.text }}>How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>{s.num}</div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: t.text }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-10 text-center">
        <div className="max-w-xl mx-auto p-10 rounded-3xl border" style={{ background: t.bgCard, borderColor: t.border, boxShadow: t.shadow }}>
          <h2 className="text-3xl font-bold mb-3" style={{ color: t.text }}>Ready to display?</h2>
          <p className="mb-8" style={{ color: t.textMuted }}>Start managing your company screens in minutes.</p>
          <a href="/login" className="inline-block px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}>
            Get Started →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-10 py-6 flex items-center justify-between text-xs" style={{ borderColor: t.border, color: t.textDim }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>CB</div>
          <span>Company Board</span>
        </div>
        <div className="flex gap-6">
          <a href="/kiosk" className="hover:opacity-70 transition-opacity">Kiosk</a>
          <a href="/login" className="hover:opacity-70 transition-opacity">Admin</a>
        </div>
      </footer>
    </div>
  )
}
