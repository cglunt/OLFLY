import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, onAuthChange } from "./firebase";
import { createUser, getUser, updateUser, setUserScents } from "./api";
import type { User, InsertUser } from "@shared/schema";

async function getOrCreateUser(firebaseUid: string, displayName?: string): Promise<User> {
  // Try to fetch the existing user by their Firebase UID
  try {
    return await getUser(firebaseUid);
  } catch (e: any) {
    // Only create a new record on 404 — let other errors (network, 500) bubble up
    if (e?.status !== 404) throw e;
  }

  // First time: create the user record (server uses Firebase UID from token as the ID)
  const newUser = await createUser({
    name: displayName || "User",
    hasOnboarded: false,
    remindersEnabled: true,
    streak: 0,
  });

  // Seed default scents for new users
  await setUserScents(newUser.id, ["clove", "lemon", "eucalyptus", "rose"]);

  return newUser;
}

/**
 * Hook to access the current authenticated user's database record.
 *
 * Self-contained: reads the Firebase UID from auth state internally so callers
 * don't need to pass it. Any arguments passed are ignored for the UID — we always
 * use the real Firebase UID from auth.currentUser to guarantee a consistent
 * query key across all components.
 *
 * @param _uid     - Unused (kept for backwards compat). Do not rely on this.
 * @param _name    - Unused (kept for backwards compat). Do not rely on this.
 * @param options  - { enabled } lets callers defer fetching (e.g. App.tsx waits for authReady).
 */
export function useCurrentUser(
  _uid?: string,
  _name?: string,
  options?: { enabled?: boolean },
) {
  const queryClient = useQueryClient();

  // Read the real Firebase UID from auth state, not from caller arguments.
  // Initialise synchronously from auth.currentUser so there's no flicker when
  // the component mounts after auth has already resolved.
  const [firebaseUid, setFirebaseUid] = useState<string | undefined>(
    auth?.currentUser?.uid ?? undefined,
  );

  useEffect(() => {
    // Keep in sync with auth state changes (sign-in, sign-out, token refresh)
    const unsubscribe = onAuthChange((firebaseUser) => {
      setFirebaseUid(firebaseUser?.uid ?? undefined);
    });
    return unsubscribe;
  }, []);

  // Use the display name from the live auth object so new users get their name seeded
  const displayName = auth?.currentUser?.displayName ?? undefined;

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["currentUser", firebaseUid],
    queryFn: () => getOrCreateUser(firebaseUid!, displayName),
    staleTime: 5 * 60 * 1000,
    retry: 0,
    enabled: (options?.enabled ?? true) && !!firebaseUid,
  });

  const updateUserMutation = useMutation({
    mutationFn: (updates: Partial<InsertUser>) => {
      if (!user) throw new Error("No user");
      return updateUser(user.id, updates);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser", firebaseUid], updatedUser);
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
  };
}
