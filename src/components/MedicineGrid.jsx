import React, { useState } from 'react';
import { ShoppingCart, Pill, Shield, Award, Layers } from 'lucide-react';

export const MEDICINES = [
  {
    id: 1,
    name: "Arnica Montana 30C",
    scientificName: "Arnica Montana (Mountain Daisy)",
    category: "Pain Relief & Healing",
    description: "Highly effective natural remedy for relieving muscle aches, bruises, joint stiffness, and recovery after minor physical strain.",
    price: 180,
    minQuantity: 1,
    benefits: ["Relieves muscle soreness", "Accelerates bruise recovery", "Reduces joint inflammation"]
  },
  {
    id: 2,
    name: "Nux Vomica 200C",
    scientificName: "Strychnos Nux-Vomica (Poison Nut)",
    category: "Digestive Care",
    description: "Ideal homeopathic solution for severe acidity, stomach bloating, indigestion, hangovers, and general gastric discomfort.",
    price: 150,
    minQuantity: 1,
    benefits: ["Relieves acid reflux & bloating", "Soothes gastric irritation", "Eases hangover nausea"]
  },
  {
    id: 3,
    name: "Aconitum Napellus 30C",
    scientificName: "Aconitum Napellus (Monkshood)",
    category: "Cold & Cough",
    description: "The primary homeopathic choice for acute sudden-onset chills, dry tickly coughs, and cold symptoms triggered by dry winds.",
    price: 160,
    minQuantity: 1,
    benefits: ["Soothes sudden-onset cold", "Calms tickly dry coughs", "Eases respiratory tension"]
  },
  {
    id: 4,
    name: "Bryonia Alba 200C",
    scientificName: "Bryonia Alba (White Bryony)",
    category: "Joint & Rheumatic Pain",
    description: "Indicated for sharp joint pain, stiffness, and body soreness that is aggravated by movement and relieved by rest.",
    price: 190,
    minQuantity: 1,
    benefits: ["Relieves sharp joint pains", "Eases muscle stiffness", "Reduces movement pain"]
  },
  {
    id: 5,
    name: "Rhus Toxicodendron 30C",
    scientificName: "Rhus Toxicodendron (Poison Ivy)",
    category: "Sprains & Strains",
    description: "Promotes restoration and relieves tearing pain in ligaments, tendons, and muscles. Works best for pain relieved by continuous motion.",
    price: 175,
    minQuantity: 1,
    benefits: ["Eases lower back pain", "Restores sprained ligaments", "Relieves stiff joints"]
  },
  {
    id: 6,
    name: "Gelsemium 200C",
    scientificName: "Gelsemium Sempervirens (Yellow Jasmine)",
    category: "Stress & Fatigue",
    description: "Specially formulated to address mental fatigue, stage fright, dull headaches, performance anxiety, and physical weakness.",
    price: 210,
    minQuantity: 1,
    benefits: ["Reduces performance anxiety", "Alleviates tension headaches", "Relieves nervous trembling"]
  },
  {
    id: 7,
    name: "Chamomilla 30C",
    scientificName: "Matricaria Chamomilla (German Chamomile)",
    category: "Pediatric & Colic Care",
    description: "Gentle natural soothing drops suitable for children experiencing teething irritation, colic cramps, and associated restlessness.",
    price: 145,
    minQuantity: 1,
    benefits: ["Calms teething discomfort", "Relieves abdominal colic", "Soothes emotional irritability"]
  },
  {
    id: 8,
    name: "Apis Mellifica 30C",
    scientificName: "Apis Mellifica (Honeybee extract)",
    category: "Allergies & Skin Rashes",
    description: "Quick relief for insect bites, red hives, allergic skin swellings, burning rashes, and heat-induced stings.",
    price: 185,
    minQuantity: 1,
    benefits: ["Soothes stinging insect bites", "Reduces hives & puffiness", "Cools burning skin allergies"]
  },
  {
    id: 9,
    name: "Allium Cepa 30C",
    scientificName: "Allium Cepa (Red Onion)",
    category: "Allergic Rhinitis",
    description: "Perfect remedy for seasonal hay fever, runny nose with burning nasal discharge, sneezing, and watery, irritated eyes.",
    price: 155,
    minQuantity: 1,
    benefits: ["Relieves constant sneezing", "Soothes burning runny nose", "Calms watery itchy eyes"]
  },
  {
    id: 10,
    name: "Thuja Occidentalis 200C",
    scientificName: "Thuja Occidentalis (Arbor Vitae)",
    category: "Skin Tag & Wart Care",
    description: "Reputed homeopathic remedy for painless wart removal, flattening skin tags, fading blemishes, and clearing chronic skin issues.",
    price: 220,
    minQuantity: 1,
    benefits: ["Aids in painless wart removal", "Flattens skin tags & nodules", "Purifies skin blemishes"]
  }
];

