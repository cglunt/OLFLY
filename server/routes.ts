import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserScentSchema, insertSessionSchema, insertSymptomLogSchema, insertScentCollectionSchema, insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";

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

  // Scent collections routes
  app.get("/api/users/:id/collections", async (req, res) => {
    try {
      const collections = await storage.getUserCollections(req.params.id);
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.get("/api/users/:id/collections/active", async (req, res) => {
    try {
      const collection = await storage.getActiveCollection(req.params.id);
      res.json(collection || null);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.get("/api/users/:id/collections/context/:context", async (req, res) => {
    try {
      const collection = await storage.getCollectionByContext(req.params.id, req.params.context);
      res.json(collection || null);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const collectionData = insertScentCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(collectionData);
      res.json(collection);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid collection data" });
    }
  });

  app.patch("/api/users/:userId/collections/:id", async (req, res) => {
    try {
      const updates = insertScentCollectionSchema.partial().parse(req.body);
      const collection = await storage.updateCollection(req.params.id, req.params.userId, updates);
      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid update data" });
    }
  });

  app.delete("/api/users/:userId/collections/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCollection(req.params.id, req.params.userId);
      if (!deleted) {
        return res.status(404).json({ error: "Collection not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.post("/api/users/:userId/collections/:collectionId/activate", async (req, res) => {
    try {
      const activated = await storage.setActiveCollection(req.params.userId, req.params.collectionId);
      if (!activated) {
        return res.status(404).json({ error: "Collection not found" });
      }
      const collection = await storage.getCollection(req.params.collectionId);
      res.json(collection);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
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

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const submissionData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(submissionData);
      res.json({ success: true, id: submission.id });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid contact data" });
    }
  });

  // Stripe routes
  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (error) {
      res.status(500).json({ error: "Failed to get Stripe key" });
    }
  });

  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { userId, priceId } = z.object({
        userId: z.string(),
        priceId: z.string(),
      }).parse(req.body);

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeService.createCustomer(user.email || `${userId}@olfly.app`, userId);
        await storage.updateUser(userId, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/pricing`
      );

      console.log("Checkout session created:", session.id);
      res.json({ url: session.url });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create checkout session" });
    }
  });

  app.post("/api/stripe/create-portal-session", async (req, res) => {
    try {
      const { userId } = z.object({
        userId: z.string(),
      }).parse(req.body);

      const user = await storage.getUser(userId);
      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ error: "No subscription found" });
      }

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
      const portalSession = await stripeService.createCustomerPortalSession(
        user.stripeCustomerId,
        `${baseUrl}/progress`
      );

      res.json({ url: portalSession.url });
    } catch (error) {
      console.error("Portal error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create portal session" });
    }
  });

  app.get("/api/stripe/subscription/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.stripeCustomerId) {
        return res.json({ subscription: null, plusActive: false });
      }

      const subscription = await stripeService.getSubscriptionByCustomerId(user.stripeCustomerId);
      res.json({
        subscription,
        plusActive: user.plusActive,
        plan: user.plan,
        currentPeriodEnd: user.currentPeriodEnd,
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.get("/api/stripe/products", async (_req, res) => {
    try {
      const products = await stripeService.listProducts();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  app.get("/api/stripe/prices", async (_req, res) => {
    try {
      const prices = await stripeService.listPrices();
      res.json({ prices });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Server error" });
    }
  });

  return httpServer;
}
