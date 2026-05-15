import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { resolve, join } from "path";
import matter from "gray-matter";

const distDir = resolve(import.meta.dirname, "../../dist");
const contentDir = resolve(import.meta.dirname, "../../src/content");

/**
 * Read all non-draft frontmatter from a content collection directory.
 */
function readCollection(dir: string): Array<Record<string, unknown>> {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(md|mdx)$/.test(f))
    .map((f) => matter(readFileSync(join(dir, f), "utf-8")).data)
    .filter((d) => d.draft !== true);
}

const blogEntries = readCollection(join(contentDir, "blog"));
const journalEntries = readCollection(join(contentDir, "journal"));

const blogCategories = Array.from(
  new Set(blogEntries.map((e) => e.category).filter((c): c is string => !!c)),
);
const blogTags = Array.from(
  new Set(blogEntries.flatMap((e) => (e.tags as string[] | undefined) ?? [])),
);
const journalTags = Array.from(
  new Set(
    journalEntries.flatMap((e) => (e.tags as string[] | undefined) ?? []),
  ),
);

describe("Tag and category pages", () => {
  it("at least one blog category exists in source content", () => {
    expect(blogCategories.length).toBeGreaterThan(0);
  });

  it("at least one blog tag exists in source content", () => {
    expect(blogTags.length).toBeGreaterThan(0);
  });

  it("at least one journal tag exists in source content", () => {
    expect(journalTags.length).toBeGreaterThan(0);
  });

  it("every blog category in source has a generated category page", () => {
    for (const cat of blogCategories) {
      const path = resolve(distDir, `blog/category/${cat}/index.html`);
      expect(existsSync(path), `expected blog category page for "${cat}"`).toBe(
        true,
      );
    }
  });

  it("every blog tag in source has a generated tag page", () => {
    for (const tag of blogTags) {
      const path = resolve(distDir, `blog/tag/${tag}/index.html`);
      expect(existsSync(path), `expected blog tag page for "${tag}"`).toBe(
        true,
      );
    }
  });

  it("every journal tag in source has a generated tag page", () => {
    for (const tag of journalTags) {
      const path = resolve(distDir, `journal/tag/${tag}/index.html`);
      expect(existsSync(path), `expected journal tag page for "${tag}"`).toBe(
        true,
      );
    }
  });

  it("every category page renders the category name and is non-trivial", () => {
    for (const cat of blogCategories) {
      const html = readFileSync(
        resolve(distDir, `blog/category/${cat}/index.html`),
        "utf-8",
      );
      expect(html.length).toBeGreaterThan(1000);
      expect(html).toContain(cat);
    }
  });

  it("every tag page renders the tag name and is non-trivial", () => {
    for (const tag of blogTags) {
      const html = readFileSync(
        resolve(distDir, `blog/tag/${tag}/index.html`),
        "utf-8",
      );
      expect(html.length).toBeGreaterThan(1000);
      expect(html).toContain(tag);
    }
  });

  it("blog index links to every tag page", () => {
    const html = readFileSync(resolve(distDir, "blog/index.html"), "utf-8");
    for (const tag of blogTags) {
      expect(
        html.includes(`/blog/tag/${tag}`),
        `expected /blog/tag/${tag} link on blog index`,
      ).toBe(true);
    }
  });

  it("journal index links to every tag page", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    for (const tag of journalTags) {
      expect(
        html.includes(`/journal/tag/${tag}`),
        `expected /journal/tag/${tag} link on journal index`,
      ).toBe(true);
    }
  });

  it("every tag/category page is a valid HTML document", () => {
    const allPages = [
      ...blogCategories.map((c) => `blog/category/${c}/index.html`),
      ...blogTags.map((t) => `blog/tag/${t}/index.html`),
      ...journalTags.map((t) => `journal/tag/${t}/index.html`),
    ];

    for (const page of allPages) {
      const fullPath = resolve(distDir, page);
      // Sanity: skip if missing (other tests already report it)
      if (!existsSync(fullPath) || !statSync(fullPath).isFile()) continue;
      const html = readFileSync(fullPath, "utf-8");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
      expect(html).toContain("<main");
    }
  });
});
