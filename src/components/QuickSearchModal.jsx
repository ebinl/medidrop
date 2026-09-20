import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Stethoscope,
  Pill,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  MessageCircle,
  Tag,
  PhoneCall,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DEFAULT_MEDICINES } from '../data/defaultMedicines';
import { TREATMENT_TABS } from './TreatmentTabs';
import { CLINIC_PHONE } from '../config/clinic';
import { shareWebsiteOnWhatsApp } from '../services/shareUtils';

const POPULAR_QUICK_TAGS = [
  { label: '🩺 Video Consult ₹99', query: 'consultation' },
  { label: '🔥 Acidity & Gas', query: 'acidity' },
  { label: '🌸 PCOD / PCOS', query: 'pcod' },
  { label: '🧠 Migraine Relief', query: 'migraine' },
  { label: '🦴 Joint Pain & Arthritis', query: 'arthritis' },
  { label: '✨ Hair Fall & Skin', query: 'skin' },
  { label: '🦋 Thyroid Balance', query: 'thyroid' },
  { label: '👶 Baby Colic', query: 'colic' },
  { label: '⚡ Arnica Montana', query: 'arnica' },
  { label: '🌿 Nux Vomica', query: 'nux vomica' },
];

export default function QuickSearchModal({
  isOpen,
  onClose,
  initialQuery = '',
  onConsultationClick,
  onAddToCart,
  onOpenChatbot,
}) {
  const [query, setQuery] = useState(initialQuery || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || '');
      setTimeout(() => {
        inputRef.current?.focus();
        if (inputRef.current) {
          inputRef.current.select?.();
        }
      }, 60);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialQuery]);

  // Global keydown for Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cleanQuery = query.trim().toLowerCase();

  // Search Results
  const results = useMemo(() => {
    if (!cleanQuery) return null;

    // 1. Doctor & Consultation Matches
    const consultKeywords = [
      'consult', 'doctor', 'ancy', 'appointment', 'video', 'call', 'fee', '99', 'online', 'whatsapp', 'timing', 'meet', 'prescription'
    ];
    const matchConsult = consultKeywords.some((k) => cleanQuery.includes(k)) || cleanQuery.length > 0;

    // 2. Remedies Search
    const matchingRemedies = DEFAULT_MEDICINES.filter((med) => {
      return (
        med.name.toLowerCase().includes(cleanQuery) ||
        med.scientificName.toLowerCase().includes(cleanQuery) ||
        med.category.toLowerCase().includes(cleanQuery) ||
        med.description.toLowerCase().includes(cleanQuery) ||
        (med.benefits && med.benefits.some((b) => b.toLowerCase().includes(cleanQuery)))
      );
    });

    // 3. Treatment Conditions Search
    const matchingTreatments = TREATMENT_TABS.filter((t) => {
      return (
        t.label.toLowerCase().includes(cleanQuery) ||
        t.tagline.toLowerCase().includes(cleanQuery) ||
        t.description.toLowerCase().includes(cleanQuery) ||
        t.symptoms.some((s) => s.toLowerCase().includes(cleanQuery)) ||
        t.remedies.some((r) => r.name.toLowerCase().includes(cleanQuery) || r.use.toLowerCase().includes(cleanQuery))
      );
    });

    return {
      matchConsult,
      remedies: matchingRemedies,
      treatments: matchingTreatments,
      totalCount: (matchConsult ? 1 : 0) + matchingRemedies.length + matchingTreatments.length,
    };
  }, [cleanQuery]);

  if (!isOpen) return null;

  return (
    <div className="quick-search-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quick-search-modal glass" onClick={(e) => e.stopPropagation()}>
        {/* Search Header Bar */}
        <div className="quick-search-input-wrap">
          <Search size={22} className="quick-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="quick-search-input"
            placeholder="Search symptoms (e.g. Acidity, PCOD, Migraine), medicines, doctor consult..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search homeopathic remedies and doctor consultation"
          />
          {query && (
            <button
              type="button"
              className="quick-search-clear-btn"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="button"
            className="quick-search-esc-btn"
            onClick={onClose}
            title="Close (Esc)"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="quick-search-chips-row">
          <span className="quick-search-chips-label">Popular Searches:</span>
          <div className="quick-search-chips-list">
            {POPULAR_QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                className="quick-search-chip"
                onClick={() => setQuery(tag.query)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Area */}
        <div className="quick-search-body">
          {/* Default State (When query is empty) */}
          {!cleanQuery && (
            <div className="quick-search-empty-state">
              {/* Feature 1: ₹99 Doctor Consultation Fast Card */}
              <div className="quick-search-featured-consult">
                <div className="quick-search-featured-icon">
                  <Stethoscope size={26} />
                </div>
                <div className="quick-search-featured-info">
                  <div className="quick-search-featured-badge">
                    <ShieldCheck size={13} />
                    <span>Certified Senior Physician</span>
                  </div>
                  <h4>Online Homeopathy Consultation with Dr. Ancy Shaji</h4>
                  <p>1-on-1 Video consultation via Google Meet/WhatsApp + personalized prescription dispatched to your doorstep.</p>
                </div>
                <div className="quick-search-featured-actions">
                  <span className="quick-search-featured-price">₹99</span>
                  <button
                    type="button"
                    className="btn btn-primary quick-search-book-btn"
                    onClick={() => {
                      onClose();
                      onConsultationClick();
                    }}
                  >
                    <span>Book Now</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Quick Services Grid */}
              <div className="quick-search-services-grid">
                <div
                  className="quick-service-card"
                  onClick={() => {
                    onClose();
                    onConsultationClick();
                  }}
                >
                  <div className="quick-service-icon stethoscope">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h5>Instant Video Consult</h5>
                    <p>Consult Dr. Ancy Shaji today for just ₹99</p>
                  </div>
                  <ChevronRight size={16} className="quick-service-arrow" />
                </div>

                <a
                  href={`https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(
                    'Hello Dr. Ancy, I am reaching out from MEDI DROP website to ask about homeopathic consultation.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-service-card"
                  onClick={onClose}
                >
                  <div className="quick-service-icon whatsapp">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h5>WhatsApp Doctor Direct</h5>
                    <p>Direct chat at +91 {CLINIC_PHONE}</p>
                  </div>
                  <ExternalLink size={15} className="quick-service-arrow" />
                </a>

                <div
                  className="quick-service-card quick-service-card-share"
                  onClick={() => {
                    onClose();
                    shareWebsiteOnWhatsApp();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="quick-service-icon whatsapp-share">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h5>Share Website on WhatsApp</h5>
                    <p>Share with friends with full clinic details</p>
                  </div>
                  <ChevronRight size={16} className="quick-service-arrow" />
                </div>
              </div>
            </div>
          )}

          {/* Active Search Results */}
          {cleanQuery && results && (
            <div className="quick-search-results-list">
              {/* Doctor Consultation Result */}
              {results.matchConsult && (
                <div className="quick-result-section">
                  <div className="quick-section-heading">
                    <Stethoscope size={16} />
                    <span>Doctor Consultation Services</span>
                  </div>
                  <div className="quick-consult-result-card">
                    <div className="quick-consult-left">
                      <div className="quick-consult-avatar">
                        <img src="/medidrop-brand-logo.png" alt="Dr. Ancy Shaji" />
                      </div>
                      <div>
                        <h5>1-on-1 Online Consultation — Dr. Ancy Shaji (BHMS)</h5>
                        <p className="quick-consult-sub">
                          <Clock size={12} /> Mon-Sat 10:00 AM - 8:00 PM IST • Video call on Google Meet / WhatsApp
                        </p>
                        <span className="quick-consult-tag">Includes personalized medicine prescription</span>
                      </div>
                    </div>
                    <div className="quick-consult-right">
                      <span className="quick-consult-fee">₹99</span>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          onClose();
                          onConsultationClick();
                        }}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Treatment Conditions Results */}
              {results.treatments.length > 0 && (
                <div className="quick-result-section">
                  <div className="quick-section-heading">
                    <Sparkles size={16} />
                    <span>Condition Treatment Protocols ({results.treatments.length})</span>
                  </div>
                  <div className="quick-treatments-grid">
                    {results.treatments.map((t) => (
                      <div key={t.id} className="quick-treatment-card">
                        <div className="quick-treatment-top">
                          <span className="quick-treatment-emoji">{t.emoji}</span>
                          <div>
                            <h6>{t.label} Protocol</h6>
                            <span className="quick-treatment-tagline">{t.tagline}</span>
                          </div>
                        </div>
                        <p className="quick-treatment-desc">{t.description.slice(0, 110)}...</p>
                        <div className="quick-treatment-symptoms">
                          {t.symptoms.slice(0, 3).map((s) => (
                            <span key={s} className="quick-symptom-tag">{s}</span>
                          ))}
                        </div>
                        <div className="quick-treatment-footer">
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => {
                              onClose();
                              onConsultationClick();
                            }}
                          >
                            Consult Doctor for {t.label} (₹99)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remedies Results */}
              {results.remedies.length > 0 && (
                <div className="quick-result-section">
                  <div className="quick-section-heading">
                    <Pill size={16} />
                    <span>Homeopathic Remedies ({results.remedies.length})</span>
                  </div>
                  <div className="quick-remedies-grid">
                    {results.remedies.map((med) => (
                      <div key={med.id} className="quick-remedy-card">
                        <div className="quick-remedy-info">
                          <span className="quick-remedy-category">{med.category}</span>
                          <h5>{med.name}</h5>
                          <span className="quick-remedy-sciname">{med.scientificName}</span>
                          <p className="quick-remedy-desc">{med.description}</p>
                          <div className="quick-remedy-benefits">
                            {(med.benefits || []).slice(0, 2).map((b) => (
                              <span key={b} className="quick-benefit-tag">✓ {b}</span>
                            ))}
                          </div>
                        </div>
                        <div className="quick-remedy-actions">
                          <span className="quick-remedy-price">₹{med.price}</span>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              onAddToCart(med, med.minQuantity || 1);
                              onClose();
                            }}
                          >
                            <ShoppingCart size={14} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Zero Results State */}
              {results.totalCount === 0 && (
                <div className="quick-no-results">
                  <div className="quick-no-results-icon">
                    <Search size={36} />
                  </div>
                  <h4>No direct matches found for "{query}"</h4>
                  <p>
                    Would you like to ask our AI Clinical Assistant or consult directly with Dr. Ancy Shaji?
                  </p>
                  <div className="quick-no-results-ctas">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        onClose();
                        onConsultationClick();
                      }}
                    >
                      <Stethoscope size={16} />
                      <span>Book ₹99 Consultation</span>
                    </button>
                    <a
                      href={`https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(
                        `Hello Dr. Ancy, I was searching on MEDI DROP for: ${query}. Can you guide me?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      <MessageCircle size={16} />
                      <span>WhatsApp Doctor</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="quick-search-footer">
          <div className="quick-footer-left">
            <span>💡 <strong>Tip:</strong> Press <kbd>ESC</kbd> anytime to exit.</span>
          </div>
          <div className="quick-footer-right">
            <button
              type="button"
              className="quick-search-wa-share-btn"
              onClick={() => {
                shareWebsiteOnWhatsApp(cleanQuery ? `I was checking "${cleanQuery}" on MEDI DROP:` : '');
              }}
              title="Share website on WhatsApp"
            >
              <MessageCircle size={14} />
              <span>Share on WhatsApp</span>
            </button>
            <span className="quick-footer-sep">•</span>
            <span>Pan-India Express Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
