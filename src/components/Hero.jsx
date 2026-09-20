import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Stethoscope, Users, Search, X, ArrowRight } from 'lucide-react';

export default function Hero({ onConsultationClick, onSearchClick }) {
  const [heroQuery, setHeroQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    onSearchClick?.(heroQuery.trim());
  };

  const handleChipClick = (queryTag) => {
    setHeroQuery(queryTag);
    onSearchClick?.(queryTag);
  };

  return (
    <section className="hero-section">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-banner">
        <div className="hero-banner-content">
          <div className="hero-badge glass">
            <ShieldCheck size={16} />
            <span>100% Certified Safe & Natural Solutions • Pan-India Delivery</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">Premium Homeopathic Remedies Delivered</span>
            <span className="hero-title-line hero-title-accent">Directly to Your Doorstep</span>
          </h1>

          <p className="hero-sub">
            Gentle, effective and holistic homeopathic care with personalized remedies prepared with precision. Consult online with certified senior specialists for just <strong>₹99</strong>.
          </p>

          {/* Interactive Hero Search Form */}
          <form className="hero-search-wrapper" onSubmit={handleSearchSubmit}>
            <div className="hero-search-bar glass-interactive">
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                className="hero-search-live-input"
                placeholder="Search symptoms (Acidity, PCOD, Migraine), remedies, doctor consult..."
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                  }
                }}
                aria-label="Search remedies and consultations"
              />
              {heroQuery && (
                <button
                  type="button"
                  className="hero-search-clear"
                  onClick={() => setHeroQuery('')}
                  title="Clear"
                >
                  <X size={16} />
                </button>
              )}
              <div className="hero-search-right">
                <button
                  type="submit"
                  className="hero-search-action-btn"
                  title="Search now"
                >
                  <span>Search</span>
                </button>
                <kbd className="hero-search-kbd" onClick={() => onSearchClick?.(heroQuery.trim())}>⌘K</kbd>
              </div>
            </div>

            {/* Instant Lookup Quick Buttons */}
            <div className="hero-quick-chips">
              <span className="hero-quick-label">Instant Lookups:</span>
              <button
                type="button"
                className="hero-quick-chip"
                onClick={() => handleChipClick('acidity')}
              >
                Acidity
              </button>
              <button
                type="button"
                className="hero-quick-chip"
                onClick={() => handleChipClick('pcod')}
              >
                PCOD
              </button>
              <button
                type="button"
                className="hero-quick-chip"
                onClick={() => handleChipClick('migraine')}
              >
                Migraine
              </button>
              <button
                type="button"
                className="hero-quick-chip"
                onClick={() => handleChipClick('consultation')}
              >
                Doctor ₹99
              </button>
              <button
                type="button"
                className="hero-quick-chip"
                onClick={() => handleChipClick('arthritis')}
              >
                Joint Pain
              </button>
              <button
                type="button"
                className="hero-quick-chip"
                onClick={() => handleChipClick('skin')}
              >
                Hair & Skin
              </button>
            </div>
          </form>

          <div className="hero-ctas">
            <Link to="/remedies" className="btn btn-primary hero-cta-btn">
              Browse Remedies
            </Link>
            <button
              type="button"
              onClick={onConsultationClick}
              className="btn btn-secondary hero-cta-btn hero-cta-pulse"
            >
              <Stethoscope size={20} />
              <span>Consult Doctor (₹99)</span>
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
