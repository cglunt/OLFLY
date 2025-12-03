import { users, userScents, sessions, type User, type InsertUser, type UserScent, type InsertUserScent, type Session, type InsertSession } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // User scents operations
  getUserScents(userId: string): Promise<UserScent[]>;
  addUserScent(userScent: InsertUserScent): Promise<UserScent>;
  removeUserScent(userId: string, scentId: string): Promise<void>;
  setUserScents(userId: string, scentIds: string[]): Promise<void>;
  
  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getUserSessions(userId: string, limit?: number): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
  updateSession(id: string, updates: Partial<InsertSession>): Promise<Session | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // User scents operations
  async getUserScents(userId: string): Promise<UserScent[]> {
    return await db.select().from(userScents).where(eq(userScents.userId, userId));
  }

  async addUserScent(userScent: InsertUserScent): Promise<UserScent> {
    const [scent] = await db
      .insert(userScents)
      .values(userScent)
      .returning();
    return scent;
  }

  async removeUserScent(userId: string, scentId: string): Promise<void> {
    await db
      .delete(userScents)
      .where(eq(userScents.userId, userId))
      .where(eq(userScents.scentId, scentId));
  }

  async setUserScents(userId: string, scentIds: string[]): Promise<void> {
    // Delete all existing scents for user
    await db.delete(userScents).where(eq(userScents.userId, userId));
    
    // Insert new scents
    if (scentIds.length > 0) {
      await db.insert(userScents).values(
        scentIds.map(scentId => ({ userId, scentId }))
      );
    }
  }

  // Session operations
  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getUserSessions(userId: string, limit: number = 50): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.createdAt))
      .limit(limit);
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async updateSession(id: string, updates: Partial<InsertSession>): Promise<Session | undefined> {
    const [session] = await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, id))
      .returning();
    return session || undefined;
  }
}

export const storage = new DatabaseStorage();
