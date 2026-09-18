import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { DEFAULT_MEDICINES, REMEDY_IMAGE } from '../data/defaultMedicines';
import {
  dedupeRemedies,
  getLocalCatalog,
  seedDefaultRemedies,
  subscribeRemedies,
  subscribeRemediesHeader,
} from '../services/remedies';

export { DEFAULT_MEDICINES as MEDICINES, REMEDY_IMAGE };

export default function MedicineGrid({ onAddToCart, compactHeader = false }) {
  const [medicines, setMedicines] = useState(() => getLocalCatalog());
  const [quantities, setQuantities] = useState(() =>
    DEFAULT_MEDICINES.reduce((acc, med) => ({ ...acc, [med.id]: med.minQuantity }), {})
  );
  const [headerSettings, setHeaderSettings] = useState({
    title: 'Select Homeopathic Remedies',
    description: 'Explore pure organic dilutions prepared with care. Check minimum quantities before adding remedies to your cart.',
  });
  const [expandedIds, setExpandedIds] = useState({});

  const distinctMedicines = useMemo(() => dedupeRemedies(medicines), [medicines]);

  // Only remedies marked Live are shown on the public website. Not Live remedies are hidden completely.
  const visibleMedicines = useMemo(
    () => distinctMedicines.filter((med) => med.isLive !== false),
    [distinctMedicines]
  );

  useEffect(() => {
    let cancelled = false;

    const unsubRemedies = subscribeRemedies(
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

    const unsubHeader = subscribeRemediesHeader(
      (data) => {
        if (cancelled) return;
        setHeaderSettings({
          title: data.title || 'Select Homeopathic Remedies',
          description: data.description || 'Explore pure organic dilutions prepared with care. Check minimum quantities before adding remedies to your cart.',
        });
      },
      (err) => {
        console.error('Failed to load remedies header:', err);
      }
    );

    seedDefaultRemedies().catch((err) => {
      console.error('Failed to seed remedies:', err);
    });

    return () => {
      cancelled = true;
      unsubRemedies();
      unsubHeader();
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
          <h2 className="section-title medicines-title">{headerSettings.title}</h2>
          <p className="section-desc">
            {headerSettings.description}
          </p>
        </div>
      )}

      <div className="medicines-grid">
        {visibleMedicines.map((med) => {
          const isOutOfStock = med.inStock === false || (med.stock != null && Number(med.stock) === 0);
          const selectedQty = quantities[med.id] || med.minQuantity;
          const isExpanded = !!expandedIds[med.id];

          return (
            <article
              key={`${med.id}-${med.name}`}
              className={`med-card ${isOutOfStock ? 'med-card-out-of-stock' : ''}`}
            >
              <div className="med-card-media">
                <span className="med-category">{med.category}</span>
                {isOutOfStock && (
                  <span className="med-out-of-stock-badge">
                    Out of Stock
                  </span>
                )}
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

                <div className="med-desc-wrap" style={{ display: 'flex', flexDirection: 'column' }}>
                  <p className={`med-desc ${isExpanded ? 'is-expanded' : 'is-clamped'}`}>
                    {med.description}
                  </p>
                  {med.description && med.description.length > 80 && (
                    <button
                      type="button"
                      className="med-desc-toggle"
                      onClick={() => setExpandedIds(prev => ({ ...prev, [med.id]: !prev[med.id] }))}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>

                <div className="med-benefits">
                  {(med.benefits || []).map((benefit) => (
                    <span key={benefit} className="med-benefit-chip">{benefit}</span>
                  ))}
                </div>

                <div className="med-card-footer">
                  <div className="med-price-block">
                    <span className="med-price-label">From</span>
                    <span className="med-price">₹{med.price}</span>
                    <span className="med-min-hint">
                      {isOutOfStock ? 'Out of stock' : `Min ${med.minQuantity} unit`}
                    </span>
                  </div>

                  <div className="med-actions">
                    <div className={`med-qty ${isOutOfStock ? 'med-qty-disabled' : ''}`}>
                      <button
                        type="button"
                        onClick={() => handleDecrement(med.id, med.minQuantity)}
                        disabled={isOutOfStock || selectedQty <= med.minQuantity}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{selectedQty}</span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(med.id)}
                        disabled={isOutOfStock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => !isOutOfStock && onAddToCart(med, selectedQty)}
                      disabled={isOutOfStock}
                      className={`btn med-add-btn ${isOutOfStock ? 'med-btn-out-of-stock' : 'btn-primary'}`}
                      title={isOutOfStock ? 'Currently out of stock' : 'Add to cart'}
                    >
                      {isOutOfStock ? (
                        <span>Out of Stock</span>
                      ) : (
                        <>
                          <ShoppingCart size={15} />
                          <span>Add</span>
                        </>
                      )}
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
