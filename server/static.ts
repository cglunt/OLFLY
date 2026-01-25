import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Fall through to index.html ONLY for non-API routes
  // This prevents API requests from returning HTML
  app.use("*", (req, res, next) => {
    // Never serve HTML for API routes
    if (req.originalUrl.startsWith("/api") || req.url.startsWith("/api")) {
      res.status(404).json({ 
        error: "Not Found", 
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
        path: req.originalUrl
      });
      return;
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
