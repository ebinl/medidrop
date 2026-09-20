import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  ExternalLink,
  Sparkles,
  Stethoscope,
  ShoppingCart,
  Phone,
  Volume2,
  VolumeX,
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  Pill,
  RotateCcw
} from 'lucide-react';
import {
  CLINIC_WHATSAPP_NUMBER,
  CLINIC_PHONE_DISPLAY,
  CLINIC_DOCTOR_NAME,
  CONSULTATION_FEE,
  QUICK_TOPICS,
  buildWhatsAppLink,
  getChatbotResponse
} from '../services/chatbotAI';
import './WhatsAppChatBot.css';

// Gentle web audio notification tone
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.23);
  } catch {
    // Ignore audio permission restrictions
  }
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simple markdown formatter for bold and linebreaks
function renderFormattedText(text = '') {
  const parts = text.split('\n');
  return parts.map((line, idx) => {
    // Process bold (**word**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        elements.push(line.substring(lastIndex, match.index));
      }
      elements.push(<strong key={`${idx}-${match.index}`}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      elements.push(line.substring(lastIndex));
    }

    return (
      <span key={idx} className="chat-msg-line">
        {elements.length > 0 ? elements : line}
        {idx < parts.length - 1 && <br />}
      </span>
    );
  });
}

// ── Drag position storage ────────────────────────────────────────────────────
const POS_KEY = 'medidrop-chatbot-pos';
const DEFAULT_POS = { right: 24, bottom: 24 };

function loadPos() {
  try {
    const saved = JSON.parse(localStorage.getItem(POS_KEY));
    if (saved && typeof saved.right === 'number' && typeof saved.bottom === 'number') {
      return saved;
    }
  } catch { /* ignore */ }
  return null;
}

function savePos(pos) {
  try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch { /* ignore */ }
}

// Clamp so the button stays fully on-screen
function clampPos(left, top, btnSize = 64) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const safeLeft = Math.max(8, Math.min(vw - btnSize - 8, left));
  const safeTop  = Math.max(8, Math.min(vh - btnSize - 8, top));
  return {
    right:  vw - safeLeft - btnSize,
    bottom: vh - safeTop  - btnSize,
  };
}

