import type { Express } from "express";
import { storage } from "./storage";
import {
  insertUserScentSchema,
  insertSessionSchema,
  insertSymptomLogSchema,
  insertScentCollectionSchema,
  insertContactSubmissionSchema,
} from "@shared/schema";
import { z } from "zod";
import { requireAuth, requireOwnership } from "./middleware";
import webpush from "web-push";
import cron from "node-cron";
import { getFirebaseMessaging } from "./firebase-admin";
import { sendMail } from "./email";

// ── VAPID setup ──────────────────────────────────────────────────────────────
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:hello@olfly.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  console.warn("VAPID keys not set — push notifications will not work.");
}

// ── Reminder scheduler ───────────────────────────────────────────────────────
// Runs every minute, checks which users need a notification right now.
// Sends via Web Push (VAPID) for web subscribers and FCM for native app users.
cron.schedule("* * * * *", async () => {
  try {
    const usersWithReminders = await storage.getUsersWithRemindersEnabled();

    for (const user of usersWithReminders) {
      const morningTime = user.morningTime || "08:00";
      const eveningTime = user.eveningTime || "20:00";

      // Helper: resolve current time in the user's timezone from a subscription
      const getCurrentTimeForTz = (tz: string): string => {
        let userNow: Date;
        try {
          userNow = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
        } catch {
          userNow = new Date();
        }
        const h = userNow.getHours().toString().padStart(2, "0");
        const m = userNow.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
      };

      const buildNotification = (currentTime: string) => {
        if (currentTime === morningTime) {
          return {
            title: "Time for your smell training",
            body: "Your scents are waiting. A quick session helps rebuild your senses.",
            url: "/launch/training",
            tag: "olfly-morning",
          };
        }
        if (currentTime === eveningTime) {
          return {
            title: "Quick reset",
            body: "A few minutes of smell training can help. Ready when you are.",
            url: "/launch/training",
            tag: "olfly-evening",
          };
        }
        return null;
      };

      // ── Web Push (VAPID) ────────────────────────────────────────────────────
      if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
        const webSubs = await storage.getPushSubscriptionsForUser(user.id);
        for (const sub of webSubs) {
          const notification = buildNotification(getCurrentTimeForTz(sub.timezone || "UTC"));
          if (!notification) continue;
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
              JSON.stringify(notification)
            );
          } catch (err: any) {
            if (err.statusCode === 410) {
              await storage.deletePushSubscription(sub.endpoint);
            }
          }
        }
      }

      // ── FCM (native Capacitor apps) ─────────────────────────────────────────
      const fcmTokenRecords = await storage.getFcmTokensForUser(user.id);
      for (const record of fcmTokenRecords) {
        const notification = buildNotification(getCurrentTimeForTz(record.timezone || "UTC"));
        if (!notification) continue;
        try {
          await getFirebaseMessaging().send({
            token: record.token,
            notification: { title: notification.title, body: notification.body },
            data: { url: notification.url, tag: notification.tag },
          });
        } catch (err: any) {
          // Token no longer valid — remove it
          const invalidCodes = ["messaging/registration-token-not-registered", "messaging/invalid-registration-token"];
          if (invalidCodes.includes(err?.errorInfo?.code)) {
            await storage.deleteFcmToken(record.token);
          }
        }
      }
    }
  } catch (err) {
    console.error("Reminder cron error:", err);
  }
});

