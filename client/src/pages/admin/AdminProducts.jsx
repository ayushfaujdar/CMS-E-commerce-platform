import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import Loader from '../../components/Loader.jsx';
import { inr } from '../../lib/format.js';
import { useToast } from '../../context/ToastContext.jsx';

const empty = {
  name: '',
  brand: '',
  category: '',
  gender: 'unisex',
  price: '',
  discountPercent: 0,
  countInStock: 0,
  sizes: 'S,M,L,XL',
  images: '',
  description: '',
  isFeatured: false,
};

export default function AdminProducts() {
  const { show } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [form, setForm] = useState(empty);

  const load = () =>
    Promise.all([api.get('/products?limit=50'), api.get('/categories')]).then(([p, c]) => {
      setProducts(p.data.products);
      setCategories(c.data);
      if (!form.category && c.data[0]) setForm((f) => ({ ...f, category: c.data[0]._id }));
    });

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNew = () => {
    setForm({ ...empty, category: categories[0]?._id || '' });
    setEditing('new');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category?._id || p.category,
      gender: p.gender,
      price: p.price,
      discountPercent: p.discountPercent,
      countInStock: p.countInStock,
      sizes: (p.sizes || []).join(','),
      images: (p.images || []).join(','),
      description: p.description,
      isFeatured: p.isFeatured,
    });
    setEditing(p);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discountPercent: Number(form.discountPercent),
      countInStock: Number(form.countInStock),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing === 'new') await api.post('/products', payload);
      else await api.put(`/products/${editing._id}`, payload);
      setEditing(null);
      await load();
      show('Product saved');
    } catch (err) {
      show(err.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (p) => {
    if (!confirm(`Delete ${p.name}?`)) return;
    await api.delete(`/products/${p._id}`);
    await load();
    show('Product deleted');
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="row between center">
        <h3>Products ({products.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add product</button>
      </div>

      <div className="card" style={{ padding: 8, marginTop: 12 }}>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category?.name}</td>
                <td>{inr(p.finalPrice)}</td>
                <td className={p.countInStock <= 5 ? 'error-text' : ''}>{p.countInStock}</td>
                <td>
                  <div className="row" style={{ gap: 6 }}>
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(p)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="card" style={{ padding: 24, marginTop: 20 }}>
          <h3 style={{ marginTop: 0 }}>{editing === 'new' ? 'New product' : `Edit ${editing.name}`}</h3>
          <form onSubmit={save} className="stack">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div className="row">
              <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>
            <div className="row">
              <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <input type="number" placeholder="Discount %" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
              <input type="number" placeholder="Stock" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />
            </div>
            <input placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
            <input placeholder="Image URLs (comma separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
            <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="row center" style={{ gap: 8 }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured product
            </label>
            <div className="row">
              <button className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