export default function WhatsAppChatBot({ onConsultationClick, onAddToCart, addToast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Drag state ─────────────────────────────────────────────────────────────
  const [pos, setPos] = useState(() => loadPos() || DEFAULT_POS);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, origRight: 0, origBottom: 0, moved: false });
  const wrapperRef = useRef(null);

  // Persist position
  useEffect(() => { savePos(pos); }, [pos]);

  // Snap back on viewport resize
  useEffect(() => {
    const onResize = () => {
      setPos(prev => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        return clampPos(vw - prev.right - 64, vh - prev.bottom - 64);
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);


  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello! 👋 Welcome to **MEDI DROP Homeopathy Clinic**.\n\nI am your AI Healthcare Assistant, working with **${CLINIC_DOCTOR_NAME}**.\n\nHow can I help you today? You can ask about:\n• 🌿 Remedies for acidity, cold, joint pain, allergies, skin\n• 🩺 Book a 1-on-1 Video Consult for **₹${CONSULTATION_FEE}**\n• 💧 How to take liquid drops & dosage\n• 📦 Medicine delivery across India\n\nOr click below to chat on WhatsApp at **${CLINIC_PHONE_DISPLAY}**!`,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I am visiting MEDI DROP and would like to ask a question.`,
      showConsultationCTA: true,
      time: formatTime()
    }
  ]);

  // Proactive tooltip popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotificationBadge(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setShowNotificationBadge(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // ── Drag handlers (pointer + touch) ────────────────────────────────────────
  const onDragStart = useCallback((clientX, clientY) => {
    const d = dragRef.current;
    d.active     = true;
    d.moved      = false;
    d.startX     = clientX;
    d.startY     = clientY;
    d.origRight  = pos.right;
    d.origBottom = pos.bottom;
  }, [pos.right, pos.bottom]);

  const onDragMove = useCallback((clientX, clientY) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = clientX - d.startX;
    const dy = clientY - d.startY;
    if (!d.moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return; // dead-zone
    d.moved = true;
    setIsDragging(true);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const newLeft = vw  - (d.origRight  - dx) - 64;
    const newTop  = vh  - (d.origBottom - dy) - 64;
    setPos(clampPos(newLeft, newTop));
  }, []);

  const onDragEnd = useCallback(() => {
    dragRef.current.active = false;
    // Give the click event a tick to read dragRef.current.moved before we reset
    requestAnimationFrame(() => {
      dragRef.current.moved = false;
      setIsDragging(false);
    });
  }, []);

  // Attach global move/up listeners once
  useEffect(() => {
    const onMM = (e) => onDragMove(e.clientX, e.clientY);
    const onMU = () => onDragEnd();
    const onTM = (e) => { if (e.touches[0]) onDragMove(e.touches[0].clientX, e.touches[0].clientY); };
    const onTE = () => onDragEnd();
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup',   onMU);
    window.addEventListener('touchmove', onTM, { passive: true });
    window.addEventListener('touchend',  onTE);
    return () => {
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('mouseup',   onMU);
      window.removeEventListener('touchmove', onTM);
      window.removeEventListener('touchend',  onTE);
    };
  }, [onDragMove, onDragEnd]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: formatTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call AI (Gemini or rule-based fallback) — pass full conversation history
      const botReply = await getChatbotResponse(text, messages);
      const newBotMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply.text,
        remedy: botReply.remedy || null,
        showConsultationCTA: botReply.showConsultationCTA || false,
        showWhatsAppCTA: botReply.showWhatsAppCTA || false,
        whatsappPrefillText: botReply.whatsappPrefillText || `Inquiry from MEDI DROP: "${text}"`,
        quickReplies: botReply.quickReplies || null,
        isAiPowered: botReply.isAiPowered || false,
        time: formatTime()
      };

      setMessages((prev) => [...prev, newBotMsg]);

      if (soundEnabled) {
        playChime();
      }

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('[MEDI DROP Chat] Error:', err);
      setMessages((prev) => [...prev, {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `I'm having trouble connecting right now. Please try again, or chat with **${CLINIC_DOCTOR_NAME}** directly on WhatsApp at **${CLINIC_PHONE_DISPLAY}**. 📱`,
        showWhatsAppCTA: true,
        whatsappPrefillText: `Hello Dr. Ancy, I tried the MEDI DROP chatbot but had a connection issue.`,
        time: formatTime()
      }]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `Chat reset. How can Dr. Ancy's AI assistant help you right now? Ask any symptom or homeopathic query below!`,
        showWhatsAppCTA: true,
        whatsappPrefillText: `Hello Dr. Ancy, I am inquiring on MEDI DROP.`,
        showConsultationCTA: true,
        time: formatTime()
      }
    ]);
  };

  const handleAddRemedyToCart = (remedy) => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: remedy.id,
          name: remedy.name,
          scientificName: remedy.category,
          category: remedy.category,
          price: remedy.price,
          minQuantity: 1,
          image: '/homeo-remedy.png'
        },
        1
      );
    } else if (addToast) {
      addToast({
        title: 'Remedy Selected',
        message: `${remedy.name} selected. Check Remedies page to order.`,
        type: 'success'
      });
    }
  };

  const handleWhatsAppDirectOpen = (prefillText) => {
    const url = buildWhatsAppLink(prefillText || inputValue || 'Hello Dr. Ancy, I am contacting you from the MEDI DROP website.');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const wrapperStyle = {
    right:  pos.right,
    bottom: pos.bottom,
    cursor: isDragging ? 'grabbing' : undefined,
  };

  return (
    <div
      ref={wrapperRef}
      className={`whatsapp-chatbot-wrapper${isDragging ? ' dragging' : ''}`}
      id="medidrop-whatsapp-bot"
      style={wrapperStyle}
    >
      {/* Floating Prompt Notification Bubble */}
      {!isOpen && showNotificationBadge && (
        <div className="whatsapp-prompt-bubble animate-in">
          <button
            className="whatsapp-prompt-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotificationBadge(false);
            }}
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <X size={12} />
          </button>
          <div
            className="whatsapp-prompt-body"
            onClick={() => {
              setIsOpen(true);
              setShowNotificationBadge(false);
            }}
          >
            <div className="whatsapp-prompt-avatar">
              <span className="whatsapp-prompt-dot"></span>
              <img src="/doctor-consultation.png" alt="Dr. Ancy Shaji" />
            </div>
            <div className="whatsapp-prompt-text">
              <strong>Need Homeopathic Help?</strong>
              <p>Chat with Dr. Ancy's AI or WhatsApp <span>+91 97467 58698</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button — draggable */}
      <button
        className={`whatsapp-trigger-btn ${isOpen ? 'active' : ''}${isDragging ? ' is-dragging' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          onDragStart(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          if (e.touches[0]) onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onClick={() => {
          if (!dragRef.current.moved) setIsOpen((prev) => !prev);
        }}
        aria-label={isOpen ? 'Close WhatsApp AI Chatbot' : 'Open WhatsApp AI Chatbot'}
        title={isOpen ? 'Close Chat' : 'Hold & drag to move · Tap to chat'}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <span className="whatsapp-pulse-ring"></span>
        <span className="whatsapp-online-dot"></span>

        {isOpen ? (
          <X size={26} className="whatsapp-icon-rotate" />
        ) : (
          <div className="whatsapp-btn-inner">
            <svg
              className="whatsapp-svg-icon"
              viewBox="0 0 24 24"
              width="30"
              height="30"
              fill="currentColor"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.188 8.188 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.81-.37-4.04-1.07l-.29-.17-3.01.79.8-2.93-.19-.3a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.51 11.64c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.12-.56.12-.17.25-.65.8-.8 1-.15.19-.3.22-.55.09-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.09-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.98.69.45-.04 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
            </svg>
            <span className="whatsapp-badge-icon">
              <Sparkles size={11} />
            </span>
          </div>
        )}

        {!isOpen && unreadCount > 0 && (
          <span className="whatsapp-unread-badge">{unreadCount}</span>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="whatsapp-chat-card animate-scale-up" role="dialog" aria-label="WhatsApp AI Chat">
          {/* Header */}
          <div className="whatsapp-header">
            <div className="whatsapp-header-doctor">
              <div className="whatsapp-avatar-wrap">
                <img
                  src="/doctor-consultation.png"
                  alt="Dr. Ancy Shaji"
                  className="whatsapp-avatar-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="whatsapp-avatar-fallback">Dr</span>
                <span className="whatsapp-verified-badge" title="Verified Medical Physician">
                  <ShieldCheck size={12} />
                </span>
              </div>
              <div className="whatsapp-doctor-meta">
                <div className="whatsapp-doctor-name">
                  <span>{CLINIC_DOCTOR_NAME} & AI</span>
                  <span className="whatsapp-tag">BHMS</span>
                </div>
                <div className="whatsapp-status-line">
                  <span className="whatsapp-status-dot"></span>
                  <span>Online · Replies instantly · {CLINIC_PHONE_DISPLAY}</span>
                </div>
              </div>
            </div>

            <div className="whatsapp-header-actions">
              <button
                type="button"
                className="whatsapp-header-btn"
                onClick={() => handleWhatsAppDirectOpen()}
                title="Direct WhatsApp Chat"
                aria-label="Direct WhatsApp Chat"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.188 8.188 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.81-.37-4.04-1.07l-.29-.17-3.01.79.8-2.93-.19-.3a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.51 11.64c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.12-.56.12-.17.25-.65.8-.8 1-.15.19-.3.22-.55.09-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.09-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.98.69.45-.04 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </button>

              <button
                type="button"
                className="whatsapp-header-btn"
                onClick={() => setSoundEnabled((prev) => !prev)}
                title={soundEnabled ? 'Mute notification sound' : 'Enable notification sound'}
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </button>

              <button
                type="button"
                className="whatsapp-header-btn"
                onClick={handleResetChat}
                title="Restart chat"
                aria-label="Restart chat"
              >
                <RotateCcw size={16} />
              </button>

              <button
                type="button"
                className="whatsapp-header-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="whatsapp-notice-strip">
            <span className="whatsapp-notice-shield">🔒</span>
            <span>Homeopathic AI & Clinical Desk · Official WhatsApp: <strong>{CLINIC_PHONE_DISPLAY}</strong></span>
          </div>

          {/* Messages Area */}
          <div className="whatsapp-messages-container">
            <div className="whatsapp-date-pill">TODAY</div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`whatsapp-msg-row ${msg.sender === 'user' ? 'whatsapp-msg-user' : 'whatsapp-msg-bot'}`}
              >
                <div className="whatsapp-bubble">
                  <div className="whatsapp-bubble-content">
                    {renderFormattedText(msg.text)}
                  </div>
                  {msg.isAiPowered && (
                    <div className="whatsapp-ai-badge">
                      <Sparkles size={9} />
                      <span>Gemini AI</span>
                    </div>
                  )}

                  {/* Optional Remedy Card */}
                  {msg.remedy && (
                    <div className="whatsapp-remedy-card">
                      <div className="whatsapp-remedy-badge">
                        <Pill size={12} />
                        <span>Recommended Homeo Remedy</span>
                      </div>
                      <div className="whatsapp-remedy-main">
                        <div className="whatsapp-remedy-name">{msg.remedy.name}</div>
                        <div className="whatsapp-remedy-category">{msg.remedy.category}</div>
                        <div className="whatsapp-remedy-price">₹{msg.remedy.price} <small>(30ml dilution)</small></div>
                      </div>
                      <div className="whatsapp-remedy-actions">
                        <button
                          type="button"
                          className="btn-card-action cart-action"
                          onClick={() => handleAddRemedyToCart(msg.remedy)}
                        >
                          <ShoppingCart size={13} />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          type="button"
                          className="btn-card-action whatsapp-action"
                          onClick={() =>
                            handleWhatsAppDirectOpen(
                              `Hello Dr. Ancy, I would like to order or ask about ${msg.remedy.name} (₹${msg.remedy.price}).`
                            )
                          }
                        >
                          <span>Ask on WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional Consultation Booking Card */}
                  {msg.showConsultationCTA && (
                    <div className="whatsapp-consult-card">
                      <div className="whatsapp-consult-info">
                        <Stethoscope size={16} className="whatsapp-consult-icon" />
                        <div>
                          <strong>Book 1-on-1 Video Consult</strong>
                          <span>Only ₹{CONSULTATION_FEE} with {CLINIC_DOCTOR_NAME}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="whatsapp-consult-btn"
                        onClick={() => {
                          setIsOpen(false);
                          if (onConsultationClick) onConsultationClick();
                        }}
                      >
                        <span>Book ₹{CONSULTATION_FEE} Appointment</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Optional Direct WhatsApp Transfer Card */}
                  {msg.showWhatsAppCTA && (
                    <div className="whatsapp-forward-card">
                      <button
                        type="button"
                        className="whatsapp-direct-link-btn"
                        onClick={() => handleWhatsAppDirectOpen(msg.whatsappPrefillText)}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.188 8.188 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.81-.37-4.04-1.07l-.29-.17-3.01.79.8-2.93-.19-.3a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.51 11.64c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.12-.56.12-.17.25-.65.8-.8 1-.15.19-.3.22-.55.09-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.09-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.98.69.45-.04 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
                        </svg>
                        <span>Chat on WhatsApp (+91 {CLINIC_WHATSAPP_NUMBER})</span>
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  )}

                  {/* Time and Blue Checkmarks */}
                  <div className="whatsapp-bubble-time">
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck size={14} className="whatsapp-check-read" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="whatsapp-msg-row whatsapp-msg-bot">
                <div className="whatsapp-bubble whatsapp-typing-bubble">
                  <div className="whatsapp-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="whatsapp-typing-label">Dr. Ancy's AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Carousel */}
          <div className="whatsapp-quick-chips">
            {QUICK_TOPICS.map((topic, i) => (
              <button
                key={i}
                type="button"
                className="whatsapp-chip-btn"
                onClick={() => handleSendMessage(topic.query)}
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="whatsapp-input-bar">
            <div className="whatsapp-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="whatsapp-input-field"
                placeholder="Ask symptoms, remedies, or dosage..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={300}
              />

              {/* Direct WhatsApp shortcut button inside input */}
              <button
                type="button"
                className="whatsapp-inline-wa-btn"
                onClick={() => handleWhatsAppDirectOpen(inputValue)}
                title="Send query directly to WhatsApp (+91 9746758698)"
                aria-label="Send query to WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.188 8.188 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.81-.37-4.04-1.07l-.29-.17-3.01.79.8-2.93-.19-.3a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.51 11.64c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.12-.56.12-.17.25-.65.8-.8 1-.15.19-.3.22-.55.09-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.09-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.98.69.45-.04 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              className="whatsapp-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Sub-footer disclaimer */}
          <div className="whatsapp-footer-disclaimer">
            <span>AI gives general homeopathic guidance. For acute conditions, consult Dr. Ancy.</span>
          </div>
        </div>
      )}
    </div>
  );
}
