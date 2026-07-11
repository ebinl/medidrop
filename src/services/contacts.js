import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const contactsRef = collection(db, 'contacts');

export async function submitContact(data) {
  const docRef = await addDoc(contactsRef, {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: (data.phone || '').trim(),
    subject: (data.subject || '').trim(),
    message: data.message.trim(),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function subscribeContacts(onData, onError) {
  const q = query(contactsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() ?? null,
        };
      });
      onData(items);
    },
    onError
  );
}
