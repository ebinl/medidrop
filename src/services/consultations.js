import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const consultationsRef = collection(db, 'consultations');

export async function submitConsultation(data) {
  const docRef = await addDoc(consultationsRef, {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: (data.phone || '').trim(),
    symptoms: (data.symptoms || '').trim(),
    date: data.date || '',
    time: data.time || '',
    paymentMethod: data.paymentMethod || 'upi',
    upiRefNo: data.upiRefNo || '',
    cardHolder: data.cardHolder || '',
    cardLast4: data.cardLast4 || '',
    amount: 49,
    status: 'booked',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function subscribeConsultations(onData, onError) {
  const q = query(consultationsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() ?? null,
        };
      });
      onData(items);
    },
    onError
  );
}
