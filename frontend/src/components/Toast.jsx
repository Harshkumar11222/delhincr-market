import React, { useEffect } from 'react'

// Usage: <Toast message="Posted!" type="success" onClose={() => setToast(null)} />
// type: "success" | "error" | "info"

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: { bg: '#10B981', icon: '✅' },
    error:   { bg: '#EF4444', icon: '❌' },
    info:    { bg: '#2563EB', icon: 'ℹ️' },
  }

  const { bg, icon } = colors[type] || colors.success

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%',
      transform: 'translateX(-50%)',
      background: bg, color: 'white',
      padding: '12px 24px', borderRadius: 99,
      fontSize: 14, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: 8,
      animation: 'slideUp 0.3s ease',
      whiteSpace: 'nowrap',
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
      <span>{icon}</span>
      <span>{message}</span>
      <span onClick={onClose} style={{ cursor: 'pointer', marginLeft: 4, opacity: 0.8 }}>✕</span>
    </div>
  )
}