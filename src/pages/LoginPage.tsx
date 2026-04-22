import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { GoogleLogin } from '@react-oauth/google';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!isLogin && !fullName) {
      setError('Please enter your full name');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await client.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', res.data.email);
        navigate('/projects');
      } else {
        const res = await client.post('/auth/register', { email, password, fullName });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', res.data.email);
        navigate('/projects');
      }
    } catch (err: any) {
      setError(isLogin ? 'Invalid email or password' : 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>S</div>
          <span style={styles.logoText}>SprintDesk</span>
        </div>

        <h2 style={styles.title}>
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p style={styles.subtitle}>
          {isLogin ? 'Sign in to your workspace' : 'Start managing your projects'}
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Full name — only on register */}
        {!isLogin && (
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button
          style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
        </button>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Google 登录按钮 */}
        <div style={{ width: '100%' }}>
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        // 把 Google 返回的 credential 发给后端验证
        const res = await client.post('/auth/google', {
          credential: credentialResponse.credential,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', res.data.email);
        navigate('/projects');
      } catch (err) {
        setError('Google login failed. Please try again.');
      }
    }}
    onError={() => setError('Google login failed. Please try again.')}
    width="352"
    text="continue_with"
    shape="rectangular"
    theme="outline"
  />
</div>

        {/* 切换登录/注册 */}
        <p style={styles.switchText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.switchLink} onClick={switchMode}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: '#f5f5f5',
  },
  card: {
    background: 'white', padding: '2.5rem', borderRadius: '12px',
    width: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem',
  },
  logoIcon: {
    width: '36px', height: '36px', borderRadius: '8px',
    backgroundColor: '#4f46e5', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '18px',
  },
  logoText: { fontSize: '18px', fontWeight: 600, color: '#1a1a2e' },
  title: { margin: '0 0 4px', fontSize: '22px', fontWeight: 600, color: '#1a1a2e' },
  subtitle: { margin: '0 0 1.5rem', fontSize: '14px', color: '#888' },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', borderRadius: '6px',
    padding: '10px 14px', fontSize: '13px', marginBottom: '1rem',
  },
  fieldGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #e5e7eb', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none',
  },
  submitBtn: {
    width: '100%', padding: '11px', backgroundColor: '#4f46e5',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginTop: '4px',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0',
  },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#e5e7eb' },
  dividerText: { fontSize: '13px', color: '#9ca3af' },
  googleBtn: {
    width: '100%', padding: '10px', background: 'white',
    border: '1px solid #e5e7eb', borderRadius: '8px',
    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#374151',
  },
  switchText: { textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '1.25rem' },
  switchLink: { color: '#4f46e5', cursor: 'pointer', fontWeight: 500 },
};

export default AuthPage;