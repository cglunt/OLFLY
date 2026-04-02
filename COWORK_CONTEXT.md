# Olfly — Cowork Session Context
**Project:** olfly.app — olfactory training app for smell loss recovery
**Owner:** Cynthia (cglunt11@gmail.com)
**Date:** April 1, 2026
**Repo location (in Cowork):** The selected folder IS the project root — `/sessions/.../mnt/OLFLY/`

---

## Tech Stack
- **Frontend:** React + TypeScript, Wouter routing, TanStack Query, Framer Motion, Tailwind CSS
- **Auth:** Firebase
- **Build:** Vite (`@assets` alias points to `attached_assets/`)
- **Backend:** Express (Node)
- **Hosting:** Cloudflare (DNS + Pages/Workers)
- **App target:** iOS + Android via Capacitor (not yet set up — see Pending)

---

## Brand Colors (exact)
| Name | Hex | Used For |
|------|-----|----------|
| Deep Navy | `#0C0C1D` | Page/screen background |
| Dark Purple | `#3B1645` | Cards, panels, section headers |
| Violet | `#6D45D2` | Gradient start, borders, badges |
| Magenta | `#DB2FAA` | Gradient end, CTAs, highlights |
| App Purple | `#AC41C3` | In-app buttons, sidebar, active states |
| White | `#FFFFFF` | Primary text |

**Signature gradient:** `#6D45D2 → #DB2FAA` (left to right, used on hero headings, CTAs, stats)

---

## What Was Completed This Session

### 1. Social Media Icons — Landing Page
- Added filled Instagram, Facebook, LinkedIn SVG icons to `client/src/pages/Landing.tsx`, just above the footer
- Links: Instagram (`olfly.app`), Facebook (profile ID `61580709514176`), LinkedIn (`olfly-app`)
- Icons use `fill="currentColor"`, `text-white/50 hover:text-white`
- **Removed** from `Contact.tsx` and `Home.tsx` (app pages) — icons are website-only

### 2. Legal Pages Updated
- `client/src/pages/Terms.tsx` — full rewrite from legal-reviewed document, effective March 15, 2026, California governing law, Apple/Google auto-renewal billing details, email fixed to `support@olfly.app`
- `client/src/pages/Privacy.tsx` — full rewrite, effective March 15, 2026, covers: data collected, local vs cloud storage, children's privacy (under 13), your rights, third-party links, email fixed to `support@olfly.app`
- **Note:** Linda in Marblism still had `@olfly.com` — may need to update her system prompt

### 3. AI Team Operations Guide — Version 2.0
**File:** `Olfly_AI_Team_Operations_Guide.docx` (in project root)
**Script:** `olfly_doc/create.js` — run `node create.js` from that folder to regenerate

