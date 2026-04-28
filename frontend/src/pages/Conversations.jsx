import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Conversations() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [convos, setConvos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    api.get('/chat/conversations/my')
      .then(function(res) { setConvos(res.data.conversations || []) })
      .finally(function() { setLoading(false) })
  }, [user])

  if (!user) return null

  return (
    <div className="container" style={{ paddingTop: 80 }}>
      <div style={{ paddingTop: 20 }}>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, marginBottom: 4 }}>Messages</h2>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>Apni saari conversations</p>

        {loading ? (
          <div className="loader">⏳</div>
        ) : convos.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💬</div>
            <h3>Koi conversation nahi</h3>
            <p>Kisi listing pe jaao aur "Chat" button click karo</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }}
              onClick={function() { navigate('/browse') }}>
              Browse Listings
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {convos.map(function(c) {
              return (
                <div key={c.roomId}
                  onClick={function() { navigate('/chat/' + c.roomId) }}
                  style={{
                    background: 'white', borderRadius: 14, padding: '14px 16px',
                    display: 'flex', gap: 14, alignItems: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    border: '1px solid #F3F4F6', transition: 'all 0.2s',
                  }}
                  onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: '#EFF6FF', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>💬</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                      {c.otherName || 'User'}
                    </div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.lastMessage}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                    {new Date(c.lastTime).toLocaleDateString('en-IN')}
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