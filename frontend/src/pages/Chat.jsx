import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function Chat() {
  const { roomId }   = useParams()
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [socket, setSocket]     = useState(null)
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef(null)

  // listingId aur sellerId roomId se nikalo
  // roomId format: listingId_buyerId
  var parts    = roomId ? roomId.split('_') : []
  var listingId  = parts[0] || ''
  var receiverId = parts[1] || ''

  useEffect(function() {
    if (!user) { navigate('/login'); return }

    // Socket connect karo
    var newSocket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })
    setSocket(newSocket)

    newSocket.on('connect', function() {
      setConnected(true)
      newSocket.emit('user_online', user.id)
      newSocket.emit('join_room', roomId)
    })

    newSocket.on('receive_message', function(msg) {
      setMessages(function(prev) { return [...prev, msg] })
    })

    // Old messages fetch karo
    api.get('/chat/' + roomId)
      .then(function(res) { setMessages(res.data.messages || []) })
      .catch(function() {})

    return function() { newSocket.disconnect() }
  }, [roomId, user])

  // Auto scroll bottom
  useEffect(function() {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  var sendMessage = function() {
    if (!input.trim() || !socket) return
    var msgData = {
      roomId:     roomId,
      senderId:   user.id,
      senderName: user.name,
      message:    input.trim(),
      listingId:  listingId,
    }
    socket.emit('send_message', msgData)

    // Save to DB
    api.post('/chat/save', {
      roomId,
      message:    input.trim(),
      listingId,
      receiverId,
    }).catch(function() {})

    setInput('')
  }

  var handleKey = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!user) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: 60 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={function() { navigate(-1) }}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>
          ←
        </button>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Chat</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
            {connected ? '🟢 Connected' : '🔴 Connecting...'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        background: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
            <div>Abhi koi message nahi — shuru karo!</div>
          </div>
        )}

        {messages.map(function(msg, i) {
          var isMe = msg.senderId === user.id
          return (
            <div key={msg.id || i} style={{
              display: 'flex',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '70%',
                background: isMe ? '#FF6B35' : 'white',
                color: isMe ? 'white' : '#111827',
                padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}>
                {!isMe && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#FF6B35', marginBottom: 4 }}>
                    {msg.senderName}
                  </div>
                )}
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.message}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                  {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px', background: 'white',
        borderTop: '1px solid #E5E7EB', display: 'flex', gap: 10,
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}>
        <input
          value={input}
          onChange={function(e) { setInput(e.target.value) }}
          onKeyDown={handleKey}
          placeholder="Message likho..."
          style={{
            flex: 1, border: '2px solid #E5E7EB', borderRadius: 99,
            padding: '10px 16px', fontSize: 14, outline: 'none',
            fontFamily: 'Nunito, sans-serif',
          }}
          onFocus={function(e) { e.target.style.borderColor = '#FF6B35' }}
          onBlur={function(e) { e.target.style.borderColor = '#E5E7EB' }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            background: input.trim() ? '#FF6B35' : '#E5E7EB',
            color: input.trim() ? 'white' : '#9CA3AF',
            border: 'none', borderRadius: '50%', width: 44, height: 44,
            fontSize: 18, cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0,
          }}>
          ➤
        </button>
      </div>
    </div>
  )
}