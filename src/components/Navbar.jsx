import React from 'react';
import { ShoppingCart, Video, Pill, ShieldAlert } from 'lucide-react';

export default function Navbar({ cartCount, onCartClick, onConsultationClick }) {
  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--card-border)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)'
    }}>
      {/* Brand Logo */}
      <a href="/" className="brand-logo-link">
        <div className="brand-logo-icon">
          <div className="bottle-neck" />
          <div className="bottle-body">
            <div className="bottle-fluid" />
            <div className="bottle-drop" />
          </div>
          <span className="brand-logo-ring" />
        </div>
        <div className="brand-logo-copy">
          <span className="brand-title">MEDI DROP<span className="brand-extension">.net</span></span>
          <span className="brand-tagline">Modernized Homeopathy, highlighted</span>
        </div>
      </a>

      {/* Navigation Options */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <a href="#medicines" style={{
          textDecoration: 'none',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: 500,
          transition: 'color 0.2s'
        }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Remedies
        </a>
        <a href="#features" style={{
          textDecoration: 'none',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: 500,
          transition: 'color 0.2s'
        }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
           onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
          Why Us
        </a>
        
        {/* consultation action */}
        <button 
          onClick={onConsultationClick}
          className="btn btn-outline"
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.85rem',
            borderRadius: '10px'
          }}
        >
          <Video size={16} />
          <span>Consult Doctor</span>
        </button>

        {/* Cart Trigger */}
        <button 
          onClick={onCartClick}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '0.6rem',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.background = 'var(--primary-tint)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--card-border)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="badge badge-primary" style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              width: '18px',
              height: '18px',
              fontSize: '0.7rem',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
