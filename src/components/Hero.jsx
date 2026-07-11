import React from 'react';
import { Video, Calendar, ShieldCheck, Heart, Users } from 'lucide-react';

export default function Hero({ onConsultationClick }) {
  return (
    <div style={{
      padding: '4rem 2rem 2.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* Decorative Blur Background Element */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Floating Vibe Badge */}
      <div className="glass" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.45rem 1rem',
        borderRadius: '100px',
        marginBottom: '1.5rem',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'var(--primary)',
        borderColor: 'rgba(16, 185, 129, 0.25)'
      }}>
        <ShieldCheck size={14} />
        <span>100% Certified Safe & Natural Solutions</span>
      </div>

      {/* Hero Headline */}
      <h1 style={{
        fontSize: '3rem',
        lineHeight: 1.15,
        maxWidth: '800px',
        marginBottom: '1.25rem',
          color: 'var(--text-primary)'
      }}>
        Premium Homeopathy Remedies Delivered <br />
        <span style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Directly to Your Doorstep
        </span>
      </h1>

      {/* Subtext */}
      <p style={{
        fontSize: '1.05rem',
        color: 'var(--text-secondary)',
        maxWidth: '620px',
        marginBottom: '2rem'
      }}>
        Get customized homeopathic remedies prepared with precision. Consult online with certified homeo-specialists instantly for just <strong>₹200</strong>.
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '4rem'
      }}>
        <a href="#medicines" className="btn btn-primary" style={{ padding: '0.9rem 1.8rem' }}>
          Browse Remedies
        </a>
        <button 
          onClick={onConsultationClick} 
          className="btn btn-secondary" 
          style={{ 
            padding: '0.9rem 1.8rem',
            animation: 'pulseGlow 2.5s infinite' 
          }}
        >
          <Video size={18} />
          <span>Video Consult (₹200)</span>
        </button>
      </div>

      {/* Health Stats Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '900px'
      }}>
        <div className="glass-interactive" style={{
          padding: '1.5rem',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Users size={28} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>15,000+</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Happy Active Patients</span>
        </div>

        <div className="glass-interactive" style={{
          padding: '1.5rem',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Calendar size={28} style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }} />
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>24/7</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instant Video Support</span>
        </div>

        <div className="glass-interactive" style={{
          padding: '1.5rem',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Heart size={28} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>10 Set</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Curated Organic Packages</span>
        </div>
      </div>
    </div>
  );
}
