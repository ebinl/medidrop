/**
 * MEDI DROP — WhatsApp Website Sharing Service
 * Always uses the official production website link: https://www.medidrop.co.in/
 */

export const WEBSITE_URL = 'https://www.medidrop.co.in/';

export const getCustomWebsiteShareText = () => {
  return `🌿 *MEDI DROP — Certified Pure Homeopathy Care* 🌿
_Gentle, Natural & Effective Healing with Zero Side Effects_

Hello! 👋 I wanted to share this trusted online homeopathy healthcare portal with you:

✨ *Key Highlights:*
• 🩺 *Online Doctor Video Consultation @ only ₹99* with certified senior homeopathic specialists.
• 🌿 *100% Pure Organic Dilutions & Tinctures* (Nux Vomica, Arnica, Rhus Tox, Bryonia & more).
• 🌸 *Specialized Constitutional Protocols*: Acidity & Gas, PCOD/PCOS, Migraine, Arthritis & Joint Pain, Thyroid, Skin & Hair Fall, Child Colic.
• 📦 *Express Pan-India Medicine Delivery* to your door (FREE shipping on orders ₹499+).
• 💬 *Instant AI & WhatsApp Doctor Support*.

🔗 *Consult online or explore remedies here:*
https://www.medidrop.co.in/

📞 *Clinic Desk / WhatsApp*: +91 97467 58698`;
};

export const shareWebsiteOnWhatsApp = (customNote = '') => {
  let text = getCustomWebsiteShareText();
  if (customNote) {
    text = `${customNote}\n\n${text}`;
  }
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
};
