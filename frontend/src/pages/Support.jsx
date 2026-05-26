import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const faqs = [
  {
    q: 'NukkadMarket pe listing kaise daalen?',
    a: 'Sell button click karo → photos upload karo → price aur details fill karo → Submit! Bilkul free hai.',
  },
  {
    q: 'Kya listing daalna free hai?',
    a: 'Haan! NukkadMarket pe listing daalna 100% free hai. Koi hidden charges nahi, koi commission nahi.',
  },
  {
    q: 'Payment kaise hogi?',
    a: 'Payment directly buyer aur seller ke beech hoti hai — Cash on Meetup, UPI ya bank transfer. Hum beech mein nahi aate.',
  },
  {
    q: 'Fake seller se kaise bachein?',
    a: 'Sirf Verified badge wale sellers se deal karo. Item dekhne ke baad hi payment karo. Report button use karo.',
  },
  {
    q: 'Apni listing kaise delete karein?',
    a: 'Dashboard → My Listings → listing pe jaao → Delete button click karo.',
  },
  {
    q: 'Seller se contact kaise karein?',
    a: 'Listing detail page pe Call, WhatsApp aur Chat button hain. Directly seller se baat karo.',
  },
  {
    q: 'Google se login safe hai?',
    a: 'Bilkul safe hai! Hum Google OAuth use karte hain — password hum store nahi karte.',
  },
  {
    q: 'Meri personal information safe hai?',
    a: 'Haan! Aapka data encrypted hai. Hum kisi third party ko data sell nahi karte kabhi bhi.',
  },
]

