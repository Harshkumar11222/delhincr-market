import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { POPULAR_CITIES } from '../data/india'

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
      desc: 'Poore India mein used items buy aur sell karo — 100+ cities mein. Laptops, phones, cars, furniture aur bahut kuch.',
      features: ['📱 Electronics', '🚗 Vehicles', '🛋️ Furniture', '🏡 Property', '💼 Jobs'],
      color: '#6B21A8',
      gradient: 'linear-gradient(135deg, #6B21A8 0%, #7C3AED 100%)',
      bg: '#F5F3FF',
      path: '/browse',
      btnText: 'Browse Listings →',
      stats: '50,000+ Listings',
      badge: '🔥 Most Popular',
    },
    {
      icon: '🔧',
      title: 'Local Services',
      titleHindi: 'लोकल सर्विसेज़',
      desc: 'Verified professionals dhundho — plumber, electrician, carpenter. 100+ cities mein available. Ghar baithe booking karo.',
      features: ['🔧 Plumber', '⚡ Electrician', '👨‍🍳 Cook', '📖 Tutor', '💇 Salon'],
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      bg: '#ECFDF5',
      path: '/services',
      btnText: 'Find Professionals →',
      stats: '10,000+ Pros',
      badge: '✅ Verified Only',
    },
    {
      icon: '🚗',
      title: 'Vehicle Rentals',
      titleHindi: 'वाहन किराये पर',
      desc: 'Car, bike, scooty aur cycle rent karo. Hourly aur daily rates. Poore India mein best prices guaranteed.',
      features: ['🚗 Cars', '🏍️ Bikes', '🛵 Scooty', '🚲 Cycles', '🚐 Vans'],
      color: '#DC2626',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
      bg: '#FEF2F2',
      path: '/rentals',
      btnText: 'Rent a Vehicle →',
      stats: 'Best Rates in India',
      badge: '🆕 New Section',
    },
    {
      icon: '➕',
      title: 'Post Free Ad',
      titleHindi: 'फ्री में बेचो',
      desc: 'Apna item list karo bilkul free mein. Crores of buyers tak pahuncho. 2 minute mein listing live!',
      features: ['📸 Photo Upload', '✅ Free Forever', '📍 India-wide', '💬 Direct Chat', '🔒 Safe & Secure'],
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
    { icon: '🇮🇳', title: '100+ Cities',      desc: 'Delhi se Mumbai, Bangalore se Kolkata — har shehar mein' },
    { icon: '✅',  title: 'Verified Sellers', desc: 'Aadhaar-linked profiles — fake sellers zero tolerance' },
    { icon: '🔒',  title: 'Secure Platform',  desc: 'Bank-grade security — aapka data safe hai' },
    { icon: '📍',  title: 'Hyper Local',      desc: 'Apne mohalle mein hi milega — delivery nahi, meetup' },
    { icon: '🚀',  title: '100% Free',        desc: 'Listing daalo free mein — koi commission nahi kabhi' },
    { icon: '💬',  title: 'Direct Chat',      desc: 'Buyer-seller directly baat karo — no middleman ever' },
  ]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>

      {/* ══ HERO ══ */}
      <div style={{
        background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 30%, #6B21A8 65%, #F59E0B 100%)',
        padding: '84px 16px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '15%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(245,158,11,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,158,11,0.2)', backdropFilter: 'blur(8px)',
            borderRadius: 99, padding: '6px 18px', fontSize: 13,
            color: '#FCD34D', marginBottom: 24,
            border: '1px solid rgba(245,158,11,0.3)', fontWeight: 600,
          }}>
            🇮🇳 India ka #1 Hyperlocal Marketplace
          </div>

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
            Apna Shehar, Apna Bazaar
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 36, lineHeight: 1.8 }}>
            Buy • Sell • Services • Rentals<br />
            <span style={{ fontSize: 13, opacity: 0.7 }}>
              Verified, Safe aur 100% Local — Har Shehar, Har Nukkad
            </span>
          </p>

          {/* Search */}
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
              placeholder="Laptop, plumber, bike rental, property..."
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
              { num: '50,000+', label: 'Listings' },
              { num: '10,000+', label: 'Verified Sellers' },
              { num: '500+',    label: 'Service Pros' },
              { num: '100+',    label: 'Cities' },
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

      <div className="container" style={{ marginTop: -8, paddingBottom: 10 }}>

        {/* Section heading */}
        <div style={{
          textAlign: 'center', marginBottom: 32,
          background: 'white', borderRadius: 20,
          padding: '24px 20px 16px',
          marginTop: 8,
          boxShadow: '0 2px 12px rgba(107,33,168,0.06)',
          border: '1px solid rgba(107,33,168,0.08)',
        }}>
          <div style={{
            fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 700,
            background: 'linear-gradient(135deg, #6B21A8, #7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}>
            Kya dhundh rahe ho? 🎯
          </div>
          <div style={{ fontSize: 14, color: '#6B7280' }}>
            Apna section choose karo — sab kuch ek jagah
          </div>
        </div>

        {/* 4 Section Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 48 }}>
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
                {/* Top */}
                <div style={{
                  background: section.gradient,
                  padding: '28px 28px 24px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ position: 'absolute', bottom: -40, left: '45%', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                  <div style={{
                    display: 'inline-block', background: 'rgba(255,255,255,0.2)',
                    borderRadius: 99, padding: '4px 14px', fontSize: 11,
                    fontWeight: 700, color: 'white', marginBottom: 18,
                    border: '1px solid rgba(255,255,255,0.3)',
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
                      background: 'rgba(255,255,255,0.15)', borderRadius: 14,
                      padding: '10px 16px', textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {section.stats}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div style={{ padding: '22px 28px 28px', background: section.bg }}>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, marginBottom: 18 }}>
                    {section.desc}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 15 }}>
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
                  <button style={{
                    width: '100%', padding: '14px', borderRadius: 99,
                    background: section.gradient, color: 'white', border: 'none',
                    fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s', letterSpacing: '0.3px',
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

        {/* Popular Cities */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 700, color: '#111827' }}>
                Popular Cities 🏙️
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Apne shehar mein browse karo</div>
            </div>
            <button onClick={function() { navigate('/browse') }}
              style={{ background: 'none', border: 'none', color: '#6B21A8', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              View All →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
            {POPULAR_CITIES.slice(0, 12).map(function(item) {
              return (
                <div key={item.city}
                  onClick={function() { navigate('/browse?city=' + item.city) }}
                  style={{
                    background: 'white', borderRadius: 16, padding: '16px 10px',
                    textAlign: 'center', cursor: 'pointer',
                    border: '2px solid transparent',
                    boxShadow: '0 2px 8px rgba(107,33,168,0.06)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={function(e) {
                    e.currentTarget.style.borderColor = '#6B21A8'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(107,33,168,0.15)'
                  }}
                  onMouseLeave={function(e) {
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(107,33,168,0.06)'
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{item.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{item.city}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>{item.state}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Trust Section */}
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
              India ka sabse trusted hyperlocal platform
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
                  onMouseEnter={function(e) {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.12)'
                    e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'
                  }}
                  onMouseLeave={function(e) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Banner */}
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
              Free mein listing daalo — crores of buyers tak pahuncho<br />
              <span style={{ fontSize: 13, opacity: 0.85 }}>No hidden charges • No commission • 100% Free</span>
            </div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={function() { navigate('/post') }}
                style={{
                  background: 'white', color: '#D97706', border: 'none',
                  padding: '14px 36px', borderRadius: 99, fontWeight: 800,
                  fontSize: 15, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}>
                ➕ Post Free Ad
              </button>
              <button onClick={function() { navigate('/browse') }}
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

{/* Support Banner */}
<div style={{
  background: 'white', borderRadius: 16, padding: '16px 20px',  // ← 28px se 16px kiya
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  flexWrap: 'wrap', gap: 12, marginBottom: 24,  // ← gap aur margin bhi kam kiya
  boxShadow: '0 2px 12px rgba(107,33,168,0.06)',
  border: '1.5px solid rgba(107,33,168,0.08)',
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{
      width: 44, height: 44,  // ← 56 se 44 kiya
      background: 'linear-gradient(135deg, #6B21A8, #7C3AED)',
      borderRadius: 12, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 22, flexShrink: 0,
    }}>🤝</div>
    <div>
      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#111827' }}>
        Koi problem? Hum yahan hain!
      </div>
      <div style={{ fontSize: 12, color: '#6B7280' }}>
        📞 +91 70552 52609 &nbsp;|&nbsp; 📧 nukkadmarket25@gmail.com
      </div>
    </div>
  </div>
  <div style={{ display: 'flex', gap: 8 }}>
    <a href="tel:+917055252609" style={{ background: 'linear-gradient(135deg, #6B21A8, #7C3AED)', color: 'white', borderRadius: 99, padding: '8px 16px', fontWeight: 700, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
      📞 Call
    </a>
    <a href="https://wa.me/917055252609" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white', borderRadius: 99, padding: '8px 16px', fontWeight: 700, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
      💬 WhatsApp
    </a>
    <button onClick={function() { navigate('/support') }} style={{ background: 'white', color: '#6B21A8', border: '1.5px solid #6B21A8', borderRadius: 99, padding: '8px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
      Help Center
    </button>
  </div>
</div>

      </div>
    </div>
  )
}