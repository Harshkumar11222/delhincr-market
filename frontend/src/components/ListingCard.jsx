import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ListingCard({ listing }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      style={{
        background: 'white', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer',
        border: '1px solid #F3F4F6', transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.13)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '65%', background: '#F3F4F6' }}>
        <img
          src={listing.images?.[0] || 'https://placehold.co/300x200?text=No+Image'}
          alt={listing.title}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://placehold.co/300x200?text=No+Image' }}
        />
        {/* Badges */}
        {listing.isVerified && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: '#10B981', color: 'white',
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          }}>✓ Verified</span>
        )}
        {listing.condition === 'Like New' && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: '#1E3A8A', color: 'white',
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          }}>Like New</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px' }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#111827',
          marginBottom: 6, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {listing.title}
        </div>

        <div style={{
          fontSize: 20, fontWeight: 800, color: '#FF6B35',
          fontFamily: 'Baloo 2, cursive', marginBottom: 6,
        }}>
          ₹{listing.price?.toLocaleString('en-IN')}
          {listing.isNegotiable && (
            <span style={{ fontSize: 10, color: '#F59E0B', fontWeight: 600, marginLeft: 6 }}>
              Nego
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>📍 {listing.location}</span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>👁 {listing.views || 0}</span>
        </div>
      </div>
    </div>
  )
}