#### What's in v2.0:
- **Section 1:** Company Overview + full Founder Story (Cynthia's illness/smell loss narrative)
- **Section 2:** Brand Voice & Style Guide — updated Visual Style Guide with real color swatches (all 5 brand colors with hex values), brand gradient, typography rules, what to avoid
- **Section 3:** Rachel (Virtual Receptionist) — coaching box: PACING, OVER-THANKING (max 4x per call), EMAIL CAPTURE ACCURACY, CALENDAR PRIVACY
- **Section 4:** Olfly Support
- **Section 5:** Stan (Sales) — US/Canada geography focus noted
- **Section 6:** Sonny (Social Media) — founder story context added
- **Section 7:** Eva — NEW (Executive Assistant, Gmail/Calendar, Inbox Zero, 9 AM daily reminder)
- **Section 8:** Penny — NEW (SEO Blog Writer, blog pipeline table with 5 posts, keywords)
- **Section 9:** Linda — NEW (Legal Associate, Documents Maintained table, escalation rules)
- **Section 10:** Competitive Landscape — NEW (AbScent, Smellow, SmellSense, SmellTaste.org.uk with Olfly counter-moves and SEO strategy)
- **Section 11:** Future AI Team Members (YouTube Creator — Penny promoted out of this section)
- **Cover page:** Olfly logo (concentric rings icon) + "OLFLY" wordmark in brand purple
- **Colors:** All updated to match brand palette (DARK_PURPLE `#3B1645` for headers/table fills, PURPLE `#AC41C3` for accents)

---

## Marblism AI Team — Current Status (reviewed in session)
All 6 agents are active on Marblism:

| Agent | Role | Notes |
|-------|------|-------|
| Rachel | Virtual Receptionist | Over-thanking issue acknowledged by Rachel at 1:28 AM. Also: speaks too fast, email capture error (cblunt11 vs cglunt11), calendar privacy. **Rachel booked a Zoom with Sandra (wellness educator, scent workshops) Thursday 12 PM Pacific — confirm this!** |
| Stan | Sales | ~7 leads so far, US/Canada focus question still open |
| Sonny | Social Media Manager | Has founder story. LinkedIn + Facebook posts drafted, ready to review/approve |
| Eva | Executive Assistant | Gmail + Calendar access. Inbox Zero protocol. 9 AM daily reminder |
| Penny | Blog Writer | Ran competitor SEO research. "My Journey Back to Scent" blog post drafted — publish button visible, needs review/tweaks |
| Linda | Legal Associate | Documents: Terms, Privacy Policy, NDA template. May still have `@olfly.com` in her system prompt — needs fixing to `@olfly.app` |

---

## Pending Launch Tasks (Punch List)

### 🔴 Critical Blockers
1. **Capacitor setup** — npm-based iOS/Android wrapper. Core blocker for app store submission. Not started.
2. **Push notifications** — needs native testing with Capacitor on a real device

### 🟡 Important Pre-Launch
3. **App store screenshots** — Cynthia has some; more marketing versions in progress
4. **Eucalyptus stock photo** — file path needs updating in `client/src/lib/data.ts`
5. **feedback@olfly.app routing** — unclear if Cloudflare "Save" was completed. Needs confirmation.
6. **Linda's system prompt** — check/fix `@olfly.com` → `@olfly.app`

### 🟢 Content / Marketing
7. **Sonny's founder story posts** — LinkedIn + Facebook drafts ready, need Cynthia's approval to publish
8. **Penny's blog post** — "My Journey Back to Scent" ready to publish, needs final tweaks
9. **Stan geography decision** — US/Canada only (~7 leads) or stay global?
10. **Thursday 12 PM Zoom with Sandra** — booked by Rachel (wellness educator, scent workshops). Confirm on calendar.

### ⏳ Deferred (Post-Launch)
11. **Gmail "Send mail as"** — olfly.app domain in Gmail send-from
12. **Social proof / testimonials** — landing page section

---

## Key File Locations
```
/client/src/pages/Landing.tsx        — Website home (social icons, hero, footer)
/client/src/pages/Terms.tsx          — Terms of Service (updated March 2026)
/client/src/pages/Privacy.tsx        — Privacy Policy (updated March 2026)
/client/src/pages/Home.tsx           — App home screen
/client/src/pages/Contact.tsx        — App contact page
/client/src/index.css                — All CSS variables and brand theme
/client/src/lib/data.ts              — Static content data (scent images, exercises)
/olfly_doc/create.js                 — Script to regenerate the AI Team Ops Guide docx
/Olfly_AI_Team_Operations_Guide.docx — v2.0 final output (run create.js to regenerate)
```

---

## Quick Notes for Next Session
- The app enforces dark mode only — `.light` class in index.css maps to same dark theme
- The `@assets` Vite alias resolves to `attached_assets/` — use it for image imports
- Marblism has no MCP connector — use Claude in Chrome to access it (it's usually open in a browser tab)
- The docx guide is generated programmatically — always edit `create.js`, then run `node create.js` to rebuild. Validate with: `python /sessions/.../mnt/.skills/skills/docx/scripts/office/validate.py`
