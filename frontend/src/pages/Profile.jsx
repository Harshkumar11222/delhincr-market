import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [listings, setListings] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState({ bought: [], sold: [] })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({
    name:     user?.name || '',
    phone:    user?.phone || '',
    email:    user?.email || '',
    city:     user?.city || '',
    location: user?.location || '',
  })

  useEffect(function() {
    if (!user) { navigate('/login'); return }
    fetchData()
  }, [user])

  async function fetchData() {
    setLoading(true)
    try {
      var [listRes, wishRes, orderRes] = await Promise.all([
        api.get('/listings?userId=' + user.id),
        api.get('/listings/my/wishlist'),
        api.get('/orders/my'),
      ])
      setListings(listRes.data.listings || [])
      setWishlist(wishRes.data.wishlist || [])
      setOrders(orderRes.data || { bought: [], sold: [] })
    } catch(e) {}
    setLoading(false)
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!form.email || !form.email.trim()) {
    showToast('❌ Email zaroori hai')
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    showToast('❌ Valid email daalo')
    return
  }
  if (form.phone && (form.phone.length !== 10 || !/^[6-9]\d{9}$/.test(form.phone))) {
    showToast('❌ Valid 10-digit phone number daalo')
    return
  }
    try {
      await api.patch('/auth/profile', form)
      var updated = { ...user, ...form }
      localStorage.setItem('user', JSON.stringify(updated))
      showToast('✅ Profile updated!')
      setEditing(false)
      window.location.reload()
    } catch(err) { showToast('❌ Update failed') }
  }

  async function handleDeleteListing(id) {
    if (!window.confirm('Listing delete karna chahte ho?')) return
    try {
      await api.delete('/listings/' + id)
      setListings(p => p.filter(l => l._id !== id))
      showToast('✅ Listing deleted!')
    } catch(e) { showToast('❌ Failed') }
  }

  async function handleRemoveWishlist(id) {
    try {
      await api.post('/listings/' + id + '/wishlist')
      setWishlist(p => p.filter(l => l._id !== id))
      showToast('💔 Removed from wishlist')
    } catch(e) {}
  }

  if (!user) return null

  var tabs = [
    { id: 'profile',  icon: '👤', label: 'Profile' },
    { id: 'listings', icon: '🛍️', label: 'My Listings (' + listings.length + ')' },
    { id: 'wishlist', icon: '❤️', label: 'Wishlist (' + wishlist.length + ')' },
    { id: 'orders',   icon: '📦', label: 'Orders' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ]

  var stats = [
    { icon: '🛍️', label: 'Listings',   value: listings.length,      color: '#6B21A8' },
    { icon: '📦', label: 'Orders',     value: orders.bought.length,  color: '#2563EB' },
    { icon: '💰', label: 'Sold',       value: orders.sold.filter(o => o.status === 'completed').length, color: '#059669' },
    { icon: '❤️', label: 'Wishlist',   value: wishlist.length,       color: '#DC2626' },
  ]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, background: '#1F2937', color: 'white', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'toastIn 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* Profile Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)', padding: '32px 16px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=6B21A8&color=fff&size=96'}
                alt={user.name}
                style={{ width: 96, height: 96, borderRadius: 24, objectFit: 'cover', border: '3px solid rgba(245,158,11,0.6)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
              />
              {user.isVerified && (
                <div style={{ position: 'absolute', bottom: -6, right: -6, background: '#059669', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: '3px solid white' }}>
                  ✓
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: 'white' }}>{user.name}</h2>
                {user.isVerified && <span style={{ background: 'rgba(5,150,105,0.3)', color: '#6EE7B7', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(5,150,105,0.4)' }}>✓ Verified</span>}
                {user.isAdmin && <span style={{ background: 'rgba(245,158,11,0.3)', color: '#FCD34D', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(245,158,11,0.4)' }}>👑 Admin</span>}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 }}>📱 +91 {user.phone}</div>
              {user.email && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>📧 {user.email}</div>}
              {user.city && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>📍 {user.city}</div>}
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button onClick={() => setEditing(true)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                ✏️ Edit
              </button>
              {user.isAdmin && (
                <button onClick={() => navigate('/admin')} style={{ background: 'rgba(245,158,11,0.3)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                  👑 Admin
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
            {stats.map(function(s) {
              return (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: 'white' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -16, paddingBottom: 40 }}>

        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: 16, padding: 6, display: 'flex', gap: 4, marginBottom: 20, boxShadow: '0 4px 16px rgba(107,33,168,0.08)', overflowX: 'auto' }}>
          {tabs.map(function(t) {
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, minWidth: 100, padding: '10px 12px',
                borderRadius: 12, border: 'none', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 700,
                background: tab === t.id ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : 'transparent',
                color: tab === t.id ? 'white' : '#6B7280',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
                boxShadow: tab === t.id ? '0 4px 12px rgba(107,33,168,0.3)' : 'none',
              }}>
                {t.icon} {t.label}
              </button>
            )
          })}
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Profile Info */}
            <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, marginBottom: 20 }}>👤 Profile Info</div>

              {editing ? (
                <form onSubmit={handleUpdate}>
                  {[
                    { key: 'name', label: '👤 Name', type: 'text' },
                    { key: 'phone', label: '📱 Phone Number', type: 'tel' }, 
                    { key: 'email', label: '📧 Email', type: 'email' },
                    { key: 'city', label: '🏙️ City', type: 'text' },
                    { key: 'location', label: '📍 Area', type: 'text' },
                  ].map(function(f) {
                    return (
                      <div className="form-group" key={f.key}>
                        <label>{f.label}</label>
                        <input className="form-control" type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                      </div>
                    )
                  })}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn btn-primary btn-full">💾 Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost btn-full">Cancel</button>
                  </div>
                </form>
              ) : (
                <div>
                  {[
                    { icon: '👤', label: 'Name', value: user.name },
                    { icon: '📱', label: 'Phone', value: '+91 ' + user.phone },
                    { icon: '📧', label: 'Email', value: user.email || 'Not set' },
                    { icon: '🏙️', label: 'City', value: user.city || 'Not set' },
                    { icon: '📍', label: 'Area', value: user.location || 'Not set' },
                  ].map(function(item) {
                    return (
                      <div key={item.label} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{item.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: item.value.includes('Not set') ? '#9CA3AF' : '#111827' }}>{item.value}</div>
                        </div>
                      </div>
                    )
                  })}
                  <button onClick={() => setEditing(true)} className="btn btn-primary btn-full" style={{ marginTop: 16 }}>
                    ✏️ Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '➕', label: 'Post New Ad', sub: 'Free listing daalo', path: '/post', gradient: 'linear-gradient(135deg, #6B21A8, #7C3AED)', color: 'white' },
                { icon: '📦', label: 'My Orders', sub: orders.bought.length + ' purchases', path: '/orders', gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)', color: 'white' },
                { icon: '💬', label: 'Messages', sub: 'Chat with buyers/sellers', path: '/messages', gradient: 'linear-gradient(135deg, #059669, #10B981)', color: 'white' },
                { icon: '🔧', label: 'Support', sub: 'Get help anytime', path: '/support', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white' },
                { icon: '🛡️', label: 'Get Verified', sub: 'Badge haasil karo', path: '/verification', gradient: 'linear-gradient(135deg, #059669, #10B981)', color: 'white' },
              ].map(function(item) {
                return (
                  <div key={item.label} onClick={() => navigate(item.path)} style={{ background: item.gradient, borderRadius: 16, padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)' }}
                  >
                    <div style={{ fontSize: 28 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{item.sub}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontSize: 20 }}>→</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── LISTINGS TAB ── */}
        {tab === 'listings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800 }}>🛍️ My Listings</div>
              <button onClick={() => navigate('/post')} className="btn btn-primary btn-sm">➕ Post New</button>
            </div>

            {loading ? <div className="loader"><div className="spinner" /></div> :
            listings.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🛍️</div>
                <h3>Koi listing nahi</h3>
                <p>Apna pehla item list karo — bilkul free!</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/post')}>➕ Post Free Ad</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 14 }}>
                {listings.map(function(l) {
                  return (
                    <div key={l._id} style={{ background: 'white', borderRadius: 18, padding: '16px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 10px rgba(107,33,168,0.06)', border: '1px solid rgba(107,33,168,0.06)' }}>
                      <img src={l.images?.[0] || 'https://placehold.co/72x72?text=Item'} alt={l.title}
                        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{l.title}</div>
                        <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#6B21A8', marginBottom: 4 }}>
                          ₹{(l.price || 0).toLocaleString('en-IN')}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontSize: 11, background: l.isActive ? '#ECFDF5' : '#FEF2F2', color: l.isActive ? '#059669' : '#DC2626', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                            {l.isActive ? '🟢 Active' : '🔴 Inactive'}
                          </span>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>👁 {l.views || 0} views</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button onClick={() => navigate('/listing/' + l._id)} className="btn btn-outline-primary btn-sm">
                          👁 View
                        </button>
                        <button onClick={() => handleDeleteListing(l._id)} style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── WISHLIST TAB ── */}
        {tab === 'wishlist' && (
          <div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>❤️ Saved Items</div>

            {wishlist.length === 0 ? (
              <div className="empty-state">
                <div className="icon">❤️</div>
                <h3>Wishlist empty hai</h3>
                <p>Browse karo aur ❤️ button se items save karo</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/browse')}>🔍 Browse Items</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {wishlist.map(function(l) {
                  return (
                    <div key={l._id} style={{ background: 'white', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 10px rgba(107,33,168,0.06)', border: '1px solid rgba(107,33,168,0.06)', position: 'relative' }}>
                      <div style={{ paddingTop: '65%', position: 'relative', background: '#F3F4F6' }}>
                        <img src={l.images?.[0] || 'https://placehold.co/200x130?text=Item'} alt={l.title}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => navigate('/listing/' + l._id)} />
                        <button onClick={() => handleRemoveWishlist(l._id)}
                          style={{ position: 'absolute', top: 8, right: 8, background: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ❤️
                        </button>
                      </div>
                      <div style={{ padding: '12px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                        <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#6B21A8' }}>₹{(l.price || 0).toLocaleString('en-IN')}</div>
                        <button onClick={() => navigate('/listing/' + l._id)} className="btn btn-primary btn-full btn-sm" style={{ marginTop: 10 }}>View Item →</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800 }}>📦 Recent Orders</div>
              <button onClick={() => navigate('/orders')} className="btn btn-primary btn-sm">View All →</button>
            </div>
            {[...orders.bought.slice(0, 5)].map(function(o) {
              var sc = { pending: { color: '#D97706', icon: '⏳' }, confirmed: { color: '#2563EB', icon: '✅' }, completed: { color: '#059669', icon: '🎉' }, cancelled: { color: '#DC2626', icon: '❌' } }[o.status] || { color: '#D97706', icon: '⏳' }
              return (
                <div key={o._id} style={{ background: 'white', borderRadius: 16, padding: '16px', marginBottom: 12, display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 2px 8px rgba(107,33,168,0.06)' }}>
                  <img src={o.listingImage || 'https://placehold.co/56x56?text=Item'} alt={o.listingTitle}
                    style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{o.listingTitle}</div>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 16, fontWeight: 800, color: '#6B21A8' }}>₹{(o.listingPrice || 0).toLocaleString('en-IN')}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: sc.color, background: sc.color + '15', padding: '4px 10px', borderRadius: 99 }}>
                    {sc.icon} {o.status}
                  </span>
                </div>
              )
            })}
            {orders.bought.length === 0 && (
              <div className="empty-state">
                <div className="icon">📦</div>
                <h3>Koi order nahi</h3>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/browse')}>Browse Items</button>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>⚙️ Settings</div>

            {[
              { section: '🔒 Account', items: [
                { icon: '🔑', label: 'Change Password', sub: 'Update your password', action: () => navigate('/forgot-password') },
                { icon: '📧', label: 'Update Email', sub: user.email || 'Add email address', action: () => { setTab('profile'); setEditing(true) } },
              ]},
              { section: '🔔 Notifications', items: [
                { icon: '📱', label: 'Order Updates', sub: 'SMS + Email notifications', toggle: true, default: true },
                { icon: '💬', label: 'Chat Messages', sub: 'New message alerts', toggle: true, default: true },
                { icon: '🏷️', label: 'Price Drops', sub: 'Wishlist price alerts', toggle: true, default: false },
              ]},
              { section: '🛡️ Privacy', items: [
                { icon: '📞', label: 'Phone Visibility', sub: 'Show phone to buyers', toggle: true, default: true },
                { icon: '📍', label: 'Location', sub: 'Show city in listings', toggle: true, default: true },
              ]},
              { section: '⚠️ Danger Zone', items: [
                { icon: '🚪', label: 'Logout', sub: 'Sign out of account', action: () => { logout(); navigate('/') }, danger: true },
                { icon: '🗑️', label: 'Delete Account', sub: 'Permanently delete account', action: () => navigate('/support'), danger: true },
              ]},
            ].map(function(section) {
              return (
                <div key={section.section} style={{ background: 'white', borderRadius: 20, padding: '20px', marginBottom: 16, boxShadow: '0 4px 16px rgba(107,33,168,0.06)' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#6B7280', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>{section.section}</div>
                  {section.items.map(function(item, i) {
                    return (
                      <div key={item.label} onClick={item.action}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < section.items.length - 1 ? '1px solid #F3F4F6' : 'none', cursor: item.action ? 'pointer' : 'default' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: item.danger ? '#FEF2F2' : '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: item.danger ? '#DC2626' : '#111827' }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.sub}</div>
                        </div>
                        {item.toggle ? (
                          <ToggleSwitch defaultOn={item.default} />
                        ) : (
                          <span style={{ color: '#9CA3AF', fontSize: 18 }}>›</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

function ToggleSwitch({ defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div onClick={e => { e.stopPropagation(); setOn(!on) }}
      style={{ width: 44, height: 24, borderRadius: 99, background: on ? 'linear-gradient(135deg, #6B21A8, #7C3AED)' : '#E5E7EB', position: 'relative', cursor: 'pointer', transition: 'all 0.25s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.25s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
    </div>
  )
}