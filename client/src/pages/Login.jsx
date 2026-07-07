import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card auth-wrap">
      <h2>Welcome back</h2>
      <p className="muted">Log in to continue shopping</p>
      <form onSubmit={submit} className="stack">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
      <div className="card" style={{ padding: 12, marginTop: 12, background: '#f9f8f6' }}>
        <strong style={{ fontSize: 13 }}>Demo accounts</strong>
        <p className="muted" style={{ fontSize: 13, margin: '6px 0 0' }}>
          Customer: demo@fashion.com / demo123<br />
          Admin: admin@fashion.com / admin123
        </p>
      </div>
    </div>
  );
}
