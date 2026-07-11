import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, ShieldCheck, Heart, Users } from 'lucide-react';

export default function Hero({ onConsultationClick }) {
  return (
    <section className="hero-section">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-badge glass">
        <ShieldCheck size={14} />
        <span>100% Certified Safe & Natural Solutions</span>
      </div>

      <h1 className="hero-title">
        Premium Homeopathy Remedies Delivered{' '}
        <br className="hero-br" />
        <span className="hero-title-accent">Directly to Your Doorstep</span>
      </h1>

      <p className="hero-sub">
        Get customized homeopathic remedies prepared with precision. Consult online with certified homeo-specialists instantly for just <strong>₹200</strong>.
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
          <Video size={18} />
          <span>Video Consult (₹200)</span>
        </button>
      </div>

      <div className="hero-stats">
        <div className="glass-interactive hero-stat-card">
          <Users size={28} className="hero-stat-icon primary" />
          <span className="hero-stat-value">15,000+</span>
          <span className="hero-stat-label">Happy Active Patients</span>
        </div>
        <div className="glass-interactive hero-stat-card">
          <Calendar size={28} className="hero-stat-icon secondary" />
          <span className="hero-stat-value">24/7</span>
          <span className="hero-stat-label">Instant Video Support</span>
        </div>
        <div className="glass-interactive hero-stat-card">
          <Heart size={28} className="hero-stat-icon primary" />
          <span className="hero-stat-value">10 Set</span>
          <span className="hero-stat-label">Curated Organic Packages</span>
        </div>
      </div>
    </section>
  );
}
