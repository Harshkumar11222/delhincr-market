import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api'
import { INDIA_CITIES, CATEGORIES } from '../data/india'

export default function Browse() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const cityDropRef = useRef(null)

  const [listings, setListings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [total, setTotal]         = useState(0)

  // Filters
  const [search, setSearch]       = useState(searchParams.get('search') || '')
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [category, setCategory]   = useState('all')
  const [activeCity, setActiveCity] = useState(searchParams.get('city') || 'All India')
  const [citySearch, setCitySearch] = useState(searchParams.get('city') || '')
  const [showCityDrop, setShowCityDrop] = useState(false)
  const [condition, setCondition] = useState('All')
  const [sort, setSort]           = useState('newest')
  const [minPrice, setMinPrice]   = useState('')
  const [maxPrice, setMaxPrice]   = useState('')
  const [verifiedOnly, setVerifiedOnly]     = useState(false)
  const [negotiableOnly, setNegotiableOnly] = useState(false)

  const conditions = ['All', 'Like New', 'Good', 'Fair', 'For Parts']

  var filteredCities = INDIA_CITIES.filter(function(c) {
    return c.toLowerCase().includes((citySearch || '').toLowerCase())
  }).slice(0, 8)

  useEffect(function() {
    fetchListings()
  }, [category, activeCity, condition, sort, search, minPrice, maxPrice, verifiedOnly])

  useEffect(function() {
    function handleClick(e) {
      if (cityDropRef.current && !cityDropRef.current.contains(e.target)) {
        setShowCityDrop(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return function() { document.removeEventListener('mousedown', handleClick) }
  }, [])

  async function fetchListings() {
    setLoading(true)
    try {
      var params = { sort }
      if (category !== 'all')        params.category  = category
      if (activeCity !== 'All India') params.city     = activeCity
      if (condition !== 'All')        params.condition = condition
      if (search)                     params.search    = search
      if (minPrice)                   params.minPrice  = minPrice
      if (maxPrice)                   params.maxPrice  = maxPrice

      var res  = await api.get('/listings', { params })
      var data = res.data.listings || []

      if (verifiedOnly)   data = data.filter(function(l) { return l.isVerified })
      if (negotiableOnly) data = data.filter(function(l) { return l.isNegotiable })

      setListings(data)
      setTotal(data.length)
    } catch(err) {
      setListings([])
    }
    setLoading(false)
  }

  function clearFilters() {
    setCategory('all')
    setActiveCity('All India')
    setCitySearch('')
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
    activeCity !== 'All India',
    condition !== 'All',
    minPrice !== '',
    maxPrice !== '',
    verifiedOnly,
    negotiableOnly,
  ].filter(Boolean).length

  return (
    <div style={{ paddingTop: 60 }}>

      {/* Search Header */}
      {/* Search Header */}
<div style={{
  background: 'linear-gradient(135deg, #0F2A3F 0%, #0EA5A0 100%)',
  padding: '20px 16px',
}}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center',
            background: 'white', borderRadius: 99,
            padding: '6px 6px 6px 16px',
            boxShadow: '0 4px 20px rgba(107,33,168,0.25)',
            border: '2px solid rgba(245,158,11,0.3)',
          }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <input
              value={searchInput}
              onChange={function(e) { setSearchInput(e.target.value) }}
              onKeyDown={function(e) { if (e.key === 'Enter') setSearch(searchInput) }}
              placeholder="Search laptops, furniture, bikes..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Nunito, sans-serif' }}
            />
            <button
              onClick={function() { setSearch(searchInput) }}
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'white', border: 'none', borderRadius: 99,
                padding: '10px 22px', fontWeight: 700, cursor: 'pointer',
                fontSize: 14, fontFamily: 'Nunito, sans-serif',
              }}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>

        {/* Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 600 }}>{total} listings</span>
            {activeFiltersCount > 0 && (
              <span style={{ background: '#6B21A8', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                {activeFiltersCount} filters
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters}
                style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: 99, padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: '#6B7280', fontFamily: 'Nunito, sans-serif' }}>
                ✕ Clear All
              </button>
            )}
            <button
              onClick={function() { setShowFilters(function(f) { return !f }) }}
              style={{
                background: showFilters ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : 'white',
                color: showFilters ? 'white' : '#374151',
                border: '2px solid ' + (showFilters ? '#6B21A8' : '#E5E7EB'),
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
            marginBottom: 20, boxShadow: '0 4px 16px rgba(107,33,168,0.08)',
            border: '1px solid rgba(107,33,168,0.1)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>

              {/* City Search */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>📍 City</div>
                <div ref={cityDropRef} style={{ position: 'relative' }}>
                  <input
                    className="form-control"
                    placeholder="Search city..."
                    value={citySearch}
                    onChange={function(e) { setCitySearch(e.target.value); setShowCityDrop(true) }}
                    onFocus={function() { setShowCityDrop(true) }}
                    style={{ fontSize: 13 }}
                  />
                  {showCityDrop && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: 'white', borderRadius: 12,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      zIndex: 100, border: '1px solid #E5E7EB',
                      maxHeight: 220, overflowY: 'auto',
                    }}>
                      <div onClick={function() { setActiveCity('All India'); setCitySearch(''); setShowCityDrop(false) }}
                        style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #F3F4F6', fontWeight: 700, color: '#6B21A8' }}>
                        🇮🇳 All India
                      </div>
                      {filteredCities.map(function(c) {
                        return (
                          <div key={c}
                            onClick={function() { setActiveCity(c); setCitySearch(c); setShowCityDrop(false) }}
                            style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #F3F4F6' }}
                            onMouseEnter={function(e) { e.currentTarget.style.background = '#F5F3FF' }}
                            onMouseLeave={function(e) { e.currentTarget.style.background = 'white' }}>
                            📍 {c}
                          </div>
                        )
                      })}
                    </div>
                  )}
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
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>💰 Price (₹)</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <input type="number" placeholder="Min" value={minPrice}
                    onChange={function(e) { setMinPrice(e.target.value) }}
                    style={{ width: '100%', padding: '8px 12px', border: '2px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'Nunito, sans-serif' }}
                    onFocus={function(e) { e.target.style.borderColor = '#6B21A8' }}
                    onBlur={function(e) { e.target.style.borderColor = '#E5E7EB' }}
                  />
                  <span style={{ color: '#6B7280', flexShrink: 0 }}>—</span>
                  <input type="number" placeholder="Max" value={maxPrice}
                    onChange={function(e) { setMaxPrice(e.target.value) }}
                    style={{ width: '100%', padding: '8px 12px', border: '2px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'Nunito, sans-serif' }}
                    onFocus={function(e) { e.target.style.borderColor = '#6B21A8' }}
                    onBlur={function(e) { e.target.style.borderColor = '#E5E7EB' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[['Under ₹5K','','5000'],['₹5K-20K','5000','20000'],['₹20K-50K','20000','50000'],['₹50K+','50000','']].map(function(p) {
                    return (
                      <span key={p[0]} onClick={function() { setMinPrice(p[1]); setMaxPrice(p[2]) }}
                        style={{
                          fontSize: 11, padding: '3px 8px', borderRadius: 99, cursor: 'pointer',
                          background: minPrice === p[1] && maxPrice === p[2] ? '#6B21A8' : '#F3F4F6',
                          color: minPrice === p[1] && maxPrice === p[2] ? 'white' : '#374151',
                          fontWeight: 600,
                        }}>
                        {p[0]}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Extra */}
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
          {CATEGORIES.map(function(cat) {
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {[1,2,3,4,5,6,7,8].map(function(i) {
              return (
                <div key={i} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ paddingTop: '68%', background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ padding: 12 }}>
                    <div style={{ height: 14, background: '#F3F4F6', borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 20, background: '#F5F3FF', borderRadius: 4, width: '60%' }} />
                  </div>
                </div>
              )
            })}
            <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
          </div>
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
              var timeAgo = function(date) {
                var diff = Date.now() - new Date(date)
                var days = Math.floor(diff / 86400000)
                if (days === 0) return 'Today'
                if (days === 1) return 'Yesterday'
                return days + 'd ago'
              }
              return (
                <div key={l._id}
                  onClick={function() { navigate('/listing/' + l._id) }}
                  style={{
                    background: 'white', borderRadius: 16, overflow: 'hidden',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(107,33,168,0.06)',
                    border: '1px solid #F3F4F6', transition: 'all 0.25s',
                  }}
                  onMouseEnter={function(e) {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(107,33,168,0.14)'
                  }}
                  onMouseLeave={function(e) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(107,33,168,0.06)'
                  }}
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
                      <span style={{ position: 'absolute', top: 8, right: 8, background: '#6B21A8', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                        Like New
                      </span>
                    )}
                    {l.isNegotiable && (
                      <span style={{ position: 'absolute', bottom: 8, right: 8, background: '#FFFBEB', color: '#D97706', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: '1px solid #FED7AA' }}>
                        Nego
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.title}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#6B21A8', fontFamily: 'Baloo 2, cursive', marginBottom: 6 }}>
                      ₹{(l.price || 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>📍 {l.location || l.city}</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{timeAgo(l.createdAt)}</span>
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