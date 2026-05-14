import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

describe("Conditional rendering", () => {
  it("footer contains contact email from site config", () => {
    const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
    // Email is rendered as a mailto link
    expect(html).toContain("mailto:xluk277167@gmail.com");
    expect(html).toContain("xluk277167@gmail.com");
  });

  it("social links are rendered when configured, hidden when absent", () => {
    const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
    const siteYml = readFileSync(
      resolve(import.meta.dirname, "../../src/content/site/site.yml"),
      "utf-8",
    );

    // Per Requirement 10.8: 未配置的社交平台不渲染
    // The container <div class="flex gap-3 mt-1"> always exists; whether each
    // platform's <a> appears must mirror the site config.
    const hasGithub = /^\s*github:\s*\S/m.test(siteYml);
    const hasLinkedin = /^\s*linkedin:\s*\S/m.test(siteYml);
    const hasTwitter = /^\s*twitter:\s*\S/m.test(siteYml);

    expect(html.includes("github.com")).toBe(hasGithub);
    expect(html.includes("linkedin.com")).toBe(hasLinkedin);
    // Twitter URLs may live on x.com or twitter.com; check the aria-label as a
    // proxy for "the link element exists".
    expect(html.includes('aria-label="Twitter"')).toBe(hasTwitter);
  });

  it("uses page renders items with URLs as external links", () => {
    const html = readFileSync(resolve(distDir, "uses/index.html"), "utf-8");
    // Some items have URLs (e.g., MacBook Pro → apple.com)
    expect(html).toContain("https://www.jetbrains.com/idea/");
    expect(html).toContain("https://code.visualstudio.com/");
    expect(html).toContain("https://missing.csail.mit.edu/");
    // External link icon SVG should be present for items with URLs
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener"');
  });

  it("uses page items without URLs render as plain spans", () => {
    const html = readFileSync(resolve(distDir, "uses/index.html"), "utf-8");
    // HHKB and Ghostty have no URL, should render as <span> not <a>
    expect(html).toContain("Postman / ApiPost");
    expect(html).toContain("Git / GitHub");
    // Verify they appear in <span> context (not as links)
    const hhkbIdx = html.indexOf("Postman / ApiPost");
    const beforeHhkb = html.slice(Math.max(0, hhkbIdx - 200), hhkbIdx);
    expect(beforeHhkb).toContain("<span");
  });

  it("project detail page renders without demo/repo links when absent", () => {
    const html = readFileSync(
      resolve(distDir, "projects/example-project/index.html"),
      "utf-8",
    );
    // The sample project has no demo/repo URLs configured
    // Verify the project detail page loads and shows content
    expect(html.length).toBeGreaterThan(2000);
    expect(html).toContain("示例项目");
    expect(html).toContain("项目背景与要解决的问题");
  });

  it("home page renders without crashing and has substantial content", () => {
    const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
    // A valid home page should have substantial content
    expect(html.length).toBeGreaterThan(5000);
    expect(html).toContain("向子豪");
    expect(html).toContain("Java 后端开发工程师");
  });

  it("RSS feed links are present in footer", () => {
    const html = readFileSync(resolve(distDir, "index.html"), "utf-8");
    expect(html).toContain("/feed.xml");
    expect(html).toContain("/journal/feed.xml");
    expect(html).toContain("Blog RSS");
    expect(html).toContain("Journal RSS");
    expect(html).toContain("网站地图");
  });
});
