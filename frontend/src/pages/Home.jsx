import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const [statsVisible, setStatsVisible] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(function() {
    setTimeout(function() { setStatsVisible(true) }, 400)
  }, [])

  var sections = [
    {
      icon: '🛍️',
      title: 'Buy & Sell',
      titleHindi: 'खरीदो और बेचो',
      desc: 'Delhi NCR mein used items buy aur sell karo — laptops, phones, furniture, bikes aur bahut kuch. Safe, verified aur local.',
      features: ['📱 Electronics', '🚗 Vehicles', '🛋️ Furniture', '📚 Books', '👗 Clothing'],
      color: '#6B21A8',
      gradient: 'linear-gradient(135deg, #6B21A8 0%, #7C3AED 100%)',
      bg: '#F5F3FF',
      path: '/browse',
      btnText: 'Browse Listings →',
      stats: '500+ Active Listings',
      badge: '🔥 Most Popular',
    },
    {
      icon: '🔧',
      title: 'Local Services',
      titleHindi: 'लोकल सर्विसेज़',
      desc: 'Verified local professionals dhundho — plumber, electrician, carpenter, painter aur AC repair. Ghar baithe booking karo.',
      features: ['🔧 Plumber', '⚡ Electrician', '🔨 Carpenter', '🎨 Painter', '❄️ AC Repair'],
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      bg: '#ECFDF5',
      path: '/services',
      btnText: 'Find Professionals →',
      stats: '200+ Verified Pros',
      badge: '✅ Verified Only',
    },
    {
      icon: '🚗',
      title: 'Vehicle Rentals',
      titleHindi: 'वाहन किराये पर',
      desc: 'Car, bike, scooty aur cycle rent karo Delhi NCR mein. Hourly aur daily rates. Travel karo apne budget mein.',
      features: ['🚗 Cars', '🏍️ Bikes', '🛵 Scooty', '🚲 Cycles', '🚐 Vans'],
      color: '#DC2626',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
      bg: '#FEF2F2',
      path: '/rentals',
      btnText: 'Rent a Vehicle →',
      stats: 'Best Rates in NCR',
      badge: '🆕 New Section',
    },
    {
      icon: '➕',
      title: 'Post Free Ad',
      titleHindi: 'फ्री में बेचो',
      desc: 'Apna koi bhi item ya service list karo bilkul free mein. Lakho buyers tak pahuncho. Easy aur fast listing process.',
      features: ['📸 Photo Upload', '✅ Free Listing', '📍 Local Reach', '💬 Direct Chat', '🔒 Safe & Secure'],
      color: '#D97706',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      bg: '#FFFBEB',
      path: '/post',
      btnText: 'Post Your Ad →',
      stats: '100% Free Forever',
      badge: '💰 Earn Money',
    },
  ]

  var trustPoints = [
    { icon: '✅', title: 'Verified Sellers',  desc: 'Har seller verified hai — safe deal guaranteed' },
    { icon: '🔒', title: 'Secure Payments',   desc: 'UPI escrow — pehle item dekho phir pay karo' },
    { icon: '📍', title: 'Hyper Local',       desc: 'Sirf 5km radius — truly local marketplace' },
    { icon: '💬', title: 'Direct Chat',       desc: 'Buyer-seller directly baat karo — no middleman' },
    { icon: '🚀', title: 'Free Listing',      desc: 'Item list karo bilkul free — koi hidden charges nahi' },
    { icon: '⭐', title: 'Trusted Reviews',   desc: 'Real reviews — real users se — fake nahi' },
  ]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>

      {/* ══ HERO ══ */}
      <div style={{
        background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 30%, #6B21A8 65%, #F59E0B 100%)',
        padding: '84px 16px 110px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '15%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(245,158,11,0.06)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '8%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>

          {/* Top Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,158,11,0.2)', backdropFilter: 'blur(8px)',
            borderRadius: 99, padding: '6px 18px', fontSize: 13,
            color: '#FCD34D', marginBottom: 24,
            border: '1px solid rgba(245,158,11,0.3)',
            fontWeight: 600,
          }}>
            🏪 Delhi NCR ka #1 Nukkad Marketplace
          </div>

          {/* Main Title */}
          <h1 style={{
            fontFamily: 'Baloo 2, cursive',
            fontSize: 'clamp(36px, 7vw, 60px)',
            fontWeight: 800, color: 'white',
            marginBottom: 8, lineHeight: 1.1,
          }}>
            नुक्कड़ मार्केट
          </h1>
          <h2 style={{
            fontFamily: 'Baloo 2, cursive',
            fontSize: 'clamp(18px, 3vw, 26px)',
            fontWeight: 600, marginBottom: 16, lineHeight: 1.3,
            background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Apna Nukkad, Apna Bazaar
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 36, lineHeight: 1.8 }}>
            Buy • Sell • Services • Rentals<br />
            <span style={{ fontSize: 13, opacity: 0.7 }}>
              Verified, Safe aur 100% Local — Sirf Delhi NCR ke liye
            </span>
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: 580, margin: '0 auto 44px',
            display: 'flex', background: 'white', borderRadius: 99,
            boxShadow: '0 8px 40px rgba(107,33,168,0.3)',
            overflow: 'hidden', border: '2px solid rgba(245,158,11,0.3)',
          }}>
            <span style={{ padding: '0 16px', fontSize: 20, display: 'flex', alignItems: 'center' }}>🔍</span>
            <input
              value={search}
              onChange={function(e) { setSearch(e.target.value) }}
              onKeyDown={function(e) {
                if (e.key === 'Enter' && search.trim()) {
                  navigate('/browse?search=' + encodeURIComponent(search.trim()))
                }
              }}
              placeholder="Laptop, plumber, bike rental..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 15, fontFamily: 'Nunito, sans-serif',
                padding: '16px 0', background: 'transparent',
              }}
            />
            <button
              onClick={function() {
                if (search.trim()) navigate('/browse?search=' + encodeURIComponent(search.trim()))
              }}
              style={{
                background: 'linear-gradient(135deg, #6B21A8, #7C3AED)',
                color: 'white', border: 'none', padding: '0 28px',
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
              }}>
              Search
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 56px)', flexWrap: 'wrap' }}>
            {[
              { num: '1000+', label: 'Listings' },
              { num: '500+',  label: 'Verified Sellers' },
              { num: '200+',  label: 'Service Pros' },
              { num: '6',     label: 'NCR Cities' },
            ].map(function(s) {
              return (
                <div key={s.label} style={{
                  textAlign: 'center',
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease',
                }}>
                  <div style={{
                    fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800,
                    background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="container" style={{ marginTop: -48, paddingBottom: 60 }}>

        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 24 }}>
          <div style={{
            fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 700,
            color: '#111827', marginBottom: 8,
          }}>
            Kya dhundh rahe ho? 🎯
          </div>
          <div style={{ fontSize: 15, color: '#6B7280' }}>
            Apna section choose karo — sab kuch ek jagah
          </div>
        </div>

        {/* 4 Section Cards — 2x2 grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24, marginBottom: 64,
        }}>
          {sections.map(function(section) {
            return (
              <div key={section.title}
                onClick={function() { navigate(section.path) }}
                style={{
                  background: 'white', borderRadius: 28, overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(107,33,168,0.08)',
                  cursor: 'pointer', border: '2px solid transparent',
                  transition: 'all 0.3s ease', position: 'relative',
                }}
                onMouseEnter={function(e) {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 24px 56px rgba(107,33,168,0.18)'
                  e.currentTarget.style.borderColor = section.color
                }}
                onMouseLeave={function(e) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(107,33,168,0.08)'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                {/* Colored Top Section */}
                <div style={{
                  background: section.gradient,
                  padding: '28px 28px 24px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Decorative */}
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ position: 'absolute', bottom: -40, left: '45%', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                  {/* Badge */}
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 99, padding: '4px 14px',
                    fontSize: 11, fontWeight: 700, color: 'white',
                    marginBottom: 18, border: '1px solid rgba(255,255,255,0.3)',
                  }}>
                    {section.badge}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <div>
                      <div style={{ fontSize: 52, marginBottom: 10, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>{section.icon}</div>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 4 }}>
                        {section.title}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                        {section.titleHindi}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 14, padding: '10px 16px',
                      textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)',
                    }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {section.stats}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Content */}
                <div style={{ padding: '22px 28px 28px', background: section.bg }}>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, marginBottom: 18 }}>
                    {section.desc}
                  </p>

                  {/* Feature Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
                    {section.features.map(function(f) {
                      return (
                        <span key={f} style={{
                          fontSize: 12, padding: '4px 12px', borderRadius: 99,
                          background: 'white', color: section.color, fontWeight: 600,
                          border: '1.5px solid ' + section.color + '30',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        }}>
                          {f}
                        </span>
                      )
                    })}
                  </div>

                  {/* CTA Button */}
                  <button style={{
                    width: '100%', padding: '14px',
                    borderRadius: 99, background: section.gradient,
                    color: 'white', border: 'none', fontWeight: 700,
                    fontSize: 15, cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    letterSpacing: '0.3px',
                  }}
                    onMouseEnter={function(e) { e.currentTarget.style.transform = 'scale(1.02)' }}
                    onMouseLeave={function(e) { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    {section.btnText}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ══ TRUST SECTION ══ */}
        <div style={{
          background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 50%, #6B21A8 100%)',
          borderRadius: 28, padding: '40px 28px', marginBottom: 40,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

          <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 700, color: 'white', marginBottom: 4 }}>
              Why NukkadMarket? 🏆
            </div>
            <div style={{
              fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Delhi NCR ka sabse trusted nukkad
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, position: 'relative', zIndex: 1 }}>
            {trustPoints.map(function(item) {
              return (
                <div key={item.title} style={{
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 20, padding: '22px 16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center', transition: 'all 0.2s',
                }}
                  onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(245,158,11,0.12)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ══ CTA BANNER ══ */}
        <div style={{
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          borderRadius: 28, padding: '40px 28px',
          textAlign: 'center', marginBottom: 40,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(245,158,11,0.3)',
        }}>
          <div style={{ position: 'absolute', top: -30, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🏪</div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 8 }}>
              Aaj Hi Apne Nukkad Pe Becho!
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>
              Free mein listing daalo — lakho buyers tak pahuncho<br />
              <span style={{ fontSize: 13, opacity: 0.85 }}>No hidden charges • No commission • 100% Free</span>
            </div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={function() { navigate('/post') }}
                style={{
                  background: 'white', color: '#D97706', border: 'none',
                  padding: '14px 36px', borderRadius: 99, fontWeight: 800,
                  fontSize: 15, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}>
                ➕ Post Free Ad
              </button>
              <button
                onClick={function() { navigate('/browse') }}
                style={{
                  background: 'rgba(255,255,255,0.2)', color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  padding: '14px 36px', borderRadius: 99, fontWeight: 700,
                  fontSize: 15, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                }}>
                🔍 Browse Listings
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}