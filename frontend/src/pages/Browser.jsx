import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

export default function Browse() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  useEffect(() => { fetchListings(); }, [category, sort, search]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const res = await api.get('/listings', { params });
      setListings(res.data.listings || []);
    } catch { setListings([]); }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: 80 }}>
      {/* Search Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, marginTop: 16 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', background: 'white',
          border: '2px solid #E5E7EB', borderRadius: 99, padding: '0 16px', gap: 8,
        }}>
          <span>🔍</span>
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSearch(searchInput)}
            placeholder="Search listings..."
            style={{ flex: 1, border: 'none', outline: 'none', padding: '11px 0', fontSize: 14, fontFamily: 'Nunito, sans-serif' }}
          />
        </div>
        <button onClick={() => setSearch(searchInput)} className="btn btn-primary">Search</button>
      </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 14, color: '#6B7280' }}>{listings.length} listings found</span>
        <select value={sort} onChange={e => setSort(e.target.value)} className="form-control" style={{ width: 'auto', padding: '8px 12px' }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category Chips */}
      <div className="chip-row" style={{ marginBottom: 20 }}>
        {categories.map(cat => (
          <span key={cat.id} className={`tag ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}>
            {cat.icon} {cat.name}
          </span>
        ))}
      </div>

      {/* Listings Grid */}
      {loading ? <div className="loader">⏳</div> : listings.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>No listings found</h3>
          <p>Try different search terms or category</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { setSearch(''); setCategory('all'); }}>Clear Filters</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {listings.map(l => (
            <div key={l._id} onClick={() => navigate(`/listing/${l._id}`)}
              style={{
                background: 'white', borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative', paddingTop: '65%', background: '#F3F4F6' }}>
                <img src={l.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={l.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                {l.isVerified && (
                  <span style={{ position: 'absolute', top: 8, left: 8, background: '#10B981', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>✓</span>
                )}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>₹{l.price?.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>📍 {l.location}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}