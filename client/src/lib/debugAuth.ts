export function isAuthDebugEnabled(): boolean {
  if (import.meta.env.DEV) return true;
  try {
    return window.localStorage.getItem("DEBUG_AUTH") === "1";
  } catch {
    return false;
  }
}

export function debugAuthLog(message: string, payload?: Record<string, unknown>) {
  if (!isAuthDebugEnabled()) return;
  if (payload) {
    console.log(message, payload);
    return;
  }
  console.log(message);
}
