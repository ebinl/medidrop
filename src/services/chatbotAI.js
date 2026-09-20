/**
 * MEDI DROP Homeopathy — Intelligent AI Clinical Healthcare Assistant
 * Integrates Google Gemini AI for deep natural language conversation
 * Equipped with comprehensive clinical homeopathy knowledge base for instant offline answers
 *
 * Doctor: Dr. Ancy Shaji (BHMS) · Phone: +91 97467 58698
 */

export const CLINIC_WHATSAPP_NUMBER = '9746758698';
export const CLINIC_PHONE_DISPLAY = '+91 97467 58698';
export const CLINIC_DOCTOR_NAME = 'Dr. Ancy Shaji';
export const CONSULTATION_FEE = 99;

const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env)
  ? (import.meta.env.VITE_GEMINI_API_KEY || '')
  : '';
const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ── Gemini System Prompt ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the official AI Healthcare Assistant for MEDI DROP Homeopathy Clinic, run by Dr. Ancy Shaji (BHMS, Senior Homeopathic Physician).

CLINIC INFORMATION:
- Doctor: Dr. Ancy Shaji, BHMS (Senior Homeopathic Physician)
- WhatsApp / Phone: +91 97467 58698
- Email: medidrop.co.in@gmail.com
- Timings: Monday to Saturday, 10:00 AM to 8:00 PM IST
- Video Consultation: ₹99 (via Google Meet or WhatsApp Video)
- Pan-India Delivery: Dispatched in 24 hours, arrives in 2-4 business days. FREE shipping on orders above ₹499 (₹50 below that).
- Payment: Google Pay, PhonePe, Paytm, BHIM UPI (UPI ID: ancyshaji1996@oksbi)

AVAILABLE MEDICINES (30ml sealed bottles):
1. Nux Vomica 200C — ₹150 (Acidity, gas, bloating, indigestion, heartburn, hangover)
2. Arnica Montana 30C — ₹180 (Pain relief, muscle soreness, bruises, back pain, post-injury)
3. Aconitum Napellus 30C — ₹160 (Sudden cold, dry cough, feverish chills, weather change)
4. Bryonia Alba 200C — ₹190 (Sharp joint pain, knee stiffness, dry painful cough)
5. Rhus Toxicodendron 30C — ₹175 (Sprains, lower backache, joint stiffness better with warm movement)
6. Gelsemium 200C — ₹210 (Anxiety, exam stress, dull occipital tension headache, fatigue)
7. Chamomilla 30C — ₹145 (Baby colic, teething pain, crying, restless irritability)
8. Apis Mellifica 30C — ₹185 (Hives, urticaria, bee stings, itchy swollen red skin allergy)
9. Allium Cepa 30C — ₹155 (Allergic rhinitis, runny nose, sneezing fits, hay fever)
10. Thuja Occidentalis 200C — ₹220 (Warts, skin tags, corns, polyps)

CHRONIC CONDITIONS (Recommend ₹99 video consultation with Dr. Ancy):
PCOD/PCOS, Migraine, Thyroid (Hypo/Hyper), Diabetes, Arthritis, Chronic Eczema, Psoriasis, Hair Fall & Alopecia, Kidney Stones, Sinusitis, Piles/Fissures, Insomnia.

DOSAGE RULES:
- 4 to 5 drops in 2 to 3 tablespoons of lukewarm water.
- Clean mouth 15 minutes before and after (no food, coffee, or tobacco).
- Never touch the dropper tip with fingers or tongue.
- Can be safely taken alongside allopathic medicines (keep a 30-45 min gap).

RESPONSE RULES:
- Provide empathetic, clinical, actionable guidance with homeopathic remedy names and dosage instructions.
- Keep answers structured with **bold** text and bullet points.
- Always provide next steps: booking a ₹99 video consult or chatting with Dr. Ancy on WhatsApp (+91 97467 58698).
- For severe medical emergencies (chest pain, breathlessness, heavy trauma), advise calling 112/108 immediately.`;

/**
 * Builds a direct WhatsApp click-to-chat URL with optional pre-filled text
 */
export function buildWhatsAppLink(customMessage) {
  const base = `https://wa.me/91${CLINIC_WHATSAPP_NUMBER}`;
  if (!customMessage || !customMessage.trim()) {
    const defaultText = encodeURIComponent(
      `Hello Dr. Ancy / MEDI DROP Clinic, I would like to consult regarding homeopathic treatment.`
    );
    return `${base}?text=${defaultText}`;
  }
  return `${base}?text=${encodeURIComponent(customMessage.trim())}`;
}

