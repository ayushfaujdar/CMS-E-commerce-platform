import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'Registration failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card auth-wrap">
      <h2>Create your account</h2>
      <p className="muted">Join VOGUE and start shopping</p>
      <form onSubmit={submit} className="stack">
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creating…' : 'Sign up'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
