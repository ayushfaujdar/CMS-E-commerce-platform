import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import Loader from '../../components/Loader.jsx';
import { inr } from '../../lib/format.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminCoupons() {
  const { show } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', description: '', discountPercent: 10, minOrder: 0 });

  const load = () => api.get('/admin/coupons').then(({ data }) => setCoupons(data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/coupons', {
        ...form,
        discountPercent: Number(form.discountPercent),
        minOrder: Number(form.minOrder),
      });
      setForm({ code: '', description: '', discountPercent: 10, minOrder: 0 });
      await load();
      show('Coupon created');
    } catch (err) {
      show(err.response?.data?.message || 'Failed');
    }
  };

  const toggle = async (c) => {
    await api.put(`/admin/coupons/${c._id}`, { active: !c.active });
    await load();
  };

  const remove = async (c) => {
    if (!confirm(`Delete ${c.code}?`)) return;
    await api.delete(`/admin/coupons/${c._id}`);
    await load();
    show('Coupon deleted');
  };

  if (loading) return <Loader />;

  return (
    <div className="row wrap" style={{ alignItems: 'flex-start', gap: 24 }}>
      <div className="card" style={{ flex: '1 1 380px', padding: 8 }}>
        <table className="table">
          <thead><tr><th>Code</th><th>Discount</th><th>Min</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.code}</strong><div className="muted" style={{ fontSize: 12 }}>{c.description}</div></td>
                <td>{c.discountPercent}%</td>
                <td>{inr(c.minOrder)}</td>
                <td>
                  <button className={`btn btn-sm ${c.active ? '' : 'btn-outline'}`} onClick={() => toggle(c)}>
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td><button className="btn btn-sm btn-danger" onClick={() => remove(c)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="card" style={{ flex: '1 1 280px', padding: 20 }} onSubmit={create}>
        <h3 style={{ marginTop: 0 }}>Add coupon</h3>
        <div className="stack">
          <input placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="number" placeholder="Discount %" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} required />
          <input type="number" placeholder="Min order" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
}
