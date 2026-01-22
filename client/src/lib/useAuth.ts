import { useState, useEffect } from "react";
import { onAuthChange, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut,
        handleRedirectResult, isFirebaseConfigured, User } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Please add your Firebase credentials.");
      setLoading(false);
      setAuthResolved(true);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    // Set up auth state listener first
    unsubscribe = onAuthChange((firebaseUser) => {
      console.log("[useAuth] AUTH STATE CHANGED:", firebaseUser?.email || "null");
      setUser(firebaseUser);
      setLoading(false);
      setAuthResolved(true);
    });

    // Then check for redirect result (for returning from Google sign-in)
    handleRedirectResult()
      .then((redirectUser) => {
        if (redirectUser) {
          console.log("[useAuth] Got user from redirect:", redirectUser.email);
          setUser(redirectUser);
          setLoading(false);
          setAuthResolved(true);
        }
      })
      .catch((err: any) => {
        console.error("[useAuth] Redirect error:", err);
        setAuthResolved(true);
        // Don't block on redirect errors - auth state listener will handle it
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    user,
    loading,
    authResolved,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logOut,
    isAuthenticated: !!user,
    isConfigured: isFirebaseConfigured(),
  };
}
