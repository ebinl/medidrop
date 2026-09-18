import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const POLICIES = {
  shipping: {
    id: 'shipping',
    title: 'Shipping & Delivery Policy',
    shortTitle: 'Shipping Policy',
    icon: Truck,
    badge: 'Reliable Nationwide Delivery',
    summary: 'Transparent, temperature-safe homeopathic packaging delivered directly to your doorstep across India.',
  },
  returns: {
    id: 'returns',
    title: 'Returns & Refund Policy',
    shortTitle: 'Returns & Refunds',
    icon: RotateCcw,
    badge: 'Hassle-Free Protection',
    summary: 'Safe pharmaceutical-grade remedies with full replacement guarantee on damaged or incorrect shipments.',
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy & Data Protection Policy',
    shortTitle: 'Privacy Policy',
    icon: ShieldCheck,
    badge: '100% Confidential & Secure',
    summary: 'Strict doctor-patient confidentiality adhering to Indian healthcare privacy and data protection standards.',
  },
  terms: {
    id: 'terms',
    title: 'Terms of Use & Clinical Disclaimer',
    shortTitle: 'Terms of Use',
    icon: FileText,
    badge: 'Standard Healthcare Terms',
    summary: 'Legal terms governing homeopathic wellness products, user accounts, and Dr. Ancy Shaji teleconsultations.',
  },
};

