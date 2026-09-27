import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Briefcase, GraduationCap, Stethoscope, Mail, Clock, Languages, Star, MessageCircle, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CLINIC_PHONE } from '../config/clinic';

const DOCTOR = {
  name: 'Dr. Ancy Shaji',
  title: 'Senior Homeopathic Physician (BHMS)',
  image: '/doctor-consultation.png',
  experience: '20+ years clinical practice',
  patients: '15,000+ patients treated',
  rating: '4.9 / 5.0 (1,480+ Reviews)',
  qualifications: [
    'BHMS — Bachelor of Homeopathic Medicine & Surgery',
    'Certified Classical & Constitutional Homeopathy Practitioner',
    'Specialist in Chronic & Lifestyle Disease Reversal'
  ],
  specialties: ['PCOD & Thyroid', 'Chronic Migraines', 'Pediatric Care', 'Allergy & Asthma', 'Eczema & Hair Loss', 'Arthritis & Joint Pain'],
  languages: 'English, Malayalam, Hindi',
  availability: 'Mon–Sat · 10:00 AM – 8:00 PM',
  bio: 'Renowned senior homeopathic physician providing individualized constitutional online consultations across India. Specialized in root-cause healing with 100% natural, side-effect-free remedies.',
};

export default function DoctorCard({ onConsultationClick }) {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal('[data-reveal]');

  return (
    <section id="doctor" className="doctor-section" ref={sectionRef}>
      <div className="section-header" data-reveal="fade-down">
        <span className="section-eyebrow">Meet Your Doctor</span>
        <h2 className="section-title">Consulting Physician</h2>
      </div>

      <article className="glass doctor-card" data-reveal="slide-left">
        <div className="doctor-card-media">
          <img
            src={DOCTOR.image}
            alt={DOCTOR.name}
            className="doctor-card-image"
            loading="lazy"
          />
          <div className="doctor-card-badge">
            <Stethoscope size={14} />
            Available for consult
          </div>
        </div>

        <div className="doctor-card-body">
          <div className="doctor-card-intro">
            <h3>{DOCTOR.name}</h3>
            <p className="doctor-card-role">{DOCTOR.title}</p>
            <p className="doctor-card-bio">{DOCTOR.bio}</p>
          </div>

          <div className="doctor-meta-grid">
            <div className="doctor-meta-item">
              <Briefcase size={16} />
              <div>
                <span>Experience</span>
                <strong>{DOCTOR.experience}</strong>
              </div>
            </div>
            <div className="doctor-meta-item">
              <Award size={16} />
              <div>
                <span>Patients</span>
                <strong>{DOCTOR.patients}</strong>
              </div>
            </div>
            <div className="doctor-meta-item">
              <Star size={16} className="star-filled" />
              <div>
                <span>Patient Rating</span>
                <strong>{DOCTOR.rating}</strong>
              </div>
            </div>
            <div className="doctor-meta-item">
              <Languages size={16} />
              <div>
                <span>Languages</span>
                <strong>{DOCTOR.languages}</strong>
              </div>
            </div>
          </div>

          <div className="doctor-qualifications">
            <h4>
              <GraduationCap size={16} />
              Qualifications & Credentials
            </h4>
            <ul>
              {DOCTOR.qualifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="doctor-specialties">
            {DOCTOR.specialties.map((tag) => (
              <span key={tag} className="doctor-tag">{tag}</span>
            ))}
          </div>

          <div className="doctor-card-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/contact')}>
              <Mail size={16} />
              Contact Clinic
            </button>
            <a
              href={`https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent(
                'Hello Dr. Ancy Shaji, I would like to book an online Homeopathy consultation for ₹99.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline doctor-wa-btn"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <button type="button" className="btn btn-primary" onClick={onConsultationClick}>
              <Stethoscope size={16} />
              Book Online Consult (₹99)
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
