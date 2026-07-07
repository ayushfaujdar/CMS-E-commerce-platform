import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="section">
      <h2 className="section-title">Admin Panel</h2>
      <div className="admin-layout">
        <nav className="admin-nav card" style={{ padding: 10, height: 'fit-content' }}>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/coupons">Coupons</NavLink>
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
