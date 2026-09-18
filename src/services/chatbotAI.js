/**
 * MEDI DROP Homeopathy AI Knowledge Engine & WhatsApp Router
 * Integrates with clinic phone: 9746758698 (+91 9746758698)
 * Doctor: Dr. Ancy Shaji (BHMS)
 */

export const CLINIC_WHATSAPP_NUMBER = '9746758698';
export const CLINIC_PHONE_DISPLAY = '+91 97467 58698';
export const CLINIC_DOCTOR_NAME = 'Dr. Ancy Shaji';
export const CONSULTATION_FEE = 99;

/**
 * Builds a direct WhatsApp click-to-chat URL with optional pre-filled text
 */
export function buildWhatsAppLink(customMessage) {
  const base = `https://wa.me/91${CLINIC_WHATSAPP_NUMBER}`;
  if (!customMessage || !customMessage.trim()) {
    const defaultText = encodeURIComponent(
      `Hello Dr. Ancy / MEDI DROP Clinic, I am inquiring from your website about homeopathic treatment.`
    );
    return `${base}?text=${defaultText}`;
  }
  return `${base}?text=${encodeURIComponent(customMessage.trim())}`;
}

export const QUICK_TOPICS = [
  { label: '🩺 Book ₹99 Consult', query: 'I want to book an online consultation with Dr. Ancy' },
  { label: '🌿 Acidity & Gas', query: 'What is the best remedy for acidity, gas and bloating?' },
  { label: '🤧 Cold & Cough', query: 'I have sudden cold, dry cough and chills' },
  { label: '🦵 Joint & Body Pain', query: 'Remedy for joint stiffness and muscle pain' },
  { label: '💧 How to take drops', query: 'How do I take homeopathic drops? What is the dosage?' },
  { label: '👶 Baby Colic / Teething', query: 'Remedy for baby teething irritation and colic' },
  { label: '🏷️ Warts & Skin Tags', query: 'Natural homeopathic treatment for warts and skin tags' },
  { label: '📦 Shipping & Delivery', query: 'How long does medicine delivery take?' },
  { label: '📱 Chat on WhatsApp', query: 'Connect me directly with Dr. Ancy on WhatsApp' },
];

/**
 * Knowledge Base for Homeopathic Remedies in Medi Drop
 */
