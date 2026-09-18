import React from 'react';

/**
 * HomeoDropperAnimation
 * 
 * Realistic homeopathic preparation animation:
 * A pharmaceutical glass dropper bottle positioned vertically,
 * forming a droplet of potentized liquid dilution, dropping it vertically
 * onto a pristine white homeopathic lactose tablet, creating water ripples
 * and medicated absorption.
 */
export default function HomeoDropperAnimation({ 
  className = '', 
  compact = false,
  showCard = true,
  label = 'Classical Homeopathic Potency'
}) {
  return (
    <div className={`homeo-dropper-container ${compact ? 'compact' : ''} ${className}`}>
      {showCard ? (
        <div className="homeo-dropper-card glass">
          <div className="homeo-dropper-badge">
            <span className="dropper-pulse-dot" />
            <span className="dropper-badge-text">{label}</span>
          </div>

          <div className="homeo-dropper-stage" aria-label="Glass bottle dropping water vertically onto white homeopathic tablet">
            <DropperSvg />
          </div>

          <div className="homeo-dropper-caption">
            <span className="dropper-caption-title">Pure Hahnemannian Potentization</span>
            <span className="dropper-caption-sub">Precise medicated drops on organic lactose globules</span>
          </div>
        </div>
      ) : (
        <div className="homeo-dropper-stage" aria-label="Glass bottle dropping water vertically onto white homeopathic tablet">
          <DropperSvg />
        </div>
      )}
    </div>
  );
}

