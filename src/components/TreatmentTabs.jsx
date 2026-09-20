import React, { useState } from 'react';
import { ShoppingCart, Sparkles, ChevronRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CLINIC_PHONE } from '../config/clinic';

/* ── Treatment catalogue ─────────────────────────────────────────────── */
export const TREATMENT_TABS = [
  {
    id: 'pcod',
    label: 'PCOD / PCOS',
    emoji: '🌸',
    tagline: 'Hormonal balance & cycle regulation',
    description:
      'Homeopathic treatment for PCOD focuses on restoring endocrine equilibrium, naturally regularising menstrual cycles, reducing ovarian cysts, and clearing hormonal acne and metabolic weight gain without synthetic hormones.',
    color: '#E28300',
    image: '/treatments/pcod.jpg',
    imageAlt: 'Woman in peaceful wellness and vitality representing PCOD recovery',
    symptoms: ['Irregular Periods', 'Ovarian Cysts', 'Hormonal Acne', 'Metabolic Weight Gain'],
    remedies: [
      {
        name: 'Pulsatilla 200C',
        potency: '200C',
        use: 'Irregular or delayed periods, hormonal mood shifts, and gentle constitutional support.',
      },
      {
        name: 'Sepia 200C',
        potency: '200C',
        use: 'Pelvic heaviness, uterine sluggishness, and fatigue associated with hormonal imbalance.',
      },
      {
        name: 'Calcarea Carbonica 200C',
        potency: '200C',
        use: 'Metabolic sluggishness with PCOD, slow metabolism, and cold intolerance.',
      },
      {
        name: 'Natrum Muriaticum 200C',
        potency: '200C',
        use: 'Irregular menstrual rhythm linked to emotional stress, exhaustion, and migraines.',
      },
    ],
  },
  {
    id: 'migraine',
    label: 'Migraine',
    emoji: '🧠',
    tagline: 'Pulsating headache & aura relief',
    description:
      'Homeopathic remedies for migraine target individual vascular and nervous triggers — whether triggered by stress, digestive upset, light, or hormones — providing deep constitutional relief from debilitating attacks.',
    color: '#6B0512',
    image: '/treatments/migraine.jpg',
    imageAlt: 'Woman finding soothing relief from throbbing migraine headache',
    symptoms: ['Throbbing Headache', 'Visual Aura & Photophobia', 'Nausea & Vomiting', 'Stress & Neck Strain'],
    remedies: [
      {
        name: 'Belladonna 200C',
        potency: '200C',
        use: 'Sudden, violent throbbing headache with heat, flushed face, and intense light sensitivity.',
      },
      {
        name: 'Iris Versicolor 30C',
        potency: '30C',
        use: 'Periodic sick headaches accompanied by sour vomiting, blurred vision, and burning sensation.',
      },
      {
        name: 'Spigelia 200C',
        potency: '200C',
        use: 'Left-sided acute neuralgic headache centered around the eye and temple with palpitations.',
      },
      {
        name: 'Sanguinaria 200C',
        potency: '200C',
        use: 'Right-sided migraine starting from the occiput, settling over the right eye.',
      },
    ],
  },
  {
    id: 'thyroid',
    label: 'Thyroid',
    emoji: '🦋',
    tagline: 'Hypo & hyperthyroid management',
    description:
      'Constitutional homeopathic care for thyroid dysfunctions supports the endocrine system gently, helping balance metabolism, reduce chronic fatigue, stabilize body weight, and alleviate mood and hair fall symptoms.',
    color: '#2563eb',
    image: '/treatments/thyroid.jpg',
    imageAlt: 'Woman enjoying balanced energy and wellness through thyroid care',
    symptoms: ['Metabolic Sluggishness', 'Chronic Fatigue', 'Unexplained Weight Shifts', 'Hair Thinning & Dryness'],
    remedies: [
      {
        name: 'Iodum 200C',
        potency: '200C',
        use: 'Hyperthyroid tendencies with rapid metabolism, restlessness, and excessive warmth.',
      },
      {
        name: 'Calcarea Carbonica 1M',
        potency: '1M',
        use: 'Hypothyroidism with lethargy, cold sensitivity, and persistent metabolic weight gain.',
      },
      {
        name: 'Lycopus Virginicus 30C',
        potency: '30C',
        use: 'Heart fluttering, palpitations, and nervous tension linked to thyroid hyperactivity.',
      },
      {
        name: 'Thyroidinum 3X',
        potency: '3X',
        use: 'Supportive bio-energetic glandular remedy aiding overall metabolic balance.',
      },
    ],
  },
  {
    id: 'diabetes',
    label: 'Diabetes',
    emoji: '🩸',
    tagline: 'Blood sugar & pancreas support',
    description:
      'Homeopathy complements lifestyle therapy by supporting pancreatic and liver efficiency, managing glucose metabolism, curbing diabetic exhaustion, and helping protect against neuropathy and microvascular fatigue.',
    color: '#059669',
    image: '/treatments/diabetes.jpg',
    imageAlt: 'Active middle-aged man maintaining healthy glucose levels and active lifestyle',
    symptoms: ['Fluctuating Blood Sugar', 'Chronic Exhaustion', 'Excessive Thirst & Urination', 'Nerve Tingling / Neuropathy'],
    remedies: [
      {
        name: 'Syzygium Jambolanum Q',
        potency: 'Mother Tincture',
        use: 'Renowned botanical remedy helping regulate sugar absorption and reduce persistent thirst.',
      },
      {
        name: 'Uranium Nitricum 3X',
        potency: '3X',
        use: 'Indicated for diabetic debility, digestive weakness, and fluid balance regulation.',
      },
      {
        name: 'Phosphoric Acid 30C',
        potency: '30C',
        use: 'Deep physical and mental burnout, brain fog, and exhaustion associated with diabetes.',
      },
      {
        name: 'Cephalandra Indica Q',
        potency: 'Mother Tincture',
        use: 'Supports healthy glycemic levels and alleviates dry mouth and sugar spikes.',
      },
    ],
  },
  {
    id: 'arthritis',
    label: 'Arthritis',
    emoji: '🦴',
    tagline: 'Joint pain & inflammation relief',
    description:
      'Constitutional remedies address joint inflammation, cartilage wear, and morning stiffness at the systemic level, restoring comfortable range of motion and joint flexibility without stomach irritation.',
    color: '#7c3aed',
    image: '/treatments/arthritis.jpg',
    imageAlt: 'Active senior enjoying outdoor stretching and healthy joint mobility',
    symptoms: ['Morning Joint Stiffness', 'Cartilage Wear & Pain', 'Swelling & Inflammation', 'Weather-Sensitive Aches'],
    remedies: [
      {
        name: 'Rhus Toxicodendron 200C',
        potency: '200C',
        use: 'Joint pain and stiffness that improves with gentle movement and worsens in damp weather.',
      },
      {
        name: 'Bryonia Alba 200C',
        potency: '200C',
        use: 'Sharp, stitching joint pains made worse by motion and relieved by firm rest.',
      },
      {
        name: 'Causticum 200C',
        potency: '200C',
        use: 'Chronic joint stiffness, tendon tightness, and restricted flexibility in fingers and knees.',
      },
      {
        name: 'Apis Mellifica 30C',
        potency: '30C',
        use: 'Acute inflamed, puffy joints with stinging sensations that feel relieved by cold compresses.',
      },
    ],
  },
  {
    id: 'anxiety',
    label: 'Anxiety & Stress',
    emoji: '🧘',
    tagline: 'Calm mind & nervous system support',
    description:
      'Targeted homeopathic remedies calm the hyperactive nervous system, alleviate panic tendencies, relieve restless night awakenings, and restore emotional resilience naturally without habit-forming tranquilizers.',
    color: '#0891b2',
    image: '/treatments/anxiety.jpg',
    imageAlt: 'Woman in peaceful mindful meditation achieving mental clarity and stress relief',
    symptoms: ['Panic Attacks & Trembling', 'Racing Thoughts & Worry', 'Insomnia & Sleep Deprivation', 'Stress-Induced Palpitations'],
    remedies: [
      {
        name: 'Aconitum Napellus 30C',
        potency: '30C',
        use: 'Sudden intense anxiety, acute panic attacks, physical restlessness, and rapid heartbeat.',
      },
      {
        name: 'Gelsemium 200C',
        potency: '200C',
        use: 'Anticipatory dread, trembling weakness, performance anxiety, and sluggish mental focus.',
      },
      {
        name: 'Argentum Nitricum 200C',
        potency: '200C',
        use: 'High-strung worry, hurried anxiety, and nervous stomach upset before important events.',
      },
      {
        name: 'Ignatia Amara 200C',
        potency: '200C',
        use: 'Emotional grief, silent sorrow, sudden tearfulness, and throat tension from stress.',
      },
    ],
  },
  {
    id: 'skin',
    label: 'Skin & Hair',
    emoji: '✨',
    tagline: 'Eczema, acne & hair loss care',
    description:
      'Homeopathic dermatology works by detoxifying the inner vital systems rather than using topical suppressants — helping resolve persistent eczema, hormonal acne, psoriasis, dandruff, and sudden hair fall permanently.',
    color: '#d97706',
    image: '/treatments/skin.jpg',
    imageAlt: 'Woman with radiant, glowing skin and healthy hair feeling confident',
    symptoms: ['Chronic Eczema & Dry Itch', 'Cystic & Hormonal Acne', 'Excessive Hair Fall & Alopecia', 'Psoriasis & Scalp Dandruff'],
    remedies: [
      {
        name: 'Sulphur 200C',
        potency: '200C',
        use: 'Chronic itchy eczema, dry rough skin, recurrent acne outbreaks, and heat sensitivity.',
      },
      {
        name: 'Graphites 200C',
        potency: '200C',
        use: 'Cracked skin folds with sticky exudate, dry eczema behind ears, and brittle nails.',
      },
      {
        name: 'Natrum Muriaticum 1M',
        potency: '1M',
        use: 'Telogen hair fall after illness or emotional stress, oily hairline, and scalp dryness.',
      },
      {
        name: 'Thuja Occidentalis 200C',
        potency: '200C',
        use: 'Skin growths, blemishes, allergic flare-ups, and post-medication skin purification.',
      },
    ],
  },
];

