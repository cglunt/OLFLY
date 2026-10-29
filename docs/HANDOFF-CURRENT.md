# Olfly iOS Submission — Current Handoff (updated 2026-07-25)

Continue-in-a-new-thread doc. **STATUS 2026-07-25: v1.3.4 (Build 23) SUBMITTED
to App Review — "Waiting for Review."** On-device verified: reminders enable +
fire, purchase works (fresh sandbox account), branded icon, Plus gating
consistent. PC user, **no Mac** — everything builds via **Xcode Cloud**.

Suggested opening prompt for the new thread:
> I'm continuing the Olfly iOS App Store submission (repo cglunt/OLFLY, PC user,
> no Mac — we build via Xcode Cloud). Read docs/HANDOFF-CURRENT.md. v1.3.4 /
> Build 23 is submitted and Waiting for Review — help me monitor the outcome
> and handle any rejection (check App Store Connect → Resolution Center).

---

## Where things stand

The iOS app went from completely broken (blank screen / crashes) to fully
working through a long debugging session. **All of these are fixed and
committed** on `main`:

- Firebase config now bundled into the iOS target (was missing → launch crash)
- Xcode Cloud CI set up: `ios/App/ci_scripts/ci_post_clone.sh` installs Node,
  writes `client/.env`, builds web, `npx cap sync ios`
- `VITE_API_BASE_URL=https://olfly.app` baked in (was blank → dead API calls)
- Firebase auth: use `initializeAuth` + `indexedDBLocalPersistence` on native;
  skip `setPersistence` (it hangs in the iOS WKWebView)