export const QUICK_TOPICS = [
  { label: '🩺 Book ₹99 Consult', query: 'I want to book an online video consultation with Dr. Ancy' },
  { label: '🌿 Acidity & Gas', query: 'What is the best remedy for acidity, gas and indigestion?' },
  { label: '🤧 Cold & Cough', query: 'I have cold, dry cough and sore throat' },
  { label: '🦵 Joint & Knee Pain', query: 'Remedy for joint stiffness, knee pain and arthritis' },
  { label: '💆 Migraine Relief', query: 'Remedy for severe throbbing migraine headache' },
  { label: '🌸 PCOD & Periods', query: 'Homeopathic treatment for PCOD, ovarian cysts and irregular periods' },
  { label: '🦋 Thyroid Care', query: 'How does homeopathy help in thyroid problems and fatigue?' },
  { label: '✨ Skin & Hair Fall', query: 'Remedy for hair fall, dandruff, acne and eczema' },
  { label: '😰 Anxiety & Stress', query: 'Remedies for anxiety, panic, tension and insomnia' },
  { label: '💧 How to take drops', query: 'How do I take homeopathic drops? What is the dosage and rules?' },
  { label: '📦 Delivery & Orders', query: 'What are the delivery charges, time and tracking info?' },
  { label: '📱 Chat on WhatsApp', query: 'Connect me directly with Dr. Ancy on WhatsApp' },
];

/**
 * Knowledge Base for Core Homeopathic Remedies in Medi Drop
 */
export const REMEDIES_DATABASE = [
  {
    id: 2,
    name: 'Nux Vomica 200C',
    category: 'Digestive Care',
    price: 150,
    indications: 'Severe acidity, heartburn, gas, bloating, acid reflux (GERD), indigestion, and sluggish bowel after rich/spicy food.',
    dosage: '4 to 5 drops in 2 tablespoons lukewarm water, twice daily (ideally after dinner or at bedtime).',
    keywords: ['acid', 'acidity', 'gas', 'bloat', 'bloating', 'gerd', 'reflux', 'heartburn', 'indigestion', 'stomach', 'gastric', 'constipat', 'vomit', 'nux vomica', 'burp', 'burping', 'dyspepsia', 'nausea', 'belly ache', 'stomach ache', 'stomach pain', 'flatulence']
  },
  {
    id: 1,
    name: 'Arnica Montana 30C',
    category: 'Pain Relief & Healing',
    price: 180,
    indications: 'Bruises, muscular soreness, body aches, joint pain, post-workout sprains, blunt injury trauma, backache.',
    dosage: '4 drops diluted in 2 tablespoons water, 2 to 3 times daily until soreness subsides.',
    keywords: ['arnica', 'bruise', 'sore', 'soreness', 'muscle ache', 'injury', 'trauma', 'pain relief', 'body ache', 'fall', 'hit', 'strain', 'muscle pain', 'body pain', 'sprain pain', 'swelling from injury', 'wound pain']
  },
  {
    id: 3,
    name: 'Aconitum Napellus 30C',
    category: 'Cold, Fever & Chills',
    price: 160,
    indications: 'Sudden onset colds, dry tickly cough, feverish chills, sneezing triggered by cold dry wind or sudden weather change.',
    dosage: '4 drops in water every 3 to 4 hours on the first day of cold onset, then twice daily.',
    keywords: ['cold', 'cough', 'chill', 'fever', 'flu', 'sneeze', 'dry cough', 'throat', 'shiver', 'aconite', 'aconitum', 'runny nose', 'blocked nose', 'nasal', 'sore throat', 'temperature', 'feverish', 'weather change cold']
  },
  {
    id: 4,
    name: 'Bryonia Alba 200C',
    category: 'Joint & Rheumatic Pain',
    price: 190,
    indications: 'Sharp stitching joint pain, knee stiffness, or rheumatism where pain worsens on movement and feels relieved with rest.',
    dosage: '4 drops in 2 tablespoons of water, twice daily.',
    keywords: ['bryonia', 'joint pain', 'knee pain', 'rheumatism', 'arthritis', 'sharp pain', 'stiffness', 'movement pain', 'knee', 'joint swelling', 'joint ache', 'walking pain']
  },
  {
    id: 5,
    name: 'Rhus Toxicodendron 30C',
    category: 'Sprains, Strains & Backache',
    price: 175,
    indications: 'Torn ligaments, sprains, lower backache, morning joint stiffness that improves with gentle warm movement.',
    dosage: '4 drops in water, 2 to 3 times daily.',
    keywords: ['rhus tox', 'sprain', 'ligament', 'backache', 'lower back', 'tendon', 'twisted', 'stiff neck', 'back pain', 'lumbar', 'spine', 'morning stiffness', 'neck pain']
  },
  {
    id: 6,
    name: 'Gelsemium 200C',
    category: 'Stress, Tension & Fatigue',
    price: 210,
    indications: 'Anticipatory anxiety, exam nervousness, stage fright, dull occipital tension headaches, fatigue, mental heaviness.',
    dosage: '4 drops in water before high-stress events or twice daily during periods of mental fatigue.',
    keywords: ['anxiety', 'stress', 'nervous', 'panic', 'headache', 'dull head', 'fatigue', 'exam', 'tired', 'gelsemium', 'migraine', 'tension headache', 'weakness', 'stage fright', 'worry', 'overthinking', 'exhaustion']
  },
  {
    id: 7,
    name: 'Chamomilla 30C',
    category: 'Pediatric & Colic Care',
    price: 145,
    indications: 'Teething troubles in infants, painful swollen gums, baby colic cramps, irritability, sleepless crying.',
    dosage: '2 drops in a teaspoon of clean boiled water, 2 to 3 times daily.',
    keywords: ['baby', 'infant', 'child', 'teething', 'colic', 'gum', 'crying', 'restless', 'chamomilla', 'pediatric', 'newborn', 'toddler', 'baby colic', 'baby crying', 'kids colic', 'teething baby']
  },
  {
    id: 8,
    name: 'Apis Mellifica 30C',
    category: 'Allergies & Skin Rashes',
    price: 185,
    indications: 'Hives (urticaria), burning red skin swellings, bee or insect stings, puffy eyelids, hot itchy rashes.',
    dosage: '4 drops in water every 2 to 3 hours during acute flare-ups.',
    keywords: ['hive', 'hives', 'urticaria', 'rash', 'insect bite', 'bee sting', 'sting', 'swelling', 'itch', 'burning skin', 'apis', 'allergy rash', 'itching', 'skin allergy', 'prickly heat', 'red spots', 'skin allergy']
  },
  {
    id: 9,
    name: 'Allium Cepa 30C',
    category: 'Allergic Rhinitis & Sinus',
    price: 155,
    indications: 'Seasonal hay fever, constant sneezing fits, clear burning runny nose, bland watery eyes, pollen allergies.',
    dosage: '4 drops in half a cup of water, 3 times daily.',
    keywords: ['allergic rhinitis', 'hay fever', 'running nose', 'runny nose', 'sneezing', 'watery eyes', 'allium cepa', 'allergy', 'pollen', 'dust allergy', 'nose allergy', 'continuous sneeze']
  },
  {
    id: 10,
    name: 'Thuja Occidentalis 200C',
    category: 'Skin Tag & Wart Care',
    price: 220,
    indications: 'Warts, skin tags, benign polyp growths, corns, nodules. Non-invasive, safe and painless resolution.',
    dosage: '4 drops directly in water, taken once daily on an empty stomach for 3 to 4 weeks.',
    keywords: ['wart', 'warts', 'skin tag', 'skin tags', 'mole', 'corn', 'nodule', 'polyp', 'thuja', 'skin growth', 'verruca', 'neck tags']
  }
];

