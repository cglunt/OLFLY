# Olfly — Android / Google Play Release Handoff

Last updated: **2026-07-26, 12:30 AM** (end of the big release night).
iOS v1.3.4 / Build 23 is in App Review and untouched by any of this.

## Where things stand

| Thing | State |
|---|---|
| Internal testing | **versionCode 17** (1.3.4), released Jul 26 12:07 AM |
| Reminder fix | ✅ **VERIFIED ON DEVICE** — permission prompt shows, "We'll remind you at 8:00 PM" schedules |
| Merchant account | ✅ created (payments profile "Olfly", statement name OLFLY) |
| Play subscriptions | ✅ `olfly_plus_monthly` (base plan `monthly`, $6.99) and `olfly_plus_annual` (base plan `annual`, $49.99) — both **Active**, 177 regions |
| RevenueCat Play app | ✅ `Olfly (Play Store)`, package `com.olfly.app`, app id `app7c3c0984e1` |
| RevenueCat key | ✅ `goog_bWpjrlOGwqxWQbkuYXnCDCOdkYc` in `client/.env` as `VITE_REVENUECAT_ANDROID_KEY`, verified baked into the v17 AAB |
| RC products | ✅ `olfly_plus_monthly:monthly` + `olfly_plus_annual:annual`, both attached to entitlement `plus` (4 products total incl. iOS) |
| RC offering | ✅ `default` (current): Monthly pkg + Play monthly, Annual pkg + Play annual — iOS products untouched |
| Purchase test | ❌ "Purchase failed / issue with your configuration" — **expected**, see below |
| Closed testing – Alpha | still on 15 — promote 17 after purchase verifies |

## Why purchases don't work YET (and what fixes them)

The on-device error ("There is an issue with your configuration") is the store
returning no product. Two known, expected causes, both time/credential gated —
**nothing on our side is misconfigured** (ids verified char-for-char against
`useSubscription.ts`, products Active, offering current, key in the binary):

1. **No service-account credentials in RevenueCat yet** — RC cannot validate
   with Google until the JSON is uploaded. This is the main remaining task.
2. **Play propagation lag** — subscriptions were created ~1h before the test and
   the first billing-enabled build (17) went live ~25 min before. Google says
   new products can take several hours to become purchasable.

## ✅ COMPLETED 2026-07-26 (morning session)

Everything below in "Remaining tasks" is DONE:
- Service account `revenuecat-play@olfly-a7e63.iam.gserviceaccount.com` created
  in GCP project `olfly-a7e63` (deliberately NOT reusing the auto-created
  `firebase-adminsdk` account — that identity belongs to the web backend).
- Play Console: invited with exactly the three needed permissions (view app
  info, view financial data, manage orders and subscriptions; Admin NOT granted).
- JSON key uploaded to RevenueCat → "Credentials need attention" shown until
  Google propagation completes (expected, up to ~24h, usually less).
- License testing: the shared "Olfly User Testing" email list enabled — all
  testers get test payment methods (no real charges).
- `mcglunt12@gmail.com` added to the shared tester list (serves internal +
  closed + license testing).
- v17 promoted to Closed testing – Alpha → submitted to Google review.
- Internal-testing join link: https://play.google.com/apps/internaltest/4701104676406264998

**Only remaining:** wait for propagation → RC credentials go green → test
purchase on device (billing sheet should show "Test card, always approves") →
verify Plus unlocks + restore. If "issue with your configuration" persists
>24h: recheck credentials in RC (refresh icon), clear Play Store cache on
device, or edit a subscription description in Play to force a resync.

## Remaining tasks (original list — all done, kept for reference)

1. **Google Cloud Console** — project `olfly-a7e63` (the Firebase project):
   enable **Google Play Android Developer API**, create a **service account**
   (no GCP roles needed), create a **JSON key** and download it. User-only —
   credentials.
2. **Play Console → Users and permissions** → invite the service-account email →
   grant: view app information, view financial data, **manage orders and
   subscriptions**.
3. **RevenueCat → Apps → Olfly (Play Store)** → upload the JSON under Service
   Account Credentials. The products' "Could not check" badges should clear.
