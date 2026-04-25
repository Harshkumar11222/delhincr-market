import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const paymentMethods = [
  { id: 'cash_meetup', label: 'Cash on Meetup', icon: '🤝', desc: 'Seller se milke cash dena' },
  { id: 'upi',         label: 'UPI Transfer',   icon: '📱', desc: 'GPay / PhonePe / Paytm' },
  { id: 'escrow',      label: 'Safe Escrow',     icon: '🔒', desc: 'Paise hold hote hain — safe deal' },
]

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cash_meetup',
    note: '',
  })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get(`/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleOrder = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.address || !form.city) {
      setError('Address aur city required hai')
      return
    }
    setPlacing(true)
    try {
      const fullAddress = `${form.address}, ${form.city} - ${form.pincode}`
      const res = await api.post('/orders', {
        listingId: id,
        address: fullAddress,
        paymentMethod: form.paymentMethod,
        note: form.note,
      })
      setOrderId(res.data.id)
      setSuccess(true)
    } catch (err) {
        console.log('ORDER ERROR:', err)
        console.log('RESPONSE:', err.response)
        console.log('STATUS:', err.response?.status)
        console.log('DATA:', err.response?.data)
  
          if (err.response?.status === 401 || err.response?.status === 403) {
            setError('Pehle login karo — aapka session expire ho gaya')
          } else if (!err.response) {
            setError('Backend connect nahi ho raha — server band hai (localhost:5000)')
          } else {
            setError(err.response?.data?.error || 'Order place nahi hua: ' + err.message)
        }
    }
    setPlacing(false)
  }

  if (loading) return <div className="loader" style={{ marginTop: 80 }}>⏳</div>
  if (!listing) return null

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 24,
      }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, color: '#111827', marginBottom: 8 }}>
          Order Place Ho Gaya!
        </h2>
        <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 8 }}>
          Seller ko aapki request bhej di gayi hai.
        </p>
        <p style={{ color: '#10B981', fontSize: 14, fontWeight: 600, marginBottom: 28 }}>
          ✓ Seller aapse WhatsApp/Call pe contact karega
        </p>

        {/* Order Summary Box */}
        <div style={{
          background: '#F9FAFB', border: '1px solid #E5E7EB',
          borderRadius: 16, padding: '20px 24px', maxWidth: 360, width: '100%',
          marginBottom: 24, textAlign: 'left',
        }}>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Item</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{listing.title}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Amount</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive', marginBottom: 12 }}>
            ₹{listing.price?.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Payment</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
            {paymentMethods.find(p => p.id === form.paymentMethod)?.label}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>
            📦 My Orders
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/')}>
            🏠 Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 80, maxWidth: 640 }}>
      <div style={{ paddingTop: 20, paddingBottom: 40 }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Back to listing
        </button>

        <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, marginBottom: 4 }}>Checkout</h2>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>Confirm your order details</p>

        {/* Item Summary Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          borderRadius: 16, padding: '16px', marginBottom: 24,
          display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <img
            src={listing.images?.[0] || 'https://placehold.co/80x80?text=Item'}
            alt={listing.title}
            style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
            onError={e => { e.target.src = 'https://placehold.co/80x80?text=Item' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 2 }}>You are buying</div>
            <div style={{ color: 'white', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{listing.title}</div>
            <div style={{ color: '#FF6B35', fontSize: 22, fontWeight: 800, fontFamily: 'Baloo 2, cursive' }}>
              ₹{listing.price?.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Seller</div>
            <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{listing.sellerName}</div>
            {listing.isVerified && (
              <span style={{ fontSize: 11, color: '#34D399' }}>✓ Verified</span>
            )}
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '12px 16px', color: '#DC2626', marginBottom: 16, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleOrder}>

          {/* Contact Info */}
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #F3F4F6' }}>
            📋 Contact Information
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Your Name *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit number" maxLength={10} />
            </div>
          </div>

          {/* Address */}
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #F3F4F6', marginTop: 8 }}>
            📍 Meetup / Delivery Address
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input className="form-control" value={form.address} onChange={e => set('address', e.target.value)} placeholder="House no, Street, Area..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>City *</label>
              <select className="form-control" value={form.city} onChange={e => set('city', e.target.value)}>
                <option value="">Select City</option>
                {['Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>PIN Code</label>
              <input className="form-control" value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="110001" maxLength={6} />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #F3F4F6', marginTop: 8 }}>
            💳 Payment Method
          </div>

          <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
            {paymentMethods.map(pm => (
              <div key={pm.id}
                onClick={() => set('paymentMethod', pm.id)}
                style={{
                  border: `2px solid ${form.paymentMethod === pm.id ? '#FF6B35' : '#E5E7EB'}`,
                  borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                  background: form.paymentMethod === pm.id ? '#FFF0EB' : 'white',
                  display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s',
                }}>
                <span style={{ fontSize: 24 }}>{pm.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{pm.label}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{pm.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${form.paymentMethod === pm.id ? '#FF6B35' : '#D1D5DB'}`,
                    background: form.paymentMethod === pm.id ? '#FF6B35' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {form.paymentMethod === pm.id && <div style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="form-group">
            <label>Note to Seller (optional)</label>
            <textarea className="form-control" rows={3} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Koi special request ya message seller ke liye..." />
          </div>

          {/* Safety Tip */}
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#065F46' }}>
            🔒 <strong>Safe Deal Tips:</strong> Public jagah milein. Item check karke hi payment karein. Advance payment kabhi mat karein.
          </div>

          {/* Order Total */}
          <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#6B7280' }}>
              <span>Item Price</span>
              <span>₹{listing.price?.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#6B7280' }}>
              <span>Platform Fee</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ height: 1, background: '#E5E7EB', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#111827' }}>
              <span>Total</span>
              <span style={{ color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>₹{listing.price?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={placing}>
            {placing ? '⏳ Placing Order...' : `🛒 Place Order — ₹${listing.price?.toLocaleString('en-IN')}`}
          </button>
        </form>
      </div>
    </div>
  )
}