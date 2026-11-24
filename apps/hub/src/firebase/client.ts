import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  connectAuthEmulator,
  type Auth,
} from 'firebase/auth';

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let emulatorsConnected = false;

export function getFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-game-hub.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-game-hub',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:demo000000000000',
  };
}

export function isUsingEmulators(): boolean {
  return (import.meta.env.VITE_USE_FIREBASE_EMULATORS ?? 'true') === 'true';
}

export function getAllowedGameOrigins(): string[] {
  const raw = import.meta.env.VITE_ALLOWED_GAME_ORIGINS as string | undefined;
  const list = (raw || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:8090,http://127.0.0.1:8090')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (typeof window !== 'undefined' && window.location?.origin && !list.includes(window.location.origin)) {
    list.push(window.location.origin);
  }
  return list;
}

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    const existing = getApps();
    appInstance = existing.length > 0 ? existing[0] : initializeApp(getFirebaseConfig());
  }
  return appInstance;
}

export function getHubFirestore(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp());
    if (isUsingEmulators() && !emulatorsConnected) {
      const host = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || '127.0.0.1';
      const port = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || 8088);
      connectFirestoreEmulator(dbInstance, host, port);
      emulatorsConnected = true;
    }
  }
  return dbInstance;
}

let authEmulatorConnected = false;

export function getHubAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
    if (isUsingEmulators() && !authEmulatorConnected) {
      const url = import.meta.env.VITE_AUTH_EMULATOR_URL || 'http://127.0.0.1:9099';
      connectAuthEmulator(authInstance, url, { disableWarnings: true });
      authEmulatorConnected = true;
    }
  }
  return authInstance;
}