// ── Gemini API Call ──────────────────────────────────────────────────────────
async function callGeminiAPI(userMessage, history = []) {
  const recentHistory = (history || []).slice(-6);
  const contents = [];

  for (const msg of recentHistory) {
    if (msg.sender === 'user' && msg.text) {
      contents.push({ role: 'user', parts: [{ text: msg.text }] });
    } else if (msg.sender === 'bot' && msg.text) {
      contents.push({ role: 'model', parts: [{ text: msg.text }] });
    }
  }

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const requestBody = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.6,
      topP: 0.9,
      maxOutputTokens: 450,
    }
  };

  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Gemini ${response.status}: ${errData?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  return text.trim();
}

// ── Detect Matching Remedy ────────────────────────────────────────────────────
export function detectRemedy(query) {
  const q = query.toLowerCase();
  for (const remedy of REMEDIES_DATABASE) {
    if (remedy.keywords.some((kw) => q.includes(kw))) return remedy;
  }
  return null;
}

// ── Auto-derive quick replies ─────────────────────────────────────────────────
function deriveQuickReplies(text) {
  const t = (text || '').toLowerCase();
  const replies = [];

  if (t.includes('consult') || t.includes('99') || t.includes('dr. ancy')) {
    replies.push('🩺 Book ₹99 Consult');
  }
  if (t.includes('remedy') || t.includes('medicine') || t.includes('drops') || t.includes('nux') || t.includes('arnica')) {
    replies.push('🌿 View Remedies');
  }
  if (t.includes('deliver') || t.includes('ship') || t.includes('order') || t.includes('track')) {
    replies.push('📦 Delivery Info');
  }
  if (t.includes('dosage') || t.includes('how to take') || t.includes('water')) {
    replies.push('💧 How to take drops');
  }
  replies.push('📱 Chat on WhatsApp');
  return [...new Set(replies)].slice(0, 4);
}

