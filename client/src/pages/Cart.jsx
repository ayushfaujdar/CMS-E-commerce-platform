import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { inr } from '../lib/format.js';
import Loader from '../components/Loader.jsx';

export default function Cart() {
  const { items, subtotal, loading, update, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user)
    return (
      <div className="empty">
        Please <Link to="/login">log in</Link> to view your cart.
      </div>
    );
  if (loading) return <Loader />;
  if (items.length === 0)
    return (
      <div className="empty">
        Your cart is empty. <Link to="/shop">Start shopping →</Link>
      </div>
    );

  const shipping = subtotal >= 999 ? 0 : 49;

  return (
    <div className="section">
      <h2 className="section-title">Your cart</h2>
      <div className="row wrap" style={{ alignItems: 'flex-start', gap: 28 }}>
        <div className="card" style={{ flex: '1 1 560px', padding: 8 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.product._id}-${item.size}`}>
                  <td>
                    <div className="row center">
                      <img className="cart-item-img" src={item.product.images?.[0]} alt="" />
                      <div>
                        <Link to={`/product/${item.product.slug}`}>
                          <strong>{item.product.name}</strong>
                        </Link>
                        {item.size && <div className="muted">Size: {item.size}</div>}
                      </div>
                    </div>
                  </td>
                  <td>{inr(item.product.finalPrice)}</td>
                  <td>
                    <div className="qty">
                      <button onClick={() => update(item.product._id, item.size, item.quantity - 1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => update(item.product._id, item.size, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </td>
                  <td>{inr(item.product.finalPrice * item.quantity)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => remove(item.product._id, item.size)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card summary" style={{ flex: '1 1 280px' }}>
          <h3 style={{ marginTop: 0 }}>Order summary</h3>
          <div className="line">
            <span>Subtotal</span>
            <span>{inr(subtotal)}</span>
          </div>
          <div className="line">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : inr(shipping)}</span>
          </div>
          <div className="line total">
            <span>Total</span>
            <span>{inr(subtotal + shipping)}</span>
          </div>
          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 16 }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
