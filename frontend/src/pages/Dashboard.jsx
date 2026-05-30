import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

function MiniChart({ data, color }) {
  var max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {data.map(function(v, i) {
        return (
          <div key={i} style={{
            flex: 1, borderRadius: 4,
            background: i === data.length - 1 ? color : color + '50',
            height: Math.max((v / max) * 100, 8) + '%',
            transition: 'height 0.5s ease',
          }} />
        )
      })}
    </div>
  )
}

function StatCard({ icon, label, value, sub, color, bg, chart, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'white', borderRadius: 20, padding: '20px',
      boxShadow: '0 4px 16px rgba(107,33,168,0.06)',
      border: '2px solid transparent', cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.25s',
    }}
      onMouseEnter={function(e) { if (onClick) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(107,33,168,0.12)' } }}
      onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,33,168,0.06)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
        <span style={{ fontSize: 11, fontWeight: 700, color: color, background: bg, padding: '3px 8px', borderRadius: 99 }}>{sub}</span>
      </div>
      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>{label}</div>
      {chart && <div style={{ marginTop: 12 }}><MiniChart data={chart} color={color} /></div>}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('overview')
  const [toast, setToast]     = useState('')
  const [period, setPeriod]   = useState('week')

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    fetchData()
  }, [user])

  async function fetchData() {
    setLoading(true)
    try {
      var [listRes, orderRes] = await Promise.all([
        api.get('/listings?userId=' + user.id),
        api.get('/orders/my'),
      ])
      var listings = listRes.data.listings || []
      var orders   = orderRes.data || { bought: [], sold: [] }

      var totalRevenue = orders.sold
        .filter(function(o) { return o.status === 'completed' })
        .reduce(function(sum, o) { return sum + (o.listingPrice || 0) }, 0)

      var totalViews = listings.reduce(function(sum, l) { return sum + (l.views || 0) }, 0)

      setData({ listings, orders, totalRevenue, totalViews })
    } catch(e) {
      setData({ listings: [], orders: { bought: [], sold: [] }, totalRevenue: 0, totalViews: 0 })
    }
    setLoading(false)
  }

  function showToast(msg) { setToast(msg); setTimeout(function() { setToast('') }, 3000) }

  async function handleDelete(id) {
    if (!window.confirm('Delete karna chahte ho?')) return
    try {
      await api.delete('/listings/' + id)
      setData(function(d) { return { ...d, listings: d.listings.filter(function(l) { return l._id !== id }) } })
      showToast('✅ Listing deleted!')
    } catch(e) { showToast('❌ Failed') }
  }

  if (!user) return null

  var tabs = [
    { id: 'overview',  icon: '📊', label: 'Overview' },
    { id: 'listings',  icon: '🛍️', label: 'Listings' },
    { id: 'sales',     icon: '💰', label: 'Sales' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
  ]

  var listings = data?.listings || []
  var orders   = data?.orders || { bought: [], sold: [] }
  var activeListings   = listings.filter(function(l) { return l.isActive })
  var completedSales   = orders.sold.filter(function(o) { return o.status === 'completed' })
  var pendingOrders    = orders.sold.filter(function(o) { return o.status === 'pending' })

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, background: '#1F2937', color: 'white', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', padding: '28px 16px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <img src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=6B21A8&color=fff&size=48'}
                  alt={user.name}
                  style={{ width: 48, height: 48, borderRadius: 14, border: '2px solid rgba(245,158,11,0.5)' }} />
                <div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: 'white' }}>
                    Namaste, {user.name.split(' ')[0]}! 👋
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    Seller Dashboard • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={function() { navigate('/post') }} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}>
                ➕ New Listing
              </button>
              {user.isAdmin && (
                <button onClick={function() { navigate('/admin') }} style={{ background: 'rgba(255,255,255,0.15)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  👑 Admin Panel
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Row */}
          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
              {[
                { icon: '🛍️', value: activeListings.length, label: 'Active Listings', color: '#A78BFA' },
                { icon: '📦', value: pendingOrders.length, label: 'Pending Orders', color: '#FCD34D' },
                { icon: '✅', value: completedSales.length, label: 'Completed Sales', color: '#6EE7B7' },
                { icon: '👁', value: (data?.totalViews || 0).toLocaleString(), label: 'Total Views', color: '#93C5FD' },
              ].map(function(s) {
                return (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: -16, paddingBottom: 40 }}>

        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: 16, padding: 6, display: 'flex', gap: 4, marginBottom: 24, boxShadow: '0 4px 16px rgba(107,33,168,0.08)' }}>
          {tabs.map(function(t) {
            return (
              <button key={t.id} onClick={function() { setTab(t.id) }} style={{
                flex: 1, padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 700,
                background: tab === t.id ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : 'transparent',
                color: tab === t.id ? 'white' : '#6B7280',
                transition: 'all 0.2s',
                boxShadow: tab === t.id ? '0 4px 12px rgba(107,33,168,0.3)' : 'none',
              }}>
                {t.icon} {t.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <>

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div>
                {/* Main Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                  <StatCard icon="💰" label="Total Revenue" value={'₹' + (data.totalRevenue || 0).toLocaleString('en-IN')} sub="Lifetime" color="#059669" bg="#ECFDF5"
                    chart={[20, 45, 30, 60, 40, 80, data.totalRevenue > 0 ? 100 : 0]} onClick={function() { setTab('sales') }} />
                  <StatCard icon="🛍️" label="Active Listings" value={activeListings.length} sub={listings.length + ' total'} color="#6B21A8" bg="#F5F3FF"
                    chart={[3, 5, 4, 8, 6, 7, activeListings.length]} onClick={function() { setTab('listings') }} />
                  <StatCard icon="📦" label="Total Orders" value={orders.sold.length} sub={pendingOrders.length + ' pending'} color="#2563EB" bg="#EFF6FF"
                    chart={[1, 3, 2, 5, 3, 4, orders.sold.length]} onClick={function() { setTab('sales') }} />
                  <StatCard icon="👁️" label="Total Views" value={(data.totalViews || 0).toLocaleString()} sub="All listings" color="#D97706" bg="#FFFBEB"
                    chart={[10, 25, 18, 40, 30, 55, Math.min(data.totalViews, 100)]} />
                </div>

                {/* Two Column */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

                  {/* Recent Listings */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800 }}>🛍️ Recent Listings</div>
                      <button onClick={function() { setTab('listings') }} style={{ background: 'none', border: 'none', color: '#6B21A8', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>View All →</button>
                    </div>
                    {listings.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>🛍️</div>
                        <div style={{ fontSize: 13, color: '#9CA3AF' }}>Koi listing nahi</div>
                        <button onClick={function() { navigate('/post') }} className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>+ Post Ad</button>
                      </div>
                    ) : listings.slice(0, 4).map(function(l) {
                      return (
                        <div key={l._id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                          <img src={l.images?.[0] || 'https://placehold.co/44x44?text=Item'} alt={l.title}
                            style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                            <div style={{ fontSize: 12, color: '#6B21A8', fontWeight: 700 }}>₹{(l.price || 0).toLocaleString('en-IN')}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <span style={{ fontSize: 10, background: l.isActive ? '#ECFDF5' : '#FEF2F2', color: l.isActive ? '#059669' : '#DC2626', padding: '2px 6px', borderRadius: 99, fontWeight: 700 }}>
                              {l.isActive ? '🟢' : '🔴'}
                            </span>
                            <span style={{ fontSize: 10, color: '#9CA3AF' }}>👁 {l.views || 0}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Recent Orders */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800 }}>📦 Recent Orders</div>
                      <button onClick={function() { navigate('/orders') }} style={{ background: 'none', border: 'none', color: '#6B21A8', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>View All →</button>
                    </div>
                    {orders.sold.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
                        <div style={{ fontSize: 13, color: '#9CA3AF' }}>Koi order nahi abhi</div>
                      </div>
                    ) : orders.sold.slice(0, 4).map(function(o) {
                      var sc = { pending: '#D97706', confirmed: '#2563EB', completed: '#059669', cancelled: '#DC2626' }
                      return (
                        <div key={o._id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📦</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.listingTitle}</div>
                            <div style={{ fontSize: 11, color: '#6B7280' }}>by {o.buyerName}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#6B21A8' }}>₹{(o.listingPrice || 0).toLocaleString('en-IN')}</div>
                            <span style={{ fontSize: 10, color: sc[o.status] || '#D97706', fontWeight: 700 }}>{o.status}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>⚡ Quick Actions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                    {[
                      { icon: '➕', label: 'Post New Ad', path: '/post', color: '#6B21A8', bg: '#F5F3FF' },
                      { icon: '📦', label: 'View Orders', path: '/orders', color: '#2563EB', bg: '#EFF6FF' },
                      { icon: '💬', label: 'Messages', path: '/messages', color: '#059669', bg: '#ECFDF5' },
                      { icon: '👤', label: 'Profile', path: '/profile', color: '#D97706', bg: '#FFFBEB' },
                      { icon: '🤝', label: 'Support', path: '/support', color: '#DC2626', bg: '#FEF2F2' },
                      user.isAdmin && { icon: '👑', label: 'Admin Panel', path: '/admin', color: '#F59E0B', bg: '#FFFBEB' },
                    ].filter(Boolean).map(function(item) {
                      return (
                        <div key={item.label} onClick={function() { navigate(item.path) }}
                          style={{ background: item.bg, borderRadius: 14, padding: '16px 12px', cursor: 'pointer', textAlign: 'center', border: '2px solid transparent', transition: 'all 0.2s' }}
                          onMouseEnter={function(e) { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
                          onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                          <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── LISTINGS TAB ── */}
            {tab === 'listings' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800 }}>🛍️ My Listings</div>
                    <div style={{ fontSize: 13, color: '#6B7280' }}>{activeListings.length} active • {listings.length - activeListings.length} inactive</div>
                  </div>
                  <button onClick={function() { navigate('/post') }} className="btn btn-primary btn-sm">➕ New Listing</button>
                </div>

                {listings.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">🛍️</div>
                    <h3>Koi listing nahi</h3>
                    <p>Apna pehla item list karo — free mein!</p>
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={function() { navigate('/post') }}>➕ Post Free Ad</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 14 }}>
                    {listings.map(function(l) {
                      return (
                        <div key={l._id} style={{ background: 'white', borderRadius: 18, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 2px 10px rgba(107,33,168,0.06)', border: '1px solid rgba(107,33,168,0.06)', transition: 'all 0.2s' }}
                          onMouseEnter={function(e) { e.currentTarget.style.boxShadow = '0 8px 24px rgba(107,33,168,0.12)' }}
                          onMouseLeave={function(e) { e.currentTarget.style.boxShadow = '0 2px 10px rgba(107,33,168,0.06)' }}
                        >
                          <img src={l.images?.[0] || 'https://placehold.co/72x72?text=Item'} alt={l.title}
                            style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 14, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{l.title}</div>
                            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#6B21A8', marginBottom: 6 }}>
                              ₹{(l.price || 0).toLocaleString('en-IN')}
                              {l.isNegotiable && <span style={{ fontSize: 11, color: '#D97706', marginLeft: 8 }}>Nego</span>}
                            </div>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 12, background: l.isActive ? '#ECFDF5' : '#FEF2F2', color: l.isActive ? '#059669' : '#DC2626', padding: '3px 10px', borderRadius: 99, fontWeight: 700 }}>
                                {l.isActive ? '🟢 Active' : '🔴 Inactive'}
                              </span>
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>👁 {l.views || 0} views</span>
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>📦 {l.category}</span>
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>📍 {l.city}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={function() { navigate('/listing/' + l._id) }} className="btn btn-outline-primary btn-sm">👁 View</button>
                            <button onClick={function() { handleDelete(l._id) }}
                              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                              🗑️
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── SALES TAB ── */}
            {tab === 'sales' && (
              <div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>💰 Sales & Revenue</div>

                {/* Revenue Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                  {[
                    { icon: '💰', label: 'Total Revenue', value: '₹' + (data.totalRevenue || 0).toLocaleString('en-IN'), color: '#059669', bg: '#ECFDF5' },
                    { icon: '✅', label: 'Completed Sales', value: completedSales.length, color: '#6B21A8', bg: '#F5F3FF' },
                    { icon: '⏳', label: 'Pending', value: pendingOrders.length, color: '#D97706', bg: '#FFFBEB' },
                    { icon: '❌', label: 'Cancelled', value: orders.sold.filter(function(o) { return o.status === 'cancelled' }).length, color: '#DC2626', bg: '#FEF2F2' },
                  ].map(function(s) {
                    return (
                      <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: '20px', border: '2px solid ' + s.color + '20' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                        <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>{s.label}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Orders List */}
                <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📦 All Sales Orders</div>
                  {orders.sold.length === 0 ? (
                    <div className="empty-state">
                      <div className="icon">📦</div>
                      <h3>Koi sales nahi abhi</h3>
                      <p>Listings daalo — buyers ayenge!</p>
                    </div>
                  ) : orders.sold.map(function(o) {
                    var sc = {
                      pending:   { color: '#D97706', bg: '#FFFBEB', icon: '⏳' },
                      confirmed: { color: '#2563EB', bg: '#EFF6FF', icon: '✅' },
                      completed: { color: '#059669', bg: '#ECFDF5', icon: '🎉' },
                      cancelled: { color: '#DC2626', bg: '#FEF2F2', icon: '❌' },
                    }[o.status] || { color: '#D97706', bg: '#FFFBEB', icon: '⏳' }

                    return (
                      <div key={o._id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                          {sc.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{o.listingTitle}</div>
                          <div style={{ fontSize: 12, color: '#6B7280' }}>Buyer: {o.buyerName} • {new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#6B21A8' }}>
                            ₹{(o.listingPrice || 0).toLocaleString('en-IN')}
                          </div>
                          <span style={{ fontSize: 11, color: sc.color, background: sc.bg, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── ANALYTICS TAB ── */}
            {tab === 'analytics' && (
              <div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>📈 Analytics</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

                  {/* Listing Performance */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>🏆 Top Listings by Views</div>
                    {listings.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '20px 0' }}>No listings yet</div>
                    ) : [...listings].sort(function(a, b) { return (b.views || 0) - (a.views || 0) }).slice(0, 5).map(function(l, i) {
                      var maxViews = Math.max(...listings.map(function(x) { return x.views || 0 }), 1)
                      var pct = ((l.views || 0) / maxViews) * 100
                      return (
                        <div key={l._id} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                              <span style={{ color: '#6B21A8', fontWeight: 800, marginRight: 8 }}>#{i + 1}</span>
                              {l.title}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', flexShrink: 0, marginLeft: 8 }}>👁 {l.views || 0}</span>
                          </div>
                          <div style={{ height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(135deg, #6B21A8, #7C3AED)', borderRadius: 99, transition: 'width 0.8s ease' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Category Breakdown */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📊 Category Breakdown</div>
                    {listings.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '20px 0' }}>No listings yet</div>
                    ) : (function() {
                      var cats = {}
                      listings.forEach(function(l) { cats[l.category] = (cats[l.category] || 0) + 1 })
                      var catColors = ['#6B21A8', '#059669', '#2563EB', '#D97706', '#DC2626', '#7C3AED']
                      return Object.entries(cats).map(function(entry, i) {
                        var cat = entry[0], count = entry[1]
                        var pct = (count / listings.length) * 100
                        return (
                          <div key={cat} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{cat}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: catColors[i % catColors.length] }}>{count} listings</span>
                            </div>
                            <div style={{ height: 8, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: pct + '%', background: catColors[i % catColors.length], borderRadius: 99, transition: 'width 0.8s ease' }} />
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>

                {/* Summary Cards */}
                <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', borderRadius: 20, padding: '28px', color: 'white' }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, marginBottom: 20 }}>📊 Performance Summary</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                    {[
                      { label: 'Avg Views/Listing', value: listings.length > 0 ? Math.round((data.totalViews || 0) / listings.length) : 0, icon: '👁' },
                      { label: 'Conversion Rate', value: listings.length > 0 ? Math.round((orders.sold.length / listings.length) * 100) + '%' : '0%', icon: '📈' },
                      { label: 'Avg Order Value', value: completedSales.length > 0 ? '₹' + Math.round(data.totalRevenue / completedSales.length).toLocaleString('en-IN') : '₹0', icon: '💰' },
                      { label: 'Success Rate', value: orders.sold.length > 0 ? Math.round((completedSales.length / orders.sold.length) * 100) + '%' : '0%', icon: '✅' },
                    ].map(function(s) {
                      return (
                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                          <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                          <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#FCD34D' }}>{s.value}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{s.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}