import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function Chat() {
  const { roomId }  = useParams()
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [socket, setSocket]       = useState(null)
  const [connected, setConnected] = useState(false)
  const [typing, setTyping]       = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  var parts     = roomId?.split('_') || []
  var listingId = parts[0] || ''
  var receiverId = parts[1] || ''

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    var s = io(SOCKET_URL, { transports: ['websocket', 'polling'] })
    setSocket(s)
    s.on('connect', function() {
      setConnected(true)
      s.emit('user_online', user.id)
      s.emit('join_room', roomId)
    })
    s.on('disconnect', function() { setConnected(false) })
    s.on('receive_message', function(msg) { setMessages(p => [...p, msg]) })
    s.on('typing', function(data) { if (data.userId !== user.id) { setTyping(true); setTimeout(() => setTyping(false), 2000) } })
    api.get('/chat/' + roomId).then(res => setMessages(res.data.messages || [])).catch(() => {})
    return function() { s.disconnect() }
  }, [roomId, user])

  useEffect(function() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!input.trim() || !socket) return
    var msg = { roomId, senderId: user.id, senderName: user.name, message: input.trim(), listingId }
    socket.emit('send_message', msg)
    api.post('/chat/save', { roomId, message: input.trim(), listingId, receiverId }).catch(() => {})
    setInput('')
    inputRef.current?.focus()
  }

  function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  var formatTime = function(date) { return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }

  if (!user) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8FAFC', paddingTop: 64 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/messages')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '2px solid rgba(245,158,11,0.5)' }}>💬</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Chat</div>
          <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: connected ? '#6EE7B7' : '#FCA5A5' }} />
            <span style={{ color: connected ? '#6EE7B7' : '#FCA5A5', fontWeight: 600 }}>{connected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
        <button onClick={() => navigate('/listing/' + listingId)} style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#FCD34D', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
          View Item
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>💬</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Conversation shuru karo!</div>
            <div style={{ fontSize: 13 }}>Item ke baare mein poocho, price negotiate karo</div>
          </div>
        )}

        {messages.map(function(msg, i) {
          var isMe = msg.senderId === user.id
          var showAvatar = !isMe && (i === 0 || messages[i-1]?.senderId !== msg.senderId)
          return (
            <div key={msg.id || i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
              {!isMe && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: showAvatar ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, color: 'white', fontWeight: 800 }}>
                  {showAvatar ? (msg.senderName?.[0] || '?').toUpperCase() : ''}
                </div>
              )}
              <div style={{ maxWidth: '72%' }}>
                {!isMe && showAvatar && (
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, marginBottom: 4, marginLeft: 4 }}>{msg.senderName}</div>
                )}
                <div style={{
                  padding: '11px 16px',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMe ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : 'white',
                  color: isMe ? 'white' : '#111827',
                  boxShadow: isMe ? '0 4px 16px rgba(107,33,168,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                  fontSize: 14, lineHeight: 1.5,
                }}>
                  {msg.message}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: isMe ? 'right' : 'left', marginLeft: isMe ? 0 : 4, marginRight: isMe ? 4 : 0 }}>
                  {formatTime(msg.createdAt)} {isMe && '✓✓'}
                </div>
              </div>
            </div>
          )
        })}

        {typing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'white', borderRadius: 18, padding: '12px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF', animation: 'typingDot 1.4s ease ' + (i * 0.2) + 's infinite' }} />
              ))}
            </div>
            <style>{`@keyframes typingDot { 0%,60%,100%{opacity:0.3;transform:scale(0.8)} 30%{opacity:1;transform:scale(1.2)} }`}</style>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #F3F4F6', boxShadow: '0 -4px 16px rgba(107,33,168,0.06)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        {/* Quick replies */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, overflowX: 'auto' }}>
          {['Is it available?', 'Negotiable?', 'Can we meet today?', 'Share location?'].map(function(q) {
            return (
              <button key={q} onClick={() => setInput(q)} style={{ flexShrink: 0, background: '#F5F3FF', color: '#6B21A8', border: '1px solid rgba(107,33,168,0.2)', borderRadius: 99, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                {q}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, background: '#F9FAFB', border: '2px solid #E5E7EB', borderRadius: 24, padding: '10px 16px', transition: 'all 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = '#6B21A8'}
          >
            <textarea ref={inputRef} value={input}
              onChange={e => { setInput(e.target.value); socket?.emit('typing', { roomId, userId: user.id }) }}
              onKeyDown={handleKey}
              placeholder="Message likho..."
              rows={1}
              style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'Nunito, sans-serif', resize: 'none', color: '#111827', lineHeight: 1.5, maxHeight: 100, overflowY: 'auto' }}
            />
          </div>
          <button onClick={sendMessage} disabled={!input.trim()}
            style={{ width: 48, height: 48, borderRadius: '50%', background: input.trim() ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : '#E5E7EB', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, transition: 'all 0.2s', boxShadow: input.trim() ? '0 4px 16px rgba(107,33,168,0.4)' : 'none' }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}