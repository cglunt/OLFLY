import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initAuthPersistence, waitForAuthReady } from "./lib/firebase";
import { registerServiceWorker } from "./lib/notifications";

// TEMP diagnostic stage logging for the iOS blank-screen hunt. The __dbglog
// hook is installed by the temporary overlay script in index.html.
const dbg = (msg: string) => (window as any).__dbglog?.("BOOT", msg);

dbg("bootstrap module evaluated");

// Register the service worker early so push notifications work even when
// the app tab is closed. Non-blocking — failures are logged but ignored.
void registerServiceWorker();

const AUTH_READY_TIMEOUT_MS = 6000;

async function startApp() {
  try {
    // Never let a hung auth handshake keep the app on a blank screen: the
    // timeout covers the ENTIRE auth init, not just waitForAuthReady.
    await Promise.race([
      (async () => {
        dbg("initAuthPersistence...");
        await initAuthPersistence();
        dbg("waitForAuthReady...");
        await waitForAuthReady();
        dbg("auth ready");
      })(),
      new Promise((resolve) =>
        setTimeout(() => {
          dbg("auth init TIMED OUT after " + AUTH_READY_TIMEOUT_MS + "ms - rendering anyway");
          resolve(null);
        }, AUTH_READY_TIMEOUT_MS)
      ),
    ]);
  } catch (error: any) {
    dbg("startApp error: " + (error?.message || String(error)));
    if (import.meta.env.DEV) {
      console.warn("[AUTH_DEBUG] initAuthPersistence failed", error);
    }
  } finally {
    dbg("rendering React root...");
    createRoot(document.getElementById("root")!).render(<App />);
    dbg("render call completed");
  }
}

void startApp();
