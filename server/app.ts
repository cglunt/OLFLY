import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 1) Always-available health route (no DB, no auth)
app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = ((bodyJson: any, ...args: any[]) => {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  }) as any;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// 2) Cold-start safe initialization (prevents race conditions)
let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      // IMPORTANT: registerRoutes should attach routes to `app`
      // If your registerRoutes currently expects (httpServer, app),
      // we will update it in the next step.
      await registerRoutes(app);

      // Central error handler
      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("Request error:", err);
        res.status(status).json({ message });
      });

      if (process.env.NODE_ENV === "production") {
        serveStatic(app);
      }
    })();
  }

  await initPromise;
}

// 3) Initialize app (called by serverless function)
export async function initializeApp() {
  await ensureInitialized();
  return app;
}

export default app;