const REMEDIES_DATABASE = [
  {
    id: 2,
    name: 'Nux Vomica 200C',
    category: 'Digestive Care',
    price: 150,
    indications: 'Severe acidity, acid reflux, heartburn, bloating, gas, indigestion, nausea, or heavy stomach after spicy foods.',
    dosage: '4 to 5 drops in 2-3 tablespoons of lukewarm water, twice daily (ideally before bedtime or after meals).',
    keywords: ['acid', 'acidity', 'gas', 'bloat', 'bloating', 'gerd', 'reflux', 'heartburn', 'indigestion', 'stomach', 'gastric', 'constipat', 'vomit', 'hangover', 'nux vomica']
  },
  {
    id: 1,
    name: 'Arnica Montana 30C',
    category: 'Pain Relief & Healing',
    price: 180,
    indications: 'Bruises, muscular soreness, sore back, joint pain after physical work, blunt trauma, post-workout sprains.',
    dosage: '4 drops diluted in a little water, 2 to 3 times daily until soreness resolves.',
    keywords: ['arnica', 'bruise', 'sore', 'soreness', 'muscle ache', 'injury', 'trauma', 'pain relief', 'body ache', 'fall', 'hit', 'strain']
  },
  {
    id: 3,
    name: 'Aconitum Napellus 30C',
    category: 'Cold & Cough',
    price: 160,
    indications: 'Sudden onset colds, dry tickly coughs, feverish chills triggered by cold dry winds or weather changes.',
    dosage: '4 drops in water every 3 to 4 hours in the first 24 hours of cold onset.',
    keywords: ['cold', 'cough', 'chill', 'fever', 'flu', 'sneeze', 'dry cough', 'throat', 'shiver', 'aconite', 'aconitum']
  },
  {
    id: 4,
    name: 'Bryonia Alba 200C',
    category: 'Joint & Rheumatic Pain',
    price: 190,
    indications: 'Sharp stitching joint pain, knee stiffness, or rheumatism where pain worsens upon any movement and feels better resting.',
    dosage: '4 drops in 2 tablespoons of water, twice daily.',
    keywords: ['bryonia', 'joint pain', 'knee pain', 'rheumatism', 'arthritis', 'sharp pain', 'stiffness', 'movement pain']
  },
  {
    id: 5,
    name: 'Rhus Toxicodendron 30C',
    category: 'Sprains & Strains',
    price: 175,
    indications: 'Torn ligaments, sprains, lower backache, stiffness that improves with warm motion but worsens upon first starting to move.',
    dosage: '4 drops in water, 2 to 3 times daily.',
    keywords: ['rhus tox', 'sprain', 'ligament', 'backache', 'lower back', 'tendon', 'twisted', 'stiff neck']
  },
  {
    id: 6,
    name: 'Gelsemium 200C',
    category: 'Stress & Fatigue',
    price: 210,
    indications: 'Anticipatory anxiety, exam nervousness, stage fright, dull occipital tension headaches, feeling tired and heavy.',
    dosage: '4 drops in water before high-stress events or twice daily during periods of mental fatigue.',
    keywords: ['anxiety', 'stress', 'nervous', 'panic', 'headache', 'dull head', 'fatigue', 'exam', 'tired', 'gelsemium', 'migraine']
  },
  {
    id: 7,
    name: 'Chamomilla 30C',
    category: 'Pediatric & Colic Care',
    price: 145,
    indications: 'Teething troubles in infants, painful swollen gums, baby colic cramps, irritability, sleepless crying.',
    dosage: '2 drops in a teaspoon of sterile water, 2 to 3 times daily.',
    keywords: ['baby', 'infant', 'child', 'teething', 'colic', 'gum', 'crying', 'restless', 'chamomilla', 'pediatric']
  },
  {
    id: 8,
    name: 'Apis Mellifica 30C',
    category: 'Allergies & Skin Rashes',
    price: 185,
    indications: 'Hives (urticaria), burning red skin swellings, bee or insect stings, puffy eyelids, hot itchy rashes.',
    dosage: '4 drops in water every 2 to 3 hours during acute flare-ups.',
    keywords: ['hive', 'hives', 'urticaria', 'rash', 'insect bite', 'bee sting', 'sting', 'swelling', 'itch', 'burning skin', 'apis']
  },
  {
    id: 9,
    name: 'Allium Cepa 30C',
    category: 'Allergic Rhinitis',
    price: 155,
    indications: 'Seasonal hay fever, constant sneezing fits, clear burning runny nose, and bland watery eyes.',
    dosage: '4 drops in half a cup of water, 3 times daily.',
    keywords: ['allergic rhinitis', 'hay fever', 'running nose', 'runny nose', 'sneezing', 'watery eyes', 'allium cepa', 'allergy']
  },
  {
    id: 10,
    name: 'Thuja Occidentalis 200C',
    category: 'Skin Tag & Wart Care',
    price: 220,
    indications: 'Warts, skin tags, benign polyp growths, corns, nodules. Non-invasive, safe and painless resolution.',
    dosage: '4 drops directly in water, taken once daily on an empty stomach for 3 to 4 weeks.',
    keywords: ['wart', 'warts', 'skin tag', 'skin tags', 'mole', 'corn', 'nodule', 'polyp', 'thuja']
  }
];

/**
 * Intelligent response generator matching homeopathic symptoms, dosage rules, and clinic inquiries
 */
