import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 调用后端登录 API
      const res = await client.post('/auth/login', { email, password });
      // 把 token 存到 localStorage，之后每个请求自动带上
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', res.data.email);
      navigate('/projects');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>SprintDesk</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    background: 'white', padding: '2rem',
    borderRadius: '8px', width: '360px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: { margin: 0, fontSize: '24px', color: '#1a1a2e' },
  subtitle: { color: '#666', marginBottom: '1.5rem' },
  input: {
    width: '100%', padding: '10px',
    marginBottom: '12px', borderRadius: '6px',
    border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '10px',
    backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '6px',
    fontSize: '14px', cursor: 'pointer',
  },
  error: { color: 'red', fontSize: '13px', marginBottom: '10px' },
};

export default LoginPage;