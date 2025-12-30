import type { User, InsertUser, UserScent, Session, InsertSession, SymptomLog, InsertSymptomLog, ScentCollection, InsertScentCollection } from "@shared/schema";

// User API
export async function createUser(userData: InsertUser): Promise<User> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

// User Scents API (legacy)
export async function getUserScents(userId: string): Promise<UserScent[]> {
  const res = await fetch(`/api/users/${userId}/scents`);
  if (!res.ok) throw new Error("Failed to fetch user scents");
  return res.json();
}

export async function setUserScents(userId: string, scentIds: string[]): Promise<UserScent[]> {
  const res = await fetch(`/api/users/${userId}/scents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scentIds }),
  });
  if (!res.ok) throw new Error("Failed to update user scents");
  return res.json();
}

// Scent Collections API
export async function getUserCollections(userId: string): Promise<ScentCollection[]> {
  const res = await fetch(`/api/users/${userId}/collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function getActiveCollection(userId: string): Promise<ScentCollection | null> {
  const res = await fetch(`/api/users/${userId}/collections/active`);
  if (!res.ok) throw new Error("Failed to fetch active collection");
  return res.json();
}

export async function getCollectionByContext(userId: string, context: string): Promise<ScentCollection | null> {
  const res = await fetch(`/api/users/${userId}/collections/context/${context}`);
  if (!res.ok) throw new Error("Failed to fetch collection by context");
  return res.json();
}

export async function createCollection(collectionData: InsertScentCollection): Promise<ScentCollection> {
  const res = await fetch("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collectionData),
  });
  if (!res.ok) throw new Error("Failed to create collection");
  return res.json();
}

export async function updateCollection(userId: string, id: string, updates: Partial<InsertScentCollection>): Promise<ScentCollection> {
  const res = await fetch(`/api/users/${userId}/collections/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update collection");
  return res.json();
}

export async function deleteCollection(userId: string, id: string): Promise<void> {
  const res = await fetch(`/api/users/${userId}/collections/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete collection");
}

export async function activateCollection(userId: string, collectionId: string): Promise<ScentCollection> {
  const res = await fetch(`/api/users/${userId}/collections/${collectionId}/activate`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to activate collection");
  return res.json();
}

// Session API
export async function createSession(sessionData: InsertSession): Promise<Session> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionData),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function getUserSessions(userId: string, limit?: number): Promise<Session[]> {
  const url = `/api/users/${userId}/sessions${limit ? `?limit=${limit}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function getSession(id: string): Promise<Session> {
  const res = await fetch(`/api/sessions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export async function updateSession(id: string, updates: Partial<InsertSession>): Promise<Session> {
  const res = await fetch(`/api/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update session");
  return res.json();
}

// Symptom Log API
export async function createSymptomLog(logData: InsertSymptomLog): Promise<SymptomLog> {
  const res = await fetch("/api/symptom-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logData),
  });
  if (!res.ok) throw new Error("Failed to create symptom log");
  return res.json();
}

export async function getUserSymptomLogs(userId: string, limit?: number): Promise<SymptomLog[]> {
  const url = `/api/users/${userId}/symptom-logs${limit ? `?limit=${limit}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch symptom logs");
  return res.json();
}
