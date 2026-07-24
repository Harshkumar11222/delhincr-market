import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { POPULAR_CITIES, CATEGORIES } from '../data/india'

function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(function() {
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true
        var start = 0, step = end / (duration / 16)
        var timer = setInterval(function() {
          start += step
          if (start >= end) { setCount(end); clearInterval(timer) }
          else setCount(Math.floor(start))
        }, 16)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>
}

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [listings, setListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(function() {
    var saved = localStorage.getItem('nukkad-theme')
    setDarkMode(saved === 'dark')
    fetchFeatured()
  }, [])

  async function fetchFeatured() {
    try {
      var res = await api.get('/listings?limit=8&sort=newest')
      setListings(res.data.listings || [])
    } catch(e) { setListings([]) }
    setLoadingListings(false)
  }

  var categories = [
    { id: 'all',         icon: '🛍️', label: 'For Sale',     count: '12,560+' },
    { id: 'rental',      icon: '🏠', label: 'For Rent',     count: '3,240+' },
    { id: 'vehicles',    icon: '🚗', label: 'Vehicles',     count: '2,150+' },
    { id: 'electronics', icon: '💻', label: 'Electronics',  count: '4,890+' },
    { id: 'services',    icon: '🔧', label: 'Services',     count: '6,320+' },
    { id: 'more',        icon: '⋯',  label: 'More',         count: 'Explore All', isMore: true },
  ]

  var stats = [
    { icon: '👥', num: 10000, suffix: '+', label: 'Happy Users' },
    { icon: '📋', num: 25000, suffix: '+', label: 'Active Listings' },
    { icon: '📍', num: 50,    suffix: '+', label: 'Localities Covered' },
    { icon: '🛡️', num: 100,   suffix: '%', label: 'Trusted Community' },
  ]

  var popularCitiesSlice = (POPULAR_CITIES || [
    { city: 'Delhi',     emoji: '🏛️', state: 'Delhi' },
    { city: 'Mumbai',    emoji: '🌊', state: 'Maharashtra' },
    { city: 'Bangalore', emoji: '🌿', state: 'Karnataka' },
    { city: 'Hyderabad', emoji: '💎', state: 'Telangana' },
    { city: 'Chennai',   emoji: '☀️', state: 'Tamil Nadu' },
    { city: 'Kolkata',   emoji: '🎨', state: 'West Bengal' },
  ]).slice(0, 6)

  var isDark = darkMode

  return (
    <div style={{ background: isDark ? '#0A1628' : '#FFFFFF', minHeight: '100vh', paddingTop: 68 }}>

      {/* ══ HERO SECTION ══ */}
      <section style={{
        padding: '60px 20px 80px',
        background: isDark
          ? 'linear-gradient(135deg, #0A1628 0%, #0F2A3F 50%, #0A1628 100%)'
          : '#FFFFFF',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,160,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,160,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>

          {/* Left Content */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(14,165,160,0.1)', border: '1px solid rgba(14,165,160,0.2)',
              borderRadius: 99, padding: '6px 16px', fontSize: 12,
              color: '#0EA5A0', fontWeight: 700, marginBottom: 24,
              letterSpacing: '1px',
            }}>
              <span style={{ width: 6, height: 6, background: '#0EA5A0', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              WELCOME TO NUKKADMARKET
            </div>

            <h1 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(36px, 5vw, 58px)',
              fontWeight: 800, lineHeight: 1.15, marginBottom: 20,
              color: isDark ? '#F1F5F9' : '#0F2A3F',
            }}>
              Apna Shehar,{' '}
              <span style={{ color: '#0EA5A0', display: 'block' }}>Apna Bazaar</span>
            </h1>

            <p style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
              Buy, Sell, Rent and find Local Services — sab kuch ek jagah. Apne shehar ke liye, apne logon ke liye.
            </p>

            {/* Search Bar */}
            <div style={{
              display: 'flex', background: isDark ? '#0F2035' : '#F8FAFC',
              border: '2px solid ' + (isDark ? 'rgba(14,165,160,0.2)' : '#E2E8F0'),
              borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(14,165,160,0.1)',
              marginBottom: 24,
            }}>
              <select style={{
                padding: '14px 16px', background: 'transparent', border: 'none',
                borderRight: '1.5px solid ' + (isDark ? 'rgba(14,165,160,0.2)' : '#E2E8F0'),
                color: isDark ? '#94A3B8' : '#64748B', fontSize: 14, cursor: 'pointer',
                outline: 'none', fontFamily: 'Inter, sans-serif',
              }}>
                <option>All Categories</option>
                <option>For Sale</option>
                <option>For Rent</option>
                <option>Services</option>
                <option>Vehicles</option>
              </select>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && search.trim()) navigate('/browse?search=' + encodeURIComponent(search)) }}
                placeholder="Search for products, services..."
                style={{
                  flex: 1, padding: '14px 16px', background: 'transparent',
                  border: 'none', outline: 'none', fontSize: 14,
                  color: isDark ? '#F1F5F9' : '#0F2A3F',
                }}
              />
              <button
                onClick={() => { if (search.trim()) navigate('/browse?search=' + encodeURIComponent(search)) }}
                style={{
                  padding: '14px 24px', background: '#0EA5A0', color: 'white',
                  border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                🔍 Search
              </button>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/browse')} style={{
                padding: '14px 28px', background: '#0EA5A0', color: 'white',
                border: 'none', borderRadius: 99, fontWeight: 700, fontSize: 15,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 6px 20px rgba(14,165,160,0.35)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Explore Listings →
              </button>
              <button onClick={() => navigate('/about')} style={{
                padding: '14px 28px', background: 'transparent', color: isDark ? '#94A3B8' : '#475569',
                border: '2px solid ' + (isDark ? 'rgba(14,165,160,0.2)' : '#E2E8F0'),
                borderRadius: 99, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              }}>
                ▶ How It Works
              </button>
            </div>
          </div>

          {/* Right — Logo Hero */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,160,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

            {/* Logo big display */}
            <div style={{
              background: isDark ? 'rgba(14,165,160,0.08)' : 'rgba(14,165,160,0.05)',
              border: '2px solid rgba(14,165,160,0.15)',
              borderRadius: 32, padding: '48px', textAlign: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(14,165,160,0.15)',
              position: 'relative',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <div style={{ fontSize: 80, marginBottom: 16 }}>🏪</div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>
                <span style={{ color: isDark ? '#F1F5F9' : '#0F2A3F' }}>Nukkad</span>
                <span style={{ color: '#0EA5A0' }}>Market</span>
              </div>
              <div style={{ fontSize: 12, color: '#0EA5A0', fontWeight: 600, letterSpacing: '2px', marginTop: 6 }}>
                APNA SHEHAR, APNA BAZAAR
              </div>

              {/* Floating badges */}
              <div style={{ position: 'absolute', top: -16, right: -16, background: '#0EA5A0', color: 'white', borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 700, boxShadow: '0 4px 12px rgba(14,165,160,0.4)' }}>
                🛡️ 100% Safe
              </div>
              <div style={{ position: 'absolute', bottom: -16, left: -16, background: isDark ? '#0F2035' : 'white', border: '2px solid rgba(14,165,160,0.2)', borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#0EA5A0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                🏷️ 100% Free
              </div>
            </div>

            {/* Shop Local tag */}
            <div style={{
              position: 'absolute', right: 0, top: '30%',
              background: isDark ? '#0F2035' : 'white',
              border: '2px solid rgba(14,165,160,0.15)',
              borderRadius: 14, padding: '14px 18px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏘️</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0EA5A0' }}>SHOP LOCAL</div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </section>

      {/* ══ BROWSE BY CATEGORIES ══ */}
      <section style={{ padding: '60px 20px', background: isDark ? '#0A1628' : '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F2A3F', marginBottom: 8 }}>
              Browse by Categories
            </h2>
            <div style={{ width: 48, height: 3, background: '#0EA5A0', borderRadius: 99, margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map(function(cat) {
              return (
                <div key={cat.id}
                  onClick={() => cat.isMore ? navigate('/browse') : navigate('/browse?category=' + cat.id)}
                  style={{
                    background: isDark ? '#0F2035' : '#FFFFFF',
                    border: '1.5px solid ' + (isDark ? 'rgba(14,165,160,0.15)' : '#E2E8F0'),
                    borderRadius: 16, padding: '28px 16px', textAlign: 'center',
                    cursor: 'pointer', transition: 'all 0.25s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#0EA5A0'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,165,160,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = isDark ? 'rgba(14,165,160,0.15)' : '#E2E8F0'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(14,165,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>
                    {cat.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: isDark ? '#F1F5F9' : '#0F2A3F', marginBottom: 4 }}>{cat.label}</div>
                  <div style={{ fontSize: 12, color: '#0EA5A0', fontWeight: 600 }}>{cat.count}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ STATS BANNER ══ */}
      <section style={{ padding: '0 20px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: isDark ? '#0F2A3F' : '#0F2A3F',
            borderRadius: 20, padding: '40px 48px',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(14,165,160,0.1)', pointerEvents: 'none' }} />

            {stats.map(function(s, i) {
              return (
                <div key={s.label} style={{
                  textAlign: 'center', padding: '0 24px',
                  borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(14,165,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>
                    {s.icon}
                  </div>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 32, fontWeight: 800, color: '#0EA5A0', lineHeight: 1 }}>
                    <CountUp end={s.num} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ FEATURED LISTINGS ══ */}
      <section style={{ padding: '0 20px 60px', background: isDark ? '#0A1628' : '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 26, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F2A3F', marginBottom: 8 }}>
                Featured Listings
              </h2>
              <div style={{ width: 48, height: 3, background: '#0EA5A0', borderRadius: 99 }} />
            </div>
            <button onClick={() => navigate('/browse')} style={{
              padding: '10px 20px', background: 'transparent', color: isDark ? '#94A3B8' : '#475569',
              border: '1.5px solid ' + (isDark ? 'rgba(14,165,160,0.2)' : '#E2E8F0'),
              borderRadius: 99, fontWeight: 600, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
            }}>
              View All Listings →
            </button>
          </div>

          {loadingListings ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }} />)}
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🛍️</div>
              <h3>Koi listings nahi abhi</h3>
              <p>Pehle listing daalo!</p>
              <button className="btn btn-primary" onClick={() => navigate('/post')}>Post Free Ad</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {listings.map(function(l) {
                return (
                  <div key={l._id}
                    onClick={() => navigate('/listing/' + l._id)}
                    style={{
                      background: isDark ? '#0F2035' : '#FFFFFF',
                      border: '1.5px solid ' + (isDark ? 'rgba(14,165,160,0.1)' : '#E2E8F0'),
                      borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                      transition: 'all 0.25s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(14,165,160,0.15)'; e.currentTarget.style.borderColor = '#0EA5A0' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = isDark ? 'rgba(14,165,160,0.1)' : '#E2E8F0' }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', paddingTop: '60%', background: isDark ? '#1A3A52' : '#F8FAFC', overflow: 'hidden' }}>
                      <img src={l.images?.[0] || 'https://placehold.co/300x180?text=No+Image'} alt={l.title}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onError={e => e.target.src = 'https://placehold.co/300x180?text=No+Image'}
                      />
                      {/* Category badge */}
                      <div style={{ position: 'absolute', top: 10, left: 10, background: '#0EA5A0', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>
                        {l.category || 'For Sale'}
                      </div>
                      {/* Wishlist */}
                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
                        🤍
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#F1F5F9' : '#0F2A3F', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                      <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, fontWeight: 700, color: '#0EA5A0', marginBottom: 8 }}>
                        ₹{(l.price || 0).toLocaleString('en-IN')}
                        {l.isNegotiable && <span style={{ fontSize: 11, color: '#F59E0B', marginLeft: 8, background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 99 }}>Negotiable</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' }}>
                        <span>📍 {l.city || l.location}</span>
                        <span>{new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══ TRUST SECTION ══ */}
      <section style={{ padding: '60px 20px', background: isDark ? '#0F2035' : '#F8FAFC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

            <div>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 32, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F2A3F', marginBottom: 4 }}>
                Safe.{' '}
                <span style={{ color: isDark ? '#F1F5F9' : '#0F2A3F' }}>Local.</span>{' '}
                <span style={{ color: '#0EA5A0' }}>Trusted.</span>
              </h2>
              <div style={{ width: 48, height: 3, background: '#0EA5A0', borderRadius: 99, marginBottom: 20 }} />
              <p style={{ fontSize: 15, color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.8, marginBottom: 32 }}>
                NukkadMarket is committed to creating a safe and trusted marketplace for everyone. Join thousands of local people who trust NukkadMarket.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>
                {[
                  { icon: '🛡️', title: 'Verified Users', sub: '100% Secure' },
                  { icon: '📞', title: 'Local Support', sub: "We're here to help" },
                  { icon: '⚡', title: 'Easy & Fast', sub: 'Simple & Reliable' },
                ].map(function(item) {
                  return (
                    <div key={item.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(14,165,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F2A3F' }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' }}>{item.sub}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/register')} style={{ padding: '13px 28px', background: '#0EA5A0', color: 'white', border: 'none', borderRadius: 99, fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(14,165,160,0.35)', transition: 'all 0.2s' }}>
                  Join Now →
                </button>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: isDark ? '#64748B' : '#94A3B8' }}>Also available on</span>
                  <span style={{ fontSize: 18 }}>▶</span>
                  <span style={{ fontSize: 18 }}>🍎</span>
                </div>
              </div>
            </div>

            {/* Right — Phone mockup */}
            <div className="hide-mobile" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 280, background: isDark ? '#0A1628' : '#0F2A3F',
                borderRadius: 32, padding: '20px', boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                border: '4px solid ' + (isDark ? '#1A3A52' : '#1A3A52'),
                position: 'relative',
              }}>
                {/* Phone notch */}
                <div style={{ width: 80, height: 6, background: '#1A3A52', borderRadius: 99, margin: '0 auto 20px' }} />

                {/* Mini app preview */}
                <div style={{ background: isDark ? '#0F2035' : '#F8FAFC', borderRadius: 20, padding: '16px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, background: '#0EA5A0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏪</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F2A3F' }}>NukkadMarket</span>
                  </div>
                  <div style={{ background: isDark ? '#1A3A52' : 'white', borderRadius: 10, padding: '10px 12px', marginBottom: 10, border: '1px solid rgba(14,165,160,0.15)' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Search anything...</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {['🛍️','🏠','🚗','🔧'].map((icon, i) => (
                      <div key={i} style={{ background: 'rgba(14,165,160,0.1)', borderRadius: 10, padding: '10px', textAlign: 'center', fontSize: 20 }}>{icon}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#94A3B8' : '#64748B', marginBottom: 8 }}>Trending Near You</div>
                  {[
                    { title: 'iPhone 13 Pro', price: '₹65,000', loc: 'Karol Bagh, Delhi' },
                    { title: 'Honda Activa', price: '₹45,000', loc: 'Sector 62, Noida' },
                  ].map(function(item) {
                    return (
                      <div key={item.title} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(14,165,160,0.1)', alignItems: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(14,165,160,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📱</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#F1F5F9' : '#0F2A3F' }}>{item.title}</div>
                          <div style={{ fontSize: 11, color: '#0EA5A0', fontWeight: 700 }}>{item.price}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8' }}>📍 {item.loc}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ POPULAR CITIES ══ */}
      <section style={{ padding: '60px 20px', background: isDark ? '#0A1628' : '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 26, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F2A3F', marginBottom: 8 }}>Popular Cities</h2>
            <div style={{ width: 48, height: 3, background: '#0EA5A0', borderRadius: 99, margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
            {popularCitiesSlice.map(function(item) {
              return (
                <div key={item.city}
                  onClick={() => navigate('/browse?city=' + item.city)}
                  style={{
                    background: isDark ? '#0F2035' : '#FFFFFF',
                    border: '1.5px solid ' + (isDark ? 'rgba(14,165,160,0.15)' : '#E2E8F0'),
                    borderRadius: 16, padding: '20px 12px', textAlign: 'center',
                    cursor: 'pointer', transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0EA5A0'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(14,165,160,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? 'rgba(14,165,160,0.15)' : '#E2E8F0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{item.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F2A3F', marginBottom: 2 }}>{item.city}</div>
                  <div style={{ fontSize: 11, color: '#0EA5A0', fontWeight: 600 }}>{item.state}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ SUPPORT BANNER ══ */}
      <section style={{ padding: '0 20px 60px', background: isDark ? '#0A1628' : '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: isDark ? '#0F2035' : '#F8FAFC',
            border: '1.5px solid ' + (isDark ? 'rgba(14,165,160,0.15)' : '#E2E8F0'),
            borderRadius: 20, padding: '20px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, background: 'rgba(14,165,160,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤝</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F2A3F' }}>Need Help? We are here!</div>
                <div style={{ fontSize: 13, color: isDark ? '#64748B' : '#94A3B8' }}>📞 +91 70552 52609 • 📧 nukkadmarket25@gmail.com</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="tel:+917055252609" style={{ padding: '9px 18px', background: '#0EA5A0', color: 'white', borderRadius: 99, fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>📞 Call</a>
              <a href="https://wa.me/917055252609" target="_blank" rel="noopener noreferrer" style={{ padding: '9px 18px', background: 'rgba(14,165,160,0.1)', color: '#0EA5A0', border: '1.5px solid rgba(14,165,160,0.2)', borderRadius: 99, fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>💬 WhatsApp</a>
              <button onClick={() => navigate('/support')} style={{ padding: '9px 18px', background: 'transparent', color: isDark ? '#94A3B8' : '#475569', border: '1.5px solid ' + (isDark ? 'rgba(14,165,160,0.2)' : '#E2E8F0'), borderRadius: 99, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Help Center</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}