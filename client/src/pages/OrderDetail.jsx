import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { inr, STATUS_LABELS } from '../lib/format.js';
import { useToast } from '../context/ToastContext.jsx';

const STEPS = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const { show } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="empty">Order not found</div>;

  const cancel = async () => {
    try {
      const { data } = await api.post(`/orders/${id}/cancel`);
      setOrder(data);
      show('Order cancelled');
    } catch (err) {
      show(err.response?.data?.message || 'Could not cancel');
    }
  };

  const currentStep = STEPS.indexOf(order.orderStatus);
  const cancelled = order.orderStatus === 'cancelled';

  return (
    <div className="section">
      <div className="row between center wrap">
        <h2 className="section-title">Order #{order._id.slice(-6)}</h2>
        <span className={`status ${order.orderStatus}`}>{STATUS_LABELS[order.orderStatus]}</span>
      </div>
      <p className="muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>

      {!cancelled && (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Delivery tracking</h3>
          <div className="row between" style={{ gap: 4 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: i <= currentStep ? 'var(--primary)' : 'var(--line)',
                    marginBottom: 8,
                  }}
                />
                <span style={{ fontSize: 12, color: i <= currentStep ? 'var(--ink)' : 'var(--muted)' }}>
                  {STATUS_LABELS[s]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="row wrap" style={{ alignItems: 'flex-start', gap: 24 }}>
        <div className="card" style={{ flex: '1 1 480px', padding: 8 }}>
          <table className="table">
            <tbody>
              {order.items.map((i, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="row center">
                      {i.image && <img className="cart-item-img" src={i.image} alt="" />}
                      <div>
                        <strong>{i.name}</strong>
                        {i.size && <div className="muted">Size: {i.size}</div>}
                        <div className="muted">Qty: {i.quantity}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>{inr(i.price * i.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ flex: '1 1 280px' }} className="stack">
          <div className="card summary">
            <div className="line"><span>Items</span><span>{inr(order.itemsPrice)}</span></div>
            {order.discount > 0 && (
              <div className="line" style={{ color: 'var(--success)' }}>
                <span>Discount</span><span>−{inr(order.discount)}</span>
              </div>
            )}
            <div className="line"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : inr(order.shippingPrice)}</span></div>
            <div className="line total"><span>Total</span><span>{inr(order.totalPrice)}</span></div>
            <div className="row between" style={{ marginTop: 10 }}>
              <span className="muted">Payment</span>
              <span className={`status ${order.paymentStatus}`}>{order.paymentStatus}</span>
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <h4 style={{ marginTop: 0 }}>Shipping to</h4>
            <p className="muted" style={{ margin: 0 }}>
              {order.shippingAddress?.line1}<br />
              {order.shippingAddress?.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country} · {order.shippingAddress?.phone}
            </p>
          </div>

          {!cancelled && !['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus) && (
            <button className="btn btn-outline" onClick={cancel}>Cancel order</button>
          )}
        </div>
      </div>
    </div>
  );
}
