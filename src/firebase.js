import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDY41NLW_yXG4_RDtSvXtwAeihcWc7FWNg',
  authDomain: 'medidrop-6659f.firebaseapp.com',
  projectId: 'medidrop-6659f',
  storageBucket: 'medidrop-6659f.firebasestorage.app',
  messagingSenderId: '495064201392',
  appId: '1:495064201392:web:f2db907a0e731afa442375',
  measurementId: 'G-C4N0FC9YYK',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
