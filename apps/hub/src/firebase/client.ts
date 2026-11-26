import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  CustomProvider,
  ReCaptchaEnterpriseProvider,
  ReCaptchaV3Provider,
  initializeAppCheck,
} from 'firebase/app-check';
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
let appCheckInitialized = false;

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
  const list = (
    raw ||
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:8090,http://127.0.0.1:8090,https://*.vercel.app'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  // Only allow same-origin game iframes in local dev/test; production games must be hosted on isolated origins
  // because GamePlayer uses `sandbox="allow-scripts allow-same-origin"`.
  if (
    (import.meta.env.DEV || import.meta.env.MODE === 'test') &&
    typeof window !== 'undefined' &&
    window.location?.origin &&
    !list.includes(window.location.origin)
  ) {
    list.push(window.location.origin);
  }
  return list;
}

const LOCAL_DEV_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export type AppCheckInitPlan =
  | { mode: 'skip' }
  | { mode: 'debug'; debugToken: string | boolean }
  | { mode: 'recaptcha'; provider: 'enterprise' | 'v3'; siteKey: string };

/** Returns true when running on a local loopback hostname. */
export function isLocalDevHostname(hostname: string): boolean {
  return LOCAL_DEV_HOSTNAMES.has(hostname.toLowerCase());
}

/**
 * Resolves how App Check should be initialized for the current runtime.
 * Never activates debug tokens outside local dev mode, and skips reCAPTCHA on
 * localhost dev unless a debug token is configured so invalid dummy App Check
 * headers are not attached to Auth/Firestore requests.
 */
export function resolveAppCheckInitPlan(params: {
  isBrowser: boolean;
  usingEmulators: boolean;
  mode: string;
  isDev: boolean;
  hostname: string;
  siteKey?: string;
  providerMode?: string;
  debugToken?: string;
}): AppCheckInitPlan {
  if (!params.isBrowser || params.usingEmulators || params.mode === 'test') {
    return { mode: 'skip' };
  }

  if (params.isDev && isLocalDevHostname(params.hostname)) {
    const rawDebug = params.debugToken?.trim();
    if (!rawDebug || rawDebug.toLowerCase() === 'false') {
      return { mode: 'skip' };
    }
    return {
      mode: 'debug',
      debugToken: rawDebug.toLowerCase() === 'true' ? true : rawDebug,
    };
  }

  const siteKey = params.siteKey?.trim();
  if (!siteKey) {
    return { mode: 'skip' };
  }
  const provider = params.providerMode?.trim().toLowerCase() === 'v3' ? 'v3' : 'enterprise';
  return { mode: 'recaptcha', provider, siteKey };
}

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    const existing = getApps();
    appInstance = existing.length > 0 ? existing[0] : initializeApp(getFirebaseConfig());
  }
  if (!appCheckInitialized) {
    const plan = resolveAppCheckInitPlan({
      isBrowser: typeof window !== 'undefined',
      usingEmulators: isUsingEmulators(),
      mode: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      hostname: typeof window !== 'undefined' ? window.location.hostname : '',
      siteKey: import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY as string | undefined,
      providerMode: import.meta.env.VITE_FIREBASE_APP_CHECK_PROVIDER as string | undefined,
      debugToken: import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN as string | undefined,
    });
    if (plan.mode === 'debug') {
      (
        globalThis as typeof globalThis & { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean }
      ).FIREBASE_APPCHECK_DEBUG_TOKEN = plan.debugToken;
      initializeAppCheck(appInstance, {
        provider: new CustomProvider({
          getToken: async () => ({ token: '', expireTimeMillis: Date.now() }),
        }),
        isTokenAutoRefreshEnabled: true,
      });
      appCheckInitialized = true;
    } else if (plan.mode === 'recaptcha') {
      const provider =
        plan.provider === 'v3'
          ? new ReCaptchaV3Provider(plan.siteKey)
          : new ReCaptchaEnterpriseProvider(plan.siteKey);
      initializeAppCheck(appInstance, {
        provider,
        isTokenAutoRefreshEnabled: true,
      });
      appCheckInitialized = true;
    }
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
