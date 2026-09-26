import { test, expect } from "@playwright/test";

test("se connecter avec email/mot de passe", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[id="login-email"]', "alice@example.com");
  await page.fill('input[id="login-password"]', "P@ssword123");
  await page.click('button[type="submit"]');

  await page.waitForURL(/\/dashboard\/.+/);

  const url = page.url();
  expect(url).toMatch(/\/dashboard\/[a-z0-9]+/);
});