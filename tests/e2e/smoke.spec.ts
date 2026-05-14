import { test, expect } from "@playwright/test";

const pages = [
  "/",
  "/about",
  "/resume",
  "/projects",
  "/projects/example-project",
  "/blog",
  "/blog/2025-01-15-hello-world",
  "/blog/category/%E6%8A%80%E6%9C%AF",
  "/blog/tag/TypeScript",
  "/journal",
  "/journal/tag/bug",
  "/now",
  "/skills",
  "/uses",
  "/search",
];

test.describe("Smoke tests", () => {
  for (const path of pages) {
    test(`page ${path} loads with status 200`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });
  }

  test("404 page returns for non-existent route", async ({ page }) => {
    const response = await page.goto("/non-existent-page");
    expect(response?.status()).toBe(404);
  });

  test("theme toggle switches theme", async ({ page }) => {
    await page.goto("/");

    // Initial theme should be set
    const initialTheme = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );
    expect(["light", "dark"]).toContain(initialTheme);

    // Find and click theme toggle button
    const toggleButton = page.locator("button[aria-label='切换主题']");
    await toggleButton.click();

    const newTheme = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );
    expect(newTheme).not.toBe(initialTheme);

    // localStorage should persist
    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe(newTheme);
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");

    // Click "Blog" link
    await page.click("a[href='/blog']");
    await expect(page).toHaveURL(/\/blog/);

    // Click "Projects" link
    await page.click("a[href='/projects']");
    await expect(page).toHaveURL(/\/projects/);
  });

  test("search page loads and has search input", async ({ page }) => {
    await page.goto("/search");

    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("type", "search");
  });

  test("RSS feed returns XML", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("xml");
  });
});
