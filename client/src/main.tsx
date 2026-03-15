import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { auth, onAuthChange, initAuthPersistence, waitForAuthReady } from "./lib/firebase";
import { registerServiceWorker } from "./lib/notifications";

// Register the service worker early so push notifications work even when
// the app tab is closed. Non-blocking — failures are logged but ignored.
void registerServiceWorker();

async function startApp() {
  try {
    await initAuthPersistence();
    await waitForAuthReady();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[AUTH_DEBUG] initAuthPersistence failed", error);
    }
  } finally {
    createRoot(document.getElementById("root")!).render(<App />);
  }
}

void startApp();
