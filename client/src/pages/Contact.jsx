import { useEffect, useState } from 'react';
import Loader from '../components/Loader';

export default function Contact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../lib/sanity.js').then(({ sanityFetch }) => {
      sanityFetch('*[_type == "contactPage"][0]').then((res) => {
        setData(res);
        setLoading(false);
      });
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="section">
      <h1 className="section-title">{data?.heading || 'Contact Us'}</h1>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          {data?.address && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Address</h3>
              <p>{data.address.street}</p>
              <p>{data.address.city}, {data.address.state} {data.address.zip}</p>
              <p>{data.address.country}</p>
            </div>
          )}
          {data?.email && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Email</h3>
              <p><a href={`mailto:${data.email}`}>{data.email}</a></p>
            </div>
          )}
          {data?.phone && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Phone</h3>
              <p>{data.phone}</p>
            </div>
          )}
          {data?.workingHours && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Working Hours</h3>
              <p>{data.workingHours}</p>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          {data?.googleMapsUrl && (
            <div>
              <h3>Find Us</h3>
              <a href={data.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Open in Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
