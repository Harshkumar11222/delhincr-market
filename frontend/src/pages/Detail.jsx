import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));

    api.get('/reviews/listing/' + id)
      .then(res => setReviews(res.data.reviews || []))
      .catch(() => {})
  }, [id]);

  if (loading) return <div className="loader" style={{ marginTop: 80 }}>⏳</div>;
  if (!listing) return null;

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 40 }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', marginTop: 16, marginBottom: 16, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Images */}
        <div>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#F3F4F6', aspectRatio: '4/3' }}>
            <img src={listing.images?.[activeImg] || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {listing.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {listing.images.map((img, i) => (
                <img key={i} src={img} alt={i} onClick={() => setActiveImg(i)}
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: activeImg === i ? '2px solid #FF6B35' : '2px solid transparent' }} />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {listing.isVerified && <span className="badge badge-verified">✓ Verified Seller</span>}
            {listing.condition && <span className="badge badge-new">{listing.condition}</span>}
            {listing.isNegotiable && <span className="badge badge-negotiable">Negotiable</span>}
          </div>

          <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{listing.title}</h1>

          <div style={{ fontSize: 32, fontWeight: 800, color: '#FF6B35', fontFamily: 'Baloo 2, cursive', marginBottom: 16 }}>
            ₹{listing.price?.toLocaleString('en-IN')}
          </div>

          <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Product Details</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                ['📍 Location', listing.location],
                ['🏙️ City', listing.city],
                ['📦 Condition', listing.condition],
                ['👁 Views', listing.views],
                ['📅 Posted', timeAgo(listing.createdAt)],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#6B7280' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Description</div>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{listing.description}</p>
          </div>

          {/* Seller Info */}
          <div style={{ background: '#EFF6FF', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={`https://i.pravatar.cc/48?u=${listing.sellerPhone}`} alt={listing.sellerName}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                  {listing.sellerName}
                  {listing.isVerified && <span style={{ color: '#10B981', marginLeft: 6 }}>✓</span>}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Seller</div>
              </div>
            </div>
          </div>


          {reviews.length > 0 && (
  <div style={{ marginTop: 24 }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
      ⭐ Reviews ({reviews.length})
    </div>
    {reviews.map(function(r) {
      return (
        <div key={r.id} style={{
          background: '#FFFBEB', borderRadius: 10, padding: '12px 14px', marginBottom: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{r.buyerName}</span>
            <span style={{ color: '#F59E0B' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
          </div>
          <div style={{ fontSize: 13, color: '#374151' }}>{r.comment}</div>
        </div>
      )
    })}
  </div>
)}

          {/* Buy Now Box — seller ka section ke upar add karo */}
<div style={{
  background: '#FFF0EB', border: '2px solid #FF6B35',
  borderRadius: 14, padding: '16px', marginBottom: 16,
}}>
  <div style={{ fontSize: 13, color: '#92400E', marginBottom: 10, fontWeight: 600 }}>
    🛒 Interested in buying this item?
  </div>
  <button
    className="btn btn-primary btn-lg btn-full"
    onClick={() => {
      const token = localStorage.getItem('token')
      if (!token) { navigate('/login'); return }
      navigate(`/checkout/${listing.id}`)
    }}
  >
    🛒 Buy Now — ₹{listing.price?.toLocaleString('en-IN')}
  </button>
</div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={`tel:${listing.sellerPhone}`} className="btn btn-primary btn-lg" style={{ flex: 1, textDecoration: 'none' }}>
              📞 Call Seller
            </a>
            <a href={`https://wa.me/91${listing.sellerPhone}?text=Hi, I saw your listing "${listing.title}" on DelhiNCR Market. Is it still available?`}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-green btn-lg" style={{ flex: 1, textDecoration: 'none' }}>
              💬 WhatsApp
            </a>
          </div>

          <div style={{ marginTop: 12, background: '#ECFDF5', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#059669' }}>
            🔒 Safe Deal Tip: Always meet in a public place. Never pay in advance before seeing the item.
          </div>
        </div>
      </div>
    </div>
  );
}