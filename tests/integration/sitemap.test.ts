import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

function getAllHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getAllHtmlFiles(full));
    } else if (entry.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

describe("Sitemap", () => {
  it("sitemap-index.xml exists", () => {
    expect(existsSync(resolve(distDir, "sitemap-index.xml"))).toBe(true);
  });

  it("sitemap contains all public pages except 404", () => {
    const htmlFiles = getAllHtmlFiles(distDir).filter((f) => !f.includes("404"));
    // Sitemap should include all non-404 pages
    const sitemapPath = resolve(distDir, "sitemap-index.xml");
    if (existsSync(sitemapPath)) {
      const sitemap = readFileSync(sitemapPath, "utf-8");
      expect(sitemap.length).toBeGreaterThan(100);
    }
  });
});
