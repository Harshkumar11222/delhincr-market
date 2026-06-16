import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [search, setSearch]       = useState('')
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(function() {
    function onScroll() { setScrolled(window.scrollY > 10) }
    window.addEventListener('scroll', onScroll)
    return function() { window.removeEventListener('scroll', onScroll) }
  }, [])

  function handleSearch(e) {
    if (e.key === 'Enter' && search.trim()) {
      navigate('/browse?search=' + encodeURIComponent(search.trim()))
      setSearch('')
    }
  }

  var navLinks = [
    { path: '/browse',   label: 'Browse',   icon: '🛍️' },
    { path: '/services', label: 'Services',  icon: '🔧' },
    { path: '/rentals',  label: 'Rentals',   icon: '🚗' },
    { path: '/about',    label: 'About',     icon: 'ℹ️' },  // ← ADD

  ]

  var bottomNav = [
    { path: '/',         icon: '🏠', label: 'Home' },
    { path: '/browse',   icon: '🔍', label: 'Browse' },
    { path: '/post',     icon: '➕', label: 'Sell' },
    { path: '/rentals',  icon: '🚗', label: 'Rentals' },
    { path: '/orders',   icon: '📦', label: 'Orders' },
    { path: '/messages', icon: '💬', label: 'Chat' },
    { path: user ? '/profile' : '/login', icon: '👤', label: user ? 'Profile' : 'Login' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled
          ? 'rgba(30, 5, 51, 0.97)'
          : 'linear-gradient(135deg, #1E0533 0%, #3B0764 50%, #6B21A8 100%)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(107,33,168,0.4)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? '1px solid rgba(245,158,11,0.15)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40, flexShrink: 0,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20,
              boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
            }}>🏪</div>
            <div className="hide-mobile">
              <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 20, color: 'white', lineHeight: 1, letterSpacing: '-0.5px' }}>
                NukkadMarket
              </div>
              <div style={{ fontSize: 10, color: 'rgba(245,158,11,0.8)', fontWeight: 600, letterSpacing: '0.5px' }}>
                अपना नुक्कड़, अपना बाज़ार
              </div>
            </div>
          </Link>

          {/* Search */}
          <div className="hide-mobile" style={{
            flex: 1, maxWidth: 440, display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.1)', borderRadius: 99,
            border: '1.5px solid rgba(255,255,255,0.15)',
            padding: '0 16px', gap: 10,
            transition: 'all 0.2s',
          }}
            onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)' }}
            onMouseLeave={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          >
            <span style={{ fontSize: 16, opacity: 0.7 }}>🔍</span>
            <input
              value={search}
              onChange={function(e) { setSearch(e.target.value) }}
              onKeyDown={handleSearch}
              placeholder="Laptop, plumber, bike..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'white', fontSize: 14, flex: 1, padding: '10px 0',
                fontFamily: 'Nunito, sans-serif',
              }}
            />
          </div>

          {/* Nav Links */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLinks.map(function(item) {
              var isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path} style={{
                  color: isActive ? '#FCD34D' : 'rgba(255,255,255,0.8)',
                  fontSize: 14, fontWeight: 600, padding: '6px 14px',
                  borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s',
                  background: isActive ? 'rgba(245,158,11,0.15)' : 'transparent',
                }}
                  onMouseEnter={function(e) { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={function(e) { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  {item.label}
                </Link>
              )
            })}
            {user && (
              <Link to="/dashboard" style={{
                color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600,
                padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
              }}>
                Dashboard
              </Link>
              
            )}
          </div>
            
          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NotificationBell />
            </div>

            <button onClick={function() { navigate('/post') }} style={{
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: 'white', border: 'none', borderRadius: 99,
              padding: '8px 20px', fontWeight: 800, fontSize: 14,
              cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'all 0.2s',
            }}
              onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(245,158,11,0.5)' }}
              onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,158,11,0.4)' }}
            >
              <span>+</span> <span className="hide-mobile">Sell</span>
            </button>

            {user ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=6B21A8&color=fff&size=36'}
                  alt={user.name}
                  onClick={function() { navigate('/profile') }}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid rgba(245,158,11,0.6)', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#F59E0B' }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)' }}
                />
              </div>
            ) : (
              <Link to="/login" className="hide-mobile" style={{
                background: 'rgba(255,255,255,0.12)', color: 'white',
                border: '1.5px solid rgba(255,255,255,0.25)',
                padding: '7px 16px', borderRadius: 99, fontSize: 13,
                fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s',
              }}>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: 'white', borderTop: '1px solid var(--gray-100)',
        display: 'flex', boxShadow: '0 -4px 20px rgba(107,33,168,0.08)',
      }}>
        {bottomNav.map(function(item) {
          var isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '8px 4px', textDecoration: 'none', gap: 2,
              color: isActive ? 'var(--primary)' : 'var(--gray-400)',
              fontSize: 9, fontWeight: 700, transition: 'color 0.2s',
              borderTop: isActive ? '2px solid var(--primary)' : '2px solid transparent',
              marginTop: -1,
            }}>
              <span style={{ fontSize: 18, filter: isActive ? 'none' : 'grayscale(0.3)' }}>{item.icon}</span>
              <span>{item.label}</span>
              <Link to="/support" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>
  Support
</Link>
<Link to="/about" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>
  About
</Link>
            </Link>
            
          )
        })}
      </nav>
    </>
  )
}