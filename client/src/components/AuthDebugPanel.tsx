import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/useAuth";
import { getAuthDebugState } from "@/lib/api";

const isDebugEnabled = import.meta.env.VITE_DEBUG_AUTH === "true";

export function AuthDebugPanel() {
  const [location] = useLocation();
  const { user, loading, authResolved } = useAuth();
  const [snapshot, setSnapshot] = useState(getAuthDebugState());

  useEffect(() => {
    if (!isDebugEnabled) return;
    const interval = setInterval(() => {
      setSnapshot(getAuthDebugState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const debugPayload = useMemo(
    () => ({
      path: location,
      authResolved,
      loading,
      hasUser: !!user,
      uid: user?.uid,
      email: user?.email,
      lastUsersStatus: snapshot.lastUsersStatus,
      lastUsersError: snapshot.lastUsersError,
      didSetAuthHeader: snapshot.didSetAuthHeader,
    }),
    [location, authResolved, loading, user, snapshot],
  );

  useEffect(() => {
    if (!isDebugEnabled) return;
    console.log("[AUTH_DEBUG]", debugPayload);
  }, [debugPayload]);

  if (!isDebugEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-xs rounded-lg border border-white/10 bg-[#0c0c1d]/95 p-3 text-xs text-white shadow-lg">
      <div className="font-semibold text-white/90 mb-2">Auth Debug</div>
      <div className="space-y-1">
        <div>path: {debugPayload.path}</div>
        <div>authResolved: {String(debugPayload.authResolved)}</div>
        <div>loading: {String(debugPayload.loading)}</div>
        <div>hasUser: {String(debugPayload.hasUser)}</div>
        <div>uid: {debugPayload.uid ?? "—"}</div>
        <div>email: {debugPayload.email ?? "—"}</div>
        <div>last /api/users status: {debugPayload.lastUsersStatus ?? "—"}</div>
        <div>last /api/users error: {debugPayload.lastUsersError ?? "—"}</div>
        <div>didSetAuthHeader: {String(debugPayload.didSetAuthHeader)}</div>
      </div>
    </div>
  );
}
