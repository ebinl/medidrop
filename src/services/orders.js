import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const ordersRef = collection(db, 'orders');
const STORAGE_KEY = 'medi_drop_orders_history';

function getLocalOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read local orders cache:', err);
    return [];
  }
}

function saveLocalOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.warn('Could not write local orders cache:', err);
  }
}

/**
 * Submit a new patient order.
 * Saves to Firestore and local storage.
 */
export async function submitOrder(orderData) {
  const localOrders = getLocalOrders();
  const now = new Date();
  const readableId = `MD-${Date.now().toString().slice(-6)}`;

  const orderPayload = {
    orderNumber: orderData.orderNumber || readableId,
    patient: {
      name: (orderData.patient?.name || orderData.name || '').trim(),
      email: (orderData.patient?.email || orderData.email || '').trim(),
      phone: (orderData.patient?.phone || orderData.phone || '').trim(),
      address: (orderData.patient?.address || orderData.address || '').trim(),
    },
    items: (orderData.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      scientificName: item.scientificName || '',
      category: item.category || '',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      minQuantity: Number(item.minQuantity) || 1,
      subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 1),
      image: item.image || '/homeo-remedy.png',
    })),
    subtotal: Number(orderData.subtotal) || 0,
    deliveryCharge: Number(orderData.deliveryCharge) || 0,
    total: Number(orderData.total) || 0,
    itemCount: Number(orderData.itemCount) || 0,
    status: orderData.status || 'Pending', // Pending | Processing | Dispatched | Delivered | Cancelled
    createdAtClient: now.toISOString(),
  };

  let firestoreId = null;
  try {
    const docRef = await addDoc(ordersRef, {
      ...orderPayload,
      createdAt: serverTimestamp(),
    });
    firestoreId = docRef.id;
  } catch (err) {
    console.warn('Firestore order creation failed, persisting locally:', err);
    firestoreId = `local-${Date.now()}`;
  }

  const savedOrder = {
    id: firestoreId,
    ...orderPayload,
    createdAt: now,
  };

  const updatedLocal = [savedOrder, ...localOrders.filter((o) => o.id !== firestoreId)];
  saveLocalOrders(updatedLocal);

  return firestoreId;
}

/**
 * Real-time subscription to orders list.
 * Fallback to localStorage if Firestore is unavailable.
 */
export function subscribeOrders(onData, onError) {
  const q = query(ordersRef, orderBy('createdAt', 'desc'));

  let unsub = () => {};
  try {
    unsub = onSnapshot(
      q,
      (snapshot) => {
        const firestoreItems = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() ?? (data.createdAtClient ? new Date(data.createdAtClient) : new Date()),
          };
        });

        // Merge with any local orders not yet synced
        const local = getLocalOrders();
        const firestoreIds = new Set(firestoreItems.map((item) => item.id));
        const unsyncedLocal = local.filter((item) => !firestoreIds.has(item.id));

        const merged = [...firestoreItems, ...unsyncedLocal].sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        saveLocalOrders(merged);
        onData(merged);
      },
      (err) => {
        console.warn('Firestore orders subscription failed, using local cache:', err);
        const local = getLocalOrders().map((o) => ({
          ...o,
          createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
        }));
        onData(local);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Error setting up orders listener:', err);
    const local = getLocalOrders().map((o) => ({
      ...o,
      createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
    }));
    onData(local);
  }

  return unsub;
}

/**
 * Update the status of an order.
 */
export async function updateOrderStatus(orderId, nextStatus) {
  // Update local cache first
  const local = getLocalOrders();
  const updatedLocal = local.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o));
  saveLocalOrders(updatedLocal);

  try {
    await updateDoc(doc(db, 'orders', String(orderId)), {
      status: nextStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn(`Could not update order ${orderId} in Firestore:`, err);
  }
}

/**
 * Delete an order.
 */
export async function deleteOrder(orderId) {
  const local = getLocalOrders();
  const updatedLocal = local.filter((o) => o.id !== orderId);
  saveLocalOrders(updatedLocal);

  try {
    await deleteDoc(doc(db, 'orders', String(orderId)));
  } catch (err) {
    console.warn(`Could not delete order ${orderId} in Firestore:`, err);
  }
}
