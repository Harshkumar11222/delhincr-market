import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  const [count, setCount] = useState(10)

  useEffect(function() {
    var timer = setInterval(function() {
      setCount(function(c) {
        if (c <= 1) { clearInterval(timer); navigate('/'); return 0 }
        return c - 1
      })
    }, 1000)
    return function() { clearInterval(timer) }
  }, [])

  var suggestions = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔍', label: 'Browse', path: '/browse' },
    { icon: '🔧', label: 'Services', path: '/services' },
    { icon: '🚗', label: 'Rentals', path: '/rentals' },
    { icon: '➕', label: 'Post Ad', path: '/post' },
    { icon: '🤝', label: 'Support', path: '/support' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F2A3F 0%, #076164 40%, #0EA5A0 70%, #0EA5A0 100%)', padding: 16 }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>

        {/* Animated 404 */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(80px, 20vw, 160px)', fontWeight: 800, color: 'rgba(255,255,255,0.1)', lineHeight: 1, userSelect: 'none' }}>
            404
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 'clamp(48px, 12vw, 80px)', animation: 'bounce 1s ease-in-out infinite' }}>
            🏪
          </div>
          <style>{`@keyframes bounce { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-16px)} }`}</style>
        </div>

        <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 800, color: 'white', marginBottom: 12 }}>
          Yeh page nahi mila! 😕
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 8 }}>
          Lagta hai aap kisi aisi jagah aa gaye jo exist nahi karti.
        </p>
        <p style={{ color: 'rgba(245,158,11,0.9)', fontSize: 14, fontWeight: 700, marginBottom: 32 }}>
          🏠 {count} seconds mein home page pe redirect ho raha hoon...
        </p>

        {/* Countdown bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 99, maxWidth: 300, margin: '0 auto 32px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(135deg, #0EA5A0, #D97706)', borderRadius: 99, width: (count / 10 * 100) + '%', transition: 'width 1s linear' }} />
        </div>

        {/* Quick navigation */}
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: 24, padding: '24px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: 16 }}>
            📍 Yahan jaana chahoge?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {suggestions.map(function(s) {
              return (
                <button key={s.path} onClick={() => navigate(s.path)} style={{
                  background: 'rgba(255,255,255,0.1)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
                  padding: '12px 8px', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 700,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.3)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }}>
          ← Wapas jao
        </button>
      </div>
    </div>
  )
}