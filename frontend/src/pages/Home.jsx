import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const categories = [
  { id: 'all', name: 'All', icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'furniture', name: 'Furniture', icon: '🛋️' },
  { id: 'appliances', name: 'Appliances', icon: '🏠' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'clothing', name: 'Clothing', icon: '👗' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
];

const cities = ['All NCR', 'Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad'];

function ListingCard({ listing, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'white', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer',
      border: '1px solid #F3F4F6', transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
    >
      <div style={{ position: 'relative', paddingTop: '65%', background: '#F3F4F6' }}>
        <img
          src={listing.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={listing.title}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {listing.isVerified && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: '#10B981', color: 'white', fontSize: 10,
            fontWeight: 700, padding: '2px 7px', borderRadius: 99,
          }}>✓ Verified</span>
        )}
        {listing.condition === 'Like New' && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: '#1E3A8A', color: 'white', fontSize: 10,
            fontWeight: 700, padding: '2px 7px', borderRadius: 99,
          }}>Like New</span>
        )}
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.title}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive', marginBottom: 6 }}>
          ₹{listing.price?.toLocaleString('en-IN')}
          {listing.isNegotiable && <span style={{ fontSize: 10, color: '#F59E0B', fontWeight: 600, marginLeft: 6 }}>Nego</span>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>📍 {listing.location}</span>
          <span style={{ fontSize: 11, color: '#6B7280' }}>👁 {listing.views}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCity, setActiveCity] = useState('All NCR');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchListings();
  }, [activeCategory, activeCity]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'all') params.category = activeCategory;
      if (activeCity !== 'All NCR') params.city = activeCity;
      const res = await api.get('/listings', { params });
      setListings(res.data.listings || []);
    } catch {
      setListings([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/browse?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #FF6B35 100%)',
        padding: '70px 16px 40px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 13, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, marginBottom: 8 }}>
          अपना शहर, अपना बाज़ार
        </div>
        <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 8, lineHeight: 1.2 }}>
          Delhi NCR का सबसे<br />भरोसेमंद Marketplace
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 24 }}>
          Buy • Sell • Services — सब एक जगह, verified और safe
        </p>
        <div style={{
          maxWidth: 520, margin: '0 auto', background: 'white',
          borderRadius: 99, display: 'flex', alignItems: 'center',
          padding: '6px 6px 6px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: 18, marginRight: 10 }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch}
            placeholder="Search laptops, plumbers, flats..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Nunito, sans-serif', background: 'transparent' }}
          />
          <button
            onClick={() => search.trim() && navigate(`/browse?search=${encodeURIComponent(search.trim())}`)}
            style={{
              background: '#FF6B35', color: 'white', border: 'none',
              borderRadius: 99, padding: '10px 22px', fontWeight: 700,
              fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
            }}>Search</button>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 28 }}>
          {[['1000+', 'Listings'], ['500+', 'Verified Sellers'], ['200+', 'Service Pros']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#FF6B35' }}>{num}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Service Categories */}
        <div className="section">
          <div className="section-title">Popular Services</div>
          <div className="section-sub">Verified professionals near you</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { icon: '🔧', name: 'Plumber', price: '₹299' },
              { icon: '⚡', name: 'Electrician', price: '₹199' },
              { icon: '🔨', name: 'Carpenter', price: '₹399' },
              { icon: '❄️', name: 'AC Repair', price: '₹499' },
              { icon: '🎨', name: 'Painter', price: '₹8/sqft' },
              { icon: '🧹', name: 'Cleaning', price: '₹799' },
              { icon: '📦', name: 'Shifting', price: '₹999' },
              { icon: '🐛', name: 'Pest Control', price: '₹599' },
            ].map(s => (
              <div key={s.name} onClick={() => navigate('/services')}
                style={{
                  background: 'white', borderRadius: 14, padding: '16px 12px',
                  textAlign: 'center', cursor: 'pointer', border: '1px solid #F3F4F6',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#FF6B35', fontWeight: 600, marginTop: 2 }}>from {s.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Listings Section */}
        <div className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div className="section-title">Latest Listings</div>
              <div className="section-sub">Fresh deals near you</div>
            </div>
            <button onClick={() => navigate('/browse')} className="btn btn-ghost btn-sm">View All →</button>
          </div>

          {/* City Filter */}
          <div className="chip-row" style={{ marginBottom: 12 }}>
            {cities.map(city => (
              <span key={city} className={`tag ${activeCity === city ? 'active' : ''}`}
                onClick={() => setActiveCity(city)}>
                {city}
              </span>
            ))}
          </div>

          {/* Category Filter */}
          <div className="chip-row" style={{ marginBottom: 20 }}>
            {categories.map(cat => (
              <span key={cat.id} className={`tag ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}>
                {cat.icon} {cat.name}
              </span>
            ))}
          </div>

          {loading ? (
            <div className="loader">⏳</div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📭</div>
              <h3>No listings found</h3>
              <p>Try a different category or city</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {listings.map(l => (
                <ListingCard key={l._id} listing={l} onClick={() => navigate(`/listing/${l._id}`)} />
              ))}
            </div>
          )}
        </div>

        {/* Trust Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          borderRadius: 20, padding: '28px 24px', marginBottom: 32,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'center',
        }}>
          {[
            { icon: '✅', title: 'Verified Sellers', desc: 'Aadhaar-linked profiles' },
            { icon: '🔒', title: 'Safe Payments', desc: 'UPI escrow protection' },
            { icon: '📍', title: 'Truly Local', desc: 'Within 5km radius only' },
          ].map(item => (
            <div key={item.title}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}