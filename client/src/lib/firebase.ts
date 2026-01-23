import { initializeApp, FirebaseApp } from "firebase/app";
// Firebase configuration and authentication
import { 
  getAuth, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User, 
  Auth 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let authReadyPromise: Promise<User | null> | null = null;
let redirectInitPromise: Promise<void> | null = null;

const isConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

console.log("[Firebase] Config check:", {
  isConfigured,
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
});

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log("[Firebase] Initialized successfully");
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
  }
} else {
  console.warn("[Firebase] Not configured - missing credentials");
}

export { auth };

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Firebase not configured");
  }

  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function handleRedirectResult() {
  if (!auth) {
    console.log("[Firebase] handleRedirectResult: auth not initialized");
    return null;
  }
  try {
    console.log("[Firebase] Checking for redirect result...");
    const result = await getRedirectResult(auth);
    console.log("[Firebase] Redirect result:", result ? "User found" : "No redirect result");
    if (result && result.user) {
      console.log("[Firebase] User from redirect:", result.user.email);
      return result.user;
    }
    return null;
  } catch (error: any) {
    console.error("[Firebase] Error handling redirect:", error.code, error.message);
    throw error;
  }
}

export async function initRedirectResult(): Promise<void> {
  if (!auth) {
    console.log("[Firebase] initRedirectResult: auth not initialized");
    return;
  }

  if (!redirectInitPromise) {
    redirectInitPromise = (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        if (import.meta.env.DEV) {
          console.log("[AUTH_DEBUG] persistence=browserLocalPersistence set ok");
        }
      } catch (error) {
        console.error("[Firebase] Persistence error:", error);
      }

      try {
        await handleRedirectResult();
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[AUTH_DEBUG] redirect result failed", error);
        }
      }
    })();
  }

  await redirectInitPromise;
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  if (!auth) {
    throw new Error("Firebase not configured");
  }
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase not configured");
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
}

export async function logOut() {
  if (!auth) {
    return;
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
}

export function waitForAuthReady(): Promise<User | null> {
  if (!auth) {
    return Promise.resolve(null);
  }

  if (!authReadyPromise) {
    authReadyPromise = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  return authReadyPromise;
}

export function isFirebaseConfigured() {
  return isConfigured && auth !== null;
}

export type { User };
