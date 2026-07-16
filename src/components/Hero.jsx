import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, ShieldCheck, Stethoscope, Users } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SPLINE_SCENE = 'https://prod.spline.design/RjtGKtaYIJq8yubz/scene.splinecode';

export default function Hero({ onConsultationClick }) {
  return (
    <section className="hero-section">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-banner">
        <div className="hero-intro">
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
            Get customized homeopathic remedies prepared with precision. Consult online with certified homeo-specialists instantly for just <strong>₹49</strong>.
          </p>
        </div>

        <div className="hero-spline-wrap" aria-hidden="true">
          <Suspense fallback={<div className="hero-spline-fallback" />}>
            <Spline
              scene={SPLINE_SCENE}
              className="hero-spline"
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        </div>

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
            <span>Video Consult (₹49)</span>
          </button>
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
          <span className="hero-stat-label">Instant Video Support</span>
        </div>
        <div className="glass-interactive hero-stat-card">
          <Stethoscope size={22} className="hero-stat-icon primary" />
          <span className="hero-stat-value">₹49</span>
          <span className="hero-stat-label">Online Doctor Consultation</span>
        </div>
      </div>
    </section>
  );
}
