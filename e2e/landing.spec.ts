import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the hero", async ({ page }) => {
    await expect(page).toHaveTitle(/olfly/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /wake up your/i
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /super sniffer/i
    );
  });

  test("nav exposes 'For Clinicians' and 'Start free' CTAs", async ({
    page,
    viewport,
  }) => {
    const isMobile = (viewport?.width ?? 1280) < 768;
    if (isMobile) {
      // Desktop nav is hidden under a hamburger on mobile; open it first.
      await page.locator("button.md\\:hidden").first().click();
      const mobileMenu = page.locator(".md\\:hidden").filter({
        has: page.getByTestId("mobile-nav-clinicians"),
      });
      await expect(mobileMenu.getByTestId("mobile-nav-clinicians")).toBeVisible();
      await expect(
        mobileMenu.getByRole("button", { name: /^start free$/i })
      ).toBeVisible();
    } else {
      await expect(page.getByTestId("nav-clinicians")).toBeVisible();
      await expect(page.getByTestId("nav-cta")).toBeVisible();
    }
  });

  test("hero CTA exists and is clickable", async ({ page }) => {
    const heroCta = page.getByTestId("hero-cta");
    await expect(heroCta).toBeVisible();
    await expect(heroCta).toContainText(/start free/i);
  });

  test("social icons link out to Instagram, Facebook, LinkedIn", async ({
    page,
  }) => {
    const ig = page.getByRole("link", { name: /instagram/i });
    const fb = page.getByRole("link", { name: /facebook/i });
    const li = page.getByRole("link", { name: /linkedin/i });

    await expect(ig).toHaveAttribute(
      "href",
      "https://www.instagram.com/olfly.app/"
    );
    await expect(fb).toHaveAttribute(
      "href",
      "https://www.facebook.com/profile.php?id=61580709514176"
    );
    await expect(li).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/olfly-app"
    );

    for (const link of [ig, fb, li]) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });

  test("clicking 'For Clinicians' navigates to /clinicians", async ({
    page,
    viewport,
  }) => {
    const isMobile = (viewport?.width ?? 1280) < 768;
    if (isMobile) {
      await page.locator("button.md\\:hidden").first().click();
      await page.getByTestId("mobile-nav-clinicians").click();
    } else {
      await page.getByTestId("nav-clinicians").click();
    }
    await expect(page).toHaveURL(/\/clinicians$/);
  });
});
