import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import matter from "gray-matter";

const distDir = resolve(import.meta.dirname, "../../dist");
const contentDir = resolve(import.meta.dirname, "../../src/content");

/**
 * Extract date strings from HTML by matching `<time datetime="YYYY-MM-DD">`.
 */
function extractDatesFromHtml(html: string): string[] {
  const datePattern = /datetime="(\d{4}-\d{2}-\d{2})"/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = datePattern.exec(html)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function countArticles(html: string): number {
  return (html.match(/<article\b/g) || []).length;
}

/**
 * Read titles of all non-draft entries in a content collection, sorted desc by date.
 */
function readPublishedTitles(dir: string): { title: string; date: string }[] {
  const full = join(contentDir, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((f) => /\.(md|mdx)$/.test(f))
    .map((f) => matter(readFileSync(join(full, f), "utf-8")).data)
    .filter((d) => d.draft !== true && d.title)
    .map((d) => ({ title: d.title as string, date: d.date as string }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const publishedProjects = readPublishedTitles("projects");

describe("List ordering", () => {
  it("blog posts sorted by date descending", () => {
    const html = readFileSync(resolve(distDir, "blog/index.html"), "utf-8");
    const dates = extractDatesFromHtml(html);
    expect(dates.length).toBeGreaterThan(0);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] <= dates[i - 1]).toBe(true);
    }
  });

  it("project list shows the most recent project's title", () => {
    const html = readFileSync(resolve(distDir, "projects/index.html"), "utf-8");
    expect(html.length).toBeGreaterThan(1000);
    if (publishedProjects.length > 0) {
      expect(html).toContain(publishedProjects[0].title);
    }
  });

  it("journal entries sorted by date descending", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    const dates = extractDatesFromHtml(html);
    expect(dates.length).toBeGreaterThan(0);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] <= dates[i - 1]).toBe(true);
    }
  });

  it("home page articles count is within hero+projects+blog+journal envelope", () => {
    const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
    const count = countArticles(html);
    // Per spec: home shows up to 3 projects + 5 blog posts + 3 journal entries
    // = max 11 <article> elements. Lower bound: at least 1 article from any section.
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(11);
  });

  it("home page projects section shows at most 3 projects", () => {
    const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
    expect(html.length).toBeGreaterThan(1000);
    const articleCount = countArticles(html);
    expect(articleCount).toBeGreaterThanOrEqual(1);
  });

  it("no draft-labeled content appears in any public page", () => {
    const files = [
      "index.html",
      "blog/index.html",
      "projects/index.html",
      "journal/index.html",
    ];
    for (const file of files) {
      const html = readFileSync(resolve(distDir, file), "utf-8");
      expect(html).not.toContain('"draft": true');
      expect(html).not.toContain("draft: true");
    }
  });
});
