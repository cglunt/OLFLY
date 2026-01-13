import { initializeApp, FirebaseApp } from "firebase/app";
// Firebase configuration and authentication
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
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
    // Function will not return as page redirects
    return null;    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function handleRedirectResult() {
  if (!auth) {
    return null;
  }
  
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error handling redirect:", error);
    throw error;
  }
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

export function isFirebaseConfigured() {
  return isConfigured && auth !== null;
}

export type { User };
