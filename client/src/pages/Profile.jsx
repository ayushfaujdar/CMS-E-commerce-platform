import { useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { show } = useToast();
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(
    user.addresses?.[0] || { line1: '', city: '', state: '', postalCode: '', phone: '', country: 'India' }
  );
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put('/auth/profile', { name, addresses: [address] });
      setUser(data.user);
      show('Profile updated');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="section" style={{ maxWidth: 560 }}>
      <h2 className="section-title">My profile</h2>
      <form className="card" style={{ padding: 24 }} onSubmit={save}>
        <div className="stack">
          <div>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Email</label>
            <input value={user.email} disabled />
          </div>
          <h4 style={{ marginBottom: 0 }}>Default address</h4>
          <input placeholder="Address line 1" value={address.line1 || ''} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
          <div className="row">
            <input placeholder="City" value={address.city || ''} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            <input placeholder="State" value={address.state || ''} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
          </div>
          <div className="row">
            <input placeholder="Postal code" value={address.postalCode || ''} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
            <input placeholder="Phone" value={address.phone || ''} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
          </div>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  );
}
