import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const categories = [
  { id: 'all',         name: 'All',         icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'vehicles',    name: 'Vehicles',    icon: '🚗' },
  { id: 'furniture',   name: 'Furniture',   icon: '🛋️' },
  { id: 'appliances',  name: 'Appliances',  icon: '🏠' },
  { id: 'books',       name: 'Books',       icon: '📚' },
  { id: 'clothing',    name: 'Clothing',    icon: '👗' },
  { id: 'sports',      name: 'Sports',      icon: '⚽' },
]

const cities = ['All NCR', 'Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad']

const services = [
  { icon: '🔧', name: 'Plumber',     price: '₹299',    cat: 'plumber' },
  { icon: '⚡', name: 'Electrician', price: '₹199',    cat: 'electrician' },
  { icon: '🔨', name: 'Carpenter',   price: '₹399',    cat: 'carpenter' },
  { icon: '❄️', name: 'AC Repair',   price: '₹499',    cat: 'ac_repair' },
  { icon: '🎨', name: 'Painter',     price: '₹8/sqft', cat: 'painter' },
  { icon: '🧹', name: 'Cleaning',    price: '₹799',    cat: 'cleaning' },
  { icon: '📦', name: 'Shifting',    price: '₹999',    cat: 'shifting' },
  { icon: '🐛', name: 'Pest Control',price: '₹599',    cat: 'pest_control' },
]

