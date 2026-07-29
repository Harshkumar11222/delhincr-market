import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import api from '../api'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ phone: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.phone || !form.password) { setError('Phone aur password daalo'); return }
    setLoading(true)
    try {
      await login(form.phone, form.password)
      navigate('/')
    } catch(err) { setError(err.response?.data?.error || 'Login failed') }
    setLoading(false)
  }

  async function handleGoogle(cr) {
    setError(''); setLoading(true)
    try {
      var res = await api.post('/auth/google', { credential: cr.credential })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    } catch(err) { setError(err.response?.data?.error || 'Google login failed') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC' }}>

      {/* Left — Branding */}
      <div className="hide-mobile" style={{
        flex: 1, background: 'linear-gradient(135deg, #0F2A3F 0%, #0EA5A0 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(14,165,160,0.15)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.15)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>🏪</div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 4 }}>NukkadMarket</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 48 }}>Apna Shehar, Apna Bazaar</p>
          {[
            { icon: '🇮🇳', text: '100+ cities across India' },
            { icon: '✅', text: 'Verified sellers only' },
            { icon: '🔒', text: 'Safe & secure platform' },
            { icon: '🚀', text: '100% free — always' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, textAlign: 'left' }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ width: '100%', maxWidth: 480, background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(24px, 5vw, 56px)' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>👋</div>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 26, fontWeight: 800, color: '#0F2A3F', marginBottom: 4 }}>Welcome Back!</h2>
          <p style={{ color: '#64748B', fontSize: 14 }}>Apne NukkadMarket account mein login karo</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 10, padding: '12px 16px', color: '#DC2626', marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📱 Mobile Number</label>
            <input className="form-control" type="tel" placeholder="10-digit mobile number"
              value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} maxLength={10} />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ margin: 0 }}>🔒 Password</label>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#0EA5A0', fontWeight: 700 }}>Forgot?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input className="form-control" type={showPass ? 'text' : 'password'} placeholder="Enter password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: 0.5 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0EA5A0, #0C8A85)',
            color: 'white', border: 'none', borderRadius: 99, fontWeight: 700, fontSize: 15,
            cursor: 'pointer', marginBottom: 16, fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 14px rgba(14,165,160,0.35)', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>ya seedha</span>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
  <GoogleLogin
    onSuccess={handleGoogle}
    onError={() => setError('Google login failed')}
    theme="outline" size="large" shape="pill" text="signin_with"
  />
</div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B' }}>
          Account nahi hai? <Link to="/register" style={{ color: '#0EA5A0', fontWeight: 700 }}>Register karo</Link>
        </p>
      </div>
    </div>
  )
}