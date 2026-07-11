import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Verification() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [status, setStatus]     = useState(null)
  const [tab, setTab]           = useState('overview')
  const [phone, setPhone]       = useState('')
  const [phoneOtp, setPhoneOtp] = useState(['','','','','',''])
  const [step, setStep]         = useState(1)
  const [idType, setIdType]     = useState('aadhaar')
  const [idNumber, setIdNumber] = useState('')
  const [idImage, setIdImage]   = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState('')
  const [error, setError]       = useState('')

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    fetchStatus()
  }, [user])

  async function fetchStatus() {
    try {
      var res = await api.get('/verification/status')
      setStatus(res.data)
    } catch(e) {}
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  function handleOtpChange(i, v) {
    if (!/^\d*$/.test(v)) return
    var newOtp = [...phoneOtp]; newOtp[i] = v; setPhoneOtp(newOtp)
    if (v && i < 5) document.getElementById('potp-' + (i + 1))?.focus()
  }

  async function sendPhoneOtp() {
    if (phone.length !== 10) { setError('Valid 10-digit number daalo'); return }
    setError(''); setLoading(true)
    try {
      await api.post('/phone-otp/send', { phone })
      setStep(2)
      showToast('✅ OTP bheja gaya +91' + phone + ' pe')
    } catch(err) { setError(err.response?.data?.error || 'Failed') }
    setLoading(false)
  }

  async function verifyPhoneOtp() {
    var otpStr = phoneOtp.join('')
    if (otpStr.length !== 6) { setError('6 digit OTP daalo'); return }
    setError(''); setLoading(true)
    try {
      await api.post('/phone-otp/verify', { phone, otp: otpStr })
      showToast('🎉 Phone verified! Badge mil gaya!')
      fetchStatus()
      setStep(1)
    } catch(err) { setError(err.response?.data?.error || 'Galat OTP') }
    setLoading(false)
  }

  async function handleIdImageUpload(e) {
    var file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      var fd = new FormData()
      fd.append('images', file)
      var res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/upload/images', { method: 'POST', body: fd })
      var data = await res.json()
      if (data.urls?.[0]) setIdImage(data.urls[0])
    } catch(e) { setError('Upload failed') }
    setUploading(false)
  }

  async function submitIdVerification() {
    if (!idNumber.trim() || !idImage) { setError('ID number aur photo dono zaroori hain'); return }
    setError(''); setLoading(true)
    try {
      await api.post('/verification/submit', { idType, idNumber, idImageUrl: idImage })
      showToast('✅ Documents submit ho gaye! 24-48 ghante mein verify hoga.')
      fetchStatus()
    } catch(err) { setError(err.response?.data?.error || 'Failed') }
    setLoading(false)
  }

  if (!user) return null

  var idTypes = [
    { id: 'aadhaar',         label: '🪪 Aadhaar Card',     hint: '12-digit Aadhaar number' },
    { id: 'pan',             label: '💳 PAN Card',         hint: 'ABCDE1234F format' },
    { id: 'driving_license', label: '🚗 Driving License',  hint: 'License number' },
    { id: 'voter_id',        label: '🗳️ Voter ID',         hint: 'Voter ID number' },
    { id: 'passport',        label: '📘 Passport',         hint: 'Passport number' },
  ]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1F2937', color: 'white', padding: '12px 24px', borderRadius: 99, fontSize: 14, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', padding: '32px 16px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div className="container">
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 4 }}>
            🛡️ Get Verified
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            Verified badge se buyers/sellers ka trust badhega
          </p>

          {/* Status badges */}
          {status && (
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <div style={{ background: status.isPhoneVerified ? 'rgba(5,150,105,0.3)' : 'rgba(255,255,255,0.1)', border: '1px solid ' + (status.isPhoneVerified ? 'rgba(5,150,105,0.5)' : 'rgba(255,255,255,0.2)'), borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: status.isPhoneVerified ? '#6EE7B7' : 'rgba(255,255,255,0.6)' }}>
                {status.isPhoneVerified ? '✅ Phone Verified' : '⏳ Phone Not Verified'}
              </div>
              <div style={{ background: status.isVerified ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)', border: '1px solid ' + (status.isVerified ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.2)'), borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: status.isVerified ? '#FCD34D' : 'rgba(255,255,255,0.6)' }}>
                {status.isVerified ? '🏅 ID Verified' : status.idVerification?.status === 'pending' ? '⏳ ID Review Pending' : '❌ ID Not Verified'}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: -16, paddingBottom: 48 }}>

        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: 16, padding: 6, display: 'flex', gap: 4, marginBottom: 24, boxShadow: '0 4px 16px rgba(107,33,168,0.08)' }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'phone',    label: '📱 Phone Verify' },
            { id: 'id',       label: '🪪 ID Verify' },
          ].map(function(t) {
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 700,
                background: tab === t.id ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : 'transparent',
                color: tab === t.id ? 'white' : '#6B7280',
                transition: 'all 0.2s',
                boxShadow: tab === t.id ? '0 4px 12px rgba(107,33,168,0.3)' : 'none',
              }}>
                {t.label}
              </button>
            )
          })}
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 14, padding: '12px 16px', color: '#DC2626', marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

              {/* Phone Badge */}
              <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)', border: '2px solid ' + (status?.isPhoneVerified ? '#059669' : '#E5E7EB') }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Phone Verified</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>SMS OTP se phone number verify karo. Turant milta hai.</div>
                {status?.isPhoneVerified ? (
                  <div style={{ background: '#ECFDF5', color: '#059669', borderRadius: 99, padding: '8px 16px', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                    ✅ Verified!
                  </div>
                ) : (
                  <button onClick={() => setTab('phone')} className="btn btn-primary btn-full">
                    Verify Now →
                  </button>
                )}
              </div>

              {/* ID Badge */}
              <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)', border: '2px solid ' + (status?.isVerified ? '#F59E0B' : '#E5E7EB') }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>ID Verified</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Aadhaar/PAN se verify karo. Admin 24-48 hr mein approve karega.</div>
                {status?.isVerified ? (
                  <div style={{ background: '#FFFBEB', color: '#D97706', borderRadius: 99, padding: '8px 16px', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                    🏅 Verified!
                  </div>
                ) : status?.idVerification?.status === 'pending' ? (
                  <div style={{ background: '#FFFBEB', color: '#D97706', borderRadius: 99, padding: '8px 16px', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                    ⏳ Review Pending...
                  </div>
                ) : status?.idVerification?.status === 'rejected' ? (
                  <div>
                    <div style={{ background: '#FEF2F2', color: '#DC2626', borderRadius: 12, padding: '10px', fontSize: 12, marginBottom: 10 }}>
                      ❌ Rejected: {status.idVerification.rejectionReason}
                    </div>
                    <button onClick={() => setTab('id')} className="btn btn-primary btn-full">
                      Resubmit →
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setTab('id')} className="btn btn-gold btn-full">
                    Submit Documents →
                  </button>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', borderRadius: 20, padding: '24px' }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 16 }}>
                ✨ Verified Badge ke Fayde
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '🔝', text: 'Search mein top pe dikho' },
                  { icon: '💬', text: 'Zyada buyers contact karenge' },
                  { icon: '⚡', text: 'Fast deal — trust already hai' },
                  { icon: '🛡️', text: 'Fraud ke chance zero' },
                ].map(function(b) {
                  return (
                    <div key={b.text} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 20 }}>{b.icon}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{b.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PHONE VERIFY TAB ── */}
        {tab === 'phone' && (
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '32px', boxShadow: '0 8px 32px rgba(107,33,168,0.08)' }}>

              {status?.isPhoneVerified ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#059669' }}>Phone Verified!</h3>
                  <p style={{ color: '#6B7280', marginTop: 8 }}>Aapka phone number successfully verify ho gaya hai.</p>
                </div>
              ) : step === 1 ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📱</div>
                    <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800 }}>Phone Verify Karo</h3>
                    <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>SMS OTP aapke phone pe bheja jaayega</p>
                  </div>
                  <div className="form-group">
                    <label>📱 Mobile Number</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#374151' }}>+91</div>
                      <input className="form-control" type="tel" placeholder="10-digit number" value={phone}
                        onChange={e => { var v = e.target.value.replace(/\D/g, ''); if (v.length <= 10) setPhone(v) }}
                        style={{ paddingLeft: 52 }} maxLength={10} />
                      {phone.length === 10 && <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#059669' }}>✓</div>}
                    </div>
                  </div>
                  <button onClick={sendPhoneOtp} disabled={loading || phone.length !== 10} className="btn btn-primary btn-full btn-lg">
                    {loading ? '⏳ Sending...' : '📤 Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
                    <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800 }}>OTP Enter Karo</h3>
                    <p style={{ color: '#6B7280', fontSize: 14 }}>+91 {phone} pe bheja gaya</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                    {phoneOtp.map(function(digit, i) {
                      return (
                        <input key={i} id={'potp-' + i} type="text" maxLength={1} value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => { if (e.key === 'Backspace' && !digit && i > 0) document.getElementById('potp-' + (i-1))?.focus() }}
                          style={{ width: 46, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 800, border: '2px solid ' + (digit ? '#6B21A8' : '#E5E7EB'), borderRadius: 12, outline: 'none', background: digit ? '#F5F3FF' : 'white', color: '#6B21A8', fontFamily: 'Nunito, sans-serif' }}
                        />
                      )
                    })}
                  </div>
                  <button onClick={verifyPhoneOtp} disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginBottom: 12 }}>
                    {loading ? '⏳ Verifying...' : '✅ Verify OTP'}
                  </button>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => { setStep(1); setPhoneOtp(['','','','','','']) }} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>← Back</button>
                    <button onClick={sendPhoneOtp} style={{ background: 'none', border: 'none', color: '#6B21A8', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>🔄 Resend OTP</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── ID VERIFY TAB ── */}
        {tab === 'id' && (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {status?.isVerified ? (
              <div style={{ background: 'white', borderRadius: 24, padding: '48px', textAlign: 'center', boxShadow: '0 8px 32px rgba(107,33,168,0.08)' }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>🏅</div>
                <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#D97706' }}>ID Verified!</h3>
                <p style={{ color: '#6B7280', marginTop: 8 }}>Aapki identity successfully verify ho gayi hai.</p>
              </div>
            ) : status?.idVerification?.status === 'pending' ? (
              <div style={{ background: 'white', borderRadius: 24, padding: '48px', textAlign: 'center', boxShadow: '0 8px 32px rgba(107,33,168,0.08)' }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>⏳</div>
                <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#D97706' }}>Review Pending</h3>
                <p style={{ color: '#6B7280', marginTop: 8 }}>Documents submit ho gaye. Admin 24-48 ghante mein verify karega.</p>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 24, padding: '32px', boxShadow: '0 8px 32px rgba(107,33,168,0.08)' }}>
                <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🪪 ID Verification</h3>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>Government ID se verify karo — 24-48 hr mein admin approve karega</p>

                <div className="form-group">
                  <label>📋 ID Type Select Karo *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {idTypes.map(function(t) {
                      return (
                        <div key={t.id} onClick={() => setIdType(t.id)} style={{ padding: '12px', borderRadius: 12, border: '2px solid ' + (idType === t.id ? '#6B21A8' : '#E5E7EB'), cursor: 'pointer', background: idType === t.id ? '#F5F3FF' : 'white', transition: 'all 0.2s' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: idType === t.id ? '#6B21A8' : '#374151' }}>{t.label}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{t.hint}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label>🔢 ID Number *</label>
                  <input className="form-control" placeholder={idTypes.find(t => t.id === idType)?.hint || 'ID number'} value={idNumber}
                    onChange={e => setIdNumber(e.target.value.toUpperCase())} />
                </div>

                <div className="form-group">
                  <label>📸 ID Card Photo Upload Karo *</label>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Front side clear photo — max 5MB, JPG/PNG</div>
                  {idImage ? (
                    <div style={{ position: 'relative', marginBottom: 12 }}>
                      <img src={idImage} alt="ID" style={{ width: '100%', borderRadius: 12, border: '2px solid #6B21A8' }} />
                      <button onClick={() => setIdImage('')} style={{ position: 'absolute', top: 8, right: 8, background: '#DC2626', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
                    </div>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', border: '2px dashed #D1D5DB', borderRadius: 14, cursor: 'pointer', background: '#F9FAFB', transition: 'all 0.2s' }}>
                      <span style={{ fontSize: 36, marginBottom: 8 }}>{uploading ? '⏳' : '📷'}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{uploading ? 'Uploading...' : 'Click to Upload ID Photo'}</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleIdImageUpload} disabled={uploading} />
                    </label>
                  )}
                </div>

                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#92400E' }}>
                  🔒 Aapka data secure hai — sirf verification ke liye use hoga, kisi ke saath share nahi hoga.
                </div>

                <button onClick={submitIdVerification} disabled={loading || !idNumber || !idImage} className="btn btn-gold btn-full btn-lg">
                  {loading ? '⏳ Submitting...' : '📤 Submit for Verification'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}