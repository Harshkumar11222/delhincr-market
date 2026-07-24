import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location  = useNavigate()
  const navigate  = useNavigate()
  const loc       = useLocation()
  const [search, setSearch]   = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(function() {
    var saved = localStorage.getItem('nukkad-theme')
    if (saved === 'dark') { setDarkMode(true); document.documentElement.setAttribute('data-theme', 'dark') }
    function onScroll() { setScrolled(window.scrollY > 10) }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleDark() {
    var newMode = !darkMode
    setDarkMode(newMode)
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light')
    localStorage.setItem('nukkad-theme', newMode ? 'dark' : 'light')
  }

  function handleSearch(e) {
    if (e.key === 'Enter' && search.trim()) {
      navigate('/browse?search=' + encodeURIComponent(search.trim()))
      setSearch('')
    }
  }

  var navLinks = [
    { path: '/',         label: 'Home' },
    { path: '/browse',   label: 'Listings' },
    { path: '/services', label: 'Services' },
    { path: '/about',    label: 'About Us' },
    { path: '/support',  label: 'Contact' },
  ]

  var bottomNav = [
    { path: '/',         icon: '🏠', label: 'Home' },
    { path: '/browse',   icon: '🔍', label: 'Browse' },
    { path: '/post',     icon: '➕', label: 'Sell' },
    { path: '/rentals',  icon: '🚗', label: 'Rentals' },
    { path: '/orders',   icon: '📦', label: 'Orders' },
    { path: '/messages', icon: '💬', label: 'Chat' },
    { path: user ? '/profile' : '/login', icon: '👤', label: user ? 'Me' : 'Login' },
  ]

  return (
    <>
      {/* Top Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: darkMode
          ? 'rgba(10,22,40,0.97)'
          : scrolled ? 'rgba(255,255,255,0.98)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid ' + (darkMode ? 'rgba(14,165,160,0.15)' : '#E2E8F0'),
        boxShadow: scrolled ? '0 2px 20px rgba(14,165,160,0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 68, gap: 24 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #0EA5A0, #0C8A85)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 12px rgba(14,165,160,0.3)' }}>
              🏪
            </div>
            <div className="hide-mobile">
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 20, lineHeight: 1, color: darkMode ? '#F1F5F9' : '#0F2A3F' }}>
                <span style={{ color: '#0F2A3F' }}>Nukkad</span>
                <span style={{ color: '#0EA5A0' }}>Market</span>
              </div>
              <div style={{ fontSize: 10, color: '#0EA5A0', fontWeight: 600, letterSpacing: '0.5px' }}>
                Apna Shehar, Apna Bazaar
              </div>
            </div>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map(function(item) {
              var isActive = loc.pathname === item.path
              return (
                <Link key={item.path} to={item.path} style={{
                  color: isActive ? '#0EA5A0' : darkMode ? '#94A3B8' : '#475569',
                  fontSize: 14, fontWeight: isActive ? 700 : 500,
                  padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
                  borderBottom: isActive ? '2px solid #0EA5A0' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Search */}
          <div className="hide-mobile" style={{
            flex: 1, maxWidth: 360, display: 'flex', alignItems: 'center',
            background: darkMode ? 'rgba(14,165,160,0.08)' : '#F8FAFC',
            borderRadius: 99, border: '1.5px solid ' + (darkMode ? 'rgba(14,165,160,0.2)' : '#E2E8F0'),
            padding: '0 16px', gap: 8,
          }}>
            <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products, services..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: darkMode ? '#F1F5F9' : '#0F2A3F', fontSize: 14, flex: 1, padding: '10px 0' }}
            />
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>

            {/* Dark Mode Toggle */}
            <button onClick={toggleDark} style={{
              background: darkMode ? 'rgba(14,165,160,0.15)' : '#F1F5F9',
              border: '1.5px solid ' + (darkMode ? 'rgba(14,165,160,0.3)' : '#E2E8F0'),
              borderRadius: 99, padding: '6px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600,
              color: darkMode ? '#0EA5A0' : '#475569',
              transition: 'all 0.2s',
            }}>
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            <NotificationBell />

            {/* Login / Profile */}
            {user ? (
              <img
                src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0EA5A0&color=fff&size=36'}
                alt={user.name}
                onClick={() => navigate('/profile')}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0EA5A0', cursor: 'pointer' }}
              />
            ) : (
              <Link to="/login" style={{
                color: darkMode ? '#94A3B8' : '#475569', fontSize: 14, fontWeight: 600,
                padding: '8px 14px', borderRadius: 8, textDecoration: 'none',
                border: '1.5px solid ' + (darkMode ? 'rgba(14,165,160,0.2)' : '#E2E8F0'),
                display: 'flex', alignItems: 'center', gap: 6,
              }} className="hide-mobile">
                👤 Login
              </Link>
            )}

            {/* Post Ad Button */}
            <button onClick={() => navigate('/post')} style={{
              background: 'linear-gradient(135deg, #0EA5A0, #0C8A85)',
              color: 'white', border: 'none', borderRadius: 99,
              padding: '9px 18px', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 12px rgba(14,165,160,0.3)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ➕ Post Your Ad
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Nav (Mobile) */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: darkMode ? '#0A1628' : '#FFFFFF',
        borderTop: '1px solid ' + (darkMode ? 'rgba(14,165,160,0.15)' : '#E2E8F0'),
        display: 'flex', height: 60,
        boxShadow: '0 -4px 20px rgba(14,165,160,0.08)',
      }}>
        {bottomNav.map(function(item) {
          var isActive = loc.pathname === item.path
          return (
            <Link key={item.path} to={item.path} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', gap: 2,
              color: isActive ? '#0EA5A0' : darkMode ? '#64748B' : '#94A3B8',
              fontSize: 9, fontWeight: 700,
              borderTop: '2px solid ' + (isActive ? '#0EA5A0' : 'transparent'),
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}