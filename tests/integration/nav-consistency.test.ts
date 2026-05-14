import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, basename } from "path";

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

describe("Navigation consistency", () => {
  it("all pages have a <nav> element", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      expect(html).toContain("<nav");
    }
  });

  it("all pages have a <footer> element", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      expect(html).toContain("<footer");
    }
  });

  it("all pages have a <main> element", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      expect(html).toContain("<main");
    }
  });

  it("nav contains the 7 primary links in order", () => {
    const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
    const navSection = html.slice(html.indexOf("<nav"), html.indexOf("</nav>"));
    const navOrder = [
      "Home",
      "About",
      "Resume",
      "Projects",
      "Blog",
      "Journal",
      "Now",
    ];
    let lastIdx = -1;
    for (const label of navOrder) {
      const idx = navSection.indexOf(label);
      expect(idx).toBeGreaterThan(lastIdx);
      lastIdx = idx;
    }
  });
});
