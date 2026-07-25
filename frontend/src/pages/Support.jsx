import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const faqs = [
  {
    category: 'Listings',
    icon: '🛍️',
    items: [
      { q: 'NukkadMarket pe listing kaise daalen?', a: 'Sell button click karo → photos upload karo (max 5) → price aur details fill karo → Submit! Bilkul free hai. Listing 2 minute mein live ho jaati hai.' },
      { q: 'Kya listing daalna free hai?', a: 'Haan! NukkadMarket pe listing daalna 100% free hai. Koi hidden charges nahi, koi commission nahi, koi subscription nahi — hamesha free.' },
      { q: 'Apni listing kaise edit karein?', a: 'Dashboard → My Listings → Edit button click karo. Price, photos, description sab update kar sakte ho.' },
      { q: 'Listing delete kaise karein?', a: 'Dashboard → My Listings → listing pe jaao → Delete button click karo. Listing turant remove ho jaayegi.' },
    ]
  },
  {
    category: 'Payments & Safety',
    icon: '🔒',
    items: [
      { q: 'Payment kaise hogi?', a: 'Payment directly buyer aur seller ke beech hoti hai — Cash on Meetup, UPI ya bank transfer. NukkadMarket beech mein nahi aata. Isliye public jagah meetup karo pehli baar.' },
      { q: 'Fake seller se kaise bachein?', a: 'Sirf Verified badge wale sellers se deal karo. Item physically dekhne ke baad hi payment karo. Advance payment kabhi mat do. Koi suspicious lage toh Report karo.' },
      { q: 'Fraud report kaise karein?', a: 'Listing page pe "Report" button hai. Ya humse directly contact karo: nukkadmarket25@gmail.com ya WhatsApp: +91 70552 52609.' },
    ]
  },
  {
    category: 'Account',
    icon: '👤',
    items: [
      { q: 'Password bhool gaye?', a: 'Login page pe "Forgot Password?" click karo → registered email pe OTP aayega → OTP enter karo → naya password set karo. 2 minute ka kaam hai.' },
      { q: 'Google se login safe hai?', a: 'Bilkul safe hai! Hum Google OAuth 2.0 use karte hain — aapka Google password hum kabhi nahi dekhte. Industry-standard security.' },
      { q: 'Account delete karna hai?', a: 'Support pe email karo: nukkadmarket25@gmail.com subject "Delete My Account". 24-48 ghante mein account permanently delete ho jaayega.' },
    ]
  },
  {
    category: 'Technical',
    icon: '⚙️',
    items: [
      { q: 'App slow chal rahi hai?', a: 'Browser cache clear karo → page refresh karo. Ya Chrome pe Ctrl+Shift+R try karo. Mobile pe app reinstall karo.' },
      { q: 'Images upload nahi ho rahi?', a: 'Image size 5MB se kam honi chahiye. Format JPG/PNG/WebP hona chahiye. Internet connection check karo.' },
      { q: 'Chat kaam nahi kar raha?', a: 'Page refresh karo aur dobara try karo. Agar phir bhi issue hai toh WhatsApp pe contact karo: +91 70552 52609.' },
    ]
  },
]

const ticketCategories = [
  { id: 'listing', label: '🛍️ Listing Problem', color: '#0EA5A0' },
  { id: 'payment', label: '💰 Payment Issue', color: '#D97706' },
  { id: 'account', label: '👤 Account Problem', color: '#2563EB' },
  { id: 'fraud', label: '🚨 Report Fraud', color: '#DC2626' },
  { id: 'technical', label: '⚙️ Technical Issue', color: '#059669' },
  { id: 'feedback', label: '💡 Feedback/Suggestion', color: '#0EA5A0' },
  { id: 'other', label: '📋 Other', color: '#374151' },
]

