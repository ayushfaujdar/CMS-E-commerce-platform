import { Link } from 'react-router-dom';
import { inr } from '../lib/format.js';
import Rating from './Rating.jsx';

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0;
  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="thumb">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
      </div>
      <div className="body">
        <div className="brand">{product.brand}</div>
        <p className="pname">{product.name}</p>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="price-row" style={{ marginTop: 8 }}>
          <span className="price">{inr(product.finalPrice)}</span>
          {hasDiscount && (
            <>
              <span className="price-old">{inr(product.price)}</span>
              <span className="discount-tag">{product.discountPercent}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
