import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const types = [
  { id: 'all',    name: 'All',    icon: '🚗' },
  { id: 'car',    name: 'Car',    icon: '🚗' },
  { id: 'bike',   name: 'Bike',   icon: '🏍️' },
  { id: 'scooty', name: 'Scooty', icon: '🛵' },
  { id: 'cycle',  name: 'Cycle',  icon: '🚲' },
]

const cities = ['All Cities', 'Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad']

export default function Rentals() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [rentals, setRentals]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeType, setActiveType] = useState('all')
  const [activeCity, setActiveCity] = useState('All Cities')
  const [search, setSearch]         = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [images, setImages]         = useState([])
  const [form, setForm] = useState({
    title: '', type: 'car', brand: '', model: '', year: '2022',
    description: '', pricePerDay: '', pricePerHour: '',
    location: '', city: 'Delhi', ownerPhone: '',
    features: [],
  })
  const [posting, setPosting]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  useEffect(function() { fetchRentals() }, [activeType, activeCity])

  async function fetchRentals() {
    setLoading(true)
    try {
      var params = {}
      if (activeType !== 'all')       params.type = activeType
      if (activeCity !== 'All Cities') params.city = activeCity
      if (search) params.search = search
      var res = await api.get('/rentals', { params })
      setRentals(res.data.rentals || [])
    } catch(err) { setRentals([]) }
    setLoading(false)
  }

  async function handleUpload(e) {
    var files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      var formData = new FormData()
      files.forEach(function(f) { formData.append('images', f) })
      var res = await fetch(
        (process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/upload/images',
        { method: 'POST', body: formData }
      )
      var data = await res.json()
      if (data.urls) setImages(function(prev) { return [...prev, ...data.urls] })
    } catch(err) { setError('Upload failed') }
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.ownerPhone || form.ownerPhone.length !== 10) {
      setError('Valid 10-digit phone number daalo')
      return
    }
    setPosting(true)
    try {
      await api.post('/rentals', { ...form, images })
      setSuccess(true)
      setShowForm(false)
      fetchRentals()
    } catch(err) {
      setError(err.response?.data?.error || 'Post nahi hua')
    }
    setPosting(false)
  }

  var set = function(k, v) { setForm(function(f) { return { ...f, [k]: v } }) }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '28px 16px 24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
          🚗 Vehicle Rentals
        </div>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 8 }}>
          Rent Karo, Ghoom Phiro! 🛵
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 20 }}>
          Car • Bike • Scooty • Cycle — Delhi NCR mein
        </p>

        {/* Search */}
        <div style={{ maxWidth: 500, margin: '0 auto 16px', display: 'flex', background: 'white', borderRadius: 99, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <span style={{ padding: '0 14px', fontSize: 18, display: 'flex', alignItems: 'center' }}>🔍</span>
          <input
            value={search}
            onChange={function(e) { setSearch(e.target.value) }}
            onKeyDown={function(e) { if (e.key === 'Enter') fetchRentals() }}
            placeholder="Search car, bike, scooty..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: 'Nunito, sans-serif', padding: '12px 0' }}
          />
          <button onClick={fetchRentals} style={{ background: '#FF6B35', color: 'white', border: 'none', padding: '0 20px', fontWeight: 700, cursor: 'pointer' }}>
            Search
          </button>
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {types.map(function(t) {
            return (
              <span key={t.id}
                onClick={function() { setActiveType(t.id) }}
                style={{
                  padding: '6px 16px', borderRadius: 99, cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  background: activeType === t.id ? '#FF6B35' : 'rgba(255,255,255,0.15)',
                  color: 'white', border: activeType === t.id ? 'none' : '1px solid rgba(255,255,255,0.3)',
                }}>
                {t.icon} {t.name}
              </span>
            )
          })}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20 }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 600 }}>{rentals.length} vehicles available</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select value={activeCity} onChange={function(e) { setActiveCity(e.target.value) }}
              className="form-control" style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}>
              {cities.map(function(c) { return <option key={c}>{c}</option> })}
            </select>
            <button
              onClick={function() {
                if (!user) { navigate('/login'); return }
                setShowForm(function(f) { return !f })
              }}
              style={{
                background: '#FF6B35', color: 'white', border: 'none',
                borderRadius: 99, padding: '8px 18px', fontWeight: 700,
                fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              }}>
              + List Vehicle
            </button>
          </div>
        </div>

        {/* Post Form */}
        {showForm && (
          <div style={{
            background: 'white', borderRadius: 20, padding: '24px',
            marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '2px solid #FF6B35',
          }}>
            <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, marginBottom: 16 }}>
              🚗 Apna Vehicle List Karo
            </h3>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', color: '#DC2626', marginBottom: 16, fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                <div className="form-group">
                  <label>Vehicle Title *</label>
                  <input className="form-control" placeholder="e.g. Honda Activa 6G" value={form.title} onChange={function(e) { set('title', e.target.value) }} />
                </div>

                <div className="form-group">
                  <label>Type *</label>
                  <select className="form-control" value={form.type} onChange={function(e) { set('type', e.target.value) }}>
                    <option value="car">🚗 Car</option>
                    <option value="bike">🏍️ Bike</option>
                    <option value="scooty">🛵 Scooty</option>
                    <option value="cycle">🚲 Cycle</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <input className="form-control" placeholder="Honda, Maruti, Hero..." value={form.brand} onChange={function(e) { set('brand', e.target.value) }} />
                </div>

                <div className="form-group">
                  <label>Model</label>
                  <input className="form-control" placeholder="Activa, Swift, Splendor..." value={form.model} onChange={function(e) { set('model', e.target.value) }} />
                </div>

                <div className="form-group">
                  <label>Price per Day (₹) *</label>
                  <input className="form-control" type="number" placeholder="500" value={form.pricePerDay} onChange={function(e) { set('pricePerDay', e.target.value) }} />
                </div>

                <div className="form-group">
                  <label>Price per Hour (₹)</label>
                  <input className="form-control" type="number" placeholder="100" value={form.pricePerHour} onChange={function(e) { set('pricePerHour', e.target.value) }} />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <select className="form-control" value={form.city} onChange={function(e) { set('city', e.target.value) }}>
                    {['Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad'].map(function(c) { return <option key={c}>{c}</option> })}
                  </select>
                </div>

                <div className="form-group">
                  <label>Area / Location *</label>
                  <input className="form-control" placeholder="Sector 62, Dwarka..." value={form.location} onChange={function(e) { set('location', e.target.value) }} />
                </div>

                <div className="form-group">
                  <label>Owner Phone * (+91)</label>
                  <input className="form-control" type="tel" placeholder="10-digit number" maxLength={10}
                    value={form.ownerPhone}
                    onChange={function(e) {
                      var val = e.target.value.replace(/\D/g, '')
                      if (val.length <= 10) set('ownerPhone', val)
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input className="form-control" type="number" placeholder="2022" value={form.year} onChange={function(e) { set('year', e.target.value) }} />
                </div>

              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} placeholder="Vehicle ki condition, features, koi special info..." value={form.description} onChange={function(e) { set('description', e.target.value) }} />
              </div>

              {/* Features */}
              <div className="form-group">
                <label>Features (select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Helmet Included', 'AC', 'GPS', 'Insurance', 'Full Tank', 'Unlimited KM', 'Home Delivery', '24/7 Support'].map(function(f) {
                    return (
                      <span key={f}
                        onClick={function() {
                          setForm(function(prev) {
                            var features = prev.features.includes(f)
                              ? prev.features.filter(function(x) { return x !== f })
                              : [...prev.features, f]
                            return { ...prev, features }
                          })
                        }}
                        style={{
                          padding: '5px 12px', borderRadius: 99, cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                          background: form.features.includes(f) ? '#FF6B35' : '#F3F4F6',
                          color: form.features.includes(f) ? 'white' : '#374151',
                        }}>
                        {f}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label>Photos</label>
                {images.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {images.map(function(url, i) {
                      return (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={url} alt={i} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                          <button type="button"
                            onClick={function() { setImages(function(prev) { return prev.filter(function(_, idx) { return idx !== i }) }) }}
                            style={{ position: 'absolute', top: -6, right: -6, background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 11 }}>
                            ✕
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', border: '2px dashed #D1D5DB', borderRadius: 12, cursor: 'pointer', background: '#F9FAFB', color: '#6B7280', fontSize: 13, fontWeight: 600 }}>
                  📷 {uploading ? 'Uploading...' : 'Add Photos'}
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={posting}>
                  {posting ? '⏳ Posting...' : '🚗 List My Vehicle'}
                </button>
                <button type="button" className="btn btn-ghost btn-lg" onClick={function() { setShowForm(false) }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {success && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: '#065F46', fontSize: 14 }}>
            🎉 Vehicle listed successfully!
          </div>
        )}

        {/* Rentals Grid */}
        {loading ? (
          <div className="loader">⏳</div>
        ) : rentals.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🚗</div>
            <h3>Koi vehicle available nahi</h3>
            <p>Pehle vehicle list karo!</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={function() {
              if (!user) { navigate('/login'); return }
              setShowForm(true)
            }}>
              + List Vehicle
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, paddingBottom: 32 }}>
            {rentals.map(function(r) {
              var typeIcons = { car: '🚗', bike: '🏍️', scooty: '🛵', cycle: '🚲' }
              return (
                <div key={r._id} style={{
                  background: 'white', borderRadius: 20, overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6',
                  transition: 'all 0.25s',
                }}
                  onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.14)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', paddingTop: '60%', background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)', overflow: 'hidden' }}>
                    {r.images && r.images[0] ? (
                      <img src={r.images[0]} alt={r.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                        {typeIcons[r.type] || '🚗'}
                      </div>
                    )}
                    <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
                      {typeIcons[r.type]} {r.type?.toUpperCase()}
                    </span>
                    {r.isVerified && (
                      <span style={{ position: 'absolute', top: 10, right: 10, background: '#10B981', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99 }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{r.title}</div>
                    {r.brand && <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{r.brand} {r.model} • {r.year}</div>}

                    {/* Price */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 22, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>
                          ₹{(r.pricePerDay || 0).toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 12, color: '#6B7280' }}>/day</span>
                      </div>
                      {r.pricePerHour > 0 && (
                        <div>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>₹{r.pricePerHour}</span>
                          <span style={{ fontSize: 11, color: '#6B7280' }}>/hr</span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {r.features && r.features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                        {r.features.slice(0, 3).map(function(f) {
                          return (
                            <span key={f} style={{ fontSize: 10, padding: '2px 8px', background: '#EFF6FF', color: '#1E3A8A', borderRadius: 99, fontWeight: 600 }}>
                              {f}
                            </span>
                          )
                        })}
                        {r.features.length > 3 && (
                          <span style={{ fontSize: 10, padding: '2px 8px', background: '#F3F4F6', color: '#6B7280', borderRadius: 99 }}>
                            +{r.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14 }}>📍 {r.location}, {r.city}</div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a href={'tel:' + r.ownerPhone}
                        style={{ flex: 1, background: '#FF6B35', color: 'white', border: 'none', borderRadius: 99, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        📞 Call
                      </a>
                      <a href={'https://wa.me/91' + r.ownerPhone + '?text=Hi, I want to rent your ' + r.title + ' listed on DelhiNCR Market.'}
                        target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, background: '#10B981', color: 'white', border: 'none', borderRadius: 99, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
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