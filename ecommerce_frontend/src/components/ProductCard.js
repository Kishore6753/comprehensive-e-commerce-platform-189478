import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function ProductCard({ product }) {
  /** Small product summary card for product listing pages. */
  return (
    <article className="card productCard">
      <Link to={`/products/${encodeURIComponent(product.id)}`} className="productCardMedia">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="productImage"
        />
      </Link>
      <div className="productCardBody">
        <div className="productMeta">
          <div className="productName">{product.name}</div>
          <div className="productCategory">{product.category}</div>
        </div>
        <div className="productCardFooter">
          <div className="price">${Number(product.price).toFixed(2)}</div>
          <Link to={`/products/${encodeURIComponent(product.id)}`} className="btn btnPrimary">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
