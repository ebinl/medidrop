import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Award, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  MessageCircle, 
  ChevronDown, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  HeartHandshake, 
  PhoneCall, 
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CLINIC_PHONE } from '../config/clinic';

const QUICK_CONDITIONS = [
  { id: 'pcod', name: 'PCOD / PCOS', badge: 'High Recovery Rate', desc: 'Natural cycle regulation & hormonal balance' },
  { id: 'migraine', name: 'Chronic Migraine', badge: 'Pain Relief', desc: 'Vascular headache & aura constitutional care' },
  { id: 'thyroid', name: 'Thyroid Balance', badge: 'Metabolic Care', desc: 'Hypo & hyperthyroid energy restoration' },
  { id: 'acidity', name: 'Acidity & GERD', badge: 'Digestive Health', desc: 'Acid reflux, bloating & gut healing' },
  { id: 'skin', name: 'Skin & Hair Fall', badge: 'Dermatology', desc: 'Eczema, cystic acne & hair thinning remedies' },
  { id: 'arthritis', name: 'Joint Pain & Arthritis', badge: 'Mobility', desc: 'Cartilage support & morning stiffness relief' },
  { id: 'anxiety', name: 'Anxiety & Sleep', badge: 'Mental Wellness', desc: 'Calm nervous system & non-habit restorative sleep' },
  { id: 'pediatric', name: 'Child Immunity', badge: 'Gentle & Safe', desc: 'Zero side-effects natural pediatric wellness' },
];

const PATIENT_REVIEWS = [
  {
    name: 'Priya Narayanan',
    city: 'Bangalore, Karnataka',
    condition: 'Chronic PCOD & Hormonal Acne',
    rating: 5,
    text: 'Dr. Ancy Shaji is hands down the best homeo doctor I have consulted in India. After 3 years of hormonal medications with severe side effects, her constitutional remedy regularized my cycle in 4 months. The ₹99 online consultation and fast courier delivery to Bangalore made the whole process effortless!',
  },
  {
    name: 'Rajesh Sharma',
    city: 'Mumbai, Maharashtra',
    condition: 'Severe Migraine & Acid Reflux',
    rating: 5,
    text: 'I was skeptical about online homeopathy, but Dr. Ancy took 45 minutes to understand my full history. The medicine kit arrived at my doorstep in Mumbai in 2 days. My debilitating weekly migraines have stopped completely. Highly recommended for anyone looking for the best homeo doctor online in India.',
  },
  {
    name: 'Deepa Varma',
    city: 'Kochi, Kerala',
    condition: 'Hypothyroidism & Joint Pain',
    rating: 5,
    text: 'Very knowledgeable and compassionate doctor. The personalized approach and pure potencies have drastically reduced my fatigue and joint stiffness. MEDI DROP offers true premium care at a genuinely affordable price.',
  },
];

const FAQS = [
  {
    q: 'Who is the best homeo doctor in India for online consultation?',
    a: 'Dr. Ancy Shaji (BHMS) is recognized among the best homeo doctors in India, bringing over 20 years of clinical experience in classical constitutional homeopathy and having successfully treated 15,000+ patients across India and globally. On MEDI DROP, you can consult Dr. Ancy Shaji directly via private online consultation for just ₹99.',
  },
  {
    q: 'How does an online Homeopathy consultation work on MEDI DROP?',
    a: 'Booking an appointment is seamless: 1. Click "Consult Doctor" and pick your convenient time slot for ₹99. 2. Connect with Dr. Ancy Shaji (BHMS) over a 1-on-1 private online consultation. 3. The doctor analyzes your physical, emotional, and constitutional symptoms in depth. 4. You receive an official digital prescription and your customized homeopathic medicine kit is dispatched express with doorstep delivery anywhere in India.',
  },
  {
    q: 'How much does a Homeopathy consultation cost in India on MEDI DROP?',
    a: 'A complete 1-on-1 private online consultation with Dr. Ancy Shaji on MEDI DROP costs only ₹99 with zero hidden charges. We believe world-class constitutional homeopathic healthcare should be affordable and accessible to every Indian family.',
  },
  {
    q: 'Does MEDI DROP provide express doorstep delivery of homeopathic medicines across India?',
    a: 'Yes, we dispatch sealed, certified homeopathic dilutions, mother tinctures, and customized remedy packs to all 28,000+ PIN codes across India within 24 hours with reliable doorstep delivery. Shipments are packaged in temperature-stable, protective boxing with real-time tracking.',
  },
  {
    q: 'What chronic diseases can be effectively treated with Homeopathy?',
    a: 'Homeopathy is widely effective for chronic conditions including PCOD/PCOS, thyroid disorders (hypo and hyperthyroidism), recurring migraines, acid reflux and GERD, IBS, arthritis and joint pain, skin diseases (eczema, psoriasis, acne), hair fall and alopecia, respiratory allergies, asthma, and anxiety.',
  },
  {
    q: 'Why should I choose Constitutional Homeopathy over temporary symptom relief?',
    a: 'Constitutional homeopathy evaluates the individual as a harmonious whole — identifying genetic predispositions, emotional triggers, and vital energy levels. Instead of suppressing symptoms temporarily, it stimulates your body’s natural self-healing mechanism for permanent, side-effect-free recovery.',
  },
];

