import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [sanityFooter, setSanityFooter] = useState(null);

  useEffect(() => {
    import('../lib/sanity.js').then(({ sanityFetch }) => {
      sanityFetch('*[_type == "footer"][0]').then(setSanityFooter);
    });
  }, []);

  return (
    <footer className="footer" style={{ padding: '40px 0', backgroundColor: '#f9f9f9', marginTop: '40px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
        <div>
          <h3>About VOGUE</h3>
          <p>{sanityFooter?.companyDescription || 'VOGUE Fashion Store · Built with the MERN stack · Demo project'}</p>
        </div>
        
        {sanityFooter?.quickLinks?.length > 0 && (
          <div>
            <h3>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {sanityFooter.quickLinks.map((link, i) => (
                <li key={i} style={{ marginBottom: '10px' }}>
                  <Link to={link.url} style={{ color: '#333', textDecoration: 'none' }}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sanityFooter?.socialLinks?.length > 0 && (
          <div>
            <h3>Follow Us</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              {sanityFooter.socialLinks.map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" style={{ color: '#333', fontSize: '20px' }}>
                  {/* Using platform name as fallback for icon if you don't have font-awesome */}
                  {social.icon ? <i className={social.icon}></i> : social.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="container" style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p>{sanityFooter?.copyrightText || '© 2026 VOGUE Fashion Store'}</p>
      </div>
    </footer>
  );
}
