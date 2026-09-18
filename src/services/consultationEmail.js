import emailjs from '@emailjs/browser';
import { CONSULTATION_FEE, DOCTOR_NAME, DOCTOR_NOTIFY_EMAIL } from '../config/clinic';

function formatPaymentReference(data) {
  const ref = data.upiLast4 || data.upiRefNo;
  return ref ? `UPI Txn ID (last 4 digits): ${ref}` : 'UPI payment confirmed';
}

function buildConsultationSummary(data) {
  const paymentMethod = 'UPI (Google Pay / PhonePe)';
  const lines = [
    'New MEDI DROP consultation booking',
    '',
    `Doctor: ${DOCTOR_NAME}`,
    `Patient name: ${data.name}`,
    `Patient email: ${data.email}`,
    `Patient phone: ${data.phone}`,
    '',
    `Preferred date: ${data.date}`,
    `Preferred time: ${data.time}`,
    '',
    `Symptoms / concern:`,
    data.symptoms,
    '',
    `Payment method: ${paymentMethod}`,
    formatPaymentReference(data),
    `Consultation fee: ₹${CONSULTATION_FEE}`,
    '',
    `Booked at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
  ];
  return lines.join('\n');
}

function buildTemplateParams(data) {
  const paymentMethod = 'UPI (Google Pay / PhonePe)';

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

/** Sends consultation details to the doctor Gmail via EmailJS (after payment step). */
export async function notifyDoctorConsultation(data) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_DOCTOR_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      'Doctor email skipped: set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_DOCTOR_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY in .env'
    );
    return { sent: false, skipped: true };
  }

  await emailjs.send(serviceId, templateId, buildTemplateParams(data), { publicKey });
  return { sent: true };
}
