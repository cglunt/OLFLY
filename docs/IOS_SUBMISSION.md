# Olfly — App Store Submission Prep

Status as of 2026-07-10. The codebase is iOS-ready; what remains is store/console
setup (doable from any browser) and the build/upload steps that require a Mac.

---

## Already done in the codebase (no Mac needed)

- iOS Xcode project scaffolded (`ios/`), with app icon, splash, and
  `GoogleService-Info.plist` (bundle id `com.olfly.app` ✓)
- RevenueCat hook is platform-aware: uses `VITE_REVENUECAT_IOS_KEY` on iOS,
  `VITE_REVENUECAT_ANDROID_KEY` on Android; packages matched store-agnostically
- Paywall (`UpgradePrompt`) shows the correct store name per platform, includes
  auto-renewal disclosure, and links to Terms of Use + Privacy Policy
  (required by App Review 3.1.2)
- "Manage subscription" in Settings opens Apple's subscription page on iOS
- `Info.plist`: `ITSAppUsesNonExemptEncryption=false` (skips the export-compliance
  question on every upload) and `UIBackgroundModes: remote-notification`
- `AppDelegate.swift`: APNs registration forwarded to the Capacitor
  PushNotifications plugin
- iOS version set to 1.3.4 (build 1), matching Android
- Target set to iPhone-only (`TARGETED_DEVICE_FAMILY = 1`) so iPad screenshots
  and iPad-layout review are not required for v1. Revert to `"1,2"` later if
  you want native iPad support.
- Server RevenueCat webhook is store-agnostic (works for App Store events too —
  same `plus` entitlement, same Firebase-UID `app_user_id`)

---

## Part A — Do from your PC browser BEFORE the Mac session

Doing these first means the Mac session is purely build → sign → upload.

1. **Apple Developer Program** — make sure the account ($99/yr) is active and
   you can sign in at https://appstoreconnect.apple.com.

2. **App Store Connect → create the app record**
   - My Apps → “+” → New App
   - Platform iOS, Name **Olfly**, primary language English (U.S.)
   - Bundle ID **com.olfly.app** (register it first at
     https://developer.apple.com/account/resources/identifiers if it isn't
     listed — enable *Push Notifications* and *In-App Purchase* capabilities
     on the identifier)
   - SKU: `olfly-ios`

3. **App Store Connect → subscriptions**
   - Monetization → Subscriptions → create one subscription group “Olfly Plus”
   - Add two auto-renewable subscriptions, product IDs **exactly**:
     - `olfly_plus_monthly` — 1 month — $6.99
     - `olfly_plus_annual` — 1 year — $49.99
   - Each needs a display name, description, and a review screenshot
     (a screenshot of the paywall is fine — you can grab it later from TestFlight)

4. **RevenueCat dashboard**
   - Project Olfly → Apps → add an **App Store** app (bundle id `com.olfly.app`)
   - Add the **In-App Purchase Key** (App Store Connect → Users and Access →
     Integrations → In-App Purchase) and the **App-Specific Shared Secret**
   - Import the two iOS products; attach both to the existing **`plus`**
     entitlement and to the **`default`** offering ($rc_monthly / $rc_annual
     packages)
   - Copy the **iOS public API key** (starts with `appl_`)
   - If not done yet: Integrations → Webhooks → endpoint
     `https://olfly.app/api/revenuecat/webhook`, and set the same secret as
     `REVENUECAT_WEBHOOK_SECRET` in the server env. **The webhook now rejects
     all events until this env var is set.**

5. **APNs key → Firebase** (for push reminders)
   - https://developer.apple.com/account/resources/authkeys → create a key with
     the *Apple Push Notifications service* enabled → download the `.p8`
   - Firebase console → Project settings → Cloud Messaging → Apple app →
     upload the `.p8` with its Key ID and your Team ID

6. **Repo env** — add to the client build environment (e.g. `.env`):
   ```
   VITE_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxx
   ```
   Commit/push everything so the Mac can pull it.

---

## Part B — Mac session (Codex does most of this)

Prereqs on the Mac: Xcode (latest), Node 20+, signed into Xcode with your
Apple ID (Xcode → Settings → Accounts) — that sign-in is the one step Codex
can't do for you.

### Paste-ready Codex prompt

