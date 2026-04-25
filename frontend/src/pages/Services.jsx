import React, { useState, useEffect } from 'react';
import api from '../api';

const serviceCategories = [
  { id: 'all', name: 'All', icon: '🔧' },
  { id: 'plumber', name: 'Plumber', icon: '🔧' },
  { id: 'electrician', name: 'Electrician', icon: '⚡' },
  { id: 'carpenter', name: 'Carpenter', icon: '🔨' },
  { id: 'painter', name: 'Painter', icon: '🎨' },
  { id: 'ac_repair', name: 'AC Repair', icon: '❄️' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
  { id: 'shifting', name: 'Shifting', icon: '📦' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchServices(); }, [category]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'all') params.category = category;
      const res = await api.get('/services', { params });
      setServices(res.data.services || []);
    } catch { setServices([]); }
    setLoading(false);
  };

  const filtered = search
    ? services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.providerName.toLowerCase().includes(search.toLowerCase()))
    : services;

  const renderStars = (rating) => '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

  return (
    <div className="container" style={{ paddingTop: 80 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', borderRadius: 20, padding: '28px 24px', margin: '16px 0 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Baloo 2, cursive', color: 'white', fontSize: 26, marginBottom: 4 }}>Local Service Professionals</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 16 }}>Verified experts near you — plumbers, electricians, carpenters & more</p>
        <div style={{ maxWidth: 400, margin: '0 auto', background: 'rgba(255,255,255,0.15)', borderRadius: 99, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <span style={{ color: 'white' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search services..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '12px 10px', color: 'white', fontSize: 14, fontFamily: 'Nunito, sans-serif' }} />
        </div>
      </div>

      {/* Category Chips */}
      <div className="chip-row" style={{ marginBottom: 20 }}>
        {serviceCategories.map(c => (
          <span key={c.id} className={`tag ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
            {c.icon} {c.name}
          </span>
        ))}
      </div>

      {loading ? <div className="loader">⏳</div> : filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">🔍</div><h3>No services found</h3></div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filtered.map(s => (
            <div key={s.id} className="card" style={{ padding: '20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <img src={s.avatar} alt={s.providerName}
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid #EFF6FF' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                      {s.name}
                      {s.isVerified && <span style={{ color: '#10B981', marginLeft: 6, fontSize: 14 }}>✓</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#6B7280' }}>{s.providerName} • {s.experience} yrs exp</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>
                      ₹{s.priceFrom}+
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>starting price</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#374151', margin: '8px 0', lineHeight: 1.6 }}>{s.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: '#F59E0B', fontSize: 14 }}>{renderStars(s.rating)}</span>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{s.rating}/5 ({s.totalRatings} reviews)</span>
                    <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>✓ {s.completedJobs} jobs done</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>📍 {s.location}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <a href={`tel:${s.phone}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>📞 Call Now</a>
                  <a href={`https://wa.me/91${s.phone}?text=Hi ${s.providerName}, I need ${s.category} service. I found you on DelhiNCR Market.`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-green btn-sm" style={{ textDecoration: 'none' }}>💬 WhatsApp</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}