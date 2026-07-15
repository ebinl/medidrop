import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

/** Primary admin credentials for the shared login page. */
export const ADMIN_EMAIL = 'admin@medidrop.com';
export const ADMIN_PASSWORD = 'Admin@2026';
export const ADMIN_EMAILS = [ADMIN_EMAIL];

const ADMIN_SESSION_KEY = 'medidrop-admin-session';

const LEGACY_ADMIN_PASSWORDS = [
  ADMIN_PASSWORD,
  'admin',
  'admin12',
  'Admin123',
  'password',
  'Password@123',
];

const AuthContext = createContext(null);

const LOCAL_ADMIN_USER = {
  uid: 'local-admin',
  email: ADMIN_EMAIL,
  displayName: 'Admin',
  isLocalAdmin: true,
};

function readLocalAdminSession() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function setLocalAdminSession(enabled) {
  try {
    if (enabled) sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    else sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // ignore
  }
}

function authErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in Firebase Console.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function normalizeLoginEmail(value) {
  const trimmed = String(value || '').trim().toLowerCase();
  if (trimmed === 'admin') return ADMIN_EMAIL;
  return trimmed;
}

export function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(String(email || '').trim().toLowerCase());
}

function isAdminCredentials(email, password) {
  return normalizeLoginEmail(email) === ADMIN_EMAIL && String(password) === ADMIN_PASSWORD;
}

async function saveAdminProfile(user) {
  if (!user?.uid || user.isLocalAdmin) return;
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        name: user.displayName || 'Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not save admin profile:', err);
  }
}

async function tryFirebaseAdminLogin(password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    await saveAdminProfile(credential.user);
    return credential.user;
  } catch {
    // continue
  }

  if (password !== ADMIN_PASSWORD) return null;

  try {
    const credential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    await updateProfile(credential.user, { displayName: 'Admin' });
    await saveAdminProfile(credential.user);
    return credential.user;
  } catch (createErr) {
    if (createErr.code !== 'auth/email-already-in-use') {
      console.warn('Admin Firebase create failed:', createErr);
      return null;
    }
  }

  for (const legacyPassword of LEGACY_ADMIN_PASSWORDS) {
    try {
      const credential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, legacyPassword);
      if (legacyPassword !== ADMIN_PASSWORD) {
        await updatePassword(credential.user, ADMIN_PASSWORD);
      }
      await saveAdminProfile(credential.user);
      return credential.user;
    } catch {
      // try next
    }
  }

  return null;
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [localAdmin, setLocalAdmin] = useState(readLocalAdminSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setFirebaseUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Firebase admin session supersedes local-only flag display,
      // but keep local flag so admin stays recognized if Firebase drops.
      if (isAdminEmail(nextUser.email)) {
        setLocalAdminSession(true);
        setLocalAdmin(true);
      }

      try {
        const snap = await getDoc(doc(db, 'users', nextUser.uid));
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() });
        } else {
          const role = isAdminEmail(nextUser.email) ? 'admin' : 'user';
          const nextProfile = {
            name: nextUser.displayName || '',
            email: (nextUser.email || '').toLowerCase(),
            role,
            createdAt: serverTimestamp(),
          };
          try {
            await setDoc(doc(db, 'users', nextUser.uid), nextProfile, { merge: true });
          } catch (err) {
            console.warn('Could not create user profile:', err);
          }
          setProfile({ id: nextUser.uid, ...nextProfile, role });
        }
      } catch (err) {
        console.warn('Could not load user profile:', err);
        setProfile({
          email: nextUser.email,
          role: isAdminEmail(nextUser.email) ? 'admin' : 'user',
        });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const isAdmin =
    localAdmin ||
    isAdminEmail(firebaseUser?.email) ||
    profile?.role === 'admin';

  const user = firebaseUser || (localAdmin ? LOCAL_ADMIN_USER : null);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin,
      async signup({ name, email, password }) {
        const normalizedEmail = normalizeLoginEmail(email);

        // Prevent random signups taking over the admin email without the admin password.
        if (isAdminEmail(normalizedEmail) && password !== ADMIN_PASSWORD) {
          const err = new Error('Use the admin password for this account.');
          err.code = 'auth/invalid-credential';
          throw err;
        }

        if (isAdminCredentials(normalizedEmail, password)) {
          setLocalAdminSession(true);
          setLocalAdmin(true);
          const firebaseAdmin = await tryFirebaseAdminLogin(password);
          return firebaseAdmin || LOCAL_ADMIN_USER;
        }

        const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        const displayName = name.trim();
        if (displayName) {
          await updateProfile(credential.user, { displayName });
        }
        const role = isAdminEmail(normalizedEmail) ? 'admin' : 'user';
        try {
          await setDoc(doc(db, 'users', credential.user.uid), {
            name: displayName,
            email: normalizedEmail,
            role,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          console.warn('Could not save user profile:', err);
        }
        return credential.user;
      },
      async login({ email, password }) {
        const normalizedEmail = normalizeLoginEmail(email);

        // Admin always logs in through the shared login page with fixed credentials.
        if (isAdminCredentials(normalizedEmail, password)) {
          setLocalAdminSession(true);
          setLocalAdmin(true);
          const firebaseAdmin = await tryFirebaseAdminLogin(password);
          return firebaseAdmin || LOCAL_ADMIN_USER;
        }

        if (isAdminEmail(normalizedEmail)) {
          const err = new Error('Invalid email or password.');
          err.code = 'auth/invalid-credential';
          throw err;
        }

        const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        return credential.user;
      },
      async logout() {
        setLocalAdminSession(false);
        setLocalAdmin(false);
        if (auth.currentUser) {
          await signOut(auth);
        }
      },
      getErrorMessage: authErrorMessage,
      normalizeLoginEmail,
    }),
    [user, profile, loading, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
