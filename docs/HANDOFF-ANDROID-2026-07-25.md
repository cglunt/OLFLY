# Olfly — Android / Google Play Deployment Handoff (2026-07-25)

Continue-in-a-new-thread doc for **finishing the Android release**. The iOS
submission is done (v1.3.4 / Build 23 submitted to App Review — see
`docs/HANDOFF-CURRENT.md`). Android is **behind**: the build on Play predates
all the 2026-07-25 bug fixes.

PC user, **no Mac needed** — Android builds locally on Windows.

Suggested opening prompt for the new thread:
> I'm finishing the Olfly **Android / Google Play** release (repo cglunt/OLFLY,
> Windows, no Mac). Read `docs/HANDOFF-ANDROID.md` for full state. Help me
> resolve the RevenueCat Android blocker, rebuild the AAB, and upload to the
> Play closed-testing track.

---

## Current state

| Thing | State |
|---|---|
| Play track | **Closed testing – Alpha**, release "Initial closed test release" |
| Live on Play (testers) | **versionCode 15**, versionName 1.3.4, uploaded **Jun 10 2026** |
| Internal testing | versionCode 14 (1.3.4), Apr 2 2026 |
| Production | **Not published** |
| Repo `versionCode` | **16** (already bumped — ready for next upload) |
| Repo `versionName` | 1.3.4 |

**The Play build (code 15) is from Jun 10 — it predates every fix below.** Its
reminders are broken in the same way iOS's were.

---

## What's already done in the repo (on `main`, ready to build)

All committed and pushed. Latest commit: `9da27ec`.

1. **Reminder fixes (shared code — Android benefits too)**
   - `68b3a56` — removed `/* @vite-ignore */` from the notification dynamic
     imports in `client/src/lib/notifications.ts`. With it, Vite left bare
     specifiers (`import('@capacitor/local-notifications')`) in the bundle,
     which a WebView can't resolve → import threw → permission request returned
     `'unsupported'`.
   - `1c517df` — **the actual fix**: `getLocalNotifications()` /
     `getCapacitorPush()` returned the **raw Capacitor plugin proxy** from an
     async function. Awaiting that probes `.then` on the proxy, which the native
     layer turns into a "then" call that never settles → permanent hang. Now
     wrapped in a plain object (`{ LocalNotifications }`) and destructured at
     call sites.
   - **Verified working on iOS device (Build 23). Not yet verified on Android.**
2. **Plus entitlement consistency** (`9eb68cb`) — `client/src/hooks/useSubscription.ts`
   now publishes entitlement to a module-level subscriber set so every mounted
   `useSubscription` agrees (Settings vs Journal could previously diverge).
3. **Branded Android launcher icon** (`9da27ec`) — replaced the placeholder at
   all densities (`mipmap-*/ic_launcher.png`, `_round.png`, `_foreground.png`),
   adaptive background switched from `@mipmap/ic_launcher_background` to a solid
   color `@color/ic_launcher_background` = **`#0E0D1D`** (navy). Deleted the stray
   single-density `mipmap-xxxhdpi/ic_launcher_background.png`.
   Source art: `F:\Olfly\Olfly_Appicon.png`.
4. **versionCode 15 → 16** (`9da27ec`) in `android/app/build.gradle`. Play
   rejects an upload whose code isn't greater than the last one.

---

## 🚨 BLOCKERS — resolve before Android purchases can work

### 1. RevenueCat has NO Android/Play app configured
Checked 2026-07-25: RevenueCat project `dd32bc9e` → **Apps** lists **only**
`Olfly iOS` (`appad43ae2db2`, `com.olfly.app`). There is **no Play Store app**,
therefore **no `goog_…` public API key exists yet**.

To fix (in RevenueCat dashboard):
1. **Apps → Add app → Google Play Store**, application id `com.olfly.app`.
2. Connect Play: upload the **Play service-account credentials JSON** (create in
   Google Cloud console for the Play project, grant it access in Play Console →
   Users and permissions). RevenueCat needs this to validate purchases.
3. Import/create the products **`olfly_plus_monthly`** and **`olfly_plus_annual`**
   for the Play app.
4. Attach both to the existing entitlement **`plus`** (`entl92804bc572`).
5. Add them to the existing offering **`default`** (`ofrng1fcec4df6f`) — Monthly
   package → monthly product, Yearly package → annual product.
6. Copy the Android **public** API key (`goog_…`) for step 2 below.

Also confirm the **subscriptions exist in Play Console** itself (Monetize with
Play → Subscriptions) with the same product ids and prices ($6.99 / $49.99).

