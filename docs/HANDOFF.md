# Handoff — Olfly iOS App Store submission (Mac day)

**Date:** 2026-07-10 · **Repo:** github.com/cglunt/OLFLY · **Branch:** main @ `4487eaf`
**Goal today:** get an iOS build uploaded to App Store Connect using a borrowed Mac
(limited time) with OpenAI Codex CLI doing the heavy lifting.

Companion doc: [IOS_SUBMISSION.md](IOS_SUBMISSION.md) has the full submission
playbook (store consoles, privacy questionnaire, screenshots). This doc is the
"what to do today, in order" version.

---

## Where things stand

Everything code-side is DONE, committed, and pushed (`4487eaf` on main):

- Olfly Plus subscriptions via RevenueCat (monthly $6.99 / annual $49.99),
  paywall on Journal + Library, pricing in Settings
- Hook picks the RevenueCat key by platform: `VITE_REVENUECAT_IOS_KEY` on iOS
- Paywall has Apple-required Terms/Privacy links + auto-renew disclosure
- Server webhook `/api/revenuecat/webhook` hardened — **rejects everything until
  `REVENUECAT_WEBHOOK_SECRET` is set in the server env** (Vercel)
- iOS project prepped: version 1.3.4 (build 1), bundle id `com.olfly.app`,
  iPhone-only, push background mode, encryption-exempt flag, Google sign-in
  URL scheme, APNs callbacks in AppDelegate, `GoogleService-Info.plist` present

**Known gaps (accepted for v1, don't burn Mac time on these):**
- Push reminders won't fire on iOS (APNs vs FCM token mismatch) — fix later
  with `@capacitor-firebase/messaging`; don't mention reminders in the iOS listing
- Server-side Plus enforcement on symptom-log API routes — add after the
  webhook has been live a while

---

## TODAY — in order

### Step 0 · Before touching the Mac (PC browser, ~45 min)

Do these first if not already done — the Mac build needs #3's key:

1. **App Store Connect** (appstoreconnect.apple.com): create the app —
   iOS, name "Olfly", bundle ID `com.olfly.app` (register the identifier at
   developer.apple.com/account/resources/identifiers with Push Notifications +
   In-App Purchase enabled if it's not in the dropdown), SKU `olfly-ios`.
2. **Subscriptions**: in the app record → Monetization → Subscriptions →
   group "Olfly Plus" → two auto-renewable products, IDs **exactly**
   `olfly_plus_monthly` ($6.99/mo) and `olfly_plus_annual` ($49.99/yr).
3. **RevenueCat** (app.revenuecat.com): add an App Store app to the Olfly
   project (bundle `com.olfly.app`), connect the In-App Purchase key + shared
   secret from App Store Connect, import the two products, attach both to the
   existing `plus` entitlement and the `default` offering.
   **Copy the iOS public API key (`appl_…`) — you need it in Step 2.**
4. **APNs key** (developer.apple.com → Keys): create a key with Apple Push
   Notifications enabled, download the `.p8`, upload to Firebase console →
   Project settings → Cloud Messaging → Apple app (with Key ID + Team ID).
5. **Sandbox tester**: App Store Connect → Users and Access → Sandbox →
   add a test Apple ID (for purchase testing in Step 4).

### Step 1 · Mac setup (~10 min, manual — Codex can't do these)

1. Confirm Xcode is installed and current (App Store → Xcode → Update).
2. Xcode → Settings → Accounts → sign in with the Apple Developer Apple ID.
3. Confirm Node 20+: `node -v` (install via nodejs.org pkg if missing).
4. `git clone https://github.com/cglunt/OLFLY.git && cd OLFLY`

### Step 2 · Create `.env` on the Mac (~5 min)

Copy `.env.example` to `.env` and fill in **at minimum** the `VITE_` values the
web bundle needs (same values as your PC/Vercel env), including:

```
VITE_REVENUECAT_ANDROID_KEY=goog_…   (from RevenueCat)
VITE_REVENUECAT_IOS_KEY=appl_…       (from Step 0.3)
+ the VITE_FIREBASE_* values from your existing .env / Vercel project settings
```

Easiest: copy the whole `.env` from your PC (`C:\Users\Cynthia\Documents\GitHub\OLFLY\.env`)
via USB/airdrop-alternative and add the new `VITE_REVENUECAT_IOS_KEY` line.

### Step 3 · Run Codex (~30-60 min)

Paste the prompt from **IOS_SUBMISSION.md → Part B → "Paste-ready Codex prompt"**
into Codex on the Mac. Summary of what it does:

1. `npm ci` → `npm run build` → `npx cap sync ios`
2. Opens Xcode; sets signing team (Automatic), adds Push Notifications +
   In-App Purchase capabilities (creates App.entitlements)
3. Simulator smoke test (launches to login, no Firebase crash)
4. Product → Archive → Organizer → Distribute → App Store Connect → Upload

Watch for these manual moments:
- Xcode signing: pick YOUR team in the dropdown (Codex can't; it's tied to
  your Apple ID login from Step 1)
- First archive may prompt for keychain access → "Always Allow"
- Upload succeeds ⇒ you're done with the Mac for the critical path

### Step 4 · While still on the Mac, if time remains (~20 min, optional)

- Wait for the build to finish processing (App Store Connect → TestFlight,
  ~15–60 min), install via TestFlight on an iPhone if one's available
- Sign in with the **sandbox tester** when purchasing — verify the paywall
  purchase + "Welcome to Olfly Plus" toast + Restore purchases
- Grab iPhone screenshots while you have iOS running (need 6.9" / 1320×2868 —
  iPhone 16 Pro Max simulator: `Cmd+S` saves screenshots)

### Step 5 · Back on the PC (any time after)

Follow **IOS_SUBMISSION.md → Part C**: App Privacy questionnaire (answers
pre-filled in the doc), screenshots, listing copy, demo account in review
notes, submit for review.

Also (server, not Mac): set `REVENUECAT_WEBHOOK_SECRET` in Vercel env when you
create the webhook in RevenueCat — subscriptions won't sync to the DB until then.

---

## Key facts (for the new chat / Codex)

| Item | Value |
|---|---|
| Bundle ID | `com.olfly.app` |
| iOS version / build | 1.3.4 / 1 |
| Target | iPhone-only (`TARGETED_DEVICE_FAMILY = 1`) |
| Deployment target | iOS 15.0 |
| Stack | Capacitor 8 (SPM, not CocoaPods) + React/Vite, `webDir: dist/public` |
| Subscription products | `olfly_plus_monthly` $6.99, `olfly_plus_annual` $49.99 |
| RevenueCat entitlement / offering | `plus` / `default` |
| Webhook | `https://olfly.app/api/revenuecat/webhook` (Authorization = shared secret) |
| Firebase iOS config | `ios/App/App/GoogleService-Info.plist` (already in repo) |
| Legal URLs | `https://olfly.app/legal/terms`, `https://olfly.app/legal/privacy` |

## Suggested opening prompt for the new chat

> I'm submitting Olfly (Capacitor iOS app, repo cglunt/OLFLY) to the App Store
> today using a borrowed Mac. Read docs/HANDOFF.md and docs/IOS_SUBMISSION.md
> in the repo, then walk me through today's steps one at a time, starting from
> [Step 0 / Step 1 / wherever I am]. I'm a PC user — assume I don't know Mac/Xcode
> conventions.
