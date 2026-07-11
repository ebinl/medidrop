import React, { useState } from 'react';
import { X, Video, Calendar, ShieldCheck, CreditCard, Send, Check, Copy, RefreshCw, Smartphone, Edit3, Save, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConsultationModal({ isOpen, onClose, addToast }) {
  const [step, setStep] = useState(1); // 1: Consultation Details, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    symptoms: '',
    date: '',
    time: ''
  });

  // Card Payment States
  const [cardData, setCardData] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [cvvFocused, setCvvFocused] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [editableTexts, setEditableTexts] = useState({
    title: 'Doctor Video Consultation',
    subtitle: 'Instant consultation fee: ₹200',
    step1Heading: '1. Patient Info & Appointment details',
    step1Submit: 'Proceed to Payment (₹200)',
    step2Heading: '2. Secure Payment Gateway (Pay ₹200)',
    upiTab: 'UPI Payment',
    cardTab: 'Card Payment',
    successTitle: 'Consultation Confirmed!',
    successFeeText: 'Consultation Fee:',
    closeButton: 'Close Window'
  });

  // UPI Payment States
  const [upiRefNo, setUpiRefNo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const UPI_ID = 'ancyshaji1996@oksbi';

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'number') {
      // Format 16 digits into groups of 4
      value = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    } else if (name === 'expiry') {
      // Format MM/YY
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

    // Simulate payment transaction verification
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
    <div className="modal-overlay" onClick={resetModal}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-title-icon">
              <Video size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{editableTexts.title}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{editableTexts.subtitle}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setEditMode(prev => !prev)}
              className="modal-close-btn"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {editMode ? <RotateCw size={18} /> : <Edit3 size={18} />}
            </button>
            <button onClick={resetModal} className="modal-close-btn">
              <X size={22} />
            </button>
          </div>
        </div>

        {editMode && (
          <div style={{ padding: '1rem 2rem 0', borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <input
                value={editableTexts.title}
                onChange={(e) => setEditableTexts(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Modal title"
                className="form-control"
                style={{ height: '2.5rem' }}
              />
              <input
                value={editableTexts.subtitle}
                onChange={(e) => setEditableTexts(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Subtitle"
                className="form-control"
                style={{ height: '2.5rem' }}
              />
              <input
                value={editableTexts.step1Heading}
                onChange={(e) => setEditableTexts(prev => ({ ...prev, step1Heading: e.target.value }))}
                placeholder="Step 1 heading"
                className="form-control"
                style={{ height: '2.5rem' }}
              />
              <input
                value={editableTexts.step1Submit}
                onChange={(e) => setEditableTexts(prev => ({ ...prev, step1Submit: e.target.value }))}
                placeholder="Step 1 button"
                className="form-control"
                style={{ height: '2.5rem' }}
              />
              <input
                value={editableTexts.step2Heading}
                onChange={(e) => setEditableTexts(prev => ({ ...prev, step2Heading: e.target.value }))}
                placeholder="Step 2 heading"
                className="form-control"
                style={{ height: '2.5rem' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                <button type="button" onClick={() => setEditMode(false)} className="btn btn-outline">
                  <Save size={14} /> Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="modal-body">
          {step === 1 && (
            // STEP 1: CONSULTATION DETAILS FORM
            <form onSubmit={handleNextStep}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                {editableTexts.step1Heading}
              </h4>

              <div className="form-group">
                <label className="form-label">Patient Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required
                  placeholder="Enter full name" 
                  className="form-control"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Email ID</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required
                    placeholder="name@domain.com" 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required
                    placeholder="10 digit number" 
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Describe Health Issue / Symptoms</label>
                <textarea 
                  name="symptoms" 
                  value={formData.symptoms} 
                  onChange={handleInputChange} 
                  required
                  rows={2}
                  placeholder="E.g., Chronic joint stiffness, seasonal flu, stomach cramps..." 
                  className="form-control"
                  style={{ resize: 'none', fontFamily: 'var(--font-body)' }}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time Slot</label>
                  <select 
                    name="time" 
                    value={formData.time} 
                    onChange={handleInputChange} 
                    required
                    className="form-control"
                  >
                    <option value="">Select a Slot</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM</option>
                    <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
              >
                <span>{editableTexts.step1Submit}</span>
              </button>
            </form>
          )}

          {step === 2 && (
            // STEP 2: ₹200 PAYMENT SIMULATION
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                {editableTexts.step2Heading}
              </h4>

              {/* Payment selector tabs */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    background: paymentMethod === 'upi' ? 'var(--primary-tint)' : 'transparent',
                    border: `1px solid ${paymentMethod === 'upi' ? 'var(--primary)' : 'var(--card-border)'}`,
                    borderRadius: '12px',
                    padding: '0.75rem',
                    color: paymentMethod === 'upi' ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Smartphone size={16} />
                  <span>{editableTexts.upiTab}</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    background: paymentMethod === 'card' ? 'var(--primary-tint)' : 'transparent',
                    border: `1px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'var(--card-border)'}`,
                    borderRadius: '12px',
                    padding: '0.75rem',
                    color: paymentMethod === 'card' ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <CreditCard size={16} />
                  <span>{editableTexts.cardTab}</span>
                </button>
              </div>

              {/* UPI INTERFACE */}
              {paymentMethod === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                  
                  {/* Clean SVG QR Code */}
                  <div style={{
                    background: '#ffffff',
                    padding: '1rem',
                    borderRadius: '14px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '180px'
                  }}>
                    <svg viewBox="0 0 100 100" width="140" height="140" style={{ fill: '#0a0f0d' }}>
                      {/* Fake QR code patterns */}
                      <rect x="0" y="0" width="25" height="25" />
                      <rect x="3" y="3" width="19" height="19" fill="#fff" />
                      <rect x="7" y="7" width="11" height="11" />
                      
                      <rect x="75" y="0" width="25" height="25" />
                      <rect x="78" y="3" width="19" height="19" fill="#fff" />
                      <rect x="82" y="7" width="11" height="11" />
                      
                      <rect x="0" y="75" width="25" height="25" />
                      <rect x="3" y="78" width="19" height="19" fill="#fff" />
                      <rect x="7" y="82" width="11" height="11" />

                      {/* Random noise matrix elements */}
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
                      {/* Logo drop dot in center */}
                      <rect x="42" y="42" width="16" height="16" fill="var(--primary)" rx="4" />
                    </svg>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                      SCAN TO PAY ₹200
                    </span>
                  </div>

                  {/* UPI Copy Details */}
                  <div className="glass" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    width: '100%',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>UPI ID: <strong>{UPI_ID}</strong></span>
                    <button 
                      onClick={copyUpiId}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 600
                      }}
                    >
                      {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Manual reference verification input */}
                  <div style={{ width: '100%' }}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Enter 12-digit UPI Ref/UTR Number</label>
                      <input
                        type="text"
                        value={upiRefNo}
                        onChange={(e) => setUpiRefNo(e.target.value.replace(/\D/g, '').substring(0, 12))}
                        placeholder="E.g., 620581940251"
                        maxLength={12}
                        className="form-control"
                        style={{ textAlign: 'center', letterSpacing: '0.15em', fontWeight: 600 }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setStep(1)} 
                        disabled={isProcessing}
                        className="btn btn-outline" 
                        style={{ flexGrow: 1 }}
                      >
                        Back
                      </button>
                      <button 
                        onClick={handlePaymentSubmit} 
                        disabled={isProcessing}
                        className="btn btn-primary" 
                        style={{ flexGrow: 2 }}
                      >
                        {isProcessing ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RefreshCw size={14} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Verifying UPI...</span>
                          </div>
                        ) : (
                          <>
                            <ShieldCheck size={16} />
                            <span>Verify & Book Session</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* CARD INTERFACE */}
              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Live Glassmorphic Credit Card Preview */}
                  <div style={{
                    perspective: '1000px',
                    width: '100%',
                    height: '170px',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.6s',
                      transformStyle: 'preserve-3d',
                      transform: cvvFocused ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}>
                      
                      {/* CARD FRONT */}
                      <div className="glass" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(20,30,26,0.85) 100%)',
                        borderColor: 'rgba(16, 185, 129, 0.45)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                        overflow: 'hidden'
                      }}>
                        {/* Shimmer element */}
                        <div style={{
                          position: 'absolute',
                          top: 0, left: '-50%', width: '200%', height: '100%',
                          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)',
                          transform: 'skewX(-25deg)',
                          pointerEvents: 'none'
                        }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 800, color: 'var(--primary)' }}>
                            MEDI DROP CONSULTATION CARD
                          </span>
                          <span style={{ fontSize: '1.15rem' }}>💳</span>
                        </div>

                        <div>
                          {/* Card Number display */}
                          <div style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            marginBottom: '1rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}>
                            {cardData.number || '•••• •••• •••• ••••'}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Card Holder</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {cardData.holder.toUpperCase() || 'PATIENT NAME'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expires</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                                {cardData.expiry || 'MM/YY'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div className="glass" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: '16px',
                        transform: 'rotateY(180deg)',
                        padding: '1.25rem 0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(135deg, rgba(20,30,26,0.95) 0%, rgba(10, 15, 12, 0.95) 100%)',
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                      }}>
                        {/* Magnetic Strip */}
                        <div style={{ width: '100%', height: '35px', background: '#000000', marginTop: '5px' }} />
                        
                        <div style={{ padding: '0 1.25rem' }}>
                          {/* Signature strip & CVV */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.45rem', color: 'var(--text-muted)', marginRight: '0.5rem', textTransform: 'uppercase' }}>Authorized CVV</span>
                            <div style={{
                              background: '#ffffff',
                              width: '50px',
                              height: '26px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#1e293b',
                              fontWeight: 700,
                              fontStyle: 'italic',
                              fontFamily: 'monospace',
                              letterSpacing: '0.1em'
                            }}>
                              {cardData.cvv || '•••'}
                            </div>
                          </div>
                        </div>

                        <div style={{ padding: '0 1.25rem', fontSize: '0.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                          This virtual consultation card is processed via MEDI DROP.net secure SSL.
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Form */}
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input 
                        type="text"
                        name="holder"
                        value={cardData.holder}
                        onChange={handleCardChange}
                        onFocus={() => setCvvFocused(false)}
                        required
                        placeholder="John Doe"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input 
                        type="text"
                        name="number"
                        value={cardData.number}
                        onChange={handleCardChange}
                        onFocus={() => setCvvFocused(false)}
                        required
                        placeholder="4111 2222 3333 4444"
                        className="form-control"
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Expiration Date</label>
                        <input 
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          onFocus={() => setCvvFocused(false)}
                          required
                          placeholder="MM/YY"
                          className="form-control"
                          style={{ textAlign: 'center' }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Security Code (CVV)</label>
                        <input 
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          onFocus={() => setCvvFocused(true)}
                          onBlur={() => setCvvFocused(false)}
                          required
                          placeholder="•••"
                          className="form-control"
                          style={{ textAlign: 'center' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button 
                        type="button"
                        onClick={() => setStep(1)} 
                        disabled={isProcessing}
                        className="btn btn-outline" 
                        style={{ flexGrow: 1 }}
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        disabled={isProcessing}
                        className="btn btn-primary" 
                        style={{ flexGrow: 2 }}
                      >
                        {isProcessing ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RefreshCw size={14} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Processing Card...</span>
                          </div>
                        ) : (
                          <>
                            <CreditCard size={16} />
                            <span>Pay ₹200 & Schedule</span>
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
            // STEP 3: BOOKING SUCCESS
              <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '1.5rem 0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-tint)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '1.5rem',
                boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                animation: 'pulseGlow 2s infinite'
              }}>
                <Check size={32} strokeWidth={3} />
              </div>

              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {editableTexts.successTitle}
              </h3>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Room ID: medidrop-{Math.floor(100000 + Math.random() * 900000)}
              </p>

              <div className="glass" style={{
                width: '100%',
                padding: '1.25rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Patient Name:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{formData.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email ID:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{formData.email}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Time Slot:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{formData.date} at {formData.time}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '0.65rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{editableTexts.successFeeText}</span>
                  <strong style={{ color: 'var(--primary)' }}>₹200 (Paid Verified)</strong>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '380px' }}>
                An appointment invitation with the video consult link has been drafted to your personal email <strong>{formData.email}</strong>. Please join 5 mins before schedule.
              </p>

              <button onClick={resetModal} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                {editableTexts.closeButton}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
