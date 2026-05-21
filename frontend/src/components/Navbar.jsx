import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [search, setSearch] = useState('')

  const navItems = [
    { path: '/',         icon: '🏠', label: 'Home' },
    { path: '/browse',   icon: '🔍', label: 'Browse' },
    { path: '/post',     icon: '➕', label: 'Sell' },
    { path: '/rentals',  icon: '🚗', label: 'Rentals' },
    { path: '/orders',   icon: '📦', label: 'Orders' },
    { path: '/messages', icon: '💬', label: 'Chat' },
    { path: user ? '/profile' : '/login', icon: '👤', label: user ? 'Profile' : 'Login' },
  ]

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate('/browse?search=' + encodeURIComponent(search.trim()))
    }
  }

  return (
    <>
      {/* ── TOP NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 50%, #6B21A8 100%)',
        boxShadow: '0 2px 20px rgba(107,33,168,0.4)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 16px',
          display: 'flex', alignItems: 'center', height: 64, gap: 16,
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20,
            }}>🏪</div>
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontWeight: 800, fontSize: 20, color: 'white', lineHeight: 1 }}>
                NukkadMarket
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
                Apna Nukkad, Apna Bazaar
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.12)', borderRadius: 9999,
            padding: '0 14px', gap: 8, maxWidth: 420,
            border: '1px solid rgba(255,255,255,0.2)',
          }} className="hide-mobile">
            <span style={{ fontSize: 16 }}>🔍</span>
            <input
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'white', fontSize: 14, flex: 1, padding: '9px 0',
                fontFamily: 'Nunito, sans-serif',
              }}
              placeholder="Search laptops, plumbers, flats..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }} className="hide-mobile">
            <Link to="/browse" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, padding: '6px 12px', borderRadius: 8, textDecoration: 'none' }}>
              Browse
            </Link>
            <Link to="/services" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, padding: '6px 12px', borderRadius: 8, textDecoration: 'none' }}>
              Services
            </Link>
            <Link to="/rentals" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, padding: '6px 12px', borderRadius: 8, textDecoration: 'none' }}>
              🚗 Rentals
            </Link>
            {user && (
              <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, padding: '6px 12px', borderRadius: 8, textDecoration: 'none' }}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NotificationBell />
            <button
              onClick={() => navigate('/post')}
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'white', padding: '8px 18px', borderRadius: 9999,
                fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              ➕ Sell
            </button>
            {user ? (
              <img
                src={user.avatar || 'https://i.pravatar.cc/36?u=' + user.phone}
                alt={user.name}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(245,158,11,0.6)', cursor: 'pointer' }}
                onClick={() => navigate('/profile')}
              />
            ) : (
              <Link to="/login" style={{
                color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600,
                padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
                background: 'rgba(255,255,255,0.15)',
              }} className="hide-mobile">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── BOTTOM NAV (Mobile) ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: 'white', borderTop: '1px solid #E5E7EB',
        display: 'flex', boxShadow: '0 -4px 20px rgba(107,33,168,0.1)',
      }}>
        {navItems.map(function(item) {
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '8px 0', textDecoration: 'none',
                color: location.pathname === item.path ? '#6B21A8' : '#6B7280',
                fontSize: 10, fontWeight: 600, gap: 2, transition: 'color 0.2s',
              }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}