const MAJOR_REGIONS = [
  'Kerala (Kochi, Trivandrum, Calicut)',
  'Bangalore & Karnataka',
  'Mumbai & Maharashtra',
  'Delhi NCR & Gurgaon',
  'Chennai & Tamil Nadu',
  'Hyderabad & Telangana',
  'Kolkata & West Bengal',
  'Pune',
  'Ahmedabad & Gujarat',
  'Chandigarh & Punjab',
  'Jaipur & Rajasthan',
  'Pan-India 28,000+ PIN codes'
];

export default function SeoAuthoritySection({ onConsultationClick }) {
  const [openFaq, setOpenFaq] = useState(0);
  const sectionRef = useScrollReveal('[data-reveal]');

  return (
    <section className="seo-authority-section" ref={sectionRef} id="homeo-doctor-india">
      {/* Sitelinks Navigation Hub for Google & Users */}
      <div className="seo-sitelinks-hub" data-reveal="fade-up">
        <div className="seo-sitelinks-header">
          <span className="seo-sitelinks-badge">
            <Sparkles size={13} />
            <span>Google Sitelinks Directory • Fast Access</span>
          </span>
          <h2 className="seo-sitelinks-title">Explore MEDI DROP — India's Premier Online Homeopathy Portal</h2>
        </div>

        <div className="seo-sitelinks-grid">
          <div className="glass-interactive seo-sitelink-card" onClick={onConsultationClick} role="button" tabIndex={0}>
            <div className="seo-sitelink-icon primary">
              <Stethoscope size={20} />
            </div>
            <div className="seo-sitelink-text">
              <h4>Consult Best Homeo Doctor (₹99)</h4>
              <p>Book 1-on-1 private online consultation with Dr. Ancy Shaji (BHMS, 20+ Yrs Exp).</p>
            </div>
            <ArrowRight size={16} className="seo-sitelink-arrow" />
          </div>

          <Link to="/remedies" className="glass-interactive seo-sitelink-card">
            <div className="seo-sitelink-icon secondary">
              <ShieldCheck size={20} />
            </div>
            <div className="seo-sitelink-text">
              <h4>Pure Homeopathic Remedies Store</h4>
              <p>Certified Hahnemannian potencies & dilutions with express doorstep delivery.</p>
            </div>
            <ArrowRight size={16} className="seo-sitelink-arrow" />
          </Link>

          <a href="/#treatments" className="glass-interactive seo-sitelink-card">
            <div className="seo-sitelink-icon primary">
              <Sparkles size={20} />
            </div>
            <div className="seo-sitelink-text">
              <h4>Condition-Specific Protocols</h4>
              <p>Targeted remedy protocols for PCOD, Migraine, Thyroid, Arthritis & Skin.</p>
            </div>
            <ArrowRight size={16} className="seo-sitelink-arrow" />
          </a>

          <Link to="/contact" className="glass-interactive seo-sitelink-card">
            <div className="seo-sitelink-icon secondary">
              <PhoneCall size={20} />
            </div>
            <div className="seo-sitelink-text">
              <h4>Clinic Help & WhatsApp Doctor</h4>
              <p>Direct patient support, order assistance, and instant WhatsApp inquiry.</p>
            </div>
            <ArrowRight size={16} className="seo-sitelink-arrow" />
          </Link>
        </div>
      </div>

      {/* High-Intent Lead Booster: Quick Condition Selector */}
      <div className="seo-lead-booster glass" data-reveal="scale">
        <div className="seo-lead-header">
          <span className="section-eyebrow">Instant Symptom Consultation</span>
          <h3 className="seo-lead-title">
            Consult the Best Homeo Doctor in India for Your Health Condition
          </h3>
          <p className="seo-lead-sub">
            Click your condition below to book an immediate 1-on-1 online consultation with Dr. Ancy Shaji for just <strong>₹99</strong>.
          </p>
        </div>

        <div className="seo-condition-grid">
          {QUICK_CONDITIONS.map((cond) => (
            <div
              key={cond.id}
              className="glass-interactive seo-condition-card"
              onClick={onConsultationClick}
              role="button"
              tabIndex={0}
            >
              <div className="seo-condition-top">
                <span className="seo-condition-badge">{cond.badge}</span>
                <span className="seo-condition-price">₹99</span>
              </div>
              <h4 className="seo-condition-name">{cond.name}</h4>
              <p className="seo-condition-desc">{cond.desc}</p>
              <div className="seo-condition-action">
                <span>Book Online Consult</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>

        <div className="seo-lead-cta-bar">
          <div className="seo-lead-cta-info">
            <Award size={20} className="seo-lead-cta-icon" />
            <div>
              <strong>15,000+ Chronic Cases Successfully Managed Across India</strong>
              <p>100% natural medicines prescribed constitutionally with zero side effects.</p>
            </div>
          </div>
          <div className="seo-lead-cta-buttons">
            <button
              type="button"
              className="btn btn-secondary seo-lead-book-btn"
              onClick={onConsultationClick}
            >
              <Stethoscope size={16} />
              <span>Book Doctor Consult @ ₹99</span>
            </button>
            <a
              href={`https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(
                'Hello Dr. Ancy Shaji, I want to book an online Homeopathy consultation for ₹99.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline seo-lead-wa-btn"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Doctor</span>
            </a>
          </div>
        </div>
      </div>

      {/* SEO Authority Content & Editorial Breakdown */}
      <div className="seo-editorial-block" data-reveal="fade-up">
        <div className="section-header">
          <span className="section-eyebrow">India's Leading Online Homeopathy Clinic</span>
          <h2 className="section-title">
            Why Consult the Best Homeo Doctor in India Online?
          </h2>
          <p className="section-desc">
            Experience the gold standard in classical constitutional homeopathy from the comfort of your home.
          </p>
        </div>

        <div className="seo-authority-grid">
          <div className="glass seo-authority-card">
            <div className="seo-auth-icon-wrap">
              <Award size={24} />
            </div>
            <h4>Senior Clinical Expertise</h4>
            <p>
              Under the guidance of <strong>Dr. Ancy Shaji (BHMS)</strong>, with 20+ years of dedicated clinical practice, every case is evaluated with classical precision and individualized root-cause analysis.
            </p>
          </div>


          <div className="glass seo-authority-card">
            <div className="seo-auth-icon-wrap">
              <Truck size={24} />
            </div>
            <h4>Express Doorstep Medicine Delivery</h4>
            <p>
              Prescriptions and remedy kits are dispatched within 24 hours in secure, climate-controlled packaging directly to your doorstep in over 28,000+ PIN codes across India.
            </p>
          </div>

          <div className="glass seo-authority-card">
            <div className="seo-auth-icon-wrap">
              <HeartHandshake size={24} />
            </div>
            <h4>Affordable ₹99 Accessible Care</h4>
            <p>
              We eliminate traditional clinic wait times and high consultation fees, making top-tier homeopathic care accessible to everyone across India at flat ₹99 with zero hidden charges.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Patient Reviews & Lead Social Proof */}
      <div className="seo-testimonials-section" data-reveal="fade-up">
        <div className="section-header">
          <span className="section-eyebrow">Verified Patient Success Stories</span>
          <h3 className="section-title">Trusted by 15,000+ Patients Across India</h3>
          <p className="section-desc">Real recoveries from chronic illness through constitutional homeopathic care.</p>
        </div>

        <div className="seo-reviews-grid">
          {PATIENT_REVIEWS.map((rev) => (
            <div key={rev.name} className="glass seo-review-card">
              <div className="seo-review-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={15} className="star-filled" />
                ))}
              </div>
              <p className="seo-review-text">"{rev.text}"</p>
              <div className="seo-review-author">
                <div className="seo-review-avatar">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="seo-review-name">{rev.name}</h4>
                  <span className="seo-review-loc">{rev.city} • <strong className="seo-review-cond">{rev.condition}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Search-Optimized FAQ Accordion (Aligned with Schema.org) */}
      <div className="seo-faq-block" data-reveal="fade-up" id="faq">
        <div className="section-header">
          <span className="section-eyebrow">Frequently Asked Questions</span>
          <h3 className="section-title">Homeo Doctor Online Consultation & Medicine FAQs</h3>
          <p className="section-desc">Everything you need to know about online homeopathy consultation in India.</p>
        </div>

        <div className="seo-faq-accordion">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`glass seo-faq-item ${isOpen ? 'seo-faq-item--open' : ''}`}>
                <button
                  type="button"
                  className="seo-faq-question"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                >
                  <span className="seo-faq-q-text">{faq.q}</span>
                  <ChevronDown size={18} className={`seo-faq-arrow ${isOpen ? 'rotate' : ''}`} />
                </button>
                {isOpen && (
                  <div className="seo-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Doorstep Delivery & Geographic SEO Keyword Cloud */}
      <div className="seo-regions-block glass" data-reveal="fade-up">
        <div className="seo-regions-header">
          <MapPin size={18} className="seo-regions-icon" />
          <h4>Serving Patients Across All Indian States & Cities</h4>
        </div>
        <p className="seo-regions-desc">
          Online Consultations with Dr. Ancy Shaji and express doorstep medicine delivery available across:
        </p>
        <div className="seo-regions-tags">
          {MAJOR_REGIONS.map((region) => (
            <span key={region} className="seo-region-tag">
              <CheckCircle2 size={12} />
              <span>{region}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
