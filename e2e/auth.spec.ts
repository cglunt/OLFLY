import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test("renders welcome heading and Google CTA", async ({ page }) => {
    await page.goto("/launch/login");
    await expect(
      page.getByRole("heading", { name: /welcome to olfly/i })
    ).toBeVisible();
    await expect(page.getByText(/continue with google/i)).toBeVisible();
  });
});

test.describe("Auth-gated route protection", () => {
  // Without Firebase credentials in this test environment, useAuth treats the
  // user as unauthenticated. Visits to /launch/* (other than /launch/login)
  // must redirect to the login page.
  const protectedRoutes = [
    "/launch",
    "/launch/training",
    "/launch/library",
    "/launch/progress",
    "/launch/journal",
    "/launch/learn",
    "/launch/settings",
    "/launch/onboarding",
  ];

  for (const route of protectedRoutes) {
    test(`${route} redirects unauthenticated users to /launch/login`, async ({
      page,
    }) => {
      await page.goto(route);
      // The redirect happens after Firebase auth resolves. Wait for it.
      await page.waitForURL(/\/launch\/login$/, { timeout: 10_000 });
      await expect(
        page.getByRole("heading", { name: /welcome to olfly/i })
      ).toBeVisible();
    });
  }
});
