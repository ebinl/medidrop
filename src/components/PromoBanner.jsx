import React, { useState } from 'react';
import { Sparkles, Search, Stethoscope, Share2, X, ShieldCheck } from 'lucide-react';
import { CLINIC_PHONE } from '../config/clinic';

export default function PromoBanner({ onSearchClick, onConsultationClick, onShareClick }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="promo-announcement-bar">
      <div className="promo-bar-container">
        <div className="promo-bar-left">
          <span className="promo-badge-india">🇮🇳 PAN-INDIA CARE</span>
          <span className="promo-text-highlight">
            <strong>Flat ₹99 Online Doctor Consultation</strong> with Certified Senior Specialists
          </span>
          <span className="promo-separator">•</span>
          <span className="promo-text-free">
            ✨ Free Shipping on orders ₹499+
          </span>
        </div>

        <div className="promo-bar-actions">
          <button
            type="button"
            className="promo-btn promo-btn-search"
            onClick={onSearchClick}
            title="Search remedies and consultation (Cmd+K)"
          >
            <Search size={13} />
            <span>Search</span>
            <kbd className="promo-kbd">⌘K</kbd>
          </button>

          <button
            type="button"
            className="promo-btn promo-btn-consult"
            onClick={onConsultationClick}
          >
            <Stethoscope size={13} />
            <span>Book (₹99)</span>
          </button>

          <button
            type="button"
            className="promo-btn promo-btn-share"
            onClick={onShareClick}
            title="Share with friends & family"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>

          <button
            type="button"
            className="promo-close-btn"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
