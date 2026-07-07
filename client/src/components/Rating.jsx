export default function Rating({ value = 0, count }) {
  const full = Math.round(value);
  return (
    <span style={{ color: '#f59e0b', fontSize: 14 }}>
      {'★'.repeat(full)}
      <span style={{ color: '#d1d5db' }}>{'★'.repeat(5 - full)}</span>
      {count != null && <span className="muted" style={{ marginLeft: 6 }}>({count})</span>}
    </span>
  );
}
