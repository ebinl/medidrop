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
  Zap,
  ArrowRight,
  QrCode,
  Maximize2,
  ZoomIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitConsultation } from '../services/consultations';
import { notifyDoctorConsultation, buildDoctorGmailMailtoUrl } from '../services/consultationEmail';
import { CLINIC_PHONE, CLINIC_PHONE_DISPLAY, DOCTOR_NOTIFY_EMAIL } from '../config/clinic';

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

const UPI_ID = 'ancyshaji1996@oksbi';
const PAYEE_NAME = 'Dr Ancy Shaji';
const CONSULTATION_AMOUNT = '99';
const TRANSACTION_NOTE = 'MediDrop Doctor Consultation Fee';

// Standard UPI Deep Links for direct app launching
const BASE_UPI_URI = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${CONSULTATION_AMOUNT}&cu=INR&tn=${encodeURIComponent(TRANSACTION_NOTE)}`;

const UPI_APPS = [
  {
    id: 'gpay',
    name: 'Google Pay',
    shortName: 'GPay',
    color: '#00864B',
    bg: '#E6F4EA',
    border: '#A8DAB5',
    url: `gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${CONSULTATION_AMOUNT}&cu=INR&tn=${encodeURIComponent(TRANSACTION_NOTE)}`,
    fallback: BASE_UPI_URI,
    badge: 'Fastest'
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    shortName: 'PhonePe',
    color: '#5f259f',
    bg: '#F3EBF9',
    border: '#D8BCEE',
    url: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${CONSULTATION_AMOUNT}&cu=INR&tn=${encodeURIComponent(TRANSACTION_NOTE)}`,
    fallback: BASE_UPI_URI,
    badge: 'Popular'
  },
  {
    id: 'paytm',
    name: 'Paytm UPI',
    shortName: 'Paytm',
    color: '#002E6E',
    bg: '#E5F4FC',
    border: '#99D6F5',
    url: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${CONSULTATION_AMOUNT}&cu=INR&tn=${encodeURIComponent(TRANSACTION_NOTE)}`,
    fallback: BASE_UPI_URI,
    badge: 'Instant'
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    shortName: 'Amazon Pay',
    color: '#E47911',
    bg: '#FEF3E8',
    border: '#FBD2A7',
    url: `amazonpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${CONSULTATION_AMOUNT}&cu=INR&tn=${encodeURIComponent(TRANSACTION_NOTE)}`,
    fallback: BASE_UPI_URI,
    badge: 'UPI'
  },
  {
    id: 'any_upi',
    name: 'BHIM / Any UPI App',
    shortName: 'Any UPI',
    color: '#D97706',
    bg: '#FEF8E7',
    border: '#FDE68A',
    url: BASE_UPI_URI,
    fallback: BASE_UPI_URI,
    badge: 'All Apps'
  }
];

function createWhatsAppConsultationUrl(booking) {
  const lines = [
    '🩺 *New Doctor Consultation Booking - MediDrop*',
    '============================================',
    `👤 *Patient Name:* ${booking.name || 'N/A'}`,
    `📞 *Phone:* ${booking.phone || 'N/A'}`,
    `✉️ *Email:* ${booking.email || 'N/A'}`,
    `📅 *Date:* ${booking.date || 'N/A'}`,
    `⏰ *Time Slot:* ${booking.time || 'N/A'}`,
    `💬 *Symptoms:* ${booking.symptoms || 'General Consultation'}`,
    '',
    `💳 *Payment:* ₹99 Paid via UPI`,
    `📍 *Receiver UPI:* ${UPI_ID}`,
    `🔢 *UPI Txn ID / UTR (last 4 digits):* ${booking.upiLast4 || booking.upiRefNo || 'Paid'}`,
    `🆔 *Booking Ref ID:* ${booking.readableId || booking.id || 'Confirmed'}`,
    '============================================',
    'Please confirm my appointment slot. Thank you Dr. Ancy!',
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
  const [launchedApp, setLaunchedApp] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    addToast({
      title: "Copied!",
      message: `Receiver UPI ID: ${UPI_ID}`,
      type: "success"
    });
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleLaunchUpiApp = (app) => {
    setLaunchedApp(app.name);
    addToast({
      title: `Redirecting to ${app.name}`,
      message: `Complete ₹99 payment to ${UPI_ID}, then return here to enter the last 4 digits UTR.`,
      type: "info"
    });

    try {
      window.location.href = app.url;
      setTimeout(() => {
        try {
          window.location.href = app.fallback;
        } catch {
          // ignore
        }
      }, 500);
    } catch {
      window.location.href = app.fallback;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return "Please enter your full name.";
    if (!formData.email.trim() || !formData.email.includes('@')) return "Please enter a valid email address.";
    if (!formData.phone.trim() || formData.phone.length < 10) return "Please enter a valid 10-digit phone number.";
    if (!formData.symptoms.trim()) return "Please specify your health symptoms or concern.";
    if (!formData.date) return "Please choose a preferred consultation date.";
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
        title: "Mandatory UTR Required",
        message: "Please enter the last 4 digits of your UPI transaction ID / UTR to confirm booking.",
        type: "warning"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        ...formData,
        paymentMethod: 'upi',
        receiverUpi: UPI_ID,
        upiRefNo: trimmedLast4,
        upiLast4: trimmedLast4,
      };

      // 1. Save booking (Firestore + local storage persistence)
      const result = await submitConsultation(payload);
      const bookingRecord = {
        ...payload,
        id: result?.id || result?.readableId || `CONS-${Date.now().toString().slice(-6)}`,
        readableId: result?.readableId || result?.id || `CONS-${Date.now().toString().slice(-6)}`,
      };

      setConfirmedBooking(bookingRecord);

      // 2. Send booking notification to doctor Gmail medidrop.co.in@gmail.com
      notifyDoctorConsultation(payload).then((res) => {
        if (res.sent) {
          console.log(`[MediDrop] Booking details sent to ${DOCTOR_NOTIFY_EMAIL}`);
        }
      }).catch((emailErr) => {
        console.warn('Doctor email notification non-critical notice:', emailErr);
      });

      // 3. Auto-open WhatsApp with prefilled message to Dr. Ancy helpline (9746758698)
      const waUrl = createWhatsAppConsultationUrl(bookingRecord);
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch (waErr) {
        console.warn('Could not auto-open WhatsApp link:', waErr);
      }

      setIsProcessing(false);
      setStep(3);

      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      addToast({
        title: 'Booking Confirmed!',
        message: `₹99 payment verified (UTR: ${trimmedLast4}). Details sent to ${DOCTOR_NOTIFY_EMAIL}.`,
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
    setLaunchedApp(null);
    setShowQrModal(false);
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
              <p>1-on-1 Private Consultation with Dr. Ancy Shaji (BHMS)</p>
            </div>
          </div>
          <div className="consult-header-actions">
            <span className="consult-fee-badge">₹99 Fee</span>
            <button type="button" onClick={resetModal} className="modal-close-btn consult-close" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Progress Navigation */}
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
          {/* STEP 1: PATIENT & APPOINTMENT DETAILS */}
          {step === 1 && (
            <form className="consult-form" onSubmit={handleNextStep}>
              <div className="consult-form-grid">
                <div className="consult-field consult-field-full">
                  <label className="consult-label" htmlFor="consult-name">
                    <User size={13} /> Patient Full Name *
                  </label>
                  <input
                    id="consult-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter patient's full name"
                    className="consult-input"
                    autoComplete="name"
                  />
                </div>

                <div className="consult-field">
                  <label className="consult-label" htmlFor="consult-email">
                    <Mail size={13} /> Email Address *
                  </label>
                  <input
                    id="consult-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@gmail.com"
                    className="consult-input"
                    autoComplete="email"
                  />
                </div>

                <div className="consult-field">
                  <label className="consult-label" htmlFor="consult-phone">
                    <Phone size={13} /> Phone Number (WhatsApp) *
                  </label>
                  <input
                    id="consult-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="10 digit mobile number"
                    className="consult-input"
                    autoComplete="tel"
                    maxLength={10}
                  />
                </div>

                <div className="consult-field consult-field-full">
                  <label className="consult-label" htmlFor="consult-symptoms">
                    <Stethoscope size={13} /> Symptoms / Reason for Consultation *
                  </label>
                  <textarea
                    id="consult-symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    placeholder="E.g., Chronic acidity, migraine headaches, PCOD, knee joint pain..."
                    className="consult-input consult-textarea"
                  />
                </div>

                <div className="consult-field">
                  <label className="consult-label" htmlFor="consult-date">
                    <Calendar size={13} /> Preferred Date *
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
                    <Clock size={13} /> Preferred Time Slot *
                  </label>
                  <select
                    id="consult-time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="consult-input consult-select"
                  >
                    <option value="">Select an Appointment Slot</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary consult-submit">
                <span>Continue to ₹99 UPI Payment</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* STEP 2: UPI PAYMENT & MANDATORY UTR */}
          {step === 2 && (
            <div className="consult-payment">
              {/* Top Banner */}
              <div className="consult-upi-banner">
                <div className="consult-upi-badge">
                  <Smartphone size={16} />
                  <span>Quick UPI Payment</span>
                </div>
                <span className="consult-upi-fee-tag">Amount: ₹99</span>
              </div>

              {/* 1-Tap UPI Apps Grid */}
              <div className="consult-upi-apps-container">
                <span className="consult-upi-section-title">
                  <Zap size={13} />
                  <span>Tap to Pay with your preferred UPI App:</span>
                </span>

                <div className="consult-upi-apps-grid">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleLaunchUpiApp(app)}
                      className="consult-upi-app-btn"
                      style={{
                        '--app-color': app.color,
                        '--app-bg': app.bg,
                        '--app-border': app.border
                      }}
                      title={`Open ${app.name} to pay ₹99`}
                    >
                      <div className="consult-upi-app-icon">
                        {app.id === 'gpay' && (
                          <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                        )}
                        {app.id === 'phonepe' && (
                          <span style={{ color: '#5f259f', fontWeight: 900, fontSize: '0.95rem' }}>Pe</span>
                        )}
                        {app.id === 'paytm' && (
                          <span style={{ color: '#002E6E', fontWeight: 900, fontSize: '0.85rem' }}>Paytm</span>
                        )}
                        {app.id === 'amazonpay' && (
                          <span style={{ color: '#E47911', fontWeight: 900, fontSize: '0.85rem' }}>aPay</span>
                        )}
                        {app.id === 'any_upi' && (
                          <span style={{ color: '#D97706', fontWeight: 900, fontSize: '0.85rem' }}>UPI</span>
                        )}
                      </div>
                      <span className="consult-upi-app-name">{app.name}</span>
                      <span className="consult-upi-app-badge">{app.badge}</span>
                    </button>
                  ))}
                </div>

                {launchedApp && (
                  <div className="consult-upi-launch-alert">
                    <Check size={14} className="consult-launch-check" />
                    <span>
                      Opened <strong>{launchedApp}</strong>. Complete ₹99 to <code>{UPI_ID}</code> and enter the 4-digit UTR below.
                    </span>
                  </div>
                )}
              </div>

              {/* QR Code Banner Button (Click to Open Large Zoom-in Modal) */}
              <div className="consult-qr-trigger-row">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="consult-qr-zoom-btn"
                  title="Click to zoom in and view large QR code to scan"
                >
                  <div className="consult-qr-zoom-left">
                    <div className="consult-qr-icon-bubble">
                      <QrCode size={22} className="consult-qr-code-icon" />
                    </div>
                    <div className="consult-qr-zoom-info">
                      <div className="consult-qr-zoom-title">
                        <span>Click to View Large QR Code</span>
                        <span className="consult-qr-zoom-pill">Zoom In 🔍</span>
                      </div>
                      <span className="consult-qr-zoom-desc">Scan with any phone camera or banking app to pay ₹99</span>
                    </div>
                  </div>
                  <div className="consult-qr-zoom-action">
                    <Maximize2 size={16} />
                  </div>
                </button>
              </div>

              {/* Copyable UPI ID Box */}
              <div className="consult-upi-id-compact-row">
                <div className="consult-upi-id-left">
                  <span className="consult-upi-label">UPI ID:</span>
                  <strong className="consult-upi-value">{UPI_ID}</strong>
                </div>
                <button type="button" onClick={copyUpiId} className="consult-copy-btn" title="Copy UPI ID">
                  {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                </button>
              </div>

              {/* Mandatory UTR / Last 4 Digits Input */}
              <div className="consult-field-last4-box">
                <label className="consult-last4-main-label" htmlFor="consult-upi-ref">
                  <span className="consult-mandatory-tag">MANDATORY STEP</span>
                  <span>Enter Last 4 Digits of UPI Transaction ID / UTR</span>
                </label>

                <div className="consult-last4-input-row">
                  <input
                    id="consult-upi-ref"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={upiRefNo}
                    onChange={(e) => setUpiRefNo(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="e.g. 4251"
                    maxLength={4}
                    className="consult-input consult-input-last4-prominent"
                    required
                  />
                  <div className="consult-last4-status">
                    {upiRefNo.length === 4 ? (
                      <span className="consult-status-valid">
                        <Check size={14} /> Ready
                      </span>
                    ) : (
                      <span className="consult-status-waiting">
                        {upiRefNo.length}/4 digits
                      </span>
                    )}
                  </div>
                </div>

                <p className="consult-last4-instruction">
                  After paying ₹99 on GPay, PhonePe, Paytm, Amazon Pay or QR code, enter the <strong>last 4 digits of the UTR / Ref number</strong> from your receipt to confirm booking.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="consult-actions">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="btn btn-outline consult-back-btn"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing || upiRefNo.trim().length !== 4}
                  className={`btn btn-primary consult-confirm-btn ${upiRefNo.trim().length !== 4 ? 'disabled-btn' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={15} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Confirming Booking...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: BOOKING CONFIRMATION & NOTIFICATION */}
          {step === 3 && (
            <div className="consult-success">
              <div className="consult-success-icon">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3>Doctor Consultation Confirmed!</h3>
              <p className="consult-room-id">
                Booking Ref ID: <strong>{confirmedBooking?.readableId || confirmedBooking?.id || 'CONS-CONFIRMED'}</strong>
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
                  <span>Slot Scheduled</span>
                  <strong>{formData.date} · {formData.time}</strong>
                </div>
                <div className="consult-summary-fee">
                  <span>Payment (₹99 via UPI)</span>
                  <strong>UTR / Last 4: {confirmedBooking?.upiLast4 || upiRefNo}</strong>
                </div>
              </div>

              {/* Notifications Dispatched Badge */}
              <div className="consult-email-dispatched-box">
                <Mail size={16} className="consult-email-icon" />
                <div>
                  <strong>Booking Notification Dispatched</strong>
                  <p>Details sent to Dr. Ancy Shaji at <code>{DOCTOR_NOTIFY_EMAIL}</code> and clinic WhatsApp desk.</p>
                </div>
              </div>

              {/* Action Cards */}
              <div className="consult-helpline-card">
                <div className="consult-helpline-header">
                  <div className="consult-helpline-badge-icon">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h4 className="consult-helpline-title">Instant Clinic Helpline Alert</h4>
                    <span className="consult-helpline-phone">{CLINIC_PHONE_DISPLAY}</span>
                  </div>
                </div>
                <p className="consult-helpline-desc">
                  Your appointment details & UPI payment proof (UTR: <strong>{confirmedBooking?.upiLast4 || upiRefNo}</strong>) are pre-filled and ready to send directly to Dr. Ancy's desk.
                </p>
                <div className="consult-helpline-btns">
                  <a
                    href={createWhatsAppConsultationUrl(confirmedBooking || { ...formData, upiLast4: upiRefNo })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn consult-whatsapp-btn"
                  >
                    <MessageSquare size={16} />
                    <span>Send on WhatsApp ({CLINIC_PHONE_DISPLAY})</span>
                    <ExternalLink size={13} />
                  </a>
                  <a
                    href={buildDoctorGmailMailtoUrl(confirmedBooking || { ...formData, upiLast4: upiRefNo })}
                    className="btn btn-outline consult-email-action-btn"
                  >
                    <Mail size={15} />
                    <span>Email Clinic Desk</span>
                  </a>
                </div>
              </div>

              <p className="consult-success-note">
                Dr. Ancy Shaji's team will connect with you on WhatsApp / Google Meet at your scheduled appointment time.
              </p>

              <button type="button" onClick={resetModal} className="btn btn-primary consult-submit">
                Done / Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── LARGE ZOOM-IN QR CODE POPUP MODAL ─────────────────────────── */}
      {showQrModal && (
        <div className="consult-qr-popup-overlay" onClick={() => setShowQrModal(false)}>
          <div className="consult-qr-popup-card" onClick={e => e.stopPropagation()}>
            <div className="consult-qr-popup-header">
              <div className="consult-qr-popup-title-wrap">
                <div className="consult-qr-popup-badge">
                  <QrCode size={18} />
                  <span>Scan QR Code to Pay</span>
                </div>
                <span className="consult-qr-popup-fee">₹99 Consultation</span>
              </div>
              <button
                type="button"
                className="consult-qr-popup-close-btn"
                onClick={() => setShowQrModal(false)}
                aria-label="Close QR popup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Large Zoomed-in QR Code Display */}
            <div className="consult-qr-popup-body">
              <div className="consult-qr-large-frame">
                <img
                  src="/upi-payment-qr.png"
                  alt="Scan QR Code with Google Pay, PhonePe, Paytm, Amazon Pay or any UPI app to pay ₹99"
                  className="consult-qr-large-img"
                />
                <div className="consult-qr-large-brand-tag">
                  <span>Google Pay · PhonePe · Paytm · BHIM</span>
                </div>
              </div>

              {/* UPI ID Copy Row inside QR modal */}
              <div className="consult-qr-popup-upi-row">
                <div className="consult-qr-popup-upi-info">
                  <span className="consult-qr-popup-upi-lbl">Payee UPI ID:</span>
                  <strong className="consult-qr-popup-upi-val">{UPI_ID}</strong>
                  <span className="consult-qr-popup-payee-name">Dr. Ancy Shaji · State Bank of India</span>
                </div>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="consult-copy-btn consult-qr-popup-copy-btn"
                >
                  {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <p className="consult-qr-popup-instructions">
                📌 <strong>Step 1:</strong> Scan this large QR code using any UPI app and pay ₹99.<br />
                📌 <strong>Step 2:</strong> Tap the button below to close this view and enter your <strong>4-digit UTR</strong> to confirm your booking!
              </p>

              <button
                type="button"
                className="btn btn-primary consult-qr-popup-done-btn"
                onClick={() => setShowQrModal(false)}
              >
                <Check size={16} />
                <span>I Have Paid ₹99 — Enter UTR Number</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
