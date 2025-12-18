import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../state/CartContext';

// PUBLIC_INTERFACE
export default function Header() {
  /** Top navigation header with brand and primary routes. */
  const { totals } = useCart();

  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Link to="/" className="brand" aria-label="Go to home">
          <span className="brandMark" aria-hidden="true" />
          <span className="brandText">Kavia Commerce</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          <NavLink to="/" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`} end>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>
            Cart
            <span className="cartBadge" aria-label={`${totals.quantity} items in cart`}>
              {totals.quantity}
            </span>
          </NavLink>
          <NavLink
            to="/checkout"
            className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}
          >
            Checkout
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
