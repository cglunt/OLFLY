import { users, userScents, sessions, symptomLogs, scentCollections, contactSubmissions, pushSubscriptions, fcmTokens, type User, type InsertUser, type UserScent, type InsertUserScent, type Session, type InsertSession, type SymptomLog, type InsertSymptomLog, type ScentCollection, type InsertScentCollection, type ContactSubmission, type InsertContactSubmission, type InsertPushSubscription, type PushSubscriptionRecord, type InsertFcmToken, type FcmTokenRecord } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // User scents operations (legacy - keeping for backwards compatibility)
  getUserScents(userId: string): Promise<UserScent[]>;
  addUserScent(userScent: InsertUserScent): Promise<UserScent>;
  removeUserScent(userId: string, scentId: string): Promise<void>;
  setUserScents(userId: string, scentIds: string[]): Promise<void>;
  
  // Scent collections operations
  getUserCollections(userId: string): Promise<ScentCollection[]>;
  getCollection(id: string): Promise<ScentCollection | undefined>;
  createCollection(collection: InsertScentCollection): Promise<ScentCollection>;
  updateCollection(id: string, userId: string, updates: Partial<InsertScentCollection>): Promise<ScentCollection | undefined>;
  deleteCollection(id: string, userId: string): Promise<boolean>;
  setActiveCollection(userId: string, collectionId: string): Promise<boolean>;
  getActiveCollection(userId: string): Promise<ScentCollection | undefined>;
  getCollectionByContext(userId: string, context: string): Promise<ScentCollection | undefined>;
  
  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getUserSessions(userId: string, limit?: number): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
  updateSession(id: string, updates: Partial<InsertSession>): Promise<Session | undefined>;
  
  // Symptom log operations
  createSymptomLog(log: InsertSymptomLog): Promise<SymptomLog>;
  getUserSymptomLogs(userId: string, limit?: number): Promise<SymptomLog[]>;
  deleteSymptomLog(logId: string, userId: string): Promise<void>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  // Subscription operations
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  updateUserSubscription(userId: string, updates: { plan: string; plusActive: boolean; currentPeriodEnd: Date | null; stripeCustomerId?: string }): Promise<User | undefined>;

  // Push notification subscription operations
  savePushSubscription(subscription: InsertPushSubscription): Promise<PushSubscriptionRecord>;
  deletePushSubscription(endpoint: string): Promise<void>;
  getPushSubscriptionsForUser(userId: string): Promise<PushSubscriptionRecord[]>;
  // FCM token operations (native Capacitor apps)
  saveFcmToken(token: InsertFcmToken): Promise<FcmTokenRecord>;
  deleteFcmToken(token: string): Promise<void>;
  getFcmTokensForUser(userId: string): Promise<FcmTokenRecord[]>;
  getUsersWithRemindersEnabled(): Promise<User[]>;
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

  // User scents operations (legacy)
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
      .where(and(eq(userScents.userId, userId), eq(userScents.scentId, scentId)));
  }

  async setUserScents(userId: string, scentIds: string[]): Promise<void> {
    await db.delete(userScents).where(eq(userScents.userId, userId));
    
    if (scentIds.length > 0) {
      await db.insert(userScents).values(
        scentIds.map(scentId => ({ userId, scentId }))
      );
    }
  }

  // Scent collections operations
  async getUserCollections(userId: string): Promise<ScentCollection[]> {
    return await db
      .select()
      .from(scentCollections)
      .where(eq(scentCollections.userId, userId))
      .orderBy(desc(scentCollections.createdAt));
  }

  async getCollection(id: string): Promise<ScentCollection | undefined> {
    const [collection] = await db.select().from(scentCollections).where(eq(scentCollections.id, id));
    return collection || undefined;
  }

  async createCollection(collection: InsertScentCollection): Promise<ScentCollection> {
    const [newCollection] = await db
      .insert(scentCollections)
      .values(collection as any)
      .returning();
    return newCollection;
  }

  async updateCollection(id: string, userId: string, updates: Partial<InsertScentCollection>): Promise<ScentCollection | undefined> {
    const [collection] = await db
      .update(scentCollections)
      .set(updates as any)
      .where(and(eq(scentCollections.id, id), eq(scentCollections.userId, userId)))
      .returning();
    return collection || undefined;
  }

  async deleteCollection(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(scentCollections)
      .where(and(eq(scentCollections.id, id), eq(scentCollections.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async setActiveCollection(userId: string, collectionId: string): Promise<boolean> {
    await db
      .update(scentCollections)
      .set({ isActive: false })
      .where(eq(scentCollections.userId, userId));
    
    const [updated] = await db
      .update(scentCollections)
      .set({ isActive: true })
      .where(and(eq(scentCollections.id, collectionId), eq(scentCollections.userId, userId)))
      .returning();
    
    return !!updated;
  }

  async getActiveCollection(userId: string): Promise<ScentCollection | undefined> {
    const [collection] = await db
      .select()
      .from(scentCollections)
      .where(and(eq(scentCollections.userId, userId), eq(scentCollections.isActive, true)));
    return collection || undefined;
  }

  async getCollectionByContext(userId: string, context: string): Promise<ScentCollection | undefined> {
    const [collection] = await db
      .select()
      .from(scentCollections)
      .where(and(eq(scentCollections.userId, userId), eq(scentCollections.context, context as any)));
    return collection || undefined;
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

  // Symptom log operations
  async createSymptomLog(log: InsertSymptomLog): Promise<SymptomLog> {
    const [newLog] = await db
      .insert(symptomLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getUserSymptomLogs(userId: string, limit: number = 50): Promise<SymptomLog[]> {
    return await db
      .select()
      .from(symptomLogs)
      .where(eq(symptomLogs.userId, userId))
      .orderBy(desc(symptomLogs.createdAt))
      .limit(limit);
  }

  async deleteSymptomLog(logId: string, userId: string): Promise<void> {
    await db
      .delete(symptomLogs)
      .where(and(eq(symptomLogs.id, logId), eq(symptomLogs.userId, userId)));
  }

  // Contact submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  // Subscription operations
  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId));
    return user || undefined;
  }

  async updateUserSubscription(userId: string, updates: { plan: string; plusActive: boolean; currentPeriodEnd: Date | null; stripeCustomerId?: string }): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  // Push notification subscription operations
  async savePushSubscription(subscription: InsertPushSubscription): Promise<PushSubscriptionRecord> {
    const [existing] = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint));

    if (existing) {
      // Update the existing subscription (keys can rotate)
      const [updated] = await db
        .update(pushSubscriptions)
        .set({ p256dh: subscription.p256dh, auth: subscription.auth, timezone: subscription.timezone })
        .where(eq(pushSubscriptions.endpoint, subscription.endpoint))
        .returning();
      return updated;
    }

    const [newSub] = await db
      .insert(pushSubscriptions)
      .values(subscription)
      .returning();
    return newSub;
  }

  async deletePushSubscription(endpoint: string): Promise<void> {
    await db
      .delete(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, endpoint));
  }

  async getPushSubscriptionsForUser(userId: string): Promise<PushSubscriptionRecord[]> {
    return db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));
  }

  // FCM token operations (native Capacitor apps)
  async saveFcmToken(token: InsertFcmToken): Promise<FcmTokenRecord> {
    const existing = await db
      .select()
      .from(fcmTokens)
      .where(eq(fcmTokens.token, token.token));

    if (existing.length) {
      // Update timezone / platform in case they changed
      const [updated] = await db
        .update(fcmTokens)
        .set({ platform: token.platform, timezone: token.timezone })
        .where(eq(fcmTokens.token, token.token))
        .returning();
      return updated;
    }

    const [inserted] = await db
      .insert(fcmTokens)
      .values(token)
      .returning();
    return inserted;
  }

  async deleteFcmToken(token: string): Promise<void> {
    await db
      .delete(fcmTokens)
      .where(eq(fcmTokens.token, token));
  }

  async getFcmTokensForUser(userId: string): Promise<FcmTokenRecord[]> {
    return db
      .select()
      .from(fcmTokens)
      .where(eq(fcmTokens.userId, userId));
  }

  async getUsersWithRemindersEnabled(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(eq(users.remindersEnabled, true));
  }
}

export const storage = new DatabaseStorage();
