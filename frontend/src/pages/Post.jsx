import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const categories = [
  { id: 'electronics', name: 'Electronics 📱' },
  { id: 'vehicles',    name: 'Vehicles 🚗' },
  { id: 'furniture',   name: 'Furniture 🛋️' },
  { id: 'appliances',  name: 'Appliances 🏠' },
  { id: 'books',       name: 'Books 📚' },
  { id: 'clothing',    name: 'Clothing 👗' },
  { id: 'sports',      name: 'Sports ⚽' },
  { id: 'toys',        name: 'Toys 🧸' },
]

const cities = ['Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad']

export default function Post() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    title:        '',
    description:  '',
    price:        '',
    isNegotiable: false,
    category:     'electronics',
    condition:    'Good',
    location:     '',
    area:         '',
    city:         'Delhi',
  })

  const [images,    setImages]    = useState([])   // uploaded image URLs
  const [uploading, setUploading] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  // ─── Image Upload ───────────────────────────────────────────
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    if (images.length + files.length > 5) {
      setError('Maximum 5 photos allowed')
      return
    }
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('images', f))
      const res  = await fetch('http://localhost:5000/api/upload/images', {
        method: 'POST',
        body:   formData,
      })
      const data = await res.json()
      if (data.urls) {
        setImages(prev => [...prev, ...data.urls])
      } else {
        setError('Upload failed — try again')
      }
    } catch {
      setError('Image upload failed — backend chal raha hai?')
    }
    setUploading(false)
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // ─── Form Submit ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Title required hai')
      return
    }
    if (!form.price || isNaN(form.price) || parseInt(form.price) <= 0) {
      setError('Valid price daalo')
      return
    }
    if (!form.location.trim()) {
      setError('Location/Area required hai')
      return
    }

    setLoading(true)
    try {
      const payload = {
        title:        form.title.trim(),
        description:  form.description.trim(),
        price:        parseInt(form.price),
        isNegotiable: form.isNegotiable,
        category:     form.category,
        condition:    form.condition,
        location:     form.location.trim(),
        area:         form.area.trim(),
        city:         form.city,
        images:       images,   // ← actual uploaded URLs
      }

      const res = await api.post('/listings', payload)
      setSuccess(true)
      setTimeout(() => navigate('/listing/' + res.data.id), 1500)

    } catch (err) {
      if (!err.response) {
        setError('Backend connect nahi ho raha — server start karo')
      } else if (err.response.status === 401) {
        setError('Session expire ho gaya — dobara login karo')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(err.response?.data?.error || 'Ad post nahi hua — try again')
      }
    }
    setLoading(false)
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // ─── Login Guard ──────────────────────────────────────────────
  if (!user) {
    return (
      <div className="container" style={{ paddingTop: 100, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h2>Login Required</h2>
        <p style={{ color: '#6B7280', marginBottom: 20 }}>Ad post karne ke liye login karo</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
          Login Now
        </button>
      </div>
    )
  }

  // ─── Success Screen ───────────────────────────────────────────
  if (success) {
    return (
      <div className="container" style={{ paddingTop: 100, textAlign: 'center' }}>
        <div style={{ fontSize: 64 }}>🎉</div>
        <h2 style={{ fontFamily: 'Baloo 2, cursive' }}>Ad Posted!</h2>
        <p style={{ color: '#6B7280' }}>Redirecting to your listing...</p>
      </div>
    )
  }

  // ─── Main Form ────────────────────────────────────────────────
  return (
    <div className="container" style={{ paddingTop: 80, maxWidth: 600 }}>
      <div style={{ paddingTop: 20, paddingBottom: 40 }}>

        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, marginBottom: 4 }}>
          Post Your Ad
        </h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>
          Fill details to list your item for sale
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FCA5A5',
            borderRadius: 10, padding: '12px 16px',
            color: '#DC2626', marginBottom: 16, fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="form-group">
            <label>Item Title *</label>
            <input
              className="form-control"
              placeholder="e.g. iPhone 13 Pro Max 256GB"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category *</label>
            <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="form-group">
            <label>Condition *</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Like New', 'Good', 'Fair', 'For Parts'].map(c => (
                <span
                  key={c}
                  className={'tag' + (form.condition === c ? ' active' : '')}
                  onClick={() => set('condition', c)}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                className="form-control"
                type="number"
                placeholder="0"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                min="1"
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 12 }}>
                <input
                  type="checkbox"
                  checked={form.isNegotiable}
                  onChange={e => set('isNegotiable', e.target.checked)}
                />
                Price is Negotiable
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Item ki condition, usage, koi defect ho toh batao..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Photos (max 5)</label>

            {/* Preview */}
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {images.map((url, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt={'upload ' + i}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid #E5E7EB' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        background: '#EF4444', color: 'white',
                        border: 'none', borderRadius: '50%',
                        width: 20, height: 20, cursor: 'pointer',
                        fontSize: 12, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700,
                      }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 5 && (
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '16px', border: '2px dashed #D1D5DB',
                borderRadius: 12, cursor: uploading ? 'not-allowed' : 'pointer',
                background: uploading ? '#F9FAFB' : 'white',
                color: '#6B7280', fontSize: 14, fontWeight: 600,
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 20 }}>📷</span>
                {uploading ? 'Uploading...' : 'Click to add photos'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            )}

            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
              JPG / PNG / WEBP • Max 5MB each • Up to 5 photos
            </div>
          </div>

          {/* City */}
          <div className="form-group">
            <label>City *</label>
            <select className="form-control" value={form.city} onChange={e => set('city', e.target.value)}>
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Area / Locality *</label>
            <input
              className="form-control"
              placeholder="e.g. Sector 62, Dwarka Phase 2..."
              value={form.location}
              onChange={e => set('location', e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading || uploading}>
            {loading ? '⏳ Posting...' : '🚀 Post Ad for Free'}
          </button>

        </form>
      </div>
    </div>
  )
}