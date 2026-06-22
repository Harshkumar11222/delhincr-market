import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { INDIA_CITIES, CATEGORIES } from '../data/india'

const conditions = ['Like New', 'Good', 'Fair', 'For Parts']

export default function Post() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', price: '', isNegotiable: false,
    category: '', condition: 'Good', location: '', city: '', phone: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  if (!user) { navigate('/login'); return null }

  async function handleUpload(e) {
    var files = Array.from(e.target.files)
    if (!files.length) return
    if (images.length + files.length > 5) { setError('Max 5 photos allowed'); return }
    setUploading(true)
    try {
      var fd = new FormData()
      files.forEach(f => fd.append('images', f))
      var res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/upload/images', { method: 'POST', body: fd })
      var data = await res.json()
      if (data.urls) setImages(p => [...p, ...data.urls])
    } catch(e) { setError('Upload failed') }
    setUploading(false)
  }

  async function handleSubmit() {
    setError('')
    if (!form.title || !form.price || !form.category || !form.city || !form.phone) { setError('Sab required fields fill karo'); return }
    if (images.length === 0) { setError('Photo upload karna zaroori hai'); return }  // ← yeh line add karo

    if (form.phone.length !== 10 || !/^[6-9]\d{9}$/.test(form.phone)) { setError('Valid 10-digit phone number daalo'); return }
    setPosting(true)
    try {
      await api.post('/listings', { ...form, price: parseInt(form.price), images, sellerPhone: form.phone, sellerName: user.name })
      navigate('/browse')
    } catch(err) { setError(err.response?.data?.error || 'Post failed') }
    setPosting(false)
  }

  var steps = ['Category', 'Details', 'Photos', 'Preview']

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', padding: '24px 16px 32px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 4 }}>
            ➕ Post Free Ad
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Crores of buyers tak pahuncho — bilkul free</p>

          {/* Step Progress */}
          <div style={{ display: 'flex', gap: 0, marginTop: 20 }}>
            {steps.map(function(s, i) {
              return (
                <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800,
                      background: step > i + 1 ? '#F59E0B' : step === i + 1 ? 'white' : 'rgba(255,255,255,0.2)',
                      color: step > i + 1 ? 'white' : step === i + 1 ? '#6B21A8' : 'rgba(255,255,255,0.5)',
                      marginBottom: 4,
                    }}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    <div style={{ fontSize: 10, color: step >= i + 1 ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{s}</div>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#F59E0B' : 'rgba(255,255,255,0.2)', marginBottom: 20 }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 14, padding: '14px 18px', color: '#DC2626', marginBottom: 20, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
              <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 16 }}>✕</button>
            </div>
          )}

          {/* STEP 1 — Category */}
          {step === 1 && (
            <div style={{ background: 'white', borderRadius: 24, padding: '28px', boxShadow: '0 4px 20px rgba(107,33,168,0.08)' }}>
              <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>📦 Category Choose Karo</h3>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>Apne item ki sahi category select karo</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                {CATEGORIES.filter(c => c.id !== 'all').map(function(cat) {
                  return (
                    <div key={cat.id}
                      onClick={function() { set('category', cat.id); setStep(2) }}
                      style={{
                        padding: '18px 14px', borderRadius: 16, cursor: 'pointer', textAlign: 'center',
                        border: '2px solid ' + (form.category === cat.id ? '#6B21A8' : '#E5E7EB'),
                        background: form.category === cat.id ? '#F5F3FF' : 'white',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#6B21A8'; e.currentTarget.style.background = '#F5F3FF' }}
                      onMouseLeave={function(e) { if (form.category !== cat.id) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white' } }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{cat.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: form.category === cat.id ? '#6B21A8' : '#374151' }}>{cat.name}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2 — Details */}
          {step === 2 && (
            <div style={{ background: 'white', borderRadius: 24, padding: '28px', boxShadow: '0 4px 20px rgba(107,33,168,0.08)' }}>
              <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>📝 Ad Details</h3>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>Jitni zyada detail — utna zyada buyers</p>

              <div className="form-group">
                <label>📌 Ad Title *</label>
                <input className="form-control" placeholder="e.g. iPhone 13 Pro Max 256GB Pacific Blue" value={form.title} onChange={e => set('title', e.target.value)} maxLength={100} />
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{form.title.length}/100 characters</div>
              </div>

              <div className="form-group">
                <label>📖 Description</label>
                <textarea className="form-control" rows={4} placeholder="Item ki condition, age, specs, reason for selling — sab detail mein likho..." value={form.description} onChange={e => set('description', e.target.value)} maxLength={2000} />
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{form.description.length}/2000</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>💰 Price (₹) *</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#374151' }}>₹</div>
                    <input className="form-control" type="number" placeholder="0" value={form.price} onChange={e => set('price', e.target.value)} style={{ paddingLeft: 36 }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isNegotiable} onChange={e => set('isNegotiable', e.target.checked)} />
                    <span style={{ fontSize: 13, color: '#D97706', fontWeight: 600 }}>🤝 Negotiable</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>📦 Condition *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {conditions.map(function(c) {
                      return (
                        <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, border: '2px solid ' + (form.condition === c ? '#6B21A8' : '#E5E7EB'), background: form.condition === c ? '#F5F3FF' : 'white' }}>
                          <input type="radio" name="condition" value={c} checked={form.condition === c} onChange={() => set('condition', c)} style={{ display: 'none' }} />
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid ' + (form.condition === c ? '#6B21A8' : '#D1D5DB'), background: form.condition === c ? '#6B21A8' : 'white', flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: form.condition === c ? '#6B21A8' : '#374151' }}>{c}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>🏙️ City *</label>
                  <input className="form-control" list="cities" placeholder="Type your city..." value={form.city} onChange={e => set('city', e.target.value)} />
                  <datalist id="cities">{INDIA_CITIES.map(c => <option key={c} value={c} />)}</datalist>
                </div>
                <div className="form-group">
                  <label>📍 Area / Locality</label>
                  <input className="form-control" placeholder="Sector 62, Dwarka..." value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>📱 Contact Number * (+91)</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#374151', fontSize: 14 }}>+91</div>
                  <input className="form-control" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => { var v = e.target.value.replace(/\D/g, ''); if (v.length <= 10) set('phone', v) }} style={{ paddingLeft: 52 }} maxLength={10} />
                  {form.phone.length === 10 && <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#059669' }}>✓</div>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} className="btn btn-ghost btn-lg" style={{ flex: 1 }}>← Back</button>
                <button onClick={() => { if (!form.title || !form.price || !form.city || !form.phone) { setError('Sab fields fill karo'); return } setError(''); setStep(3) }} className="btn btn-primary btn-lg" style={{ flex: 2 }}>
                  Next: Add Photos →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Photos */}
          <div style={{ display: 'flex', gap: 12 }}>
  <button onClick={() => setStep(2)} className="btn btn-ghost btn-lg" style={{ flex: 1 }}>← Back</button>
  <button
    onClick={function() {
      if (images.length === 0) { setError('Kam se kam 1 photo upload karo — bina photo listing post nahi hogi'); return }
      setError('')
      setStep(4)
    }}
    className="btn btn-primary btn-lg" style={{ flex: 2 }}>
    Next: Preview →
  </button>
</div>

              {/* Upload Area */}
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '32px', border: '2px dashed ' + (uploading ? '#6B21A8' : '#D1D5DB'),
                borderRadius: 20, cursor: 'pointer', marginBottom: 16,
                background: uploading ? '#F5F3FF' : '#F9FAFB', transition: 'all 0.2s',
              }}
                onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#6B21A8'; e.currentTarget.style.background = '#F5F3FF' }}
                onMouseLeave={function(e) { if (!uploading) { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB' } }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>{uploading ? '⏳' : '📷'}</div>
                <div style={{ fontWeight: 700, color: '#374151', marginBottom: 4 }}>{uploading ? 'Uploading...' : 'Click to Upload Photos'}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>JPG, PNG, WebP • Max 5MB each • {images.length}/5 uploaded</div>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} disabled={uploading || images.length >= 5} />
              </label>

              {/* Preview Images */}
              {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20 }}>
                  {images.map(function(url, i) {
                    return (
                      <div key={i} style={{ position: 'relative', paddingTop: '100%', borderRadius: 12, overflow: 'hidden', border: i === 0 ? '3px solid #6B21A8' : '2px solid #E5E7EB' }}>
                        <img src={url} alt={i} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        {i === 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(107,33,168,0.8)', color: 'white', fontSize: 10, fontWeight: 700, padding: '4px', textAlign: 'center' }}>COVER</div>}
                        <button onClick={() => setImages(p => p.filter((_, idx) => idx !== i))}
                          style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220,38,38,0.9)', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              <div style={{ background: '#F5F3FF', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#6B21A8', display: 'flex', alignItems: 'center', gap: 8 }}>
                💡 <span>First photo cover image hogi. Zoom, rotate nahi kar sakte — seedhi clear photo lo.</span>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} className="btn btn-ghost btn-lg" style={{ flex: 1 }}>← Back</button>
                <button onClick={() => setStep(4)} className="btn btn-primary btn-lg" style={{ flex: 2 }}>
                  Next: Preview →
                </button>
              </div>
            </div>

          {/* STEP 4 — Preview & Post */}
          {step === 4 && (
            <div>
              <div style={{ background: 'white', borderRadius: 24, padding: '28px', boxShadow: '0 4px 20px rgba(107,33,168,0.08)', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>👀 Preview Karo</h3>

                {/* Preview Card */}
                <div style={{ border: '2px solid #E5E7EB', borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
                  {images.length > 0 && (
                    <div style={{ position: 'relative', paddingTop: '50%', background: '#F3F4F6' }}>
                      <img src={images[0]} alt="cover" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      {images.length > 1 && (
                        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>
                          +{images.length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{form.title || 'Your listing title'}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#6B21A8' }}>
                        ₹{parseInt(form.price || 0).toLocaleString('en-IN')}
                      </span>
                      {form.isNegotiable && <span style={{ background: '#FFFBEB', color: '#D97706', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>Negotiable</span>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { icon: '📦', label: 'Category', value: form.category },
                        { icon: '🔄', label: 'Condition', value: form.condition },
                        { icon: '🏙️', label: 'City', value: form.city },
                        { icon: '📱', label: 'Contact', value: '+91 ' + form.phone },
                      ].map(function(item) {
                        return (
                          <div key={item.label} style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px' }}>
                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{item.icon} {item.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginTop: 2 }}>{item.value || '—'}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div style={{ background: '#F0FDF4', borderRadius: 14, padding: '16px', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#059669', marginBottom: 10 }}>✅ Pre-Post Checklist</div>
                  {[
                    { ok: !!form.title, text: 'Title added' },
                    { ok: !!form.price, text: 'Price set' },
                    { ok: !!form.category, text: 'Category selected' },
                    { ok: !!form.city, text: 'City added' },
                    { ok: form.phone.length === 10, text: 'Phone number valid' },
                    { ok: images.length > 0, text: 'Photos uploaded' },
                    { ok: form.description.length > 20, text: 'Description added (recommended)' },
                  ].map(function(item) {
                    return (
                      <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 14 }}>{item.ok ? '✅' : '⚪'}</span>
                        <span style={{ fontSize: 13, color: item.ok ? '#059669' : '#9CA3AF', fontWeight: item.ok ? 600 : 400 }}>{item.text}</span>
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(3)} className="btn btn-ghost btn-lg" style={{ flex: 1 }}>← Back</button>
                  <button onClick={handleSubmit} disabled={posting} className="btn btn-gold btn-lg" style={{ flex: 2 }}>
                    {posting ? '⏳ Posting...' : '🚀 Post Ad Free!'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    
  )
}