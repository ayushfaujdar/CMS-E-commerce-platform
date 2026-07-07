import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../lib/sanity.js').then(({ sanityFetch, urlFor }) => {
      sanityFetch('*[_type == "blog"] | order(publishedDate desc)').then((res) => {
        if (res) {
          const formattedPosts = res.map(post => {
            if (post.featuredImage) {
              post.imageUrl = urlFor(post.featuredImage).width(400).url();
            }
            return post;
          });
          setPosts(formattedPosts);
        }
        setLoading(false);
      });
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="section">
      <h1 className="section-title">Latest on our Blog</h1>
      {posts.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <div className="grid-products">
          {posts.map((post) => (
            <div key={post._id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
              {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{post.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                  By {post.author} on {new Date(post.publishedDate).toLocaleDateString()}
                </p>
                {/* Note: Full post rendering would typically route to a dynamic /blog/:slug page */}
                <Link to={`/blog/${post.slug?.current || ''}`} className="btn btn-outline" style={{ display: 'inline-block' }}>Read More</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
