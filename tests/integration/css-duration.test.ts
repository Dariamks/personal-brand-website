import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

function walkCss(dir: string): string[] {
  const files: string[] = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkCss(full));
    } else if (entry.endsWith(".css")) {
      files.push(full);
    }
  }
  return files;
}

describe("CSS animation durations", () => {
  it("all transition/animation durations are ≤ 300ms", () => {
    const cssFiles = walkCss(distDir);
    for (const file of cssFiles) {
      const css = readFileSync(file, "utf-8");
      const durationRegex = /(?:transition|animation)-duration:\s*([\d.]+)(m?s)/g;
      let match;
      while ((match = durationRegex.exec(css)) !== null) {
        let ms = parseFloat(match[1]);
        if (match[2] === "s") ms *= 1000;
        expect(ms).toBeLessThanOrEqual(300);
      }
    }
  });
});
