import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { SERVICE_CATEGORIES } from '../data/india'

export default function Services() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeCity, setActiveCity] = useState('All India')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [posting, setPosting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '', category: 'plumber', description: '',
    priceFrom: '', priceTo: '', experience: '',
    location: '', city: '', phone: '',
  })

  var cities = ['All India', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Noida', 'Gurugram']

  useEffect(function() { fetchServices() }, [activeCategory, activeCity, search])

  async function fetchServices() {
    setLoading(true)
    try {
      var params = {}
      if (activeCategory !== 'all') params.category = activeCategory
      if (activeCity !== 'All India') params.city = activeCity
      if (search) params.search = search
      var res = await api.get('/services', { params })
      setServices(res.data.services || [])
    } catch(e) { setServices([]) }
    setLoading(false)
  }

  async function handleUpload(e) {
    var file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      var fd = new FormData()
      fd.append('images', file)
      var res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/upload/images', { method: 'POST', body: fd })
      var data = await res.json()
      if (data.urls?.[0]) setAvatar(data.urls[0])
    } catch(e) {}
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.phone || !form.city || !form.priceFrom) { setError('Sab required fields fill karo'); return }
    if (!user) { navigate('/login'); return }
    setPosting(true)
    try {
      await api.post('/services', { ...form, avatar, providerName: user.name, priceFrom: parseInt(form.priceFrom), priceTo: parseInt(form.priceTo) || 0, experience: parseInt(form.experience) || 0 })
      setSuccess(true)
      setShowForm(false)
      fetchServices()
    } catch(err) { setError(err.response?.data?.error || 'Post nahi hua') }
    setPosting(false)
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  var allCategories = [{ id: 'all', name: 'All Services', icon: '🔧' }, ...SERVICE_CATEGORIES]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 30%, #059669 100%)', padding: '36px 16px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(16,185,129,0.1)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.2)', borderRadius: 99, padding: '5px 14px', fontSize: 12, color: '#6EE7B7', fontWeight: 700, marginBottom: 12, border: '1px solid rgba(16,185,129,0.3)' }}>
                ✅ All Verified Professionals
              </div>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 6 }}>
                Local Services 🔧
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>
                Verified professionals • {services.length}+ available • Instant booking
              </p>
            </div>
            <button onClick={() => { if (!user) { navigate('/login'); return } setShowForm(!showForm) }}
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', border: 'none', borderRadius: 99, padding: '12px 24px', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
              ➕ List Your Service
            </button>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240, display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              <span style={{ padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 18 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchServices()}
                placeholder="Search plumber, electrician..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 14, padding: '12px 0', fontFamily: 'Nunito, sans-serif' }} />
            </div>
            <select value={activeCity} onChange={e => setActiveCity(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: 99, border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              {cities.map(c => <option key={c} value={c} style={{ color: '#111827' }}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -20, paddingBottom: 48 }}>

        {/* Service Category Grid */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px', marginBottom: 24, boxShadow: '0 4px 16px rgba(107,33,168,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
            {allCategories.map(function(cat) {
              return (
                <div key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  padding: '14px 8px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                  background: activeCategory === cat.id ? 'linear-gradient(135deg, #059669, #10B981)' : '#F9FAFB',
                  border: '2px solid ' + (activeCategory === cat.id ? '#059669' : 'transparent'),
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (activeCategory !== cat.id) { e.currentTarget.style.background = '#ECFDF5'; e.currentTarget.style.borderColor = '#059669' } }}
                  onMouseLeave={e => { if (activeCategory !== cat.id) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = 'transparent' } }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{cat.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: activeCategory === cat.id ? 'white' : '#374151' }}>{cat.name || cat.id}</div>
                  {cat.price && <div style={{ fontSize: 10, color: activeCategory === cat.id ? 'rgba(255,255,255,0.8)' : '#059669', fontWeight: 600, marginTop: 2 }}>from {cat.price}</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Post Service Form */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: 24, padding: '28px', marginBottom: 24, boxShadow: '0 8px 32px rgba(5,150,105,0.12)', border: '2px solid #A7F3D0' }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🔧 List Your Service</div>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>Free mein apni service list karo — verified badge milega!</p>

            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', color: '#DC2626', marginBottom: 16, fontSize: 13, fontWeight: 600 }}>⚠️ {error}</div>}
            {success && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '12px 16px', color: '#059669', marginBottom: 16, fontSize: 13, fontWeight: 700 }}>🎉 Service listed successfully!</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label>🏷️ Service Name *</label>
                  <input className="form-control" placeholder="e.g. Rajesh Plumbing Services" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>🔧 Category *</label>
                  <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                    {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>💰 Price From (₹) *</label>
                  <input className="form-control" type="number" placeholder="299" value={form.priceFrom} onChange={e => set('priceFrom', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>💰 Price To (₹)</label>
                  <input className="form-control" type="number" placeholder="2000" value={form.priceTo} onChange={e => set('priceTo', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>🏙️ City *</label>
                  <input className="form-control" placeholder="Delhi, Mumbai..." value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>📍 Area</label>
                  <input className="form-control" placeholder="Sector 62, Dwarka..." value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>📱 Phone *</label>
                  <input className="form-control" type="tel" placeholder="10-digit" value={form.phone} onChange={e => { var v = e.target.value.replace(/\D/g, ''); if (v.length <= 10) set('phone', v) }} maxLength={10} />
                </div>
                <div className="form-group">
                  <label>⭐ Experience (years)</label>
                  <input className="form-control" type="number" placeholder="5" value={form.experience} onChange={e => set('experience', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>📝 Description</label>
                <textarea className="form-control" rows={3} placeholder="Apni services detail mein describe karo..." value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="form-group">
                <label>📸 Profile Photo</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {avatar && <img src={avatar} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: '2px dashed #D1D5DB', borderRadius: 12, cursor: 'pointer', fontSize: 13, color: '#6B7280', fontWeight: 600 }}>
                    {uploading ? '⏳ Uploading...' : '📷 Upload Photo'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={posting} style={{ flex: 2, background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white', border: 'none', borderRadius: 99, padding: '14px', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
                  {posting ? '⏳ Listing...' : '✅ List My Service Free'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Results count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 600 }}>{services.length} professionals found</div>
          {activeCategory !== 'all' && (
            <button onClick={() => setActiveCategory('all')} className="btn btn-ghost btn-sm">✕ Clear Filter</button>
          )}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 20 }} />)}
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔧</div>
            <h3>Koi service nahi mili</h3>
            <p>Filter change karo ya apni service list karo!</p>
            <button className="btn btn-primary" style={{ marginTop: 16, background: 'linear-gradient(135deg, #059669, #10B981)' }} onClick={() => setActiveCategory('all')}>View All Services</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {services.map(function(s) {
              return (
                <div key={s._id} style={{ background: 'white', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 16px rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.08)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(5,150,105,0.16)'; e.currentTarget.style.borderColor = 'rgba(5,150,105,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(5,150,105,0.08)'; e.currentTarget.style.borderColor = 'rgba(5,150,105,0.08)' }}
                >
                  {/* Card Header */}
                  <div style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', padding: '20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <img src={s.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.providerName || 'Pro') + '&background=059669&color=fff&size=64'}
                      alt={s.providerName} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 12px rgba(5,150,105,0.3)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, color: '#111827' }}>{s.name}</div>
                        {s.isVerified && <span style={{ background: '#059669', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>✓</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#059669', fontWeight: 700, marginTop: 2 }}>{SERVICE_CATEGORIES.find(c => c.id === s.category)?.icon} {s.category?.replace('_', ' ')}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>by {s.providerName} • {s.experience || 0}+ yrs exp</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#059669' }}>₹{s.priceFrom}+</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>starting</div>
                    </div>
                  </div>

                  <div style={{ padding: '16px 20px' }}>
                    {/* Rating & Stats */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: '#F59E0B', fontSize: 16 }}>⭐</span>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>{s.rating?.toFixed(1) || '4.5'}</span>
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>({s.totalRatings || 0})</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>✅ {s.completedJobs || 0} jobs done</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>📍 {s.city}</div>
                    </div>

                    {/* Description */}
                    {s.description && (
                      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {s.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <a href={'tel:+91' + s.phone} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 99, background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
                        📞 Call Now
                      </a>
                      <a href={'https://wa.me/91' + s.phone + '?text=Hi ' + s.providerName + ', I found your service on NukkadMarket. Need ' + s.category + ' service.'} target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 99, background: 'white', color: '#059669', textDecoration: 'none', fontWeight: 700, fontSize: 13, border: '2px solid #059669' }}>
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}