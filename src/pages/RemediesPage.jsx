import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import MedicineGrid from '../components/MedicineGrid';

export default function RemediesPage({ onAddToCart }) {
  return (
    <div className="remedies-page">
      <section className="remedies-hero">
        <div className="remedies-hero-inner">
          <div className="remedies-hero-meta">
            <Link to="/" className="remedies-back">
              <ArrowLeft size={15} strokeWidth={2.25} />
              <span>Back to Home</span>
            </Link>
            <span className="remedies-meta-dot" aria-hidden="true" />
            <div className="remedies-hero-badge">
              <Leaf size={13} strokeWidth={2.25} />
              <span>Pure Homeopathic Catalog</span>
            </div>
          </div>
          <h1>Homeopathic Remedies</h1>
          <p>
            Explore doctor-recommended organic dilutions. Check minimum quantities on each remedy before adding to your cart.
          </p>
        </div>
      </section>

      <MedicineGrid onAddToCart={onAddToCart} compactHeader />
    </div>
  );
}
