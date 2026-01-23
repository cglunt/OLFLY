import { useState, useEffect } from "react";
import { onAuthChange, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut,
        handleRedirectResult, isFirebaseConfigured, User } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
  const [hasSeenAuthStateChangedOnce, setHasSeenAuthStateChangedOnce] = useState(false);
  const [redirectResultDone, setRedirectResultDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log("[useAuth] AUTH STATE CHANGED:", firebaseUser?.email || "null");
      setUser(firebaseUser);
      setHasSeenAuthStateChangedOnce(true);
    });

    // Then check for redirect result (for returning from Google sign-in)
    handleRedirectResult()
      .then((redirectUser) => {
        if (redirectUser) {
          console.log("[useAuth] Got user from redirect:", redirectUser.email);
          setUser(redirectUser);
        }
      })
      .catch((err: any) => {
        console.error("[useAuth] Redirect error:", err);
        setAuthResolved(true);
        // Don't block on redirect errors - auth state listener will handle it
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
    }
  }, [authReady]);

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
