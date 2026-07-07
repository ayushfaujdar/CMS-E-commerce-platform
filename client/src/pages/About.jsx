import { useEffect, useState } from 'react';
import Loader from '../components/Loader';

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../lib/sanity.js').then(({ sanityFetch, urlFor }) => {
      sanityFetch('*[_type == "aboutPage"][0]').then((res) => {
        if (res && res.images) {
          res.images = res.images.map(img => urlFor(img).url());
        }
        setData(res);
        setLoading(false);
      });
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="section">
      <h1 className="section-title">{data?.heading || 'About Us'}</h1>
      
      {data?.images?.length > 0 && (
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', marginBottom: '40px' }}>
          {data.images.map((img, i) => (
            <img key={i} src={img} alt="About" style={{ height: '300px', objectFit: 'cover', borderRadius: '8px' }} />
          ))}
        </div>
      )}

      {data?.description && (
        <div style={{ marginBottom: '40px' }}>
          <h2>Who We Are</h2>
          <p>We are a forward-thinking fashion brand...</p>
        </div>
      )}

      {data?.mission && (
        <div style={{ marginBottom: '40px' }}>
          <h2>Our Mission</h2>
          <p>To provide high-quality fashion...</p>
        </div>
      )}

      {data?.vision && (
        <div>
          <h2>Our Vision</h2>
          <p>To become a global leader in sustainable fashion...</p>
        </div>
      )}
    </div>
  );
}
