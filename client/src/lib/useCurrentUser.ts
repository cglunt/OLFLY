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

async function getOrCreateUser(displayName?: string): Promise<User> {
  const storedId = getStoredUserId();
  
  if (storedId) {
    try {
      const existingUser = await getUser(storedId);
      return existingUser;
    } catch (e) {
      localStorage.removeItem(USER_ID_KEY);
    }
  }
  
  const newUser = await createUser({
    name: displayName || "User",
    hasOnboarded: false,
    remindersEnabled: true,
    streak: 0,
  });
  
  await setUserScents(newUser.id, ['clove', 'lemon', 'eucalyptus', 'rose']);
  setStoredUserId(newUser.id);
  
  return newUser;
}

export function useCurrentUser(displayName?: string, options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["currentUser", displayName],
    queryFn: () => getOrCreateUser(displayName),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: options?.enabled ?? true,
  });

  const updateUserMutation = useMutation({
    mutationFn: (updates: Partial<InsertUser>) => {
      if (!user) throw new Error("No user");
      return updateUser(user.id, updates);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser", displayName], updatedUser);
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
