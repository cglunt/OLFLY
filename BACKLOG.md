# Olfly BACKLOG

Owner: Abbey (product manager). Benjamin builds from the top of this list, one item per run, on a branch named `benjamin/<slug>`. Adam decides when something ships. Cynthia approves by reviewing the branch in GitHub Desktop and merging.

How this file works: one item per heading, in priority order. Each item has Why, Done when, Pointers, Status. An item marked **[needs Cynthia]** is blocked on something only she can do (a dashboard login, a credential, a decision) and Benjamin skips it. Abbey rewrites this file from the feedback form, store reviews, the support inbox and Cynthia's answers; nobody else edits it except to update Status.

Created 2026-10-28 from `docs/HANDOFF-ANDROID.md`, `docs/HANDOFF-CURRENT.md`, `COWORK_CONTEXT.md`, the Command Center plan.js recommendations and the git state on that day.

---

## 0. Repo hygiene **[needs Cynthia]**

Why: an agent must never start on a dirty tree or a side branch. As of 2026-10-28 the checkout is on `claude/security-deps-2026-10` (one commit ahead of `main`: "Update dependencies to fix critical and high security advisories") with uncommitted edits to `android/app/build.gradle`, `android/app/capacitor.build.gradle`, `android/capacitor.settings.gradle`, a deleted 5.9 MB gif in `attached_assets/`, and untracked `docs/HANDOFF-ANDROID.md`, `docs/HANDOFF-CURRENT.md`, `docs/app-icon-candidate.png`, `docs/store-screenshots/`.

Done when: the gradle edits are committed or discarded (they look like the Capacitor sync for the Android build), the docs are committed, the security branch is merged into `main`, `main` is pushed, and `git status` is clean on `main`.

Status: done 2026-10-29. The gradle edits (the Capacitor sync: local-notifications and revenuecat-purchases registered, versionCode 17 to match the build already on Play) and the gif deletion were committed on the security branch; the docs were committed with the July 26 release-night handoff as `docs/HANDOFF-ANDROID.md` and the July 25 version kept as `docs/HANDOFF-ANDROID-2026-07-25.md`; the branch was merged into `main` and pushed. The next Android build must use versionCode 18.

## 1. The product updates (two of them)

Cynthia's answer, 2026-10-29, verbatim: "There are two product updates I know planned... one was from today related to security. The other was simply planned for product improvements but not executed yet, I think to prioritize finishing deployment in Google Play store first. (we need 12 testers for 3 weeks before it can go live in the google play store)"

Priority she set: finish the Google Play deployment first (item 2), then these.

### 1a. Security release (Benjamin, then Adam)

Why: the Oct 28 security check found six critical dependency flaws in Olfly, the only live app with a server, accounts and payments. All six and the drizzle, nodemailer and zod highs are fixed in commit `89694e9` on branch `claude/security-deps-2026-10` (Capacitor 8.6.0, protobufjs 7.6.6, proxy-addr 2.0.8, tar 7.5.22, websocket-driver 0.7.5, drizzle-orm 0.45.4, drizzle-zod 0.8.3, zod 4.6.7, nodemailer 10.2.1). Typecheck, build and a local smoke test passed. Not pushed, not deployed. The Capacitor update means both mobile apps must be rebuilt and resubmitted; the uncommitted gradle edits in the working tree (versionCode 17, `capacitor.settings.gradle` listing local-notifications and revenuecat-purchases) look like the `npx cap sync android` from that update and belong with it.

Done when: the branch is merged into `main` and pushed (item 0); sign-in, a sandbox purchase and email are tested locally per the report; the web app is redeployed to Vercel; an Android AAB with a new versionCode (18 or higher; 17 is already on Play) is built with the upload keystore and uploaded to the closed track; iOS is rebuilt through Xcode Cloud and resubmitted. Left on purpose per the report: the `@grpc/grpc-js` highs (pinned by the Firebase SDK, not reachable from the browser or app builds) and the moderates that need `firebase-admin` 14.

Pointers: `F:\Security\reports\2026-10-28.md` (the findings and the evening update), `package.json` on the branch, `docs\HANDOFF-ANDROID.md` for the build and upload steps.

Status: code done on the branch. Blocked on item 0 (Cynthia merges and pushes), then Benjamin runs the local tests, Adam owns the rebuilds and uploads with Cynthia at the keyboard for the keystore and the stores.

### 1b. Planned product improvements **[needs Cynthia]**

