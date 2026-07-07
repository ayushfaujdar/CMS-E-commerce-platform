import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const gender = params.get('gender') || '';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page') || 1);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (q) qs.set('q', q);
    if (category) qs.set('category', category);
    if (gender) qs.set('gender', gender);
    qs.set('sort', sort);
    qs.set('page', page);
    api
      .get(`/products?${qs.toString()}`)
      .then(({ data }) => {
        setProducts(data.products);
        setMeta({ total: data.total, page: data.page, pages: data.pages });
      })
      .finally(() => setLoading(false));
  }, [q, category, gender, sort, page]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  return (
    <div className="section">
      <h2 className="section-title">{q ? `Results for “${q}”` : 'Shop all'}</h2>
      <p className="section-sub">{meta.total} products</p>

      <div className="shop-layout">
        <aside className="filters">
          <div className="card filter-group">
            <h4>Category</h4>
            <div className="stack">
              <div
                className={`cat-pill ${!category ? 'active' : ''}`}
                onClick={() => setParam('category', '')}
              >
                All
              </div>
              {categories.map((c) => (
                <div
                  key={c._id}
                  className={`cat-pill ${category === c.slug ? 'active' : ''}`}
                  onClick={() => setParam('category', c.slug)}
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>
          <div className="card filter-group" style={{ marginTop: 16 }}>
            <h4>Gender</h4>
            <select value={gender} onChange={(e) => setParam('gender', e.target.value)}>
              <option value="">All</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
              <option value="kids">Kids</option>
            </select>
            <h4 style={{ marginTop: 16 }}>Sort by</h4>
            <select value={sort} onChange={(e) => setParam('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
              <option value="popular">Most reviewed</option>
            </select>
          </div>
        </aside>

        <div>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="empty">No products match your filters.</div>
          ) : (
            <>
              <div className="grid-products">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {meta.pages > 1 && (
                <div className="row center" style={{ justifyContent: 'center', marginTop: 28, gap: 8 }}>
                  {Array.from({ length: meta.pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`btn btn-sm ${n === meta.page ? '' : 'btn-outline'}`}
                      onClick={() => setParam('page', n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
