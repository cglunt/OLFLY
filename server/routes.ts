import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserScentSchema, insertSessionSchema, insertSymptomLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      // Convert date strings to Date objects
      const body = { ...req.body };
      if (body.lastSessionDate && typeof body.lastSessionDate === 'string') {
        body.lastSessionDate = new Date(body.lastSessionDate);
      }
      
      const updates = insertUserSchema.partial().parse(body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid update data" });
    }
  });

  // User scents routes
  app.get("/api/users/:id/scents", async (req, res) => {
    try {
      const scents = await storage.getUserScents(req.params.id);
      res.json(scents);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.post("/api/users/:id/scents", async (req, res) => {
    try {
      const { scentIds } = z.object({ scentIds: z.array(z.string()) }).parse(req.body);
      await storage.setUserScents(req.params.id, scentIds);
      const scents = await storage.getUserScents(req.params.id);
      res.json(scents);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid scent data" });
    }
  });

  // Session routes
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid session data" });
    }
  });

  app.get("/api/users/:id/sessions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const sessions = await storage.getUserSessions(req.params.id, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const updates = insertSessionSchema.partial().parse(req.body);
      const session = await storage.updateSession(req.params.id, updates);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid update data" });
    }
  });

  // Symptom log routes
  app.post("/api/symptom-logs", async (req, res) => {
    try {
      const logData = insertSymptomLogSchema.parse(req.body);
      const log = await storage.createSymptomLog(logData);
      res.json(log);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid symptom log data" });
    }
  });

  app.get("/api/users/:id/symptom-logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getUserSymptomLogs(req.params.id, limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  return httpServer;
}
