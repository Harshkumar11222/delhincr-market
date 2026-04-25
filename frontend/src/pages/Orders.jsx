import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const statusConfig = {
  pending:   { label: 'Pending',   color: '#F59E0B', bg: '#FFFBEB', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: '#2563EB', bg: '#EFF6FF', icon: '✅' },
  completed: { label: 'Completed', color: '#10B981', bg: '#ECFDF5', icon: '🎉' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2', icon: '❌' },
}

function timeAgo(date) {
  var diff = Date.now() - new Date(date)
  var hrs  = Math.floor(diff / 3600000)
  var days = Math.floor(diff / 86400000)
  if (hrs < 1)  return 'Just now'
  if (hrs < 24) return hrs + 'h ago'
  return days + 'd ago'
}

function buildWaUrl(order, isSeller) {
  var phone = isSeller ? order.buyerPhone : order.sellerPhone
  var text  = 'Hi, regarding order ' + order.id.slice(0, 8).toUpperCase() + ' for ' + order.listingTitle
  return 'https://wa.me/91' + (phone || '') + '?text=' + encodeURIComponent(text)
}

function OrderCard(props) {
  var order           = props.order
  var role            = props.role
  var onStatusChange  = props.onStatusChange
  var isSeller        = role === 'sold'
  var cfg             = statusConfig[order.status] || statusConfig.pending
  var showWhatsApp    = order.status === 'pending' || order.status === 'confirmed'
  var waUrl           = buildWaUrl(order, isSeller)
  var whoLabel        = isSeller ? ('👤 Buyer: ' + order.buyerName) : ('🏪 Seller: ' + order.sellerName)

  return (
    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #F3F4F6', marginBottom: 14 }}>

      <div style={{ padding: '14px 16px', borderBottom: '1px solid #F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>Order ID: </span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{order.id.slice(0, 8).toUpperCase()}</span>
          <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 12 }}>{timeAgo(order.createdAt)}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: cfg.bg, color: cfg.color }}>
          {cfg.icon} {cfg.label}
        </span>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <img
          src={order.listingImage || 'https://placehold.co/72x72?text=Item'}
          alt="item"
          style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
          onError={function(e){ e.target.src = 'https://placehold.co/72x72?text=Item' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{order.listingTitle}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive', marginBottom: 8 }}>
            ₹{order.listingPrice ? order.listingPrice.toLocaleString('en-IN') : '0'}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 3 }}>{whoLabel}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 3 }}>💳 {order.paymentMethod}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>📍 {order.address}</div>
          {order.note ? (
            <div style={{ fontSize: 12, color: '#374151', marginTop: 6, background: '#F9FAFB', padding: '6px 10px', borderRadius: 8 }}>
              💬 {order.note}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #F9FAFB', display: 'flex', gap: 8, flexWrap: 'wrap' }}>

        {isSeller && order.status === 'pending' ? (
          <React.Fragment>
            <button
              className="btn btn-green btn-sm"
              onClick={function(){ onStatusChange(order.id, 'confirmed') }}>
              ✅ Confirm Order
            </button>
            <button
              className="btn btn-sm"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}
              onClick={function(){ onStatusChange(order.id, 'cancelled') }}>
              ❌ Cancel
            </button>
          </React.Fragment>
        ) : null}

        {!isSeller && order.status === 'completed' ? (
  <button
    className="btn btn-sm"
    style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FCD34D' }}
    onClick={function() {
      var rating  = window.prompt('Rating do (1-5):')
      var comment = window.prompt('Review likho:')
      if (!rating) return
      api.post('/reviews', {
        orderId:   order.id,
        listingId: order.listingId,
        rating:    parseInt(rating),
        comment:   comment || ''
      }).then(function() {
        alert('Review submit ho gaya! ⭐')
      }).catch(function(err) {
        alert(err.response?.data?.error || 'Review submit nahi hua')
      })
    }}>
    ⭐ Write Review
  </button>
) : null}

        {!isSeller && order.status === 'pending' ? (
          <button
            className="btn btn-sm"
            style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}
            onClick={function(){ onStatusChange(order.id, 'cancelled') }}>
            ❌ Cancel Order
          </button>
        ) : null}

        {showWhatsApp ? (
          <button
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm"
            style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', textDecoration: 'none' }}>
            💬 WhatsApp {isSeller ? 'Buyer' : 'Seller'}
          </button>
        ) : null}

      </div>
    </div>
  )
}

export default function Orders() {
  var auth      = useAuth()
  var user      = auth.user
  var navigate  = useNavigate()
  var stateArr  = useState([])
  var bought    = stateArr[0]
  var setBought = stateArr[1]
  var stateArr2 = useState([])
  var sold      = stateArr2[0]
  var setSold   = stateArr2[1]
  var stateArr3 = useState(true)
  var loading   = stateArr3[0]
  var setLoading= stateArr3[1]
  var stateArr4 = useState('bought')
  var tab       = stateArr4[0]
  var setTab    = stateArr4[1]

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    api.get('/orders/my')
      .then(function(res) {
        setBought(res.data.bought || [])
        setSold(res.data.sold || [])
      })
      .finally(function() { setLoading(false) })
  }, [user])

  function handleStatusChange(orderId, status) {
    api.patch('/orders/' + orderId + '/status', { status: status })
      .then(function() {
        return api.get('/orders/my')
      })
      .then(function(res) {
        setBought(res.data.bought || [])
        setSold(res.data.sold || [])
      })
      .catch(function() {
        alert('Status update failed')
      })
  }

  if (!user) return null

  var currentList = tab === 'bought' ? bought : sold

  return (
    <div className="container" style={{ paddingTop: 80 }}>
      <div style={{ paddingTop: 20 }}>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, marginBottom: 4 }}>My Orders</h2>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>Track your buys and sales</p>

        <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#F3F4F6', borderRadius: 12, padding: 4 }}>
          <button
            onClick={function(){ setTab('bought') }}
            style={{
              flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
              background: tab === 'bought' ? 'white' : 'transparent',
              color: tab === 'bought' ? '#FF6B35' : '#6B7280',
              boxShadow: tab === 'bought' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}>
            🛒 Bought ({bought.length})
          </button>
          <button
            onClick={function(){ setTab('sold') }}
            style={{
              flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
              background: tab === 'sold' ? 'white' : 'transparent',
              color: tab === 'sold' ? '#FF6B35' : '#6B7280',
              boxShadow: tab === 'sold' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}>
            🏪 Selling ({sold.length})
          </button>
        </div>

        {loading ? (
          <div className="loader">⏳</div>
        ) : currentList.length === 0 ? (
          <div className="empty-state">
            <div className="icon">{tab === 'bought' ? '🛒' : '🏪'}</div>
            <h3>{tab === 'bought' ? 'Koi purchase nahi ki abhi tak' : 'Koi order nahi aaya abhi tak'}</h3>
            <p style={{ marginBottom: 16 }}>
              {tab === 'bought' ? 'Browse karo aur kharido!' : 'Listing post karo aur orders ka wait karo.'}
            </p>
            <button
              className="btn btn-primary"
              onClick={function(){ navigate(tab === 'bought' ? '/browse' : '/post') }}>
              {tab === 'bought' ? '🔍 Browse Listings' : '➕ Post Listing'}
            </button>
          </div>
        ) : (
          <div style={{ paddingBottom: 32 }}>
            {currentList.map(function(order) {
              return (
                <OrderCard
                  key={order.id}
                  order={order}
                  role={tab}
                  onStatusChange={handleStatusChange}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}