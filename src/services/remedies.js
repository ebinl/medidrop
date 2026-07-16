import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_MEDICINES, REMEDY_IMAGE } from '../data/defaultMedicines';

const remediesRef = collection(db, 'remedies');
const SEED_TIMEOUT_MS = 12000;

function parseBenefits(benefits) {
  if (Array.isArray(benefits)) return benefits;
  return String(benefits || '')
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);
}

function normalizeRemedyName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Keep one entry per remedy name (case/spacing insensitive). */
export function dedupeRemedies(items = []) {
  const byName = new Map();
  const byId = new Set();

  for (const item of items) {
    if (!item) continue;
    const idKey = String(item.id ?? '');
    if (idKey && byId.has(idKey)) continue;

    const key = normalizeRemedyName(item.name);
    if (!key) continue;

    const existing = byName.get(key);
    if (!existing) {
      byName.set(key, item);
      if (idKey) byId.add(idKey);
      continue;
    }

    const preferIncoming =
      (Boolean(item.isDefault) && !existing.isDefault) ||
      (Boolean(item.isDefault) === Boolean(existing.isDefault) &&
        Number(item.sortOrder ?? Number.MAX_SAFE_INTEGER) <
          Number(existing.sortOrder ?? Number.MAX_SAFE_INTEGER));

    if (preferIncoming) {
      byName.set(key, item);
      if (idKey) byId.add(idKey);
    }
  }

  return Array.from(byName.values()).sort(
    (a, b) =>
      Number(a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
      Number(b.sortOrder ?? Number.MAX_SAFE_INTEGER)
  );
}

/** Local catalog used when Firestore is empty, slow, or unavailable. */
export function getLocalCatalog() {
  return dedupeRemedies(
    DEFAULT_MEDICINES.map((med) => ({
      ...med,
      image: med.image || REMEDY_IMAGE,
      sortOrder: med.sortOrder ?? med.id,
      isDefault: true,
      fromFirestore: false,
    }))
  );
}

async function commitBatchOps(ops) {
  const CHUNK = 400;
  for (let i = 0; i < ops.length; i += CHUNK) {
    const batch = writeBatch(db);
    ops.slice(i, i + CHUNK).forEach((apply) => apply(batch));
    await batch.commit();
  }
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
  const snapshot = await Promise.race([
    getDocs(remediesRef),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firestore seed timed out')), 12000);
    }),
  ]);
  const byName = new Map();

  snapshot.docs.forEach((d) => {
    const key = normalizeRemedyName(d.data().name);
    if (!key) return;
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push(d);
  });

  const ops = [];
  const keepByName = new Map();

  for (const [key, docs] of byName.entries()) {
    docs.sort((a, b) => {
      const aData = a.data();
      const bData = b.data();
      const aDefault = aData.isDefault ? 0 : 1;
      const bDefault = bData.isDefault ? 0 : 1;
      if (aDefault !== bDefault) return aDefault - bDefault;
      const aOrder = aData.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = bData.sortOrder ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
    const [keep, ...dupes] = docs;
    keepByName.set(key, keep);
    dupes.forEach((d) => {
      ops.push((batch) => batch.delete(d.ref));
    });
  }

  for (const med of DEFAULT_MEDICINES) {
    const key = normalizeRemedyName(med.name);
    const existing = keepByName.get(key);

    if (existing) {
      const data = existing.data();
      const patch = {};
      if (data.sortOrder == null) patch.sortOrder = med.id;
      if (!data.image) patch.image = REMEDY_IMAGE;
      if (!data.isDefault) patch.isDefault = true;
      if (Object.keys(patch).length) {
        ops.push((batch) => batch.update(existing.ref, patch));
      }
      continue;
    }

    const ref = doc(remediesRef);
    ops.push((batch) =>
      batch.set(ref, {
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
      })
    );
  }

  Array.from(keepByName.values()).forEach((d, index) => {
    const data = d.data();
    const key = normalizeRemedyName(data.name);
    const isCatalogDefault = DEFAULT_MEDICINES.some(
      (m) => normalizeRemedyName(m.name) === key
    );
    if (isCatalogDefault) return;
    if (data.sortOrder == null || !data.image) {
      ops.push((batch) =>
        batch.update(d.ref, {
          ...(data.sortOrder == null ? { sortOrder: 1000 + index } : {}),
          ...(data.image ? {} : { image: REMEDY_IMAGE }),
        })
      );
    }
  });

  if (ops.length > 0) {
    await commitBatchOps(ops);
  }

  return ops.length;
}

export async function addRemedy(data) {
  const benefits = parseBenefits(data.benefits);
  const name = data.name.trim();
  const key = normalizeRemedyName(name);

  const snapshot = await getDocs(remediesRef);
  const duplicate = snapshot.docs.find(
    (d) => normalizeRemedyName(d.data().name) === key
  );
  if (duplicate) {
    const err = new Error('A remedy with this name already exists.');
    err.code = 'remedy/duplicate-name';
    throw err;
  }

  const docRef = await addDoc(remediesRef, {
    name,
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
  // Unordered snapshot + client sort. orderBy('sortOrder') hides docs
  // missing that field and was crashing when query/orderBy weren't imported.
  return onSnapshot(
    remediesRef,
    (snapshot) => {
      onData(dedupeRemedies(snapshot.docs.map(mapRemedyDoc)));
    },
    (err) => {
      console.warn('Remedies subscribe failed:', err);
      onError?.(err);
    }
  );
}
