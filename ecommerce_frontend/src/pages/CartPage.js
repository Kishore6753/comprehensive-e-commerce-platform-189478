import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext';

// PUBLIC_INTERFACE
export default function CartPage() {
  /** Shopping cart page: edit quantities, remove items, proceed to checkout. */
  const { items, totals, removeItem, setQty, clear } = useCart();
  const navigate = useNavigate();

  const shipping = useMemo(() => (totals.subtotal > 0 ? 6.95 : 0), [totals.subtotal]);
  const total = useMemo(() => totals.subtotal + shipping, [totals.subtotal, shipping]);

  return (
    <div className="page">
      <div className="container section">
        <div className="pageHeader">
          <h1 className="h2">Your Cart</h1>
          {items.length > 0 && (
            <button className="btn btnGhost" onClick={clear}>
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="emptyState">
            <div className="emptyTitle">Cart is empty</div>
            <div className="muted">Start by adding some products.</div>
            <Link to="/" className="btn btnPrimary" style={{ marginTop: 16 }}>
              Browse products
            </Link>
          </div>
        ) : (
          <div className="cartLayout">
            <div className="cartItems" aria-label="Cart items">
              {items.map(it => (
                <div key={it.id} className="cartItem card">
                  <img className="cartItemImg" src={it.imageUrl} alt={it.name} />
                  <div className="cartItemBody">
                    <div className="cartItemTop">
                      <div>
                        <div className="cartItemName">{it.name}</div>
                        <div className="muted">${Number(it.price).toFixed(2)} each</div>
                      </div>
                      <button className="btn btnGhost" onClick={() => removeItem(it.id)}>
                        Remove
                      </button>
                    </div>

                    <div className="cartItemBottom">
                      <div className="qtyPicker">
                        <button
                          className="btn btnGhost"
                          onClick={() => setQty(it.id, it.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input
                          className="qtyInput"
                          value={it.quantity}
                          onChange={e => setQty(it.id, e.target.value)}
                          inputMode="numeric"
                          aria-label="Quantity input"
                        />
                        <button
                          className="btn btnGhost"
                          onClick={() => setQty(it.id, it.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="cartLineTotal">
                        ${(Number(it.price) * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="summary card" aria-label="Order summary">
              <div className="summaryTitle">Order Summary</div>
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

              <button className="btn btnPrimary btnFull" onClick={() => navigate('/checkout')}>
                Proceed to checkout
              </button>
              <Link to="/" className="btn btnSecondary btnFull">
                Continue shopping
              </Link>

              <div className="note" style={{ marginTop: 12 }}>
                Payment integration comes later—this is a UI skeleton.
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
