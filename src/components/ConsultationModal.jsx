import React, { useState } from 'react';
import { X, Video, ShieldCheck, CreditCard, Check, Copy, RefreshCw, Smartphone, Calendar, Clock, User, Mail, Phone, Stethoscope } from 'lucide-react';
import confetti from 'canvas-confetti';

const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Done' },
];

const TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:30 AM - 12:30 PM',
  '02:00 PM - 03:00 PM',
  '04:30 PM - 05:30 PM',
  '07:00 PM - 08:00 PM',
];

export default function ConsultationModal({ isOpen, onClose, addToast }) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    symptoms: '',
    date: '',
    time: ''
  });

  const [cardData, setCardData] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [cvvFocused, setCvvFocused] = useState(false);
  const [upiRefNo, setUpiRefNo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const UPI_ID = 'ancyshaji1996@oksbi';

  const handleCardChange = (e) => {
    let { name, value } = e.target;

    if (name === 'number') {
      value = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    } else if (name === 'expiry') {
      value = value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim();
      if (value.endsWith('/')) value = value.slice(0, -1);
      value = value.substring(0, 5);
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }

    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    addToast({
      title: "Copied!",
      message: `UPI Address ${UPI_ID}`,
      type: "success"
    });
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return "Please enter your name.";
    if (!formData.email.trim() || !formData.email.includes('@')) return "Please enter a valid email address.";
    if (!formData.phone.trim() || formData.phone.length < 10) return "Please enter a valid phone number.";
    if (!formData.symptoms.trim()) return "Please specify your health symptoms.";
    if (!formData.date) return "Please choose a consultation date.";
    if (!formData.time) return "Please choose a preferred time slot.";
    return null;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const errorMsg = validateStep1();
    if (errorMsg) {
      addToast({
        title: "Missing Info",
        message: errorMsg,
        type: "warning"
      });
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'upi') {
      if (upiRefNo.length < 12) {
        addToast({
          title: "Invalid UPI Reference",
          message: "Please enter the 12-digit transaction ID or reference number.",
          type: "error"
        });
        return;
      }
    } else {
      if (!cardData.holder.trim()) return;
      if (cardData.number.replace(/\s/g, '').length < 16) {
        addToast({
          title: "Invalid Card Number",
          message: "Please enter a complete 16-digit card number.",
          type: "error"
        });
        return;
      }
      if (cardData.expiry.length < 5) {
        addToast({
          title: "Invalid Expiry",
          message: "Please specify card expiration month/year (MM/YY).",
          type: "error"
        });
        return;
      }
      if (cardData.cvv.length < 3) {
        addToast({
          title: "Invalid CVV",
          message: "Please enter your 3-digit security code (CVV).",
          type: "error"
        });
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      addToast({
        title: "Booking Successful",
        message: "Your ₹200 payment was confirmed and video session is scheduled.",
        type: "success"
      });
    }, 2500);
  };

  const resetModal = () => {
    setStep(1);
    setPaymentMethod('upi');
    setFormData({ name: '', email: '', phone: '', symptoms: '', date: '', time: '' });
    setCardData({ holder: '', number: '', expiry: '', cvv: '' });
    setUpiRefNo('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay consult-overlay" onClick={resetModal}>
      <div className="modal-content glass consult-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="consult-header">
          <div className="consult-header-main">
            <div className="consult-icon">
              <Video size={20} strokeWidth={2.25} />
            </div>
            <div className="consult-header-text">
              <h3>Doctor Video Consultation</h3>
              <p>Book a live session with a senior practitioner</p>
            </div>
          </div>
          <div className="consult-header-actions">
            <span className="consult-fee-badge">₹200</span>
            <button type="button" onClick={resetModal} className="modal-close-btn consult-close" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Progress */}
        <nav className="consult-steps" aria-label="Booking progress">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && <div className={`consult-step-line ${step > s.id - 1 ? 'done' : ''}`} />}
              <div className={`consult-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
                <span className="consult-step-num">
                  {step > s.id ? <Check size={12} strokeWidth={3} /> : s.id}
                </span>
                <span className="consult-step-label">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </nav>

        {/* Body */}
        <div className="modal-body consult-body">
          {step === 1 && (
            <form className="consult-form" onSubmit={handleNextStep}>
              <div className="consult-form-grid">
                <div className="consult-field consult-field-full">
                  <label className="consult-label" htmlFor="consult-name">
                    <User size={13} /> Patient Full Name
                  </label>
                  <input
                    id="consult-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                    className="consult-input"
                    autoComplete="name"
                  />
                </div>

                <div className="consult-field">
                  <label className="consult-label" htmlFor="consult-email">
                    <Mail size={13} /> Email ID
                  </label>
                  <input
                    id="consult-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@domain.com"
                    className="consult-input"
                    autoComplete="email"
                  />
                </div>

                <div className="consult-field">
                  <label className="consult-label" htmlFor="consult-phone">
                    <Phone size={13} /> Phone Number
                  </label>
                  <input
                    id="consult-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="10 digit number"
                    className="consult-input"
                    autoComplete="tel"
                    maxLength={10}
                  />
                </div>

                <div className="consult-field consult-field-full">
                  <label className="consult-label" htmlFor="consult-symptoms">
                    <Stethoscope size={13} /> Health Issue / Symptoms
                  </label>
                  <textarea
                    id="consult-symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    placeholder="E.g., Chronic joint stiffness, seasonal flu..."
                    className="consult-input consult-textarea"
                  />
                </div>

                <div className="consult-field">
                  <label className="consult-label" htmlFor="consult-date">
                    <Calendar size={13} /> Preferred Date
                  </label>
                  <input
                    id="consult-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="consult-input"
                  />
                </div>

                <div className="consult-field">
                  <label className="consult-label" htmlFor="consult-time">
                    <Clock size={13} /> Preferred Time Slot
                  </label>
                  <select
                    id="consult-time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="consult-input consult-select"
                  >
                    <option value="">Select a Slot</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary consult-submit">
                <span>Proceed to Payment</span>
                <span className="consult-submit-fee">₹200</span>
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="consult-payment">
              <div className="consult-pay-tabs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`consult-pay-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                >
                  <Smartphone size={15} />
                  UPI Payment
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`consult-pay-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                >
                  <CreditCard size={15} />
                  Card Payment
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className="consult-upi">
                  <div className="consult-qr">
                    <svg viewBox="0 0 100 100" width="112" height="112" style={{ fill: '#0a0f0d' }}>
                      <rect x="0" y="0" width="25" height="25" />
                      <rect x="3" y="3" width="19" height="19" fill="#fff" />
                      <rect x="7" y="7" width="11" height="11" />
                      <rect x="75" y="0" width="25" height="25" />
                      <rect x="78" y="3" width="19" height="19" fill="#fff" />
                      <rect x="82" y="7" width="11" height="11" />
                      <rect x="0" y="75" width="25" height="25" />
                      <rect x="3" y="78" width="19" height="19" fill="#fff" />
                      <rect x="7" y="82" width="11" height="11" />
                      <rect x="35" y="5" width="5" height="10" />
                      <rect x="45" y="0" width="10" height="5" />
                      <rect x="60" y="10" width="5" height="20" />
                      <rect x="30" y="25" width="15" height="5" />
                      <rect x="5" y="35" width="20" height="5" />
                      <rect x="15" y="45" width="5" height="15" />
                      <rect x="35" y="40" width="10" height="10" />
                      <rect x="50" y="35" width="25" height="5" />
                      <rect x="65" y="45" width="5" height="15" />
                      <rect x="80" y="35" width="10" height="25" />
                      <rect x="30" y="60" width="25" height="10" />
                      <rect x="40" y="80" width="15" height="5" />
                      <rect x="70" y="70" width="15" height="15" />
                      <rect x="60" y="80" width="5" height="10" />
                      <rect x="85" y="85" width="10" height="10" />
                      <rect x="35" y="90" width="20" height="5" />
                      <rect x="10" y="65" width="10" height="5" />
                      <rect x="42" y="42" width="16" height="16" fill="var(--primary)" rx="4" />
                    </svg>
                    <span>SCAN TO PAY ₹200</span>
                  </div>

                  <div className="consult-upi-id">
                    <span>UPI ID: <strong>{UPI_ID}</strong></span>
                    <button type="button" onClick={copyUpiId} className="consult-copy-btn">
                      {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                      {copiedUpi ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="consult-field">
                    <label className="consult-label" htmlFor="consult-upi-ref">
                      12-digit UPI Ref / UTR Number
                    </label>
                    <input
                      id="consult-upi-ref"
                      type="text"
                      value={upiRefNo}
                      onChange={(e) => setUpiRefNo(e.target.value.replace(/\D/g, '').substring(0, 12))}
                      placeholder="E.g., 620581940251"
                      maxLength={12}
                      className="consult-input consult-input-center"
                    />
                  </div>

                  <div className="consult-actions">
                    <button type="button" onClick={() => setStep(1)} disabled={isProcessing} className="btn btn-outline">
                      Back
                    </button>
                    <button type="button" onClick={handlePaymentSubmit} disabled={isProcessing} className="btn btn-primary">
                      {isProcessing ? (
                        <>
                          <RefreshCw size={14} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          Verify & Book
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="consult-card-pay">
                  <div className="consult-card-preview" style={{ perspective: '1000px' }}>
                    <div
                      className="consult-card-flip"
                      style={{ transform: cvvFocused ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                      <div className="consult-card-face consult-card-front">
                        <div className="consult-card-shimmer" />
                        <span className="consult-card-brand">MEDI DROP</span>
                        <div className="consult-card-number">
                          {cardData.number || '•••• •••• •••• ••••'}
                        </div>
                        <div className="consult-card-meta">
                          <div>
                            <span>Card Holder</span>
                            <strong>{cardData.holder.toUpperCase() || 'PATIENT NAME'}</strong>
                          </div>
                          <div>
                            <span>Expires</span>
                            <strong>{cardData.expiry || 'MM/YY'}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="consult-card-face consult-card-back">
                        <div className="consult-card-strip" />
                        <div className="consult-card-cvv-row">
                          <span>CVV</span>
                          <div className="consult-card-cvv">{cardData.cvv || '•••'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form className="consult-form" onSubmit={handlePaymentSubmit}>
                    <div className="consult-form-grid">
                      <div className="consult-field consult-field-full">
                        <label className="consult-label">Cardholder Name</label>
                        <input
                          type="text"
                          name="holder"
                          value={cardData.holder}
                          onChange={handleCardChange}
                          onFocus={() => setCvvFocused(false)}
                          required
                          placeholder="John Doe"
                          className="consult-input"
                        />
                      </div>
                      <div className="consult-field consult-field-full">
                        <label className="consult-label">Card Number</label>
                        <input
                          type="text"
                          name="number"
                          value={cardData.number}
                          onChange={handleCardChange}
                          onFocus={() => setCvvFocused(false)}
                          required
                          placeholder="4111 2222 3333 4444"
                          className="consult-input"
                        />
                      </div>
                      <div className="consult-field">
                        <label className="consult-label">Expiry</label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          onFocus={() => setCvvFocused(false)}
                          required
                          placeholder="MM/YY"
                          className="consult-input consult-input-center"
                        />
                      </div>
                      <div className="consult-field">
                        <label className="consult-label">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          onFocus={() => setCvvFocused(true)}
                          onBlur={() => setCvvFocused(false)}
                          required
                          placeholder="•••"
                          className="consult-input consult-input-center"
                        />
                      </div>
                    </div>

                    <div className="consult-actions">
                      <button type="button" onClick={() => setStep(1)} disabled={isProcessing} className="btn btn-outline">
                        Back
                      </button>
                      <button type="submit" disabled={isProcessing} className="btn btn-primary">
                        {isProcessing ? (
                          <>
                            <RefreshCw size={14} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard size={16} />
                            Pay ₹200
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="consult-success">
              <div className="consult-success-icon">
                <Check size={28} strokeWidth={3} />
              </div>
              <h3>Consultation Confirmed!</h3>
              <p className="consult-room-id">
                Room ID: medidrop-{Math.floor(100000 + Math.random() * 900000)}
              </p>

              <div className="consult-summary">
                <div>
                  <span>Patient</span>
                  <strong>{formData.name}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{formData.email}</strong>
                </div>
                <div>
                  <span>Slot</span>
                  <strong>{formData.date} · {formData.time}</strong>
                </div>
                <div className="consult-summary-fee">
                  <span>Consultation Fee</span>
                  <strong>₹200 Paid</strong>
                </div>
              </div>

              <p className="consult-success-note">
                A video consult link has been sent to <strong>{formData.email}</strong>. Join 5 minutes before your slot.
              </p>

              <button type="button" onClick={resetModal} className="btn btn-primary consult-submit">
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