export function getChatbotResponse(userMessage, conversationHistory = []) {
  const query = (userMessage || '').toLowerCase().trim();

  // 1. WhatsApp direct connect intent
  if (
    query.includes('whatsapp') ||
    query.includes('chat on whatsapp') ||
    query.includes('phone number') ||
    query.includes('talk to doctor') ||
    query.includes('helpline') ||
    query.includes('contact number')
  ) {
    return {
      text: `You can chat directly with **${CLINIC_DOCTOR_NAME}** and our clinic care team on WhatsApp at **${CLINIC_PHONE_DISPLAY}**.\n\nClick the button below to open your chat instantly with your query ready!`,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I would like to consult with you via WhatsApp regarding: "${userMessage}"`,
      showConsultationCTA: true,
      quickReplies: ['🩺 Book Video Consult (₹99)', '🌿 View Remedies', '💧 Dosage Guide']
    };
  }

  // 2. Doctor consultation booking intent
  if (
    query.includes('book') ||
    query.includes('consult') ||
    query.includes('doctor') ||
    query.includes('appointment') ||
    query.includes('fee') ||
    query.includes('ancy') ||
    query.includes('99')
  ) {
    return {
      text: `You can book a 1-on-1 private video consultation with **${CLINIC_DOCTOR_NAME} (BHMS)** for only **₹${CONSULTATION_FEE}**.\n\n• **Format**: Google Meet or WhatsApp Video Call\n• **Timings**: Mon–Sat, 10:00 AM – 8:00 PM\n• **Includes**: Comprehensive homeopathic diagnosis, individualized remedy selection, and express shipping of your prescribed remedies right to your doorstep.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I want to book a video consultation for ₹99. Please share the next available slot.`,
      quickReplies: ['🩺 Open Booking Form', '🌿 Browse Remedies', '📱 WhatsApp Dr. Ancy']
    };
  }

  // 3. How to take homeopathic drops (Dosage & Rules)
  if (
    query.includes('how to take') ||
    query.includes('should i take') ||
    query.includes('how should') ||
    query.includes('dosage') ||
    query.includes('dose') ||
    query.includes('how to use') ||
    query.includes('take drops') ||
    query.includes('take the drops') ||
    query.includes('take medicine') ||
    query.includes('take it') ||
    query.includes('rules') ||
    query.includes('diet') ||
    query.includes('instruction') ||
    (query.includes('drop') && (query.includes('take') || query.includes('use') || query.includes('how')))
  ) {
    return {
      text: `**Guidelines for Taking Homeopathic Liquid Drops:**\n\n1. **Clean Mouth**: Do not eat, drink tea/coffee, or smoke for **15 minutes before and after** taking the drops.\n2. **How to Dilute**: Put **4–5 drops** into 2–3 tablespoons of clean, lukewarm or room-temperature water. Sip it slowly over your tongue.\n3. **Avoid Dropper Touch**: Never touch the glass dropper tip directly with your tongue or fingers to keep it sterile.\n4. **Storage**: Keep medicine bottles in a cool, dark place away from direct sunlight, camphor, balms, and strong perfumes.\n5. **Safety**: Our remedies are 100% natural, sugar-free, non-drowsy, and safe for all age groups.`,
      showConsultationCTA: true,
      quickReplies: ['🌿 Acidity / Gas remedy', '🤧 Cold & Cough remedy', '📱 Ask Dr. Ancy on WhatsApp']
    };
  }

  // 4. Shipping, Delivery & Tracking
  if (
    query.includes('ship') ||
    query.includes('delivery') ||
    query.includes('courier') ||
    query.includes('tracking') ||
    query.includes('order status') ||
    query.includes('how long') ||
    query.includes('business days')
  ) {
    return {
      text: `**MEDI DROP Shipping & Delivery Information:**\n\n• **Dispatch**: All orders are packaged under medical supervision and dispatched within 24 hours.\n• **Transit Time**: Express courier delivery across India within **2 to 4 business days**.\n• **Shipping Fee**: **FREE Delivery** on orders above ₹500 (Standard ₹60 for smaller orders).\n• **Tamper-Proof**: Shipped in shock-absorbent clinical sealed bottles.\n\nNeed urgent tracking or live order help? Contact our dispatch desk on WhatsApp: **${CLINIC_PHONE_DISPLAY}**.`,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello MEDI DROP Team, I'd like to check the status or delivery timeframe of my order.`,
      quickReplies: ['📦 Track My Order', '🌿 Browse Remedies', '🩺 Book Doctor Consult']
    };
  }

  // 5. Payment questions
  if (
    query.includes('pay') ||
    query.includes('upi') ||
    query.includes('payment') ||
    query.includes('google pay') ||
    query.includes('phonepe')
  ) {
    return {
      text: `**Payment Options at MEDI DROP:**\n\n• We accept all Indian UPI apps: **Google Pay, PhonePe, Paytm, and BHIM**.\n• Official Clinic UPI ID: \`ancyshaji1996@oksbi\`\n• You can scan our verified QR code or enter your UPI transaction reference during checkout or booking.\n• After payment, instant confirmation is sent to your email & WhatsApp.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello MEDI DROP Clinic, I have a question regarding UPI payment.`,
      quickReplies: ['🩺 Book Consultation (₹99)', '🌿 View Medicine Catalog']
    };
  }

  // 6. Emergency Red Flags
  if (
    query.includes('chest pain') ||
    query.includes('heart attack') ||
    query.includes('cannot breathe') ||
    query.includes('severe bleeding') ||
    query.includes('unconscious')
  ) {
    return {
      text: `⚠️ **Emergency Notice:**\nIf you or someone else is experiencing acute severe symptoms such as sudden crushing chest pain, extreme breathlessness, or severe trauma, please **call emergency services (112 / 108 in India)** or visit the nearest emergency hospital immediately.\n\nHomeopathy is for non-critical, constitutional, and acute common conditions. For non-emergency care, you can reach Dr. Ancy at **${CLINIC_PHONE_DISPLAY}**.`,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Urgent inquiry for Dr. Ancy Shaji from MEDI DROP website.`,
      quickReplies: ['📱 Call Clinic Helpline', '🩺 Book Online Consult']
    };
  }

  // 7. Check Remedy Database for specific matches
  for (const remedy of REMEDIES_DATABASE) {
    const isMatched = remedy.keywords.some((kw) => query.includes(kw));
    if (isMatched) {
      return {
        text: `Based on your symptoms, the recommended homeopathic remedy is **${remedy.name}** (${remedy.category}).\n\n• **Indications**: ${remedy.indications}\n• **Dosage**: ${remedy.dosage}\n• **Price**: ₹${remedy.price} per 30ml drop bottle.\n\n*Note: For recurrent or chronic issues, an individual consultation with Dr. Ancy is advised.*`,
        remedy: remedy,
        showConsultationCTA: true,
        showWhatsAppCTA: true,
        whatsappPrefillText: `Hello Dr. Ancy, I am asking about ${remedy.name} for my symptoms (${userMessage}). Could you advise?`,
        quickReplies: [
          `🛒 Order ${remedy.name}`,
          '🩺 Consult Dr. Ancy (₹99)',
          '💧 How to take drops',
          '📱 Chat on WhatsApp'
        ]
      };
    }
  }

  // 8. General Health / Chronic Conditions (PCOS, Thyroid, Hair fall, Skin, Diabetes, etc.)
  if (
    query.includes('hair') ||
    query.includes('pcos') ||
    query.includes('pcod') ||
    query.includes('thyroid') ||
    query.includes('skin') ||
    query.includes('acne') ||
    query.includes('pimples') ||
    query.includes('eczema') ||
    query.includes('psoriasis') ||
    query.includes('sinus') ||
    query.includes('stone') ||
    query.includes('piles') ||
    query.includes('fissure') ||
    query.includes('chronic') ||
    query.includes('sleep') ||
    query.includes('insomnia')
  ) {
    return {
      text: `Homeopathy excels at treating chronic conditions like **${userMessage}** by addressing the root constitutional cause rather than just suppressing symptoms.\n\nBecause homeopathic remedies for chronic ailments are highly personalized to your unique physical constitution, mental temperament, and symptom modalities, we strongly recommend a **₹99 video consultation with ${CLINIC_DOCTOR_NAME} (BHMS)**.\n\nDr. Ancy will review your history, design a customized treatment course, and arrange your remedies for delivery.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I want to consult you regarding homeopathic treatment for: "${userMessage}".`,
      quickReplies: ['🩺 Book Video Consult (₹99)', '📱 WhatsApp Dr. Ancy', '💧 General Dosage Rules']
    };
  }

  // 9. Greetings & Polite inquiries
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query.includes('good morning') ||
    query.includes('good afternoon') ||
    query.includes('good evening') ||
    query.includes('who are you')
  ) {
    return {
      text: `Hello! 👋 Welcome to **MEDI DROP Homeopathy Clinic**.\n\nI am your AI Healthcare Assistant, working alongside **${CLINIC_DOCTOR_NAME}** (BHMS). How can I assist your health today?\n\n• **Symptom Check**: Ask for remedies (e.g., acidity, cold, joint pain, allergies, warts)\n• **Consultation**: Book a 1-on-1 video call for ₹99\n• **Dosage**: Learn how to take liquid drops properly\n• **WhatsApp**: Chat directly with Dr. Ancy at **${CLINIC_PHONE_DISPLAY}**`,
      showConsultationCTA: true,
      quickReplies: [
        '🌿 Remedy for Acidity & Gas',
        '🩺 Book Doctor Consult (₹99)',
        '🤧 Cold & Cough Relief',
        '📱 Chat on WhatsApp'
      ]
    };
  }

  // 10. Thank you & Farewell
  if (query.includes('thank') || query.includes('bye') || query.includes('ok') || query.includes('okay')) {
    return {
      text: `You're very welcome! Wishing you great health and vitality with natural homeopathic healing. 🌱\n\nIf you ever need personalized medical advice, Dr. Ancy is always just a click away on WhatsApp at **${CLINIC_PHONE_DISPLAY}**. Have a wonderful day!`,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, thank you for your assistance on MEDI DROP.`,
      quickReplies: ['🩺 Book ₹99 Consult', '🌿 Browse Remedies']
    };
  }

  // 11. Fallback / General inquiry
  return {
    text: `Thank you for sharing. Homeopathy offers safe, targeted natural remedies for this condition.\n\nTo give you the most accurate remedy recommendation, could you tell me a little more about:\n• When did the symptoms start?\n• Does anything make it feel better or worse (e.g. cold, warmth, motion)?\n\nAlternatively, you can chat directly with **${CLINIC_DOCTOR_NAME}** on WhatsApp (**${CLINIC_PHONE_DISPLAY}**) or book a **₹${CONSULTATION_FEE} private video consultation**.`,
    showConsultationCTA: true,
    showWhatsAppCTA: true,
    whatsappPrefillText: `Hello Dr. Ancy, I need homeopathic guidance for: "${userMessage}".`,
    quickReplies: [
      '🩺 Book ₹99 Video Consult',
      '📱 Chat on WhatsApp',
      '🌿 Common Acute Remedies',
      '💧 How to take drops'
    ]
  };
}
