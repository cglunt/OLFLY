import type { User, InsertUser, UserScent, Session, InsertSession } from "@shared/schema";

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

// User Scents API
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
