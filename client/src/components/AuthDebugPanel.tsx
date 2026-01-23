import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/useAuth";
import { getAuthDebugState } from "@/lib/api";
import { isAuthDebugEnabled } from "@/lib/debugAuth";

export function AuthDebugPanel() {
  const [location] = useLocation();
  const { user, loading, authReady } = useAuth();
  const [snapshot, setSnapshot] = useState(getAuthDebugState());

  useEffect(() => {
    if (!isAuthDebugEnabled()) return;
    const interval = setInterval(() => {
      setSnapshot(getAuthDebugState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const debugPayload = useMemo(
    () => ({
      path: location,
      authReady,
      loading,
      hasUser: !!user,
      uid: user?.uid,
      email: user?.email,
      lastUsersStatus: snapshot.lastUsersStatus,
      lastUsersError: snapshot.lastUsersError,
      didSetAuthHeader: snapshot.didSetAuthHeader,
      lastLoginRedirectReason: snapshot.lastLoginRedirectReason,
      lastLoginRedirectAt: snapshot.lastLoginRedirectAt,
    }),
    [location, authReady, loading, user, snapshot],
  );

  useEffect(() => {
    if (!isAuthDebugEnabled()) return;
    console.log("[AUTH_DEBUG]", debugPayload);
  }, [debugPayload]);

  if (!isAuthDebugEnabled()) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-xs rounded-lg border border-white/10 bg-[#0c0c1d]/95 p-3 text-xs text-white shadow-lg">
      <div className="font-semibold text-white/90 mb-2">Auth Debug</div>
      <div className="space-y-1">
        <div>path: {debugPayload.path}</div>
        <div>authReady: {String(debugPayload.authReady)}</div>
        <div>loading: {String(debugPayload.loading)}</div>
        <div>hasUser: {String(debugPayload.hasUser)}</div>
        <div>uid: {debugPayload.uid ?? "—"}</div>
        <div>email: {debugPayload.email ?? "—"}</div>
        <div>last /api/users status: {debugPayload.lastUsersStatus ?? "—"}</div>
        <div>last /api/users error: {debugPayload.lastUsersError ?? "—"}</div>
        <div>didSetAuthHeader: {String(debugPayload.didSetAuthHeader)}</div>
        <div>last login redirect: {debugPayload.lastLoginRedirectReason ?? "—"}</div>
        <div>last login redirect at: {debugPayload.lastLoginRedirectAt ?? "—"}</div>
      </div>
    </div>
  );
}
