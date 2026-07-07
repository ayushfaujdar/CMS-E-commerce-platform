import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sanityHome, setSanityHome] = useState(null);

  useEffect(() => {
    import('../lib/sanity.js').then(({ sanityFetch, urlFor }) => {
      sanityFetch('*[_type == "homepage"][0]').then((data) => {
        if (data && data.hero && data.hero.image) {
          data.hero.imageUrl = urlFor(data.hero.image).url();
        }
        setSanityHome(data);
      });
    });

    Promise.all([
      api.get('/products?featured=true&limit=8'),
      api.get('/products?sort=newest&limit=8'),
      api.get('/categories'),
    ])
      .then(([f, l, c]) => {
        setFeatured(f.data.products);
        setLatest(l.data.products);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <section className="hero" style={sanityHome?.hero?.imageUrl ? { backgroundImage: `url(${sanityHome.hero.imageUrl})`, backgroundSize: 'cover' } : {}}>
        <h1>{sanityHome?.hero?.heading || 'Style that speaks for you.'}</h1>
        <p>
          {sanityHome?.hero?.subtitle || "Discover the season's freshest fashion — curated tees, denim, dresses, footwear and accessories at prices you'll love."}
        </p>
        <Link to={sanityHome?.hero?.button?.url || "/shop"} className="btn btn-primary">
          {sanityHome?.hero?.button?.text || "Shop the collection"}
        </Link>
      </section>

      <section className="section">
        <h2 className="section-title">{sanityHome?.featuredCategoriesTitle || "Shop by category"}</h2>
        <p className="section-sub">Find exactly what you&apos;re looking for</p>
        <div className="cat-row">
          {categories.map((c) => (
            <Link key={c._id} to={`/shop?category=${c.slug}`} className="cat-pill">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <h2 className="section-title">{sanityHome?.featuredCollectionsTitle || "Featured picks"}</h2>
          <p className="section-sub">Hand-selected favourites</p>
          <div className="grid-products">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">New arrivals</h2>
        <p className="section-sub">Fresh off the rack</p>
        <div className="grid-products">
          {latest.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
