import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

describe("Journal truncation", () => {
  it("shows expand button only for entries with body over 120 chars", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");

    // The long entry (2025-01-21) has <details> with 展开全文
    // The short entry (2025-01-20, "今天修了一个奇怪的 timezone bug。") has no <details>
    // Count <details> elements — these only appear for truncated entries
    const detailsCount = (html.match(/<details\b/g) || []).length;

    // There should be at least 1 entry with <details> (the long one)
    expect(detailsCount).toBeGreaterThanOrEqual(1);

    // The total article count minus details count = short entries without truncation
    const articleCount = (html.match(/<article\b/g) || []).length;
    const shortEntries = articleCount - detailsCount;
    expect(shortEntries).toBeGreaterThanOrEqual(1);
  });

  it("long entry contains truncated summary with ellipsis", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");

    // The truncated summary is inside <summary> and ends with "..." (Chinese ellipsis)
    expect(html).toContain("虽然有些章节...");

    // It also contains the expand text
    expect(html).toContain("展开全文");
  });

  it("short entry renders inline without details/summary wrapper", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");

    // Short entry text: "今天修了一个奇怪的 timezone bug。"
    // It should NOT be inside a <details> block
    const shortEntryText = "今天修了一个奇怪的 timezone bug。";
    expect(html).toContain(shortEntryText);

    // Find the second occurrence of "2025-01-20" (the date in the article body)
    const firstDateIdx = html.indexOf("2025-01-20");
    expect(firstDateIdx).toBeGreaterThan(-1);

    // The short entry's article: find the <article near 2025-01-20
    // Since posts are descending, 2025-01-21 comes first, then 2025-01-20
    // The short entry is the SECOND article
    const secondArticleIdx = html.indexOf("<article", firstDateIdx - 500);
    if (secondArticleIdx > -1) {
      // Get a slice from this article to the end of page
      const articleSlice = html.slice(secondArticleIdx, secondArticleIdx + 800);
      // Short entry should NOT contain <details> — it renders directly as <p>
      expect(articleSlice).not.toContain("<details");
      expect(articleSlice).toContain(shortEntryText);
    }
  });

  it("long entry has full content available in details body", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    // The full text of the long entry should be present in the HTML (hidden until expanded)
    expect(html).toContain("CAP 定理");
    expect(html).toContain("Paxos 和 Raft 算法");
  });

  it("journal list page title is present", () => {
    const html = readFileSync(resolve(distDir, "journal/index.html"), "utf-8");
    expect(html).toContain("日志");
    expect(html).toContain("日常短心得与技术碎片");
  });
});
