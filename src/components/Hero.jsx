import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, ShieldCheck, Stethoscope, Users } from 'lucide-react';

export default function Hero({ onConsultationClick }) {
  return (
    <section className="hero-section">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-banner">
        <div className="hero-banner-content">
          <div className="hero-badge glass">
            <ShieldCheck size={16} />
            <span>100% Certified Safe & Natural Solutions</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">Premium Homeopathic Remedies Delivered</span>
            <span className="hero-title-line hero-title-accent">Directly to Your Doorstep</span>
          </h1>

          <p className="hero-sub">
            Gentle, effective and holistic homeopathic care with personalized remedies prepared with precision. Consult online with certified specialists for just <strong>₹99</strong>.
          </p>

          <div className="hero-ctas">
            <Link to="/remedies" className="btn btn-primary hero-cta-btn">
              Browse Remedies
            </Link>
            <button
              type="button"
              onClick={onConsultationClick}
              className="btn btn-secondary hero-cta-btn hero-cta-pulse"
            >
              <Video size={20} />
              <span>Consult (₹99)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="glass-interactive hero-stat-card">
          <Users size={22} className="hero-stat-icon primary" />
          <span className="hero-stat-value">15,000+</span>
          <span className="hero-stat-label">Happy Active Patients</span>
        </div>
        <div className="glass-interactive hero-stat-card">
          <Calendar size={22} className="hero-stat-icon secondary" />
          <span className="hero-stat-value">24/7</span>
          <span className="hero-stat-label">Instant Consult Support</span>
        </div>
        <div className="glass-interactive hero-stat-card">
          <Stethoscope size={22} className="hero-stat-icon primary" />
          <span className="hero-stat-value">₹99</span>
          <span className="hero-stat-label">Online Doctor Consultation</span>
        </div>
      </div>
    </section>
  );
}
