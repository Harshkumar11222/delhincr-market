import React from 'react'

export default function ServiceCard({ service }) {
  const stars = (r) => '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r))

  return (
    <div style={{
      background: 'white', borderRadius: 16, padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #F3F4F6',
      display: 'flex', gap: 16, alignItems: 'flex-start',
    }}>
      {/* Avatar */}
      <img
        src={service.avatar || `https://i.pravatar.cc/64?u=${service.phone}`}
        alt={service.providerName}
        style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #EFF6FF', flexShrink: 0 }}
        onError={e => { e.target.src = `https://i.pravatar.cc/64?u=${service.id}` }}
      />

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
              {service.name}
              {service.isVerified && <span style={{ color: '#10B981', fontSize: 13 }}>✓</span>}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>
              {service.providerName} • {service.experience} yrs exp
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive' }}>
              ₹{service.priceFrom}+
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF' }}>starting price</div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: '8px 0' }}>
          {service.description}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ color: '#F59E0B', fontSize: 13, letterSpacing: 1 }}>{stars(service.rating)}</span>
          <span style={{ fontSize: 12, color: '#6B7280' }}>{service.rating}/5 ({service.totalRatings} reviews)</span>
          <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>✓ {service.completedJobs} jobs</span>
          <span style={{ fontSize: 12, color: '#6B7280' }}>📍 {service.location}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          
            href={`tel:${service.phone}`}
            style={{
              background: '#FF6B35', color: 'white', padding: '8px 16px',
              borderRadius: 99, fontSize: 13, fontWeight: 700,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
            📞 Call
          </a>
          
            href={`https://wa.me/91${service.phone}?text=Hi ${service.providerName}, I need ${service.category} service. Found you on DelhiNCR Market.`}
            target="_blank" rel="noopener noreferrer"
            style={{
              background: '#10B981', color: 'white', padding: '8px 16px',
              borderRadius: 99, fontSize: 13, fontWeight: 700,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}