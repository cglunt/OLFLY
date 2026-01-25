import type {
  User,
  InsertUser,
  UserScent,
  Session,
  InsertSession,
  SymptomLog,
  InsertSymptomLog,
  ScentCollection,
  InsertScentCollection,
} from "@shared/schema";

import { auth, waitForAuthReady } from "./firebase";
import { debugAuthLog } from "./debugAuth";

type ApiAuthDebug = {
  didSetAuthHeader: boolean;
  lastUsersStatus?: number;
  lastUsersError?: string;
  lastLoginRedirectReason?: string;
  lastLoginRedirectAt?: number;
  lastAuthError?: string;
};

let authDebugState: ApiAuthDebug = {
  didSetAuthHeader: false,
};

export function getAuthDebugState() {
  return authDebugState;
}

export function setLoginRedirectReason(reason: string) {
  authDebugState = {
    ...authDebugState,
    lastLoginRedirectReason: reason,
    lastLoginRedirectAt: Date.now(),
  };
}

export function setLastAuthError(error: string) {
  authDebugState = {
    ...authDebugState,
    lastAuthError: error,
  };
}

// Helper function to get auth headers
async function getAuthHeaders(): Promise<HeadersInit> {
  await waitForAuthReady();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  authDebugState = {
    ...authDebugState,
    didSetAuthHeader: !!headers.Authorization,
  };
  if (import.meta.env.DEV) {
    console.debug("[api] auth headers", {
      hasUser: !!user,
      tokenLength: token.length,
      hasAuthorization: !!headers.Authorization,
    });
  }
  return headers;
}

async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = await getAuthHeaders();
  if (import.meta.env.DEV) {
    const authHeader = headers.Authorization ? "set" : "missing";
    console.debug("[api] authFetch", { url: String(input), authHeader });
  }
  if (String(input).includes("/api/users")) {
    debugAuthLog("API:/api/users:request", {
      ts: Date.now(),
      url: String(input),
      didSetAuthHeader: authDebugState.didSetAuthHeader,
    });
  }
  const response = await fetch(input, {
    ...init,
    headers: {
      ...headers,
      ...(init.headers ?? {}),
    },
  });
  if (String(input).includes("/api/users")) {
    authDebugState = {
      ...authDebugState,
      lastUsersStatus: response.status,
    };
    debugAuthLog("API:/api/users:response", {
      ts: Date.now(),
      status: response.status,
    });
  }
  return response;
}

// User API
export async function createUser(userData: InsertUser): Promise<User> {
  const res = await authFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = new Error("Failed to create user");
    (error as { status?: number }).status = res.status;
    try {
      const body = await res.clone().json();
      if (body?.code) {
        setLastAuthError(`${body.code} ${body.message ?? ""}`.trim());
      }
    } catch {
      // ignore parse errors
    }
    authDebugState = {
      ...authDebugState,
      lastUsersError: error.message,
    };
    throw error;
  }
  return res.json();
}

export async function getUser(id: string): Promise<User> {
  const res = await authFetch(`/api/users/${id}`);
  if (!res.ok) {
    const error = new Error("Failed to fetch user");
    (error as { status?: number }).status = res.status;
    authDebugState = {
      ...authDebugState,
      lastUsersError: error.message,
    };
    throw error;
  }
  return res.json();
}

export async function updateUser(
  id: string,
  updates: Partial<InsertUser>,
): Promise<User> {
  const res = await authFetch(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

// User Scents API (legacy)
export async function getUserScents(userId: string): Promise<UserScent[]> {
  const res = await authFetch(`/api/users/${userId}/scents`);
  if (!res.ok) throw new Error("Failed to fetch user scents");
  return res.json();
}

export async function setUserScents(
  userId: string,
  scentIds: string[],
): Promise<UserScent[]> {
  const res = await authFetch(`/api/users/${userId}/scents`, {
    method: "PUT",
    body: JSON.stringify({ scentIds }),
  });
  if (!res.ok) throw new Error("Failed to update user scents");
  return res.json();
}

// Scent Collections API
export async function getUserCollections(
  userId: string,
): Promise<ScentCollection[]> {
  const res = await authFetch(`/api/users/${userId}/collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function getActiveCollection(
  userId: string,
): Promise<ScentCollection | null> {
  const res = await authFetch(`/api/users/${userId}/collections/active`);
  if (!res.ok) throw new Error("Failed to fetch active collection");
  return res.json();
}

export async function getCollectionByContext(
  userId: string,
  context: string,
): Promise<ScentCollection | null> {
  const res = await authFetch(
    `/api/users/${userId}/collections/context/${context}`,
    {
      headers: await getAuthHeaders(),
    },
  );
  if (!res.ok) throw new Error("Failed to fetch collection by context");
  return res.json();
}

export async function createCollection(
  collectionData: InsertScentCollection,
): Promise<ScentCollection> {
  const res = await authFetch(
    `/api/users/${collectionData.userId}/collections`,
    {
      method: "POST",
      body: JSON.stringify(collectionData),
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}


export async function updateCollection(
  userId: string,
  id: string,
  updates: Partial<InsertScentCollection>,
): Promise<ScentCollection> {
  const res = await authFetch(`/api/users/${userId}/collections/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update collection");
  return res.json();
}

export async function deleteCollection(
  userId: string,
  id: string,
): Promise<void> {
  const res = await authFetch(`/api/users/${userId}/collections/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete collection");
}

export async function activateCollection(
  userId: string,
  collectionId: string,
): Promise<ScentCollection> {
  const res = await authFetch(
    `/api/users/${userId}/collections/${collectionId}/activate`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
    },
  );
  if (!res.ok) throw new Error("Failed to activate collection");
  return res.json();
}

// Session API
export async function createSession(
  sessionData: InsertSession,
): Promise<Session> {
  const res = await authFetch("/api/sessions", {
    method: "POST",
    body: JSON.stringify(sessionData),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function getUserSessions(
  userId: string,
  limit?: number,
): Promise<Session[]> {
  const url = `/api/users/${userId}/sessions${limit ? `?limit=${limit}` : ""}`;
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function getSession(id: string): Promise<Session> {
  const res = await authFetch(`/api/sessions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export async function updateSession(
  id: string,
  updates: Partial<InsertSession>,
): Promise<Session> {
  const res = await authFetch(`/api/sessions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update session");
  return res.json();
}

// Symptom Log API
export async function createSymptomLog(
  logData: InsertSymptomLog,
): Promise<SymptomLog> {
  const res = await authFetch("/api/symptom-logs", {
    method: "POST",
    body: JSON.stringify(logData),
  });
  if (!res.ok) throw new Error("Failed to create symptom log");
  return res.json();
}

export async function getUserSymptomLogs(
  userId: string,
  limit?: number,
): Promise<SymptomLog[]> {
  const url = `/api/users/${userId}/symptom-logs${limit ? `?limit=${limit}` : ""}`;
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch symptom logs");
  return res.json();
}
