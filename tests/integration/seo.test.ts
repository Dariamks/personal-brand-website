import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
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

describe("SEO metadata", () => {
  it("all pages have unique <title>", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    const titles: string[] = [];
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      const match = html.match(/<title>(.*?)<\/title>/);
      if (match) titles.push(match[1]);
    }
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("all pages have meta description", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      expect(html).toContain('meta name="description"');
    }
  });

  it("all pages have og:title and og:description", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      expect(html).toContain("og:title");
      expect(html).toContain("og:description");
    }
  });

  it("all pages have twitter:card", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      expect(html).toContain("twitter:card");
    }
  });

  it("no public page has noindex", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      expect(html).not.toContain('content="noindex"');
    }
  });

  it("RSS links present on all pages", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      expect(html).toContain("/feed.xml");
      expect(html).toContain("/journal/feed.xml");
    }
  });
});
