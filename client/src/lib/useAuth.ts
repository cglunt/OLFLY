import { useState, useEffect } from "react";
import { onAuthChange, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut,
        handleRedirectResult, isFirebaseConfigured, User, initRedirectResult } from "./firebase";
import { debugAuthLog } from "./debugAuth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
  const [hasSeenAuthStateChangedOnce, setHasSeenAuthStateChangedOnce] = useState(false);
  const [redirectResultDone, setRedirectResultDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authEventRef = useState({ count: 0 })[0];

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Please add your Firebase credentials.");
      setLoading(false);
      setHasSeenAuthStateChangedOnce(true);
      setRedirectResultDone(true);
      setAuthResolved(true);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    // Set up auth state listener first
    unsubscribe = onAuthChange((firebaseUser) => {
      authEventRef.count += 1;
      debugAuthLog("AUTH:onAuthStateChanged", {
        ts: Date.now(),
        count: authEventRef.count,
        uid: firebaseUser?.uid ?? null,
        isAnonymous: firebaseUser?.isAnonymous ?? null,
        emailDomain: firebaseUser?.email ? firebaseUser.email.split("@")[1] : null,
        providerIds: firebaseUser?.providerData?.map((p) => p.providerId) ?? [],
      });
      setUser(firebaseUser);
      setHasSeenAuthStateChangedOnce(true);
    });

    // Ensure redirect result has been processed before marking authReady.
    debugAuthLog("AUTH:getRedirectResult:start", { ts: Date.now() });
    initRedirectResult()
      .then(() => {
        debugAuthLog("AUTH:getRedirectResult:done", { ts: Date.now() });
      })
      .catch((err: any) => {
        console.error("[useAuth] Redirect error:", err);
      })
      .finally(() => {
        setRedirectResultDone(true);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const authReady = hasSeenAuthStateChangedOnce && redirectResultDone;

  useEffect(() => {
    if (authReady) {
      setLoading(false);
      setAuthResolved(true);
      debugAuthLog("AUTH:authReady:set", {
        ts: Date.now(),
        redirectResultDone,
        hasSeenAuthStateChangedOnce,
      });
    }
  }, [authReady, redirectResultDone, hasSeenAuthStateChangedOnce]);

  return {
    user,
    loading,
    authResolved,
    authReady,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logOut,
    isAuthenticated: !!user,
    isConfigured: isFirebaseConfigured(),
  };
}
