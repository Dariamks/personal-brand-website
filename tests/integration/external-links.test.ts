import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");
const siteUrl = "http://localhost:4321";

function getAllExternalLinks(
  html: string,
): { href: string; target: string; rel: string }[] {
  const linkRegex = /<a\s+[^>]*href="([^"]*)"[^>]*>/g;
  const targetRegex = /target="([^"]*)"/;
  const relRegex = /rel="([^"]*)"/;
  const results: { href: string; target: string; rel: string }[] = [];

  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (
      href.startsWith("http") &&
      !href.includes("localhost") &&
      !href.includes("example.com")
    ) {
      const fullTag = match[0];
      results.push({
        href,
        target: (fullTag.match(targetRegex) || [])[1] || "",
        rel: (fullTag.match(relRegex) || [])[1] || "",
      });
    }
  }
  return results;
}

describe("External links", () => {
  it("all external links have target=_blank and rel=noopener", () => {
    const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
    const links = getAllExternalLinks(html);
    for (const link of links) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toContain("noopener");
    }
  });
});
