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

describe("Image attributes", () => {
  it("all img elements have alt attribute", () => {
    const htmlFiles = getAllHtmlFiles(distDir);
    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf-8");
      const imgRegex = /<img\s+[^>]*>/g;
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        const tag = match[0];
        expect(tag).toContain("alt=");
      }
    }
  });
});
