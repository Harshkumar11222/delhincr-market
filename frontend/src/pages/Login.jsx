import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import api from '../api'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ phone: '', password: '' })
  const [error, setError]   = useState('')
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
    } catch(err) {
      setError(err.response?.data?.error || 'Login failed')
    }
    setLoading(false)
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError('')
    setLoading(true)
    try {
      var res = await api.post('/auth/google', { credential: credentialResponse.credential })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    } catch(err) {
      setError(err.response?.data?.error || 'Google login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 40%, #6B21A8 70%, #F59E0B 100%)',
    }}>
      {/* Left — Branding */}
      <div className="hide-mobile" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 60,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, margin: '0 auto 24px',
            boxShadow: '0 12px 32px rgba(245,158,11,0.4)',
          }}>🏪</div>
          <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 8 }}>
            NukkadMarket
          </h1>
          <p style={{
            fontSize: 18, fontWeight: 700, marginBottom: 40,
            background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Apna Nukkad, Apna Bazaar
          </p>

          {[
            { icon: '🇮🇳', text: '100+ cities across India' },
            { icon: '✅', text: 'Verified sellers only' },
            { icon: '🔒', text: 'Safe & secure platform' },
            { icon: '🚀', text: '100% free — always' },
          ].map(function(item) {
            return (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 16, textAlign: 'left',
              }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 600 }}>{item.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        width: '100%', maxWidth: 480, background: 'white',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 56px)',
        borderRadius: '32px 0 0 32px',
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>👋</div>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
            Welcome Back!
          </h2>
          <p style={{ color: '#6B7280', fontSize: 15 }}>
            Apne NukkadMarket account mein login karo
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1.5px solid #FCA5A5',
            borderRadius: 12, padding: '12px 16px',
            color: '#DC2626', marginBottom: 20, fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📱 Mobile Number</label>
            <input
              className="form-control"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={function(e) { setForm(function(f) { return { ...f, phone: e.target.value } }) }}
              maxLength={10}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ margin: 0 }}>🔒 Password</label>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#6B21A8', fontWeight: 700 }}>
                Forgot?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={form.password}
                onChange={function(e) { setForm(function(f) { return { ...f, password: e.target.value } }) }}
                style={{ paddingRight: 48 }}
              />
              <button type="button"
                onClick={function() { setShowPass(function(s) { return !s }) }}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: 0.5,
                }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          {/* Sirf production pe Google login dikhao */}
{window.location.hostname === 'delhincr-market.vercel.app' && (
  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => setError('Google login failed')}
      theme="outline" size="large" shape="pill" text="signin_with"
    />
  </div>
)}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginBottom: 16 }}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>ya seedha</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={function() { setError('Google login failed') }}
            theme="outline" size="large" shape="pill" text="signin_with"
          />
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280' }}>
          Account nahi hai?{' '}
          <Link to="/register" style={{ color: '#6B21A8', fontWeight: 800 }}>Register karo</Link>
        </p>
      </div>
    </div>
  )
}