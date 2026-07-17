import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { submitContact } from '../services/contacts';

export default function ContactPage({ onConsultationClick, addToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast?.({
        title: 'Missing Info',
        message: 'Please fill in name, email, and message.',
        type: 'warning',
      });
      return;
    }

    setIsSending(true);
    try {
      await submitContact(formData);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      addToast?.({
        title: 'Message Sent',
        message: 'Thanks for reaching out — we will get back to you soon.',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Send Failed',
        message: 'Could not submit your message. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="remedies-hero-meta">
            <Link to="/" className="remedies-back">
              <ArrowLeft size={15} strokeWidth={2.25} />
              <span>Back to Home</span>
            </Link>
            <span className="remedies-meta-dot" aria-hidden="true" />
            <div className="remedies-hero-badge">
              <MessageSquare size={13} strokeWidth={2.25} />
              <span>We’re here to help</span>
            </div>
          </div>
          <h1>Contact Us</h1>
          <p>
            Reach the MEDI DROP clinic team for orders, consultations, or general questions.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-layout">
          <aside className="glass contact-info-panel">
            <h2>Clinic details</h2>
            <p className="contact-info-lead">
              Placeholder details — replace with your real clinic address and hours before launch.
            </p>

            <ul className="contact-info-list">
              <li>
                <span className="contact-info-icon"><Mail size={16} /></span>
                <div>
                  <strong>Email</strong>
                  <a href="mailto:hello@medidrop.net">hello@medidrop.net</a>
                </div>
              </li>
              <li>
                <span className="contact-info-icon"><Phone size={16} /></span>
                <div>
                  <strong>Phone</strong>
                  <a href="tel:+919000000000">+91 90000 00000</a>
                </div>
              </li>
              <li>
                <span className="contact-info-icon"><MapPin size={16} /></span>
                <div>
                  <strong>Address</strong>
                  <span>Clinic address placeholder, City, State — 000000</span>
                </div>
              </li>
              <li>
                <span className="contact-info-icon"><Clock size={16} /></span>
                <div>
                  <strong>Hours</strong>
                  <span>Mon–Sat · 10:00 AM – 8:00 PM</span>
                </div>
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-secondary contact-consult-btn"
              onClick={onConsultationClick}
            >
              Book Consultation
            </button>
          </aside>

          <form className="glass contact-form" onSubmit={handleSubmit}>
            <h2>Send a message</h2>
            <p className="contact-form-lead">Your message is saved securely and reviewed by our clinic team.</p>

            <div className="contact-form-grid">
              <div className="contact-field">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="name@domain.com"
                  required
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-phone">Phone</label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="10 digit number"
                  maxLength={10}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="Order / Consult / General"
                />
              </div>
              <div className="contact-field contact-field-full">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="contact-input contact-textarea"
                  placeholder="How can we help you?"
                  rows={5}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary contact-submit" disabled={isSending}>
              {isSending ? (
                <>
                  <span className="spinner contact-spinner" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
