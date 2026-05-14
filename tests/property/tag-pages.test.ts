import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

describe("Tag and category pages", () => {
  it("blog category page exists for 技术 category", () => {
    const path = resolve(distDir, "blog/category/技术/index.html");
    expect(existsSync(path)).toBe(true);
  });

  it("blog tag page exists for TypeScript", () => {
    const path = resolve(distDir, "blog/tag/TypeScript/index.html");
    expect(existsSync(path)).toBe(true);
  });

  it("blog tag page exists for Web", () => {
    const path = resolve(distDir, "blog/tag/Web/index.html");
    expect(existsSync(path)).toBe(true);
  });

  it("journal tag page exists for bug", () => {
    const path = resolve(distDir, "journal/tag/bug/index.html");
    expect(existsSync(path)).toBe(true);
  });

  it("journal tag page exists for reading", () => {
    const path = resolve(distDir, "journal/tag/reading/index.html");
    expect(existsSync(path)).toBe(true);
  });

  it("category page contains filtered content heading", () => {
    const html = readFileSync(
      resolve(distDir, "blog/category/技术/index.html"),
      "utf-8",
    );
    // The category page should show content related to this category
    expect(html.length).toBeGreaterThan(1000);
    expect(html).toContain("技术");
  });

  it("tag page contains tag label in heading or filter", () => {
    const html = readFileSync(
      resolve(distDir, "blog/tag/TypeScript/index.html"),
      "utf-8",
    );
    expect(html.length).toBeGreaterThan(1000);
    expect(html).toContain("TypeScript");
  });

  it("blog index links to tag pages", () => {
    const html = readFileSync(resolve(distDir, "blog/index.html"), "utf-8");
    expect(html).toContain('/blog/tag/TypeScript"');
    expect(html).toContain('/blog/tag/Web"');
  });

  it("journal index links to tag pages", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    expect(html).toContain('/journal/tag/bug"');
    expect(html).toContain('/journal/tag/reading"');
  });

  it("each tag/category page is a valid HTML document", () => {
    const pages = [
      "blog/category/技术/index.html",
      "blog/tag/TypeScript/index.html",
      "blog/tag/Web/index.html",
      "journal/tag/bug/index.html",
      "journal/tag/reading/index.html",
    ];

    for (const page of pages) {
      const html = readFileSync(resolve(distDir, page), "utf-8");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
      expect(html).toContain("<main");
    }
  });
});
