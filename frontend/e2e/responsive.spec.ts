import { test, expect } from "@playwright/test";

const pages = ["/login", "/projects"];

for (const url of pages) {
  test(`pas de scroll horizontal sur ${url}`, async ({ page }) => {
    await page.goto(url);
    const body = await page.locator("body").evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(body.scrollWidth).toBeLessThanOrEqual(body.clientWidth + 1);
  });
}