```
You are preparing the Olfly Capacitor app for App Store upload on this Mac.
Repo: https://github.com/<user>/OLFLY (clone or pull latest main).

Context: the iOS project already exists in ios/ and is submission-prepped:
version 1.3.4 build 1, bundle id com.olfly.app, iPhone-only target,
Info.plist has UIBackgroundModes remote-notification and
ITSAppUsesNonExemptEncryption=false, AppDelegate forwards APNs registration.
Do NOT change app code, versions, or the paywall.

Steps:
1. npm ci
2. Create .env with the VITE_ Firebase vars and both RevenueCat keys
   (VITE_REVENUECAT_ANDROID_KEY, VITE_REVENUECAT_IOS_KEY) — I will paste values.
3. npm run build   (web assets must build with the iOS RC key present)
4. npx cap sync ios
5. Open ios/App in Xcode (npx cap open ios). In Signing & Capabilities for the
   App target: select my team, keep bundle id com.olfly.app, signing Automatic.
   Add capabilities: "Push Notifications" and "In-App Purchase" (this creates
   App.entitlements with aps-environment; make sure CODE_SIGN_ENTITLEMENTS is
   set for both Debug and Release).
6. Build to the iOS Simulator first and confirm the app launches to the login
   screen with no crash (check the Xcode console for Firebase init errors).
7. Product → Archive (Any iOS Device, arm64) → Organizer → Distribute App →
   App Store Connect → Upload, using automatic signing.
8. Report the upload result and any warnings verbatim.

If archiving via CLI instead: 
  xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release \
    -destination 'generic/platform=iOS' -archivePath build/App.xcarchive archive
  then export with -exportOptionsPlist (method app-store-connect, automatic signing)
  and upload with `xcrun altool --upload-app` or Transporter.
Use the workspace if it exists, otherwise the project file.
```

### Sanity tests while you still have the Mac (recommended, ~15 min)

- Run on the simulator: sign in, open Settings → subscription card shows
  “the App Store” wording, paywall shows Terms/Privacy links.
- If you have time for a device + sandbox tester (App Store Connect → Users →
  Sandbox): buy monthly on TestFlight/dev build, confirm the "Welcome to Olfly
  Plus" toast, then Restore purchases works after reinstall.

---

## Part C — After upload (back on your PC)

1. **TestFlight**: the build appears in App Store Connect after processing
   (~15–60 min). Install via TestFlight on any iPhone and smoke-test login,
   training session, paywall, purchase (sandbox), restore.
2. **App Privacy questionnaire** (required before submit). Data collected:
   - Email address + user ID (account) — linked to identity, not tracking
   - Health-adjacent user content (symptom logs, training history) — linked,
     not tracking
   - Purchases (subscription status via RevenueCat) — linked, not tracking
   - No ads, no tracking across apps → answer “No” to tracking
3. **Screenshots**: iPhone 6.9" (1320×2868) required — take on an iPhone 16 Pro
   Max simulator, or resize from your device captures. 3–5 covering: training
   session, progress chart, journal, library, paywall (optional).
4. **App listing**: description, keywords, support URL, marketing URL,
   privacy policy URL (https://olfly.app/legal/privacy).
5. **Review notes + demo account**: App Review needs a working login — create
   a dedicated demo account (with Plus enabled via the DB flag so they can see
   gated features) and put the credentials in the review notes. Mention:
   “Subscriptions are processed by RevenueCat/StoreKit; the symptom journal is
   wellness tracking, not medical advice.”
6. **Age rating + category**: Health & Fitness; the medical disclaimer
   (“does not guarantee results”) is already on the paywall — make sure the
   description avoids medical-treatment claims (App Review 5.1.1 is picky
   about smell-training recovery language; frame as “training/wellness”).
7. Submit for review.

---

## Known gaps / decisions

- **Push reminders on iOS will not fire in v1.** The server sends via Firebase
  Cloud Messaging tokens, but on iOS the Capacitor push plugin registers a raw
  APNs token, which FCM's admin SDK can't address. Fix for a later release:
  migrate the client to `@capacitor-firebase/messaging` (returns FCM tokens on
  both platforms) or send iOS pushes via APNs directly. Reminders still work
  on Android and web. This does not block review — just don't advertise
  reminders in the iOS listing yet.
- **Server-side Plus enforcement** is still pending (see session notes):
  once the RevenueCat webhook has been live for a while, add a `requirePlus`
  check to the symptom-log API routes.
- **Google sign-in on iOS**: the REVERSED_CLIENT_ID URL scheme is already
  registered in Info.plist (done during prep). If Google login still fails in
  the simulator, check that the OAuth client in the Google Cloud console has
  the iOS bundle id `com.olfly.app` registered.
