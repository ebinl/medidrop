import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { DEFAULT_MEDICINES, REMEDY_IMAGE } from '../data/defaultMedicines';
import {
  dedupeRemedies,
  getLocalCatalog,
  seedDefaultRemedies,
  subscribeRemedies,
} from '../services/remedies';

export { DEFAULT_MEDICINES as MEDICINES, REMEDY_IMAGE };

export default function MedicineGrid({ onAddToCart, compactHeader = false }) {
  const [medicines, setMedicines] = useState(() => getLocalCatalog());
  const [quantities, setQuantities] = useState(() =>
    DEFAULT_MEDICINES.reduce((acc, med) => ({ ...acc, [med.id]: med.minQuantity }), {})
  );

  const distinctMedicines = useMemo(() => dedupeRemedies(medicines), [medicines]);

  useEffect(() => {
    let cancelled = false;

    const unsub = subscribeRemedies(
      (items) => {
        if (cancelled) return;
        const distinct = dedupeRemedies(items);
        setMedicines(distinct.length > 0 ? distinct : getLocalCatalog());
      },
      (err) => {
        console.error('Failed to load remedies:', err);
        if (!cancelled) setMedicines(getLocalCatalog());
      }
    );

    seedDefaultRemedies().catch((err) => {
      console.error('Failed to seed remedies:', err);
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  useEffect(() => {
    setQuantities((prev) => {
      const next = { ...prev };
      let changed = false;
      distinctMedicines.forEach((med) => {
        if (next[med.id] == null) {
          next[med.id] = med.minQuantity;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [distinctMedicines]);

  const handleIncrement = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const handleDecrement = (id, minLimit) => {
    setQuantities((prev) => {
      if ((prev[id] || minLimit) <= minLimit) return prev;
      return { ...prev, [id]: prev[id] - 1 };
    });
  };

  return (
    <section id="medicines" className={`medicines-section ${compactHeader ? 'medicines-section-compact' : ''}`}>
      {!compactHeader && (
        <div className="section-header medicines-header">
          <span className="section-eyebrow">Doctor Recommended</span>
          <h2 className="section-title medicines-title">Select Homeopathic Remedies</h2>
          <p className="section-desc">
            Explore pure organic dilutions prepared with care. Check minimum quantities before adding remedies to your cart.
          </p>
        </div>
      )}

      <div className="medicines-grid">
        {distinctMedicines.map((med) => {
          const selectedQty = quantities[med.id] || med.minQuantity;

          return (
            <article key={`${med.id}-${med.name}`} className="med-card">
              <div className="med-card-media">
                <span className="med-category">{med.category}</span>
                <img
                  src={med.image || REMEDY_IMAGE}
                  alt=""
                  className="med-product-img"
                  loading="lazy"
                />
              </div>

              <div className="med-card-body">
                <div className="med-card-titles">
                  <h3>{med.name}</h3>
                  <span>{med.scientificName}</span>
                </div>

                <p className="med-desc">{med.description}</p>

                <div className="med-benefits">
                  {(med.benefits || []).map((benefit) => (
                    <span key={benefit} className="med-benefit-chip">{benefit}</span>
                  ))}
                </div>

                <div className="med-card-footer">
                  <div className="med-price-block">
                    <span className="med-price-label">From</span>
                    <span className="med-price">₹{med.price}</span>
                    <span className="med-min-hint">Min {med.minQuantity} unit</span>
                  </div>

                  <div className="med-actions">
                    <div className="med-qty">
                      <button
                        type="button"
                        onClick={() => handleDecrement(med.id, med.minQuantity)}
                        disabled={selectedQty <= med.minQuantity}
                        aria-label="Decrease quantity"
                      >
                        −
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
                      <ShoppingCart size={15} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
