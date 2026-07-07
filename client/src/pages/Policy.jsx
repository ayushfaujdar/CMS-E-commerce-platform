import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

export default function Policy() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../lib/sanity.js').then(({ sanityFetch }) => {
      sanityFetch(`*[_type == "policy" && slug.current == $slug][0]`, { slug }).then((res) => {
        setData(res);
        setLoading(false);
      });
    });
  }, [slug]);

  if (loading) return <Loader />;

  if (!data) return <div className="empty">Policy not found</div>;

  return (
    <div className="section">
      <h1 className="section-title">{data.title}</h1>
      <div className="content">
        {/* Simplified rich text rendering for demo purposes */}
        <p>This is where the policy content goes. In a real app, use @portabletext/react.</p>
      </div>
    </div>
  );
}
