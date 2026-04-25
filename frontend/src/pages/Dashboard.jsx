import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Dashboard() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }

    Promise.all([
      api.get('/listings/user/' + user.id),
      api.get('/orders/my'),
    ]).then(function(results) {
      var listingsRes = results[0]
      var ordersRes   = results[1]
      var listings = listingsRes.data.listings || []
      var sold     = ordersRes.data.sold       || []
      var bought   = ordersRes.data.bought     || []

      setData({
        listings:      listings,
        totalListings: listings.length,
        totalViews:    listings.reduce(function(a, l) { return a + (l.views || 0) }, 0),
        activeListings:listings.filter(function(l) { return l.isActive }).length,
        totalOrders:   sold.length,
        pendingOrders: sold.filter(function(o) { return o.status === 'pending' }).length,
        completedOrders: sold.filter(function(o) { return o.status === 'completed' }).length,
        totalEarnings: sold
          .filter(function(o) { return o.status === 'completed' })
          .reduce(function(a, o) { return a + (o.listingPrice || 0) }, 0),
        recentOrders:  sold.slice(0, 5),
        bought:        bought,
      })
    }).catch(function() {
      setData(null)
    }).finally(function() {
      setLoading(false)
    })
  }, [user])

  if (!user) return null
  if (loading) return React.createElement('div', { className: 'loader', style: { marginTop: 80 } }, '⏳')
  if (!data)   return React.createElement('div', { style: { padding: 100, textAlign: 'center' } }, 'Error loading dashboard')

  var statCards = [
    { icon: '📦', label: 'Total Listings',    value: data.totalListings,    color: '#2563EB', bg: '#EFF6FF' },
    { icon: '👁',  label: 'Total Views',       value: data.totalViews,       color: '#7C3AED', bg: '#F5F3FF' },
    { icon: '🛒',  label: 'Orders Received',   value: data.totalOrders,      color: '#FF6B35', bg: '#FFF0EB' },
    { icon: '✅',  label: 'Completed Sales',   value: data.completedOrders,  color: '#10B981', bg: '#ECFDF5' },
    { icon: '⏳',  label: 'Pending Orders',    value: data.pendingOrders,    color: '#F59E0B', bg: '#FFFBEB' },
    { icon: '💰',  label: 'Total Earnings',    value: '₹' + data.totalEarnings.toLocaleString('en-IN'), color: '#10B981', bg: '#ECFDF5' },
  ]

  var statusCfg = {
    pending:   { label: 'Pending',   color: '#F59E0B', bg: '#FFFBEB' },
    confirmed: { label: 'Confirmed', color: '#2563EB', bg: '#EFF6FF' },
    completed: { label: 'Completed', color: '#10B981', bg: '#ECFDF5' },
    cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2' },
  }

  return (
    <div className="container" style={{ paddingTop: 80 }}>
      <div style={{ paddingTop: 20, paddingBottom: 40 }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          borderRadius: 20, padding: '24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <img
            src={user.avatar || 'https://i.pravatar.cc/64?u=' + user.phone}
            alt={user.name}
            style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Seller Dashboard</div>
            <div style={{ color: 'white', fontSize: 22, fontWeight: 700, fontFamily: 'Baloo 2, cursive' }}>{user.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>📱 {user.phone}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className="btn btn-sm" style={{ background: '#FF6B35', color: 'white', border: 'none' }}
              onClick={function() { navigate('/post') }}>
              + New Listing
            </button>
            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              onClick={function() { navigate('/orders') }}>
              📦 Orders
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {statCards.map(function(s) {
            return (
              <div key={s.label} style={{
                background: s.bg, borderRadius: 14, padding: '16px',
                border: '1px solid ' + s.color + '22',
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Baloo 2, cursive' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* Recent Orders */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 700 }}>Recent Orders</div>
            <button className="btn btn-ghost btn-sm" onClick={function() { navigate('/orders') }}>View All →</button>
          </div>

          {data.recentOrders.length === 0 ? (
            <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>
              <div>Abhi koi order nahi aaya</div>
            </div>
          ) : (
            data.recentOrders.map(function(order) {
              var cfg = statusCfg[order.status] || statusCfg.pending
              return (
                <div key={order.id} style={{
                  background: 'white', borderRadius: 12, padding: '14px 16px',
                  marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6',
                }}>
                  <img
                    src={order.listingImage || 'https://placehold.co/48x48?text=Item'}
                    alt="item"
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{order.listingTitle}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>by {order.buyerName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>
                      ₹{(order.listingPrice || 0).toLocaleString('en-IN')}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* My Listings */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 700 }}>My Listings</div>
            <button className="btn btn-ghost btn-sm" onClick={function() { navigate('/profile') }}>Manage →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {data.listings.slice(0, 6).map(function(l) {
              return (
                <div key={l.id} onClick={function() { navigate('/listing/' + l.id) }}
                  style={{ background: 'white', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                  <div style={{ paddingTop: '65%', background: '#F3F4F6', position: 'relative' }}>
                    <img
                      src={l.images && l.images[0] ? l.images[0] : 'https://placehold.co/160x100?text=Item'}
                      alt={l.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>₹{(l.price || 0).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>👁 {l.views || 0} views</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}