import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const tabs = [
  { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
  { id: 'users',     label: '👥 Users',     icon: '👥' },
  { id: 'listings',  label: '🛍️ Listings',  icon: '🛍️' },
  { id: 'orders',    label: '📦 Orders',    icon: '📦' },
  { id: 'services',  label: '🔧 Services',  icon: '🔧' },
  { id: 'rentals',   label: '🚗 Rentals',   icon: '🚗' },
  { id: 'verifications', icon: '🛡️', label: '🛡️ Verifications' }
]

const statusColors = {
  pending:   { bg: '#FFFBEB', color: '#D97706' },
  confirmed: { bg: '#EFF6FF', color: '#2563EB' },
  completed: { bg: '#ECFDF5', color: '#059669' },
  cancelled: { bg: '#FEF2F2', color: '#DC2626' },
}

export default function Admin() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [tab, setTab]       = useState('dashboard')
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toast, setToast]   = useState('')

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    fetchData()
  }, [tab, user])

  async function fetchData() {
    setLoading(true)
    try {
      var res
      if (tab === 'dashboard') res = await api.get('/admin/stats')
      else if (tab === 'users') res = await api.get('/admin/users')
      else if (tab === 'listings') res = await api.get('/admin/listings')
      else if (tab === 'orders') res = await api.get('/admin/orders')
      else if (tab === 'services') res = await api.get('/admin/services')
      else if (tab === 'rentals') res = await api.get('/admin/rentals')
      setData(res.data)
    } catch(err) {
      if (err.response?.status === 403) {
        navigate('/')
        return
      }
    }
    setLoading(false)
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(function() { setToast('') }, 3000)
  }

  async function handleAction(action, id) {
    try {
      if (action === 'verify-user')    await api.patch('/admin/users/' + id + '/verify')
      if (action === 'ban-user')       await api.patch('/admin/users/' + id + '/ban')
      if (action === 'delete-user')    await api.delete('/admin/users/' + id)
      if (action === 'delete-listing') await api.delete('/admin/listings/' + id)
      if (action === 'feature-listing') await api.patch('/admin/listings/' + id + '/feature')
      if (action === 'delete-service') await api.delete('/admin/services/' + id)
      if (action === 'delete-rental')  await api.delete('/admin/rentals/' + id)
      showToast('✅ Action completed!')
      fetchData()
    } catch(err) {
      showToast('❌ ' + (err.response?.data?.error || 'Failed'))
    }
  }

  if (!user) return null

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 20, zIndex: 9999,
          background: '#1F2937', color: 'white', padding: '12px 20px',
          borderRadius: 12, fontSize: 14, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)',
        padding: '24px 16px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: 'white' }}>
                🛡️ Admin Panel
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                NukkadMarket — Full Control Dashboard
              </div>
            </div>
            <button onClick={function() { navigate('/') }}
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 99, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              ← Back to App
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(function(t) {
            return (
              <button key={t.id}
                onClick={function() { setTab(t.id) }}
                style={{
                  padding: '10px 18px', borderRadius: 99, border: 'none',
                  cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                  fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                  background: tab === t.id ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : 'white',
                  color: tab === t.id ? 'white' : '#374151',
                  boxShadow: tab === t.id ? '0 4px 16px rgba(107,33,168,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                }}>
                {t.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="loader">⏳</div>
        ) : (

          // ── DASHBOARD TAB ──
          tab === 'dashboard' && data ? (
            <div>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '👥', label: 'Total Users',     value: data.stats.totalUsers,     color: '#6B21A8', bg: '#F5F3FF' },
                  { icon: '🛍️', label: 'Total Listings',  value: data.stats.totalListings,  color: '#2563EB', bg: '#EFF6FF' },
                  { icon: '📦', label: 'Total Orders',    value: data.stats.totalOrders,    color: '#D97706', bg: '#FFFBEB' },
                  { icon: '🔧', label: 'Services',        value: data.stats.totalServices,  color: '#059669', bg: '#ECFDF5' },
                  { icon: '🚗', label: 'Rentals',         value: data.stats.totalRentals,   color: '#DC2626', bg: '#FEF2F2' },
                  { icon: '⏳', label: 'Pending Orders',  value: data.stats.pendingOrders,  color: '#D97706', bg: '#FFFBEB' },
                  { icon: '✅', label: 'Active Listings', value: data.stats.activeListings, color: '#059669', bg: '#ECFDF5' },
                ].map(function(s) {
                  return (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: '20px', border: '1px solid ' + s.color + '22' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: 'Baloo 2, cursive' }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
                    </div>
                  )
                })}
              </div>

              {/* Recent Activity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Recent Users */}
                <div style={{ background: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>👥 Recent Users</div>
                  {(data.recentUsers || []).map(function(u) {
                    return (
                      <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <img src={u.avatar || 'https://i.pravatar.cc/36?u=' + u.phone} alt={u.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>{u.phone}</div>
                        </div>
                        {u.isVerified && <span style={{ fontSize: 10, background: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: 99, fontWeight: 700 }}>✓</span>}
                      </div>
                    )
                  })}
                </div>

                {/* Recent Orders */}
                <div style={{ background: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>📦 Recent Orders</div>
                  {(data.recentOrders || []).map(function(o) {
                    var sc = statusColors[o.status] || statusColors.pending
                    return (
                      <div key={o._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.listingTitle}</div>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>by {o.buyerName}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#6B21A8', fontFamily: 'Baloo 2, cursive' }}>₹{(o.listingPrice || 0).toLocaleString('en-IN')}</div>
                          <span style={{ fontSize: 10, background: sc.bg, color: sc.color, padding: '2px 6px', borderRadius: 99, fontWeight: 700 }}>{o.status}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

          // ── USERS TAB ──
          ) : tab === 'users' && data ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 700 }}>
                  👥 Users ({data.total})
                </div>
                <input className="form-control" placeholder="Search users..."
                  value={search} onChange={function(e) { setSearch(e.target.value) }}
                  style={{ width: 240 }} />
              </div>
              <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                      {['User', 'Phone', 'Email', 'Status', 'Actions'].map(function(h) {
                        return <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>{h}</th>
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {(data.users || []).map(function(u) {
                      return (
                        <tr key={u._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <img src={u.avatar || 'https://i.pravatar.cc/32?u=' + u.phone} alt={u.name}
                                style={{ width: 32, height: 32, borderRadius: '50%' }} />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                                {u.isAdmin && <span style={{ fontSize: 10, background: '#F5F3FF', color: '#6B21A8', padding: '1px 6px', borderRadius: 99, fontWeight: 700 }}>Admin</span>}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{u.phone}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{u.email || '—'}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {u.isVerified && <span style={{ fontSize: 10, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>✓ Verified</span>}
                              {u.isBanned  && <span style={{ fontSize: 10, background: '#FEF2F2', color: '#DC2626', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>🚫 Banned</span>}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {!u.isVerified && (
                                <button onClick={function() { handleAction('verify-user', u._id) }}
                                  style={{ fontSize: 11, padding: '4px 10px', background: '#ECFDF5', color: '#059669', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>
                                  ✓ Verify
                                </button>
                              )}
                              <button onClick={function() { handleAction('ban-user', u._id) }}
                                style={{ fontSize: 11, padding: '4px 10px', background: u.isBanned ? '#ECFDF5' : '#FEF2F2', color: u.isBanned ? '#059669' : '#DC2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>
                                {u.isBanned ? '🔓 Unban' : '🚫 Ban'}
                              </button>
                              <button onClick={function() { if (window.confirm('Delete user?')) handleAction('delete-user', u._id) }}
                                style={{ fontSize: 11, padding: '4px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          // ── LISTINGS TAB ──
          ) : tab === 'listings' && data ? (
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
                🛍️ Listings ({data.total})
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {(data.listings || []).map(function(l) {
                  return (
                    <div key={l._id} style={{ background: 'white', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                      <img src={l.images && l.images[0] ? l.images[0] : 'https://placehold.co/56x56?text=Item'} alt={l.title}
                        style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{l.title}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>by {l.sellerName} • {l.city} • 👁 {l.views}</div>
                      </div>
                      <div style={{ textAlign: 'right', marginRight: 12 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#6B21A8', fontFamily: 'Baloo 2, cursive' }}>₹{(l.price || 0).toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: 11, color: l.isActive ? '#059669' : '#DC2626' }}>{l.isActive ? '✅ Active' : '❌ Inactive'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={function() { handleAction('feature-listing', l._id) }}
                          style={{ fontSize: 11, padding: '6px 10px', background: '#FFFBEB', color: '#D97706', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                          ⭐ Feature
                        </button>
                        <button onClick={function() { if (window.confirm('Remove listing?')) handleAction('delete-listing', l._id) }}
                          style={{ fontSize: 11, padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          // ── ORDERS TAB ──
          ) : tab === 'orders' && data ? (
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
                📦 Orders ({data.total})
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {(data.orders || []).map(function(o) {
                  var sc = statusColors[o.status] || statusColors.pending
                  return (
                    <div key={o._id} style={{ background: 'white', borderRadius: 14, padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{o.listingTitle}</div>
                          <div style={{ fontSize: 12, color: '#6B7280' }}>
                            🛒 Buyer: {o.buyerName} &nbsp;|&nbsp; 🏪 Seller: {o.sellerName}
                          </div>
                          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>💳 {o.paymentMethod} &nbsp;|&nbsp; 📍 {o.address}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: '#6B21A8', fontFamily: 'Baloo 2, cursive' }}>₹{(o.listingPrice || 0).toLocaleString('en-IN')}</div>
                          <span style={{ fontSize: 11, background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 99, fontWeight: 700 }}>
                            {o.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          // ── SERVICES TAB ──
          ) : tab === 'services' && data ? (
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
                🔧 Services ({data.total})
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {(data.services || []).map(function(s) {
                  return (
                    <div key={s._id} style={{ background: 'white', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                      <img src={s.avatar || 'https://i.pravatar.cc/48?u=' + s.phone} alt={s.name}
                        style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{s.providerName} • {s.category} • {s.city}</div>
                        <div style={{ fontSize: 12, color: '#6B21A8', fontWeight: 600 }}>₹{s.priceFrom}+ • ⭐ {s.rating}/5</div>
                      </div>
                      <button onClick={function() { if (window.confirm('Delete service?')) handleAction('delete-service', s._id) }}
                        style={{ fontSize: 11, padding: '6px 12px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                        🗑️ Delete
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

          // ── RENTALS TAB ──
          ) : tab === 'rentals' && data ? (
            <div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
                🚗 Rentals ({data.total})
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {(data.rentals || []).map(function(r) {
                  return (
                    <div key={r._id} style={{ background: 'white', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                        {r.type === 'car' ? '🚗' : r.type === 'bike' ? '🏍️' : r.type === 'scooty' ? '🛵' : '🚲'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{r.title}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{r.ownerName} • {r.city} • {r.type}</div>
                        <div style={{ fontSize: 12, color: '#6B21A8', fontWeight: 600 }}>₹{r.pricePerDay}/day</div>
                      </div>
                      <button onClick={function() { if (window.confirm('Remove rental?')) handleAction('delete-rental', r._id) }}
                        style={{ fontSize: 11, padding: '6px 12px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                        🗑️ Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}