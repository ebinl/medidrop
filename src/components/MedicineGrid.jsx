import React, { useState } from 'react';
import { ShoppingCart, Pill } from 'lucide-react';

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

export default function MedicineGrid({ onAddToCart, compactHeader = false }) {
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
    <section id="medicines" className={`medicines-section ${compactHeader ? 'medicines-section-compact' : ''}`}>
      {!compactHeader && (
        <div className="section-header medicines-header">
          <h2 className="section-title medicines-title">Select Homeopathic Remedies</h2>
          <p className="section-desc">
            Explore our doctor-recommended pure homeopathic organic dilutions. Check the minimum purchase quantities listed under each remedy before adding them to your cart.
          </p>
        </div>
      )}

      <div className="medicines-grid">
        {MEDICINES.map((med) => {
          const selectedQty = quantities[med.id] || med.minQuantity;

          return (
            <article key={med.id} className="glass-interactive med-card">
              <span className="med-category">{med.category}</span>

              <div>
                <div className="med-card-top">
                  <div className="med-bottle" aria-hidden="true">
                    <div className="med-bottle-neck" />
                    <div className="med-bottle-cap" />
                    <div className="med-bottle-label">
                      <Pill size={12} color="var(--primary)" strokeWidth={3} />
                      <div className="med-bottle-line" />
                      <span>HOMEOPATHY</span>
                    </div>
                    <div className="med-bottle-shine" />
                  </div>

                  <div className="med-card-titles">
                    <h3>{med.name}</h3>
                    <span>{med.scientificName}</span>
                  </div>
                </div>

                <p className="med-desc">{med.description}</p>

                <div className="med-benefits">
                  {med.benefits.map((benefit, i) => (
                    <div key={i} className="med-benefit">
                      <span>✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="med-price-row">
                  <div>
                    <span className="med-price-label">Unit Price</span>
                    <span className="med-price">₹{med.price}</span>
                  </div>
                  <div className="med-min-wrap">
                    <span className="badge badge-secondary med-min-badge">
                      Min Qty: {med.minQuantity}
                    </span>
                    <span className="med-min-hint">Required limit</span>
                  </div>
                </div>

                <div className="med-actions">
                  <div className="med-qty">
                    <button
                      type="button"
                      onClick={() => handleDecrement(med.id, med.minQuantity)}
                      disabled={selectedQty <= med.minQuantity}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{selectedQty}</span>
                    <button
                      type="button"
                      onClick={() => handleIncrement(med.id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(med, selectedQty)}
                    className="btn btn-primary med-add-btn"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
