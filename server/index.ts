import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { getSafeRequestUrl } from "./request-url";

const app = express();
const httpServer = createServer(app);
const shouldDebug =
  process.env.DEBUG_AUTH === "true" || process.env.DEBUG_SERVER === "true";

// Allow requests from the native Capacitor app (runs at https://localhost inside
// the Android WebView) as well as the production web origin.
const ALLOWED_ORIGINS = [
  "https://olfly.app",
  "https://localhost",
  "capacitor://localhost",
  "http://localhost:5000",
  "http://localhost:3000",
];

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Always-available health route (no DB, no auth)
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    version:
      process.env.VERCEL_GIT_COMMIT_SHA ??
      process.env.BUILD_ID ??
      new Date().toISOString(),
  });
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

function logServerError(err: any, req: Request) {
  if (!shouldDebug) return;
  console.error("[server] request error", {
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    fullUrl: getSafeRequestUrl(req),
    host: req.headers.host,
    forwardedHost: req.headers["x-forwarded-host"],
    forwardedProto: req.headers["x-forwarded-proto"],
  });
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

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

(async () => {
  try {
    await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      if (_req) {
        logServerError(err, _req);
      }

      res.status(status).json({
        code: "SERVER_ERROR",
        message,
      });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }


  } catch (error) {
    console.error("Failed to initialize server:", error);
    throw error;
  }
})();

// Export the app for Vercel serverless function
export default app;
