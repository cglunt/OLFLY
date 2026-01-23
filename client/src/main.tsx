import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { auth, onAuthChange, initRedirectResult, waitForAuthReady } from "./lib/firebase";

console.log("[AUTH_PROBE] location=", window.location.pathname);

try {
  const storageOk = {
    localStorage: typeof window.localStorage !== "undefined",
    sessionStorage: typeof window.sessionStorage !== "undefined",
  };
  console.log("[AUTH_PROBE] storage available", storageOk);
} catch (error) {
  console.warn("[AUTH_PROBE] storage check failed", error);
}

console.log("[AUTH_PROBE] cookie length", document.cookie.length);

onAuthChange((user) => {
  console.log("[AUTH_PROBE] onAuthStateChanged", {
    hasUser: !!user,
    uid: user?.uid,
    email: user?.email,
  });
});

async function startApp() {
  try {
    await initRedirectResult();
    await waitForAuthReady();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[AUTH_DEBUG] initRedirectResult failed", error);
    }
  } finally {
    createRoot(document.getElementById("root")!).render(<App />);
  }
}

void startApp();
