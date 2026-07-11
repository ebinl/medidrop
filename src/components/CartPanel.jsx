import React, { useState, useEffect } from 'react';
import { X, Trash2, Mail, MapPin, Phone, User, ShoppingBag, ArrowRight, Edit3, Save, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartPanel({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, onClearCart, addToast }) {
  const [isClosing, setIsClosing] = useState(false);
  const [step, setStep] = useState(1); // 1: Review, 2: Details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [editableTexts, setEditableTexts] = useState({
    title: 'Your Shopping Cart',
    emptyMessage: 'Your cart is empty',
    detailsHeading: 'Enter Patient & Delivery Details',
    continueButton: 'Continue to Checkout',
    confirmButton: 'Confirm & Email'
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cartPanelText');
      if (saved) {
        setEditableTexts(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (err) {
      // ignore localStorage errors
    }
  }, []);

  const saveEditableTexts = () => {
    try {
      localStorage.setItem('cartPanelText', JSON.stringify(editableTexts));
      setEditMode(false);
      addToast({ title: 'Saved', message: 'Cart text saved locally.', type: 'success' });
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to save cart text.', type: 'error' });
    }
  };

  const resetEditableTexts = () => {
    const defaults = {
      title: 'Your Shopping Cart',
      emptyMessage: 'Your cart is empty',
      detailsHeading: 'Enter Patient & Delivery Details',
      continueButton: 'Continue to Checkout',
      confirmButton: 'Confirm & Email'
    }
    setEditableTexts(defaults);
    try { localStorage.removeItem('cartPanelText'); } catch {
      // ignore
    }
    addToast({ title: 'Reset', message: 'Default cart text restored.', type: 'info' });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const getDeliveryCharge = () => {
    const sub = getSubtotal();
    return sub > 1000 ? 0 : 60; // Free delivery above 1000 INR
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryCharge();
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your full name.";
    if (!formData.email.trim() || !formData.email.includes('@')) return "Please enter a valid email address.";
    if (!formData.phone.trim() || formData.phone.length < 10) return "Please enter a valid 10-digit phone number.";
    if (!formData.address.trim() || formData.address.length < 10) return "Please enter a detailed shipping address.";
    return null;
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      addToast({
        title: "Validation Error",
        message: errorMsg,
        type: "error"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate sending email through SMTP or processing order
    setTimeout(() => {
      // 1. Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      // 2. Draft Mailto URL parameters
      const subject = encodeURIComponent(`MEDI DROP.net - Homeopathy Medicine Order Confirmation`);
      
      const medicineDetailsText = cartItems.map(item => 
        `- ${item.name} (${item.scientificName}) \n  Qty: ${item.quantity} units (Min req: ${item.minQuantity}) | Price: ₹${item.price} | Subtotal: ₹${item.price * item.quantity}`
      ).join('\n\n');

      const bodyText = `Dear ${formData.name},\n\nThank you for choosing MEDI DROP.net! Your homeopathic order details are listed below.\n\n===========================================\nORDER DETAILS\n===========================================\n\n${medicineDetailsText}\n\n-------------------------------------------\nSubtotal: ₹${getSubtotal()}\nDelivery Charges: ₹${getDeliveryCharge() === 0 ? 'FREE' : '₹60'}\nTotal Amount payable: ₹${getTotal()}\n\n===========================================\nSHIPPING & CUSTOMER DETAILS\n===========================================\nPatient Name: ${formData.name}\nPersonal Email: ${formData.email}\nPhone Number: ${formData.phone}\nShipping Address:\n${formData.address}\n\n===========================================\n\nThis is a drafted order summary. We have loaded these details directly into your email client. Please send this email to confirm your dispatch. Our clinical pharmacy team will package and ship your medicine drops immediately!\n\nBest Regards,\nClinical Dispatch Team\nMEDI DROP.net Homeopathic Clinic`;

      const mailtoUrl = `mailto:${formData.email}?cc=orders@medidrop.net&subject=${subject}&body=${encodeURIComponent(bodyText)}`;

      // 3. Open mail client
      window.location.href = mailtoUrl;

      addToast({
        title: "Order Processed!",
        message: "Details loaded into your mail client. Please click send to finalize.",
        type: "success",
        duration: 5000
      });

      setIsSubmitting(false);
      onClearCart();
      setStep(1);
      setFormData({ name: '', email: '', phone: '', address: '' });
      handleClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={handleClose} />
      <div className={`cart-panel glass ${isClosing ? 'closing' : ''}`}>
        
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{editableTexts.title}</h3>
            <span className="badge badge-primary">{cartItems.length}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleClose} className="modal-close-btn">
              <X size={22} />
            </button>
            <button
              type="button"
              onClick={() => setEditMode(prev => !prev)}
              className="modal-close-btn"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {editMode ? <RotateCw size={18} /> : <Edit3 size={18} />}
            </button>
          </div>
          {editMode && (
            <div style={{ padding: '1rem', borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  value={editableTexts.title}
                  onChange={e => setEditableTexts(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Cart title"
                  className="form-control"
                  style={{ height: '2.5rem' }}
                />
                <input
                  value={editableTexts.emptyMessage}
                  onChange={e => setEditableTexts(prev => ({ ...prev, emptyMessage: e.target.value }))}
                  placeholder="Empty cart message"
                  className="form-control"
                  style={{ height: '2.5rem' }}
                />
                <input
                  value={editableTexts.detailsHeading}
                  onChange={e => setEditableTexts(prev => ({ ...prev, detailsHeading: e.target.value }))}
                  placeholder="Details heading"
                  className="form-control"
                  style={{ height: '2.5rem' }}
                />
                <input
                  value={editableTexts.continueButton}
                  onChange={e => setEditableTexts(prev => ({ ...prev, continueButton: e.target.value }))}
                  placeholder="Continue button text"
                  className="form-control"
                  style={{ height: '2.5rem' }}
                />
                <input
                  value={editableTexts.confirmButton}
                  onChange={e => setEditableTexts(prev => ({ ...prev, confirmButton: e.target.value }))}
                  placeholder="Confirm button text"
                  className="form-control"
                  style={{ height: '2.5rem', gridColumn: 'span 2' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={saveEditableTexts} className="btn btn-primary">
                  <Save size={14} /> Save
                </button>
                <button type="button" onClick={resetEditableTexts} className="btn btn-outline">
                  <RotateCw size={14} /> Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Steps Tab header */}
        {cartItems.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid var(--card-border)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <button 
              onClick={() => setStep(1)}
              style={{
                background: 'none',
                border: 'none',
                color: step === 1 ? 'var(--primary)' : 'var(--text-muted)',
                padding: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderBottom: step === 1 ? '2px solid var(--primary)' : 'none',
                cursor: 'pointer'
              }}
            >
              1. Review Remedies
            </button>
            <button 
              onClick={() => {
                if(cartItems.length > 0) setStep(2);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: step === 2 ? 'var(--primary)' : 'var(--text-muted)',
                padding: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderBottom: step === 2 ? '2px solid var(--primary)' : 'none',
                cursor: step === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              2. Checkout Details
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={48} className="cart-empty-icon" />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{editableTexts.emptyMessage}</p>
              <p style={{ fontSize: '0.8rem' }}>Add some homeopathic remedies from our catalog to get started.</p>
              <button onClick={handleClose} className="btn btn-outline" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                Browse Remedies
              </button>
            </div>
          ) : step === 1 ? (
            // REVIEW REMEDIES STEP
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <span style={{ fontSize: '1.25rem' }}>💧</span>
                </div>
                <div className="cart-item-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p className="cart-item-title">{item.name}</p>
                    <button 
                      onClick={() => onRemoveItem(item.id)} 
                      className="cart-item-remove"
                      title="Remove Item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <p className="cart-item-meta">{item.category}</p>
                  
                  <div className="cart-item-price-row">
                    <p className="cart-item-price">₹{item.price * item.quantity}</p>
                    
                    {/* Quantity Selector */}
                    <div>
                      <div className="quantity-controller">
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= item.minQuantity}
                          className="quantity-btn"
                          title={`Minimum quantity is ${item.minQuantity}`}
                        >
                          -
                        </button>
                        <span className="quantity-val">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      {item.quantity <= item.minQuantity && (
                        <p className="quantity-warning-msg">Min limit: {item.minQuantity}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // CUSTOMER DETAILS FORM STEP
            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1rem' }}>{editableTexts.detailsHeading}</h4>
              
              <div className="form-group">
                <label className="form-label"><User size={12} style={{ marginRight: '0.25rem' }} /> Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required
                  placeholder="John Doe" 
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label"><Mail size={12} style={{ marginRight: '0.25rem' }} /> Personal Email ID</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required
                  placeholder="yourname@domain.com" 
                  className="form-control"
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Your order receipt will be sent directly to this address.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label"><Phone size={12} style={{ marginRight: '0.25rem' }} /> Mobile Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required
                  maxLength={10}
                  placeholder="9876543210" 
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label"><MapPin size={12} style={{ marginRight: '0.25rem' }} /> Shipping Address</label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required
                  rows={3}
                  placeholder="Door No, Street Name, City, Pincode" 
                  className="form-control"
                  style={{ resize: 'none', fontFamily: 'var(--font-body)' }}
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer Summary & Action buttons */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Items Count:</span>
              <span className="cart-summary-value">{cartItems.reduce((acc, i) => acc + i.quantity, 0)} units</span>
            </div>
            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal:</span>
              <span className="cart-summary-value">₹{getSubtotal()}</span>
            </div>
            <div className="cart-summary-row">
              <span className="cart-summary-label">Delivery Fee:</span>
              <span className="cart-summary-value">
                {getDeliveryCharge() === 0 ? (
                  <span className="badge badge-primary" style={{ padding: '0.15rem 0.45rem', fontSize: '0.65rem' }}>FREE</span>
                ) : `₹${getDeliveryCharge()}`}
              </span>
            </div>
            <div className="cart-summary-row total">
              <span className="cart-summary-label">Total Amount:</span>
              <span className="cart-summary-value highlight">₹{getTotal()}</span>
            </div>

            {step === 1 ? (
              <button 
                onClick={() => setStep(2)} 
                className="btn btn-primary cart-action-btn"
              >
                <span>{editableTexts.continueButton}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => setStep(1)} 
                  disabled={isSubmitting}
                  className="btn btn-outline"
                  style={{ flexGrow: 1, padding: '0.85rem' }}
                >
                  Back
                </button>
                <button 
                  onClick={handleCheckoutSubmit}
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flexGrow: 2, padding: '0.85rem' }}
                >
                  {isSubmitting ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                      <span>Sending Order...</span>
                    </div>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span>{editableTexts.confirmButton}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}