export default function PolicyPage({ activeTab: initialTab }) {
  const location = useLocation();

  const getTabFromPath = () => {
    if (initialTab) return initialTab;
    const path = location.pathname.toLowerCase();
    if (path.includes('shipping')) return 'shipping';
    if (path.includes('return') || path.includes('refund')) return 'returns';
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('terms')) return 'terms';
    return 'shipping';
  };

  const [tab, setTab] = useState(getTabFromPath);

  useEffect(() => {
    setTab(getTabFromPath());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, initialTab]);

  const activePolicy = POLICIES[tab] || POLICIES.shipping;
  const ActiveIcon = activePolicy.icon;

  return (
    <div className="policy-page">
      {/* Hero Header */}
      <section className="policy-hero">
        <div className="policy-hero-inner">
          <div className="remedies-hero-meta">
            <Link to="/" className="remedies-back">
              <ArrowLeft size={15} strokeWidth={2.25} />
              <span>Back to Home</span>
            </Link>
            <span className="remedies-meta-dot" aria-hidden="true" />
            <div className="remedies-hero-badge">
              <ActiveIcon size={13} strokeWidth={2.25} />
              <span>{activePolicy.badge}</span>
            </div>
          </div>
          <h1>{activePolicy.title}</h1>
          <p>{activePolicy.summary}</p>
          <div className="policy-last-updated">
            <span>Last Updated: September 2026</span>
            <span className="policy-dot">•</span>
            <span>Official Policy for MEDI DROP</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="policy-content-section">
        <div className="policy-layout">
          {/* Sidebar Nav */}
          <aside className="policy-sidebar">
            <div className="glass policy-sidebar-card">
              <h3 className="policy-sidebar-title">Support & Legal</h3>
              <nav className="policy-nav-list" aria-label="Policies">
                {Object.values(POLICIES).map((item) => {
                  const Icon = item.icon;
                  const isActive = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={`policy-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={16} />
                      <span>{item.shortTitle}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Direct Contact Card */}
              <div className="policy-contact-box">
                <div className="policy-contact-header">
                  <HelpCircle size={18} />
                  <h4>Need Assistance?</h4>
                </div>
                <p>Have questions about your order, tracking, or our clinic policies?</p>
                <div className="policy-contact-links">
                  <a href="tel:9746758698" className="policy-contact-btn">
                    <Phone size={15} />
                    <span>+91 97467 58698</span>
                  </a>
                  <a href="mailto:medidrop.co.in@gmail.com" className="policy-contact-link">
                    <Mail size={14} />
                    <span>medidrop.co.in@gmail.com</span>
                  </a>
                  <div className="policy-contact-hours">
                    <Clock size={13} />
                    <span>Mon–Sat · 10:00 AM – 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Policy Body */}
          <main className="glass policy-article-panel">
            {tab === 'shipping' && <ShippingPolicyContent />}
            {tab === 'returns' && <ReturnsPolicyContent />}
            {tab === 'privacy' && <PrivacyPolicyContent />}
            {tab === 'terms' && <TermsPolicyContent />}

            {/* Bottom Support Banner */}
            <div className="policy-support-banner">
              <div className="policy-support-text">
                <h4>Contact Grievance & Support Desk</h4>
                <p>
                  For rapid inquiry resolution regarding dispatch status, package condition, or prescription inquiries:
                </p>
              </div>
              <div className="policy-support-actions">
                <a href="tel:9746758698" className="btn btn-primary">
                  <Phone size={16} />
                  <span>Call +91 97467 58698</span>
                </a>
                <a href="mailto:medidrop.co.in@gmail.com" className="btn btn-outline">
                  <Mail size={16} />
                  <span>Email Support</span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

/* 1. SHIPPING POLICY */
function ShippingPolicyContent() {
  return (
    <article className="policy-article">
      <h2>1. Overview & Service Coverage</h2>
      <p>
        At <strong>MEDI DROP (Homeopathic Formulations by Dr. Ancy Shaji)</strong>, we ensure safe, hygienic, and swift delivery of verified homeopathic remedies, tinctures, and wellness packages across India. All shipments are packed in compliant, pharmaceutical-grade packaging designed to safeguard homeopathic potencies from heat and electromagnetic radiation.
      </p>

      <h2>2. Dispatch & Order Processing Timelines</h2>
      <ul>
        <li>
          <strong>Prescription & Formulation Review:</strong> Orders placed before 2:00 PM IST on working days (Monday to Saturday) are prepared and dispatched within <strong>24 to 48 hours</strong>.
        </li>
        <li>
          <strong>Consultation-linked Orders:</strong> Formulations prescribed during online doctor consultations are prioritized for same-day or next-business-day preparation.
        </li>
      </ul>

      <h2>3. Delivery Timelines & Logistics Partners</h2>
      <p>We partner with premier national logistics providers including Blue Dart, Delhivery, and India Post Speed Post:</p>
      <div className="policy-grid-cards">
        <div className="policy-card-item">
          <Truck size={20} className="policy-card-icon" />
          <h4>Standard Delivery</h4>
          <p>3 to 5 business days across major metros and tier-1/tier-2 cities.</p>
        </div>
        <div className="policy-card-item">
          <Clock size={20} className="policy-card-icon" />
          <h4>Regional & Rural Delivery</h4>
          <p>4 to 7 business days for remote and North-East regions via Speed Post.</p>
        </div>
        <div className="policy-card-item">
          <CheckCircle2 size={20} className="policy-card-icon" />
          <h4>Live Order Tracking</h4>
          <p>Real-time SMS & email tracking ID sent upon courier dispatch.</p>
        </div>
      </div>

      <h2>4. Shipping Charges & Free Delivery Threshold</h2>
      <ul>
        <li><strong>Orders above ₹499:</strong> Free Standard Shipping across India.</li>
        <li><strong>Orders below ₹499:</strong> A nominal flat packing & handling fee of ₹50 is applied at checkout.</li>
        <li><strong>Express / Cold-Protection Dispatch:</strong> Available on request for specialized mother tinctures and temperature-sensitive dilutions.</li>
      </ul>

      <h2>5. Specialized Homeopathic Packaging Standards</h2>
      <p>
        Homeopathic globules and liquid dilutions are susceptible to environmental interference. MEDI DROP enforces strict packaging protocols:
      </p>
      <ul>
        <li>High-grade amber glass bottles and neutral polymer containers to prevent light degradation.</li>
        <li>Tamper-evident seals with shock-absorbing thermal bubble wraps.</li>
        <li>Moisture-barrier and fragrance-free outer cartons to protect energetic remedies.</li>
      </ul>

      <h2>6. Damaged or Lost Shipments</h2>
      <p>
        If your package appears opened, tampered with, or damaged during transit, please take a photograph and notify our support desk immediately at <strong>+91 9746758698</strong> or <strong>medidrop.co.in@gmail.com</strong>. We provide immediate free replacement with express priority.
      </p>
    </article>
  );
}

/* 2. RETURNS & REFUNDS POLICY */
function ReturnsPolicyContent() {
  return (
    <article className="policy-article">
      <h2>1. Pharmaceutical Returns Policy</h2>
      <p>
        Under the Drugs and Cosmetics Act and healthcare safety regulations, homeopathic medicines, unsealed globules, and prepared tinctures cannot be returned once delivered and opened, to prevent contamination and maintain strict patient safety.
      </p>

      <h2>2. 7-Day Replacement Guarantee</h2>
      <p>You are entitled to a 100% free replacement or full refund under the following conditions within <strong>7 calendar days</strong> of receiving your parcel:</p>
      <ul>
        <li><strong>Damaged in Transit:</strong> Broken bottles, leaking seals, or crushed containers.</li>
        <li><strong>Incorrect Item Received:</strong> Remedies differing in name or potency from your confirmed cart order.</li>
        <li><strong>Quality Discrepancy:</strong> Any defective packaging or broken seals upon initial delivery.</li>
      </ul>

      <h2>3. Step-by-Step Claim Procedure</h2>
      <ol>
        <li>
          <strong>Contact Support:</strong> Reach our customer care team via WhatsApp or call at <strong>+91 9746758698</strong> or email <strong>medidrop.co.in@gmail.com</strong> within 7 days of delivery.
        </li>
        <li>
          <strong>Provide Proof:</strong> Share your Order ID (e.g. <code>MD-ORD-XXXX</code>) and clear photos of the damaged or incorrect medicines.
        </li>
        <li>
          <strong>Verification & Dispatch:</strong> Our team will verify and dispatch a replacement package within 24 hours, free of charge.
        </li>
      </ol>

      <h2>4. Refund Processing Timelines</h2>
      <ul>
        <li>
          <strong>Online Payments (UPI, Cards, NetBanking):</strong> Refunds are credited back to the original payment source within <strong>3 to 5 business days</strong>.
        </li>
        <li>
          <strong>Store Credit / Wallet:</strong> Can be credited instantly for your next remedy order upon request.
        </li>
      </ul>

      <h2>5. Cancellation of Doctor Consultations</h2>
      <p>
        Doctor appointments booked with Dr. Ancy Shaji can be rescheduled or cancelled with a full refund if requested at least <strong>2 hours prior</strong> to the scheduled consultation time. Contact our clinic desk at <strong>+91 9746758698</strong> for immediate scheduling support.
      </p>
    </article>
  );
}

/* 3. PRIVACY POLICY */
function PrivacyPolicyContent() {
  return (
    <article className="policy-article">
      <h2>1. Commitment to Patient Confidentiality</h2>
      <p>
        MEDI DROP is committed to safeguarding your personal health data and privacy. We treat all consultation records, patient symptoms, prescriptions, and order histories as confidential medical information, protected in compliance with the Digital Personal Data Protection Act (DPDPA) and the Telemedicine Practice Guidelines of India.
      </p>

      <h2>2. Information We Collect</h2>
      <ul>
        <li><strong>Patient Profile:</strong> Full name, age, phone number, email address, and shipping address.</li>
        <li><strong>Clinical & Wellness Details:</strong> Symptoms, health history, and doctor consultation notes shared during teleconsultations.</li>
        <li><strong>Order & Transaction Records:</strong> Purchased medicines, payment confirmation, and delivery status. (Note: We do not store credit/debit card numbers; all transactions are processed via certified PCI-DSS compliant payment gateways).</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To formulate, package, and deliver your homeopathic remedy orders accurately.</li>
        <li>To facilitate online consultations and follow-up medical guidance with Dr. Ancy Shaji.</li>
        <li>To send order dispatch notifications, delivery tracking updates, and appointment reminders.</li>
        <li>To provide customer support and address any clinical inquiries.</li>
      </ul>

      <h2>4. Non-Disclosure & Data Security</h2>
      <p>
        We <strong>never</strong> sell, rent, monetize, or disclose your clinical or personal records to pharmaceutical marketers, data aggregators, or third-party advertisers. All network transmissions are protected using 256-bit SSL/TLS encryption.
      </p>

      <h2>5. Patient Rights</h2>
      <p>You maintain full control over your personal data:</p>
      <ul>
        <li>You may request a copy of your consultation history and order records.</li>
        <li>You may request update, correction, or complete deletion of your account by contacting our privacy officer.</li>
      </ul>

      <h2>6. Grievance Officer Contact</h2>
      <p>
        In accordance with the Information Technology Act and rules made thereunder, for any queries or concerns regarding data privacy, please contact:
      </p>
      <div className="policy-officer-card">
        <strong>Privacy & Grievance Desk · MEDI DROP</strong>
        <p>Helpline: <a href="tel:9746758698">+91 97467 58698</a></p>
        <p>Email: <a href="mailto:medidrop.co.in@gmail.com">medidrop.co.in@gmail.com</a></p>
        <p>Hours: Monday – Saturday · 10:00 AM – 8:00 PM IST</p>
      </div>
    </article>
  );
}

/* 4. TERMS OF USE */
function TermsPolicyContent() {
  return (
    <article className="policy-article">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the MEDI DROP website, purchasing homeopathic formulations, or booking online doctor consultations, you agree to comply with and be bound by these Terms of Use. If you do not agree with any part of these terms, please refrain from using the platform.
      </p>

      <h2>2. Medical & Teleconsultation Disclaimer</h2>
      <div className="policy-alert-box">
        <AlertCircle size={18} />
        <div>
          <strong>Important Medical Notice:</strong>
          <p>
            The homeopathic wellness consultations provided by Dr. Ancy Shaji are intended for holistic health support, constitutional healing, and lifestyle wellness. Our online consultations are not intended for emergency situations, acute trauma, or severe medical distress requiring hospital admission. In case of a medical emergency, please visit the nearest hospital or contact local emergency services immediately.
          </p>
        </div>
      </div>

      <h2>3. Eligibility & User Responsibilities</h2>
      <ul>
        <li>You must be at least 18 years of age or accessing the platform under parental/guardian supervision.</li>
        <li>You agree to provide accurate, up-to-date information regarding your health history, active pharmaceutical medications, and allergies.</li>
        <li>Remedies must be taken as per directed dosages and stored in dry, cool conditions away from strong scents like camphor or menthol.</li>
      </ul>

      <h2>4. Product Formulations & Availability</h2>
      <p>
        All remedies are prepared in accordance with the Homoeopathic Pharmacopoeia of India (HPI) using authentic, authorized ingredients. While we strive to maintain comprehensive stock, in the event an item is temporarily unavailable, we will notify you immediately with formulation alternatives or offer a prompt refund.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        The MEDI DROP brand, logos, visual dropper graphics, product descriptions, and health articles are the intellectual property of MEDI DROP and Dr. Ancy Shaji. Unauthorized reproduction, scraping, or redistribution is strictly prohibited.
      </p>

      <h2>6. Governing Law & Dispute Resolution</h2>
      <p>
        These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with the platform or services shall be subject to the exclusive jurisdiction of the competent courts in Kerala, India.
      </p>

      <h2>7. Customer Service Helpline</h2>
      <p>
        For inquiries regarding terms, orders, or consultations, please contact us at <strong>+91 9746758698</strong> or email <strong>medidrop.co.in@gmail.com</strong>.
      </p>
    </article>
  );
}
