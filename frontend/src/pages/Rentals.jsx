import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { INDIA_CITIES } from '../data/india'

var rentalTypes = [
  { id: 'all',    name: 'All Vehicles', icon: '🚗', count: '' },
  { id: 'car',    name: 'Cars',         icon: '🚗', desc: 'AC, comfortable' },
  { id: 'bike',   name: 'Bikes',        icon: '🏍️', desc: 'Fast & sporty' },
  { id: 'scooty', name: 'Scooty',       icon: '🛵', desc: 'Easy & light' },
  { id: 'cycle',  name: 'Cycles',       icon: '🚲', desc: 'Eco friendly' },
  { id: 'van',    name: 'Vans',         icon: '🚐', desc: 'Group travel' },
]

var features = ['Helmet Included', 'AC', 'GPS', 'Insurance', 'Full Tank', 'Unlimited KM', 'Home Delivery', '24/7 Support']

export default function Rentals() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [rentals, setRentals]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeType, setActiveType] = useState('all')
  const [citySearch, setCitySearch] = useState('')
  const [showCityDrop, setShowCityDrop] = useState(false)
  const [activeCity, setActiveCity] = useState('All India')
  const [search, setSearch]       = useState('')
  const [showForm, setShowForm]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages]       = useState([])
  const [posting, setPosting]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const [form, setForm] = useState({
    title: '', type: 'car', brand: '', model: '', year: '2022',
    description: '', pricePerDay: '', pricePerHour: '',
    location: '', city: 'Delhi', ownerPhone: '',
    features: [],
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  useEffect(function() { fetchRentals() }, [activeType, activeCity, search])

  async function fetchRentals() {
    setLoading(true)
    try {
      var params = {}
      if (activeType !== 'all') params.type = activeType
      if (activeCity !== 'All India') params.city = activeCity
      if (search) params.search = search
      var res = await api.get('/rentals', { params })
      setRentals(res.data.rentals || [])
    } catch(e) { setRentals([]) }
    setLoading(false)
  }

  async function handleUpload(e) {
    var files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      var fd = new FormData()
      files.forEach(f => fd.append('images', f))
      var res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/upload/images', { method: 'POST', body: fd })
      var data = await res.json()
      if (data.urls) setImages(p => [...p, ...data.urls])
    } catch(e) {}
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title || !form.pricePerDay || !form.city || !form.ownerPhone) { setError('Sab required fields fill karo'); return }
    if (form.ownerPhone.length !== 10) { setError('Valid 10-digit phone daalo'); return }
    if (!user) { navigate('/login'); return }
    setPosting(true)
    try {
      await api.post('/rentals', { ...form, images, pricePerDay: parseInt(form.pricePerDay), pricePerHour: parseInt(form.pricePerHour) || 0, year: parseInt(form.year) || 2022 })
      setSuccess(true)
      setShowForm(false)
      setImages([])
      fetchRentals()
    } catch(err) { setError(err.response?.data?.error || 'Post nahi hua') }
    setPosting(false)
  }

  var filteredCities = INDIA_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 8)

  var typeIcons = { car: '🚗', bike: '🏍️', scooty: '🛵', cycle: '🚲', van: '🚐' }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 30%, #DC2626 100%)', padding: '36px 16px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(220,38,38,0.1)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(220,38,38,0.2)', borderRadius: 99, padding: '5px 14px', fontSize: 12, color: '#FCA5A5', fontWeight: 700, marginBottom: 12, border: '1px solid rgba(220,38,38,0.3)' }}>
                🚗 Best Rental Rates in India
              </div>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 6 }}>
                Vehicle Rentals 🛵
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>
                Car • Bike • Scooty • Cycle — {rentals.length}+ vehicles available
              </p>
            </div>
            <button onClick={() => { if (!user) { navigate('/login'); return } setShowForm(!showForm) }}
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', border: 'none', borderRadius: 99, padding: '12px 24px', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
              ➕ List Your Vehicle
            </button>
          </div>

          {/* Search + City */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240, display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              <span style={{ padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 18 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchRentals()}
                placeholder="Search car, bike, scooty..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 14, padding: '12px 0', fontFamily: 'Nunito, sans-serif' }} />
            </div>
            {/* City Dropdown */}
            <div style={{ position: 'relative' }}>
              <input value={citySearch || activeCity}
                onChange={e => { setCitySearch(e.target.value); setShowCityDrop(true) }}
                onFocus={() => setShowCityDrop(true)}
                placeholder="Select city..."
                style={{ padding: '12px 16px', borderRadius: 99, border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', outline: 'none', minWidth: 140 }} />
              {showCityDrop && (
                <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'white', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 100, overflow: 'hidden' }}>
                  <div onClick={() => { setActiveCity('All India'); setCitySearch(''); setShowCityDrop(false) }}
                    style={{ padding: '12px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: '#DC2626', borderBottom: '1px solid #F3F4F6' }}>
                    🇮🇳 All India
                  </div>
                  {filteredCities.map(c => (
                    <div key={c} onClick={() => { setActiveCity(c); setCitySearch(c); setShowCityDrop(false) }}
                      style={{ padding: '10px 16px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #F3F4F6', color: '#374151' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      📍 {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -20, paddingBottom: 48 }}>

        {/* Type Filter Cards */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px', marginBottom: 24, boxShadow: '0 4px 16px rgba(220,38,38,0.08)' }}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {rentalTypes.map(function(t) {
              return (
                <div key={t.id} onClick={() => setActiveType(t.id)} style={{
                  flexShrink: 0, padding: '16px 20px', borderRadius: 16, cursor: 'pointer', textAlign: 'center', minWidth: 100,
                  background: activeType === t.id ? 'linear-gradient(135deg, #DC2626, #EF4444)' : '#F9FAFB',
                  border: '2px solid ' + (activeType === t.id ? '#DC2626' : 'transparent'),
                  transition: 'all 0.2s', boxShadow: activeType === t.id ? '0 4px 16px rgba(220,38,38,0.3)' : 'none',
                }}
                  onMouseEnter={e => { if (activeType !== t.id) { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#DC2626' } }}
                  onMouseLeave={e => { if (activeType !== t.id) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = 'transparent' } }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: activeType === t.id ? 'white' : '#374151' }}>{t.name}</div>
                  {t.desc && <div style={{ fontSize: 10, color: activeType === t.id ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginTop: 2 }}>{t.desc}</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Post Form */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: 24, padding: '28px', marginBottom: 24, boxShadow: '0 8px 32px rgba(220,38,38,0.12)', border: '2px solid #FECACA' }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🚗 List Your Vehicle</div>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>Free mein apna vehicle list karo — instantly live!</p>
            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', color: '#DC2626', marginBottom: 16, fontSize: 13, fontWeight: 600 }}>⚠️ {error}</div>}
            {success && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '12px 16px', color: '#059669', marginBottom: 16, fontSize: 13, fontWeight: 700 }}>🎉 Vehicle listed successfully!</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label>🚗 Vehicle Title *</label>
                  <input className="form-control" placeholder="e.g. Honda Activa 6G White" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>🏷️ Type *</label>
                  <select className="form-control" value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="car">🚗 Car</option>
                    <option value="bike">🏍️ Bike</option>
                    <option value="scooty">🛵 Scooty</option>
                    <option value="cycle">🚲 Cycle</option>
                    <option value="van">🚐 Van</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>🏢 Brand</label>
                  <input className="form-control" placeholder="Honda, Maruti, Hero..." value={form.brand} onChange={e => set('brand', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>📋 Model</label>
                  <input className="form-control" placeholder="Activa, Swift..." value={form.model} onChange={e => set('model', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>💰 Price/Day (₹) *</label>
                  <input className="form-control" type="number" placeholder="500" value={form.pricePerDay} onChange={e => set('pricePerDay', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>💰 Price/Hour (₹)</label>
                  <input className="form-control" type="number" placeholder="100" value={form.pricePerHour} onChange={e => set('pricePerHour', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>🏙️ City *</label>
                  <input className="form-control" list="rcities" placeholder="Delhi, Mumbai..." value={form.city} onChange={e => set('city', e.target.value)} />
                  <datalist id="rcities">{INDIA_CITIES.map(c => <option key={c} value={c} />)}</datalist>
                </div>
                <div className="form-group">
                  <label>📱 Owner Phone *</label>
                  <input className="form-control" type="tel" placeholder="10-digit" value={form.ownerPhone} onChange={e => { var v = e.target.value.replace(/\D/g, ''); if (v.length <= 10) set('ownerPhone', v) }} maxLength={10} />
                </div>
              </div>

              <div className="form-group">
                <label>📝 Description</label>
                <textarea className="form-control" rows={3} placeholder="Vehicle ki condition, features, available hours..." value={form.description} onChange={e => set('description', e.target.value)} />
              </div>

              {/* Features */}
              <div className="form-group">
                <label>✨ Features</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {features.map(f => (
                    <span key={f} onClick={() => setForm(p => ({ ...p, features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f] }))}
                      style={{ padding: '6px 14px', borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.2s', background: form.features.includes(f) ? '#DC2626' : '#F3F4F6', color: form.features.includes(f) ? 'white' : '#374151' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="form-group">
                <label>📸 Photos (max 5)</label>
                {images.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    {images.map((url, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={url} alt={i} style={{ width: 72, height: 60, objectFit: 'cover', borderRadius: 10 }} />
                        <button type="button" onClick={() => setImages(p => p.filter((_, idx) => idx !== i))}
                          style={{ position: 'absolute', top: -6, right: -6, background: '#DC2626', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 11 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', border: '2px dashed #D1D5DB', borderRadius: 14, cursor: 'pointer', background: '#F9FAFB', color: '#6B7280', fontSize: 13, fontWeight: 700 }}>
                  📷 {uploading ? 'Uploading...' : 'Add Vehicle Photos'}
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} disabled={uploading || images.length >= 5} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={posting} style={{ flex: 2, background: 'linear-gradient(135deg, #DC2626, #EF4444)', color: 'white', border: 'none', borderRadius: 99, padding: '14px', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(220,38,38,0.3)' }}>
                  {posting ? '⏳ Listing...' : '🚗 List My Vehicle Free'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Results */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 600 }}>{rentals.length} vehicles available</div>
          {activeType !== 'all' && <button onClick={() => setActiveType('all')} className="btn btn-ghost btn-sm">✕ Clear</button>}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 20 }} />)}
          </div>
        ) : rentals.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🚗</div>
            <h3>Koi vehicle nahi mili</h3>
            <p>Apna vehicle list karo — free mein!</p>
            <button style={{ marginTop: 16, background: 'linear-gradient(135deg, #DC2626, #EF4444)', color: 'white', border: 'none', borderRadius: 99, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }} onClick={() => { if (!user) { navigate('/login'); return } setShowForm(true) }}>
              ➕ List Vehicle
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {rentals.map(function(r) {
              return (
                <div key={r._id} style={{ background: 'white', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 16px rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.08)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(220,38,38,0.16)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.08)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.08)' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', paddingTop: '55%', background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)', overflow: 'hidden' }}>
                    {r.images?.[0] ? (
                      <img src={r.images[0]} alt={r.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
                        {typeIcons[r.type] || '🚗'}
                      </div>
                    )}
                    {/* Type Badge */}
                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {typeIcons[r.type]} {r.type?.toUpperCase()}
                    </div>
                    {r.isVerified && (
                      <div style={{ position: 'absolute', top: 12, right: 12, background: '#059669', color: 'white', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 99 }}>
                        ✓ Verified
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{r.title}</div>
                    {r.brand && <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 10 }}>{r.brand} {r.model} • {r.year}</div>}

                    {/* Price */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 12, alignItems: 'baseline' }}>
                      <div>
                        <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#DC2626' }}>₹{(r.pricePerDay || 0).toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>/day</span>
                      </div>
                      {r.pricePerHour > 0 && (
                        <div>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#6B7280' }}>₹{r.pricePerHour}</span>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>/hr</span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {r.features?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                        {r.features.slice(0, 3).map(f => (
                          <span key={f} style={{ fontSize: 10, padding: '3px 8px', background: '#FEF2F2', color: '#DC2626', borderRadius: 99, fontWeight: 700 }}>{f}</span>
                        ))}
                        {r.features.length > 3 && <span style={{ fontSize: 10, padding: '3px 8px', background: '#F3F4F6', color: '#9CA3AF', borderRadius: 99 }}>+{r.features.length - 3}</span>}
                      </div>
                    )}

                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14 }}>📍 {r.location ? r.location + ', ' : ''}{r.city}</div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <a href={'tel:+91' + r.ownerPhone} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 99, background: 'linear-gradient(135deg, #DC2626, #EF4444)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>
                        📞 Call Owner
                      </a>
                      <a href={'https://wa.me/91' + r.ownerPhone + '?text=Hi, I want to rent your ' + r.title + ' listed on NukkadMarket. Is it available?'} target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 99, background: 'white', color: '#DC2626', textDecoration: 'none', fontWeight: 700, fontSize: 13, border: '2px solid #DC2626' }}>
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