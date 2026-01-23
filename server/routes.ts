import type { Express } from "express";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertUserScentSchema,
  insertSessionSchema,
  insertSymptomLogSchema,
  insertScentCollectionSchema,
  insertContactSubmissionSchema,
} from "@shared/schema";
import { z } from "zod";
import { requireAuth, requireOwnership } from "./middleware";

export async function registerRoutes(app: Express) {
  // User routes
  app.post("/api/users", requireAuth, async (req, res) => {
    const bodyKeys = req.body && typeof req.body === "object" ? Object.keys(req.body) : [];
    console.info("[users] create-or-load", {
      auth: !!req.user,
      bodyKeys,
    });

    const parsed = insertUserSchema.partial().safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({
        message: "Invalid user payload",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    try {
      const existingUser = await storage.getUser(req.user!.uid);
      if (existingUser) {
        res.json(existingUser);
        return;
      }

      const userData = {
        ...parsed.data,
        id: req.user!.uid,
        email: req.user?.email ?? parsed.data.email ?? null,
        name: parsed.data.name ?? req.user?.name ?? "User",
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
      res.status(400).json({ message: error.message ?? "Failed to create user" });
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
      const updates = req.body;
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
}
