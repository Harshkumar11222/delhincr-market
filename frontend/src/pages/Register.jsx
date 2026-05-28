import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleOtpChange(i, v) {
    if (!/^\d*$/.test(v)) return
    var newOtp = [...otp]
    newOtp[i] = v
    setOtp(newOtp)
    if (v && i < 5) {
      document.getElementById('otp-' + (i + 1))?.focus()
    }
  }

  function handleOtpKey(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById('otp-' + (i - 1))?.focus()
    }
  }

  async function handleSendOtp(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.phone || !form.email || !form.password) { setError('Sab fields fill karo'); return }
    if (form.phone.length !== 10 || !/^[6-9]\d{9}$/.test(form.phone)) { setError('Valid Indian mobile number daalo'); return }
    if (form.password.length < 6) { setError('Password minimum 6 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords match nahi kar rahe'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Valid email daalo'); return }
    setSending(true)
    try {
      await api.post('/otp/send', { email: form.email })
      setStep(2)
    } catch(err) { setError(err.response?.data?.error || 'OTP send nahi hua') }
    setSending(false)
  }

  async function handleVerify(e) {
    e.preventDefault()
    var otpStr = otp.join('')
    if (otpStr.length !== 6) { setError('6 digit OTP daalo'); return }
    setLoading(true)
    try {
      await api.post('/otp/verify', { email: form.email, otp: otpStr })
      await register(form.name, form.phone, form.email, form.password)
      navigate('/')
    } catch(err) { setError(err.response?.data?.error || 'OTP galat hai') }
    setLoading(false)
  }

  async function handleGoogleSuccess(cr) {
    setError('')
    setLoading(true)
    try {
      var res = await api.post('/auth/google', { credential: cr.credential })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    } catch(err) { setError(err.response?.data?.error || 'Google signup failed') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 40%, #6B21A8 70%, #F59E0B 100%)' }}>

      {/* Left Branding */}
      <div className="hide-mobile" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 24px', boxShadow: '0 12px 32px rgba(245,158,11,0.4)' }}>🏪</div>
          <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 38, fontWeight: 800, color: 'white', marginBottom: 6 }}>NukkadMarket</h1>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 40, background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Apna Nukkad, Apna Bazaar
          </p>
          {[
            { icon: '🇮🇳', text: '100+ cities across India' },
            { icon: '🚀', text: 'Free listing — always' },
            { icon: '✅', text: 'Verified community' },
            { icon: '🔒', text: 'Safe & secure' },
          ].map(function(item) {
            return (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, textAlign: 'left' }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 600 }}>{item.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Form */}
      <div style={{ width: '100%', maxWidth: 500, background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(24px, 5vw, 56px)', borderRadius: '32px 0 0 32px' }}>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            {['Your Details', 'Verify Email'].map(function(s, i) {
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: step > i ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : step === i + 1 ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : '#E5E7EB', color: step >= i + 1 ? 'white' : '#9CA3AF' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: step >= i + 1 ? '#6B21A8' : '#9CA3AF' }}>{s}</span>
                </div>
              )
            })}
          </div>
          <div style={{ height: 4, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: step === 1 ? '50%' : '100%', background: 'linear-gradient(135deg, #6B21A8, #7C3AED)', borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
            {step === 1 ? '✨ Create Account' : '📧 Verify Email'}
          </h2>
          <p style={{ color: '#6B7280', fontSize: 14 }}>
            {step === 1 ? 'India ke #1 nukkad marketplace pe join karo' : 'OTP bheja gaya: ' + form.email}
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 12, padding: '12px 16px', color: '#DC2626', marginBottom: 20, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚠️ {error}
          </div>
        )}

        {step === 1 && (
          <>
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>👤 Full Name *</label>
                <input className="form-control" placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>📱 Mobile Number *</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: 16, fontSize: 14, fontWeight: 700, color: '#374151' }}>+91</div>
                  <input className="form-control" type="tel" placeholder="10-digit number" value={form.phone} onChange={e => { var v = e.target.value.replace(/\D/g, ''); if (v.length <= 10) set('phone', v) }} style={{ paddingLeft: 52 }} />
                  {form.phone.length === 10 && /^[6-9]\d{9}$/.test(form.phone) && (
                    <div style={{ position: 'absolute', right: 14, color: '#059669', fontSize: 16 }}>✓</div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>📧 Email Address *</label>
                <input className="form-control" type="email" placeholder="rahul@gmail.com" value={form.email} onChange={e => set('email', e.target.value)} />
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>📩 OTP verification ke liye</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>🔒 Password *</label>
                  <input className="form-control" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>🔒 Confirm *</label>
                  <input className="form-control" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={sending} style={{ marginBottom: 16 }}>
                {sending ? '📧 OTP Bhej raha hoon...' : '📧 Send OTP & Continue →'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
              <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>ya seedha</span>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google signup failed')} theme="outline" size="large" shape="pill" text="signup_with" />
            </div>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify}>
            <div style={{ background: '#F5F3FF', borderRadius: 16, padding: '16px', textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: '#6B21A8', fontWeight: 700 }}>OTP bheja gaya</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{form.email}</div>
            </div>

            <div className="form-group">
              <label style={{ textAlign: 'center', display: 'block' }}>6-Digit OTP *</label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                {otp.map(function(digit, i) {
                  return (
                    <input
                      key={i}
                      id={'otp-' + i}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={function(e) { handleOtpChange(i, e.target.value) }}
                      onKeyDown={function(e) { handleOtpKey(i, e) }}
                      style={{
                        width: 48, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 800,
                        border: '2px solid ' + (digit ? '#6B21A8' : '#E5E7EB'), borderRadius: 12,
                        outline: 'none', fontFamily: 'Nunito, sans-serif',
                        background: digit ? '#F5F3FF' : 'white',
                        color: '#6B21A8', transition: 'all 0.2s',
                      }}
                    />
                  )
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginBottom: 12 }}>
              {loading ? '⏳ Verifying...' : '✅ Verify & Create Account'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={() => { setStep(1); setOtp(['','','','','','']) }}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                ← Back
              </button>
              <button type="button" onClick={() => { setSending(true); api.post('/otp/send', { email: form.email }).then(() => setSending(false)) }}
                style={{ background: 'none', border: 'none', color: '#6B21A8', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                🔄 Resend OTP
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
          Already account hai? <Link to="/login" style={{ color: '#6B21A8', fontWeight: 800 }}>Login karo</Link>
        </p>
      </div>
    </div>
  )
}