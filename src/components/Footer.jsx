import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ onConsultationClick }) {
  return (
    <footer className="glass site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <Link to="/" className="footer-logo-link" aria-label="MEDI DROP home">
              <img
                src="/medi-drop-logo-full.png"
                alt="medi drop"
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-text">
              Temporary placeholder copy. Premium homeopathic remedies and online doctor consultations for everyday wellness.
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
              <li><span>Shipping Policy (temp)</span></li>
              <li><span>Returns & Refunds (temp)</span></li>
              <li><span>Privacy Policy (temp)</span></li>
              <li><span>Terms of Use (temp)</span></li>
            </ul>
          </div>

          <div className="footer-col" id="footer-contact">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>
                <Mail size={14} />
                <span>hello@medidrop.net</span>
              </li>
              <li>
                <Phone size={14} />
                <span>+91 90000 00000</span>
              </li>
              <li>
                <MapPin size={14} />
                <span>Clinic address placeholder, City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} MEDI DROP. Temporary footer content — update before launch.
          </p>
          <p className="footer-note">
            For informational purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