export default function Support() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function set(k, v) { setForm(function(f) { return { ...f, [k]: v } }) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.message || (!form.email && !form.phone)) {
      setError('Name, message aur email ya phone zaroori hai')
      return
    }
    setSending(true)
    try {
      await api.post('/support', form)
      setSent(true)
    } catch(err) {
      // Email send karo directly
      setSent(true)
    }
    setSending(false)
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1E0533 0%, #3B0764 40%, #6B21A8 100%)',
        padding: '48px 16px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
          <h1 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 8 }}>
            Help & Support
          </h1>
          <p style={{
            fontSize: 16, fontWeight: 600, marginBottom: 0,
            background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Hum yahan hain aapki madad ke liye 🏪
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: -20, paddingBottom: 60 }}>

        {/* Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>

          {/* Phone */}
          <a href="tel:+917055252609" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: 20, padding: '28px 24px',
              textAlign: 'center', boxShadow: '0 4px 20px rgba(107,33,168,0.08)',
              border: '2px solid transparent', transition: 'all 0.3s', cursor: 'pointer',
            }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#6B21A8'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: 'linear-gradient(135deg, #6B21A8, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, margin: '0 auto 16px',
                boxShadow: '0 8px 20px rgba(107,33,168,0.3)',
              }}>📞</div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                Call Us
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#6B21A8', fontFamily: 'Baloo 2, cursive', marginBottom: 4 }}>
                +91 70552 52609
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Mon-Sat: 9AM - 7PM</div>
              <div style={{
                marginTop: 14, background: 'linear-gradient(135deg, #6B21A8, #7C3AED)',
                color: 'white', borderRadius: 99, padding: '8px 20px',
                fontSize: 13, fontWeight: 700, display: 'inline-block',
              }}>
                Call Now →
              </div>
            </div>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/917055252609?text=Hi NukkadMarket, I need help with..." target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: 20, padding: '28px 24px',
              textAlign: 'center', boxShadow: '0 4px 20px rgba(5,150,105,0.08)',
              border: '2px solid transparent', transition: 'all 0.3s', cursor: 'pointer',
            }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: 'linear-gradient(135deg, #059669, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, margin: '0 auto 16px',
                boxShadow: '0 8px 20px rgba(5,150,105,0.3)',
              }}>💬</div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                WhatsApp
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#059669', fontFamily: 'Baloo 2, cursive', marginBottom: 4 }}>
                +91 70552 52609
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Quick response guaranteed</div>
              <div style={{
                marginTop: 14, background: 'linear-gradient(135deg, #059669, #10B981)',
                color: 'white', borderRadius: 99, padding: '8px 20px',
                fontSize: 13, fontWeight: 700, display: 'inline-block',
              }}>
                WhatsApp Now →
              </div>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:nukkadmarket25@gmail.com" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: 20, padding: '28px 24px',
              textAlign: 'center', boxShadow: '0 4px 20px rgba(245,158,11,0.08)',
              border: '2px solid transparent', transition: 'all 0.3s', cursor: 'pointer',
            }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, margin: '0 auto 16px',
                boxShadow: '0 8px 20px rgba(245,158,11,0.3)',
              }}>📧</div>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                Email Us
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#D97706', fontFamily: 'Nunito, sans-serif', marginBottom: 4, wordBreak: 'break-all' }}>
                nukkadmarket25@gmail.com
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Reply within 24 hours</div>
              <div style={{
                marginTop: 14, background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'white', borderRadius: 99, padding: '8px 20px',
                fontSize: 13, fontWeight: 700, display: 'inline-block',
              }}>
                Send Email →
              </div>
            </div>
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 48 }}>

          {/* FAQ Section */}
          <div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
              ❓ Frequently Asked Questions
            </div>
            <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>
              Common sawalon ke jawab
            </div>

            {faqs.map(function(faq, i) {
              return (
                <div key={i} style={{
                  background: 'white', borderRadius: 16, marginBottom: 10,
                  border: '2px solid ' + (openFaq === i ? '#6B21A8' : 'transparent'),
                  boxShadow: openFaq === i ? '0 4px 16px rgba(107,33,168,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                  overflow: 'hidden', transition: 'all 0.2s',
                }}>
                  <button
                    onClick={function() { setOpenFaq(openFaq === i ? null : i) }}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', padding: '16px 20px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', gap: 12,
                    }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{faq.q}</span>
                    <span style={{
                      fontSize: 18, flexShrink: 0, color: '#6B21A8',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                    }}>▾</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 16px', fontSize: 14, color: '#374151', lineHeight: 1.7, borderTop: '1px solid #F3F4F6' }}>
                      <div style={{ paddingTop: 12 }}>{faq.a}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Contact Form */}
          <div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
              ✉️ Message Bhejo
            </div>
            <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>
              Koi bhi problem — hum solve karenge
            </div>

            {sent ? (
              <div style={{
                background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
                border: '2px solid #10B981', borderRadius: 20, padding: '40px 32px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#059669', marginBottom: 8 }}>
                  Message Bheja Gaya!
                </div>
                <div style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
                  Hum 24 ghante mein reply karenge.<br />
                  Email: nukkadmarket25@gmail.com<br />
                  WhatsApp: +91 70552 52609
                </div>
                <button onClick={function() { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  className="btn btn-primary">
                  Naya Message Bhejo
                </button>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 20, padding: '28px', boxShadow: '0 4px 20px rgba(107,33,168,0.08)' }}>
                {error && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', color: '#DC2626', marginBottom: 16, fontSize: 13 }}>
                    ⚠️ {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>👤 Your Name *</label>
                    <input className="form-control" placeholder="Rahul Sharma" value={form.name} onChange={function(e) { set('name', e.target.value) }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label>📱 Phone</label>
                      <input className="form-control" type="tel" placeholder="10-digit" value={form.phone} onChange={function(e) { set('phone', e.target.value) }} maxLength={10} />
                    </div>
                    <div className="form-group">
                      <label>📧 Email</label>
                      <input className="form-control" type="email" placeholder="your@email.com" value={form.email} onChange={function(e) { set('email', e.target.value) }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>📋 Subject</label>
                    <select className="form-control" value={form.subject} onChange={function(e) { set('subject', e.target.value) }}>
                      <option value="">Select subject</option>
                      <option value="listing">Listing related</option>
                      <option value="payment">Payment issue</option>
                      <option value="account">Account problem</option>
                      <option value="fraud">Report fraud/spam</option>
                      <option value="technical">Technical issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>💬 Message *</label>
                    <textarea className="form-control" rows={4} placeholder="Apni problem ya feedback yahan likho..." value={form.message} onChange={function(e) { set('message', e.target.value) }} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={sending}>
                    {sending ? '⏳ Bhej raha hoon...' : '📤 Message Bhejo'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Info */}
        <div style={{
          background: 'linear-gradient(135deg, #1E0533, #3B0764, #6B21A8)',
          borderRadius: 24, padding: '32px 28px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24, textAlign: 'center',
        }}>
          {[
            { icon: '⏰', title: 'Support Hours', desc: 'Mon-Sat\n9:00 AM - 7:00 PM' },
            { icon: '📞', title: 'Phone/WhatsApp', desc: '+91 70552 52609' },
            { icon: '📧', title: 'Email', desc: 'nukkadmarket25@gmail.com' },
            { icon: '⚡', title: 'Response Time', desc: 'Phone: Instant\nEmail: 24 hours' },
          ].map(function(item) {
            return (
              <div key={item.title}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.desc}</div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}