Why: Cynthia says improvements were planned but not executed, deferred behind the Play Store launch. No list exists in the repo. Candidates found in the repo and the handoff docs, for her to confirm or replace:
- Push reminders on iOS through `@capacitor-firebase/messaging` (the July handoff's accepted v1 gap: APNs and FCM token mismatch; local notifications cover reminders today, so this may no longer matter).
- Server-side Plus enforcement on the symptom-log routes (item 4 below; a revenue leak, so already queued for Benjamin).
- The unmerged branch `claude/busy-yonath-212c72` (May 9 and 10): "Harden Android app for Play Store submission" and "Fix 4 type errors and add Playwright e2e suite". An end-to-end test suite would help every later item; the hardening may be superseded by what shipped since.
- Social proof on the landing page once real reviews exist (item 9).
- Whatever the feedback form and the first store reviews ask for (Abbey folds these in weekly).

Done when: Cynthia confirms the list (or gives her own), Abbey writes one spec per improvement, and they become items 1b-i, 1b-ii, ... for Benjamin, after item 2 ships.

Status: waiting for Cynthia's list; Abbey asked on the dashboard (question `q-olfly-improvements`).

## 2. Android closed test to production (Adam)

Why: iOS has been live since Aug 24; Android is stuck on the closed-testing gate, so half the market cannot pay.

Done when: 12 testers are opted in on the closed track through `https://play.google.com/apps/testing/com.olfly.app` (the internal link does not count; each tester's Play Store must be signed into the Gmail on the "Olfly User Testing" list), held continuously for the period Google requires, the production access application is submitted and approved, and the current build is rolled out to production. Google's published rule is 12 testers for 14 continuous days; Cynthia recalls 3 weeks. Adam tracks the count daily and we apply when the console says eligible, whichever it turns out to be.

What is already done (July 26, 2026 release night; the branch `claude/olfly-android-play-release-0c6697` holds the newer `docs/HANDOFF-ANDROID.md` that records it, and item 0 should bring that doc onto main): merchant account created; Play subscriptions `olfly_plus_monthly` ($6.99) and `olfly_plus_annual` ($49.99) active; RevenueCat Play app `app7c3c0984e1` with both products attached to entitlement `plus` and offering `default`; the `goog_` key in `client/.env` and baked into the versionCode 17 AAB; service account `revenuecat-play@olfly-a7e63.iam.gserviceaccount.com` with the three Play permissions and its JSON uploaded to RevenueCat; license testing enabled for the tester list; versionCode 17 promoted to Closed testing (Alpha) and submitted to Google review.

Still open, **[needs Cynthia]** (dashboards and credentials):
- Confirm in RevenueCat that the Play credentials show green (they were "need attention" pending propagation on July 26) and run a test purchase on a device with a license tester ("Test card, always approves"), then restore.
- After item 1a: build the Capacitor 8.6 AAB as versionCode 18 with the same upload keystore (lives outside the repo in `olfly-keystore`; never commit it), upload to Closed testing (Alpha), and run the on-device checklist (reminders prompt and fire, purchase, restore, Plus consistency, icon, paywall wording).
- Testers: as of 2026-08-24 the console counted 0 opted in, because testers had used the internal-test link. They need to opt in through the closed-test link above.
- When eligible: submit the production access application (Adam keeps the draft answers in `docs/PLAY-PRODUCTION-APPLICATION.md`).

Agent work (Adam): daily tester count, reminder emails to the Alpha list as proposals, the clock, and the application draft.

Status: open since 2026-08-24 (0 testers counted then).

## 3. Firebase production private key is corrupt **[needs Cynthia]**

Why: breaks account deletion and push. Must be regenerated in the Firebase console (project `olfly-a7e63`) and set in the Vercel environment; never patched in code.

Done when: account deletion works end to end on production and the key is only in Vercel env.

Status: open since 2026-08-25.

## 4. Enforce Plus on the server for symptom-log routes (Benjamin)

Why: the client hides the Journal for non-Plus users, but the API still accepts a symptom-log POST from anyone, so the paywall can be bypassed. Listed post-launch in the handoff; it is a revenue leak, so it moves up.

Done when: symptom-log write routes reject non-Plus users (entitlement from the RevenueCat webhook state `plusActive`) with a clear status code, existing Plus users are unaffected, and a test covers both cases.

Pointers: `server/` routes for symptom logs; `useSubscription.ts` for how the client decides; webhook `https://olfly.app/api/revenuecat/webhook` keeps `plusActive` in sync.

Status: open.

## 5. Serve robots.txt and sitemap.xml (Benjamin)

Why: the Vercel catch-all rewrite in `vercel.json` serves the app HTML for `/robots.txt` and `/sitemap.xml`, so search engines get nothing. Same pattern as `/feedback` and `/delete-account`, which already have explicit rewrites.

Done when: both files exist as static files, `vercel.json` rewrites them before the catch-all, `curl https://olfly.app/robots.txt` returns the text file, and the sitemap lists the public pages. Search Console verification is **[needs Cynthia]**.

Status: open.

## 6. Revoke the temporary RevenueCat secret API keys **[needs Cynthia]**

Why: two setup keys (`sk_mwd...` v1 and `sk_QWV...` v2) are still active. RevenueCat project settings, API keys.

Status: open.

## 7. Addresses and routing **[needs Cynthia]**

- Linda's Marblism prompt may still say `@olfly.com`; everything is `@olfly.app`.
- Confirm `feedback@olfly.app` routing in Cloudflare was saved.
- Gmail "Send mail as" for the olfly.app domain (deferred, post-launch).
- Dedicated sending mailbox on olfly.app with SPF, DKIM, DMARC and two weeks of warmup, before any provider outreach (Stan now, Harold later).

Status: open.

## 8. Verify the reminder fixes on an Android device

Why: the July fixes (no `@vite-ignore` on Capacitor imports; never return a raw plugin proxy from an async function) are verified on iOS Build 23 only.

Done when: the on-device checklist in `docs/HANDOFF-ANDROID.md` passes on Android. Part of item 2's test pass.

Status: open.

## 9. Social proof on the landing page

Why: `client/src/pages/Landing.tsx` has no testimonials or reviews section. Wait for real App Store reviews; never invent quotes.

Done when: a section shows real, attributed reviews with the reviewer's consent or the store's public text.

Status: deferred until reviews exist.

---

## Done and reference

- iOS live on the App Store since 2026-08-24 (v1.3.4, build 31; Apple ID 6789730576).
- `/feedback` page with the embedded beta feedback form (#25). `/delete-account` page.
- Security dependency update (branch `claude/security-deps-2026-10`, to merge under item 0).
- Gotchas that must not regress: never `return mod.SomePlugin` from an async function in a Capacitor app; never `/* @vite-ignore */` a Capacitor plugin import; env vars are baked at build time, rebuild after editing `.env`.
