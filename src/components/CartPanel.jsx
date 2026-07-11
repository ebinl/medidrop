import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Mail, MapPin, Phone, User, ShoppingBag, ArrowRight, Package, Truck, Pill } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartPanel({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, onClearCart, addToast }) {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setStep(1);
      onClose();
    }, 300);
  };

  const getSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getDeliveryCharge = () => (getSubtotal() > 1000 ? 0 : 60);

  const getTotal = () => getSubtotal() + getDeliveryCharge();

  const itemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address.';
    if (!formData.phone.trim() || formData.phone.length < 10) return 'Please enter a valid 10-digit phone number.';
    if (!formData.address.trim() || formData.address.length < 10) return 'Please enter a detailed shipping address.';
    return null;
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      addToast({ title: 'Validation Error', message: errorMsg, type: 'error' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      const subject = encodeURIComponent('MEDI DROP.net - Homeopathy Medicine Order Confirmation');

      const medicineDetailsText = cartItems.map(item =>
        `- ${item.name} (${item.scientificName}) \n  Qty: ${item.quantity} units (Min req: ${item.minQuantity}) | Price: ₹${item.price} | Subtotal: ₹${item.price * item.quantity}`
      ).join('\n\n');

      const bodyText = `Dear ${formData.name},\n\nThank you for choosing MEDI DROP.net! Your homeopathic order details are listed below.\n\n===========================================\nORDER DETAILS\n===========================================\n\n${medicineDetailsText}\n\n-------------------------------------------\nSubtotal: ₹${getSubtotal()}\nDelivery Charges: ₹${getDeliveryCharge() === 0 ? 'FREE' : '₹60'}\nTotal Amount payable: ₹${getTotal()}\n\n===========================================\nSHIPPING & CUSTOMER DETAILS\n===========================================\nPatient Name: ${formData.name}\nPersonal Email: ${formData.email}\nPhone Number: ${formData.phone}\nShipping Address:\n${formData.address}\n\n===========================================\n\nThis is a drafted order summary. We have loaded these details directly into your email client. Please send this email to confirm your dispatch. Our clinical pharmacy team will package and ship your medicine drops immediately!\n\nBest Regards,\nClinical Dispatch Team\nMEDI DROP.net Homeopathic Clinic`;

      const mailtoUrl = `mailto:${formData.email}?cc=orders@medidrop.net&subject=${subject}&body=${encodeURIComponent(bodyText)}`;
      window.location.href = mailtoUrl;

      addToast({
        title: 'Order Processed!',
        message: 'Details loaded into your mail client. Please click send to finalize.',
        type: 'success',
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
      <aside className={`cart-panel glass ${isClosing ? 'closing' : ''}`} aria-label="Shopping cart">
        <header className="cart-header">
          <div className="cart-header-main">
            <div className="cart-header-icon">
              <ShoppingBag size={18} strokeWidth={2.25} />
            </div>
            <div className="cart-header-text">
              <h3>Your Cart</h3>
              <p>
                {cartItems.length === 0
                  ? 'No items yet'
                  : `${itemCount} unit${itemCount === 1 ? '' : 's'} · ${cartItems.length} remed${cartItems.length === 1 ? 'y' : 'ies'}`}
              </p>
            </div>
          </div>
          <button type="button" onClick={handleClose} className="cart-close-btn" aria-label="Close cart">
            <X size={20} />
          </button>
        </header>

        {cartItems.length > 0 && (
          <nav className="cart-steps" aria-label="Checkout steps">
            <button
              type="button"
              className={`cart-step ${step === 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}
              onClick={() => setStep(1)}
            >
              <span className="cart-step-num">1</span>
              <span className="cart-step-label">Review</span>
            </button>
            <div className={`cart-step-line ${step > 1 ? 'done' : ''}`} />
            <button
              type="button"
              className={`cart-step ${step === 2 ? 'active' : ''}`}
              onClick={() => setStep(2)}
            >
              <span className="cart-step-num">2</span>
              <span className="cart-step-label">Details</span>
            </button>
          </nav>
        )}

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-visual">
                <Package size={28} />
              </div>
              <h4>Your cart is empty</h4>
              <p>Browse our homeopathic remedies and add a few to get started.</p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  navigate('/remedies');
                }}
                className="btn btn-primary cart-empty-btn"
              >
                Browse Remedies
              </button>
            </div>
          ) : step === 1 ? (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <article key={item.id} className="cart-item">
                  <div className="cart-item-img" aria-hidden="true">
                    <Pill size={18} />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <div className="cart-item-titles">
                        <p className="cart-item-title">{item.name}</p>
                        <p className="cart-item-meta">{item.category}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="cart-item-remove"
                        title="Remove item"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="cart-item-price-row">
                      <div className="cart-item-pricing">
                        <span className="cart-item-unit">₹{item.price} each</span>
                        <p className="cart-item-price">₹{item.price * item.quantity}</p>
                      </div>

                      <div className="cart-item-qty-wrap">
                        <div className="quantity-controller">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            disabled={item.quantity <= item.minQuantity}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="quantity-val">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        {item.quantity <= item.minQuantity && (
                          <p className="quantity-warning-msg">Min {item.minQuantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <form id="cart-checkout-form" className="cart-checkout-form" onSubmit={handleCheckoutSubmit}>
              <div className="cart-form-intro">
                <h4>Delivery details</h4>
                <p>We’ll use this to confirm and ship your order.</p>
              </div>

              <div className="cart-field">
                <label className="cart-label" htmlFor="cart-name">
                  <User size={13} /> Full Name
                </label>
                <input
                  id="cart-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Patient full name"
                  className="cart-input"
                  autoComplete="name"
                />
              </div>

              <div className="cart-field">
                <label className="cart-label" htmlFor="cart-email">
                  <Mail size={13} /> Email
                </label>
                <input
                  id="cart-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="name@domain.com"
                  className="cart-input"
                  autoComplete="email"
                />
                <span className="cart-field-hint">Order receipt goes to this address.</span>
              </div>

              <div className="cart-field">
                <label className="cart-label" htmlFor="cart-phone">
                  <Phone size={13} /> Mobile Number
                </label>
                <input
                  id="cart-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                  placeholder="10 digit number"
                  className="cart-input"
                  autoComplete="tel"
                />
              </div>

              <div className="cart-field">
                <label className="cart-label" htmlFor="cart-address">
                  <MapPin size={13} /> Shipping Address
                </label>
                <textarea
                  id="cart-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Door no, street, city, pincode"
                  className="cart-input cart-textarea"
                />
              </div>
            </form>
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="cart-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>₹{getSubtotal()}</strong>
              </div>
              <div className="cart-summary-row">
                <span className="cart-delivery-label">
                  <Truck size={13} /> Delivery
                </span>
                <strong>
                  {getDeliveryCharge() === 0 ? (
                    <span className="cart-free-badge">FREE</span>
                  ) : (
                    `₹${getDeliveryCharge()}`
                  )}
                </strong>
              </div>
              {getDeliveryCharge() > 0 && (
                <p className="cart-free-hint">Free delivery above ₹1000</p>
              )}
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <strong>₹{getTotal()}</strong>
              </div>
            </div>

            {step === 1 ? (
              <button type="button" onClick={() => setStep(2)} className="btn btn-primary cart-action-btn">
                Continue to Checkout
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="cart-footer-actions">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="btn btn-outline"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="cart-checkout-form"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner cart-spinner" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Confirm & Email
                    </>
                  )}
                </button>
              </div>
            )}
          </footer>
        )}
      </aside>
    </>
  );
}
