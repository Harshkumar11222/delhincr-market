import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleOtpChange(i, v) {
    if (!/^\d*$/.test(v)) return
    var newOtp = [...otp]; newOtp[i] = v; setOtp(newOtp)
    if (v && i < 5) document.getElementById('fotp-' + (i + 1))?.focus()
  }
  function handleOtpKey(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById('fotp-' + (i - 1))?.focus()
  }

  async function handleSendOtp(e) {
    e.preventDefault(); setError('')
    if (!email) { setError('Email daalo'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setStep(2)
    } catch(err) { setError(err.response?.data?.error || 'Email nahi mila') }
    setLoading(false)
  }

  async function handleReset(e) {
    e.preventDefault(); setError('')
    var otpStr = otp.join('')
    if (otpStr.length !== 6) { setError('6 digit OTP daalo'); return }
    if (newPass.length < 6) { setError('Password min 6 characters'); return }
    if (newPass !== confirm) { setError('Passwords match nahi'); return }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, otp: otpStr, newPassword: newPass })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch(err) { setError(err.response?.data?.error || 'Reset failed') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 40%, #6B21A8 70%, #F59E0B 100%)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 28, padding: '40px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#059669', marginBottom: 8 }}>Password Reset!</h2>
            <p style={{ color: '#6B7280', marginBottom: 20 }}>Login page pe redirect ho raha hoon...</p>
            <div style={{ height: 4, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', background: 'linear-gradient(135deg, #6B21A8, #7C3AED)', animation: 'fillBar 2.5s linear forwards' }} />
            </div>
            <style>{`@keyframes fillBar { from{width:0} to{width:100%} }`}</style>
          </div>
        ) : (
          <>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #6B21A8, #7C3AED)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(107,33,168,0.3)' }}>🔑</div>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                {step === 1 ? 'Forgot Password?' : 'Reset Password'}
              </h2>
              <p style={{ color: '#6B7280', fontSize: 14 }}>
                {step === 1 ? 'Registered email pe OTP bhejenge' : 'OTP bheja gaya: ' + email}
              </p>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'linear-gradient(135deg, #6B21A8, #7C3AED)' }} />
              <div style={{ flex: 1, height: 4, borderRadius: 99, background: step >= 2 ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : '#E5E7EB', transition: 'all 0.4s' }} />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 12, padding: '12px 16px', color: '#DC2626', marginBottom: 20, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label>📧 Registered Email *</label>
                  <input className="form-control" type="email" placeholder="apni@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>📩 Usi email pe OTP aayega jo account mein hai</div>
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                  {loading ? '📧 Bhej raha hoon...' : '📧 Send OTP'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleReset}>
                <div className="form-group">
                  <label style={{ textAlign: 'center', display: 'block' }}>6-Digit OTP *</label>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
                    {otp.map(function(digit, i) {
                      return (
                        <input key={i} id={'fotp-' + i} type="text" maxLength={1} value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKey(i, e)}
                          style={{ width: 46, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 800, border: '2px solid ' + (digit ? '#6B21A8' : '#E5E7EB'), borderRadius: 12, outline: 'none', background: digit ? '#F5F3FF' : 'white', color: '#6B21A8', transition: 'all 0.2s', fontFamily: 'Nunito, sans-serif' }}
                        />
                      )
                    })}
                  </div>
                </div>
                <div className="form-group">
                  <label>🔒 New Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input className="form-control" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} style={{ paddingRight: 48 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: 0.5 }}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>🔒 Confirm Password *</label>
                  <input className="form-control" type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                  {confirm && newPass === confirm && <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 600 }}>✓ Passwords match</div>}
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginBottom: 12 }}>
                  {loading ? '⏳ Resetting...' : '🔐 Reset Password'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={() => { setStep(1); setOtp(['','','','','','']) }} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>← Back</button>
                  <button type="button" onClick={() => api.post('/auth/forgot-password', { email })} style={{ background: 'none', border: 'none', color: '#6B21A8', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>🔄 Resend OTP</button>
                </div>
              </form>
            )}

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
              Yaad aa gaya? <Link to="/login" style={{ color: '#6B21A8', fontWeight: 800 }}>Login karo</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}