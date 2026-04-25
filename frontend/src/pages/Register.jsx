import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.password) { setError('Name, phone and password are required'); return; }
    if (form.phone.length !== 10) { setError('Enter valid 10-digit mobile number'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.name, form.phone, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '40px 32px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: '#FF6B35', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'Baloo 2, cursive', margin: '0 auto 12px' }}>D</div>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, color: '#111827', marginBottom: 4 }}>Create Account</h2>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Join Delhi NCR's trusted marketplace</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', color: '#DC2626', marginBottom: 16, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input className="form-control" placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input className="form-control" type="tel" placeholder="10-digit number" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
          </div>
          <div className="form-group">
            <label>Email (optional)</label>
            <input className="form-control" type="email" placeholder="rahul@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input className="form-control" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input className="form-control" type="password" placeholder="Re-enter password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
          Already have account? <Link to="/login" style={{ color: '#FF6B35', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}