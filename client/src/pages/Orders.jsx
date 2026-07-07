import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { inr, STATUS_LABELS } from '../lib/format.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (orders.length === 0)
    return (
      <div className="empty">
        You haven&apos;t placed any orders yet. <Link to="/shop">Shop now →</Link>
      </div>
    );

  return (
    <div className="section">
      <h2 className="section-title">My orders</h2>
      <div className="stack">
        {orders.map((o) => (
          <Link key={o._id} to={`/orders/${o._id}`} className="card" style={{ padding: 18, display: 'block' }}>
            <div className="row between center wrap">
              <div>
                <strong>Order #{o._id.slice(-6)}</strong>
                <div className="muted" style={{ fontSize: 13 }}>
                  {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)
                </div>
              </div>
              <span className={`status ${o.orderStatus}`}>{STATUS_LABELS[o.orderStatus]}</span>
              <strong>{inr(o.totalPrice)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
