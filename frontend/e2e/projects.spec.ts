import { test, expect, type Page } from "@playwright/test";

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.fill("#login-email", email);
  await page.fill("#login-password", password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard\/.+/);
}

test("créer un projet", async ({ page }) => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const projectName = `Projet E2E ${day}${month}${year}`;

    await login(page, "alice@example.com", "P@ssword123");

    await page.goto("/projects");
    await page.click("text=+ Créer un projet");

    await page.fill('[data-testid="project-name"]', projectName);
    await page.fill('[data-testid="project-description"]', "Description E2E");

    await page.click('[data-testid="contributor-select"]');
    await page.locator('[data-testid="contributor-option"]').first().check();
    await page.click('[data-testid="project-name"]'); // ferme le dropdown

    await page.click('[data-testid="project-submit"]');

    await expect(page.getByRole("link", { name: projectName })).toBeVisible();
});