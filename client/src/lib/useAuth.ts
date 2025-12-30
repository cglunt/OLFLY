import { useState, useEffect } from "react";
import { onAuthChange, signInWithGoogle, logOut, isFirebaseConfigured, User } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useAuth] Starting, isConfigured:", isFirebaseConfigured());
    
    if (!isFirebaseConfigured()) {
      console.log("[useAuth] Firebase not configured");
      setError("Firebase is not configured. Please add your Firebase credentials.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      console.log("[useAuth] Auth state changed:", firebaseUser ? "logged in" : "logged out");
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  console.log("[useAuth] State:", { loading, isAuthenticated: !!user, hasError: !!error });

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    logOut,
    isAuthenticated: !!user,
    isConfigured: isFirebaseConfigured(),
  };
}
