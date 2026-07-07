import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .get('/notifications')
      .then(({ data }) => setItems(data.notifications))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    await api.put('/notifications/read-all');
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="section" style={{ maxWidth: 640 }}>
      <div className="row between center">
        <h2 className="section-title">Notifications</h2>
        {items.some((n) => !n.read) && (
          <button className="btn btn-sm btn-outline" onClick={markAll}>Mark all read</button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="empty">No notifications yet.</div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {items.map((n) => {
            const inner = (
              <>
                <div className="row between">
                  <strong>{n.title}</strong>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="muted">{n.message}</div>
              </>
            );
            return n.link ? (
              <Link key={n._id} to={n.link} className={`notif-item ${n.read ? '' : 'unread'}`}>
                {inner}
              </Link>
            ) : (
              <div key={n._id} className={`notif-item ${n.read ? '' : 'unread'}`}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
