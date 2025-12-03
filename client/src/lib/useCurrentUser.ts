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
  
  if (storedId) {
    try {
      return await getUser(storedId);
    } catch (e) {
      // User not found, clear and create new
      localStorage.removeItem(USER_ID_KEY);
    }
  }
  
  // Create new user
  const newUser = await createUser({
    name: "Sherman",
    hasOnboarded: false,
    remindersEnabled: true,
    streak: 0,
  });
  
  // Set default scents
  await setUserScents(newUser.id, ['clove', 'lemon', 'eucalyptus', 'rose']);
  
  // Store user ID
  setStoredUserId(newUser.id);
  
  return newUser;
}

export function useCurrentUser() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getOrCreateUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

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
