import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const statusConfig = {
  pending:   { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: '⏳', label: 'Pending' },
  confirmed: { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: '✅', label: 'Confirmed' },
  completed: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: '🎉', label: 'Completed' },
  cancelled: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: '❌', label: 'Cancelled' },
}

export default function Orders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState({ bought: [], sold: [] })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('bought')
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState('')

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    fetchOrders()
  }, [user])

  async function fetchOrders() {
    setLoading(true)
    try {
      var res = await api.get('/orders/my')
      setOrders(res.data)
    } catch(e) { setOrders({ bought: [], sold: [] }) }
    setLoading(false)
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function updateStatus(id, status) {
    try {
      await api.patch('/orders/' + id + '/status', { status })
      showToast('✅ Status updated!')
      fetchOrders()
    } catch(e) { showToast('❌ Failed') }
  }

  if (!user) return null

  var list = (tab === 'bought' ? orders.bought : orders.sold).filter(function(o) {
    if (filter === 'all') return true
    return o.status === filter
  })

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, background: '#1F2937', color: 'white', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', padding: '28px 16px 40px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 4 }}>📦 My Orders</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Track aur manage karo apne orders</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
            {[
              { icon: '🛒', label: 'Bought', value: orders.bought.length, color: '#A78BFA' },
              { icon: '🏪', label: 'Sold', value: orders.sold.length, color: '#FCD34D' },
              { icon: '⏳', label: 'Pending', value: [...orders.bought, ...orders.sold].filter(o => o.status === 'pending').length, color: '#FCD34D' },
              { icon: '✅', label: 'Completed', value: [...orders.bought, ...orders.sold].filter(o => o.status === 'completed').length, color: '#6EE7B7' },
            ].map(function(s) {
              return (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -16, paddingBottom: 40 }}>

        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: 16, padding: 6, display: 'flex', gap: 4, marginBottom: 20, boxShadow: '0 4px 16px rgba(107,33,168,0.08)' }}>
          {[
            { id: 'bought', icon: '🛒', label: 'Purchased (' + orders.bought.length + ')' },
            { id: 'sold',   icon: '🏪', label: 'Sold (' + orders.sold.length + ')' },
          ].map(function(t) {
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700,
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

        {/* Status Filter */}
        <div className="chip-row" style={{ marginBottom: 20 }}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(function(s) {
            var sc = statusConfig[s]
            return (
              <span key={s} onClick={() => setFilter(s)} style={{
                padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                background: filter === s ? '#6B21A8' : 'white',
                color: filter === s ? 'white' : '#374151',
                border: '2px solid ' + (filter === s ? '#6B21A8' : '#E5E7EB'),
                boxShadow: filter === s ? '0 4px 12px rgba(107,33,168,0.3)' : 'none',
              }}>
                {s === 'all' ? '📋 All' : sc.icon + ' ' + sc.label}
              </span>
            )
          })}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <div className="icon">{tab === 'bought' ? '🛒' : '🏪'}</div>
            <h3>{tab === 'bought' ? 'Koi purchase nahi' : 'Koi sale nahi'}</h3>
            <p>{tab === 'bought' ? 'Koi bhi item browse karo aur order karo!' : 'Apna item list karo aur sales shuru karo!'}</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate(tab === 'bought' ? '/browse' : '/post')}>
              {tab === 'bought' ? '🔍 Browse Items' : '➕ Post Ad'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {list.map(function(order) {
              var sc = statusConfig[order.status] || statusConfig.pending
              var isBuyer = tab === 'bought'

              return (
                <div key={order._id} style={{
                  background: 'white', borderRadius: 20, overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(107,33,168,0.06)',
                  border: '2px solid ' + sc.border,
                  transition: 'all 0.2s',
                }}>
                  {/* Status Bar */}
                  <div style={{ background: sc.bg, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{sc.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: sc.color }}>{sc.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                      <img
                        src={order.listingImage || 'https://placehold.co/80x80?text=Item'}
                        alt={order.listingTitle}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, flexShrink: 0, border: '2px solid #F3F4F6' }}
                        onError={function(e) { e.target.src = 'https://placehold.co/80x80?text=Item' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{order.listingTitle}</div>
                        <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#6B21A8', marginBottom: 6 }}>
                          ₹{(order.listingPrice || 0).toLocaleString('en-IN')}
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#6B7280' }}>
                          <span>💳 {order.paymentMethod}</span>
                          <span>📍 {order.listingLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Buyer/Seller Info */}
                    <div style={{ background: '#F9FAFB', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>🛒 Buyer</div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{order.buyerName}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>🏪 Seller</div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{order.sellerName}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>📍 Delivery Address</div>
                          <div style={{ fontSize: 13, color: '#374151' }}>{order.address}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {!isBuyer && order.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => updateStatus(order._id, 'confirmed')} className="btn btn-primary" style={{ flex: 1 }}>
                          ✅ Confirm Order
                        </button>
                        <button onClick={() => updateStatus(order._id, 'cancelled')} className="btn btn-ghost" style={{ flex: 1, color: '#DC2626', borderColor: '#FECACA' }}>
                          ❌ Cancel
                        </button>
                      </div>
                    )}
                    {!isBuyer && order.status === 'confirmed' && (
                      <button onClick={() => updateStatus(order._id, 'completed')} className="btn btn-green btn-full">
                        🎉 Mark as Completed
                      </button>
                    )}
                    {isBuyer && order.status === 'pending' && (
                      <button onClick={() => updateStatus(order._id, 'cancelled')} className="btn btn-ghost btn-full" style={{ color: '#DC2626', borderColor: '#FECACA' }}>
                        ❌ Cancel Order
                      </button>
                    )}
                    {order.sellerPhone && (
                      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <a href={'tel:' + order.sellerPhone} className="btn btn-outline-primary" style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}>
                          📞 Call {isBuyer ? 'Seller' : 'Buyer'}
                        </a>
                        <a href={'https://wa.me/91' + order.sellerPhone} target="_blank" rel="noopener noreferrer" className="btn btn-green" style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}>
                          💬 WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}