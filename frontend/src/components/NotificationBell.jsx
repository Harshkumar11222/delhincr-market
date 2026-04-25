import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function NotificationBell() {
  const { user } = useAuth()
  const [notifs, setNotifs]   = useState([])
  const [unread, setUnread]   = useState(0)
  const [open, setOpen]       = useState(false)
  const ref = useRef(null)

  useEffect(function() {
    if (!user) return
    fetchNotifs()
    var interval = setInterval(fetchNotifs, 30000) // every 30s
    return function() { clearInterval(interval) }
  }, [user])

  useEffect(function() {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return function() { document.removeEventListener('mousedown', handleClick) }
  }, [])

  function fetchNotifs() {
    api.get('/notifications/my')
      .then(function(res) {
        setNotifs(res.data.notifications || [])
        setUnread(res.data.unread || 0)
      })
      .catch(function() {})
  }

  function markAllRead() {
    api.patch('/notifications/read-all')
      .then(function() {
        setUnread(0)
        setNotifs(function(prev) {
          return prev.map(function(n) { return Object.assign({}, n, { read: true }) })
        })
      })
  }

  if (!user) return null

  var typeIcon = { order: '🛒', status: '📦', info: 'ℹ️' }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={function() { setOpen(function(o) { return !o }) }}
        style={{
          background: 'rgba(255,255,255,0.15)', border: 'none',
          borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, position: 'relative',
        }}>
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            background: '#EF4444', color: 'white',
            fontSize: 10, fontWeight: 700, width: 18, height: 18,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 44, right: 0, width: 320,
          background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid #F3F4F6', zIndex: 9999, overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                style={{ background: 'none', border: 'none', color: '#FF6B35', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                🔔 Koi notification nahi
              </div>
            ) : (
              notifs.map(function(n) {
                return (
                  <div key={n.id} style={{
                    padding: '12px 16px', borderBottom: '1px solid #F9FAFB',
                    background: n.read ? 'white' : '#FFF7ED',
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 20 }}>{typeIcon[n.type] || 'ℹ️'}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{n.message}</div>
                    </div>
                    {!n.read && (
                      <div style={{ width: 8, height: 8, background: '#FF6B35', borderRadius: '50%', flexShrink: 0, marginTop: 4 }} />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}