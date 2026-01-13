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

    let unsubscribe: (() => void) | undefined;

    // Check for redirect result first (important for OAuth redirects)
    handleRedirectResult()
      .then((redirectUser) => {
        if (redirectUser) {
          console.log("[Auth] User authenticated via redirect:", redirectUser.email);
          setUser(redirectUser);
        }
        // Set up the auth state listener after handling redirect
        unsubscribe = onAuthChange((firebaseUser) => {
          console.log("[Auth] State changed:", firebaseUser?.email || "No user");
          setUser(firebaseUser);
          setLoading(false);
        });
      })
      .catch((err: any) => {
        console.error("[Auth] Redirect error:", err);
        setError(err.message);
        // Still set up listener even if redirect fails
        unsubscribe = onAuthChange((firebaseUser) => {
          console.log("[Auth] State changed:", firebaseUser?.email || "No user");
          setUser(firebaseUser);
          setLoading(false);
        });
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
