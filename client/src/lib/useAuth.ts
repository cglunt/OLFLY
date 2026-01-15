import { useState, useEffect } from "react";
import { onAuthChange, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut,
        handleRedirectResult, isFirebaseConfigured, User } from "./firebase";

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

    // Handle redirect result from OAuth
    handleRedirectResult()
      .then((user) => {
        if (user) {
          setUser(user);
        }
      })
      .catch((err) => {
        console.error("Redirect error:", err);
        setError(err.message);
      });

    const unsubscribe = onAuthChange((firebaseUser) => {
      console.log("AUTH STATE CHANGED:", firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
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
