import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Briefcase, GraduationCap, Stethoscope, Mail, Video, Clock, Languages } from 'lucide-react';

const DOCTOR = {
  name: 'Dr. Ancy Shaji',
  title: 'Senior Homeopathic Physician',
  image: '/dr-ancy-consulting-room.png',
  experience: '20+ years clinical practice',
  patients: '15000+ patients treated',
  qualifications: [
    'BHMS — Bachelor of Homeopathic Medicine & Surgery',
    'Certified Classical Homeopathy Practitioner',
  ],
  specialties: ['Chronic cases', 'Thyroid', 'Pediatric care', 'Allergy & immunity', 'Lifestyle disorders'],
  languages: 'English, Malayalam, Hindi',
  availability: 'Mon–Sat · 10:00 AM – 8:00 PM',
  bio: 'Focused on individualized homeopathic care with consultations and personalized remedy plans for lasting wellness.',
};

export default function DoctorCard({ onConsultationClick }) {
  const navigate = useNavigate();

  return (
    <section id="doctor" className="doctor-section">
      <div className="section-header">
        <span className="section-eyebrow">Meet Your Doctor</span>
        <h2 className="section-title">Consulting Physician</h2>
      </div>

      <article className="glass doctor-card">
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
              <Clock size={16} />
              <div>
                <span>Availability</span>
                <strong>{DOCTOR.availability}</strong>
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
              Qualifications
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
              Contact Us
            </button>
            <button type="button" className="btn btn-primary" onClick={onConsultationClick}>
              <Video size={16} />
              Get Consultation (₹99)
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
