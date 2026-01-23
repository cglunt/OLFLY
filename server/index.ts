import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const shouldDebug =
  process.env.DEBUG_AUTH === "true" || process.env.DEBUG_SERVER === "true";

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

function getRequestBase(req: Request): string | undefined {
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  return host ? `${proto}://${host}` : undefined;
}

function getSafeRequestUrl(req: Request): string | undefined {
  const rawUrl = req.originalUrl ?? req.url;
  const base = getRequestBase(req);
  if (!rawUrl) return undefined;
  if (!base) return rawUrl;
  try {
    return new URL(rawUrl, base).toString();
  } catch {
    return rawUrl;
  }
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
