import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  Copy,
  RefreshCw,
  Smartphone,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Stethoscope,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitConsultation } from '../services/consultations';
import { notifyDoctorConsultation } from '../services/consultationEmail';

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

const CLINIC_PHONE = '9746758698';
const CLINIC_PHONE_DISPLAY = '+91 97467 58698';

function createWhatsAppConsultationUrl(booking) {
  const lines = [
    '🩺 *New Doctor Consultation Booking - MediDrop*',
    '',
    `👤 *Patient:* ${booking.name || 'N/A'}`,
    `📞 *Phone:* ${booking.phone || 'N/A'}`,
    `✉️ *Email:* ${booking.email || 'N/A'}`,
    `📅 *Date:* ${booking.date || 'N/A'}`,
    `⏰ *Time Slot:* ${booking.time || 'N/A'}`,
    `💬 *Symptoms:* ${booking.symptoms || 'General Consultation'}`,
    '',
    `💳 *Payment:* ₹99 Paid via UPI`,
    `🔢 *UPI Txn ID (last 4 digits):* ${booking.upiLast4 || booking.upiRefNo || 'Paid'}`,
    `🆔 *Booking Ref:* ${booking.readableId || booking.id || 'Confirmed'}`,
    '',
    'Please confirm my appointment slot. Thank you!',
  ];
  return `https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function ConsultationModal({ isOpen, onClose, addToast }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    symptoms: '',
    date: '',
    time: ''
  });

  const [upiRefNo, setUpiRefNo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const UPI_ID = 'ancyshaji1996@oksbi';

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

  const handlePaymentSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const trimmedLast4 = upiRefNo.trim();
    if (!trimmedLast4 || trimmedLast4.length !== 4) {
      addToast({
        title: "Last 4 Digits Required",
        message: "Please enter the last 4 digits of your UPI transaction ID / UTR.",
        type: "warning"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        ...formData,
        paymentMethod: 'upi',
        upiRefNo: trimmedLast4,
        upiLast4: trimmedLast4,
      };

      const result = await submitConsultation(payload);
      const bookingRecord = {
        ...payload,
        id: result?.id || result?.readableId || `CONS-${Date.now().toString().slice(-6)}`,
        readableId: result?.readableId || result?.id || `CONS-${Date.now().toString().slice(-6)}`,
      };

      setConfirmedBooking(bookingRecord);

      // Auto-open WhatsApp with prefilled message to the clinic helpline (9746758698)
      const waUrl = createWhatsAppConsultationUrl(bookingRecord);
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch (waErr) {
        console.warn('Could not auto-open WhatsApp link:', waErr);
      }

      // Background notify doctor via email without blocking the booking flow
      notifyDoctorConsultation(payload).catch((emailErr) => {
        console.warn('Doctor email notification non-critical notice:', emailErr);
      });

      setIsProcessing(false);
      setStep(3);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      addToast({
        title: 'Booking Successful!',
        message: `Your ₹99 payment is saved. Booking alert prepared for clinic desk (${CLINIC_PHONE_DISPLAY}).`,
        type: 'success',
      });
    } catch (err) {
      console.error('Booking submission error:', err);
      setIsProcessing(false);
      addToast({
        title: "Booking Failed",
        message: "Could not save your consultation. Please try again.",
        type: "error"
      });
    }
  };

  const resetModal = () => {
    setStep(1);
    setFormData({ name: '', email: '', phone: '', symptoms: '', date: '', time: '' });
    setUpiRefNo('');
    setConfirmedBooking(null);
    setIsProcessing(false);
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
              <Stethoscope size={20} strokeWidth={2.25} />
            </div>
            <div className="consult-header-text">
              <h3>Online Doctor Consultation</h3>
              <p>Book an online consultation with a senior practitioner</p>
            </div>
          </div>
          <div className="consult-header-actions">
            <span className="consult-fee-badge">₹99</span>
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
                <span className="consult-submit-fee">₹99</span>
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="consult-payment">
              <div className="consult-upi-banner">
                <div className="consult-upi-badge">
                  <Smartphone size={15} />
                  <span>Scan to Pay via UPI</span>
                </div>
                <span className="consult-upi-fee-tag">₹99 Consultation Fee</span>
              </div>

              <div className="consult-upi">
                <div className="consult-qr">
                  <img
                    src="/upi-payment-qr.png"
                    alt="Google Pay UPI QR Code - Scan to Pay ₹99"
                    className="consult-qr-img"
                  />
                  <div className="consult-qr-caption">
                    <span className="consult-qr-scan-hint">Scan with any UPI App to Pay ₹99</span>
                  </div>
                </div>

                <div className="consult-upi-id">
                  <div className="consult-upi-id-left">
                    <span className="consult-upi-label">UPI ID:</span>
                    <strong className="consult-upi-value">{UPI_ID}</strong>
                  </div>
                  <button type="button" onClick={copyUpiId} className="consult-copy-btn" title="Copy UPI ID">
                    {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                    {copiedUpi ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="consult-field consult-field-last4">
                  <label className="consult-label" htmlFor="consult-upi-ref">
                    Last 4 Digits of UPI Transaction ID / UTR
                  </label>
                  <input
                    id="consult-upi-ref"
                    type="text"
                    inputMode="numeric"
                    value={upiRefNo}
                    onChange={(e) => setUpiRefNo(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="e.g. 4251"
                    maxLength={4}
                    className="consult-input consult-input-center consult-input-last4"
                    required
                  />
                  <span className="consult-last4-hint">
                    Complete the ₹99 payment on your UPI app and enter the last 4 digits of your transaction ID / UTR
                  </span>
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
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="consult-success">
              <div className="consult-success-icon">
                <Check size={28} strokeWidth={3} />
              </div>
              <h3>Consultation Confirmed!</h3>
              <p className="consult-room-id">
                Booking Reference: <strong>{confirmedBooking?.readableId || confirmedBooking?.id || 'CONS-CONFIRMED'}</strong>
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
                  <span>Payment (UPI)</span>
                  <strong>₹99 · Txn ID: {confirmedBooking?.upiLast4 || upiRefNo}</strong>
                </div>
              </div>

              {/* Clinic Helpline WhatsApp & Call Action Card */}
              <div className="consult-helpline-card">
                <div className="consult-helpline-header">
                  <div className="consult-helpline-badge-icon">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h4 className="consult-helpline-title">Alert Clinic Helpline</h4>
                    <span className="consult-helpline-phone">{CLINIC_PHONE_DISPLAY}</span>
                  </div>
                </div>
                <p className="consult-helpline-desc">
                  Your consultation details and UPI transaction ID (<strong>{confirmedBooking?.upiLast4 || upiRefNo}</strong>) are formatted and ready to send to our clinic desk.
                </p>
                <div className="consult-helpline-btns">
                  <a
                    href={createWhatsAppConsultationUrl(confirmedBooking || { ...formData, upiLast4: upiRefNo })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn consult-whatsapp-btn"
                  >
                    <MessageSquare size={16} />
                    <span>Send via WhatsApp ({CLINIC_PHONE_DISPLAY})</span>
                    <ExternalLink size={13} />
                  </a>
                  <a
                    href={`tel:${CLINIC_PHONE}`}
                    className="btn btn-outline consult-call-action-btn"
                  >
                    <Phone size={15} />
                    <span>Call Helpline</span>
                  </a>
                </div>
              </div>

              <p className="consult-success-note">
                Our clinic team will confirm your appointment slot and contact you for your online consultation.
              </p>

              <button type="button" onClick={resetModal} className="btn btn-primary consult-submit">
                Done / Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
