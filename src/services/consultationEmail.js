import emailjs from '@emailjs/browser';
import { CONSULTATION_FEE, DOCTOR_NAME, DOCTOR_NOTIFY_EMAIL } from '../config/clinic';

function formatPaymentReference(data) {
  const ref = data.upiLast4 || data.upiRefNo;
  return ref ? `UPI Txn ID / UTR (last 4 digits): ${ref}` : 'UPI payment confirmed';
}

function buildConsultationSummary(data) {
  const paymentMethod = 'UPI (Google Pay / PhonePe / Paytm / Amazon Pay)';
  const lines = [
    '🩺 New MEDI DROP Doctor Consultation Booking',
    '============================================',
    `Doctor: ${DOCTOR_NAME}`,
    `Doctor Email: ${DOCTOR_NOTIFY_EMAIL}`,
    '',
    '👤 PATIENT DETAILS:',
    `• Patient Name: ${data.name}`,
    `• Patient Email: ${data.email}`,
    `• Patient Phone: ${data.phone}`,
    '',
    '📅 APPOINTMENT SCHEDULE:',
    `• Preferred Date: ${data.date}`,
    `• Preferred Time: ${data.time}`,
    '',
    '💬 SYMPTOMS & HEALTH CONCERN:',
    data.symptoms || 'General Consultation',
    '',
    '💳 PAYMENT DETAILS:',
    `• Payment Method: ${paymentMethod}`,
    `• Receiver UPI ID: ancyshaji1996@oksbi`,
    `• ${formatPaymentReference(data)}`,
    `• Consultation Fee Paid: ₹${CONSULTATION_FEE}`,
    '',
    `🕒 Booked At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    '============================================',
  ];
  return lines.join('\n');
}

function buildTemplateParams(data) {
  const paymentMethod = 'UPI (Google Pay / PhonePe / Paytm / Amazon Pay)';

  return {
    to_email: DOCTOR_NOTIFY_EMAIL,
    doctor_email: DOCTOR_NOTIFY_EMAIL,
    doctor_name: DOCTOR_NAME,
    reply_to: data.email,
    patient_name: data.name,
    patient_email: data.email,
    patient_phone: data.phone,
    symptoms: data.symptoms,
    consult_date: data.date,
    consult_time: data.time,
    payment_method: paymentMethod,
    payment_reference: formatPaymentReference(data),
    amount: `₹${CONSULTATION_FEE}`,
    booked_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    message: buildConsultationSummary(data),
  };
}

/**
 * Direct mailto link to medidrop.co.in@gmail.com with formatted booking summary
 */
export function buildDoctorGmailMailtoUrl(booking) {
  const subject = encodeURIComponent(`[MEDI DROP Booking] ₹99 Consult - ${booking.name || 'Patient'} (${booking.date || 'Scheduled'})`);
  const body = encodeURIComponent(buildConsultationSummary(booking));
  return `mailto:${DOCTOR_NOTIFY_EMAIL}?subject=${subject}&body=${body}`;
}

/** Sends consultation details to the doctor Gmail medidrop.co.in@gmail.com via EmailJS (after payment step). */
export async function notifyDoctorConsultation(data) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_DOCTOR_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      `Doctor email dispatch skipped in local mode. Notification targeted to: ${DOCTOR_NOTIFY_EMAIL}. (Set VITE_EMAILJS_SERVICE_ID in .env for production SMTP).`
    );
    return { sent: false, skipped: true, email: DOCTOR_NOTIFY_EMAIL };
  }

  try {
    const res = await emailjs.send(serviceId, templateId, buildTemplateParams(data), { publicKey });
    return { sent: true, response: res };
  } catch (err) {
    console.warn('EmailJS delivery attempt notice:', err);
    return { sent: false, error: err };
  }
}
