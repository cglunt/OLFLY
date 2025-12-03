import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, getUser, updateUser } from "./api";
import type { User, InsertUser } from "@shared/schema";

const USER_ID_KEY = "olfly_user_id";

// Get or create a user ID (stored in localStorage for this demo)
function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    // Will be set after creating user
    id = "pending";
  }
  return id;
}

function setUserId(id: string) {
  localStorage.setItem(USER_ID_KEY, id);
}

export function useCurrentUser() {
  const queryClient = useQueryClient();
  const userId = getUserId();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (userId === "pending") {
        // Create a new user
        const newUser = await createUser({
          name: "Sherman",
          hasOnboarded: false,
          remindersEnabled: true,
          streak: 0,
        });
        setUserId(newUser.id);
        
        // Set default scents for new user
        const { setUserScents } = await import("./api");
        await setUserScents(newUser.id, ['clove', 'lemon', 'eucalyptus', 'rose']);
        
        return newUser;
      }
      return getUser(userId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateUserMutation = useMutation({
    mutationFn: (updates: Partial<InsertUser>) => {
      if (!user) throw new Error("No user");
      return updateUser(user.id, updates);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", updatedUser.id], updatedUser);
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