// ── Comprehensive Clinical AI Knowledge Engine ────────────────────────────────
export function getClinicalAIResponse(userMessage, query) {
  const q = (query || '').toLowerCase().trim();

  // 1. EMERGENCY
  if (/\b(chest pain|heart attack|cannot breathe|difficulty breathing|breathlessness|severe bleeding|unconscious|stroke|paralysis|emergency)\b/i.test(q)) {
    return {
      text: `🚨 **EMERGENCY ADVISORY:**\n\nFor severe emergency conditions like acute chest pain, severe breathlessness, sudden numbness, or heavy trauma, please **call 112 / 108 or go to the nearest emergency hospital immediately**.\n\nHomeopathy is for non-critical constitutional & chronic care. For urgent clinic inquiries, reach Dr. Ancy at **${CLINIC_PHONE_DISPLAY}**.`,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Urgent inquiry for Dr. Ancy Shaji from MEDI DROP website.`,
      quickReplies: ['📱 Call Clinic Helpline', '🩺 Book Video Consult (₹99)']
    };
  }

  // 2. GREETINGS & INTRODUCTIONS
  if (/^(hi|hello|hey|hola|namaste|good\s*morning|good\s*afternoon|good\s*evening|howdy|heyy+|hii+)\b/i.test(q) || q === 'hi' || q === 'hello' || q === 'hey') {
    return {
      text: `Hello! 👋 Welcome to **MEDI DROP Homeopathy Clinic**.\n\nI'm your **AI Healthcare Assistant**, working alongside **${CLINIC_DOCTOR_NAME}** (BHMS). How can I help you today?\n\n• 🌿 **Remedy Recommendations** for acidity, headache, colds, joint pain, skin & hair\n• 🩺 **Book 1-on-1 Video Consult** for **₹${CONSULTATION_FEE}**\n• 💧 **Dosage & Usage Instructions** for liquid drops\n• 📦 **Medicine Orders & Fast Delivery** across India\n• 📱 **Direct WhatsApp Support** with Dr. Ancy\n\n*Type any health question or symptom to begin!*`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I am visiting the MEDI DROP website and would like to inquire about treatment.`,
      quickReplies: ['🌿 Acidity & Gas', '🤧 Cold & Cough', '🩺 Book ₹99 Consult', '🦵 Joint Pain']
    };
  }

  // 3. WHO IS DOCTOR / QUALIFICATIONS
  if (/\b(who is (the )?doctor|doctor qualification|doctor qualifications|about (the )?doctor|who is dr ancy|bhms degree|doctor credentials|doctor experience|physician details|tell me about doctor)\b/i.test(q)) {
    return {
      text: `**About Dr. Ancy Shaji (BHMS):**\n\n• **Designation**: Senior Homeopathic Physician & Founder of MEDI DROP\n• **Degree**: Bachelor of Homeopathic Medicine and Surgery (BHMS)\n• **Expertise**: Chronic lifestyle disorders, PCOD/PCOS, Thyroid balance, Migraine management, Dermatology (Eczema/Acne/Hair fall), and Pediatric wellness.\n• **Consultation**: 1-on-1 private video calls via Google Meet or WhatsApp Video for **₹${CONSULTATION_FEE}**.\n• **Phone / WhatsApp**: **${CLINIC_PHONE_DISPLAY}** 📱`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy Shaji, I would like to book a consultation with you.`,
      quickReplies: ['🩺 Book Video Consult (₹99)', '📱 WhatsApp Doctor', '🌿 View Treatments']
    };
  }

  // 4. DIET RESTRICTIONS (Coffee, Onion, Garlic) — checked before booking so "coffee" does not trigger "fee"
  if (/\b(diet|coffee|tea|onion|garlic|food restriction|restrictions|eating|tobacco|smoking|alcohol)\b/i.test(q)) {
    return {
      text: `**Dietary Guidelines During Homeopathic Treatment:**\n\n• **Coffee & Tea**: You can drink coffee/tea, but ensure at least a **30-minute gap** before or after taking your medicine.\n• **Raw Onion & Garlic**: Moderate consumption in cooked meals is fine. Avoid eating strong raw onion/garlic right before taking drops.\n• **Mint & Camphor**: Avoid strong menthol lozenges, eucalyptus balms, or camphor near your medicines as strong aromas can neutralize potencies.\n• **Alcohol & Tobacco**: Limit or avoid as they irritate digestive mucous membranes.`,
      showConsultationCTA: true,
      quickReplies: ['💧 How to take drops', '🩺 Consult Dr. Ancy (₹99)', '🌿 View Remedies']
    };
  }

  // 5. ALLOPATHY + HOMEOPATHY TOGETHER / SIDE EFFECTS
  if (/\b(side effect|side effects|allopathy|allopathic|english medicine|with other medicine|safe|is it safe|harmful|chemical|steroid|steroids)\b/i.test(q)) {
    return {
      text: `**Safety & Compatibility of Homeopathy:**\n\n• **100% Natural & Safe**: Homeopathic dilutions contain zero toxic chemicals, zero steroids, and cause no drowsiness or dependency.\n• **Compatible with Allopathy**: Yes! You can safely take homeopathic remedies alongside ongoing BP, diabetes, or thyroid allopathic medicines.\n• **Important Rule**: Maintain a **30 to 60 minute gap** between homeopathic drops and any allopathic medications.\n• **Never Stop Critical Meds**: Do not suddenly stop your prescription drugs without your doctor's supervision.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I have a question about taking homeopathy with my current medications.`,
      quickReplies: ['🩺 Book Video Consult', '💧 Dosage Guide', '📱 WhatsApp Doctor']
    };
  }

  // 6. HOW TO TAKE DROPS / DOSAGE RULES
  if (/\b(dosage|dose|doses|how to take|how to use|drops|how many drops|rules|instructions|water|when to take|how much drops)\b/i.test(q)) {
    return {
      text: `**Standard Guidelines for Taking Homeopathic Drops:**\n\n1. **Clean Mouth Rule**: Ensure mouth is clean 15 minutes before & after taking drops (no food, tea, coffee, or smoking).\n2. **Dilution**: Take **4 to 5 drops** in **2 to 3 tablespoons** of lukewarm water. Sip slowly.\n3. **Timing**: Usually taken twice daily — morning (empty stomach) and evening.\n4. **Dropper Hygiene**: Never touch the dropper tip with tongue or fingers to prevent contamination.\n5. **Storage**: Keep away from direct sunlight, camphor, balms, and strong perfumes.\n\n*100% natural, gentle, and safe for all age groups.* 🌿`,
      showConsultationCTA: true,
      quickReplies: ['🌿 Acidity Remedy', '🤧 Cold Remedy', '🩺 Consult Dr. Ancy (₹99)', '📱 Ask on WhatsApp']
    };
  }

  // 7. CONSULTATION BOOKING & PRICING
  if (/\b(book|booking|appointment|consult|consultation|schedule|slots|slot|video call|online consult|consult fee|consultation fee|how much is consult|pricing)\b/i.test(q)) {
    return {
      text: `**Book a 1-on-1 Video Consultation with Dr. Ancy Shaji:**\n\n• **Fee**: Only **₹${CONSULTATION_FEE}** (Special introductory clinic rate)\n• **Mode**: Private video call on Google Meet or WhatsApp Video\n• **Timings**: Mon–Sat, 10:00 AM – 8:00 PM IST\n• **What's Included**:\n  1. Complete constitutional case analysis\n  2. Custom personalized remedy prescription\n  3. Diet & lifestyle protocol\n  4. Pan-India home delivery of medicines 📦\n\nTap the button below to book your slot!`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I would like to book a video consultation for ₹99. Please share available slots.`,
      quickReplies: ['🩺 Book Consultation (₹99)', '📱 WhatsApp for Slots', '🌿 View Remedies']
    };
  }

  // 8. DELIVERY, SHIPPING & TRACKING
  if (/\b(delivery|deliver|shipping|ship|courier|tracking|track|pan india|order status|when will i receive|dispatch)\b/i.test(q)) {
    return {
      text: `**MEDI DROP Shipping & Delivery Details:**\n\n• **Dispatch**: Orders are dispatched within **24 hours** from our clinical pharmacy.\n• **Delivery Time**: **2 to 4 business days** pan-India.\n• **Free Shipping**: FREE delivery on all orders **above ₹499** (₹50 flat fee for smaller orders).\n• **Packaging**: Tamper-proof, leak-proof sealed clinical glass bottles.\n• **Tracking**: Live tracking ID sent via WhatsApp & SMS after dispatch 📦\n\nTrack your order anytime via WhatsApp: **${CLINIC_PHONE_DISPLAY}**.`,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello MEDI DROP Team, I would like to track my order.`,
      quickReplies: ['📦 Track My Order', '🌿 Browse Remedies', '🩺 Book Consult']
    };
  }

  // 9. PAYMENT & UPI
  if (/\b(pay|payment|upi|google pay|gpay|phonepe|paytm|bhim|qr code|bank transfer|account)\b/i.test(q)) {
    return {
      text: `**Payment Options at MEDI DROP:**\n\n• **Accepted Modes**: Google Pay, PhonePe, Paytm, BHIM UPI, Net Banking ✅\n• **Clinic UPI ID**: \`ancyshaji1996@oksbi\`\n• **Confirmation**: Instant booking receipt and WhatsApp confirmation sent immediately upon payment verification.\n• **Security**: 100% secure encrypted direct UPI transaction.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello MEDI DROP, I have completed the ₹99 payment and would like to share my screenshot.`,
      quickReplies: ['🩺 Book Consultation (₹99)', '🌿 View Medicines']
    };
  }

  // 10. SPECIFIC AILMENT: ACIDITY, GAS & STOMACH
  if (['acid', 'acidity', 'gas', 'bloat', 'gerd', 'reflux', 'heartburn', 'indigestion', 'gastric', 'burp', 'stomach ache', 'stomach pain'].some(k => q.includes(k))) {
    return {
      text: `**For Acidity, Gas & Heartburn:**\n\nWe recommend **Nux Vomica 200C** (₹150 / 30ml):\n\n• **Why it helps**: Quickly neutralizes stomach acid, relieves bloated stomach pressure, eases chest burning (heartburn), and aids slow digestion.\n• **Dosage**: 4–5 drops in 2 tablespoons lukewarm water, twice daily after meals (especially after dinner).\n• **Quick Tip**: Avoid sleeping immediately after heavy dinner; drink warm water in the morning.`,
      remedy: REMEDIES_DATABASE.find(r => r.id === 2),
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I need advice for severe acidity and gas trouble.`,
      quickReplies: ['🛒 Order Nux Vomica 200C', '🩺 Consult Dr. Ancy (₹99)', '💧 Dosage Guide']
    };
  }

  // 11. SPECIFIC AILMENT: COLD, COUGH & SORE THROAT
  if (['cold', 'cough', 'sore throat', 'throat pain', 'tonsil', 'flu', 'phlegm', 'dry cough', 'wet cough', 'sneeze', 'running nose'].some(k => q.includes(k))) {
    return {
      text: `**For Cold, Cough & Throat Irritation:**\n\nWe recommend **Aconitum Napellus 30C** (₹160 / 30ml):\n\n• **Why it helps**: Ideal for sudden onset colds, dry tickly coughs, chills, and throat soreness triggered by weather shifts or AC.\n• **Dosage**: 4 drops in a little warm water every 3 to 4 hours on day 1, then twice daily.\n• **For Allergic Sneezing**: If you have non-stop watery sneezing, **Allium Cepa 30C** (₹155) is the remedy of choice.`,
      remedy: REMEDIES_DATABASE.find(r => r.id === 3),
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I have a cold, cough and throat infection. Could you advise?`,
      quickReplies: ['🛒 Order Aconitum 30C', '🌿 View Allium Cepa', '🩺 Consult Dr. Ancy (₹99)']
    };
  }

  // 12. SPECIFIC AILMENT: HEADACHE & MIGRAINE
  if (['headache', 'migraine', 'head pain', 'throbbing head', 'one sided head', 'aura'].some(k => q.includes(k))) {
    return {
      text: `**For Migraines & Severe Headaches:**\n\n• **Sudden Throbbing Pain with Heat**: **Belladonna 200C** (₹175) provides fast vascular relief.\n• **Stress & Tension Headache**: **Gelsemium 200C** (₹210) relieves dull heaviness and occipital tightness.\n• **Migraine with Nausea & Acidity**: **Iris Versicolor 30C**.\n\n*Migraines often have constitutional triggers (hormones, food, eye strain). A ₹99 consultation with Dr. Ancy provides permanent root-cause relief.*`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I suffer from frequent migraine headaches and need a treatment plan.`,
      quickReplies: ['🩺 Book Migraine Consult (₹99)', '🌿 View Gelsemium 200C', '📱 WhatsApp Doctor']
    };
  }

  // 13. SPECIFIC AILMENT: JOINT, KNEE & BACK PAIN
  if (['joint pain', 'knee pain', 'arthritis', 'back pain', 'backache', 'stiffness', 'sciatica', 'lumbar', 'spondylosis', 'rheumatism'].some(k => q.includes(k))) {
    return {
      text: `**For Joint Pain, Knee Stiffness & Backache:**\n\n• **Pain Worse on Movement**: **Bryonia Alba 200C** (₹190) — for sharp knee/joint pain relieved only by resting.\n• **Stiffness Better on Moving / Warmth**: **Rhus Toxicodendron 30C** (₹175) — classic remedy for morning stiffness and lower back pain.\n• **Muscular Body Ache / Sprains**: **Arnica Montana 30C** (₹180).\n\n*Constitutional homeopathic protocols help rebuild joint comfort and mobility safely without NSAID gastric side effects.*`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I have chronic joint and back pain and would like homeopathic guidance.`,
      quickReplies: ['🛒 Order Bryonia 200C', '🛒 Order Rhus Tox 30C', '🩺 Book Consult (₹99)']
    };
  }

  // 14. SPECIFIC AILMENT: PCOD, PCOS & WOMEN'S HEALTH
  if (['pcod', 'pcos', 'period', 'irregular period', 'ovarian cyst', 'hormone', 'menstrual', 'cramp', 'white discharge', 'menopause'].some(k => q.includes(k))) {
    return {
      text: `**Homeopathic Protocol for PCOD / PCOS & Hormonal Balance:**\n\n• **Core Approach**: Homeopathy naturally regularizes your menstrual cycle, balances LH/FSH hormone ratios, dissolves ovarian cysts, and clears hormonal acne and weight gain without synthetic hormone pills.\n• **Key Constitutional Remedies**: **Pulsatilla 200C**, **Sepia 200C**, and **Calcarea Carbonica 200C**.\n• **Recommendation**: Because PCOD requires individualized remedy selection matching your exact ultrasound & symptom profile, we strongly recommend a **₹99 Video Consultation with Dr. Ancy Shaji**.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I want to consult you regarding homeopathic treatment for PCOD / PCOS.`,
      quickReplies: ['🩺 Book PCOD Consult (₹99)', '📱 WhatsApp Dr. Ancy', '🌿 View Treatments']
    };
  }

  // 15. SPECIFIC AILMENT: THYROID (Hypo / Hyper)
  if (['thyroid', 'hypothyroid', 'hyperthyroid', 'tsh', 't3', 't4', 'gland'].some(k => q.includes(k))) {
    return {
      text: `**Homeopathic Care for Thyroid Health:**\n\n• **How it Works**: Stimulates your thyroid gland naturally to regulate TSH/T3/T4 synthesis, overcoming sluggish metabolism, chronic fatigue, cold intolerance, and sudden weight gain.\n• **Key Remedies**: **Iodum 200C**, **Thyroidinum 3X**, and **Calcarea Carbonica 1M**.\n• **Safe with Allopathy**: Can be taken safely alongside thyroxine (Thyronorm/Eltroxin) with a 45-minute gap. Dr. Ancy will monitor your TSH levels to help taper dosage over time.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I need homeopathic treatment for my thyroid condition.`,
      quickReplies: ['🩺 Book Thyroid Consult (₹99)', '📱 WhatsApp Doctor', '💧 How to take drops']
    };
  }

  // 16. SPECIFIC AILMENT: SKIN, ACNE, ECZEMA, WARTS & HAIR FALL
  if (['hair', 'hair fall', 'alopecia', 'dandruff', 'skin', 'acne', 'pimple', 'eczema', 'psoriasis', 'wart', 'skin tag', 'itching', 'allergy'].some(k => q.includes(k))) {
    return {
      text: `**Homeopathic Dermatology & Hair Care:**\n\n• **Warts & Skin Tags**: **Thuja Occidentalis 200C** (₹220) — 4 drops once daily on empty stomach for safe painless removal.\n• **Skin Allergy & Hives (Itching)**: **Apis Mellifica 30C** (₹185) — rapid relief for burning red rashes.\n• **Hair Fall & Dandruff**: Targeted constitutional therapy with **Natrum Mur 1M** & **Arnica Scalp Tonic**.\n• **Chronic Eczema & Acne**: Non-suppressive internal purification with **Sulphur 200C** / **Berberis Aquifolium**.\n\n*Book a ₹99 video consultation with Dr. Ancy for a complete customized skin/hair regimen.*`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I need homeopathic guidance for skin / hair fall treatment.`,
      quickReplies: ['🛒 Order Thuja 200C (Warts)', '🛒 Order Apis 30C (Allergy)', '🩺 Consult Dr. Ancy (₹99)']
    };
  }

  // 17. SPECIFIC AILMENT: ANXIETY, STRESS & SLEEP (INSOMNIA)
  if (['anxiety', 'stress', 'panic', 'tension', 'sleep', 'insomnia', 'depression', 'restless', 'overthinking', 'mind'].some(k => q.includes(k))) {
    return {
      text: `**Remedies for Anxiety, Stress & Restful Sleep:**\n\n• **Acute Anticipatory Anxiety / Exam Nerves**: **Gelsemium 200C** (₹210) — calms trembling, nervous stomach, and mental dread.\n• **Sudden Panic Attacks**: **Aconitum 30C** — rapid calm for racing heart & intense fear.\n• **Insomnia & Night Racing Thoughts**: **Passiflora Incarnata Q** & **Kali Phos 6X** — promotes deep, restorative natural sleep with zero drowsiness or morning brain fog.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I would like advice on natural remedies for anxiety and insomnia.`,
      quickReplies: ['🛒 Order Gelsemium 200C', '🩺 Book Anxiety Consult (₹99)', '📱 WhatsApp Doctor']
    };
  }

  // 18. SPECIFIC AILMENT: DIABETES & BLOOD SUGAR
  if (['diabetes', 'sugar', 'glucose', 'blood sugar', 'diabetic'].some(k => q.includes(k))) {
    return {
      text: `**Homeopathic Support for Diabetes Management:**\n\n• **Syzygium Jambolanum Q (Mother Tincture)**: Revered botanical remedy that helps regulate glucose absorption, supports pancreatic efficiency, and curbs excessive thirst and urination.\n• **Uranium Nitricum 3X**: Alleviates diabetic exhaustion, digestive weakness, and neuropathy.\n• **Holistic Care**: Homeopathy works synergistically with your prescribed diet and medicine to prevent long-term diabetic complications.`,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I would like homeopathic advice for diabetes and sugar control.`,
      quickReplies: ['🩺 Book Diabetes Consult (₹99)', '📱 WhatsApp Dr. Ancy', '💧 Dosage Guide']
    };
  }

  // 19. SPECIFIC AILMENT: BABY COLIC & TEETHING
  if (['baby', 'infant', 'child', 'kid', 'teething', 'colic', 'crying'].some(k => q.includes(k))) {
    return {
      text: `**Pediatric & Infant Care:**\n\nWe recommend **Chamomilla 30C** (₹145 / 30ml):\n\n• **Why it helps**: The premier natural remedy for painful swollen teething gums, infant colic spasms, greenish stools, and irritable night crying.\n• **Dosage**: 2 drops in a teaspoon of clean boiled water, 2 to 3 times daily.\n• **Safety**: 100% gentle and completely safe for infants and toddlers.`,
      remedy: REMEDIES_DATABASE.find(r => r.id === 7),
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I need pediatric advice for my baby's teething / colic.`,
      quickReplies: ['🛒 Order Chamomilla 30C', '🩺 Consult Dr. Ancy (₹99)', '📱 WhatsApp Doctor']
    };
  }

  // 20. DIRECT REMEDY MATCH FROM DATABASE
  const detectedRemedy = detectRemedy(q);
  if (detectedRemedy) {
    return {
      text: `For your symptoms, we recommend **${detectedRemedy.name}** (${detectedRemedy.category}):\n\n• **Indications**: ${detectedRemedy.indications}\n• **Dosage**: ${detectedRemedy.dosage}\n• **Price**: ₹${detectedRemedy.price} for a 30ml sealed clinic bottle 🌿\n\n*All our medicines are prepared from Grade-1 German & Indian pharmacopoeia potencies.*`,
      remedy: detectedRemedy,
      showConsultationCTA: true,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, I want to order ${detectedRemedy.name} for: "${userMessage}".`,
      quickReplies: [`🛒 Order ${detectedRemedy.name}`, '🩺 Consult Dr. Ancy (₹99)', '💧 Dosage Rules', '📱 WhatsApp']
    };
  }

  // 21. THANK YOU / FAREWELL
  if (['thank', 'thanks', 'bye', 'goodbye', 'great', 'awesome', 'ok', 'okay', 'helpful', 'perfect'].some(k => q.includes(k))) {
    return {
      text: `You're very welcome! 🌱 Wishing you vibrant health and natural healing.\n\nIf you ever need personalized advice or remedy delivery, **${CLINIC_DOCTOR_NAME}** and MEDI DROP are always just a message away at **${CLINIC_PHONE_DISPLAY}**.\n\nHave a wonderful day! 🌸`,
      showWhatsAppCTA: true,
      whatsappPrefillText: `Hello Dr. Ancy, thank you for the guidance on MEDI DROP.`,
      quickReplies: ['🩺 Book ₹99 Consult', '🌿 Browse Remedies', '📱 WhatsApp Doctor']
    };
  }

  // 22. GENERAL INTELLIGENT FALLBACK
  return {
    text: `Thank you for reaching out to **MEDI DROP Homeopathy Clinic**! 🌿\n\nHomeopathy provides safe, individualized natural treatments for over 80+ acute and chronic health conditions.\n\nTo give you the most accurate remedy guidance:\n• What are your primary symptoms?\n• How long have you experienced them?\n• What makes the condition better or worse?\n\nOr feel free to **chat directly with Dr. Ancy Shaji** at **${CLINIC_PHONE_DISPLAY}** or book a **₹${CONSULTATION_FEE} private video consultation** below!`,
    showConsultationCTA: true,
    showWhatsAppCTA: true,
    whatsappPrefillText: `Hello Dr. Ancy, I need homeopathic guidance for: "${userMessage}".`,
    quickReplies: ['🩺 Book ₹99 Video Consult', '📱 Chat on WhatsApp', '🌿 Acidity & Gas', '🤧 Cold & Cough']
  };
}