function ListingCard({ listing, onClick }) {
  const [imgError, setImgError] = useState(false)
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return days + 'd ago'
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer',
        border: '1px solid #F3F4F6', transition: 'all 0.25s ease',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.14)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '68%', background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)', overflow: 'hidden' }}>
        <img
          src={(!imgError && listing.images?.[0]) ? listing.images[0] : 'https://placehold.co/300x200?text=No+Image'}
          alt={listing.title}
          onError={() => setImgError(true)}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
        />
        {/* Badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexDirection: 'column' }}>
          {listing.isVerified && (
            <span style={{ background: '#10B981', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              ✓ Verified
            </span>
          )}
          {listing.condition === 'Like New' && (
            <span style={{ background: '#1E3A8A', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99 }}>
              Like New
            </span>
          )}
        </div>
        {listing.isNegotiable && (
          <span style={{ position: 'absolute', top: 8, right: 8, background: '#FFF7ED', color: '#F59E0B', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, border: '1px solid #FED7AA' }}>
            Nego
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 12px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.title}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive', marginBottom: 8, lineHeight: 1 }}>
          ₹{(listing.price || 0).toLocaleString('en-IN')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}>
            📍 {listing.location || 'Delhi NCR'}
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
            {timeAgo(listing.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [listings, setListings]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeCity, setActiveCity]     = useState('All NCR')
  const [search, setSearch]             = useState('')
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setStatsVisible(true), 500)
    fetchListings()
  }, [activeCategory, activeCity])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeCategory !== 'all') params.category = activeCategory
      if (activeCity !== 'All NCR') params.city = activeCity
      const res = await api.get('/listings', { params })
      setListings(res.data.listings || [])
    } catch { setListings([]) }
    setLoading(false)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate('/browse?search=' + encodeURIComponent(search.trim()))
    }
  }

  return (
    <div style={{ background: '#F8FAFC' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2167 0%, #1E3A8A 40%, #1D4ED8 70%, #FF6B35 100%)',
        padding: '72px 16px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,107,53,0.15)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)', borderRadius: 99, padding: '6px 16px',
            fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 16,
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            🚀 Delhi NCR ka #1 Marketplace
          </div>

          <h1 style={{
            fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800, color: 'white', marginBottom: 12, lineHeight: 1.2,
          }}>
            अपना शहर, अपना बाज़ार
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Buy • Sell • Services — verified aur safe, sirf Delhi NCR mein
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: 560, margin: '0 auto 32px', display: 'flex',
            background: 'white', borderRadius: 99,
            boxShadow: '0 8px 40px rgba(0,0,0,0.2)', overflow: 'hidden',
          }}>
            <span style={{ padding: '0 16px', fontSize: 20, display: 'flex', alignItems: 'center' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Laptop, plumber, sofa..."
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 15,
                fontFamily: 'Nunito, sans-serif', padding: '14px 0',
                background: 'transparent',
              }}
            />
            <button
              onClick={() => search.trim() && navigate('/browse?search=' + encodeURIComponent(search.trim()))}
              style={{
                background: '#FF6B35', color: 'white', border: 'none',
                padding: '0 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
              }}>
              Search
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 4vw, 48px)', flexWrap: 'wrap' }}>
            {[
              { num: '1000+', label: 'Listings' },
              { num: '500+',  label: 'Verified Sellers' },
              { num: '200+',  label: 'Service Pros' },
              { num: '6',     label: 'NCR Cities' },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: 'center', opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease',
              }}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#FF6B35' }}>{s.num}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          margin: '-24px 0 32px', position: 'relative', zIndex: 10,
        }}>
          {[
            { icon: '🛒', title: 'Buy',      sub: 'Used items nearby',    path: '/browse',   color: '#1E3A8A', bg: '#EFF6FF' },
            { icon: '💰', title: 'Sell',     sub: 'Post free listing',    path: '/post',     color: '#FF6B35', bg: '#FFF0EB' },
            { icon: '🔧', title: 'Services', sub: 'Hire local pros',      path: '/services', color: '#10B981', bg: '#ECFDF5' },
          ].map(item => (
            <div key={item.title}
              onClick={() => navigate(item.path)}
              style={{
                background: item.bg, borderRadius: 16, padding: '20px 16px',
                textAlign: 'center', cursor: 'pointer', border: '2px solid transparent',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, color: item.color, fontSize: 15, fontFamily: 'Baloo 2, cursive' }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* ── SERVICES ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 700, color: '#111827' }}>Popular Services</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Verified professionals near you</div>
            </div>
            <button onClick={() => navigate('/services')} style={{ background: 'none', border: 'none', color: '#FF6B35', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              View All →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {services.map(s => (
              <div key={s.name}
                onClick={() => navigate('/services')}
                style={{
                  background: 'white', borderRadius: 14, padding: '18px 12px',
                  textAlign: 'center', cursor: 'pointer', border: '1.5px solid #F3F4F6',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)' }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#FF6B35', fontWeight: 600 }}>from {s.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── LISTINGS ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 700, color: '#111827' }}>Latest Listings</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Fresh deals near you</div>
            </div>
            <button onClick={() => navigate('/browse')} style={{ background: 'none', border: 'none', color: '#FF6B35', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              View All →
            </button>
          </div>

          {/* City Filter */}
          <div className="chip-row" style={{ marginBottom: 12 }}>
            {cities.map(city => (
              <span key={city} className={'tag' + (activeCity === city ? ' active' : '')} onClick={() => setActiveCity(city)}>
                {city}
              </span>
            ))}
          </div>

          {/* Category Filter */}
          <div className="chip-row" style={{ marginBottom: 20 }}>
            {categories.map(cat => (
              <span key={cat.id} className={'tag' + (activeCategory === cat.id ? ' active' : '')} onClick={() => setActiveCategory(cat.id)}>
                {cat.icon} {cat.name}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ paddingTop: '68%', background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ padding: 12 }}>
                    <div style={{ height: 14, background: '#F3F4F6', borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 20, background: '#FEE2E2', borderRadius: 4, width: '60%' }} />
                  </div>
                </div>
              ))}
              <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📭</div>
              <h3>Koi listing nahi mili</h3>
              <p>Doosra category ya city try karo</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { setActiveCategory('all'); setActiveCity('All NCR') }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {listings.map(l => (
                <ListingCard key={l._id} listing={l} onClick={() => navigate('/listing/' + l._id)} />
              ))}
            </div>
          )}
        </div>

        {/* ── TRUST BANNER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2167, #1E3A8A)',
          borderRadius: 24, padding: '32px 24px', marginBottom: 40,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 4 }}>
              Why DelhiNCR Market?
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              Delhi NCR ka sabse trusted local marketplace
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'center' }}>
            {[
              { icon: '✅', title: 'Verified Sellers',  desc: 'Aadhaar-linked profiles' },
              { icon: '🔒', title: 'Safe Payments',     desc: 'UPI escrow protection' },
              { icon: '📍', title: 'Truly Local',       desc: 'Within 5km radius only' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 16,
                padding: '20px 16px', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          background: 'linear-gradient(135deg, #FF6B35, #E55A26)',
          borderRadius: 24, padding: '32px 24px', marginBottom: 40, textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Kuch Sell Karna Hai? 🚀
          </div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 20 }}>
            Free mein listing daalo — lakho buyers tak pahuncho
          </div>
          <button
            onClick={() => navigate('/post')}
            style={{
              background: 'white', color: '#FF6B35', border: 'none',
              padding: '14px 36px', borderRadius: 99, fontWeight: 800,
              fontSize: 16, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}>
            + Post Free Ad
          </button>
        </div>

      </div>
    </div>
  )
}