import { initializeApp } from "../../dist/server/app.js";

let appPromise = null;

export default async (req, res) => {
  if (!appPromise) {
    appPromise = initializeApp();
  }
  const app = await appPromise;
  return app(req, res);
};
