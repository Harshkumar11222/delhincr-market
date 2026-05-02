import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google'
import api from '../api'


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.phone || !form.password) { setError('Phone and password required'); return; }
    setLoading(true);
    try {
      await login(form.phone, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid phone or password');
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
  setError('')
  setLoading(true)
  try {
    const res = await api.post('/auth/google', {
      credential: credentialResponse.credential
    })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    window.location.href = '/'
  } catch(err) {
    setError(err.response?.data?.error || 'Google login failed')
  }
  setLoading(false)
}

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '40px 32px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: '#FF6B35', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'Baloo 2, cursive', margin: '0 auto 12px' }}>D</div>
          <h2 style={{ fontFamily: 'Baloo 2, cursive', fontSize: 24, color: '#111827', marginBottom: 4 }}>Welcome Back!</h2>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Login to your DelhiNCR Market account</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', color: '#DC2626', marginBottom: 16, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mobile Number</label>
            <input className="form-control" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} maxLength={10} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" placeholder="Enter password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <div style={{ textAlign: 'right', marginTop: -12, marginBottom: 16 }}>
  <Link to="/forgot-password" style={{ fontSize: 13, color: '#FF6B35', fontWeight: 600 }}>
    Forgot Password?
  </Link>
</div>
          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div style={{ marginTop: 16 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
    <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
    <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>ya</span>
    <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
  </div>

  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => setError('Google login failed')}
      theme="outline"
      size="large"
      width="100%"
      text="signin_with"
      shape="pill"
      locale="en"
    />
  </div>
</div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
          New user? <Link to="/register" style={{ color: '#FF6B35', fontWeight: 700 }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}