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
      color: '#1E3A8A',
      gradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      bg: '#EFF6FF',
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
      color: '#7C3AED',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
      bg: '#F5F3FF',
      path: '/post',
      btnText: 'Post Your Ad →',
      stats: '100% Free Forever',
      badge: '💰 Earn Money',
    },
  ]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2167 0%, #1E3A8A 40%, #1D4ED8 70%, #FF6B35 100%)',
        padding: '80px 16px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,107,53,0.12)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '10%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)', borderRadius: 99, padding: '6px 18px',
            fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 20,
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            🚀 Delhi NCR ka #1 Trusted Marketplace
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.15,
          }}>
            अपना शहर,<br />अपना बाज़ार
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
            Buy • Sell • Services • Rentals<br />
            <span style={{ fontSize: 14, opacity: 0.7 }}>Verified, Safe aur 100% Local — Sirf Delhi NCR ke liye</span>
          </p>

          {/* Search */}
          <div style={{
            maxWidth: 560, margin: '0 auto 40px', display: 'flex',
            background: 'white', borderRadius: 99,
            boxShadow: '0 8px 40px rgba(0,0,0,0.25)', overflow: 'hidden',
          }}>
            <span style={{ padding: '0 16px', fontSize: 20, display: 'flex', alignItems: 'center' }}>🔍</span>
            <input
              value={search}
              onChange={function(e) { setSearch(e.target.value) }}
              onKeyDown={function(e) { if (e.key === 'Enter' && search.trim()) navigate('/browse?search=' + encodeURIComponent(search.trim())) }}
              placeholder="Laptop, plumber, car rental..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Nunito, sans-serif', padding: '16px 0', background: 'transparent' }}
            />
            <button
              onClick={function() { if (search.trim()) navigate('/browse?search=' + encodeURIComponent(search.trim())) }}
              style={{ background: '#FF6B35', color: 'white', border: 'none', padding: '0 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
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
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#FF6B35' }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION CARDS ── */}
      <div className="container" style={{ marginTop: -40, paddingBottom: 60 }}>

        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 20 }}>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
            Kya dhundh rahe ho? 🎯
          </div>
          <div style={{ fontSize: 15, color: '#6B7280' }}>
            Apna section choose karo — sab kuch ek jagah
          </div>
        </div>

        {/* 4 Section Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 60 }}>
          {sections.map(function(section) {
            return (
              <div key={section.title}
                onClick={function() { navigate(section.path) }}
                style={{
                  background: 'white', borderRadius: 24, overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)', cursor: 'pointer',
                  border: '2px solid transparent', transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={function(e) {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.15)'
                  e.currentTarget.style.borderColor = section.color
                }}
                onMouseLeave={function(e) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                {/* Top colored section */}
                <div style={{
                  background: section.gradient,
                  padding: '28px 28px 20px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Decorative circle */}
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                  {/* Badge */}
                  <div style={{
                    display: 'inline-block', background: 'rgba(255,255,255,0.2)',
                    borderRadius: 99, padding: '4px 12px', fontSize: 11,
                    fontWeight: 700, color: 'white', marginBottom: 16,
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}>
                    {section.badge}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 48, marginBottom: 8 }}>{section.icon}</div>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 4 }}>
                        {section.title}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                        {section.titleHindi}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.15)', borderRadius: 12,
                      padding: '8px 14px', textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{section.stats}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom content */}
                <div style={{ padding: '20px 28px 24px', background: section.bg }}>
                  {/* Description */}
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 16 }}>
                    {section.desc}
                  </p>

                  {/* Feature tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    {section.features.map(function(f) {
                      return (
                        <span key={f} style={{
                          fontSize: 12, padding: '4px 10px', borderRadius: 99,
                          background: 'white', color: section.color,
                          fontWeight: 600, border: '1.5px solid ' + section.color + '33',
                        }}>
                          {f}
                        </span>
                      )
                    })}
                  </div>

                  {/* CTA Button */}
                  <button style={{
                    width: '100%', padding: '14px', borderRadius: 99,
                    background: section.gradient, color: 'white',
                    border: 'none', fontWeight: 700, fontSize: 15,
                    cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                  }}>
                    {section.btnText}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── TRUST SECTION ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2167, #1E3A8A)',
          borderRadius: 24, padding: '36px 28px', marginBottom: 40,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 4 }}>
              Why DelhiNCR Market? 🏆
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              Delhi NCR ka sabse trusted local platform
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'center' }}>
            {[
              { icon: '✅', title: 'Verified Sellers',   desc: 'Har seller verified hai — safe deal guaranteed' },
              { icon: '🔒', title: 'Secure Payments',    desc: 'UPI escrow — pehle item dekho phir pay karo' },
              { icon: '📍', title: 'Hyper Local',        desc: 'Sirf 5km radius — truly local marketplace' },
              { icon: '💬', title: 'Direct Chat',        desc: 'Buyer-seller directly baat karo — no middleman' },
              { icon: '🚀', title: 'Free Listing',       desc: 'Item list karo bilkul free — koi hidden charges nahi' },
              { icon: '⭐', title: 'Trusted Reviews',    desc: 'Real reviews — real users se — fake nahi' },
            ].map(function(item) {
              return (
                <div key={item.title} style={{
                  background: 'rgba(255,255,255,0.08)', borderRadius: 16,
                  padding: '20px 14px', border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #FF6B35, #E55A26)',
          borderRadius: 24, padding: '36px 28px', textAlign: 'center', marginBottom: 40,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Aaj Hi Shuru Karo!
          </div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginBottom: 24, lineHeight: 1.7 }}>
            Free mein listing daalo — lakho buyers tak pahuncho<br />
            <span style={{ fontSize: 13, opacity: 0.8 }}>No hidden charges • No commission • 100% Free</span>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={function() { navigate('/post') }}
              style={{
                background: 'white', color: '#FF6B35', border: 'none',
                padding: '14px 32px', borderRadius: 99, fontWeight: 800,
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
                padding: '14px 32px', borderRadius: 99, fontWeight: 700,
                fontSize: 15, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              }}>
              🔍 Browse Listings
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}