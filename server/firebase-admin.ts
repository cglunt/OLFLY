import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

function initFirebaseAdmin() {
  if (!getApps().length) {
    const projectId = requireEnv("FIREBASE_PROJECT_ID");
    const clientEmail = requireEnv("FIREBASE_CLIENT_EMAIL");
    const privateKey = requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

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