4. Wait out propagation (minutes–36h; editing any subscription's description in
   Play Console forces a re-sync). Meanwhile:
   - **Play Console → Settings (account level) → License testing** → add the
     test Google account so purchases don't charge real money.
5. **Retest purchase on device**: paywall → tap plan → Play billing sheet →
   complete → "Welcome to Olfly Plus 🎉". Failure decoder:
   | On tap | Meaning |
   |---|---|
   | "Billing not available" toast | key missing / web not rebuilt (should not happen — key verified in v17) |
   | "issue with your configuration" | store returned no product — creds/propagation, wait or clear Play Store cache |
   | "No monthly package found" | offering not current or package missing (verified OK tonight) |
   | Billing sheet opens | wired correctly |
6. Also verify: **Restore purchases**, and Settings vs Journal agree on Plus.
7. **Promote 17 → Closed testing – Alpha** (same bundle, no rebuild).
   Internal outranks closed in tester precedence, so a device opted into both
   sees the internal build — check the installed versionCode before judging any
   test.

## Signing (solved tonight — keep this knowledge)

- Upload keystore: **`F:\GitHub\olfly-keystore`** (PKCS12, no file extension),
  alias **`olfly-key`**, created 2026-03-22. A copy also sits at
  `C:\Users\Cynthia\Documents\GitHub\olfly-keystore` — Android Studio's
  remembered path; keep both, add an off-machine backup.
- The 16-char password is saved in the user's Google Doc AND remembered by
  Android Studio (wizard auto-fills when the keystore path is the C:\ one).
- Upload-key cert SHA-256 (must match any future AAB):
  `C8:8B:23:57:E2:E0:7D:B3:3A:7A:AD:DB:6F:7F:69:5C:67:98:A0:AC:66:1D:E1:31:3A:2F:A5:A7:14:5C:4E:91`
- Play App Signing is ON → upload-key reset exists as a recovery path.
- `android/app/build.gradle` now reads `android/key.properties`
  (see `key.properties.example`); absent → builds unsigned with a loud warning.
  Practical flow tonight was the Android Studio wizard, which needs no
  key.properties.
- First `signReleaseBundle` failure was transient (likely antivirus on the
  fresh output dir) — a plain retry succeeded. Remember before debugging.

## Build facts

- versionCode **17** / versionName 1.3.4 committed. Next upload must be ≥18.
- Build from the **main checkout** (`C:\Users\Cynthia\Documents\GitHub\OLFLY`),
  not a worktree — a stale worktree `node_modules` makes `cap sync` write
  `../../../../node_modules/...` paths into tracked gradle files.
- `cap sync android` must report **4 plugins** (firebase-authentication,
  local-notifications, push-notifications, purchases-capacitor).
- Env vars bake at build time — rebuild web after any `.env` change.
- R8 keeps all plugin classes (verified against `mapping.txt`); the
  `-keep` rules in `app/proguard-rules.pro` + library consumer rules suffice.
- Play requires an uploaded billing-enabled build before subscriptions can be
  created at all — that gate is behind us (16+).

## Decisions made tonight (don't relitigate)

- **Exact alarms: shipped without them.** Inexact `setAndAllowWhileIdle` drift
  (minutes) accepted for a daily reminder. A "2 min out" smoke test can look
  late — that's Doze batching, not a bug.
- **Payments profile:** existing personal (Individual) profile, public name
  "Olfly". Public name/statement editable later; profile country/type are not.
- Prices are hardcoded USD strings in the UI (`UpgradePrompt.tsx:123,144`,
  `Settings.tsx:284,292`, `Landing.tsx:63`) — so Play prices must stay exactly
  $6.99/$49.99. Paywall rendering prices proves nothing about billing.

## Post-launch backlog

- W-9 / tax info in the payments profile (gates payouts, Google will nag).
- Enroll in the **15% service fee tier** (Play Console notification) — free
  margin.
- Server-side Plus enforcement on symptom-log API routes (both platforms).
- Localize prices via `pkg.product.priceString` instead of hardcoded `$6.99`.
- Delete leftover RevenueCat secret keys from iOS setup (`sk_mwd…`, `sk_QWV…`).
- Debug-symbols warning on Play uploads (cosmetic, crash-report quality).
- Production access needs **12 closed testers for 14 days** — currently 1
  tester. Plan recruitment before any public launch.
