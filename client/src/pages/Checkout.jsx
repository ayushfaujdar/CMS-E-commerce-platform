import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { inr } from '../lib/format.js';
import Loader from '../components/Loader.jsx';

export default function Checkout() {
  const { items, subtotal, loading, refresh } = useCart();
  const { show } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (loading) return <Loader />;
  if (items.length === 0) return <div className="empty">Your cart is empty.</div>;

  const discount = applied ? applied.discount : 0;
  const shipping = subtotal - discount >= 999 ? 0 : 49;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    setCouponError('');
    try {
      const { data } = await api.post('/coupons/validate', { code: coupon, itemsPrice: subtotal });
      setApplied(data);
      show(`Coupon ${data.code} applied`);
    } catch (err) {
      setApplied(null);
      setCouponError(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: address,
        couponCode: applied?.code,
        paymentMethod,
      });
      await refresh();
      show('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      show(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  const canPlace =
    address.line1 && address.city && address.state && address.postalCode && address.phone;

  return (
    <div className="section">
      <h2 className="section-title">Checkout</h2>
      <div className="row wrap" style={{ alignItems: 'flex-start', gap: 28 }}>
        <div className="card" style={{ flex: '1 1 480px', padding: 24 }}>
          <h3 style={{ marginTop: 0 }}>Shipping address</h3>
          <div className="stack">
            <input
              placeholder="Address line 1"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            />
            <input
              placeholder="Address line 2 (optional)"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            />
            <div className="row">
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <input
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </div>
            <div className="row">
              <input
                placeholder="Postal code"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              />
              <input
                placeholder="Phone"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              />
            </div>
          </div>

          <h3>Payment method</h3>
          <div className="stack">
            {[
              ['card', 'Credit / Debit card'],
              ['upi', 'UPI'],
              ['cod', 'Cash on delivery'],
            ].map(([value, label]) => (
              <label key={value} className="row center" style={{ gap: 8 }}>
                <input
                  type="radio"
                  name="pay"
                  style={{ width: 'auto' }}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                />
                {label}
              </label>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13 }}>
            Payments are simulated in this demo — no real charge is made.
          </p>
        </div>

        <div className="card summary" style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginTop: 0 }}>Order summary</h3>
          <div className="stack" style={{ marginBottom: 12 }}>
            {items.map((i) => (
              <div key={`${i.product._id}-${i.size}`} className="row between">
                <span className="muted" style={{ fontSize: 13 }}>
                  {i.product.name} {i.size && `(${i.size})`} × {i.quantity}
                </span>
                <span>{inr(i.product.finalPrice * i.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="row" style={{ gap: 8 }}>
            <input
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            />
            <button className="btn btn-outline btn-sm" onClick={applyCoupon}>Apply</button>
          </div>
          {couponError && <p className="error-text">{couponError}</p>}

          <div className="line" style={{ marginTop: 12 }}>
            <span>Subtotal</span>
            <span>{inr(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="line" style={{ color: 'var(--success)' }}>
              <span>Discount ({applied.code})</span>
              <span>−{inr(discount)}</span>
            </div>
          )}
          <div className="line">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : inr(shipping)}</span>
          </div>
          <div className="line total">
            <span>Total</span>
            <span>{inr(total)}</span>
          </div>

          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 16 }}
            disabled={!canPlace || placing}
            onClick={placeOrder}
          >
            {placing ? 'Placing order…' : `Pay ${inr(total)}`}
          </button>
          {!canPlace && <p className="muted" style={{ fontSize: 12 }}>Fill in your shipping details to continue.</p>}
        </div>
      </div>
    </div>
  );
}
