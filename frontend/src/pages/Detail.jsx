import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Detail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [listing, setListing]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [activeImg, setActiveImg]   = useState(0)
  const [reviews, setReviews]       = useState([])
  const [wishlisted, setWishlisted] = useState(false)
  const [reporting, setReporting]   = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [shareToast, setShareToast] = useState(false)
  const [imgZoom, setImgZoom]       = useState(false)
  const [toast, setToast]           = useState('')
  const [relatedListings, setRelatedListings] = useState([])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(function() {
    fetchListing()
    window.scrollTo(0, 0)
  }, [id])

  async function fetchListing() {
    setLoading(true)
    try {
      var res = await api.get('/listings/' + id)
      setListing(res.data)
      // Fetch related listings
      var related = await api.get('/listings?category=' + res.data.category + '&limit=4')
      setRelatedListings((related.data.listings || []).filter(l => l._id !== id).slice(0, 4))
      // Check wishlist
      if (user) {
        var userRes = await api.get('/auth/me').catch(() => null)
        if (userRes?.data?.wishlist?.includes(id)) setWishlisted(true)
      }
    } catch(e) { navigate('/browse') }
    setLoading(false)
  }

  async function handleWishlist() {
    if (!user) { navigate('/login'); return }
    try {
      var res = await api.post('/listings/' + id + '/wishlist')
      setWishlisted(res.data.wishlisted)
      showToast(res.data.wishlisted ? '❤️ Wishlist mein add kiya!' : '💔 Wishlist se remove kiya')
    } catch(e) {}
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: listing.title, text: '₹' + listing.price + ' - ' + listing.title + ' on NukkadMarket', url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2500)
    }
  }

  async function handleReport() {
    if (!reportReason) return
    try {
      await api.post('/listings/' + id + '/report', { reason: reportReason })
      setReporting(false)
      setReportReason('')
      showToast('🚨 Report submit ho gaya. 24 ghante mein review karenge.')
    } catch(e) { setReporting(false) }
  }

  var timeAgo = function(date) {
    var diff = Date.now() - new Date(date)
    var days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return days + ' days ago'
    if (days < 30) return Math.floor(days / 7) + ' weeks ago'
    return Math.floor(days / 30) + ' months ago'
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 60, background: '#F8FAFC', minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div className="skeleton" style={{ paddingTop: '75%', borderRadius: 24 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[80, 40, 60, 100, 120].map(function(h, i) {
                return <div key={i} className="skeleton" style={{ height: h, borderRadius: 12 }} />
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) return null

  var images = listing.images && listing.images.length > 0 ? listing.images : ['https://placehold.co/600x400?text=No+Image']

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1F2937', color: 'white', padding: '12px 24px', borderRadius: 99, fontSize: 14, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      {/* Image Zoom Modal */}
      {imgZoom && (
        <div onClick={() => setImgZoom(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <button onClick={() => setImgZoom(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 44, height: 44, borderRadius: '50%', fontSize: 20, cursor: 'pointer' }}>✕</button>
          <img src={images[activeImg]} alt={listing.title} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }} />
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p - 1 + images.length) % images.length) }} style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 44, height: 44, borderRadius: '50%', fontSize: 20, cursor: 'pointer' }}>‹</button>
              <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p + 1) % images.length) }} style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 44, height: 44, borderRadius: '50%', fontSize: 20, cursor: 'pointer' }}>›</button>
            </>
          )}
        </div>
      )}

      {/* Report Modal */}
      {reporting && (
        <div onClick={() => setReporting(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 24, padding: '28px', maxWidth: 400, width: '100%' }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>🚨 Report Listing</div>
            <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
              {['Fake/Spam listing', 'Wrong category', 'Already sold', 'Offensive content', 'Fraud seller', 'Wrong price'].map(function(r) {
                return (
                  <label key={r} onClick={() => setReportReason(r)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: '2px solid ' + (reportReason === r ? '#DC2626' : '#E5E7EB'), cursor: 'pointer', background: reportReason === r ? '#FEF2F2' : 'white', transition: 'all 0.2s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid ' + (reportReason === r ? '#DC2626' : '#D1D5DB'), background: reportReason === r ? '#DC2626' : 'white', flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: reportReason === r ? '#DC2626' : '#374151' }}>{r}</span>
                  </label>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setReporting(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleReport} disabled={!reportReason} style={{ flex: 2, background: reportReason ? '#DC2626' : '#E5E7EB', color: 'white', border: 'none', borderRadius: 99, padding: '12px', fontWeight: 700, cursor: reportReason ? 'pointer' : 'not-allowed', fontFamily: 'Nunito, sans-serif' }}>
                🚨 Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: 20, paddingBottom: 48 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#9CA3AF' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#6B21A8', fontWeight: 600 }}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/browse')} style={{ cursor: 'pointer', color: '#6B21A8', fontWeight: 600 }}>Browse</span>
          <span>›</span>
          <span onClick={() => navigate('/browse?category=' + listing.category)} style={{ cursor: 'pointer', color: '#6B21A8', fontWeight: 600 }}>{listing.category}</span>
          <span>›</span>
          <span style={{ color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{listing.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

          {/* LEFT — Images */}
          <div>
            {/* Main Image */}
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 12, background: '#F3F4F6', cursor: 'zoom-in', boxShadow: '0 8px 32px rgba(107,33,168,0.12)' }}
              onClick={() => setImgZoom(true)}>
              <div style={{ paddingTop: '75%', position: 'relative' }}>
                <img src={images[activeImg]} alt={listing.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => e.target.src = 'https://placehold.co/600x400?text=No+Image'}
                />
              </div>

              {/* Badges */}
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {listing.isVerified && (
                  <span style={{ background: '#059669', color: 'white', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ✓ Verified
                  </span>
                )}
                {listing.isFeatured && (
                  <span style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 99 }}>
                    ⭐ Featured
                  </span>
                )}
              </div>

              <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
                  🔍 Click to zoom
                </span>
              </div>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p - 1 + images.length) % images.length) }}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    ‹
                  </button>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p + 1) % images.length) }}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    ›
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 99, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
                  {activeImg + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                {images.map(function(img, i) {
                  return (
                    <div key={i} onClick={() => setActiveImg(i)} style={{ flexShrink: 0, width: 72, height: 56, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: '3px solid ' + (activeImg === i ? '#6B21A8' : 'transparent'), transition: 'all 0.2s' }}>
                      <img src={img} alt={i} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://placehold.co/72x56?text=Img'} />
                    </div>
                  )
                })}
              </div>
            )}

            {/* Safety Tips */}
            <div style={{ background: '#F0FDF4', border: '1.5px solid #A7F3D0', borderRadius: 16, padding: '16px', marginTop: 20 }}>
              <div style={{ fontWeight: 800, color: '#059669', fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                🛡️ Safety Tips
              </div>
              {[
                'Public jagah pe milkar deal karo',
                'Item check karne ke baad payment karo',
                'Advance payment kabhi mat do',
                'Suspicious lage toh report karo',
              ].map(function(tip) {
                return (
                  <div key={tip} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#065F46' }}>
                    <span>✓</span> {tip}
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT — Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Title & Category */}
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ background: '#F5F3FF', color: '#6B21A8', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99 }}>
                  📦 {listing.category}
                </span>
                <span style={{ background: '#F3F4F6', color: '#6B7280', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99 }}>
                  🔄 {listing.condition}
                </span>
                {listing.isNegotiable && (
                  <span style={{ background: '#FFFBEB', color: '#D97706', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99 }}>
                    🤝 Negotiable
                  </span>
                )}
              </div>
              <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: 12 }}>
                {listing.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 40, fontWeight: 800, color: '#6B21A8', lineHeight: 1 }}>
                  ₹{(listing.price || 0).toLocaleString('en-IN')}
                </div>
                {listing.isNegotiable && (
                  <span style={{ fontSize: 14, color: '#D97706', fontWeight: 700 }}>Negotiable</span>
                )}
              </div>
            </div>

            {/* Quick Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '📍', label: 'Location', value: listing.location + ', ' + listing.city },
                { icon: '📅', label: 'Posted', value: timeAgo(listing.createdAt) },
                { icon: '👁️', label: 'Views', value: (listing.views || 0) + ' views' },
                { icon: '🔄', label: 'Condition', value: listing.condition },
              ].map(function(item) {
                return (
                  <div key={item.label} style={{ background: '#F9FAFB', borderRadius: 12, padding: '12px 14px', border: '1px solid #F3F4F6' }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 2 }}>{item.icon} {item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{item.value}</div>
                  </div>
                )
              })}
            </div>

            {/* Description */}
            {listing.description && (
              <div style={{ background: 'white', borderRadius: 16, padding: '16px', border: '1px solid #F3F4F6', boxShadow: '0 2px 8px rgba(107,33,168,0.04)' }}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, marginBottom: 10, color: '#111827' }}>
                  📝 Description
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{listing.description}</p>
              </div>
            )}

            {/* Seller Card */}
            <div style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', borderRadius: 20, padding: '18px 20px', border: '1.5px solid rgba(107,33,168,0.15)' }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 15, fontWeight: 800, color: '#374151', marginBottom: 14 }}>
                🏪 Seller Information
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #6B21A8, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: '0 4px 12px rgba(107,33,168,0.3)' }}>
                  {listing.sellerName?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {listing.sellerName}
                    {listing.isVerified && (
                      <span style={{ background: '#059669', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>✓ Verified</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>📍 {listing.city}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Member since {new Date(listing.createdAt).getFullYear()}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Main CTA */}
              <button
                onClick={function() {
                  if (!user) { navigate('/login'); return }
                  navigate('/checkout/' + listing._id)
                }}
                style={{
                  width: '100%', padding: '16px', borderRadius: 99,
                  background: 'linear-gradient(135deg, #6B21A8, #7C3AED)',
                  color: 'white', border: 'none', fontWeight: 800,
                  fontSize: 17, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                  boxShadow: '0 6px 20px rgba(107,33,168,0.4)',
                  transition: 'all 0.2s', letterSpacing: '0.3px',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(107,33,168,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(107,33,168,0.4)' }}
              >
                🛒 Buy Now — ₹{(listing.price || 0).toLocaleString('en-IN')}
              </button>

              {/* Secondary buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <a href={'tel:+91' + listing.sellerPhone} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '13px', borderRadius: 99, background: '#F5F3FF',
                  color: '#6B21A8', textDecoration: 'none', fontWeight: 700, fontSize: 14,
                  border: '2px solid #6B21A8', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#6B21A8'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.color = '#6B21A8' }}
                >
                  📞 Call Seller
                </a>
                <a href={'https://wa.me/91' + listing.sellerPhone + '?text=Hi, I saw your listing "' + listing.title + '" on NukkadMarket. Is it still available?'}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '13px', borderRadius: 99,
                    background: 'linear-gradient(135deg, #059669, #10B981)',
                    color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  💬 WhatsApp
                </a>
              </div>

              {/* Chat Button */}
              <button
                onClick={function() {
                  if (!user) { navigate('/login'); return }
                  navigate('/chat/' + listing._id + '_' + user.id)
                }}
                style={{
                  width: '100%', padding: '13px', borderRadius: 99,
                  background: 'white', color: '#374151',
                  border: '2px solid #E5E7EB', fontWeight: 700,
                  fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6B21A8'; e.currentTarget.style.color = '#6B21A8' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151' }}
              >
                💬 Chat with Seller
              </button>
            </div>

            {/* Wishlist + Share + Report */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleWishlist} style={{
                flex: 1, padding: '11px', borderRadius: 12, cursor: 'pointer',
                background: wishlisted ? '#FEF2F2' : '#F9FAFB',
                border: '2px solid ' + (wishlisted ? '#FECACA' : '#E5E7EB'),
                color: wishlisted ? '#DC2626' : '#6B7280',
                fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
                {wishlisted ? '❤️ Saved' : '🤍 Save'}
              </button>
              <button onClick={handleShare} style={{
                flex: 1, padding: '11px', borderRadius: 12, cursor: 'pointer',
                background: shareToast ? '#ECFDF5' : '#F0F9FF',
                border: '2px solid ' + (shareToast ? '#A7F3D0' : '#BAE6FD'),
                color: shareToast ? '#059669' : '#0284C7',
                fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
                {shareToast ? '✅ Copied!' : '📤 Share'}
              </button>
              <button onClick={() => setReporting(true)} style={{
                padding: '11px 16px', borderRadius: 12, cursor: 'pointer',
                background: '#FFF7ED', border: '2px solid #FED7AA',
                color: '#D97706', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                🚨 Report
              </button>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#111827' }}>
                  🔗 Similar Listings
                </div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>Is category mein aur items</div>
              </div>
              <button onClick={() => navigate('/browse?category=' + listing.category)} className="btn btn-outline-primary btn-sm">
                View All →
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {relatedListings.map(function(l) {
                return (
                  <div key={l._id} onClick={() => { navigate('/listing/' + l._id); window.scrollTo(0, 0) }}
                    style={{ background: 'white', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 10px rgba(107,33,168,0.06)', border: '1px solid rgba(107,33,168,0.06)', transition: 'all 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(107,33,168,0.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(107,33,168,0.06)' }}
                  >
                    <div style={{ paddingTop: '65%', position: 'relative', background: '#F3F4F6', overflow: 'hidden' }}>
                      <img src={l.images?.[0] || 'https://placehold.co/200x130?text=Item'} alt={l.title}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        onError={e => e.target.src = 'https://placehold.co/200x130?text=Item'}
                      />
                      {l.isVerified && <span style={{ position: 'absolute', top: 8, left: 8, background: '#059669', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>✓</span>}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                      <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#6B21A8' }}>₹{(l.price || 0).toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>📍 {l.city}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}