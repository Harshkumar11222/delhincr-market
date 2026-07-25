import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(function() {
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return function() { observer.disconnect() }
  }, [])
  return [ref, inView]
}

function AnimatedSection({ children, delay = 0 }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: 'all 0.7s ease ' + delay + 'ms',
    }}>
      {children}
    </div>
  )
}

function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()
  useEffect(function() {
    if (!inView) return
    var start = 0
    var step = end / (duration / 16)
    var timer = setInterval(function() {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return function() { clearInterval(timer) }
  }, [inView])
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>
}

export default function About() {
  const navigate = useNavigate()
  const [activeTeam, setActiveTeam] = useState(null)
  const [activeFaq, setActiveFaq] = useState(null)

  var stats = [
    { num: 50000, suffix: '+', label: 'Active Listings', icon: '🛍️', color: '#0EA5A0' },
    { num: 10000, suffix: '+', label: 'Happy Users',     icon: '😊', color: '#0EA5A0' },
    { num: 100,   suffix: '+', label: 'Cities',          icon: '🏙️', color: '#059669' },
    { num: 98,    suffix: '%', label: 'Satisfaction',    icon: '⭐', color: '#DC2626' },
  ]

  var features = [
    {
      icon: '🇮🇳', title: 'Made for Bharat',
      desc: 'Delhi se Kochi, Mumbai se Guwahati — poore India ke liye banaya. Hindi aur English dono mein.',
      color: '#FF6B35', bg: '#FFF0EB',
    },
    {
      icon: '🔒', title: 'Safe & Secure',
      desc: 'Bank-grade encryption, verified sellers, aur 24/7 fraud monitoring. Aapka data hamesha safe.',
      color: '#0EA5A0', bg: '#E6F7F7',
    },
    {
      icon: '🚀', title: '100% Free — Forever',
      desc: 'Listing daalo free mein. Koi hidden charges, koi commission, koi subscription. Hamesha free.',
      color: '#059669', bg: '#ECFDF5',
    },
    {
      icon: '📍', title: 'Hyper Local',
      desc: 'Apne mohalle mein deal karo. No delivery, no shipping — seedha meetup aur deal done.',
      color: '#2563EB', bg: '#EFF6FF',
    },
    {
      icon: '💬', title: 'Direct Chat',
      desc: 'Real-time messaging, no middleman. Buyer aur seller directly baat karo — fast aur convenient.',
      color: '#D97706', bg: '#FFFBEB',
    },
    {
      icon: '⚡', title: '2 Min Listing',
      desc: 'Photo khicho, price daalo, city select karo — 2 minute mein listing live! Itna simple.',
      color: '#DC2626', bg: '#FEF2F2',
    },
  ]

  var timeline = [
    { year: '2024', title: 'Idea Born', desc: 'Delhi NCR ke ek chote se nukkad pe idea aaya — local marketplace banana jo sach mein local ho.', icon: '💡' },
    { year: '2024', title: 'NukkadMarket Launch', desc: 'Delhi NCR se shuru kiya — pehle 100 users, pehla sale, pehli khushi!', icon: '🚀' },
    { year: '2025', title: 'All India Expansion', desc: '100+ cities mein expand kiya. Mumbai, Bangalore, Chennai — har jagah nukkad bana.', icon: '🇮🇳' },
    { year: '2025', title: 'Services & Rentals', desc: 'Sirf buy/sell nahi — local services aur vehicle rentals bhi add kiye. Ek complete platform.', icon: '🔧' },
    { year: '2025', title: '10,000+ Users', desc: 'Ek family ban gayi — har roz hazaron deals, lakhs ka business, crores ki savings.', icon: '🎉' },
    { year: '2026', title: 'Future', desc: 'Mobile app, AI recommendations, aur bahut kuch aane wala hai. Yeh sirf shuruat hai!', icon: '🌟' },
  ]

  var team = [
    { name: 'Harsh Kumar', role: 'Founder & CEO', emoji: '👨‍💻', desc: 'Full stack developer jo chahta hai India ka har nukkad connected ho.', city: 'Delhi' },
    { name: 'You!', role: 'Our Community', emoji: '🤝', desc: 'NukkadMarket ka sabse important part aap hain — buyers, sellers, service providers.', city: 'All India' },
  ]

  var faqs = [
    { q: 'NukkadMarket free hai?', a: 'Haan! 100% free. Listing daalna free, browsing free, chatting free. Koi hidden charges nahi kabhi.' },
    { q: 'NukkadMarket safe hai?', a: 'Bilkul! Verified sellers, real-time fraud detection, secure data encryption. Hum aapki safety first rakhte hain.' },
    { q: 'Kaise contact karein?', a: 'Phone/WhatsApp: +91 70552 52609 | Email: nukkadmarket25@gmail.com | Mon-Sat 9AM-7PM.' },
    { q: 'Ye kahan available hai?', a: '100+ cities mein — Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune aur bahut zyada!' },
    { q: 'App available hai?', a: 'Website mobile-friendly hai aur PWA install kar sakte ho — home screen pe app jaisa feel milega!' },
  ]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 64 }}>

      {/* ══ HERO SECTION ══ */}
      <section style={{
        background: 'linear-gradient(135deg, #0F2A3F 0%, #0C8A85 25%, #0EA5A0 60%, #0EA5A0 100%)',
        padding: '80px 16px 120px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative bubbles */}
        {[
          { size: 320, top: -80, right: -80, opacity: 0.06 },
          { size: 200, bottom: -60, left: -40, opacity: 0.04 },
          { size: 120, top: '40%', left: '15%', opacity: 0.05 },
          { size: 80,  top: '20%', right: '20%', opacity: 0.07 },
        ].map(function(b, i) {
          return (
            <div key={i} style={{
              position: 'absolute', width: b.size, height: b.size,
              borderRadius: '50%', background: 'rgba(245,158,11,' + b.opacity + ')',
              top: b.top, bottom: b.bottom, left: b.left, right: b.right,
            }} />
          )
        })}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,158,11,0.2)', borderRadius: 99,
            padding: '8px 20px', fontSize: 13, color: '#7FDED9',
            border: '1px solid rgba(245,158,11,0.3)', fontWeight: 700,
            marginBottom: 28,
          }}>
            🏪 India ka #1 Hyperlocal Marketplace
          </div>

          <h1 style={{
            fontFamily: 'Baloo 2, cursive',
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 800, color: 'white',
            lineHeight: 1.05, marginBottom: 12,
          }}>
            Apna Nukkad,<br />
            <span style={{ background: 'linear-gradient(135deg, #7FDED9, #0EA5A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Apna Bazaar
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 48, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 48px' }}>
            Hum India ke har nukkad ko ek vibrant marketplace banana chahte hain — jahan every Indian buy, sell, aur connect kar sake. Free. Safe. Local.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={function() { navigate('/browse') }} style={{
              background: 'white', color: '##0EA5A0', border: 'none',
              padding: '16px 36px', borderRadius: 99, fontWeight: 800,
              fontSize: 16, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🔍 Explore Marketplace
            </button>
            <button onClick={function() { navigate('/post') }} style={{
              background: 'linear-gradient(135deg, #0EA5A0, #D97706)', color: 'white',
              border: 'none', padding: '16px 36px', borderRadius: 99,
              fontWeight: 800, fontSize: 16, cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ➕ Post Free Ad
            </button>
          </div>
        </div>
      </section>

      {/* ══ STATS SECTION ══ */}
      <section style={{ background: 'white', padding: '60px 16px' }}>
        <div className="container">
          <AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              {stats.map(function(s) {
                return (
                  <div key={s.label} style={{
                    textAlign: 'center', padding: '32px 20px',
                    borderRadius: 24, background: '#F8FAFC',
                    border: '2px solid ' + s.color + '20',
                    transition: 'all 0.3s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = s.color + '08'; e.currentTarget.style.borderColor = s.color + '40'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = s.color + '20'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ fontSize: 44, marginBottom: 12 }}>{s.icon}</div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 44, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                      <CountUp end={s.num} suffix={s.suffix} />
                    </div>
                    <div style={{ fontSize: 15, color: '#6B7280', fontWeight: 600, marginTop: 8 }}>{s.label}</div>
                  </div>
                )
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ MISSION SECTION ══ */}
      <section style={{ padding: '80px 16px', background: 'linear-gradient(135deg, #0F2A3F, #0C8A85, #0EA5A0)' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'white', marginBottom: 16 }}>
                Hamara Mission 🎯
              </div>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
                India mein <strong style={{ color: '#7FDED9' }}>har cheez ka ek nukkad</strong> hota hai — jahan log milte hain, sauda karte hain, aur connections banate hain. Hum wohi experience digital duniya mein laana chahte hain.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { icon: '🌱', title: 'Empowering Small Sellers', desc: 'India ke crores small sellers ko ek platform dena jahan wo apna saman directly buyers tak pahuncha sakein — bina kisi middleman ke.', color: '#6EE7B7' },
              { icon: '🤝', title: 'Building Trust', desc: 'Har transaction mein trust banana — verified sellers, secure payments, real reviews. Kyunki business sirf paison ka nahi, bharose ka bhi hai.', color: '#0EA5A0' },
              { icon: '🏙️', title: 'Connecting Communities', desc: 'Neighbors ko neighbours se connect karna. Apne shahar mein hi sauda — faster, cheaper, aur environment-friendly.', color: '#7FDED9' },
              { icon: '🇮🇳', title: 'Digital Bharat', desc: 'India ke tier 2, tier 3 cities ko bhi digital economy mein laana. NukkadMarket sirf metro cities ke liye nahi — har shehar ke liye.', color: '#FCA5A5' },
            ].map(function(item) {
              return (
                <AnimatedSection key={item.title} delay={100}>
                  <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s', height: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: item.color, marginBottom: 10 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ FEATURES SECTION ══ */}
      <section style={{ padding: '80px 16px', background: 'white' }}>
        <div className="container">
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                Kya Makes Us Special? ✨
              </div>
              <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 500, margin: '0 auto' }}>
                Sirf ek marketplace nahi — aapka apna nukkad
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {features.map(function(f, i) {
              return (
                <AnimatedSection key={f.title} delay={i * 80}>
                  <div style={{
                    background: f.bg, borderRadius: 22, padding: '28px 24px',
                    border: '2px solid transparent', transition: 'all 0.3s', height: '100%',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px ' + f.color + '20' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: f.color, marginBottom: 10 }}>{f.title}</div>
                    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.75 }}>{f.desc}</div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE SECTION ══ */}
      <section style={{ padding: '80px 16px', background: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                Hamara Safar 🗺️
              </div>
              <p style={{ fontSize: 16, color: '#6B7280' }}>Ek idea se India ka marketplace tak</p>
            </div>
          </AnimatedSection>

          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #0EA5A0, #0EA5A0)', transform: 'translateX(-50%)', borderRadius: 99 }} className="hide-mobile" />

            {timeline.map(function(item, i) {
              var isLeft = i % 2 === 0
              return (
                <AnimatedSection key={i} delay={i * 100}>
                  <div style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', marginBottom: 32, position: 'relative' }}>
                    {/* Center dot */}
                    <div className="hide-mobile" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5A0, #0EA5A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, zIndex: 1, boxShadow: '0 4px 16px 168rgba(107,33,,0.4)', border: '3px solid white' }}>
                      {item.icon}
                    </div>

                    <div style={{ width: '45%', background: 'white', borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 16px rgba(14,165,160,0.08)', border: '2px solid rgba(14,165,160,0.08)', transition: 'all 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(14,165,160,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,160,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        <span style={{ background: 'linear-gradient(135deg, #0EA5A0, #0EA5A0)', color: 'white', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 99 }}>{item.year}</span>
                      </div>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ TEAM SECTION ══ */}
      <section style={{ padding: '80px 16px', background: 'white' }}>
        <div className="container">
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                Hamare Baare Mein 👥
              </div>
              <p style={{ fontSize: 16, color: '#6B7280' }}>Passionate people building India's nukkad</p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {team.map(function(member, i) {
              return (
                <AnimatedSection key={i} delay={i * 150}>
                  <div style={{
                    background: '#F8FAFC', borderRadius: 24, padding: '36px 28px',
                    textAlign: 'center', width: 280, cursor: 'pointer',
                    border: '2px solid ' + (activeTeam === i ? '#0EA5A0' : 'transparent'),
                    boxShadow: activeTeam === i ? '0 16px 40px rgba(14,165,160,0.16)' : '0 4px 16px rgba(14,165,160,0.06)',
                    transition: 'all 0.3s',
                  }}
                    onClick={() => setActiveTeam(activeTeam === i ? null : i)}
                  >
                    <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5A0, #0EA5A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(14,165,160,0.3)' }}>
                      {member.emoji}
                    </div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{member.name}</div>
                    <div style={{ background: 'linear-gradient(135deg, #0EA5A0, #0EA5A0)', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99, display: 'inline-block', marginBottom: 12 }}>{member.role}</div>
                    <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{member.desc}</div>
                    <div style={{ marginTop: 12, fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      📍 {member.city}
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ FAQ SECTION ══ */}
      <section style={{ padding: '80px 16px', background: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                Sawaal Jawab ❓
              </div>
              <p style={{ fontSize: 16, color: '#6B7280' }}>Aapke common questions ke answers</p>
            </div>
          </AnimatedSection>

          {faqs.map(function(faq, i) {
            return (
              <AnimatedSection key={i} delay={i * 80}>
                <div style={{
                  background: 'white', borderRadius: 18, marginBottom: 12,
                  border: '2px solid ' + (activeFaq === i ? '#0EA5A0' : 'transparent'),
                  boxShadow: activeFaq === i ? '0 8px 24px rgba(14,165,160,0.12)' : '0 2px 10px rgba(0,0,0,0.04)',
                  overflow: 'hidden', transition: 'all 0.25s',
                }}>
                  <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '20px 24px',
                    background: activeFaq === i ? '#E6F7F7' : 'none',
                    border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#111827', flex: 1 }}>{faq.q}</span>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: activeFaq === i ? 'linear-gradient(135deg, #0EA5A0, #0EA5A0)' : '#F3F4F6',
                      color: activeFaq === i ? 'white' : '#6B7280',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, transition: 'all 0.2s',
                      transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                    }}>▾</div>
                  </button>
                  {activeFaq === i && (
                    <div style={{ padding: '0 24px 20px' }}>
                      <div style={{ height: 1, background: '#F3F4F6', marginBottom: 16 }} />
                      <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.8 }}>{faq.a}</div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )
          })}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={() => navigate('/support')} className="btn btn-primary btn-lg">
              🤝 More Questions? Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ══ CONTACT SECTION ══ */}
      <section style={{ padding: '60px 16px', background: 'white' }}>
        <div className="container">
          <AnimatedSection>
            <div style={{
              background: 'linear-gradient(135deg, #0F2A3F, #0C8A85, #0EA5A0)',
              borderRadius: 32, padding: '56px 40px', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
              <div style={{ position: 'absolute', bottom: -60, left: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>📞</div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, color: 'white', marginBottom: 12 }}>
                  Baat Karo Humse! 🤝
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
                  Koi bhi sawaal ho, feedback ho, ya bas hello bolna ho — hum yahan hain!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 700, margin: '0 auto 36px' }}>
                  {[
                    { icon: '📞', label: 'Phone / WhatsApp', value: '+91 70552 52609', href: 'tel:+917055252609', color: '#0EA5A0' },
                    { icon: '📧', label: 'Email', value: 'nukkadmarket25@gmail.com', href: 'mailto:nukkadmarket25@gmail.com', color: '#7FDED9' },
                    { icon: '⏰', label: 'Hours', value: 'Mon-Sat, 9AM-7PM', href: null, color: '#6EE7B7' },
                  ].map(function(c) {
                    var El = c.href ? 'a' : 'div'
                    return (
                      <El key={c.label} href={c.href} style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px 16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s', cursor: c.href ? 'pointer' : 'default' }}
                        onMouseEnter={c.href ? e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)' } : undefined}
                        onMouseLeave={c.href ? e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' } : undefined}
                      >
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: c.color }}>{c.value}</div>
                      </El>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="https://wa.me/917055252609" target="_blank" rel="noopener noreferrer" style={{
                    background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white',
                    borderRadius: 99, padding: '14px 32px', fontWeight: 800,
                    fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                    boxShadow: '0 4px 16px rgba(5,150,105,0.4)',
                  }}>
                    💬 WhatsApp Karo
                  </a>
                  <button onClick={() => navigate('/support')} style={{
                    background: 'rgba(255,255,255,0.15)', color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)', borderRadius: 99,
                    padding: '14px 32px', fontWeight: 700, fontSize: 15,
                    cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                  }}>
                    🎫 Submit Ticket
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section style={{ padding: '60px 16px 80px', background: 'linear-gradient(135deg, #0EA5A0, #D97706)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <AnimatedSection>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🏪</div>
            <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 800, color: 'white', marginBottom: 12 }}>
              Apne Nukkad Ka Hissa Bano!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 17, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
              Aaj hi join karo — free listing daalo ya apna item dhundho. NukkadMarket pe sab welcome hai!
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} style={{ background: 'white', color: '#D97706', border: 'none', padding: '16px 40px', borderRadius: 99, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontFamily: 'Nunito, sans-serif', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                🚀 Join Free — Abhi!
              </button>
              <button onClick={() => navigate('/browse')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.5)', padding: '16px 40px', borderRadius: 99, fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                🔍 Explore First
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#0F0520', padding: '48px 16px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #0EA5A0, #D97706)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏪</div>
                <div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: 'white' }}>NukkadMarket</div>
                  <div style={{ fontSize: 10, color: 'rgba(245,158,11,0.7)', fontWeight: 600 }}>Apna Nukkad, Apna Bazaar</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 16 }}>
                India ka #1 hyperlocal marketplace. Buy, sell, services, rentals — sab kuch ek jagah.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: '💬', href: 'https://wa.me/917055252609' },
                  { icon: '📧', href: 'mailto:nukkadmarket25@gmail.com' },
                  { icon: '📞', href: 'tel:+917055252609' },
                ].map(function(s) {
                  return (
                    <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >{s.icon}</a>
                  )
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 16 }}>Quick Links</div>
              {[
                { label: '🛍️ Browse Listings', path: '/browse' },
                { label: '🔧 Local Services', path: '/services' },
                { label: '🚗 Vehicle Rentals', path: '/rentals' },
                { label: '➕ Post Free Ad', path: '/post' },
                { label: '📊 Dashboard', path: '/dashboard' },
              ].map(function(link) {
                return (
                  <div key={link.path} onClick={() => navigate(link.path)}
                    style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#7FDED9'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >
                    {link.label}
                  </div>
                )
              })}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 16 }}>Company</div>
              {[
                { label: 'About Us', path: '/about' },
                { label: '🤝 Support', path: '/support' },
                { label: '👤 Profile', path: '/profile' },
                { label: '📦 Orders', path: '/orders' },
                { label: '💬 Messages', path: '/messages' },
              ].map(function(link) {
                return (
                  <div key={link.path} onClick={() => navigate(link.path)}
                    style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#7FDED9'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >
                    {link.label}
                  </div>
                )
              })}
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 16 }}>Contact Us</div>
              {[
                { icon: '📞', label: '+91 70552 52609', href: 'tel:+917055252609' },
                { icon: '📧', label: 'nukkadmarket25@gmail.com', href: 'mailto:nukkadmarket25@gmail.com' },
                { icon: '💬', label: 'WhatsApp Support', href: 'https://wa.me/917055252609' },
                { icon: '⏰', label: 'Mon-Sat, 9AM-7PM', href: null },
              ].map(function(c) {
                var El = c.href ? 'a' : 'div'
                return (
                  <El key={c.label} href={c.href} target={c.href?.startsWith('http') ? '_blank' : undefined}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 10, textDecoration: 'none', cursor: c.href ? 'pointer' : 'default', transition: 'color 0.2s' }}
                    onMouseEnter={c.href ? e => e.currentTarget.style.color = '#7FDED9' : undefined}
                    onMouseLeave={c.href ? e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)' : undefined}
                  >
                    <span>{c.icon}</span> {c.label}
                  </El>
                )
              })}
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              © 2025 NukkadMarket. Made with ❤️ in India 🇮🇳
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(function(t) {
                return (
                  <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#7FDED9'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >{t}</span>
                )
              })}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}