- RevenueCat purchase hang fixed: never resolve a promise with the Capacitor
  plugin proxy directly (iOS turns `await`'s `.then` probe into a native call).
  **Sandbox purchase verified working on device.**
- **Reminders now work on iOS** via `@capacitor/local-notifications`
  (on-device scheduled, fire when app closed). Re-enabled reminder UI on Home,
  Settings, onboarding. Web keeps its old behavior.
- Major design overhaul (Home round START button + rings, stacked stat circles,
  journal header, Settings subscription gradient, on-brand journal sliders,
  eucalyptus photo, branded loading spinner).

**Latest commit:** `1c517df`. **Build 23** (bundles all four 2026-07-25 fixes
below) is the build **submitted** on version 1.3.4. Old "build 1" was the broken
blue-X placeholder build — replaced.

---

## Session 2026-07-25 — fixes pushed (all on `main`, in Build 23)

1. **App icon** (`c6d9e08`) — replaced the generic Capacitor blue-X placeholder
   with the branded OLFLY icon (concentric rings + wordmark on navy). Source art
   was `F:\Olfly\Olfly_Appicon.png` (384×384, RGBA); prepped to 1024×1024, opaque,
   full-bleed (composited onto navy `rgb(14,13,29)`, corners squared for iOS
   masking) → `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`.
   User chose to keep the wordmark version.

2. **iOS reminders fixed** (`68b3a56`) — THE reminder toggle bug. The notification
   dynamic imports in `client/src/lib/notifications.ts` were marked
   `/* @vite-ignore */`, so Vite left bare specifiers
   (`import('@capacitor/local-notifications')`) in the bundle. iOS WKWebView can't
   resolve bare specifiers → import threw → plugin loader returned null →
   `requestNotificationPermission()` returned `'unsupported'` → toggle silently
   failed, no iOS system prompt. Fix: removed `@vite-ignore` from both notification
   imports (push + local) so Vite bundles them like the working RevenueCat/Firebase
   imports. **NECESSARY BUT NOT SUFFICIENT** — once the JS loaded, it hit the hang
   in fix #4. (Symptom changed: fail-fast → hang.)

3. **Plus entitlement consistency** (`9eb68cb`) — Settings showed "Free Plan" while
   the Journal page stayed unlocked for the same demo account. Cause: each
   `useSubscription` instance ran its own one-shot `getCustomerInfo` and held
   entitlement in local state, so pages could diverge. Fix: module-level subscriber
   set in `client/src/hooks/useSubscription.ts` — `applyCustomerInfo` now publishes
   to every mounted instance (latest check wins everywhere). Purely additive; no
   change to configure/purchase flow. NOTE: production free users are still
   correctly gated (a truly free user has `rcIsPlus=false` + `plusActive=false` on
   every page). The divergence only appeared with entitlement churn (sandbox /
   promotional grants).

4. **iOS reminder hang — THE actual reminder fix** (`1c517df`) — after fix #2 let
   the plugin JS load, tapping "Allow reminders" did *nothing* (dialog stuck, no
   prompt). Cause: `getLocalNotifications()` / `getCapacitorPush()` in
   `notifications.ts` returned the **raw Capacitor plugin proxy** from an async fn.
   Awaiting that resolved value probes `.then` on the proxy → iOS turns it into a
   native "then" call that never settles → `await getLocalNotifications()` hangs
   forever. This is the SAME proxy-hang `configurePurchases()` in
   `useSubscription.ts` already documents. Fix: wrap the plugin in a plain object
   (`{ LocalNotifications }`, `{ PushNotifications }`) and destructure at call
   sites. **Verified on Build 23 device: iOS permission prompt appears, toggle
   enables, reminders fire.** Lesson: never `return mod.SomePlugin` from an async
   fn on iOS — always wrap it.

### Resolved on 2026-07-25 (were open, now done)
- **App icon** → done (Build 23 attached; Included Assets shows OLFLY icon).
- **Screenshots** → 4 uploaded (dropped the "13% smell clarity" progress shot to
  avoid a 5.1.1 claim challenge).
- **Demo account** `demo@olfly.app` created; granted a **Lifetime** promotional
  `plus` entitlement in RevenueCat (customer `q6XQjwtDF6Xtma6WM74kvzbR1VA2`). NOTE:
  the RC dashboard entitlements widget lagged and showed "No current entitlements"
  even after the grant succeeded — the **on-device app** (Settings shows "Olfly
  Plus") is the source of truth, not the widget.
- **Subscription review screenshots** → both cleared "Missing Metadata". The ASC
  "Review Information → Screenshot" field requires an **exact device dimension**
  (portrait crop + 1024² both rejected as "wrong dimensions"). What worked:
  **1284×2778** (paywall scaled to width, padded top/bottom with bg `rgb(12,12,29)`).
  File: `F:\Olfly\Screenshots\paywall_review_1284x2778.png`.
- **Sign-in creds** filled in version page → App Review Information (User Name
  `demo@olfly.app` + password).
- **Purchase "failed" scare** → was a **sandbox artifact**: the test device's
  Sandbox Apple ID already owned an active Olfly Plus sub (customer `wljN…pRc2`,
  auto-renewing), so StoreKit refused a re-purchase. Confirmed harmless — a **fresh
  sandbox Apple ID purchases fine**. Reviewers use fresh accounts, so unaffected.
  RevenueCat confirmed offering "default" loads correctly (not a config bug).

### Open findings from 2026-07-25 (not code changes)
- **Paywall said "Google Play" on iOS** — only in the *web* screenshot build
  (394px capture). Code is correct: `UpgradePrompt.tsx:15` renders "the App Store"
  when `Capacitor.getPlatform()==='ios'`. **Recapture the subscription review
  screenshots on the real iPad**, not the web build.
- **Demo account** = `demo@olfly.app` (name "Apple Demo"), email/password. Signup
  has NO email-verification gate (`firebase.ts` uses
  `createUserWithEmailAndPassword`, never `sendEmailVerification`). Use
  email/password creds in App Review notes — NOT Google sign-in.
- **Symptom-log API routes still not server-side gated** (post-launch item,
  unchanged): client hides the Journal for non-Plus, but the server would accept a
  symptom-log POST. Not a review blocker.

---

## (original) Latest state before 2026-07-25

### Already done in App Store Connect
- App record, bundle id `com.olfly.app`, SKU `olfly-ios`, iPhone-only
- Subscriptions created: `olfly_plus_monthly` ($6.99), `olfly_plus_annual`
  ($49.99) in group "Olfly Plus", prices + localizations set
- Category Health & Fitness, subtitle, promo text, description, keywords, URLs,
  copyright, age rating (9+), content rights, **medical-device = No**
- App Privacy questionnaire **published**
- Pricing: Free; **EU deselected** (trader status deferred — see below)
- App Review contact info + notes filled (demo credentials still needed)
- Paid Apps agreement + banking submitted (verifying)

### Already done in RevenueCat (project `dd32bc9e`)
- App Store app `appad43ae2db2` (bundle `com.olfly.app`), In-App Purchase key
  connected
- Entitlement **`plus`** (`entl92804bc572`) with both products attached
- Offering **`default`** (`ofrng1fcec4df6f`): Monthly pkg → `olfly_plus_monthly`,
  Yearly pkg → `olfly_plus_annual`
- Webhook `https://olfly.app/api/revenuecat/webhook` + `REVENUECAT_WEBHOOK_SECRET`
  in Vercel — **verified 200**

---

## TODO to submit (in rough order)

1. **App icon** — ✅ DONE 2026-07-25 (branded OLFLY icon, commit `c6d9e08`). See
   "Session 2026-07-25" above.

2. **Upload screenshots** — 5 processed at **1284×2778** (the version's 6.5"
   slot) are in `docs/store-screenshots/` and `C:\Users\Cynthia\Downloads\
   olfly-screenshots\` (1_home … 5_library). The browser upload tool is
   restricted to user-attached files, so **the user must drag them** into the
   version page's Previews & Screenshots (iPhone) box, then Save. Source snips
   were low-res (~396×862) upscaled with PIL Lanczos + unsharp — acceptable for
   flat UI; swappable later. NOTE: the Progress shot shows "smell clarity
   increased 13%" — minor 5.1.1 risk; drop to 4 shots if a reviewer objects.

3. **Demo account for App Review** — user creates a fresh email+password account
   in the app, then in RevenueCat → Customers → that user → grant a promotional
   **`plus`** entitlement so reviewers see gated features. Put credentials in
   App Review notes.

4. **Subscription review screenshots** — both products still show "Missing
   Metadata" until each gets a review screenshot of the paywall. Blocks
   submission. Use a paywall screenshot (Library/Journal paywall; user is Plus
   so may need the demo account or an earlier iPad photo).

5. **Attach the latest build** (Build 19+) to version 1.3.4 on the version page
   (Build section → currently shows build 1). Only appears after Apple finishes
   processing (~15–60 min after the Xcode Cloud build uploads).

6. **Verify on device** (TestFlight, Build 19): reminders actually fire (set a
   time a couple minutes out, background the app), redesign looks right,
   purchase + restore still work.

7. **Add for Review** — attach the two subscriptions to the submission, final
   sweep, submit.

---

## Post-launch (not blockers)
- Server-side Plus enforcement on symptom-log API routes (webhook has been live)
- EU availability + DSA trader status: needs a document tying user's name to an
  address (PO box is shared / no proof yet). Ship non-EU now, add later.
- **Delete temporary RevenueCat secret API keys** created during setup
  (`sk_mwd…` v1 and `sk_QWV…` v2) — Project settings → API keys.
- Push-based reminders code still present but unused on iOS (local notifications
  supersede it); fine to leave.

## Key facts
| Item | Value |
|---|---|
| Bundle ID | `com.olfly.app` |
| ASC app id | 6789730576 |
| Version / target | 1.3.4, iPhone-only, iOS 15+ |
| Firebase project | `olfly-a7e63` |
| RevenueCat iOS public key | `appl_XPZvDvyKnEYdPHAVdrqfRSSZkKO` |
| Xcode Cloud | workflow "Default" on `main` → Archive → App Store Connect → TestFlight "Testers" group |
| Build env vars (set in Xcode Cloud workflow) | `VITE_API_BASE_URL=https://olfly.app`, `VITE_FIREBASE_API_KEY/PROJECT_ID/APP_ID`, `VITE_REVENUECAT_IOS_KEY` |
| Server CORS allowlist | includes `http://localhost:5000` and `:3000` (NOT 3100) |

## Local screenshot setup (temporary, in this repo's working tree — uncommitted)
- `.claude/launch.json` → runs a static server (scratchpad `static-server.cjs`)
  on **port 5000** serving `dist/public`, no-cache headers, no service worker.
- To rebuild a "looks-like-iOS" screenshot build, patch (then revert) in the
  build: avatar `photoURL` → false (dead link in browser), paywall STORE_NAME →
  "the App Store", and swap `void registerServiceWorker()` for SW-unregister.
  Use Chrome DevTools device mode (iPhone 14 Pro Max) + Ctrl+Shift+P → "Capture
  screenshot" for true-res captures (avoid Win+Shift+S snips).
- Service-worker caching bit hard during this session — serving on port 5000
  (fresh origin, no SW) + no-store headers is the reliable workaround.
