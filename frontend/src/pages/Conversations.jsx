import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Conversations() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [convos, setConvos]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    api.get('/chat/conversations/my')
      .then(res => setConvos(res.data.conversations || []))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return null

  var filtered = convos.filter(c => !search || (c.otherName || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', padding: '24px 16px 36px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 4 }}>💬 Messages</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 16 }}>Buyers aur sellers se baat karo</p>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 14, padding: '12px 0', fontFamily: 'Nunito, sans-serif' }} />
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -12, paddingBottom: 40 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💬</div>
            <h3>{search ? 'Koi result nahi' : 'Koi conversation nahi'}</h3>
            <p>{search ? 'Dusra naam try karo' : 'Kisi listing pe jaao aur Chat button click karo'}</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/browse')}>
              🔍 Browse Listings
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(function(c) {
              return (
                <div key={c.roomId} onClick={() => navigate('/chat/' + c.roomId)}
                  style={{ background: 'white', borderRadius: 18, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(107,33,168,0.06)', border: '2px solid transparent', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6B21A8'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #6B21A8, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: '0 4px 12px rgba(107,33,168,0.25)' }}>
                    {(c.otherName?.[0] || '?').toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{c.otherName || 'User'}</div>
                    <div style={{ fontSize: 13, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.lastMessage}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>{new Date(c.lastTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                    <div style={{ color: '#6B21A8', fontSize: 18 }}>›</div>
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