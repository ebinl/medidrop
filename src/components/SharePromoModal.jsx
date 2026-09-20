import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Gift,
  Heart,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CLINIC_PHONE } from '../config/clinic';
import { getCustomWebsiteShareText, shareWebsiteOnWhatsApp } from '../services/shareUtils';

export default function SharePromoModal({ isOpen, onClose, addToast }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = 'https://www.medidrop.co.in/';
  const shareText = getCustomWebsiteShareText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}`);
      setCopied(true);
      addToast?.({
        title: 'Link Copied!',
        message: 'Share link copied to clipboard. Paste it in your chats or social groups.',
        type: 'success',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const shareWhatsApp = () => {
    shareWebsiteOnWhatsApp();
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('🌿 Consult Homeopathic Physician Dr. Ancy Shaji online for ₹99 with express delivery across India!')}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="share-promo-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="share-promo-card glass" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-promo-header">
          <div className="share-promo-header-left">
            <div className="share-promo-icon-badge">
              <Gift size={20} />
            </div>
            <div>
              <h3>Share Care & Wellness</h3>
              <p>Promote safe, natural homeopathic healing in India</p>
            </div>
          </div>
          <button
            type="button"
            className="share-promo-close-btn"
            onClick={onClose}
            aria-label="Close share dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="share-promo-body">
          <div className="share-promo-highlight-box">
            <div className="share-promo-perks">
              <div className="share-perk-item">
                <span className="share-perk-emoji">🩺</span>
                <span><strong>₹99 Video Consult</strong> with Dr. Ancy Shaji (BHMS)</span>
              </div>
              <div className="share-perk-item">
                <span className="share-perk-emoji">🚚</span>
                <span><strong>Express Delivery</strong> to all Indian Pin Codes</span>
              </div>
              <div className="share-perk-item">
                <span className="share-perk-emoji">🌿</span>
                <span><strong>100% Pure & Safe</strong> Dilutions with Zero Side Effects</span>
              </div>
            </div>
          </div>

          <div className="share-promo-channels">
            <span className="share-channels-title">Instant 1-Click Share:</span>
            <div className="share-channels-grid">
              <button
                type="button"
                className="share-channel-btn share-whatsapp"
                onClick={shareWhatsApp}
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                className="share-channel-btn share-telegram"
                onClick={shareTelegram}
              >
                <Send size={18} />
                <span>Telegram</span>
              </button>

              <button
                type="button"
                className="share-channel-btn share-twitter"
                onClick={shareTwitter}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X (Twitter)</span>
              </button>

              <button
                type="button"
                className="share-channel-btn share-facebook"
                onClick={shareFacebook}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Copy Link Input */}
          <div className="share-link-box">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="share-link-input"
              onClick={(e) => e.target.select()}
            />
            <button
              type="button"
              className={`btn btn-primary share-copy-btn ${copied ? 'btn-copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="share-promo-footer">
          <Heart size={14} className="share-footer-heart" />
          <span>Help friends & family discover affordable, holistic healthcare across India.</span>
        </div>
      </div>
    </div>
  );
}
