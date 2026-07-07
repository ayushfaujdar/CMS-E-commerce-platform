import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import Loader from '../../components/Loader.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminCategories() {
  const { show } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', image: '' });

  const load = () => api.get('/categories').then(({ data }) => setCategories(data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', form);
      setForm({ name: '', description: '', image: '' });
      await load();
      show('Category created');
    } catch (err) {
      show(err.response?.data?.message || 'Failed');
    }
  };

  const remove = async (c) => {
    if (!confirm(`Delete ${c.name}?`)) return;
    try {
      await api.delete(`/categories/${c._id}`);
      await load();
      show('Category deleted');
    } catch (err) {
      show(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="row wrap" style={{ alignItems: 'flex-start', gap: 24 }}>
      <div className="card" style={{ flex: '1 1 360px', padding: 8 }}>
        <table className="table">
          <thead><tr><th>Name</th><th>Slug</th><th></th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td className="muted">{c.slug}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => remove(c)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="card" style={{ flex: '1 1 280px', padding: 20 }} onSubmit={create}>
        <h3 style={{ marginTop: 0 }}>Add category</h3>
        <div className="stack">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
}
