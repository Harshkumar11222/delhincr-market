import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'


const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: 'linear-gradient(135deg, #1E3A8A 0%, #1e40af 100%)',
    boxShadow: '0 2px 12px rgba(30,58,138,0.3)',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 16px',
    display: 'flex', alignItems: 'center', height: 60, gap: 16,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: {
    width: 36, height: 36, background: '#FF6B35', borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'Baloo 2, cursive',
  },
  logoText: {
    fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 18,
    color: 'white', lineHeight: 1,
  },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 400 },
  searchBar: {
    flex: 1, display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.15)', borderRadius: 9999,
    padding: '0 14px', gap: 8, maxWidth: 400,
  },
  searchInput: {
    background: 'transparent', border: 'none', outline: 'none',
    color: 'white', fontSize: 14, flex: 1, padding: '8px 0',
    fontFamily: 'Nunito, sans-serif',
  },
  actions: { display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' },
  navLink: {
    color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600,
    padding: '6px 12px', borderRadius: 8, transition: 'background 0.2s',
    textDecoration: 'none',
  },
  sellBtn: {
    background: '#FF6B35', color: 'white', padding: '8px 16px',
    borderRadius: 9999, fontSize: 14, fontWeight: 700, border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
    fontFamily: 'Nunito, sans-serif',
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%', objectFit: 'cover',
    border: '2px solid rgba(255,255,255,0.4)',
  },
  bottomNav: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
    background: 'white', borderTop: '1px solid #E5E7EB',
    display: 'flex', boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
  },
  navItem: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '8px 0', textDecoration: 'none',
    color: '#6B7280', fontSize: 10, fontWeight: 600, gap: 2,
    transition: 'color 0.2s',
  },
  navIcon: { fontSize: 22 },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const navItems = [
    { path: '/',        icon: '🏠', label: 'Home' },
    { path: '/browse',  icon: '🔍', label: 'Browse' },
    { path: '/post',    icon: '➕', label: 'Sell' },
    { path: '/orders',  icon: '📦', label: 'Orders' },   // ← YEH ADD KARO
    { path: user ? '/profile' : '/login', icon: '👤', label: user ? 'Profile' : 'Login' },
  ]

  const handleSearch = e => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/browse?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>D</div>
            <div>
              <div style={styles.logoText}>DelhiNCR</div>
              <div style={styles.logoSub}>Apna Shehar, Apna Bazaar</div>
            </div>
          </Link>

          <div style={styles.searchBar} className="hide-mobile">
            <span style={{ fontSize: 16 }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search laptops, plumbers, flats..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div style={styles.actions}>
            <Link to="/browse" style={{ ...styles.navLink }} className="hide-mobile">Browse</Link>
            <Link to="/services" style={{ ...styles.navLink }} className="hide-mobile">Services</Link>
            <Link to="/dashboard" style={{ ...styles.navLink }} className="hide-mobile">Dashboard</Link>
            <button style={styles.sellBtn} onClick={() => navigate('/post')}>
              ＋ Sell
              <NotificationBell />
            </button>
            {user ? (
              <img
                src={user.avatar || `https://i.pravatar.cc/32?u=${user.phone}`}
                alt={user.name}
                style={styles.avatar}
                onClick={() => navigate('/profile')}
                title={user.name}
              />
            ) : (
              <Link to="/login" style={{ ...styles.navLink, background: 'rgba(255,255,255,0.15)' }} className="hide-mobile">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Nav for Mobile */}
      <nav style={styles.bottomNav}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              color: location.pathname === item.path ? '#FF6B35' : '#6B7280',
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}