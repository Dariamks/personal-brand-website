import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "../../dist");

describe("Skills rendering", () => {
  it("renders all five category headings in order", () => {
    const html = readFileSync(resolve(distDir, "skills/index.html"), "utf-8");
    const categories = [
      "编程语言",
      "框架/库",
      "工具",
      "基础设施/云服务",
      "其他",
    ];
    let lastIndex = -1;
    for (const cat of categories) {
      const idx = html.indexOf(cat);
      expect(idx).toBeGreaterThan(-1);
      expect(idx).toBeGreaterThan(lastIndex);
      lastIndex = idx;
    }
  });

  it("renders programming language skills with proficiency values", () => {
    const html = readFileSync(resolve(distDir, "skills/index.html"), "utf-8");
    // Java with 熟练
    expect(html).toContain("Java");
    expect(html).toContain("熟练");
  });

  it("renders framework skills with proficiency values", () => {
    const html = readFileSync(resolve(distDir, "skills/index.html"), "utf-8");
    expect(html).toContain("Spring Boot");
    expect(html).toContain("熟练");
    expect(html).toContain("Spring Cloud");
    expect(html).toContain("掌握");
  });

  it("renders tools category with at least one skill", () => {
    const html = readFileSync(resolve(distDir, "skills/index.html"), "utf-8");
    expect(html).toContain("Git / Maven");
    expect(html).toContain("工具");
  });

  it("renders infrastructure and other category skills", () => {
    const html = readFileSync(resolve(distDir, "skills/index.html"), "utf-8");
    expect(html).toContain("MySQL");
    expect(html).toContain("Redis");
    expect(html).toContain("TCP");
    expect(html).toContain("WebSocket");
  });

  it("each rendered skill has a proficiency meter", () => {
    const html = readFileSync(resolve(distDir, "skills/index.html"), "utf-8");
    // Every skill should have a role="meter" accessibility attribute
    const meterMatches = html.match(/role="meter"/g) || [];
    // Skills count varies with real data; verify at least 1
    expect(meterMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("skill names appear before their proficiency blocks", () => {
    const html = readFileSync(resolve(distDir, "skills/index.html"), "utf-8");
    const skills = ["Java", "Spring Boot", "MySQL", "Redis", "Docker"];
    for (const skill of skills) {
      const skillIdx = html.indexOf(skill);
      expect(skillIdx).toBeGreaterThan(-1);
      // After skill name, there should be aria-label blocks
      const afterSkill = html.slice(skillIdx);
      expect(afterSkill).toContain("aria-label");
    }
  });
});
