import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api'

const categories = [
  { id: 'all', name: 'All', icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'furniture', name: 'Furniture', icon: '🛋️' },
  { id: 'appliances', name: 'Appliances', icon: '🏠' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'clothing', name: 'Clothing', icon: '👗' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'toys', name: 'Toys', icon: '🧸' },
]

const cities = ['All Cities', 'Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad']
const conditions = ['All', 'Like New', 'Good', 'Fair', 'For Parts']

export default function Browse() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [listings, setListings]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [total, setTotal]           = useState(0)

  // Filters
  const [search, setSearch]         = useState(searchParams.get('search') || '')
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [category, setCategory]     = useState('all')
  const [city, setCity]             = useState('All Cities')
  const [condition, setCondition]   = useState('All')
  const [sort, setSort]             = useState('newest')
  const [minPrice, setMinPrice]     = useState('')
  const [maxPrice, setMaxPrice]     = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [negotiableOnly, setNegotiableOnly] = useState(false)

  useEffect(function() { fetchListings() }, [category, city, condition, sort, search, minPrice, maxPrice, verifiedOnly])

  async function fetchListings() {
    setLoading(true)
    try {
      var params = { sort }
      if (category !== 'all')      params.category  = category
      if (city !== 'All Cities')   params.city      = city
      if (condition !== 'All')     params.condition = condition
      if (search)                  params.search    = search
      if (minPrice)                params.minPrice  = minPrice
      if (maxPrice)                params.maxPrice  = maxPrice

      var res = await api.get('/listings', { params })
      var data = res.data.listings || []

      if (verifiedOnly)    data = data.filter(function(l) { return l.isVerified })
      if (negotiableOnly)  data = data.filter(function(l) { return l.isNegotiable })

      setListings(data)
      setTotal(data.length)
    } catch(err) {
      setListings([])
    }
    setLoading(false)
  }

  function clearFilters() {
    setCategory('all')
    setCity('All Cities')
    setCondition('All')
    setSort('newest')
    setMinPrice('')
    setMaxPrice('')
    setVerifiedOnly(false)
    setNegotiableOnly(false)
    setSearch('')
    setSearchInput('')
  }

  var activeFiltersCount = [
    category !== 'all',
    city !== 'All Cities',
    condition !== 'All',
    minPrice !== '',
    maxPrice !== '',
    verifiedOnly,
    negotiableOnly,
  ].filter(Boolean).length

  return (
    <div style={{ paddingTop: 60 }}>

      {/* Search Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', padding: '20px 16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center',
            background: 'white', borderRadius: 99, padding: '6px 6px 6px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <input
              value={searchInput}
              onChange={function(e) { setSearchInput(e.target.value) }}
              onKeyDown={function(e) { if (e.key === 'Enter') setSearch(searchInput) }}
              placeholder="Search laptops, plumbers, furniture..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Nunito, sans-serif' }}
            />
            <button
              onClick={function() { setSearch(searchInput) }}
              style={{ background: '#FF6B35', color: 'white', border: 'none', borderRadius: 99, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>

        {/* Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 600 }}>
              {total} listings
            </span>
            {activeFiltersCount > 0 && (
              <span style={{ background: '#FF6B35', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                {activeFiltersCount} filters active
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm">
                ✕ Clear All
              </button>
            )}
            <button
              onClick={function() { setShowFilters(function(f) { return !f }) }}
              style={{
                background: showFilters ? '#FF6B35' : 'white',
                color: showFilters ? 'white' : '#374151',
                border: '2px solid ' + (showFilters ? '#FF6B35' : '#E5E7EB'),
                borderRadius: 99, padding: '8px 16px', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              🎚️ Filters {activeFiltersCount > 0 ? '(' + activeFiltersCount + ')' : ''}
            </button>
            <select value={sort} onChange={function(e) { setSort(e.target.value) }}
              className="form-control" style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div style={{
            background: 'white', borderRadius: 16, padding: '20px',
            marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid #F3F4F6',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>

              {/* City */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>📍 City</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cities.map(function(c) {
                    return (
                      <span key={c}
                        className={'tag' + (city === c ? ' active' : '')}
                        onClick={function() { setCity(c) }}
                        style={{ fontSize: 12 }}>
                        {c}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Condition */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>📦 Condition</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {conditions.map(function(c) {
                    return (
                      <span key={c}
                        className={'tag' + (condition === c ? ' active' : '')}
                        onClick={function() { setCondition(c) }}
                        style={{ fontSize: 12 }}>
                        {c}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>💰 Price Range (₹)</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number" placeholder="Min"
                    value={minPrice}
                    onChange={function(e) { setMinPrice(e.target.value) }}
                    style={{ width: '100%', padding: '8px 12px', border: '2px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'Nunito, sans-serif' }}
                    onFocus={function(e) { e.target.style.borderColor = '#FF6B35' }}
                    onBlur={function(e) { e.target.style.borderColor = '#E5E7EB' }}
                  />
                  <span style={{ color: '#6B7280', flexShrink: 0 }}>—</span>
                  <input
                    type="number" placeholder="Max"
                    value={maxPrice}
                    onChange={function(e) { setMaxPrice(e.target.value) }}
                    style={{ width: '100%', padding: '8px 12px', border: '2px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'Nunito, sans-serif' }}
                    onFocus={function(e) { e.target.style.borderColor = '#FF6B35' }}
                    onBlur={function(e) { e.target.style.borderColor = '#E5E7EB' }}
                  />
                </div>
                {/* Quick price buttons */}
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {[['Under ₹5K', '', '5000'], ['₹5K-20K', '5000', '20000'], ['₹20K-50K', '20000', '50000'], ['₹50K+', '50000', '']].map(function(p) {
                    return (
                      <span key={p[0]}
                        onClick={function() { setMinPrice(p[1]); setMaxPrice(p[2]) }}
                        style={{
                          fontSize: 11, padding: '3px 8px', borderRadius: 99, cursor: 'pointer',
                          background: minPrice === p[1] && maxPrice === p[2] ? '#FF6B35' : '#F3F4F6',
                          color: minPrice === p[1] && maxPrice === p[2] ? 'white' : '#374151',
                          fontWeight: 600,
                        }}>
                        {p[0]}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Extra Filters */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>✨ Extra</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 10, fontSize: 13 }}>
                  <input type="checkbox" checked={verifiedOnly} onChange={function(e) { setVerifiedOnly(e.target.checked) }} />
                  <span style={{ color: '#10B981', fontWeight: 600 }}>✓ Verified Sellers Only</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={negotiableOnly} onChange={function(e) { setNegotiableOnly(e.target.checked) }} />
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>🤝 Negotiable Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Category Chips */}
        <div className="chip-row" style={{ marginBottom: 20 }}>
          {categories.map(function(cat) {
            return (
              <span key={cat.id}
                className={'tag' + (category === cat.id ? ' active' : '')}
                onClick={function() { setCategory(cat.id) }}>
                {cat.icon} {cat.name}
              </span>
            )
          })}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="loader">⏳</div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>Koi listing nahi mili</h3>
            <p>Filters change karo ya search clear karo</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, paddingBottom: 32 }}>
            {listings.map(function(l) {
              return (
                <div key={l._id}
                  onClick={function() { navigate('/listing/' + l._id) }}
                  style={{
                    background: 'white', borderRadius: 16, overflow: 'hidden',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #F3F4F6', transition: 'all 0.2s',
                  }}
                  onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.12)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                  <div style={{ position: 'relative', paddingTop: '65%', background: '#F3F4F6' }}>
                    <img
                      src={l.images && l.images[0] ? l.images[0] : 'https://placehold.co/300x200?text=No+Image'}
                      alt={l.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={function(e) { e.target.src = 'https://placehold.co/300x200?text=No+Image' }}
                    />
                    {l.isVerified && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#10B981', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                        ✓ Verified
                      </span>
                    )}
                    {l.condition === 'Like New' && (
                      <span style={{ position: 'absolute', top: 8, right: 8, background: '#1E3A8A', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                        Like New
                      </span>
                    )}
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.title}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>
                      ₹{(l.price || 0).toLocaleString('en-IN')}
                      {l.isNegotiable && <span style={{ fontSize: 10, color: '#F59E0B', marginLeft: 6 }}>Nego</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>📍 {l.location}</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>👁 {l.views || 0}</span>
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