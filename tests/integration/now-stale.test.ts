import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

describe("Now page stale banner", () => {
  it("now page exists", () => {
    const html = readFileSync(resolve(distDir, "now/index.html"), "utf-8");
    expect(html.length).toBeGreaterThan(100);
  });

  it("shows no stale banner when lastUpdated is recent", () => {
    const html = readFileSync(resolve(distDir, "now/index.html"), "utf-8");
    // lastUpdated is 2026-05-14 (today), should NOT show stale banner
    expect(html).not.toContain("内容可能已过时");
  });
});
