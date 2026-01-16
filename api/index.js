import { initializeApp } from "../dist/server/app.js";

let appPromise = null;

export default async function handler(req, res) {
  try {
    if (!appPromise) {
      appPromise = initializeApp();
    }

    const app = await appPromise;
    return app(req, res);
  } catch (err) {
    console.error("SERVERLESS HANDLER ERROR:", err);
    appPromise = null;
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
