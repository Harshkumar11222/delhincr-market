import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get(`/listings/user/${user.id}`)
      .then(res => setListings(res.data.listings || []))
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this listing?')) return;
    await api.delete(`/listings/${id}`);
    setListings(l => l.filter(x => x.id !== id));
  };

  if (!user) return null;

  return (
    <div className="container" style={{ paddingTop: 80 }}>
      {/* Profile Card */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', borderRadius: 20, padding: '28px 24px', margin: '16px 0 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <img src={user.avatar || `https://i.pravatar.cc/80?u=${user.phone}`} alt={user.name}
          style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', color: 'white', fontSize: 22, marginBottom: 4 }}>{user.name}</h2>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>📱 {user.phone}</div>
          {user.email && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>✉️ {user.email}</div>}
          {user.isVerified
            ? <span style={{ display: 'inline-block', marginTop: 8, background: '#10B981', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>✓ Verified Account</span>
            : <span style={{ display: 'inline-block', marginTop: 8, background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11, padding: '3px 10px', borderRadius: 99 }}>⏳ Unverified</span>
          }
        </div>
        <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          ['📦', listings.length, 'Listings'],
          ['👁', listings.reduce((a, l) => a + (l.views || 0), 0), 'Total Views'],
          ['✅', listings.filter(l => l.isVerified).length, 'Verified'],
        ].map(([icon, val, label]) => (
          <div key={label} style={{ background: 'white', borderRadius: 14, padding: '16px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 24 }}>{icon}</div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#FF6B35' }}>{val}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* My Listings */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20 }}>My Listings</h3>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/post')}>+ Add New</button>
      </div>

      {loading ? <div className="loader">⏳</div> : listings.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>No listings yet</h3>
          <p>Post your first item and start selling!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/post')}>Post Now</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
          {listings.map(l => (
            <div key={l.id} className="card" style={{ display: 'flex', gap: 14, padding: '14px', alignItems: 'center' }}>
              <img src={l.images?.[0] || 'https://via.placeholder.com/80?text=No+Img'} alt={l.title}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{l.title}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>₹{l.price?.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>📍 {l.location} • 👁 {l.views} views</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/listing/${l._id}`)}>View</button>
                <button className="btn btn-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }} onClick={() => handleDelete(l.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}