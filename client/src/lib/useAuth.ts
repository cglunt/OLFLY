import { useState, useEffect } from "react";
import { onAuthChange, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut, handleRedirectResult, isFirebaseConfigured, User } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Please add your Firebase credentials.");
      setLoading(false);
      return;
    }

    // Handle redirect result from OAuth first, then set up auth listener
    const initAuth = async () => {
      try {
        // Wait for redirect result to complete first
        const redirectUser = await handleRedirectResult();
        if (redirectUser) {
          setUser(redirectUser);
        }
      } catch (err: any) {
        console.error("Redirect error:", err);
        setError(err.message);
      }

      // Now set up the auth state listener after redirect is handled
      const unsubscribe = onAuthChange((firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;
    initAuth().then((unsub) => {
      unsubscribe = unsub;
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
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logOut,
    isAuthenticated: !!user,
    isConfigured: isFirebaseConfigured(),
  };
}
