import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MedicineGrid from './components/MedicineGrid';
import CartPanel from './components/CartPanel';
import ConsultationModal from './components/ConsultationModal';
import ToastNotification from './components/ToastNotification';
import { Pill, Activity, ShieldCheck, HeartPulse, Clock, Sparkles } from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Item to Cart
  const handleAddToCart = (medicine, qty) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        // Enforce update
        const updatedQty = existing.quantity + qty;
        addToast({
          title: "Cart Updated",
          message: `Added another ${qty} units. Total is now ${updatedQty} units.`,
          type: "success"
        });
        return prev.map(item => 
          item.id === medicine.id ? { ...item, quantity: updatedQty } : item
        );
      } else {
        // Add new
        addToast({
          title: "Added to Cart",
          message: `${medicine.name} added with minimum requirement of ${qty} units.`,
          type: "success"
        });
        return [...prev, { ...medicine, quantity: qty }];
      }
    });
  };

  // Update Cart Quantities (Respecting Minimum limits)
  const handleUpdateCartQty = (id, newQty) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          if (newQty < item.minQuantity) {
            addToast({
              title: "Limit Enforced",
              message: `Minimum order quantity for ${item.name} is ${item.minQuantity} units.`,
              type: "warning"
            });
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (id) => {
    const item = cartItems.find(i => i.id === id);
    setCartItems(prev => prev.filter(i => i.id !== id));
    if (item) {
      addToast({
        title: "Removed",
        message: `${item.name} removed from your shopping cart.`,
        type: "info"
      });
    }
  };

  // Clear Cart after successful checkout
  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="app-container">
      {/* Navbar Component */}
      <Navbar 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        onConsultationClick={() => setIsConsultationOpen(true)}
      />

      <div className="content-wrapper">
        {/* Hero Section */}
        <Hero onConsultationClick={() => setIsConsultationOpen(true)} />

        {/* Brand Value Grid (Why Choose Us) */}
        <section id="features" style={{
          padding: '4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          borderTop: '1px solid var(--card-border)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Advanced Clinical Care
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              Why Choose MEDI DROP?
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div className="glass-interactive" style={{ padding: '2rem', borderRadius: '18px' }}>
              <Activity size={32} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Pure Potencies</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Our dilutions are sourced from organically harvested botanicals and minerals, prepared using classical Hahnemannian guidelines.
              </p>
            </div>

            <div className="glass-interactive" style={{ padding: '2rem', borderRadius: '18px' }}>
              <HeartPulse size={32} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Zero Side Effects</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Safe for all age groups, including infants, pregnant women, and elderly. Boosts natural self-healing mechanisms gently.
              </p>
            </div>

            <div className="glass-interactive" style={{ padding: '2rem', borderRadius: '18px' }}>
              <Clock size={32} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Express Delivery</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                All homeopathic packs are custom boxed under strict hygiene, shipped with climate control to maintain molecular integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Main Medicines Catalog Grid */}
        <MedicineGrid onAddToCart={handleAddToCart} />

        {/* Video Consultation CTA Panel Banner */}
        <section style={{
          padding: '2rem',
          maxWidth: '1000px',
          margin: '2rem auto 5rem',
          position: 'relative'
        }}>
          <div className="glass" style={{
            padding: '3rem 2rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(251, 191, 36, 0.05) 100%)',
            borderColor: 'rgba(16, 185, 129, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(16, 185, 129, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Need a Customized Treatment Plan?
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
              Consult live with our senior homeopathy practitioners online. Discuss symptoms and receive a personalized medicine dilution prescription dispatched immediately.
            </p>
            <button 
              onClick={() => setIsConsultationOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.8rem', animation: 'pulseGlow 2.5s infinite' }}
            >
              <span>Book Appointment for ₹200</span>
            </button>
          </div>
        </section>
      </div>

      {/* Footer Area */}
      <footer className="glass" style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        marginTop: 'auto'
      }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
          <span>MEDI DROP</span>
          <span style={{ color: 'var(--primary)' }}>●</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Secure Homeopathic Dispensary</span>
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          &copy; {new Date().getFullYear()} MEDI DROP. All rights reserved. Registered medical practitioner supervision.
        </p>
      </footer>

      {/* Floating Cart Sidebar Panel */}
      <CartPanel 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        addToast={addToast}
      />

      {/* Doctor Consultation modal */}
      <ConsultationModal 
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        addToast={addToast}
      />

      {/* Floating Notifications Toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastNotification 
            key={toast.id} 
            toast={toast} 
            onClose={removeToast} 
          />
        ))}
      </div>
    </div>
  );
}
