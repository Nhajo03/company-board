import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/theme.jsx'
import ThemeToggle from '../components/ThemeToggle'

const EMPTY_FORM = { title: '', content: '', category: '', image_url: '', expires_at: '', display_order: 0, is_active: true, is_alert: false }

function Modal({ announce, onClose, onSave }) {
  const [form, setForm] = useState(announce || EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const t = useTheme()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('announce-images').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('announce-images').getPublicUrl(path)
      set('image_url', data.publicUrl)
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = { ...form, expires_at: form.expires_at || null, display_order: Number(form.display_order) || 0 }
    let error
    if (form.id) { ({ error } = await supabase.from('announces').update(payload).eq('id', form.id)) }
    else { ({ error } = await supabase.from('announces').insert(payload)) }
    setSaving(false)
    if (!error) onSave()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border"
        style={{ background: t.bgCard, borderColor: t.border, boxShadow: '0 24px 64px rgba(0,0,0,0.3)', fontFamily: "'Space Grotesk', sans-serif" }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: t.border }}>
          <h2 className="font-bold" style={{ color: t.text }}>{form.id ? 'Edit Announce' : 'New Announce'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors"
            style={{ background: t.bg, color: t.textMuted }}>×</button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Title *', key: 'title', type: 'text', placeholder: 'Announce title' },
            { label: 'Category', key: 'category', type: 'text', placeholder: 'e.g. News, HR, Events' },
            { label: 'Image URL', key: 'image_url', type: 'url', placeholder: 'https://...' },
            { label: 'Display Order', key: 'display_order', type: 'number', placeholder: '0' },
            { label: 'Expires At', key: 'expires_at', type: 'datetime-local' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.textMuted }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}
                onFocus={e => { e.target.style.borderColor = t.accent; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}` }}
                onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: t.textMuted }}>Content</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={4} placeholder="Announce content..."
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none transition-all"
              style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}
              onFocus={e => { e.target.style.borderColor = t.accent; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}` }}
              onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.textMuted }}>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImage} style={{ color: t.textMuted }} />
            {uploading && <p className="text-xs mt-1" style={{ color: t.accent }}>Uploading...</p>}
            {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" style={{ border: `1px solid ${t.border}` }} />}
          </div>
          <div className="flex gap-6 pt-2">
            {[{ label: 'Active', key: 'is_active' }, { label: 'Alert Ticker', key: 'is_alert' }].map(({ label, key }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: t.accent }} />
                <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t" style={{ borderColor: t.border }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: t.border, color: t.textMuted, background: t.bg }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save Announce'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [announces, setAnnounces] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const navigate = useNavigate()
  const t = useTheme()

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase.from('announces').select('*').order('display_order', { ascending: true })
    setAnnounces(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this announce?')) return
    await supabase.from('announces').delete().eq('id', id)
    fetchData()
  }

  const toggleActive = async (id, current) => {
    await supabase.from('announces').update({ is_active: !current }).eq('id', id)
    fetchData()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen" style={{ color: t.text, fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`}</style>
      {modal !== null && <Modal announce={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); fetchData() }} />}

      {/* Nav */}
      <div className="border-b px-8 py-4 flex items-center justify-between sticky top-0 z-40" style={{ background: t.bgNav, borderColor: t.border, backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>CB</div>
          <span className="font-semibold" style={{ color: t.text }}>Company Board</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: t.accentGlow, color: t.accent }}>Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/kiosk" target="_blank" rel="noopener noreferrer"
            className="text-xs font-medium px-4 py-2 rounded-lg border transition-colors"
            style={{ color: t.textMuted, borderColor: t.border, background: t.bg }}>
            Preview Kiosk ↗
          </a>
          <ThemeToggle />
          <button onClick={handleLogout} className="text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: t.textMuted, background: t.bg, border: `1px solid ${t.border}` }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: announces.length, icon: '📋' },
            { label: 'Active', value: announces.filter(a => a.is_active).length, icon: '✅' },
            { label: 'Alerts', value: announces.filter(a => a.is_alert).length, icon: '🔔' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="p-6 rounded-2xl border" style={{ background: t.bgCard, borderColor: t.border, boxShadow: t.shadow }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: t.textMuted }}>{label}</p>
                <span>{icon}</span>
              </div>
              <p className="text-4xl font-bold" style={{ color: t.text }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-bold" style={{ color: t.text }}>Announces</h1>
          <button onClick={() => setModal({})}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
            + New Announce
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${t.border}`, borderTopColor: t.accent }} />
          </div>
        ) : announces.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border" style={{ background: t.bgCard, borderColor: t.border }}>
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium" style={{ color: t.textMuted }}>No announces yet</p>
            <p className="text-sm mt-1" style={{ color: t.textDim }}>Click "+ New Announce" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announces.map(a => (
              <div key={a.id} className="rounded-2xl border p-4 flex items-center gap-4 transition-all hover:scale-[1.005]"
                style={{ background: t.bgCard, borderColor: t.border, boxShadow: t.shadow }}>
                {a.image_url
                  ? <img src={a.image_url} alt={a.title} className="w-16 h-12 object-cover rounded-xl flex-shrink-0" />
                  : <div className="w-16 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: t.accentGlow }}>📄</div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold truncate" style={{ color: t.text }}>{a.title}</p>
                    {a.is_alert && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>🔔 Alert</span>}
                    {a.category && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: t.accentGlow, color: t.accent }}>{a.category}</span>}
                  </div>
                  {a.content && <p className="text-sm truncate" style={{ color: t.textMuted }}>{a.content}</p>}
                  {a.expires_at && <p className="text-xs mt-0.5" style={{ color: t.textDim }}>Expires {new Date(a.expires_at).toLocaleDateString('en-US')}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(a.id, a.is_active)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: a.is_active ? 'rgba(34,197,94,0.1)' : t.bg, color: a.is_active ? '#22c55e' : t.textDim, border: `1px solid ${a.is_active ? 'rgba(34,197,94,0.2)' : t.border}` }}>
                    {a.is_active ? '● Active' : '○ Inactive'}
                  </button>
                  <button onClick={() => setModal(a)} className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ color: t.accent, borderColor: `${t.accent}30`, background: t.accentGlow }}>Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ color: t.textDim, borderColor: t.border, background: t.bg }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = t.textDim; e.currentTarget.style.borderColor = t.border }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
