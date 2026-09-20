import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import DoctorCard from '../components/DoctorCard';
import MedicineGrid from '../components/MedicineGrid';
import TreatmentTabs from '../components/TreatmentTabs';
import { Activity, HeartPulse, Clock, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomePage({ onConsultationClick, onAddToCart }) {
  const featuresRef = useScrollReveal('[data-reveal]');
  const ctaRef = useScrollReveal('[data-reveal]');
  const remediesMoreRef = useScrollReveal('[data-reveal]');

  return (
    <>
      <Hero onConsultationClick={onConsultationClick} />

      <DoctorCard onConsultationClick={onConsultationClick} />

      <TreatmentTabs onConsultationClick={onConsultationClick} />

      <section id="features" className="features-section" ref={featuresRef}>
        <div className="section-header" data-reveal="fade-down">
          <span className="section-eyebrow">Advanced Clinical Care</span>
          <h2 className="section-title">Why Choose MEDI DROP?</h2>
        </div>

        <div className="features-grid">
          <div className="glass-interactive feature-card" data-reveal="scale" data-stagger="1">
            <Activity size={32} className="feature-icon primary" />
            <h4>Pure Potencies</h4>
            <p>
              Our dilutions are sourced from organically harvested botanicals and minerals, prepared using classical Hahnemannian guidelines.
            </p>
          </div>

          <div className="glass-interactive feature-card" data-reveal="scale" data-stagger="3">
            <HeartPulse size={32} className="feature-icon secondary" />
            <h4>Zero Side Effects</h4>
            <p>
              Safe for all age groups, including infants, pregnant women, and elderly. Boosts natural self-healing mechanisms gently.
            </p>
          </div>

          <div className="glass-interactive feature-card" data-reveal="scale" data-stagger="5">
            <Clock size={32} className="feature-icon primary" />
            <h4>Express Delivery</h4>
            <p>
              All homeopathic packs are custom boxed under strict hygiene, shipped with climate control to maintain molecular integrity.
            </p>
          </div>
        </div>
      </section>

      <MedicineGrid onAddToCart={onAddToCart} />

      <div className="home-remedies-more" ref={remediesMoreRef}>
        <Link to="/remedies" className="btn btn-outline" data-reveal="zoom">
          View All Remedies
          <ArrowRight size={16} />
        </Link>
      </div>

      <section className="consult-cta-section" ref={ctaRef}>
        <div className="glass consult-cta-panel" data-reveal="scale">
          <h3>Need a Customized Treatment Plan?</h3>
          <p>
            Consult live with our senior homeopathy practitioners online. Discuss symptoms and receive a personalized medicine dilution prescription dispatched immediately.
          </p>
          <button
            type="button"
            onClick={onConsultationClick}
            className="btn btn-secondary consult-cta-btn"
          >
            <span>Book Appointment for ₹99</span>
          </button>
        </div>
      </section>
    </>
  );
}