export default function MedicineGrid({ onAddToCart }) {
  // Store quantities for each card individually
  const [quantities, setQuantities] = useState(
    MEDICINES.reduce((acc, med) => ({ ...acc, [med.id]: med.minQuantity }), {})
  );

  const handleIncrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id, minLimit) => {
    setQuantities(prev => {
      if (prev[id] <= minLimit) return prev;
      return { ...prev, [id]: prev[id] - 1 };
    });
  };

  return (
    <div id="medicines" style={{
      padding: '5rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Grid Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Select Homeopathic Remedies
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Explore our doctor-recommended pure homeopathic organic dilutions. Check the minimum purchase quantities listed under each remedy before adding them to your cart.
        </p>
      </div>

      {/* Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {MEDICINES.map((med) => {
          const selectedQty = quantities[med.id] || med.minQuantity;

          return (
            <div key={med.id} className="glass-interactive" style={{
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Category tag */}
              <div style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--primary)',
                background: 'var(--primary-tint)',
                padding: '0.25rem 0.65rem',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {med.category}
              </div>

              {/* Medicine visual and Name */}
              <div>
                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', marginTop: '0.5rem' }}>
                  {/* Premium CSS Homeopathy Bottle Illustration */}
                  <div style={{
                    position: 'relative',
                    width: '60px',
                    height: '80px',
                    background: 'linear-gradient(to bottom, #d97706 0%, #78350f 100%)', // Amber glass bottle gradient
                    borderRadius: '8px 8px 12px 12px',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    paddingBottom: '8px'
                  }}>
                    {/* Bottle Neck */}
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      width: '20px',
                      height: '10px',
                      background: '#78350f',
                      borderRadius: '3px 3px 0 0'
                    }} />
                    {/* Bottle Cap (White Dropper Cap) */}
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      width: '24px',
                      height: '10px',
                      background: '#f8fafc',
                      borderRadius: '5px 5px 2px 2px',
                      boxShadow: '0 -2px 5px rgba(255,255,255,0.2)'
                    }} />
                    {/* Bottle Label (White/Green Clinic label) */}
                    <div style={{
                      width: '46px',
                      height: '38px',
                      background: '#f8fafc',
                      borderRadius: '3px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px',
                      zIndex: 2,
                      marginBottom: '6px'
                    }}>
                      <Pill size={12} color="var(--primary)" strokeWidth={3} />
                      <div style={{
                        width: '32px',
                        height: '2px',
                        background: 'var(--primary)',
                        marginTop: '2px'
                      }} />
                      <span style={{ fontSize: '0.45rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                        HOMEOPATHY
                      </span>
                    </div>
                    {/* Fluid level shine */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '4px',
                      width: '4px',
                      height: '56px',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '2px',
                      pointerEvents: 'none'
                    }} />
                  </div>

                  {/* Title details */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                      {med.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {med.scientificName}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.25rem',
                  height: '60px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {med.description}
                </p>

                {/* Benefits Bullet points */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  marginBottom: '1.5rem',
                  background: 'rgba(0,0,0,0.15)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.02)'
                }}>
                  {med.benefits.map((benefit, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action row */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  borderTop: '1px solid var(--card-border)',
                  paddingTop: '1rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit Price</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{med.price}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span className="badge badge-secondary" style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.5rem',
                      fontWeight: 700,
                      boxShadow: '0 0 10px rgba(251,191,36,0.15)',
                      marginBottom: '0.25rem'
                    }}>
                      Min Qty: {med.minQuantity}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Required limit</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}>
                  {/* Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    padding: '0.35rem 0.5rem',
                    background: 'rgba(0,0,0,0.2)'
                  }}>
                    <button
                      onClick={() => handleDecrement(med.id, med.minQuantity)}
                      disabled={selectedQty <= med.minQuantity}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: selectedQty <= med.minQuantity ? 'var(--text-muted)' : 'var(--text-primary)',
                        width: '28px',
                        height: '28px',
                        fontSize: '1.2rem',
                        cursor: selectedQty <= med.minQuantity ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px'
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      width: '28px',
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      color: 'var(--primary)'
                    }}>
                      {selectedQty}
                    </span>
                    <button
                      onClick={() => handleIncrement(med.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        width: '28px',
                        height: '28px',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px'
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => onAddToCart(med, selectedQty)}
                    className="btn btn-primary"
                    style={{
                      flexGrow: 1,
                      padding: '0.7rem'
                    }}
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
