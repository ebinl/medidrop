import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer({ onConsultationClick }) {
  return (
    <footer className="glass site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <Link to="/" className="footer-logo-link" aria-label="MEDI DROP home">
              <img
                src="/medidrop-brand-logo.png"
                alt="medi drop"
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-text">
              Premium homeopathic remedies and online doctor consultations for everyday wellness.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/remedies">Remedies</Link></li>
              <li><a href="/#features">Why Us</a></li>
              <li><Link to="/contact">Contact</Link></li>
              <li>
                <button type="button" className="footer-link-btn" onClick={onConsultationClick}>
                  Consult Doctor
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/returns-refunds">Returns & Refunds</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use">Terms of Use</Link></li>
            </ul>
          </div>

          <div className="footer-col" id="footer-contact">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>
                <Phone size={14} />
                <a href="tel:9746758698" className="footer-contact-link">+91 97467 58698</a>
              </li>
              <li>
                <Mail size={14} />
                <a href="mailto:medidrop.co.in@gmail.com" className="footer-contact-link">medidrop.co.in@gmail.com</a>
              </li>
              <li>
                <MapPin size={14} />
                <span>Online consultations · Mon–Sat, 10:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} MEDI DROP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
