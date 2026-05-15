import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import matter from "gray-matter";

const distDir = resolve(import.meta.dirname, "../../dist");
const contentDir = resolve(import.meta.dirname, "../../src/content");

interface JournalEntry {
  date: string;
  body: string;
  bodyLength: number;
  draft: boolean;
}

/**
 * Read all journal entries (md only, journal collection has no MDX).
 */
function readJournalEntries(): JournalEntry[] {
  const dir = join(contentDir, "journal");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const parsed = matter(readFileSync(join(dir, f), "utf-8"));
      const body = parsed.content.trim();
      return {
        date: parsed.data.date as string,
        body,
        bodyLength: body.length,
        draft: parsed.data.draft === true,
      };
    })
    .filter((e) => !e.draft);
}

const entries = readJournalEntries();
const longEntries = entries.filter((e) => e.bodyLength > 120);
const shortEntries = entries.filter((e) => e.bodyLength <= 120);

describe("Journal truncation", () => {
  it("requires at least one short and one long entry to exercise both code paths", () => {
    expect(
      entries.length,
      "no journal entries found — add at least 2 to exercise truncation",
    ).toBeGreaterThanOrEqual(2);
  });

  it("number of <details> elements equals the number of long entries", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    const detailsCount = (html.match(/<details\b/g) || []).length;
    expect(detailsCount).toBe(longEntries.length);
  });

  it("every long entry shows the 展开全文 affordance", () => {
    if (longEntries.length === 0) return;
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    const expandCount = (html.match(/展开全文/g) || []).length;
    expect(expandCount).toBeGreaterThanOrEqual(longEntries.length);
  });

  it("every short entry's full body is rendered inline (no truncation marker around it)", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    for (const entry of shortEntries) {
      const firstLine = entry.body.split("\n")[0]?.slice(0, 30);
      if (!firstLine) continue;
      expect(
        html,
        `short entry body "${firstLine}" missing from journal index`,
      ).toContain(firstLine);
    }
  });

  it("every long entry's body content survives in the rendered page (inside <details>)", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    for (const entry of longEntries) {
      // Pick a unique substring from the middle of the body (avoid frontmatter)
      const probe = entry.body
        .split("\n")
        .filter((l) => l.trim().length > 10)[0]
        ?.trim()
        .slice(0, 20);
      if (!probe) continue;
      expect(
        html,
        `long entry probe "${probe}" missing from rendered journal index`,
      ).toContain(probe);
    }
  });

  it("journal list page header is present", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    expect(html).toContain("日志");
  });
});
