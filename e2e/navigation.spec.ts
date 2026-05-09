import { test, expect } from "@playwright/test";

test.describe("Public navigation", () => {
  test("/clinicians renders clinician hero", async ({ page }) => {
    await page.goto("/clinicians");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/clinicians/i);
  });

  test("/pricing renders the landing page", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /wake up your/i
    );
  });

  test("Unknown route shows 404 page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(
      page.getByRole("heading", { name: /page not found/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /go home/i })).toBeVisible();
  });

  test("404 'Go Home' button returns to landing", async ({ page }) => {
    await page.goto("/another-bad-route");
    await page.getByRole("button", { name: /go home/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /wake up your/i
    );
  });
});

test.describe("Mobile viewport (Pixel 5 project)", () => {
  test("Landing renders without horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });
    // Allow 1px tolerance for sub-pixel rendering.
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});