/* ── Component ────────────────────────────────────────────────────────── */
export default function TreatmentTabs({ onConsultationClick }) {
  const [activeId, setActiveId] = useState(TREATMENT_TABS[0].id);
  const sectionRef = useScrollReveal('[data-reveal]');
  const active = TREATMENT_TABS.find((t) => t.id === activeId) || TREATMENT_TABS[0];

  return (
    <section className="treatment-tabs-section" ref={sectionRef} id="treatments">
      {/* Header */}
      <div className="section-header treatment-tabs-header" data-reveal="fade-down">
        <span className="section-eyebrow">Condition-Specific Care</span>
        <h2 className="section-title">Treatments by Condition</h2>
        <p className="section-desc">
          Select a health condition to explore doctor-curated homeopathic remedy protocols and real recovery pathways.
        </p>
      </div>

      {/* Tab Pills */}
      <div className="treatment-pill-row" data-reveal="fade-up">
        {TREATMENT_TABS.map((tab) => {
          const isActive = activeId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`treatment-pill ${isActive ? 'treatment-pill--active' : ''}`}
              onClick={() => setActiveId(tab.id)}
              style={{ '--pill-color': tab.color }}
              aria-pressed={isActive}
            >
              <span className="treatment-pill-emoji">{tab.emoji}</span>
              <span className="treatment-pill-text">{tab.label}</span>
              {isActive && <span className="treatment-pill-dot" />}
            </button>
          );
        })}
      </div>

      {/* Active Panel (Keyed by active.id for fresh animated render on tab change) */}
      <div className="treatment-panel" key={active.id}>
        {/* Panel Hero */}
        <div className="treatment-panel-hero" style={{ '--accent': active.color }}>
          <div className="treatment-panel-info">
            <div className="treatment-panel-label">
              <Sparkles size={14} className="treatment-sparkle-icon" />
              <span>Doctor-Curated Protocol</span>
            </div>
            <h3 className="treatment-panel-title">
              <span className="treatment-title-emoji">{active.emoji}</span>
              <span>{active.label} Relief Protocol</span>
            </h3>
            <p className="treatment-panel-tagline">{active.tagline}</p>
            <p className="treatment-panel-desc">{active.description}</p>

            {/* Symptom Tag Pills */}
            <div className="treatment-symptom-tags">
              <span className="treatment-tags-label">Key Focus Areas:</span>
              <div className="treatment-tags-list">
                {active.symptoms.map((symptom) => (
                  <span key={symptom} className="treatment-symptom-chip">
                    <CheckCircle2 size={12} className="treatment-chip-icon" />
                    <span>{symptom}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Generated Wellness Photo */}
          <div className="treatment-panel-photo-col">
            <div className="treatment-photo-card">
              <div className="treatment-photo-img-wrap">
                <img
                  src={active.image}
                  alt={active.imageAlt}
                  className="treatment-panel-photo"
                  loading="lazy"
                />
                <div className="treatment-photo-overlay" />
                <span className="treatment-photo-badge">
                  ✦ Clinical Recovery Focus
                </span>
              </div>
              <div className="treatment-photo-caption">
                <span className="treatment-photo-caption-title">{active.label} Holistic Care</span>
                <span className="treatment-photo-caption-sub">Individualised constitutional treatment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remedy Cards Grid */}
        <div className="treatment-remedies-section">
          <div className="treatment-remedies-header">
            <h4 className="treatment-remedies-title">Core Homeopathic Formulations</h4>
            <p className="treatment-remedies-sub">Selected for constitutional synergy and root-cause balance</p>
          </div>
          <div className="treatment-remedy-grid">
            {active.remedies.map((remedy, idx) => (
              <div
                key={remedy.name}
                className="treatment-remedy-card"
                style={{ '--card-index': idx }}
              >
                <div className="treatment-remedy-top">
                  <h4 className="treatment-remedy-name">{remedy.name}</h4>
                  <span className="treatment-remedy-potency">{remedy.potency}</span>
                </div>
                <p className="treatment-remedy-use">{remedy.use}</p>
                <div className="treatment-remedy-footer">
                  <span className="treatment-remedy-tag">Targeted constitutional dose</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="treatment-panel-cta">
          <div className="treatment-cta-info">
            <p className="treatment-cta-title">Need guidance for your specific symptoms?</p>
            <p className="treatment-cta-note">
              Homeopathic medicines are prescribed on an individual constitutional basis by Dr. Ancy Shaji for best results.
            </p>
          </div>
          <div className="treatment-cta-actions">
            <button
              type="button"
              className="btn btn-primary treatment-cta-btn"
              onClick={onConsultationClick}
            >
              <ShoppingCart size={16} />
              <span>Book Consultation for ₹99</span>
              <ChevronRight size={15} />
            </button>
            <a
              href={`https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(
                `Hello Dr. Ancy, I would like to consult regarding homeopathic treatment for ${active.label}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline treatment-whatsapp-btn"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Doctor</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
