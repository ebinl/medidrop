import {
  addDoc,
  collection,
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
import { DEFAULT_MEDICINES, REMEDY_IMAGE } from '../data/defaultMedicines';

const remediesRef = collection(db, 'remedies');

function parseBenefits(benefits) {
  if (Array.isArray(benefits)) return benefits;
  return String(benefits || '')
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);
}

function mapRemedyDoc(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    scientificName: data.scientificName || '',
    category: data.category || '',
    description: data.description || '',
    price: Number(data.price) || 0,
    minQuantity: Math.max(1, Number(data.minQuantity) || 1),
    benefits: Array.isArray(data.benefits) ? data.benefits : [],
    image: data.image || REMEDY_IMAGE,
    sortOrder: data.sortOrder ?? Number.MAX_SAFE_INTEGER,
    createdAt: data.createdAt?.toDate?.() ?? null,
    fromFirestore: true,
    isDefault: Boolean(data.isDefault),
  };
}

/** Seeds catalog defaults into Firestore once (skips names that already exist). */
let seedPromise = null;

export function seedDefaultRemedies() {
  if (!seedPromise) {
    seedPromise = seedDefaultRemediesOnce().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function seedDefaultRemediesOnce() {
  const snapshot = await getDocs(remediesRef);
  const existingByName = new Map();

  snapshot.docs.forEach((d) => {
    const name = (d.data().name || '').trim().toLowerCase();
    if (name) existingByName.set(name, d);
  });

  const batch = writeBatch(db);
  let ops = 0;

  for (const med of DEFAULT_MEDICINES) {
    const key = med.name.trim().toLowerCase();
    const existing = existingByName.get(key);

    if (existing) {
      const data = existing.data();
      const patch = {};
      if (data.sortOrder == null) patch.sortOrder = med.id;
      if (!data.image) patch.image = REMEDY_IMAGE;
      if (data.isDefault == null) patch.isDefault = true;
      if (Object.keys(patch).length) {
        batch.update(existing.ref, patch);
        ops += 1;
      }
      continue;
    }

    batch.set(doc(remediesRef), {
      name: med.name,
      scientificName: med.scientificName || '',
      category: med.category || '',
      description: med.description || '',
      price: Number(med.price) || 0,
      minQuantity: Math.max(1, Number(med.minQuantity) || 1),
      benefits: Array.isArray(med.benefits) ? med.benefits : [],
      image: REMEDY_IMAGE,
      sortOrder: med.id,
      isDefault: true,
      createdAt: serverTimestamp(),
    });
    ops += 1;
  }

  snapshot.docs.forEach((d, index) => {
    const data = d.data();
    const key = (data.name || '').trim().toLowerCase();
    const isCatalogDefault = DEFAULT_MEDICINES.some(
      (m) => m.name.trim().toLowerCase() === key
    );
    if (isCatalogDefault) return;
    if (data.sortOrder == null || !data.image) {
      batch.update(d.ref, {
        ...(data.sortOrder == null ? { sortOrder: 1000 + index } : {}),
        ...(data.image ? {} : { image: REMEDY_IMAGE }),
      });
      ops += 1;
    }
  });

  if (ops > 0) {
    await batch.commit();
  }

  return ops;
}

export async function addRemedy(data) {
  const benefits = parseBenefits(data.benefits);

  const docRef = await addDoc(remediesRef, {
    name: data.name.trim(),
    scientificName: (data.scientificName || '').trim(),
    category: (data.category || '').trim(),
    description: (data.description || '').trim(),
    price: Number(data.price) || 0,
    minQuantity: Math.max(1, Number(data.minQuantity) || 1),
    benefits,
    image: REMEDY_IMAGE,
    sortOrder: Date.now(),
    isDefault: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateRemedy(id, data) {
  const benefits = parseBenefits(data.benefits);

  await updateDoc(doc(db, 'remedies', id), {
    name: data.name.trim(),
    scientificName: (data.scientificName || '').trim(),
    category: (data.category || '').trim(),
    description: (data.description || '').trim(),
    price: Number(data.price) || 0,
    minQuantity: Math.max(1, Number(data.minQuantity) || 1),
    benefits,
    image: data.image || REMEDY_IMAGE,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeRemedies(onData, onError) {
  let fallbackUnsub = null;
  const q = query(remediesRef, orderBy('sortOrder', 'asc'));
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map(mapRemedyDoc));
    },
    (err) => {
      console.warn('Remedies ordered query failed, falling back:', err);
      fallbackUnsub = onSnapshot(
        remediesRef,
        (snapshot) => {
          const items = snapshot.docs
            .map(mapRemedyDoc)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          onData(items);
        },
        onError
      );
    }
  );

  return () => {
    unsub();
    fallbackUnsub?.();
  };
}
