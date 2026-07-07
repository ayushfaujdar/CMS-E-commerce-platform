import { useEffect, useState } from 'react';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { inr } from '../lib/format.js';

export default function Offers() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/coupons').then(({ data }) => setCoupons(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="section">
      <h2 className="section-title">Promotional offers</h2>
      <p className="section-sub">Apply these codes at checkout to save</p>
      {coupons.length === 0 ? (
        <div className="empty">No active offers right now.</div>
      ) : (
        <div className="grid-products">
          {coupons.map((c) => (
            <div key={c._id} className="card" style={{ padding: 24 }}>
              <div className="discount-tag" style={{ fontSize: 22 }}>{c.discountPercent}% OFF</div>
              <h3 style={{ margin: '8px 0' }}>{c.code}</h3>
              <p className="muted">{c.description}</p>
              {c.minOrder > 0 && <p className="muted" style={{ fontSize: 13 }}>Min order {inr(c.minOrder)}</p>}
              <span className="chip">Use code: {c.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
