import React from 'react';

/**
 * HomeoBackgroundDrop
 * 
 * Embedded in the background image layer near the base:
 * - Authentic amber glass homeopathic remedy bottle in sloped position (~32°)
 * - White pharmacy label ("MEDI DROP · 30C") and dark ribbed dropper cap
 * - Vertical glass pipette tip dispensing clear water drops vertically
 * - Drops fall straight down onto a cluster of round white homeopathic globules
 * - Natural base shadow, ripples on globule impact, and medicated absorption glow
 */
export default function HomeoBackgroundDrop() {
  return (
    <div className="homeo-bg-drop-overlay" aria-hidden="true">
      <div className="homeo-bg-dropper-anchor">
        <svg
          className="homeo-bg-dropper-svg"
          viewBox="0 0 250 185"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Amber Glass Cylindrical Bottle Gradient */}
            <linearGradient id="realAmberBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#240c01" />
              <stop offset="14%" stopColor="#582103" />
              <stop offset="35%" stopColor="#a84f0e" />
              <stop offset="60%" stopColor="#d97520" />
              <stop offset="85%" stopColor="#7a3206" />
              <stop offset="100%" stopColor="#280e02" />
            </linearGradient>

            {/* Specular Cylindrical Glass Reflection Streak */}
            <linearGradient id="glassStreak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* White Medicine Label Gradient */}
            <linearGradient id="labelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#faf7f0" />
              <stop offset="100%" stopColor="#f0eae0" />
            </linearGradient>

            {/* Amber Liquid Column inside bottle */}
            <linearGradient id="liquidLevel" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(215, 125, 30, 0.88)" />
              <stop offset="50%" stopColor="rgba(255, 180, 70, 0.95)" />
              <stop offset="100%" stopColor="rgba(185, 90, 15, 0.88)" />
            </linearGradient>

            {/* Dropper Ribbed Black Cap */}
            <linearGradient id="dropperCapGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#101214" />
              <stop offset="35%" stopColor="#30363c" />
              <stop offset="70%" stopColor="#1e2226" />
              <stop offset="100%" stopColor="#0a0b0c" />
            </linearGradient>

            {/* Clear Borosilicate Glass Pipette */}
            <linearGradient id="clearGlassPipette" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="40%" stopColor="rgba(220, 245, 255, 0.4)" />
              <stop offset="75%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="100%" stopColor="rgba(175, 215, 235, 0.65)" />
            </linearGradient>

            {/* Water Droplet Radial Highlight */}
            <radialGradient id="waterDropRadial" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.92" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
            </radialGradient>

            {/* Round White Homeopathic Globule Radial (Center Sphere) */}
            <radialGradient id="whiteGlobuleCenter" cx="35%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fefcf8" />
              <stop offset="72%" stopColor="#eee7d7" />
              <stop offset="92%" stopColor="#d5ccb8" />
              <stop offset="100%" stopColor="#baa990" />
            </radialGradient>

            {/* Surrounding Round White Globules */}
            <radialGradient id="whiteGlobuleSide" cx="38%" cy="35%" r="62%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#fbf9f2" />
              <stop offset="75%" stopColor="#e6dfce" />
              <stop offset="95%" stopColor="#ccbfab" />
              <stop offset="100%" stopColor="#a89980" />
            </radialGradient>

            {/* Base Ground Shadow */}
            <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(30, 20, 10, 0.4)" />
              <stop offset="65%" stopColor="rgba(30, 20, 10, 0.12)" />
              <stop offset="100%" stopColor="rgba(30, 20, 10, 0)" />
            </radialGradient>

            <filter id="slopedDropGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ================= BASE GROUND SHADOWS ================= */}
          {/* Soft ambient ground shadow */}
          <ellipse cx="180" cy="154" rx="28" ry="6" fill="url(#groundShadow)" opacity="0.25" />
          {/* Globule cluster ground shadows */}
          <ellipse cx="75" cy="166" rx="44" ry="10" fill="url(#groundShadow)" />
          <ellipse cx="50" cy="164" rx="22" ry="7" fill="url(#groundShadow)" />
          <ellipse cx="102" cy="164" rx="24" ry="7" fill="url(#groundShadow)" />

          {/* ================= ROUND WHITE GLOBULES (Cluster Near Base) ================= */}
          <g className="homeo-globules-cluster">
            {/* Background Globules */}
            <circle cx="50" cy="156" r="10.5" fill="url(#whiteGlobuleSide)" />
            <circle cx="48" cy="153" r="2.8" fill="rgba(255,255,255,0.75)" />

            <circle cx="100" cy="156" r="11" fill="url(#whiteGlobuleSide)" />
            <circle cx="98" cy="153" r="3" fill="rgba(255,255,255,0.75)" />

            <circle cx="36" cy="160" r="8" fill="url(#whiteGlobuleSide)" />
            <circle cx="114" cy="159" r="8.5" fill="url(#whiteGlobuleSide)" />

            <circle cx="62" cy="161" r="9.5" fill="url(#whiteGlobuleSide)" />
            <circle cx="89" cy="161" r="10" fill="url(#whiteGlobuleSide)" />

            {/* MAIN TARGET ROUND WHITE GLOBULE (Under vertical dropper) */}
            <circle
              className="target-main-globule"
              cx="75"
              cy="150"
              r="14.5"
              fill="url(#whiteGlobuleCenter)"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="0.75"
            />
            {/* Spherical Glossy Highlights */}
            <ellipse cx="70.5" cy="145" rx="5" ry="3.5" fill="rgba(255,255,255,0.85)" />
            <circle cx="69" cy="143.5" r="1.8" fill="#ffffff" />

            {/* Water Impact Ripples across the round white globule */}
            <ellipse
              className="water-ripple ripple-1"
              cx="75"
              cy="147"
              rx="4"
              ry="2"
              fill="none"
              stroke="rgba(56, 189, 248, 0.95)"
              strokeWidth="1.5"
            />
            <ellipse
              className="water-ripple ripple-2"
              cx="75"
              cy="147"
              rx="4"
              ry="2"
              fill="none"
              stroke="rgba(125, 211, 252, 0.7)"
              strokeWidth="1.2"
            />

            {/* Medicated absorption sheen glowing through the white globules */}
            <circle
              className="globule-absorption-glow"
              cx="75"
              cy="150"
              r="18"
              fill="rgba(186, 230, 253, 0.45)"
            />

            {/* Splash micro-droplets */}
            <circle className="splash-droplet splash-left" cx="68" cy="143" r="1.2" fill="#e0f2fe" />
            <circle className="splash-droplet splash-right" cx="82" cy="143" r="1.2" fill="#e0f2fe" />
            <circle className="splash-droplet splash-top" cx="75" cy="138" r="1.1" fill="#e0f2fe" />
          </g>

          {/* ================= VERTICAL FALLING WATER DROP ================= */}
          <g className="falling-water-drop-group">
            {/* Teardrop falls straight down vertically from nozzle at y=120 to globule at y=147 */}
            <path
              className="falling-water-drop"
              d="M 75,120 C 72.5,123.5 71,126.5 71,130 A 4,4 0 1,0 79,130 C 79,126.5 77.5,123.5 75,120 Z"
              fill="url(#waterDropRadial)"
              filter="url(#slopedDropGlow)"
            />
            <circle cx="73.8" cy="128.5" r="1.1" fill="#ffffff" opacity="0.95" />
          </g>

          {/* ================= SLOPED AMBER BOTTLE (Tilted near base) ================= */}
          <g className="homeo-sloped-bottle-group">
            {/* Sloped bottle body tilted at ~32° angle resting near base */}
            <g transform="translate(90, 106) rotate(-32)">
              {/* Amber Glass Cylinder Body */}
              <rect x="22" y="-23" width="98" height="46" rx="10" fill="url(#realAmberBody)" />
              {/* Glass Cylinder Highlight Streak */}
              <rect x="24" y="-19" width="94" height="13" rx="4" fill="url(#glassStreak)" />

              {/* Liquid Medicine Level inside amber bottle */}
              <rect x="26" y="-15" width="84" height="30" rx="6" fill="url(#liquidLevel)" opacity="0.8" />

              {/* Natural Amber Glass Base (Rounded Bottom - No Black Cap/Bulb) */}
              <path
                d="M 112,-23 C 120,-22 124,-13 124,0 C 124,13 120,22 112,23 Z"
                fill="url(#realAmberBody)"
              />
              {/* Amber Glass Base Rim Contour & Specular Highlight */}
              <path
                d="M 115,-18 C 120,-10 120,10 115,18"
                stroke="rgba(255, 205, 125, 0.4)"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 117,-12 C 121,-6 121,6 117,12"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
              />

              {/* White Pharmacy Medicine Label on Bottle Body */}
              <rect x="36" y="-17" width="56" height="34" rx="3" fill="url(#labelGrad)" stroke="#c5a870" strokeWidth="0.8" />
              {/* Label Gold Accent Lines */}
              <line x1="40" y1="-13" x2="88" y2="-13" stroke="#b89345" strokeWidth="0.7" />
              <line x1="40" y1="13" x2="88" y2="13" stroke="#b89345" strokeWidth="0.7" />
              {/* Label Brand Header */}
              <text x="64" y="-3" fill="#1b1d20" fontSize="6.2" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.4">
                MEDI DROP
              </text>
              {/* Label Potency Subtext */}
              <text x="64" y="5" fill="#0284c7" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                DILUTION · 30C
              </text>
              <text x="64" y="10" fill="#64748b" fontSize="3" fontFamily="sans-serif" textAnchor="middle">
                ORGANIC POTENCY
              </text>

              {/* Bottle Rounded Shoulder */}
              <path d="M 22,-23 C 14,-19 8,-13 6,-7 L 0,-7 L 0,7 L 6,7 C 8,13 14,19 22,23 Z" fill="url(#realAmberBody)" />

              {/* Glass Neck */}
              <rect x="-4" y="-8.5" width="8" height="17" rx="2" fill="#2c0f02" />

              {/* Ribbed Dropper Cap / Collar */}
              <rect x="-11" y="-11" width="9" height="22" rx="2" fill="url(#dropperCapGrad)" stroke="#1a202c" strokeWidth="0.6" />
              <line x1="-9" y1="-9" x2="-9" y2="9" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
              <line x1="-6.5" y1="-9" x2="-6.5" y2="9" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
              <line x1="-4" y1="-9" x2="-4" y2="9" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
            </g>

            {/* Clear Borosilicate Glass Pipette extending from cap and pointing down vertically */}
            <path
              d="M 88,103 C 83,105 80,108 77.5,111 L 73,111 C 75.5,107 79,103 85,100 Z"
              fill="url(#clearGlassPipette)"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.75"
            />

            {/* Vertical glass dropper nozzle pointing straight down towards white globules */}
            <path
              d="M 73,111 L 77,111 L 76.2,120 C 76,120.8 75.6,121 75,121 C 74.4,121 74,120.8 73.8,120 Z"
              fill="url(#clearGlassPipette)"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.75"
            />

            {/* Medicine Liquid inside vertical nozzle tip */}
            <line
              x1="75"
              y1="111"
              x2="75"
              y2="119.5"
              stroke="rgba(235, 155, 55, 0.95)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Pipette vertical reflection glint */}
            <line
              x1="73.8"
              y1="111"
              x2="74"
              y2="119"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth="0.7"
              strokeLinecap="round"
            />

            {/* Swelling Water Droplet at vertical nozzle tip (before release) */}
            <path
              className="droplet-forming-tip"
              d="M 75,120 C 73,122 72,124 72,126 A 3,3 0 1,0 78,126 C 78,124 77,122 75,120 Z"
              fill="url(#waterDropRadial)"
            />
            <circle
              className="droplet-forming-glint"
              cx="74.2"
              cy="125"
              r="0.9"
              fill="#ffffff"
              opacity="0.9"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
