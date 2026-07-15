import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import DoctorCard from '../components/DoctorCard';
import MedicineGrid from '../components/MedicineGrid';
import { Activity, HeartPulse, Clock, ArrowRight } from 'lucide-react';

export default function HomePage({ onConsultationClick, onAddToCart }) {
  return (
    <>
      <Hero onConsultationClick={onConsultationClick} />

      <DoctorCard onConsultationClick={onConsultationClick} />

      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-eyebrow">Advanced Clinical Care</span>
          <h2 className="section-title">Why Choose MEDI DROP?</h2>
        </div>

        <div className="features-grid">
          <div className="glass-interactive feature-card">
            <Activity size={32} className="feature-icon primary" />
            <h4>Pure Potencies</h4>
            <p>
              Our dilutions are sourced from organically harvested botanicals and minerals, prepared using classical Hahnemannian guidelines.
            </p>
          </div>

          <div className="glass-interactive feature-card">
            <HeartPulse size={32} className="feature-icon secondary" />
            <h4>Zero Side Effects</h4>
            <p>
              Safe for all age groups, including infants, pregnant women, and elderly. Boosts natural self-healing mechanisms gently.
            </p>
          </div>

          <div className="glass-interactive feature-card">
            <Clock size={32} className="feature-icon primary" />
            <h4>Express Delivery</h4>
            <p>
              All homeopathic packs are custom boxed under strict hygiene, shipped with climate control to maintain molecular integrity.
            </p>
          </div>
        </div>
      </section>

      <MedicineGrid onAddToCart={onAddToCart} />

      <div className="home-remedies-more">
        <Link to="/remedies" className="btn btn-outline">
          View All Remedies
          <ArrowRight size={16} />
        </Link>
      </div>

      <section className="consult-cta-section">
        <div className="glass consult-cta-panel">
          <h3>Need a Customized Treatment Plan?</h3>
          <p>
            Consult live with our senior homeopathy practitioners online. Discuss symptoms and receive a personalized medicine dilution prescription dispatched immediately.
          </p>
          <button
            type="button"
            onClick={onConsultationClick}
            className="btn btn-secondary consult-cta-btn"
          >
            <span>Book Appointment for ₹49</span>
          </button>
        </div>
      </section>
    </>
  );
}
