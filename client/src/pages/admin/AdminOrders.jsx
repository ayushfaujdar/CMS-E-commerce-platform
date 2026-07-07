import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import Loader from '../../components/Loader.jsx';
import { inr, STATUS_LABELS } from '../../lib/format.js';
import { useToast } from '../../context/ToastContext.jsx';

const STEPS = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

export default function AdminOrders() {
  const { show } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/admin/orders').then(({ data }) => setOrders(data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      await load();
      show('Order status updated');
    } catch (err) {
      show(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h3>Orders ({orders.length})</h3>
      <div className="card" style={{ padding: 8 }}>
        <table className="table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Update</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>
                  #{o._id.slice(-6)}
                  <div className="muted" style={{ fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                </td>
                <td>
                  {o.user?.name}
                  <div className="muted" style={{ fontSize: 12 }}>{o.user?.email}</div>
                </td>
                <td>{inr(o.totalPrice)}</td>
                <td><span className={`status ${o.orderStatus}`}>{STATUS_LABELS[o.orderStatus]}</span></td>
                <td>
                  {o.orderStatus === 'cancelled' ? (
                    <span className="muted">—</span>
                  ) : (
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      {STEPS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
