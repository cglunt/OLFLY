# Capacitor Installation Notes
_To be completed after the punch list is resolved._

---

## 1. Install Packages

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npm install @capacitor/push-notifications
```

## 2. Initialize Capacitor

```bash
npx cap init
```

Prompts:
- **App Name:** Olfly
- **App Package ID:** com.olfly.app _(or your chosen bundle ID)_

## 3. Update `capacitor.config.ts`

Set `webDir` to match Vite's output path:

```ts
const config: CapacitorConfig = {
  appId: 'com.olfly.app',
  appName: 'Olfly',
  webDir: 'dist/public',   // ← Olfly-specific
  server: {
    androidScheme: 'https'
  }
};
```

## 4. Add Native Platforms

```bash
npx cap add android
npx cap add ios
```

## 5. Run First Build + Sync

```bash
npm run build
npx cap sync
```

## 6. Firebase Console — Register Native Apps

In the Firebase Console (console.firebase.google.com), add both platforms to the existing project:

- **Android:** package name = `com.olfly.app` → download `google-services.json` → place in `android/app/`
- **iOS:** bundle ID = `com.olfly.app` → download `GoogleService-Info.plist` → add to Xcode project under the `App` target

## 7. Enable FCM in Firebase Console

- Go to **Project Settings → Cloud Messaging**
- Confirm that Firebase Cloud Messaging API (V1) is enabled
- For iOS: upload your **APNs Auth Key** (.p8 file from Apple Developer portal) under **Project Settings → Cloud Messaging → Apple app configuration**

## 8. Code Notes (Already Done)

The following code changes were made during punch list and are ready to go:

- `client/src/lib/firebase.ts` — `signInWithGoogle()` uses `signInWithRedirect` on native, `signInWithPopup` on web. `handleRedirectResult()` is exported and wired into `useAuth.ts`.
- `client/src/lib/notifications.ts` — `@capacitor/push-notifications` is imported dynamically (safe if not yet installed). Subscribe/unsubscribe routes through native FCM path on Capacitor, web push on browser.
- `server/firebase-admin.ts` — `getFirebaseMessaging()` is exported and ready.
- `server/routes.ts` — `POST/DELETE /api/push/register-token` endpoints live. Cron job sends both VAPID and FCM.
- `shared/schema.ts` — `fcm_tokens` table defined. Run `npm run db:push` after install to migrate.

## 9. Database Migration

After Capacitor is set up and the app is connected to the database:

```bash
npm run db:push
```

This will create the `fcm_tokens` table in Neon.

## 10. Apple IAP / Stripe (Section 1.3) — Current Status: ✅ No action needed yet

As of the punch list, there is **no Stripe checkout UI inside the app**. The Settings page already shows "Upgrade via the App Store or Google Play" for free users. No payment routes exist in `routes.ts`.

**When you build the payment flow (future work), follow this rule:**
- **`/` landing page and web-only flows:** Stripe checkout is fine.
- **Inside the native app (`/launch/*`):** must use Apple IAP / Google Play Billing — no Stripe.

**How to enforce this when the time comes:**
```tsx
// Example guard — only show Stripe upgrade button on web
{!isNativePlatform() && <StripeUpgradeButton />}
{isNativePlatform() && <NativeUpgradeButton />}  // Apple IAP / Play Billing
```

The `isNativePlatform()` helper already exists in `client/src/lib/firebase.ts` and `client/src/lib/notifications.ts`. Extract it to a shared `client/src/lib/platform.ts` utility when the payment flow is built.
