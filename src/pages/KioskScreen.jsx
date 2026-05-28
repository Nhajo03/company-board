import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const SLIDE_DURATION = 8000
const REFRESH_INTERVAL = 5 * 60 * 1000

function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code`)
        const data = await res.json()
        setWeather({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code })
      } catch {}
    })
  }, [])
  const getIcon = (code) => code === 0 ? '☀️' : code <= 3 ? '⛅' : code <= 67 ? '🌧️' : code <= 77 ? '❄️' : '⛈️'
  if (!weather) return null
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>
      <span>{getIcon(weather.code)}</span>
      <span className="text-sm font-medium">{weather.temp}°C</span>
    </div>
  )
}

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="text-right">
      <div className="text-4xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-xs tracking-widest uppercase mt-1" style={{ color: 'rgba(148,163,184,0.6)' }}>
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
}

function TickerBar({ alerts }) {
  if (!alerts?.length) return null
  const text = alerts.map(a => a.content).join('   •   ')
  return (
    <div className="overflow-hidden py-2.5" style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }}>
      <div className="animate-marquee whitespace-nowrap text-sm font-semibold text-white tracking-wide">
        🔔 {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🔔 {text}
      </div>
    </div>
  )
}

export default function KioskScreen() {
  const [announces, setAnnounces] = useState([])
  const [alerts, setAlerts] = useState([])
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const fetchData = useCallback(async () => {
    const now = new Date().toISOString()
    const { data: ann } = await supabase.from('announces').select('*').eq('is_active', true).or(`expires_at.is.null,expires_at.gt.${now}`).order('display_order', { ascending: true })
    const { data: al } = await supabase.from('announces').select('*').eq('is_alert', true).eq('is_active', true).or(`expires_at.is.null,expires_at.gt.${now}`)
    setAnnounces(ann || [])
    setAlerts(al || [])
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (announces.length <= 1) return
    const timer = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => { setCurrent(c => (c + 1) % announces.length); setTransitioning(false) }, 600)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [announces.length])

  const slide = announces[current]

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden" style={{ background: '#0f172a', fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        @keyframes marquee { 0%{transform:translateX(100vw)} 100%{transform:translateX(-100%)} }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.7s ease forwards; }
        .fade-out { opacity:0; transform:translateY(-20px); transition: all 0.6s ease; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-12 py-5 border-b" style={{ borderColor: 'rgba(30,41,59,1)', background: 'rgba(15,23,42,0.8)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>CB</div>
          <span className="font-semibold tracking-wide text-white">Company Board</span>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
          <span className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>Live</span>
        </div>
        <div className="flex items-center gap-4">
          <WeatherWidget />
          <Clock />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 relative">
        {announces.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="font-medium" style={{ color: 'rgba(148,163,184,0.5)' }}>No announcements yet</p>
            </div>
          </div>
        ) : slide && (
          <div className={`absolute inset-0 flex ${transitioning ? 'fade-out' : 'fade-in'}`} key={current}>
            {slide.image_url && (
              <div className="w-1/2 h-full relative overflow-hidden">
                <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, #0f172a)' }} />
              </div>
            )}
            <div className={`flex flex-col justify-center px-16 ${slide.image_url ? 'w-1/2' : 'w-full max-w-4xl mx-auto'}`}>
              {slide.category && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit"
                  style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                  {slide.category}
                </div>
              )}
              <h1 className="text-5xl font-bold leading-tight mb-5" style={{ color: '#f1f5f9' }}>{slide.title}</h1>
              <p className="text-xl leading-relaxed" style={{ color: 'rgba(148,163,184,0.8)' }}>{slide.content}</p>
              {slide.expires_at && (
                <p className="text-sm mt-8" style={{ color: 'rgba(96,165,250,0.4)' }}>
                  Until {new Date(slide.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Indicators */}
      {announces.length > 1 && (
        <div className="flex justify-center items-center gap-2 py-3">
          {announces.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-500"
              style={{ width: i === current ? '24px' : '6px', height: '6px', background: i === current ? '#60a5fa' : 'rgba(96,165,250,0.2)' }} />
          ))}
        </div>
      )}

      <TickerBar alerts={alerts} />
    </div>
  )
}
