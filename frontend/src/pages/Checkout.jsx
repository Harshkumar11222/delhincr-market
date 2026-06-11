import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

var paymentMethods = [
  { id: 'cash_meetup',  icon: '💵', label: 'Cash on Meetup',   desc: 'Milke payment karo — safest option', recommended: true },
  { id: 'upi',          icon: '📱', label: 'UPI Transfer',      desc: 'GPay, PhonePe, Paytm' },
  { id: 'bank',         icon: '🏦', label: 'Bank Transfer',     desc: 'NEFT/IMPS/RTGS' },
  { id: 'cod',          icon: '📦', label: 'Cash on Delivery',  desc: 'Only for trusted sellers' },
]

export default function Checkout() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ address: '', paymentMethod: 'cash_meetup', note: '' })

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    fetchListing()
  }, [id, user])

  async function fetchListing() {
    setLoading(true)
    try {
      var res = await api.get('/listings/' + id)
      setListing(res.data)
    } catch(e) { navigate('/browse') }
    setLoading(false)
  }

  async function handleOrder(e) {
    e.preventDefault()
    setError('')
    if (!form.address.trim()) { setError('Address/location daalo meetup ke liye'); return }
    setOrdering(true)
    try {
      var res = await api.post('/orders', { listingId: id, address: form.address, paymentMethod: form.paymentMethod, note: form.note })
      setOrderId(res.data._id)
      setOrdered(true)
    } catch(err) { setError(err.response?.data?.error || 'Order nahi hua') }
    setOrdering(false)
  }

  if (!user) return null
  if (loading) return (
    <div style={{ paddingTop: 60, background: '#F8FAFC', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[300, 400].map((h, i) => <div key={i} className="skeleton" style={{ height: h, borderRadius: 24 }} />)}
        </div>
      </div>
    </div>
  )

  if (ordered) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', paddingTop: 60, padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 28, padding: '48px 36px', textAlign: 'center', maxWidth: 480, width: '100%', boxShadow: '0 16px 48px rgba(107,33,168,0.12)' }}>
          <div style={{ fontSize: 72, marginBottom: 16, animation: 'bounce 0.6s ease' }}>🎉</div>
          <style>{`@keyframes bounce { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }`}</style>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#059669', marginBottom: 8 }}>Order Placed!</h2>
          <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 20 }}>
            Seller ko notify kar diya gaya hai. Woh jaldi confirm karega.
          </p>
          <div style={{ background: '#F5F3FF', borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#6B21A8', fontWeight: 700, marginBottom: 4 }}>Order ID</div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#6B21A8', letterSpacing: 1 }}>#{orderId.slice(-8).toUpperCase()}</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/orders')} className="btn btn-primary btn-lg" style={{ flex: 2 }}>📦 Track Order</button>
            <button onClick={() => navigate('/browse')} className="btn btn-ghost btn-lg" style={{ flex: 1 }}>Browse More</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>
      <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', padding: '24px 16px 36px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>←</button>
            <div>
              <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: 'white' }}>🛒 Checkout</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Review aur confirm karo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, margin: '0 auto' }}>

          {/* Left — Order Form */}
          <div>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 14, padding: '12px 16px', color: '#DC2626', marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleOrder}>
              {/* Payment Method */}
              <div style={{ background: 'white', borderRadius: 20, padding: '20px', marginBottom: 16, boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>💳 Payment Method</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {paymentMethods.map(function(pm) {
                    return (
                      <label key={pm.id} onClick={() => setForm(f => ({ ...f, paymentMethod: pm.id }))} style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                        borderRadius: 14, border: '2px solid ' + (form.paymentMethod === pm.id ? '#6B21A8' : '#E5E7EB'),
                        background: form.paymentMethod === pm.id ? '#F5F3FF' : 'white', cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                        <div style={{ fontSize: 28 }}>{pm.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: form.paymentMethod === pm.id ? '#6B21A8' : '#111827' }}>{pm.label}</span>
                            {pm.recommended && <span style={{ background: '#ECFDF5', color: '#059669', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>✓ Recommended</span>}
                          </div>
                          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{pm.desc}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (form.paymentMethod === pm.id ? '#6B21A8' : '#D1D5DB'), background: form.paymentMethod === pm.id ? '#6B21A8' : 'white', flexShrink: 0 }} />
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Address */}
              <div style={{ background: 'white', borderRadius: 20, padding: '20px', marginBottom: 16, boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📍 Meetup Location *</div>
                <div className="form-group">
                  <textarea className="form-control" rows={3} placeholder="Meeting ki jagah ya address daalo — e.g. Sector 62 Metro Station, Noida" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>💬 Note for Seller (optional)</label>
                  <input className="form-control" placeholder="Koi special request ya time preference..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={ordering} style={{
                width: '100%', padding: '16px', borderRadius: 99,
                background: 'linear-gradient(135deg, #6B21A8, #7C3AED)',
                color: 'white', border: 'none', fontWeight: 800,
                fontSize: 17, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                boxShadow: '0 6px 20px rgba(107,33,168,0.4)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => !ordering && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {ordering ? '⏳ Placing Order...' : '✅ Confirm Order'}
              </button>
            </form>
          </div>

          {/* Right — Order Summary */}
          <div>
            <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)', position: 'sticky', top: 80 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📋 Order Summary</div>

              {listing && (
                <>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 20, padding: '16px', background: '#F9FAFB', borderRadius: 16 }}>
                    <img src={listing.images?.[0] || 'https://placehold.co/80x80?text=Item'} alt={listing.title}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
                      onError={e => e.target.src = 'https://placehold.co/80x80?text=Item'} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{listing.title}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>📦 {listing.condition} • {listing.category}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>📍 {listing.city}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
                    {[
                      { label: 'Item Price', value: '₹' + (listing.price || 0).toLocaleString('en-IN') },
                      { label: 'Platform Fee', value: 'FREE 🎉' },
                      { label: 'Delivery', value: 'Meetup Only' },
                    ].map(function(item) {
                      return (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ fontSize: 14, color: '#6B7280' }}>{item.label}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: item.value.includes('FREE') ? '#059669' : '#111827' }}>{item.value}</span>
                        </div>
                      )
                    })}
                    <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 17, fontWeight: 800 }}>Total</span>
                      <span style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#6B21A8' }}>₹{(listing.price || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Seller */}
                  <div style={{ marginTop: 16, padding: '14px 16px', background: '#F5F3FF', borderRadius: 14 }}>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>🏪 Seller</div>
                    <div style={{ fontWeight: 700, color: '#374151', marginBottom: 4 }}>{listing.sellerName}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a href={'tel:+91' + listing.sellerPhone} style={{ flex: 1, background: '#6B21A8', color: 'white', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>📞 Call</a>
                      <a href={'https://wa.me/91' + listing.sellerPhone} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: '#059669', color: 'white', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>💬 WhatsApp</a>
                    </div>
                  </div>
                </>
              )}

              {/* Trust badges */}
              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['🔒 Secure', '✅ Verified', '🆓 Free Platform'].map(function(b) {
                  return (
                    <span key={b} style={{ fontSize: 11, background: '#F3F4F6', color: '#6B7280', padding: '4px 10px', borderRadius: 99, fontWeight: 600 }}>{b}</span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}