import React, { createContext, useContext, useMemo, useReducer } from 'react';

function calcTotals(items) {
  const quantity = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  return { quantity, subtotal };
}

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(i => i.id === product.id);

      const nextItems = existing
        ? state.items.map(i =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [
            ...state.items,
            {
              id: product.id,
              name: product.name,
              price: Number(product.price) || 0,
              imageUrl: product.imageUrl,
              quantity
            }
          ];

      return { ...state, items: nextItems };
    }
    case 'REMOVE_ITEM': {
      const id = action.payload.id;
      return { ...state, items: state.items.filter(i => i.id !== id) };
    }
    case 'SET_QTY': {
      const { id, quantity } = action.payload;
      const qty = Math.max(1, Number(quantity) || 1);
      return { ...state, items: state.items.map(i => (i.id === id ? { ...i, quantity: qty } : i)) };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Provides cart state and actions to the component tree. */
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const totals = useMemo(() => calcTotals(state.items), [state.items]);

  const value = useMemo(() => {
    return {
      items: state.items,
      totals,
      addItem: (product, quantity = 1) => dispatch({ type: 'ADD_ITEM', payload: { product, quantity } }),
      removeItem: id => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
      setQty: (id, quantity) => dispatch({ type: 'SET_QTY', payload: { id, quantity } }),
      clear: () => dispatch({ type: 'CLEAR' })
    };
  }, [state.items, totals]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Hook to access cart state/actions. Must be used within CartProvider. */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
