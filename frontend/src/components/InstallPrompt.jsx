import React, { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt]         = useState(false)
  const [installed, setInstalled]           = useState(false)

  useEffect(function() {
    // Check already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault()
      setDeferredPrompt(e)
      // 3 sec baad prompt dikhao
      setTimeout(function() { setShowPrompt(true) }, 3000)
    })

    window.addEventListener('appinstalled', function() {
      setInstalled(true)
      setShowPrompt(false)
    })
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setInstalled(true)
    }
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showPrompt || installed) return null

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 9999,
      background: 'white', borderRadius: 16, padding: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '2px solid #FF6B35',
      display: 'flex', alignItems: 'center', gap: 14,
      animation: 'slideUp 0.3s ease',
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <div style={{ width: 48, height: 48, background: '#FF6B35', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
        📱
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 2 }}>
          App Install Karo!
        </div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>
          Home screen pe add karo — fast & offline
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleInstall}
          style={{
            background: '#FF6B35', color: 'white', border: 'none',
            borderRadius: 99, padding: '8px 16px', fontWeight: 700,
            fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
          }}>
          Install
        </button>
        <button
          onClick={function() { setShowPrompt(false) }}
          style={{
            background: '#F3F4F6', color: '#6B7280', border: 'none',
            borderRadius: 99, padding: '8px 12px', cursor: 'pointer',
            fontSize: 13, fontFamily: 'Nunito, sans-serif',
          }}>
          ✕
        </button>
      </div>
    </div>
  )
}