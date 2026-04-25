import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '20px',
    }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🗺️</div>
      <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 32, color: '#111827', marginBottom: 8 }}>
        404 — Page Not Found
      </h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 28 }}>
        Yeh page exist nahi karta. Shayad link galat hai.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => navigate('/')} style={{
          background: '#FF6B35', color: 'white', border: 'none',
          padding: '12px 28px', borderRadius: 99, fontSize: 15,
          fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
        }}>
          🏠 Go Home
        </button>
        <button onClick={() => navigate(-1)} style={{
          background: 'white', color: '#374151', border: '2px solid #E5E7EB',
          padding: '12px 28px', borderRadius: 99, fontSize: 15,
          fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
        }}>
          ← Go Back
        </button>
      </div>
    </div>
  )
}