function DropperSvg() {
  return (
    <svg 
      className="homeo-dropper-svg" 
      viewBox="0 0 160 260" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Amber glass bottle body gradient */}
        <linearGradient id="amberBottleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4e2006" />
          <stop offset="25%" stopColor="#b45814" />
          <stop offset="60%" stopColor="#8d3d09" />
          <stop offset="90%" stopColor="#5c2607" />
          <stop offset="100%" stopColor="#301202" />
        </linearGradient>

        {/* Amber glass bottle specular streak */}
        <linearGradient id="bottleSpecular" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        {/* Dropper bulb gradient (black silicone) */}
        <linearGradient id="bulbGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e2225" />
          <stop offset="40%" stopColor="#3d444a" />
          <stop offset="70%" stopColor="#252a2f" />
          <stop offset="100%" stopColor="#121517" />
        </linearGradient>

        {/* Dropper metallic ribbed collar */}
        <linearGradient id="collarGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#282218" />
          <stop offset="35%" stopColor="#cda85a" />
          <stop offset="55%" stopColor="#fae7a6" />
          <stop offset="75%" stopColor="#b88f3a" />
          <stop offset="100%" stopColor="#1f180f" />
        </linearGradient>

        {/* Glass pipette body (transparent borosilicate) */}
        <linearGradient id="pipetteGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(220, 240, 255, 0.45)" />
          <stop offset="30%" stopColor="rgba(255, 255, 255, 0.85)" />
          <stop offset="60%" stopColor="rgba(180, 220, 245, 0.25)" />
          <stop offset="100%" stopColor="rgba(140, 190, 220, 0.55)" />
        </linearGradient>

        {/* Liquid dilution inside pipette */}
        <linearGradient id="pipetteLiquidGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(215, 140, 50, 0.8)" />
          <stop offset="50%" stopColor="rgba(245, 185, 95, 0.95)" />
          <stop offset="100%" stopColor="rgba(180, 105, 30, 0.85)" />
        </linearGradient>

        {/* Pure water droplet gradient */}
        <radialGradient id="waterDropGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#b3e5fc" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#4fc3f7" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0288d1" stopOpacity="0.65" />
        </radialGradient>

        {/* White homeopathic tablet gradient */}
        <radialGradient id="whiteTabletGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#faf7f0" />
          <stop offset="85%" stopColor="#eae4d4" />
          <stop offset="100%" stopColor="#d5cebe" />
        </radialGradient>

        {/* Tablet side rim shading */}
        <linearGradient id="tabletSideGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eae4d4" />
          <stop offset="100%" stopColor="#b5ac99" />
        </linearGradient>

        {/* Pill shadow */}
        <radialGradient id="tabletShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(40, 30, 20, 0.35)" />
          <stop offset="60%" stopColor="rgba(40, 30, 20, 0.15)" />
          <stop offset="100%" stopColor="rgba(40, 30, 20, 0)" />
        </radialGradient>

        {/* Glass Glow Filter */}
        <filter id="glassGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="dropGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ================= TABLET GROUND SHADOW ================= */}
      <ellipse cx="80" cy="228" rx="46" ry="12" fill="url(#tabletShadow)" />

      {/* ================= WHITE TABLET (BOTTOM) ================= */}
      <g className="homeo-tablet-group">
        {/* Tablet base / thickness */}
        <path
          d="M 38,206 C 38,198 57,192 80,192 C 103,192 122,198 122,206 L 122,216 C 122,224 103,230 80,230 C 57,230 38,224 38,216 Z"
          fill="url(#tabletSideGrad)"
        />

        {/* Tablet top face (Pure white homeopathic globule/tablet) */}
        <ellipse 
          cx="80" 
          cy="206" 
          rx="42" 
          ry="15" 
          fill="url(#whiteTabletGrad)" 
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="1"
        />

        {/* Tablet central pharmaceutical score line */}
        <path 
          d="M 52,206 C 65,208 95,208 108,206" 
          stroke="#d2cab9" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          opacity="0.75"
        />

        {/* Tablet top specular sheen */}
        <ellipse 
          cx="76" 
          cy="202" 
          rx="32" 
          ry="9" 
          fill="rgba(255,255,255,0.4)" 
        />

        {/* Ripple Effect on Tablet (Animated on droplet impact) */}
        <ellipse 
          className="water-ripple ripple-1" 
          cx="80" 
          cy="205" 
          rx="6" 
          ry="3" 
          fill="none" 
          stroke="rgba(41, 182, 246, 0.85)" 
          strokeWidth="1.8" 
        />
        <ellipse 
          className="water-ripple ripple-2" 
          cx="80" 
          cy="205" 
          rx="6" 
          ry="3" 
          fill="none" 
          stroke="rgba(79, 195, 247, 0.65)" 
          strokeWidth="1.4" 
        />
        <ellipse 
          className="water-ripple ripple-3" 
          cx="80" 
          cy="205" 
          rx="6" 
          ry="3" 
          fill="none" 
          stroke="rgba(129, 212, 250, 0.45)" 
          strokeWidth="1" 
        />

        {/* Medicated absorption glow spreading across tablet */}
        <ellipse 
          className="tablet-absorption-glow" 
          cx="80" 
          cy="206" 
          rx="36" 
          ry="13" 
          fill="rgba(186, 230, 253, 0.4)" 
        />

        {/* Splash micro-droplets on impact */}
        <circle className="splash-droplet splash-left" cx="68" cy="198" r="1.6" fill="#e0f2fe" />
        <circle className="splash-droplet splash-right" cx="92" cy="199" r="1.4" fill="#e0f2fe" />
        <circle className="splash-droplet splash-top" cx="80" cy="192" r="1.5" fill="#e0f2fe" />
      </g>

      {/* ================= FALLING WATER DROP ================= */}
      <g className="falling-water-drop-group">
        {/* Detaching & Falling teardrop */}
        <path
          className="falling-water-drop"
          d="M 80,118 C 76.5,123 74,128 74,133 A 6,6 0 1,0 86,133 C 86,128 83.5,123 80,118 Z"
          fill="url(#waterDropGrad)"
          filter="url(#dropGlow)"
        />
        {/* Specular glint on falling droplet */}
        <circle 
          className="falling-drop-glint" 
          cx="78" 
          cy="131" 
          r="1.8" 
          fill="#ffffff" 
          opacity="0.95" 
        />
      </g>

      {/* ================= GLASS BOTTLE & DROPPER (TOP) ================= */}
      <g className="homeo-bottle-group">
        {/* Glass Bottle Body (Amber Glass) */}
        <path
          d="M 50,0 L 110,0 C 113,0 115,2 115,6 L 115,36 C 115,48 102,56 94,59 L 94,66 C 94,68 92,70 90,70 L 70,70 C 68,70 66,68 66,66 L 66,59 C 58,56 45,48 45,36 L 45,6 C 45,2 47,0 50,0 Z"
          fill="url(#amberBottleGrad)"
        />

        {/* Bottle light reflections */}
        <path
          d="M 52,4 L 56,4 L 56,42 C 56,48 64,54 70,56 L 67,58 C 60,56 52,49 52,42 Z"
          fill="url(#bottleSpecular)"
        />

        {/* Bottle Shoulder Highlight */}
        <path
          d="M 50,8 L 110,8"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
        />

        {/* Rubber Bulb (Top Pipette Bulb) */}
        <path
          d="M 64,52 C 64,44 71,38 80,38 C 89,38 96,44 96,52 L 95,68 L 65,68 Z"
          fill="url(#bulbGrad)"
        />
        {/* Bulb highlight */}
        <path
          d="M 69,50 C 71,46 76,43 80,43"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Gold Ribbed Collar / Cap */}
        <rect x="62" y="66" width="36" height="12" rx="2.5" fill="url(#collarGrad)" stroke="#1a1408" strokeWidth="0.75" />
        <line x1="68" y1="67" x2="68" y2="77" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
        <line x1="74" y1="67" x2="74" y2="77" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
        <line x1="80" y1="67" x2="80" y2="77" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
        <line x1="86" y1="67" x2="86" y2="77" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
        <line x1="92" y1="67" x2="92" y2="77" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />

        {/* Transparent Borosilicate Glass Pipette Tube */}
        <path
          d="M 72,78 L 88,78 L 86,108 C 85,113 83,116 82,118 L 78,118 C 77,116 75,113 74,108 Z"
          fill="url(#pipetteGlassGrad)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="0.8"
        />

        {/* Liquid medicine column inside pipette */}
        <path
          d="M 74,80 L 86,80 L 84,106 C 83,111 82,114 81.5,116 L 78.5,116 C 78,114 77,111 76,106 Z"
          fill="url(#pipetteLiquidGrad)"
        />

        {/* Pipette glass reflection streak */}
        <line
          x1="74"
          y1="80"
          x2="75.5"
          y2="114"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Nozzle Droplet Forming at Tip (Swells before releasing) */}
        <path
          className="droplet-forming-tip"
          d="M 80,118 C 77,121 75,124 75,127 A 5,5 0 1,0 85,127 C 85,124 83,121 80,118 Z"
          fill="url(#waterDropGrad)"
        />
        <circle 
          className="droplet-forming-glint" 
          cx="78.5" 
          cy="125.5" 
          r="1.2" 
          fill="#ffffff" 
          opacity="0.9" 
        />
      </g>
    </svg>
  );
}
