import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [step, setStep]   = useState(1) // 1=form, 2=otp
  const [form, setForm]   = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [otp, setOtp]     = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [sending, setSending]   = useState(false)
  const [verified, setVerified] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Step 1 — Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.phone || !form.email || !form.password) {
      setError('Sab fields fill karo')
      return
    }
    if (form.phone.length !== 10) {
      setError('Valid 10-digit mobile number daalo')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimum 6 characters ka hona chahiye')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords match nahi kar rahe')
      return
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Valid email address daalo')
      return
    }

    setSending(true)
    try {
      await api.post('/otp/send', { email: form.email })
      setStep(2)
    } catch(err) {
      setError(err.response?.data?.error || 'OTP send nahi hua')
    }
    setSending(false)
  }

  // Step 2 — Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!otp || otp.length !== 6) {
      setError('6 digit OTP daalo')
      return
    }
    setLoading(true)
    try {
      await api.post('/otp/verify', { email: form.email, otp })
      setVerified(true)
      // Register karo
      await register(form.name, form.phone, form.email, form.password)
      navigate('/')
    } catch(err) {
      setError(err.response?.data?.error || 'OTP galat hai')
    }
    setLoading(false)
  }

  // Resend OTP
  const handleResend = async () => {
    setError('')
    setSending(true)
    try {
      await api.post('/otp/send', { email: form.email })
      setError('✅ OTP dobara bheja gaya!')
    } catch(err) {
      setError('Resend failed')
    }
    setSending(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      padding: 16,
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: '40px 32px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, background: '#FF6B35', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: 'white',
            fontFamily: 'Baloo 2, cursive', margin: '0 auto 12px',
          }}>D</div>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, color: '#111827', marginBottom: 4 }}>
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h2>
          <p style={{ color: '#6B7280', fontSize: 14 }}>
            {step === 1 ? 'Join Delhi NCR trusted marketplace' : 'OTP bheja gaya: ' + form.email}
          </p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <div style={{
            flex: 1, height: 4, borderRadius: 99,
            background: '#FF6B35',
          }} />
          <div style={{
            flex: 1, height: 4, borderRadius: 99,
            background: step === 2 ? '#FF6B35' : '#E5E7EB',
          }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: error.startsWith('✅') ? '#ECFDF5' : '#FEF2F2',
            border: '1px solid ' + (error.startsWith('✅') ? '#A7F3D0' : '#FCA5A5'),
            borderRadius: 10, padding: '10px 14px',
            color: error.startsWith('✅') ? '#065F46' : '#DC2626',
            marginBottom: 16, fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {/* STEP 1 — Registration Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Full Name *</label>
              <input className="form-control" placeholder="Rahul Sharma"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Mobile Number *</label>
              <input className="form-control" type="tel" placeholder="10-digit number"
                value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input className="form-control" type="email" placeholder="rahul@gmail.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                📧 Is email pe OTP aayega verification ke liye
              </div>
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input className="form-control" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input className="form-control" type="password" placeholder="Re-enter password"
                value={form.confirm} onChange={e => set('confirm', e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={sending}>
              {sending ? '📧 OTP Bhej raha hoon...' : '📧 Send OTP & Continue'}
            </button>
          </form>
        )}

        {/* STEP 2 — OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              background: '#FFF0EB', border: '2px solid #FF6B35',
              borderRadius: 12, padding: '16px', textAlign: 'center', marginBottom: 20,
            }}>
              <div style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>OTP bheja gaya</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{form.email}</div>
            </div>

            <div className="form-group">
              <label>6-Digit OTP *</label>
              <input
                className="form-control"
                type="number"
                placeholder="_ _ _ _ _ _"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                style={{ fontSize: 24, letterSpacing: 8, textAlign: 'center', fontWeight: 700 }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? '⏳ Verifying...' : '✅ Verify & Create Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 13, marginRight: 16 }}>
                ← Wapas jao
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={sending}
                style={{ background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                {sending ? 'Bhej raha hoon...' : '🔄 Resend OTP'}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
          Already account hai? <Link to="/login" style={{ color: '#FF6B35', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}