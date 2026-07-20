import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initAuthPersistence, waitForAuthReady } from "./lib/firebase";
import { registerServiceWorker } from "./lib/notifications";

// Register the service worker early so push notifications work even when
// the app tab is closed. Non-blocking — failures are logged but ignored.
void registerServiceWorker();

// Never let a hung auth handshake keep the app on a blank screen (Firebase's
// web persistence layer can stall inside the iOS WKWebView).
const AUTH_READY_TIMEOUT_MS = 6000;

async function startApp() {
  try {
    await Promise.race([
      (async () => {
        await initAuthPersistence();
        await waitForAuthReady();
      })(),
      new Promise((resolve) => setTimeout(resolve, AUTH_READY_TIMEOUT_MS)),
    ]);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[AUTH_DEBUG] initAuthPersistence failed", error);
    }
  } finally {
    createRoot(document.getElementById("root")!).render(<App />);
  }
}

void startApp();
