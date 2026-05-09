import { test, expect } from "@playwright/test";

const redirects: Array<{ from: string; to: RegExp }> = [
  { from: "/terms", to: /\/legal\/terms$/ },
  { from: "/privacy", to: /\/legal\/privacy$/ },
  { from: "/disclaimers", to: /\/legal\/disclaimers$/ },
  { from: "/for-clinicians", to: /\/clinicians$/ },
];

test.describe("Legacy URL redirects", () => {
  for (const { from, to } of redirects) {
    test(`${from} redirects to ${to.source}`, async ({ page }) => {
      await page.goto(from);
      await expect(page).toHaveURL(to);
      await expect(page.getByRole("heading").first()).toBeVisible();
    });
  }
});
