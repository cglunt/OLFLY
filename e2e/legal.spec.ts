import { test, expect } from "@playwright/test";

test.describe("Legal pages", () => {
  test("Terms shows updated date and support email", async ({ page }) => {
    await page.goto("/legal/terms");
    await expect(
      page.getByRole("heading", { name: /terms of service/i })
    ).toBeVisible();
    await expect(page.getByText(/Last updated:\s*March 15, 2026/i)).toBeVisible();
    await expect(page.getByText(/support@olfly\.app/)).toBeVisible();
    await expect(page.getByText(/@olfly\.com\b/)).toHaveCount(0);
  });

  test("Privacy shows effective date and support email", async ({ page }) => {
    await page.goto("/legal/privacy");
    await expect(
      page.getByRole("heading", { name: /privacy policy/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Effective Date:\s*March 15, 2026/i)
    ).toBeVisible();
    await expect(page.getByText(/support@olfly\.app/).first()).toBeVisible();
    await expect(page.getByText(/@olfly\.com\b/)).toHaveCount(0);
  });

  test("Legal index lists all six policy pages", async ({ page }) => {
    await page.goto("/legal");
    await expect(
      page.getByRole("heading", { name: /^legal$/i })
    ).toBeVisible();
    for (const label of [
      /terms of use/i,
      /privacy policy/i,
      /medical disclaimer/i,
      /affiliate disclosure/i,
      /essential oil safety/i,
      /contact and support/i,
    ]) {
      await expect(page.getByText(label).first()).toBeVisible();
    }
  });

  test.describe("each legal sub-page renders", () => {
    const pages = [
      { path: "/legal/disclaimers", heading: /disclaimer/i },
      { path: "/legal/affiliate", heading: /affiliate/i },
      { path: "/legal/safety", heading: /safety/i },
      { path: "/legal/contact", heading: /contact/i },
    ];

    for (const { path, heading } of pages) {
      test(path, async ({ page }) => {
        const response = await page.goto(path);
        expect(response?.ok()).toBeTruthy();
        await expect(page.getByRole("heading").first()).toBeVisible();
        await expect(page.getByRole("heading").first()).toContainText(heading);
      });
    }
  });

  test("Cookie policy renders", async ({ page }) => {
    const response = await page.goto("/cookie-policy");
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
