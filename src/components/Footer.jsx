import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, MessageCircle, ShieldCheck, Stethoscope } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CLINIC_PHONE } from '../config/clinic';

export default function Footer({ onConsultationClick }) {
  const footerRef = useScrollReveal('[data-reveal]');
  return (
    <footer className="glass site-footer" ref={footerRef}>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col" data-reveal="fade-up" data-stagger="1">
            <Link to="/" className="footer-logo-link" aria-label="MEDI DROP home">
              <img
                src="/medidrop-brand-logo.png"
                alt="MEDI DROP - Best Homeo Doctor in India"
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-text">
              India's premier online homeopathy clinic. Consult senior physician <strong>Dr. Ancy Shaji (BHMS)</strong> online for ₹99 and order pure Hahnemannian potencies with express doorstep delivery.
            </p>
            <div className="footer-badge-trust">
              <ShieldCheck size={14} />
              <span>100% Certified Safe & Natural • 15,000+ Patients Treated</span>
            </div>
          </div>

          <div className="footer-col" data-reveal="fade-up" data-stagger="2">
            <h4 className="footer-heading">Google Sitelinks</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li>
                <button type="button" className="footer-link-btn highlight" onClick={onConsultationClick}>
                  Consult Homeo Doctor (₹99)
                </button>
              </li>
              <li><Link to="/remedies">Homeopathic Remedies Store</Link></li>
              <li><a href="/#treatments">Treatments by Condition</a></li>
              <li><a href="/#features">Why Choose MEDI DROP</a></li>
              <li><a href="/#faq">Homeopathy FAQs</a></li>
              <li><Link to="/contact">Contact & Support</Link></li>
            </ul>
          </div>

          <div className="footer-col" data-reveal="fade-up" data-stagger="3">
            <h4 className="footer-heading">Condition Care</h4>
            <ul className="footer-links">
              <li><a href="/#treatments">PCOD & Hormonal Care</a></li>
              <li><a href="/#treatments">Chronic Migraine Protocol</a></li>
              <li><a href="/#treatments">Thyroid Disorder Care</a></li>
              <li><a href="/#treatments">Acidity & GERD Treatment</a></li>
              <li><a href="/#treatments">Eczema, Acne & Hair Loss</a></li>
              <li><a href="/#treatments">Arthritis & Joint Pain</a></li>
              <li><a href="/#treatments">Pediatric & Child Wellness</a></li>
            </ul>
          </div>

          <div className="footer-col" id="footer-contact" data-reveal="fade-up" data-stagger="4">
            <h4 className="footer-heading">Clinic Contact & Support</h4>
            <ul className="footer-contact">
              <li>
                <Phone size={14} />
                <a href="tel:9746758698" className="footer-contact-link">+91 97467 58698</a>
              </li>
              <li>
                <MessageCircle size={14} />
                <a 
                  href={`https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent('Hello Dr. Ancy Shaji, I need assistance regarding online consultation.')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-contact-link"
                >
                  WhatsApp Doctor Support
                </a>
              </li>
              <li>
                <Mail size={14} />
                <a href="mailto:medidrop.co.in@gmail.com" className="footer-contact-link">medidrop.co.in@gmail.com</a>
              </li>
              <li>
                <MapPin size={14} />
                <span>Pan-India Online Consultations · Mon–Sat, 10:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Keywords Footer Bar */}
        <div className="footer-seo-keywords">
          <p className="footer-seo-heading">Popular Searches & Regional Homeopathy Care:</p>
          <p className="footer-seo-pills">
            <span>Best Homeo Doctor in India</span> • 
            <span>Online Homeopathy Consultation ₹99</span> • 
            <span>Dr. Ancy Shaji Homeopathy Doctor</span> • 
            <span>Homeopathy Doctor Bangalore</span> • 
            <span>Homeopathy Doctor Kerala</span> • 
            <span>Homeopathy Doctor Mumbai</span> • 
            <span>Homeopathy Doctor Delhi NCR</span> • 
            <span>Homeopathy Doctor Hyderabad</span> • 
            <span>Homeopathy Doctor Chennai</span> • 
            <span>PCOD Homeopathic Treatment</span> • 
            <span>Migraine Homeopathy Medicine</span> • 
            <span>Thyroid Homeo Care</span> • 
            <span>Buy Homeopathic Dilutions Online India</span> • 
            <span>Constitutional Homeopathy Online</span>
          </p>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} MEDI DROP Homeopathy Clinic. All rights reserved. Registered Indian Medical & Homeopathic Service.
          </p>
          <div className="footer-legal-links">
            <Link to="/shipping-policy">Shipping Policy</Link>
            <span>•</span>
            <Link to="/returns-refunds">Returns & Refunds</Link>
            <span>•</span>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms-of-use">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