### 2. `client/.env` is missing the RevenueCat Android key
`client/.env` currently contains only:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
VITE_API_BASE_URL
```
Android resolves its key like this (`useSubscription.ts`):
```js
const RC_API_KEY = Capacitor.getPlatform() === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;
```
With `VITE_REVENUECAT_ANDROID_KEY` undefined, every purchase path short-circuits
(`if (!isNative || !RC_API_KEY)`) → the app shows **"Billing not available"** and
entitlements never load. **Add before building:**
```
VITE_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxxx
```
`client/.env` is gitignored (`.gitignore:7`) — it is a **local** file, and the
Android build is local, so this must be set on the build machine. (iOS doesn't
hit this: Xcode Cloud writes its own `client/.env` from workflow env vars in
`ios/App/ci_scripts/ci_post_clone.sh`.)

> Vite bakes env vars in **at build time** — you must rebuild the web app after
> changing `.env`, not just re-sync.

---

## Build & upload steps (Windows)

```bash
git pull
```

1. **Verify `client/.env`** has all five keys (the four above **plus**
   `VITE_REVENUECAT_ANDROID_KEY`) and that `VITE_API_BASE_URL=https://olfly.app`.
   A blank API base URL is what originally broke iOS (dead API calls).
2. **Build web + sync native:**
   ```bash
   npm run build && npx cap sync android
   ```
   `cap sync` should report 4 plugins: firebase-authentication,
   local-notifications, push-notifications, purchases-capacitor.
3. **Build the signed AAB.** Either:
   - **Android Studio** → *Build → Generate Signed Bundle / APK → Android App Bundle*, or
   - ```bash
     cd android && ./gradlew bundleRelease
     ```
     (`android/app/build.gradle` has **no `signingConfig`** in the release block,
     so a raw `bundleRelease` produces an *unsigned* bundle — use the Android
     Studio wizard, or add a signing config / `key.properties`.)
4. ⚠️ **Use the SAME upload keystore as versionCode 15.** A different signing key
   is rejected by Play. No keystore is committed to this repo (and
   `android/.gitignore` has the `*.jks` / `*.keystore` lines **commented out**, so
   be careful **not** to commit one).
5. **Upload:** Play Console → **Test and release → Testing → Closed testing
   (Alpha)** → *Create new release* → upload
   `android/app/build/outputs/bundle/release/app-release.aab` → roll out.

---

## On-device test checklist (Android)

The iOS session proved these are the risky paths:

- [ ] **Reminders** — Settings → Daily Reminders ON → permission prompt appears →
      toggle enables. (Android 13+ requires the runtime `POST_NOTIFICATIONS`
      permission — confirm the prompt actually shows.)
- [ ] **Reminder fires** — set a time ~2 min out, background the app, confirm the
      notification arrives.
- [ ] **Purchase** — paywall opens, Play billing sheet appears, purchase completes,
      Plus unlocks. Use a **Play license tester** account.
- [ ] **Restore purchases** works.
- [ ] **Plus consistency** — Settings and Journal agree on Plus status.
- [ ] **Branded launcher icon** shows (not the placeholder).
- [ ] **Paywall wording** — Android correctly shows "Google Play" (iOS shows "the
      App Store"); logic in `client/src/components/UpgradePrompt.tsx:15`.

---

## Key facts

| Item | Value |
|---|---|
| Application ID | `com.olfly.app` |
| versionCode / Name | **16** / 1.3.4 |
| Play track | Closed testing – Alpha (prod not published) |
| Firebase project | `olfly-a7e63` |
| `android/app/google-services.json` | **present** ✅ |
| RevenueCat project | `dd32bc9e` |
| RC entitlement | `plus` = `entl92804bc572` |
| RC offering | `default` = `ofrng1fcec4df6f` |
| RC Android app | ❌ **not created yet** (blocker #1) |
| Product ids | `olfly_plus_monthly` ($6.99), `olfly_plus_annual` ($49.99) |
| Webhook | `https://olfly.app/api/revenuecat/webhook` (+ `REVENUECAT_WEBHOOK_SECRET` in Vercel) — already live, keeps `plusActive` in sync |
| Adaptive icon bg color | `#0E0D1D` |

---

## Gotchas worth remembering (learned the hard way on iOS)

- **Never `return mod.SomePlugin` from an async fn** in a Capacitor app — awaiting
  a raw plugin proxy hangs forever. Always wrap: `return { SomePlugin: mod.X }`.
  This bit both RevenueCat (`configurePurchases`) and notifications.
- **Never `/* @vite-ignore */` a Capacitor plugin import** — it leaves an
  unresolvable bare specifier in the bundle.
- **Env vars are baked in at build time.** Rebuild after editing `.env`.
- **Sandbox/test-account weirdness is normal**: on iOS a purchase "failed" only
  because that store account already owned an active subscription; a fresh test
  account worked. Expect the same class of confusion with Play license testers.
- The **on-device app is the source of truth**, not the RevenueCat dashboard
  widgets (the entitlements widget lagged badly during the iOS session).

---

## Post-launch / not blockers

- **Server-side Plus enforcement** on symptom-log API routes — the client hides
  the Journal for non-Plus users, but the server still accepts a symptom-log POST.
  Applies to both platforms.
- **Delete the temporary RevenueCat secret API keys** created during iOS setup
  (`sk_mwd…` v1 and `sk_QWV…` v2) — Project settings → API keys.
- Push-notification code still present but unused (local notifications supersede
  it); harmless.
