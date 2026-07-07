import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../api/client.js';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const menuRef = useRef(null);

  const [sanityNavbar, setSanityNavbar] = useState(null);

  useEffect(() => {
    if (!user) return;
    api
      .get('/notifications')
      .then(({ data }) => setUnread(data.unread))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    import('../lib/sanity.js').then(({ sanityFetch, urlFor }) => {
      sanityFetch('*[_type == "navbar"][0]').then((data) => {
        if (data && data.logoImage) {
          data.logoImageUrl = urlFor(data.logoImage).url();
        }
        setSanityNavbar(data);
      });
    });
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="navbar">
      {sanityNavbar?.announcementText ? (
        <div className="promo-bar">{sanityNavbar.announcementText}</div>
      ) : (
        <div className="promo-bar">✨ Free shipping on orders above ₹999 · Use code WELCOME10 for 10% off</div>
      )}
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          {sanityNavbar?.logoImageUrl ? (
            <img src={sanityNavbar.logoImageUrl} alt={sanityNavbar?.logoText || 'VOGUE'} style={{ height: '30px' }} />
          ) : (
            <>
              {sanityNavbar?.logoText || 'VOGUE'}<span>.</span>
            </>
          )}
        </Link>
        <nav className="nav-links">
          {sanityNavbar?.menuItems?.length > 0 ? (
            sanityNavbar.menuItems.map((item, i) => (
              <Link key={i} to={item.url}>{item.title}</Link>
            ))
          ) : (
            <>
              <Link to="/shop">Shop All</Link>
              <Link to="/shop?gender=men">Men</Link>
              <Link to="/shop?gender=women">Women</Link>
              <Link to="/offers">Offers</Link>
            </>
          )}
        </nav>
        <form className="nav-search" onSubmit={submit}>
          <input
            placeholder="Search for products, brands and more"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <div className="nav-actions">
          {user ? (
            <div className="dropdown" ref={menuRef}>
              <span className="nav-icon" onClick={() => setMenuOpen((o) => !o)}>
                {user.name.split(' ')[0]} ▾
                {unread > 0 && <span className="badge">{unread}</span>}
              </span>
              {menuOpen && (
                <div className="dropdown-menu" onClick={() => setMenuOpen(false)}>
                  <Link className="notif-item" to="/orders">My Orders</Link>
                  <Link className="notif-item" to="/notifications">
                    Notifications {unread > 0 && `(${unread})`}
                  </Link>
                  <Link className="notif-item" to="/profile">Profile</Link>
                  {isAdmin && <Link className="notif-item" to="/admin">Admin Panel</Link>}
                  <div className="notif-item" style={{ cursor: 'pointer' }} onClick={logout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-icon">Login</Link>
          )}
          <Link to="/cart" className="nav-icon">
            Cart
            {count > 0 && <span className="badge">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
