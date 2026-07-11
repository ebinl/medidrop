import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
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
    read: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function markContactRead(id, read = true) {
  await updateDoc(doc(db, 'contacts', id), {
    read: Boolean(read),
    readAt: read ? serverTimestamp() : null,
  });
}

export async function deleteContact(id) {
  await deleteDoc(doc(db, 'contacts', id));
}

export async function clearAllContacts() {
  const snapshot = await getDocs(contactsRef);
  if (snapshot.empty) return 0;

  const docs = snapshot.docs;
  const chunkSize = 450;
  for (let i = 0; i < docs.length; i += chunkSize) {
    const batch = writeBatch(db);
    docs.slice(i, i + chunkSize).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  return docs.length;
}

export function subscribeContacts(onData, onError) {
  const q = query(contactsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          read: Boolean(data.read),
          createdAt: data.createdAt?.toDate?.() ?? null,
        };
      });
      onData(items);
    },
    onError
  );
}