// ── Main async export ─────────────────────────────────────────────────────────
/**
 * Smart chatbot response — uses Google Gemini AI when API key is set,
 * falls back seamlessly to the rich clinical AI engine with zero downtime.
 *
 * @param {string} userMessage
 * @param {Array} conversationHistory - [{sender: 'user'|'bot', text: string}]
 * @returns {Promise<Object>} Response object with text, CTAs, quickReplies etc.
 */
export async function getChatbotResponse(userMessage, conversationHistory = []) {
  const query = (userMessage || '').toLowerCase().trim();

  // 1. Instant check for emergencies (no latency)
  if (['chest pain', 'heart attack', 'cannot breathe', 'severe bleeding', 'unconscious'].some(k => query.includes(k))) {
    return getClinicalAIResponse(userMessage, query);
  }

  // 2. Detect remedy for structured card
  const detectedRemedy = detectRemedy(query);

  // 3. Try Gemini API if API key is configured
  const hasApiKey = GEMINI_API_KEY &&
    GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
    GEMINI_API_KEY.trim().length > 10;

  if (hasApiKey) {
    try {
      const aiText = await callGeminiAPI(userMessage, conversationHistory);
      const quickReplies = deriveQuickReplies(aiText);

      return {
        text: aiText,
        remedy: detectedRemedy || null,
        showConsultationCTA: true,
        showWhatsAppCTA: true,
        whatsappPrefillText: detectedRemedy
          ? `Hello Dr. Ancy, I'm asking about ${detectedRemedy.name} for: "${userMessage}"`
          : `Hello Dr. Ancy, I need homeopathic guidance for: "${userMessage}"`,
        quickReplies,
        isAiPowered: true
      };
    } catch (err) {
      console.warn('[MEDI DROP AI] Gemini API call skipped/failed, using clinical engine:', err.message);
      // Fall through to clinical AI engine below
    }
  }

  // 4. Clinical AI Knowledge Engine (Instant, robust, doctor-curated)
  const clinicalResponse = getClinicalAIResponse(userMessage, query);
  return { ...clinicalResponse, isAiPowered: false };
}
