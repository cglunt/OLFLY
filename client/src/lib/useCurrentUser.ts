import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, getUser, updateUser, setUserScents } from "./api";
import type { User, InsertUser } from "@shared/schema";

const USER_ID_KEY = "olfly_user_id";

function getStoredUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

function setStoredUserId(id: string) {
  localStorage.setItem(USER_ID_KEY, id);
}

async function getOrCreateUser(): Promise<User> {
  const storedId = getStoredUserId();
  console.log("[useCurrentUser] Starting getOrCreateUser, storedId:", storedId);
  
  if (storedId) {
    try {
      const existingUser = await getUser(storedId);
      console.log("[useCurrentUser] Found existing user:", existingUser);
      return existingUser;
    } catch (e) {
      console.log("[useCurrentUser] User not found, clearing storage");
      localStorage.removeItem(USER_ID_KEY);
    }
  }
  
  console.log("[useCurrentUser] Creating new user");
  const newUser = await createUser({
    name: "Sherman",
    hasOnboarded: false,
    remindersEnabled: true,
    streak: 0,
  });
  console.log("[useCurrentUser] Created user:", newUser);
  
  // Set default scents
  await setUserScents(newUser.id, ['clove', 'lemon', 'eucalyptus', 'rose']);
  console.log("[useCurrentUser] Set default scents");
  
  // Store user ID
  setStoredUserId(newUser.id);
  console.log("[useCurrentUser] Stored user ID, returning user");
  
  return newUser;
}

export function useCurrentUser() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error, status, fetchStatus } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getOrCreateUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  
  console.log("[useCurrentUser] Hook state:", { user: user?.id, isLoading, error, status, fetchStatus });

  const updateUserMutation = useMutation({
    mutationFn: (updates: Partial<InsertUser>) => {
      if (!user) throw new Error("No user");
      return updateUser(user.id, updates);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
    },
  });

  return {
    user,
    isLoading,
    error,
    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
  };
}
