import React, { useEffect, useMemo, useState } from 'react';
import { isApiConfigured, listProducts } from '../api/client';
import ProductCard from '../components/ProductCard';
import { SkeletonBlock } from '../components/Skeleton';

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Product listing page (Home). Fetches from API if configured, otherwise shows mock catalog. */
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setStatus('loading');
        const data = await listProducts();
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
        setStatus('ready');
      } catch (e) {
        if (!mounted) return;
        setStatus('error');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => (p.name || '').toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="page">
      <section className="hero">
        <div className="container heroInner">
          <div className="heroText">
            <h1 className="h1">Shop essentials, beautifully.</h1>
            <p className="muted">
              Browse products, add to cart, and complete a simple checkout flow.{' '}
              {!isApiConfigured() && (
                <span className="pill" title="REACT_APP_API_BASE is not set">
                  Mock data mode
                </span>
              )}
            </p>
          </div>

          <div className="searchWrap">
            <label className="srOnly" htmlFor="search">
              Search products
            </label>
            <input
              id="search"
              className="input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products..."
            />
          </div>
        </div>
      </section>

      <section className="container section">
        {status === 'error' && (
          <div className="callout error">
            Could not load products. If you intended to use a backend, set <code>REACT_APP_API_BASE</code>.
          </div>
        )}

        {status === 'loading' && (
          <div className="grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card productCard">
                <SkeletonBlock className="skeletonMedia" />
                <div className="productCardBody">
                  <SkeletonBlock style={{ height: 16, width: '70%' }} />
                  <SkeletonBlock style={{ height: 12, width: '40%', marginTop: 10 }} />
                  <div className="productCardFooter">
                    <SkeletonBlock style={{ height: 16, width: 70 }} />
                    <SkeletonBlock style={{ height: 36, width: 72, borderRadius: 10 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'ready' && (
          <>
            {filtered.length === 0 ? (
              <div className="emptyState">
                <div className="emptyTitle">No products found</div>
                <div className="muted">Try a different search term.</div>
              </div>
            ) : (
              <div className="grid" aria-label="Product grid">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
