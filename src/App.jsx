import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartPanel from './components/CartPanel';
import ConsultationModal from './components/ConsultationModal';
import ToastNotification from './components/ToastNotification';
import HomePage from './pages/HomePage';
import RemediesPage from './pages/RemediesPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddToCart = (medicine, qty) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === medicine.id);
      if (existing) {
        const updatedQty = existing.quantity + qty;
        addToast({
          title: 'Cart Updated',
          message: `Added another ${qty} units. Total is now ${updatedQty} units.`,
          type: 'success',
        });
        return prev.map((item) =>
          item.id === medicine.id ? { ...item, quantity: updatedQty } : item
        );
      }
      addToast({
        title: 'Added to Cart',
        message: `${medicine.name} added with minimum requirement of ${qty} units.`,
        type: 'success',
      });
      return [...prev, { ...medicine, quantity: qty }];
    });
  };

  const handleUpdateCartQty = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (newQty < item.minQuantity) {
            addToast({
              title: 'Limit Enforced',
              message: `Minimum order quantity for ${item.name} is ${item.minQuantity} units.`,
              type: 'warning',
            });
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (id) => {
    const item = cartItems.find((i) => i.id === id);
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      addToast({
        title: 'Removed',
        message: `${item.name} removed from your shopping cart.`,
        type: 'info',
      });
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const hideChrome = isAdminRoute || isAuthRoute;
  const isHome = location.pathname === '/';

  return (
    <div className={`app-container ${isAdminRoute ? 'app-admin' : ''} ${isAuthRoute ? 'app-auth' : ''} ${isHome ? 'app-home' : ''}`}>
      {!hideChrome && (
        <Navbar
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          onConsultationClick={() => setIsConsultationOpen(true)}
          addToast={addToast}
        />
      )}

      <main className={`content-wrapper ${isAdminRoute || isAuthRoute ? 'content-wrapper-admin' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onConsultationClick={() => setIsConsultationOpen(true)}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route path="/remedies" element={<RemediesPage onAddToCart={handleAddToCart} />} />
          <Route
            path="/contact"
            element={
              <ContactPage
                onConsultationClick={() => setIsConsultationOpen(true)}
                addToast={addToast}
              />
            }
          />
          <Route path="/login" element={<AuthPage addToast={addToast} mode="login" />} />
          <Route path="/signup" element={<AuthPage addToast={addToast} mode="signup" />} />
          <Route path="/admin" element={<AdminPage addToast={addToast} />} />
        </Routes>
      </main>

      {!hideChrome && (
        <>
          <Footer onConsultationClick={() => setIsConsultationOpen(true)} />

          <CartPanel
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            addToast={addToast}
          />

          <ConsultationModal
            isOpen={isConsultationOpen}
            onClose={() => setIsConsultationOpen(false)}
            addToast={addToast}
          />
        </>
      )}

      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
