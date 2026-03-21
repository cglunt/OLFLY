import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().default('Guest'),
  email: text("email"),
  hasOnboarded: boolean("has_onboarded").notNull().default(false),
  remindersEnabled: boolean("reminders_enabled").notNull().default(true),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
  morningTime: text("morning_time").default('08:00'),
  eveningTime: text("evening_time").default('20:00'),
  streak: integer("streak").notNull().default(0),
  lastSessionDate: timestamp("last_session_date"),
  stripeCustomerId: text("stripe_customer_id"),
  plan: text("plan").notNull().default('free'),
  plusActive: boolean("plus_active").notNull().default(false),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userScents = pgTable("user_scents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  scentId: text("scent_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const scentCollections = pgTable("scent_collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  context: text("context").notNull().default('custom'),
  scentIds: text("scent_ids").array().notNull().default([]),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  completed: boolean("completed").notNull().default(false),
  scentRatings: jsonb("scent_ratings").notNull().$type<Record<string, number>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const symptomLogs = pgTable("symptom_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  smellStrength: integer("smell_strength").notNull(),
  nasalCongestion: integer("nasal_congestion").notNull().default(0),
  tasteChanges: integer("taste_changes").notNull(),
  tasteIntensity: integer("taste_intensity").notNull().default(5),
  distortions: boolean("distortions").notNull().default(false),
  parosmiaDescription: text("parosmia_description"),
  phantomSmells: boolean("phantom_smells").notNull().default(false),
  phantomSmellDescription: text("phantom_smell_description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserScentSchema = createInsertSchema(userScents).omit({
  id: true,
  createdAt: true,
});

export const insertScentCollectionSchema = createInsertSchema(scentCollections).omit({
  id: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertSymptomLogSchema = createInsertSchema(symptomLogs).omit({
  id: true,
  createdAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
}).extend({
  subject: z.string().optional().nullable(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUserScent = z.infer<typeof insertUserScentSchema>;
export type UserScent = typeof userScents.$inferSelect;

export type InsertScentCollection = z.infer<typeof insertScentCollectionSchema>;
export type ScentCollection = typeof scentCollections.$inferSelect;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export type InsertSymptomLog = z.infer<typeof insertSymptomLogSchema>;
export type SymptomLog = typeof symptomLogs.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Push notification subscriptions
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  timezone: text("timezone").notNull().default('UTC'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;
export type PushSubscriptionRecord = typeof pushSubscriptions.$inferSelect;

// FCM tokens — used by native Capacitor apps (iOS / Android)
export const fcmTokens = pgTable("fcm_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  platform: text("platform").notNull(), // 'ios' | 'android'
  timezone: text("timezone").notNull().default("UTC"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFcmTokenSchema = createInsertSchema(fcmTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertFcmToken = z.infer<typeof insertFcmTokenSchema>;
export type FcmTokenRecord = typeof fcmTokens.$inferSelect;
