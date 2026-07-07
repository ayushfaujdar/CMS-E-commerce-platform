import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import Rating from '../components/Rating.jsx';
import { inr } from '../lib/format.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { user } = useAuth();
  const { show } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setReviews(data.reviews);
        setSize(data.product.sizes?.[0] || '');
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [slug]);

  if (loading) return <Loader />;
  if (!product) return <div className="empty">Product not found</div>;

  const addToCart = async () => {
    if (!user) return navigate('/login', { state: { from: `/product/${slug}` } });
    if (product.sizes?.length && !size) return show('Please select a size');
    await add(product._id, size, qty);
    show('Added to cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      load();
      show('Review submitted');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not submit review');
    }
  };

  return (
    <div className="section">
      <div className="pdp">
        <div className="gallery">
          <img src={product.images?.[activeImg]} alt={product.name} />
          {product.images?.length > 1 && (
            <div className="thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className={i === activeImg ? 'active' : ''}
                  onClick={() => setActiveImg(i)}
                  alt=""
                />
              ))}
            </div>
          )}
        </div>

        <div className="stack">
          <div className="muted">{product.brand} · {product.category?.name}</div>
          <h1 style={{ margin: 0 }}>{product.name}</h1>
          <Rating value={product.rating} count={product.numReviews} />
          <div className="price-row">
            <span className="price" style={{ fontSize: 26 }}>{inr(product.finalPrice)}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="price-old">{inr(product.price)}</span>
                <span className="discount-tag">{product.discountPercent}% off</span>
              </>
            )}
          </div>
          <p className="muted">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div>
              <h4>Select size</h4>
              <div className="size-row">
                {product.sizes.map((s) => (
                  <div
                    key={s}
                    className={`size-box ${size === s ? 'active' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="row center">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <span className={product.countInStock > 0 ? 'muted' : 'error-text'}>
              {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            className="btn btn-primary btn-block"
            disabled={product.countInStock === 0}
            onClick={addToCart}
          >
            Add to cart
          </button>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">Customer reviews ({reviews.length})</h2>
        <div className="row wrap" style={{ alignItems: 'flex-start', gap: 32 }}>
          <div style={{ flex: '1 1 360px' }}>
            {reviews.length === 0 && <p className="muted">No reviews yet. Be the first!</p>}
            <div className="stack">
              {reviews.map((r) => (
                <div key={r._id} className="card" style={{ padding: 16 }}>
                  <div className="row between">
                    <strong>{r.user?.name || r.name}</strong>
                    <Rating value={r.rating} />
                  </div>
                  <p className="muted" style={{ margin: '8px 0 0' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {user && (
            <form className="card" style={{ padding: 20, flex: '1 1 300px' }} onSubmit={submitReview}>
              <h4 style={{ marginTop: 0 }}>Write a review</h4>
              <label>Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
              <label style={{ display: 'block', marginTop: 12 }}>Comment</label>
              <textarea
                rows={3}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              />
              {reviewError && <p className="error-text">{reviewError}</p>}
              <button className="btn btn-block" style={{ marginTop: 12 }}>Submit review</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
