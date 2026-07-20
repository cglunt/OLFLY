// TEMP diagnostic entry for the iOS blank-screen hunt: loading the real app
// through a dynamic import means module-evaluation errors reject the import
// promise with a REAL error object (WKWebView masks module <script> errors as
// anonymous "Script error."). Restore direct bootstrap once diagnosed.
function bootFail(stage: string, err: any) {
  const detail =
    (err && (err.message || String(err))) +
    (err && err.stack ? "\n" + String(err.stack).slice(0, 900) : "");
  const log = (window as any).__dbglog;
  if (log) {
    log("BOOT FAIL " + stage, detail);
  } else {
    const el = document.createElement("pre");
    el.style.cssText =
      "position:fixed;top:0;left:0;right:0;background:#300;color:#f88;padding:12px;z-index:2147483647;white-space:pre-wrap;font-size:11px";
    el.textContent = "BOOT FAIL " + stage + ": " + detail;
    document.body.appendChild(el);
  }
}

import("./bootstrap").catch((e) => bootFail("import", e));
