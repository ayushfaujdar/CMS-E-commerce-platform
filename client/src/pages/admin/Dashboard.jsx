import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import Loader from '../../components/Loader.jsx';
import { inr, STATUS_LABELS } from '../../lib/format.js';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => setData(data));
  }, []);

  if (!data) return <Loader />;

  const maxRevenue = Math.max(...data.salesByDay.map((d) => d.revenue), 1);

  return (
    <div className="stack">
      <div className="stat-grid">
        <div className="card stat">
          <div className="label">Total revenue</div>
          <div className="value">{inr(data.totalRevenue)}</div>
        </div>
        <div className="card stat">
          <div className="label">Orders</div>
          <div className="value">{data.orderCount}</div>
        </div>
        <div className="card stat">
          <div className="label">Customers</div>
          <div className="value">{data.userCount}</div>
        </div>
        <div className="card stat">
          <div className="label">Products</div>
          <div className="value">{data.productCount}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ marginTop: 0 }}>Revenue (last 14 days)</h3>
        {data.salesByDay.length === 0 ? (
          <p className="muted">No paid orders yet.</p>
        ) : (
          <div className="bar-chart">
            {data.salesByDay.map((d) => (
              <div
                key={d._id}
                className="bar"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                data-label={`${d._id}: ${inr(d.revenue)}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <div className="card" style={{ flex: '1 1 320px', padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Top selling products</h3>
          {data.topProducts.length === 0 ? (
            <p className="muted">No sales yet.</p>
          ) : (
            <table className="table">
              <tbody>
                {data.topProducts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.sold} sold</td>
                    <td style={{ textAlign: 'right' }}>{inr(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ flex: '1 1 280px', padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Orders by status</h3>
          <div className="stack">
            {data.statusBreakdown.map((s) => (
              <div key={s._id} className="row between">
                <span className={`status ${s._id}`}>{STATUS_LABELS[s._id] || s._id}</span>
                <strong>{s.count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ flex: '1 1 280px', padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Low stock alerts</h3>
          {data.lowStock.length === 0 ? (
            <p className="muted">All products well stocked.</p>
          ) : (
            <div className="stack">
              {data.lowStock.map((p) => (
                <div key={p._id} className="row between">
                  <span>{p.name}</span>
                  <strong className={p.countInStock === 0 ? 'error-text' : ''}>{p.countInStock}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
