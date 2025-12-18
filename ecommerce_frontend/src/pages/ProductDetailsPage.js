import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, isApiConfigured } from '../api/client';
import { useCart } from '../state/CartContext';
import { SkeletonBlock } from '../components/Skeleton';

// PUBLIC_INTERFACE
export default function ProductDetailsPage() {
  /** Product details page with add-to-cart. */
  const { productId } = useParams();
  const { addItem } = useCart();

  const [status, setStatus] = useState('loading');
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setStatus('loading');
        const data = await getProduct(productId);
        if (!mounted) return;
        setProduct(data);
        setStatus('ready');
      } catch (e) {
        if (!mounted) return;
        setStatus('error');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const price = useMemo(() => (product ? Number(product.price) || 0 : 0), [product]);

  return (
    <div className="page">
      <div className="container section">
        <div className="breadcrumbs">
          <Link to="/" className="link">
            Products
          </Link>
          <span className="crumbSep" aria-hidden="true">
            /
          </span>
          <span className="muted">Details</span>
        </div>

        {status === 'error' && (
          <div className="callout error">
            Product not found. {!isApiConfigured() && <>Mock catalog may have changed.</>}
          </div>
        )}

        {status === 'loading' && (
          <div className="details">
            <SkeletonBlock className="detailsMedia" />
            <div className="detailsBody">
              <SkeletonBlock style={{ height: 26, width: '70%' }} />
              <SkeletonBlock style={{ height: 14, width: '40%', marginTop: 10 }} />
              <SkeletonBlock style={{ height: 14, width: '90%', marginTop: 18 }} />
              <SkeletonBlock style={{ height: 14, width: '86%', marginTop: 10 }} />
              <div className="detailsActions">
                <SkeletonBlock style={{ height: 42, width: 120, borderRadius: 12 }} />
                <SkeletonBlock style={{ height: 42, width: 160, borderRadius: 12 }} />
              </div>
            </div>
          </div>
        )}

        {status === 'ready' && product && (
          <div className="details">
            <div className="detailsMediaWrap">
              <img className="detailsMedia" src={product.imageUrl} alt={product.name} />
            </div>
            <div className="detailsBody">
              <h1 className="h2">{product.name}</h1>
              <div className="muted">{product.category}</div>
              <div className="detailsPrice">${price.toFixed(2)}</div>
              <p className="detailsDesc">{product.description}</p>

              <div className="detailsActions">
                <div className="qtyPicker" aria-label="Quantity">
                  <button
                    className="btn btnGhost"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    className="qtyInput"
                    value={qty}
                    onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))}
                    inputMode="numeric"
                    aria-label="Quantity input"
                  />
                  <button
                    className="btn btnGhost"
                    onClick={() => setQty(q => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btnPrimary"
                  onClick={() => addItem(product, qty)}
                >
                  Add to cart
                </button>

                <Link to="/cart" className="btn btnSecondary">
                  Go to cart
                </Link>
              </div>

              <div className="note">
                Tip: Set <code>REACT_APP_API_BASE</code> to connect this UI to your backend.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
