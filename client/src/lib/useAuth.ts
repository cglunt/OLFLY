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
    let redirectHandled = false;

    // Handle redirect result from OAuth first
    handleRedirectResult()
      .then((redirectUser) => {
        redirectHandled = true;
        if (redirectUser) {
          console.log("Redirect user found:", redirectUser.email);
          setUser(redirectUser);
        }
        // Only set up listener after redirect is handled
        unsubscribe = onAuthChange((firebaseUser) => {
          console.log("Auth state changed:", firebaseUser?.email);
          setUser(firebaseUser);
          setLoading(false);
        });
      })
      .catch((err: any) => {
        console.error("Redirect error:", err);
        setError(err.message);
        redirectHandled = true;
        // Still set up listener even if redirect fails
        unsubscribe = onAuthChange((firebaseUser) => {
          console.log("Auth state changed:", firebaseUser?.email);
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