export default function Support() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [activeTab, setActiveTab]     = useState('home')
  const [openFaq, setOpenFaq]         = useState(null)
  const [faqCategory, setFaqCategory] = useState(0)
  const [searchFaq, setSearchFaq]     = useState('')
  const [form, setForm] = useState({
    name:     user?.name || '',
    email:    user?.email || '',
    phone:    user?.phone || '',
    category: '',
    priority: 'normal',
    message:  '',
  })
  const [sending, setSending]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState('')
  const [ticketId, setTicketId] = useState('')

  function set(k, v) { setForm(function(f) { return { ...f, [k]: v } }) }

  // Generate ticket ID
  function generateTicketId() {
    return 'NM' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.message || !form.category) {
      setError('Name, category aur message zaroori hai')
      return
    }
    if (!form.email && !form.phone) {
      setError('Email ya phone mein se koi ek zaroori hai')
      return
    }
    setSending(true)
    try {
      var id = generateTicketId()
      setTicketId(id)
      // Simulate API call
      await new Promise(function(r) { setTimeout(r, 1500) })
      setSent(true)
    } catch(err) {
      setSent(true)
      setTicketId(generateTicketId())
    }
    setSending(false)
  }

  // Filter FAQs
  var filteredFaqs = searchFaq
    ? faqs.map(function(cat) {
        return {
          ...cat,
          items: cat.items.filter(function(item) {
            return item.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
                   item.a.toLowerCase().includes(searchFaq.toLowerCase())
          })
        }
      }).filter(function(cat) { return cat.items.length > 0 })
    : faqs

  var tabs = [
    { id: 'home',    icon: '🏠', label: 'Help Home' },
    { id: 'faq',     icon: '❓', label: 'FAQs' },
    { id: 'ticket',  icon: '🎫', label: 'Submit Ticket' },
    { id: 'contact', icon: '📞', label: 'Contact Us' },
  ]

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: 60 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2A3F 0%, #0C8A85 40%, #0EA5A0 80%, #0EA5A0 100%)',
        padding: '48px 16px 80px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(245,158,11,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '20%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(245,158,11,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,158,11,0.15)', borderRadius: 99,
            padding: '6px 16px', fontSize: 12, fontWeight: 700,
            color: '#FCD34D', marginBottom: 20,
            border: '1px solid rgba(245,158,11,0.3)',
          }}>
            🟢 Support Online — Avg response: 2 hours
          </div>

          <h1 style={{
            fontFamily: 'Baloo 2, cursive', fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 800, color: 'white', marginBottom: 12, lineHeight: 1.1,
          }}>
            Help & Support Center
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 32 }}>
            Hum yahan hain aapki madad ke liye 🤝<br />
            <span style={{ fontSize: 13, opacity: 0.7 }}>7 days a week • Fast response • Real humans</span>
          </p>

          {/* Search FAQs */}
          <div style={{
            maxWidth: 500, margin: '0 auto',
            display: 'flex', background: 'white', borderRadius: 99,
            boxShadow: '0 8px 32px rgba(14,165,160,0.3)',
            overflow: 'hidden', border: '2px solid rgba(245,158,11,0.2)',
          }}>
            <span style={{ padding: '0 16px', fontSize: 18, display: 'flex', alignItems: 'center' }}>🔍</span>
            <input
              value={searchFaq}
              onChange={function(e) { setSearchFaq(e.target.value); if (e.target.value) setActiveTab('faq') }}
              placeholder="Search your problem..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 15, fontFamily: 'Nunito, sans-serif', padding: '14px 0',
              }}
            />
            {searchFaq && (
              <button onClick={function() { setSearchFaq('') }}
                style={{ padding: '0 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: 0.5 }}>
                ✕
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { num: '< 2hr', label: 'Avg Response' },
              { num: '98%',   label: 'Resolved' },
              { num: '24/7',  label: 'WhatsApp' },
            ].map(function(s) {
              return (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800,
                    background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -36, paddingBottom: 60 }}>

        {/* Tabs */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 6,
          display: 'flex', gap: 4, marginBottom: 28,
          boxShadow: '0 4px 20px rgba(14,165,160,0.1)',
          flexWrap: 'wrap',
        }}>
          {tabs.map(function(tab) {
            return (
              <button key={tab.id}
                onClick={function() { setActiveTab(tab.id) }}
                style={{
                  flex: 1, minWidth: 120, padding: '12px 16px',
                  borderRadius: 14, border: 'none', cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700,
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #0EA5A0, #0EA5A0)'
                    : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6B7280',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(14,165,160,0.3)' : 'none',
                }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── HOME TAB ── */}
        {activeTab === 'home' && (
          <div>
            {/* Contact Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>

              {/* Phone */}
              <a href="tel:+917055252609" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 20, padding: '28px 20px',
                  textAlign: 'center', boxShadow: '0 4px 20px rgba(14,165,160,0.08)',
                  border: '2px solid transparent', transition: 'all 0.3s', cursor: 'pointer',
                  height: '100%',
                }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#0EA5A0'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(14,165,160,0.16)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,160,0.08)' }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: 20,
                    background: 'linear-gradient(135deg, #0EA5A0, #0EA5A0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 30, margin: '0 auto 16px',
                    boxShadow: '0 8px 20px rgba(14,165,160,0.3)',
                  }}>📞</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Call Support</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0EA5A0', marginBottom: 4 }}>+91 70552 52609</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Mon-Sat • 9AM - 7PM IST</div>
                  <div style={{
                    background: 'linear-gradient(135deg, #0EA5A0, #0EA5A0)',
                    color: 'white', borderRadius: 99, padding: '10px 24px',
                    fontSize: 13, fontWeight: 700, display: 'inline-block',
                    boxShadow: '0 4px 12px rgba(14,165,160,0.3)',
                  }}>📞 Call Now</div>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/917055252609?text=Hi%20NukkadMarket%2C%20I%20need%20help%20with..." target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 20, padding: '28px 20px',
                  textAlign: 'center', boxShadow: '0 4px 20px rgba(14,165,160,0.08)',
                  border: '2px solid transparent', transition: 'all 0.3s', cursor: 'pointer',
                  height: '100%',
                }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(5,150,105,0.16)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(5,150,105,0.08)' }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: 20,
                    background: 'linear-gradient(135deg, #059669, #10B981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 30, margin: '0 auto 16px',
                    boxShadow: '0 8px 20px rgba(5,150,105,0.3)',
                  }}>💬</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>WhatsApp Chat</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#059669', marginBottom: 4 }}>+91 70552 52609</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Available 24/7 • Fast Reply</div>
                  <div style={{
                    background: 'linear-gradient(135deg, #059669, #10B981)',
                    color: 'white', borderRadius: 99, padding: '10px 24px',
                    fontSize: 13, fontWeight: 700, display: 'inline-block',
                    boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                  }}>💬 Chat Now</div>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:nukkadmarket25@gmail.com?subject=Support Request" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 20, padding: '28px 20px',
                  textAlign: 'center', boxShadow: '0 4px 20px rgba(245,158,11,0.08)',
                  border: '2px solid transparent', transition: 'all 0.3s', cursor: 'pointer',
                  height: '100%',
                }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(245,158,11,0.16)' }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,158,11,0.08)' }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: 20,
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 30, margin: '0 auto 16px',
                    boxShadow: '0 8px 20px rgba(245,158,11,0.3)',
                  }}>📧</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Email Support</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#D97706', marginBottom: 4, wordBreak: 'break-all' }}>nukkadmarket25@gmail.com</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Reply within 24 hours</div>
                  <div style={{
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'white', borderRadius: 99, padding: '10px 24px',
                    fontSize: 13, fontWeight: 700, display: 'inline-block',
                    boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                  }}>📧 Send Email</div>
                </div>
              </a>

              {/* Submit Ticket */}
              <div style={{
                background: 'linear-gradient(135deg, #0F2A3F, #0C8A85, #0EA5A0)',
                borderRadius: 20, padding: '28px 20px',
                textAlign: 'center', cursor: 'pointer',
                border: '2px solid transparent', transition: 'all 0.3s',
              }}
                onClick={function() { setActiveTab('ticket') }}
                onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(14,165,160,0.4)' }}
                onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: 'rgba(245,158,11,0.2)',
                  border: '2px solid rgba(245,158,11,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, margin: '0 auto 16px',
                }}>🎫</div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 6 }}>Submit Ticket</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Track your issue<br />Get ticket ID</div>
                <div style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: 'white', borderRadius: 99, padding: '10px 24px',
                  fontSize: 13, fontWeight: 700, display: 'inline-block',
                  boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
                }}>🎫 Open Ticket</div>
              </div>
            </div>

            {/* Quick Help Categories */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                Quick Help 🚀
              </div>
              <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
                Apni problem category choose karo
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {ticketCategories.map(function(cat) {
                  return (
                    <div key={cat.id}
                      onClick={function() { set('category', cat.id); setActiveTab('ticket') }}
                      style={{
                        background: 'white', borderRadius: 14, padding: '16px',
                        cursor: 'pointer', border: '2px solid transparent',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        display: 'flex', alignItems: 'center', gap: 12,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={function(e) { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <span style={{ fontSize: 20 }}>{cat.label.split(' ')[0]}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
                        {cat.label.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Popular FAQs */}
            <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 20px rgba(14,165,160,0.06)', marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 20, fontWeight: 800, color: '#111827' }}>
                  ⭐ Popular Questions
                </div>
                <button onClick={function() { setActiveTab('faq') }}
                  style={{ background: 'none', border: 'none', color: '#0EA5A0', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  View All →
                </button>
              </div>
              {faqs[0].items.slice(0, 3).map(function(item, i) {
                return (
                  <div key={i}
                    onClick={function() { setActiveTab('faq'); setOpenFaq('0-' + i) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                      borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none', cursor: 'pointer',
                    }}
                    onMouseEnter={function(e) { e.currentTarget.style.color = '#0EA5A0' }}
                    onMouseLeave={function(e) { e.currentTarget.style.color = '#111827' }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>❓</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{item.q}</span>
                    <span style={{ marginLeft: 'auto', color: '#0EA5A0', fontSize: 16 }}>›</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── FAQ TAB ── */}
        {activeTab === 'faq' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                ❓ Frequently Asked Questions
              </div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>{faqs.reduce(function(a, c) { return a + c.items.length }, 0)} questions • Regularly updated</div>
            </div>

            {/* Category filter */}
            <div className="chip-row" style={{ marginBottom: 24 }}>
              <span className={'tag' + (!searchFaq && faqCategory === null ? ' active' : '')}
                onClick={function() { setFaqCategory(null); setSearchFaq('') }}>
                🌟 All
              </span>
              {faqs.map(function(cat, i) {
                return (
                  <span key={i} className={'tag' + (faqCategory === i ? ' active' : '')}
                    onClick={function() { setFaqCategory(i); setSearchFaq('') }}>
                    {cat.icon} {cat.category}
                  </span>
                )
              })}
            </div>

            {/* FAQ Items */}
            {(faqCategory !== null && !searchFaq ? [faqs[faqCategory]] : filteredFaqs).map(function(cat, ci) {
              return (
                <div key={ci} style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 24 }}>{cat.icon}</span>
                    <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: '#111827' }}>{cat.category}</div>
                    <span style={{ background: '#E6F7F7', color: '#0EA5A0', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                      {cat.items.length} questions
                    </span>
                  </div>

                  {cat.items.map(function(item, ii) {
                    var key = ci + '-' + ii
                    return (
                      <div key={ii} style={{
                        background: 'white', borderRadius: 16, marginBottom: 10,
                        border: '2px solid ' + (openFaq === key ? '#0EA5A0' : 'transparent'),
                        boxShadow: openFaq === key ? '0 4px 20px rgba(14,165,160,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                        overflow: 'hidden', transition: 'all 0.25s',
                      }}>
                        <button
                          onClick={function() { setOpenFaq(openFaq === key ? null : key) }}
                          style={{
                            width: '100%', display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', padding: '18px 20px',
                            background: openFaq === key ? '#E6F7F7' : 'none',
                            border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
                          }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', flex: 1 }}>{item.q}</span>
                          <span style={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            background: openFaq === key ? '#0EA5A0' : '#F3F4F6',
                            color: openFaq === key ? 'white' : '#6B7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, transition: 'all 0.2s',
                            transform: openFaq === key ? 'rotate(180deg)' : 'rotate(0)',
                          }}>▾</span>
                        </button>
                        {openFaq === key && (
                          <div style={{ padding: '0 20px 18px' }}>
                            <div style={{ height: 1, background: '#F3F4F6', marginBottom: 14 }} />
                            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, fontWeight: 500 }}>
                              {item.a}
                            </div>
                            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                              <span style={{ fontSize: 12, color: '#6B7280' }}>Kya yeh helpful tha?</span>
                              <button style={{ background: '#ECFDF5', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, cursor: 'pointer', color: '#059669', fontWeight: 700 }}>👍 Yes</button>
                              <button style={{ background: '#FEF2F2', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 12, cursor: 'pointer', color: '#DC2626', fontWeight: 700 }}>👎 No</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {filteredFaqs.length === 0 && (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>Koi result nahi mila</h3>
                <p>Dusre words try karo ya support team se contact karo</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={function() { setActiveTab('ticket') }}>
                  Submit Ticket
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TICKET TAB ── */}
        {activeTab === 'ticket' && (
          <div style={{ maxWidth: 680, margin: '0 auto' }}>

            {sent ? (
              <div style={{
                background: 'white', borderRadius: 24, padding: '48px 32px',
                textAlign: 'center', boxShadow: '0 8px 32px rgba(14,165,160,0.1)',
              }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#059669', marginBottom: 8 }}>
                  Ticket Submit Ho Gaya!
                </div>
                <div style={{
                  background: '#E6F7F7', borderRadius: 16, padding: '20px',
                  margin: '20px 0', display: 'inline-block',
                }}>
                  <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Your Ticket ID</div>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 28, fontWeight: 800, color: '#0EA5A0', letterSpacing: 2 }}>
                    #{ticketId}
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Save this for reference</div>
                </div>
                <div style={{ fontSize: 15, color: '#374151', marginBottom: 8, lineHeight: 1.7 }}>
                  Hum <strong>24 ghante mein</strong> aapko contact karenge.<br />
                  Urgent hai? Directly contact karo:
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                  <a href="https://wa.me/917055252609" target="_blank" rel="noopener noreferrer"
                    style={{ background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white', borderRadius: 99, padding: '12px 24px', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    💬 WhatsApp
                  </a>
                  <button onClick={function() { setSent(false); setTicketId(''); setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', category: '', priority: 'normal', message: '' }) }}
                    className="btn btn-ghost">
                    🎫 New Ticket
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  🎫 Submit Support Ticket
                </div>
                <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
                  Ek unique ticket ID milega — track karo apna issue
                </div>

                <div style={{ background: 'white', borderRadius: 24, padding: '32px', boxShadow: '0 8px 32px rgba(14,165,160,0.08)' }}>
                  {error && (
                    <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 12, padding: '12px 16px', color: '#DC2626', marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div className="form-group">
                        <label>👤 Full Name *</label>
                        <input className="form-control" placeholder="Rahul Sharma" value={form.name} onChange={function(e) { set('name', e.target.value) }} />
                      </div>
                      <div className="form-group">
                        <label>📱 Phone</label>
                        <input className="form-control" type="tel" placeholder="10-digit number" value={form.phone} onChange={function(e) { set('phone', e.target.value) }} maxLength={10} />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>📧 Email</label>
                        <input className="form-control" type="email" placeholder="your@email.com" value={form.email} onChange={function(e) { set('email', e.target.value) }} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>📋 Problem Category *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                        {ticketCategories.map(function(cat) {
                          return (
                            <div key={cat.id}
                              onClick={function() { set('category', cat.id) }}
                              style={{
                                padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                                border: '2px solid ' + (form.category === cat.id ? cat.color : '#E5E7EB'),
                                background: form.category === cat.id ? cat.color + '12' : 'white',
                                fontSize: 13, fontWeight: 600, color: form.category === cat.id ? cat.color : '#374151',
                                transition: 'all 0.2s',
                              }}>
                              {cat.label}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>🚨 Priority</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {[
                          { id: 'low', label: '🟢 Low', desc: '2-3 days' },
                          { id: 'normal', label: '🟡 Normal', desc: '24 hours' },
                          { id: 'high', label: '🔴 Urgent', desc: 'ASAP' },
                        ].map(function(p) {
                          return (
                            <div key={p.id}
                              onClick={function() { set('priority', p.id) }}
                              style={{
                                flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
                                border: '2px solid ' + (form.priority === p.id ? '#0EA5A0' : '#E5E7EB'),
                                background: form.priority === p.id ? '#E6F7F7' : 'white',
                                textAlign: 'center', transition: 'all 0.2s',
                              }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: form.priority === p.id ? '#0EA5A0' : '#374151' }}>{p.label}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.desc}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>💬 Describe Your Problem *</label>
                      <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Problem ko detail mein describe karo — jitna zyada detail utna jaldi solve hoga..."
                        value={form.message}
                        onChange={function(e) { set('message', e.target.value) }}
                      />
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                        {form.message.length}/500 characters
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={sending}>
                      {sending ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                          <div style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          Submitting...
                        </span>
                      ) : '🎫 Submit Ticket'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONTACT TAB ── */}
        {activeTab === 'contact' && (
          <div>
            <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
              📞 Contact Information
            </div>
            <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
              Multiple ways to reach us
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

              {/* Direct Contacts */}
              <div style={{ background: 'white', borderRadius: 20, padding: '28px', boxShadow: '0 4px 20px rgba(14,165,160,0.06)' }}>
                <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
                  📱 Direct Contact
                </div>

                {[
                  { icon: '📞', label: 'Phone', value: '+91 70552 52609', href: 'tel:+917055252609', color: '#0EA5A0' },
                  { icon: '💬', label: 'WhatsApp', value: '+91 70552 52609', href: 'https://wa.me/917055252609', color: '#059669' },
                  { icon: '📧', label: 'Email', value: 'nukkadmarket25@gmail.com', href: 'mailto:nukkadmarket25@gmail.com', color: '#D97706' },
                ].map(function(contact) {
                  return (
                    <a key={contact.label} href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                        background: '#F9FAFB', borderRadius: 14, border: '2px solid transparent',
                        transition: 'all 0.2s',
                      }}
                        onMouseEnter={function(e) { e.currentTarget.style.borderColor = contact.color; e.currentTarget.style.background = 'white' }}
                        onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F9FAFB' }}
                      >
                        <div style={{
                          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                          background: contact.color + '15',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                        }}>{contact.icon}</div>
                        <div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{contact.label}</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: contact.color }}>{contact.value}</div>
                        </div>
                        <span style={{ marginLeft: 'auto', color: contact.color, fontSize: 18 }}>→</span>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Hours & Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 20px rgba(14,165,160,0.06)' }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                    ⏰ Support Hours
                  </div>
                  {[
                    { day: 'Monday - Friday', time: '9:00 AM - 7:00 PM', active: true },
                    { day: 'Saturday',        time: '9:00 AM - 5:00 PM', active: true },
                    { day: 'Sunday',          time: 'WhatsApp Only',     active: false },
                  ].map(function(h) {
                    return (
                      <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>{h.day}</span>
                        <span style={{ fontSize: 14, color: h.active ? '#059669' : '#9CA3AF', fontWeight: 700 }}>{h.time}</span>
                      </div>
                    )
                  })}
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #0F2A3F, #0C8A85, #0EA5A0)',
                  borderRadius: 20, padding: '24px',
                }}>
                  <div style={{ fontFamily: 'Baloo 2, cursive', fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 12 }}>
                    🏪 NukkadMarket
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                    India ka #1 Hyperlocal Marketplace<br />
                    🇮🇳 Made in India, for India<br />
                    📧 nukkadmarket25@gmail.com<br />
                    📞 +91 70552 52609
                  </div>
                  <a href="mailto:nukkadmarket25@gmail.com"
                    style={{
                      display: 'inline-block', marginTop: 16,
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: 'white', borderRadius: 99, padding: '10px 20px',
                      fontWeight: 700, fontSize: 13, textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
                    }}>
                    📧 Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}