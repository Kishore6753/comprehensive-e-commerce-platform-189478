import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../state/CartContext';

// PUBLIC_INTERFACE
export default function CheckoutPage() {
  /** Checkout page: basic form and confirmation; no real payment processing. */
  const { items, totals, clear } = useCart();

  const shipping = useMemo(() => (totals.subtotal > 0 ? 6.95 : 0), [totals.subtotal]);
  const total = useMemo(() => totals.subtotal + shipping, [totals.subtotal, shipping]);

  const [status, setStatus] = useState('form'); // form | submitted
  const [form, setForm] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postal: ''
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    // In a real app we'd call backend createOrder + payment.
    setStatus('submitted');
    clear();
  }

  if (status === 'submitted') {
    return (
      <div className="page">
        <div className="container section">
          <div className="successCard card">
            <div className="successIcon" aria-hidden="true" />
            <h1 className="h2">Order placed</h1>
            <p className="muted">
              This is a demo confirmation screen. Hook this up to your backend order API when ready.
            </p>
            <Link to="/" className="btn btnPrimary">
              Back to products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container section">
        <div className="pageHeader">
          <h1 className="h2">Checkout</h1>
          <Link to="/cart" className="btn btnGhost">
            Back to cart
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="emptyState">
            <div className="emptyTitle">Nothing to checkout</div>
            <div className="muted">Your cart is empty.</div>
            <Link to="/" className="btn btnPrimary" style={{ marginTop: 16 }}>
              Browse products
            </Link>
          </div>
        ) : (
          <div className="checkoutLayout">
            <form className="card form" onSubmit={onSubmit} aria-label="Checkout form">
              <div className="formTitle">Shipping details</div>

              <div className="field">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  className="input"
                  value={form.name}
                  onChange={onChange}
                  required
                  placeholder="Alex Johnson"
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  className="input"
                  value={form.address}
                  onChange={onChange}
                  required
                  placeholder="123 Main St"
                />
              </div>

              <div className="fieldRow">
                <div className="field">
                  <label className="label" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    className="input"
                    value={form.city}
                    onChange={onChange}
                    required
                    placeholder="Springfield"
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="postal">
                    Postal code
                  </label>
                  <input
                    id="postal"
                    name="postal"
                    className="input"
                    value={form.postal}
                    onChange={onChange}
                    required
                    placeholder="12345"
                  />
                </div>
              </div>

              <button className="btn btnPrimary btnFull" type="submit">
                Place order
              </button>

              <div className="note">
                No payment is processed. This flow is intentionally minimal for the UI skeleton.
              </div>
            </form>

            <aside className="summary card" aria-label="Checkout summary">
              <div className="summaryTitle">Summary</div>
              <div className="summaryRow">
                <span className="muted">Items</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="summaryRow">
                <span className="muted">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summaryDivider" />
              <div className="summaryRow total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="summaryMiniList" aria-label="Items summary">
                {items.map(it => (
                  <div key={it.id} className="summaryMiniRow">
                    <span className="muted">
                      {it.quantity}× {it.name}
                    </span>
                    <span>${(it.quantity * it.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