export async function registerRoutes(app: Express) {
  // User routes
  app.post("/api/users", requireAuth, async (req, res) => {
    try {
      const existingUser = await storage.getUser(req.user!.uid);
      if (existingUser) {
        res.json(existingUser);
        return;
      }

      const userData = {
        id: req.user!.uid,
        email: req.user?.email ?? null,
        name: req.user?.name ?? "User",
        hasOnboarded: false,
        remindersEnabled: true,
        streak: 0,
      };

      const user = await storage.createUser(userData as any);
      res.json(user);
    } catch (error: any) {
      if (error.code === "23505") {
        const existingUser = await storage.getUser(req.user!.uid);
        if (existingUser) {
          res.json(existingUser);
          return;
        }
      }
console.error("[users] create failed", {
  message: error?.message,
  code: error?.code,
  stack: error?.stack,
});
res.status(400).json({ message: error?.message ?? "Failed to create user" });

    }
  });

  app.get("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/users/:id", requireAuth, requireOwnership(), async (req, res) => {
    try {
      const updates = { ...req.body };
      // Drizzle timestamp columns require Date objects — convert ISO strings from JSON body
      if (updates.lastSessionDate && typeof updates.lastSessionDate === "string") {
        updates.lastSessionDate = new Date(updates.lastSessionDate);
      }
      if (updates.currentPeriodEnd && typeof updates.currentPeriodEnd === "string") {
        updates.currentPeriodEnd = new Date(updates.currentPeriodEnd);
      }
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User scents routes (legacy)
  app.get("/api/users/:userId/scents", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const scents = await storage.getUserScents(req.params.userId);
      res.json(scents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/scents", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const scentData = insertUserScentSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const scent = await storage.addUserScent(scentData);
      res.json(scent);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/users/:userId/scents/:scentId", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      await storage.removeUserScent(req.params.userId, req.params.scentId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/users/:userId/scents", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const { scentIds } = req.body;
      await storage.setUserScents(req.params.userId, scentIds);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Scent collections routes
  app.get("/api/users/:userId/collections", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const collections = await storage.getUserCollections(req.params.userId);
      res.json(collections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/collections/active", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const collection = await storage.getActiveCollection(req.params.userId);
      res.json(collection || null);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/collections", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const collectionData = insertScentCollectionSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const collection = await storage.createCollection(collectionData);
      res.json(collection);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/users/:userId/collections/:collectionId", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const collection = await storage.updateCollection(
        req.params.collectionId,
        req.params.userId,
        req.body
      );
      if (!collection) {
        res.status(404).json({ message: "Collection not found" });
        return;
      }
      res.json(collection);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/users/:userId/collections/:collectionId", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const deleted = await storage.deleteCollection(
        req.params.collectionId,
        req.params.userId
      );
      if (!deleted) {
        res.status(404).json({ message: "Collection not found" });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/collections/:collectionId/activate", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const success = await storage.setActiveCollection(
        req.params.userId,
        req.params.collectionId
      );
      if (!success) {
        res.status(404).json({ message: "Collection not found" });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Session routes
  app.get("/api/users/:userId/sessions", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const sessions = await storage.getUserSessions(req.params.userId, limit);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/sessions", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/sessions/:id", requireAuth, async (req, res) => {
    try {
      const session = await storage.updateSession(req.params.id, req.body);
      if (!session) {
        res.status(404).json({ message: "Session not found" });
        return;
      }
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Symptom log routes
  app.get("/api/users/:userId/symptom-logs", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getUserSymptomLogs(req.params.userId, limit);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/symptom-logs", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      const logData = insertSymptomLogSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const log = await storage.createSymptomLog(logData);
      res.json(log);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/users/:userId/symptom-logs/:logId", requireAuth, requireOwnership((req) => req.params.userId), async (req, res) => {
    try {
      await storage.deleteSymptomLog(req.params.logId, req.params.userId);
      res.json({ ok: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact form (public route - no auth required)
  app.post("/api/contact", async (req, res) => {
    try {
      const submissionData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(submissionData);
      res.json(submission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Clinician access request form — saves to DB and emails support@olfly.app
  app.post("/api/clinician-request", async (req, res) => {
    try {
      const { fullName, workEmail, organization, patientCount, notes } = req.body as {
        fullName: string;
        workEmail: string;
        organization: string;
        patientCount: string;
        notes?: string;
      };

      if (!fullName || !workEmail || !organization || !patientCount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Save to DB using the existing contact_submissions table
      await storage.createContactSubmission({
        name: fullName,
        email: workEmail,
        subject: "Clinician Access Request",
        message: [
          `Organization: ${organization}`,
          `Patient count: ${patientCount}`,
          notes ? `Notes: ${notes}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      });

      // Send notification email to support — fire-and-forget (don't block response)
      const emailText = [
        `New clinician access request from ${fullName}`,
        ``,
        `Name:           ${fullName}`,
        `Work email:     ${workEmail}`,
        `Organization:   ${organization}`,
        `Patient count:  ${patientCount}`,
        notes ? `Notes:          ${notes}` : null,
        ``,
        `Reply directly to this email to contact the applicant.`,
      ]
        .filter((l) => l !== null)
        .join("\n");

      const emailSent = await sendMail({
        to: "support@olfly.app",
        subject: `Clinician access request — ${fullName} (${organization})`,
        text: emailText,
        replyTo: workEmail,
      }).catch((err) => {
        console.error("[clinician-request] email error:", err);
        return false;
      });

      console.log(
        `[clinician-request] email sent=${emailSent} | ` +
        `RESEND_API_KEY set=${!!process.env.RESEND_API_KEY} | ` +
        `from=${process.env.SMTP_FROM || "noreply@olfly.app"} | ` +
        `to=support@olfly.app`
      );

      res.json({ ok: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ── Email waitlist subscription via MailerLite ──────────────────────────────

  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = req.body as { email: string };
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email required" });
      }

      const apiKey = process.env.MAILERLITE_API_KEY;
      const groupId = process.env.MAILERLITE_GROUP_ID;

      if (!apiKey || !groupId) {
        console.warn("[subscribe] MAILERLITE_API_KEY or MAILERLITE_GROUP_ID not configured");
        return res.status(503).json({ message: "Subscription service not configured" });
      }

      const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ email, groups: [groupId] }),
      });

      if (!response.ok && response.status !== 409) {
        const err = await response.json().catch(() => ({}));
        console.error("[subscribe] MailerLite error:", err);
        return res.status(500).json({ message: "Failed to subscribe. Please try again." });
      }

      res.json({ ok: true });
    } catch (error: any) {
      console.error("[subscribe] error:", error);
      res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  });

  // ── Push notification routes ────────────────────────────────────────────────

  // Return VAPID public key to the client (no auth required — it's public)
  app.get("/api/push/vapid-public-key", (_req, res) => {
    if (!VAPID_PUBLIC_KEY) {
      return res.status(503).json({ message: "Push notifications not configured" });
    }
    res.json({ publicKey: VAPID_PUBLIC_KEY });
  });

  // Save a push subscription
  app.post("/api/push/subscribe", requireAuth, async (req, res) => {
    try {
      const { endpoint, keys, timezone } = req.body as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
        timezone?: string;
      };

      if (!endpoint || !keys?.p256dh || !keys?.auth) {
        return res.status(400).json({ message: "Invalid subscription data" });
      }

      const sub = await storage.savePushSubscription({
        userId: req.user!.uid,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        timezone: timezone || "UTC",
      });

      res.json(sub);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Remove a push subscription (unsubscribe)
  app.delete("/api/push/subscribe", requireAuth, async (req, res) => {
    try {
      const { endpoint } = req.body as { endpoint: string };
      if (!endpoint) return res.status(400).json({ message: "endpoint required" });
      await storage.deletePushSubscription(endpoint);
      res.json({ ok: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ── FCM token routes (native Capacitor apps) ─────────────────────────────────

  // Register or refresh an FCM device token
  app.post("/api/push/register-token", requireAuth, async (req, res) => {
    try {
      const { token, platform, timezone } = req.body as {
        token: string;
        platform: "ios" | "android";
        timezone?: string;
      };
      if (!token) return res.status(400).json({ message: "token required" });
      if (!platform || !["ios", "android"].includes(platform)) {
        return res.status(400).json({ message: "platform must be 'ios' or 'android'" });
      }

      const record = await storage.saveFcmToken({
        userId: req.user!.uid,
        token,
        platform,
        timezone: timezone || "UTC",
      });
      res.json({ ok: true, id: record.id });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Remove an FCM device token (on unsubscribe or sign-out)
  app.delete("/api/push/register-token", requireAuth, async (req, res) => {
    try {
      const { token } = req.body as { token: string };
      if (!token) return res.status(400).json({ message: "token required" });
      await storage.deleteFcmToken(token);
      res.json({ ok: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}
