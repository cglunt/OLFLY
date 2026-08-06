import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

/**
 * Env stores (Vercel dashboard, .env files) deliver the PEM key in several
 * shapes: wrapped in quotes, with literal `\n`, or double-escaped `\\n`.
 * Any of those make OpenSSL fail with "DECODER routines::unsupported" the
 * first time the credential actually signs a token (e.g. deleteUser), even
 * though verifyIdToken keeps working — normalize them all to a real PEM.
 */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");
}

function initFirebaseAdmin() {
  if (!getApps().length) {
    const projectId = requireEnv("FIREBASE_PROJECT_ID");
    const clientEmail = requireEnv("FIREBASE_CLIENT_EMAIL");
    const privateKey = normalizePrivateKey(requireEnv("FIREBASE_PRIVATE_KEY"));

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }
}

export function getFirebaseAuth() {
  initFirebaseAdmin();
  return getAuth();
}

/** Returns the Firebase Admin Messaging instance for sending FCM push messages. */
export function getFirebaseMessaging() {
  initFirebaseAdmin();
  return getMessaging();
}
