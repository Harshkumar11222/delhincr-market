import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

function StatCard({ icon, label, value, sub, color, bg, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: bg || 'white', borderRadius: 20, padding: '24px 20px',
      border: '2px solid transparent', transition: 'all 0.25s',
      boxShadow: '0 4px 16px rgba(14,165,160,0.06)',
      cursor: onClick ? 'pointer' : 'default',
    }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(14,165,160,0.14)' } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,160,0.06)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{icon}</div>
        {sub && <span style={{ fontSize: 11, background: color + '15', color: color, padding: '3px 8px', borderRadius: 99, fontWeight: 700 }}>{sub}</span>}
      </div>
      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 32, fontWeight: 800, color: color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function MiniChart({ data, color }) {
  var max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
      {data.map(function(v, i) {
        return (
          <div key={i} style={{
            flex: 1, borderRadius: '4px 4px 0 0',
            background: i === data.length - 1 ? color : color + '40',
            height: (v / max * 100) + '%',
            minHeight: 4, transition: 'height 0.5s ease',
          }} />
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [tab, setTab] = useState('overview')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    fetchData()
  }, [user])

  async function fetchData() {
    setLoading(true)
    try {
      var [listRes, orderRes, reviewRes] = await Promise.all([
        api.get('/listings?userId=' + user.id),
        api.get('/orders/my'),
        api.get('/reviews/my').catch(() => ({ data: { reviews: [] } })),
      ])
      setData({
        listings: listRes.data.listings || [],
        orders:   orderRes.data || { bought: [], sold: [] },
        reviews:  reviewRes.data.reviews || [],
      })
    } catch(e) {}
    setLoading(false)
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function deleteListing(id) {
    setDeletingId(id)
    try {
      await api.delete('/listings/' + id)
      setData(prev => ({ ...prev, listings: prev.listings.filter(l => l._id !== id) }))
      showToast('✅ Listing deleted!')
    } catch(e) { showToast('❌ Failed') }
    setDeletingId(null)
  }

  async function toggleActive(id, current) {
    try {
      await api.patch('/listings/' + id, { isActive: !current })
      setData(prev => ({ ...prev, listings: prev.listings.map(l => l._id === id ? { ...l, isActive: !current } : l) }))
      showToast(current ? '⏸️ Listing paused' : '▶️ Listing activated')
    } catch(e) { showToast('❌ Failed') }
  }

  async function updateOrderStatus(id, status) {
    try {
      await api.patch('/orders/' + id + '/status', { status })
      await fetchData()
      showToast('✅ Status updated!')
    } catch(e) { showToast('❌ Failed') }
  }

  if (!user) return null

  // Calculated stats
  var stats = data ? {
    totalListings:    data.listings.length,
    activeListings:   data.listings.filter(l => l.isActive).length,
    totalViews:       data.listings.reduce((a, l) => a + (l.views || 0), 0),
    totalSold:        data.orders.sold.filter(o => o.status === 'completed').length,
    pendingOrders:    data.orders.sold.filter(o => o.status === 'pending').length,
    revenue:          data.orders.sold.filter(o => o.status === 'completed').reduce((a, o) => a + (o.listingPrice || 0), 0),
    avgRating:        data.reviews.length ? (data.reviews.reduce((a, r) => a + r.rating, 0) / data.reviews.length).toFixed(1) : '—',
    totalBought:      data.orders.bought.length,
  } : {}

  // Mock chart data (last 7 days views)
  var viewsChart = [12, 19, 8, 24, 16, 31, data?.listings.reduce((a, l) => a + (l.views || 0), 0) % 40 || 25]

  var tabs = [
    { id: 'overview',  icon: '📊', label: 'Overview' },
    { id: 'listings',  icon: '🛍️', label: 'Listings' },
    { id: 'orders',    icon: '📦', label: 'Orders' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
  ]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, background: '#1F2937', color: 'white', padding: '12px 20px', borderRadius: 14, fontSize: 14, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F2A3F, #0C8A85, #0EA5A0)', padding: '28px 16px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.07)' }} />
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 4 }}>
                Namaste, {user.name.split(' ')[0]}! 👋
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                Aaj ka business dashboard dekho
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate('/post')} style={{ background: 'linear-gradient(135deg, #0EA5A0, #0C8A85)', color: 'white', border: 'none', borderRadius: 99, padding: '10px 20px', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                ➕ New Listing
              </button>
              {user.isAdmin && (
                <button onClick={() => navigate('/admin')} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 99, padding: '10px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  👑 Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -24, paddingBottom: 40 }}>

        {/* Tabs */}
        {/* Tabs */}
<div style={{
  background: 'white', borderRadius: 16, padding: 6,
  display: 'flex', gap: 4, marginBottom: 24,
  boxShadow: '0 4px 16px rgba(14,165,160,0.08)',
  overflowX: 'auto',
}}>
  {tabs.map(function(t) {
    return (
      <button key={t.id} onClick={() => setTab(t.id)} style={{
        flex: 1, minWidth: 80, padding: '10px 8px',
        borderRadius: 12, border: 'none', cursor: 'pointer',
        fontFamily: 'Nunito, sans-serif',
        fontSize: 12, fontWeight: 700,
        background: tab === t.id
          ? 'linear-gradient(135deg, #0EA5A0, #0C8A85)'
          : 'transparent',
        color: tab === t.id ? 'white' : '#6B7280',
        transition: 'all 0.2s', whiteSpace: 'nowrap',
        boxShadow: tab === t.id
          ? '0 4px 12px rgba(14,165,160,0.3)'
          : 'none',
      }}>
        {t.icon} {t.label}
      </button>
    )
  })}
</div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 120, borderRadius: 20 }} />
            ))}
          </div>
        ) : (

          <>
            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div>
                {/* Main Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                  <StatCard icon="🛍️" label="Total Listings" value={stats.totalListings} sub={stats.activeListings + ' active'} color="#0EA5A0" onClick={() => setTab('listings')} />
                  <StatCard icon="👁️" label="Total Views" value={stats.totalViews.toLocaleString('en-IN')} sub="All time" color="#2563EB" />
                  <StatCard icon="📦" label="Pending Orders" value={stats.pendingOrders} sub="Action needed" color="#D97706" onClick={() => setTab('orders')} />
                  <StatCard icon="💰" label="Revenue Earned" value={'₹' + stats.revenue.toLocaleString('en-IN')} sub="Completed sales" color="#059669" />
                  <StatCard icon="🎉" label="Items Sold" value={stats.totalSold} sub="Completed" color="#DC2626" />
                  <StatCard icon="⭐" label="Avg Rating" value={stats.avgRating} sub={data.reviews.length + ' reviews'} color="#F59E0B" />
                  <StatCard icon="🛒" label="Purchases" value={stats.totalBought} sub="Items bought" color="#0C8A85" onClick={() => navigate('/orders')} />
                  <StatCard icon="💬" label="Messages" value="Chat" sub="View inbox" color="#059669" onClick={() => navigate('/messages')} />
                </div>

                {/* Quick Actions */}
                <div style={{ background: 'white', borderRadius: 20, padding: '24px', marginBottom: 24, boxShadow: '0 4px 16px rgba(14,165,160,0.06)' }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>⚡ Quick Actions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    {[
                      { icon: '➕', label: 'Post New Ad', color: '#0EA5A0', path: '/post' },
                      { icon: '🔍', label: 'Browse Items', color: '#2563EB', path: '/browse' },
                      { icon: '🔧', label: 'Services', color: '#059669', path: '/services' },
                      { icon: '🚗', label: 'Rentals', color: '#DC2626', path: '/rentals' },
                      { icon: '📦', label: 'My Orders', color: '#D97706', path: '/orders' },
                      { icon: '🤝', label: 'Support', color: '#0C8A85', path: '/support' },
                    ].map(function(action) {
                      return (
                        <div key={action.label} onClick={() => navigate(action.path)} style={{
                          background: action.color + '10', borderRadius: 14, padding: '16px 12px',
                          textAlign: 'center', cursor: 'pointer', border: '2px solid transparent',
                          transition: 'all 0.2s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                          <div style={{ fontSize: 28, marginBottom: 8 }}>{action.icon}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: action.color }}>{action.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                  {/* Recent Listings */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(14,165,160,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800 }}>🛍️ Recent Listings</div>
                      <button onClick={() => setTab('listings')} style={{ background: 'none', border: 'none', color: '#0EA5A0', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>View All →</button>
                    </div>
                    {data.listings.slice(0, 4).map(function(l) {
                      return (
                        <div key={l._id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'center', cursor: 'pointer' }}
                          onClick={() => navigate('/listing/' + l._id)}>
                          <img src={l.images?.[0] || 'https://placehold.co/40x40?text=Item'} alt={l.title} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                              <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 14, fontWeight: 800, color: '#0EA5A0' }}>₹{(l.price || 0).toLocaleString('en-IN')}</span>
                              <span style={{ fontSize: 11, color: '#9CA3AF' }}>👁 {l.views || 0}</span>
                            </div>
                          </div>
                          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 99, fontWeight: 700, background: l.isActive ? '#ECFDF5' : '#FEF2F2', color: l.isActive ? '#059669' : '#DC2626' }}>
                            {l.isActive ? 'Active' : 'Paused'}
                          </span>
                        </div>
                      )
                    })}
                    {data.listings.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF', fontSize: 13 }}>
                        Koi listing nahi — <button onClick={() => navigate('/post')} style={{ background: 'none', border: 'none', color: '#0EA5A0', cursor: 'pointer', fontWeight: 700 }}>Post karo!</button>
                      </div>
                    )}
                  </div>

                  {/* Recent Orders */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(14,165,160,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800 }}>📦 Recent Orders</div>
                      <button onClick={() => setTab('orders')} style={{ background: 'none', border: 'none', color: '#0EA5A0', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>View All →</button>
                    </div>
                    {[...data.orders.sold, ...data.orders.bought].slice(0, 4).map(function(o) {
                      var sc = { pending: { c: '#D97706', i: '⏳' }, confirmed: { c: '#2563EB', i: '✅' }, completed: { c: '#059669', i: '🎉' }, cancelled: { c: '#DC2626', i: '❌' } }[o.status] || { c: '#D97706', i: '⏳' }
                      return (
                        <div key={o._id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'center' }}>
                          <div style={{ fontSize: 24 }}>{sc.i}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.listingTitle}</div>
                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>by {o.buyerName}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 14, fontWeight: 800, color: '#0EA5A0' }}>₹{(o.listingPrice || 0).toLocaleString('en-IN')}</div>
                            <span style={{ fontSize: 10, color: sc.c, fontWeight: 700 }}>{o.status}</span>
                          </div>
                        </div>
                      )
                    })}
                    {data.orders.sold.length === 0 && data.orders.bought.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF', fontSize: 13 }}>
                        Abhi koi orders nahi hain
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── LISTINGS TAB ── */}
            {tab === 'listings' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800 }}>🛍️ My Listings</div>
                    <div style={{ fontSize: 13, color: '#6B7280' }}>{stats.activeListings} active • {stats.totalListings - stats.activeListings} paused</div>
                  </div>
                  <button onClick={() => navigate('/post')} className="btn btn-primary btn-sm">➕ New Listing</button>
                </div>

                {data.listings.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">🛍️</div>
                    <h3>Koi listing nahi</h3>
                    <p>Apna pehla item list karo — bilkul free!</p>
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/post')}>➕ Post Free Ad</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 14 }}>
                    {data.listings.map(function(l) {
                      return (
                        <div key={l._id} style={{ background: 'white', borderRadius: 20, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 2px 10px rgba(14,165,160,0.06)', border: '1px solid rgba(14,165,160,0.06)', opacity: l.isActive ? 1 : 0.7 }}>
                          <img src={l.images?.[0] || 'https://placehold.co/72x72?text=Item'} alt={l.title}
                            style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 14, flexShrink: 0, cursor: 'pointer' }}
                            onClick={() => navigate('/listing/' + l._id)} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, cursor: 'pointer' }} onClick={() => navigate('/listing/' + l._id)}>{l.title}</div>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#0EA5A0' }}>₹{(l.price || 0).toLocaleString('en-IN')}</span>
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>👁 {l.views || 0} views</span>
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>📍 {l.city}</span>
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>📅 {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                            <button onClick={() => navigate('/listing/' + l._id)} style={{ background: '#E6F7F7', color: '#0EA5A0', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                              👁 View
                            </button>
                            <button onClick={() => toggleActive(l._id, l.isActive)} style={{ background: l.isActive ? '#FFFBEB' : '#ECFDF5', color: l.isActive ? '#D97706' : '#059669', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {l.isActive ? '⏸ Pause' : '▶ Activate'}
                            </button>
                            <button onClick={() => window.confirm('Delete karna chahte ho?') && deleteListing(l._id)} disabled={deletingId === l._id} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                              {deletingId === l._id ? '⏳' : '🗑️ Delete'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, marginBottom: 20 }}>📦 Orders Management</div>

                {/* Pending Orders Alert */}
                {stats.pendingOrders > 0 && (
                  <div style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '2px solid #FDE68A', borderRadius: 16, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 28 }}>⚠️</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#D97706', fontSize: 15 }}>{stats.pendingOrders} pending order{stats.pendingOrders > 1 ? 's' : ''} — Action needed!</div>
                      <div style={{ fontSize: 13, color: '#92400E' }}>Buyers intezaar kar rahe hain — jaldi confirm karo</div>
                    </div>
                  </div>
                )}

                {/* Sold Orders */}
                {data.orders.sold.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      🏪 Selling Orders
                      <span style={{ background: '#E6F7F7', color: '#0EA5A0', fontSize: 12, padding: '2px 10px', borderRadius: 99 }}>{data.orders.sold.length}</span>
                    </div>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {data.orders.sold.map(function(o) {
                        var sc = { pending: { color: '#D97706', bg: '#FFFBEB', icon: '⏳' }, confirmed: { color: '#2563EB', bg: '#EFF6FF', icon: '✅' }, completed: { color: '#059669', bg: '#ECFDF5', icon: '🎉' }, cancelled: { color: '#DC2626', bg: '#FEF2F2', icon: '❌' } }[o.status] || { color: '#D97706', bg: '#FFFBEB', icon: '⏳' }
                        return (
                          <div key={o._id} style={{ background: 'white', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 10px rgba(14,165,160,0.06)', border: '2px solid ' + sc.color + '30' }}>
                            <div style={{ background: sc.bg, padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 14, fontWeight: 800, color: sc.color }}>{sc.icon} {o.status.toUpperCase()}</span>
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </div>
                            <div style={{ padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                              <img src={o.listingImage || 'https://placehold.co/56x56?text=Item'} alt={o.listingTitle} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{o.listingTitle}</div>
                                <div style={{ fontSize: 13, color: '#6B7280' }}>🛒 Buyer: <strong>{o.buyerName}</strong> • 📍 {o.address}</div>
                                <div style={{ fontSize: 13, color: '#6B7280' }}>💳 {o.paymentMethod}</div>
                              </div>
                              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#0EA5A0', flexShrink: 0 }}>
                                ₹{(o.listingPrice || 0).toLocaleString('en-IN')}
                              </div>
                            </div>
                            {(o.status === 'pending' || o.status === 'confirmed') && (
                              <div style={{ padding: '0 20px 16px', display: 'flex', gap: 10 }}>
                                {o.status === 'pending' && (
                                  <>
                                    <button onClick={() => updateOrderStatus(o._id, 'confirmed')} style={{ flex: 1, background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white', border: 'none', borderRadius: 99, padding: '10px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                                      ✅ Confirm
                                    </button>
                                    <button onClick={() => updateOrderStatus(o._id, 'cancelled')} style={{ flex: 1, background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 99, padding: '10px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                                      ❌ Cancel
                                    </button>
                                  </>
                                )}
                                {o.status === 'confirmed' && (
                                  <button onClick={() => updateOrderStatus(o._id, 'completed')} style={{ flex: 1, background: 'linear-gradient(135deg, #0EA5A0, #0C8A85)', color: 'white', border: 'none', borderRadius: 99, padding: '10px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                                    🎉 Mark Complete
                                  </button>
                                )}
                                {o.buyerPhone && (
                                  <a href={'tel:' + o.buyerPhone} style={{ padding: '10px 16px', background: '#E6F7F7', color: '#0EA5A0', borderRadius: 99, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>📞</a>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {data.orders.sold.length === 0 && data.orders.bought.length === 0 && (
                  <div className="empty-state">
                    <div className="icon">📦</div>
                    <h3>Koi orders nahi</h3>
                    <p>Listing daalo — buyers aayenge!</p>
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/post')}>➕ Post Ad</button>
                  </div>
                )}
              </div>
            )}

            {/* ── ANALYTICS TAB ── */}
            {tab === 'analytics' && (
              <div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, marginBottom: 20 }}>📈 Analytics</div>

                {/* Views Chart */}
                <div style={{ background: 'white', borderRadius: 20, padding: '24px', marginBottom: 20, boxShadow: '0 4px 16px rgba(14,165,160,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800 }}>👁️ Listing Views</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Last 7 days</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#0EA5A0' }}>{stats.totalViews}</div>
                      <div style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>Total views</div>
                    </div>
                  </div>
                  <div style={{ height: 140, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                    {viewsChart.map(function(v, i) {
                      var max = Math.max(...viewsChart, 1)
                      var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today']
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{ fontSize: 10, color: '#0EA5A0', fontWeight: 700 }}>{v}</div>
                          <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: i === 6 ? 'linear-gradient(135deg, #0EA5A0, #0C8A85)' : 'linear-gradient(135deg, #0EA5A0, #0C8A85)', opacity: i === 6 ? 1 : 0.3 + (i / viewsChart.length * 0.5), height: (v / max * 80) + '%', minHeight: 8, transition: 'height 0.5s ease' }} />
                          <div style={{ fontSize: 10, color: '#9CA3AF' }}>{days[i]}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Performance Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

                  {/* Top Listing */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(14,165,160,0.06)' }}>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, marginBottom: 14 }}>🏆 Top Listings</div>
                    {[...data.listings].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4).map(function(l, i) {
                      var maxViews = Math.max(...data.listings.map(l => l.views || 0), 1)
                      return (
                        <div key={l._id} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🔹'} {l.title}
                            </span>
                            <span style={{ fontSize: 13, color: '#0EA5A0', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{l.views || 0}</span>
                          </div>
                          <div style={{ height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: ((l.views || 0) / maxViews * 100) + '%', height: '100%', background: 'linear-gradient(135deg, #0EA5A0, #0C8A85)', borderRadius: 99, transition: 'width 0.8s ease' }} />
                          </div>
                        </div>
                      )
                    })}
                    {data.listings.length === 0 && <div style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Listings daalo first</div>}
                  </div>

                  {/* Revenue Breakdown */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(14,165,160,0.06)' }}>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, marginBottom: 14 }}>💰 Revenue Breakdown</div>
                    {[
                      { label: 'Completed Sales', value: stats.revenue, color: '#059669', icon: '✅' },
                      { label: 'Pending Value', value: data.orders.sold.filter(o => o.status === 'pending').reduce((a, o) => a + (o.listingPrice || 0), 0), color: '#D97706', icon: '⏳' },
                      { label: 'Confirmed', value: data.orders.sold.filter(o => o.status === 'confirmed').reduce((a, o) => a + (o.listingPrice || 0), 0), color: '#2563EB', icon: '🔵' },
                    ].map(function(item) {
                      return (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>{item.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{item.label}</span>
                          </div>
                          <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: item.color }}>₹{item.value.toLocaleString('en-IN')}</span>
                        </div>
                      )
                    })}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>Total Pipeline</span>
                      <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#0EA5A0' }}>
                        ₹{data.orders.sold.reduce((a, o) => a + (o.listingPrice || 0), 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div style={{ background: 'linear-gradient(135deg, #0F2A3F, #0C8A85, #0EA5A0)', borderRadius: 20, padding: '24px' }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 16 }}>💡 Sell More Tips</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    {[
                      { icon: '📸', tip: 'Clear photos daalo — 5+ photos wali listings 3x zyada views paati hain' },
                      { icon: '💰', tip: 'Competitive price rakho — market rate check karo pehle' },
                      { icon: '✍️', tip: 'Detailed description likho — condition, age, reason for selling' },
                      { icon: '📍', tip: 'Exact location daalo — nearby buyers milte hain jaldi' },
                    ].map(function(item) {
                      return (
                        <div key={item.tip} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{item.tip}</div>
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