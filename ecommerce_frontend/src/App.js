import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './state/CartContext';

// PUBLIC_INTERFACE
function App() {
  /** Root application component wiring up routing, layout, and app-level providers. */
  useEffect(() => {
    // Light theme by default (requested). We keep the attribute for compatibility with existing template.
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="AppShell">
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main className="mainContent" role="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:productId" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
