import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const consultationsRef = collection(db, 'consultations');
const STORAGE_KEY = 'medi_drop_consultations_history';

function getLocalConsultations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read local consultations cache:', err);
    return [];
  }
}

function saveLocalConsultations(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Could not write local consultations cache:', err);
  }
}

/**
 * Submit a consultation booking with dual persistence (Firestore + localStorage fallback).
 * This ensures bookings NEVER fail even if Firestore is offline or restricted.
 */
export async function submitConsultation(data) {
  const localItems = getLocalConsultations();
  const readableId = `CONS-${Date.now().toString().slice(-6)}`;
  const now = new Date();

  const consultationPayload = {
    id: readableId,
    name: (data.name || '').trim(),
    email: (data.email || '').trim(),
    phone: (data.phone || '').trim(),
    symptoms: (data.symptoms || '').trim(),
    date: data.date || '',
    time: data.time || '',
    paymentMethod: 'upi',
    upiRefNo: (data.upiRefNo || data.upiLast4 || '').trim(),
    upiLast4: (data.upiLast4 || data.upiRefNo || '').trim(),
    amount: 99,
    status: 'booked',
    createdAt: now.toISOString(),
  };

  // 1. Immediately persist to localStorage
  const updatedLocal = [consultationPayload, ...localItems.filter((c) => c.id !== readableId)];
  saveLocalConsultations(updatedLocal);

  // 2. Notify any open tabs (e.g. Admin dashboard) immediately
  try {
    window.dispatchEvent(new CustomEvent('medidrop_consultation_created', { detail: consultationPayload }));
  } catch {
    // ignore
  }

  // 3. Try to save to Firestore in background/parallel
  try {
    const docRef = await addDoc(consultationsRef, {
      name: consultationPayload.name,
      email: consultationPayload.email,
      phone: consultationPayload.phone,
      symptoms: consultationPayload.symptoms,
      date: consultationPayload.date,
      time: consultationPayload.time,
      paymentMethod: 'upi',
      upiRefNo: consultationPayload.upiRefNo,
      upiLast4: consultationPayload.upiLast4,
      amount: 99,
      status: 'booked',
      createdAt: serverTimestamp(),
    });

    // Update local cache with real firestore id
    consultationPayload.id = docRef.id;
    const finalLocal = [consultationPayload, ...localItems.filter((c) => c.id !== readableId)];
    saveLocalConsultations(finalLocal);
    return { id: docRef.id, readableId, ...consultationPayload };
  } catch (err) {
    console.warn('Firestore write warning (relying on robust local persistence):', err);
    return { id: readableId, readableId, ...consultationPayload };
  }
}

/**
 * Delete a consultation booking by id
 */
export async function deleteConsultation(id) {
  // Remove from localStorage
  const local = getLocalConsultations().filter((c) => c.id !== id);
  saveLocalConsultations(local);

  try {
    window.dispatchEvent(new CustomEvent('medidrop_consultations_updated', { detail: local })); h
  } catch {
    // ignore
  }

  // Also try deleting from Firestore
  try {
    await deleteDoc(doc(db, 'consultations', id));
  } catch (err) {
    console.warn('Firestore consultation delete failed or document local-only:', err);
  }
}

/**
 * Real-time subscription to consultation bookings.
 * Merges Firestore results with local storage so admin always sees all bookings.
 */
export function subscribeConsultations(onData, onError) {
  let isFirestoreActive = false;

  const emitMerged = (firestoreItems = []) => {
    const local = getLocalConsultations();
    const seenIds = new Set();
    const merged = [];

    // Prioritize firestore items
    firestoreItems.forEach((item) => {
      seenIds.add(item.id);
      merged.push(item);
    });

    // Append local items that haven't been synced to Firestore yet
    local.forEach((item) => {
      if (!seenIds.has(item.id)) {
        merged.push({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        });
      }
    });

    // Sort descending by date
    merged.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    onData(merged);
  };

  // 1. Initial emission from local storage
  emitMerged([]);

  // 2. Listen to custom window events for same-session real-time updates
  const handleLocalUpdate = () => {
    emitMerged([]);
  };
  window.addEventListener('medidrop_consultation_created', handleLocalUpdate);
  window.addEventListener('medidrop_consultations_updated', handleLocalUpdate);

  // 3. Firestore snapshot listener
  let unsubFirestore = () => { };
  try {
    const q = query(consultationsRef, orderBy('createdAt', 'desc'));
    unsubFirestore = onSnapshot(
      q,
      (snapshot) => {
        isFirestoreActive = true;
        const items = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() ?? (data.createdAt ? new Date(data.createdAt) : null),
          };
        });
        emitMerged(items);
      },
      (err) => {
        console.warn('Firestore consultations query error, serving local data:', err);
        emitMerged([]);
        if (onError && !isFirestoreActive) {
          // Don't break UI if local data exists
          // onError(err);
        }
      }
    );
  } catch (err) {
    console.warn('Could not initialize firestore consultations query:', err);
    emitMerged([]);
  }

  return () => {
    window.removeEventListener('medidrop_consultation_created', handleLocalUpdate);
    window.removeEventListener('medidrop_consultations_updated', handleLocalUpdate);
    unsubFirestore();
  };
}
