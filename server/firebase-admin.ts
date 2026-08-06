import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

/**
 * Rebuild a valid PEM from however the environment mangled it.
 *
 * Env stores (Vercel dashboard, shell exports, .env files) deliver the
 * service-account key wrapped in quotes, with literal `\n` or `\\n`, with
 * newlines flattened to spaces, or base64-encoded whole. OpenSSL rejects all
 * of those with "DECODER routines::unsupported" the first time the credential
 * actually signs — which is admin.deleteUser or FCM, not verifyIdToken (that
 * only needs Google's public certs), so a broken key looks fine until then.
 *
 * Rather than guess the mangling, extract the base64 body between the PEM
 * header and footer, drop every whitespace character, and re-wrap at 64
 * columns — the canonical form OpenSSL expects.
 */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  key = key.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n").trim();

  // Some setups store the whole PEM base64-encoded to dodge newline handling.
  if (!key.includes("-----BEGIN")) {
    try {
      const decoded = Buffer.from(key, "base64").toString("utf-8");
      if (decoded.includes("-----BEGIN")) key = decoded.trim();
    } catch {
      // not base64 — fall through and let cert() report the real problem
    }
  }

  const pem = key.match(
    /-----BEGIN ([A-Z ]+?)-----([\s\S]*?)-----END \1-----/
  );
  if (!pem) return key;

  const [, label, body] = pem;
  const base64 = body.replace(/\s+/g, "");
  const lines = base64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----\n`;
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
