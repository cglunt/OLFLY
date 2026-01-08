import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

const PLUS_PRICE_ID = "price_1Sn7ZUBYQeDJd8qqIdfj4rLD";

export function useStripeSubscription(userId: string | undefined) {
  return useQuery({
    queryKey: ["stripe-subscription", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await apiRequest("GET", `/api/stripe/subscription/${userId}`);
      return res.json();
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const res = await apiRequest("POST", "/api/stripe/create-checkout-session", {
        userId,
        priceId: PLUS_PRICE_ID,
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const res = await apiRequest("POST", "/api/stripe/create-portal-session", {
        userId,
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}
