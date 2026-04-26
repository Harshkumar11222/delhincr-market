import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep]     = useState(1) // 1=email, 2=otp+newpass
  const [email, setEmail]   = useState('')
  const [otp, setOtp]       = useState('')
  const [newPass, setNewPass]   = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)

  // Step 1 — Email daalo, OTP bhejo
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Email daalo'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setStep(2)
    } catch(err) {
      setError(err.response?.data?.error || 'OTP send nahi hua')
    }
    setLoading(false)
  }

  // Step 2 — OTP verify + new password set
  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (!otp || otp.length !== 6) { setError('6 digit OTP daalo'); return }
    if (!newPass || newPass.length < 6) { setError('Password min 6 characters'); return }
    if (newPass !== confirm) { setError('Passwords match nahi kar rahe'); return }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword: newPass })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch(err) {
      setError(err.response?.data?.error || 'Password reset nahi hua')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '40px 32px', textAlign: 'center', maxWidth: 400, width: '100%' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', marginBottom: 8 }}>Password Reset Ho Gaya!</h2>
          <p style={{ color: '#6B7280' }}>Login page pe redirect ho raha hoon...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '40px 32px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: '#FF6B35', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'Baloo 2, cursive', margin: '0 auto 12px' }}>D</div>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, color: '#111827', marginBottom: 4 }}>
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>
          <p style={{ color: '#6B7280', fontSize: 14 }}>
            {step === 1 ? 'Email pe OTP bhejenge' : 'OTP aaya: ' + email}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 99, background: '#FF6B35' }} />
          <div style={{ flex: 1, height: 4, borderRadius: 99, background: step === 2 ? '#FF6B35' : '#E5E7EB' }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', color: '#DC2626', marginBottom: 16, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1 — Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Registered Email *</label>
              <input
                className="form-control"
                type="email"
                placeholder="apni@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                📧 Usi email pe OTP aayega jo registration mein dali thi
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? '📧 Bhej raha hoon...' : '📧 Send OTP'}
            </button>
          </form>
        )}

        {/* STEP 2 — OTP + New Password */}
        {step === 2 && (
          <form onSubmit={handleReset}>
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
            <div className="form-group">
              <label>Naya Password *</label>
              <input
                className="form-control"
                type="password"
                placeholder="Min 6 characters"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                className="form-control"
                type="password"
                placeholder="Dobara likho"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? '⏳ Reset ho raha hai...' : '🔐 Reset Password'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button type="button" onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 13 }}>
                ← Wapas jao
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
          Yaad aa gaya? <Link to="/login" style={{ color: '#FF6B35', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}