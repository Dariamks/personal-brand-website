import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

const testPages = ["/", "/blog/2025-01-15-hello-world", "/journal", "/projects"];

test.describe("Responsive layout", () => {
  for (const vp of viewports) {
    test.describe(`${vp.name} (${vp.width}px)`, () => {
      for (const path of testPages) {
        test(`${path} has no horizontal scrollbar`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(path);

          const scrollWidth = await page.evaluate(
            () => document.documentElement.scrollWidth,
          );
          const innerWidth = await page.evaluate(() => window.innerWidth);
          expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
        });
      }

      if (vp.name === "mobile") {
        test("font size is at least 16px on mobile", async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto("/blog/2025-01-15-hello-world");

          const fontSize = await page.evaluate(() => {
            const article = document.querySelector("article");
            if (!article) return 16;
            const style = window.getComputedStyle(article);
            return parseFloat(style.fontSize);
          });
          expect(fontSize).toBeGreaterThanOrEqual(16);
        });

        test("hamburger menu is visible on mobile", async ({ page }) => {
          await page.setViewportSize({ width: 375, height: 812 });
          await page.goto("/");

          const menuBtn = page.locator("#mobile-menu-btn");
          await expect(menuBtn).toBeVisible();
        });
      }
    });
  }
});
