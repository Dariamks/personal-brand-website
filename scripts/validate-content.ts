#!/usr/bin/env tsx
/**
 * Content validation script.
 * Validates ALL files in src/content/ against Zod schemas (mirrors config.ts)
 * plus structural rules (H2 sections, word counts, image refs, dedup slugs).
 *
 * Usage: pnpm validate-content
 * Exit: 0 = all OK, 1 = errors
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import * as yaml from "js-yaml";
import { z } from "zod";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxFromMarkdown } from "mdast-util-mdx";

// ── Config ───────────────────────────────────────────────────────────

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT = path.join(ROOT, "src", "content");

const errors: string[] = [];
const warnings: string[] = [];

const C = { RESET: "\x1b[0m", RED: "\x1b[31m", GREEN: "\x1b[32m", YELLOW: "\x1b[33m", CYAN: "\x1b[36m" };

function err(file: string, msg: string) {
  errors.push(`${file}: ${msg}`);
}
function warn(file: string, msg: string) {
  warnings.push(`${file}: ${msg}`);
}

function todayStr(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ── Zod Schemas (mirror src/content/config.ts; image→z.string) ──────

const blogSchema = z.object({
  title: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(50)).max(20).default([]),
  summary: z.string().min(1).max(500),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
});

const projectsSchema = z.object({
  title: z.string().min(1).max(60),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(1).max(120),
  stack: z.array(z.string()).max(6),
  fullStack: z.array(z.string()).min(1),
  demo: z.string().url().optional(),
  repo: z.string().url().optional(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

const journalSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string().max(50)).max(20).optional(),
  draft: z.boolean().default(false),
});

const nowSchema = z.object({
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const aboutSchema = z.object({
  title: z.string().min(1).max(200),
});

const skillsSchema = z.object({
  groups: z.array(z.object({
    category: z.enum(["编程语言", "框架/库", "工具", "基础设施/云服务", "其他"]),
    items: z.array(z.object({
      name: z.string().min(1).max(40),
      proficiency: z.discriminatedUnion("kind", [
        z.object({ kind: z.literal("years"), value: z.number().int().min(0).max(50) }),
        z.object({ kind: z.literal("level"), value: z.enum(["熟练", "掌握", "了解"]) }),
        z.object({ kind: z.literal("percent"), value: z.number().int().min(0).max(100) }),
      ]),
    })).min(1),
  })),
});

const usesSchema = z.object({
  groups: z.array(z.object({
    category: z.string().min(1),
    items: z.array(z.object({
      name: z.string().min(1).max(100),
      note: z.string().min(1).max(200),
      url: z.string().url().optional(),
    })).default([]),
  })),
});

const resumeSchema = z.object({
  work: z.array(z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    start: z.string().regex(/^\d{4}-\d{2}$/),
    end: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal("至今")]),
    description: z.string().min(50).max(500),
  })),
  education: z.array(z.object({
    school: z.string().min(1),
    major: z.string().min(1),
    degree: z.string().min(1),
    start: z.string().regex(/^\d{4}-\d{2}$/),
    end: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal("至今")]),
  })),
});

const siteSchema = z.object({
  name: z.string().min(1).max(50),
  tagline: z.string().min(1).max(50),
  intro: z.string().min(1).max(200),
  heroTags: z.array(z.string().max(20)).min(1).max(5),
  nowLinkText: z.string().min(1).max(20).default("看看我现在在做什么"),
  url: z.string().url(),
  email: z.string().email(),
  social: z.object({
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }),
});

// ── Schema validation helper ─────────────────────────────────────────

function validateSchema<T extends z.ZodTypeAny>(
  file: string,
  data: unknown,
  schema: T,
): z.infer<T> | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msgs = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    err(file, msgs);
    return null;
  }
  return result.data;
}

function parseYamlFile(filePath: string): unknown {
  return yaml.load(fs.readFileSync(filePath, "utf-8"));
}

function findFiles(dir: string, exts: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => exts.includes(path.extname(f).toLowerCase()))
    .map((f) => path.join(dir, f));
}

// ── Mdast helpers ────────────────────────────────────────────────────

interface MdastNode {
  type: string;
  children?: MdastNode[];
  value?: string;
  depth?: number;
  url?: string;
  name?: string;
  attributes?: Array<{
    type: string;
    name?: string;
    value?: string | number | boolean | null;
  }>;
}

function parseMdast(md: string): MdastNode {
  return fromMarkdown(md, {
    extensions: [mdxFromMarkdown()],
    mdastExtensions: [],
  }) as unknown as MdastNode;
}

function getH2Headings(tree: MdastNode): string[] {
  return (tree.children ?? [])
    .filter((n) => n.type === "heading" && n.depth === 2)
    .map((n) => (n.children ?? []).map((c) => (typeof c.value === "string" ? c.value : "")).join(""));
}

function countListItemsUnderHeading(tree: MdastNode, headingText: string): number {
  let counting = false;
  let count = 0;
  for (const node of tree.children ?? []) {
    if (node.type === "heading" && node.depth === 2) {
      counting = (node.children ?? []).map((c) => (typeof c.value === "string" ? c.value : "")).join("") === headingText;
      continue;
    }
    if (counting && node.type === "list") count += (node.children ?? []).length;
  }
  return count;
}

function extractText(tree: MdastNode): string {
  const parts: string[] = [];
  (function walk(n: MdastNode) {
    if (typeof n.value === "string") parts.push(n.value);
    for (const c of n.children ?? []) walk(c);
  })(tree);
  return parts.join("");
}

function countChineseChars(text: string): number {
  const m = text.match(/[一-鿿㐀-䶿]/g);
  return m ? m.length : 0;
}

function countWords(text: string): number {
  const cn = countChineseChars(text);
  const en = text.replace(/[一-鿿㐀-䶿]/g, " ").split(/\s+/).filter(Boolean).length;
  return cn + en;
}

function collectImageRefs(tree: MdastNode): string[] {
  const refs: string[] = [];
  (function walk(n: MdastNode) {
    if (n.type === "image" && typeof n.url === "string") refs.push(n.url);
    if (n.type === "mdxJsxFlowElement" && (n.name === "img" || n.name === "Image")) {
      for (const attr of n.attributes ?? []) {
        if (attr.type === "mdxJsxAttribute" && attr.name === "src" && typeof attr.value === "string") {
          refs.push(attr.value);
        }
      }
    }
    for (const c of n.children ?? []) walk(c);
  })(tree);
  return refs;
}

// ── Collection validators ────────────────────────────────────────────

function validateBlog() {
  const dir = path.join(CONTENT, "blog");
  const files = findFiles(dir, [".mdx", ".md"]);
  if (files.length === 0) { warn("src/content/blog", "no files"); return; }

  const slugs = new Map<string, string>();

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);

    // Schema
    const parsed = validateSchema(rel, data, blogSchema);
    if (parsed?.draft) warn(rel, "marked as draft");

    // Slug uniqueness
    const base = path.basename(file, path.extname(file));
    const m = base.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    if (!m) { err(rel, "filename must match YYYY-MM-DD-slug pattern"); continue; }
    const [, , slug] = m;
    const existing = slugs.get(slug);
    if (existing) err(rel, `duplicate slug "${slug}" (also in ${existing})`);
    slugs.set(slug, rel);

    // Body minimum content (≥200 chars)
    if (content.trim().length < 200) {
      warn(rel, `body is short (${content.trim().length} chars)`);
    }
  }
}

function validateProjects() {
  const dir = path.join(CONTENT, "projects");
  const files = findFiles(dir, [".mdx", ".md"]);
  if (files.length === 0) { warn("src/content/projects", "no files"); return; }

  const requiredH2 = [
    "项目背景与要解决的问题",
    "技术架构与选型理由",
    "我的角色与个人贡献",
    "项目成果或影响指标",
  ];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);

    // Schema
    const parsed = validateSchema(rel, data, projectsSchema);
    if (parsed?.draft) warn(rel, "marked as draft");

    // Structural H2s
    const tree = parseMdast(content);
    const h2s = getH2Headings(tree);
    for (let i = 0; i < requiredH2.length; i++) {
      if (h2s[i] !== requiredH2[i]) {
        err(rel, `H2 #${i + 1} expected "${requiredH2[i]}", got "${h2s[i] ?? "missing"}"`);
      }
    }
  }
}

function validateJournal() {
  const dir = path.join(CONTENT, "journal");
  const files = findFiles(dir, [".mdx", ".md"]);
  if (files.length === 0) { warn("src/content/journal", "no files"); return; }

  const dates = new Set<string>();
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);

    // Schema
    const parsed = validateSchema(rel, data, journalSchema);
    if (parsed?.draft) warn(rel, "marked as draft");

    // Date uniqueness
    if (parsed?.date) {
      if (dates.has(parsed.date)) err(rel, `duplicate date "${parsed.date}"`);
      dates.add(parsed.date);
    }

    // Body is not empty
    if (content.trim().length === 0) {
      err(rel, "body is empty — journal entries must have content");
    }
  }

  // Journals should have at least 3 entries
  const published = dates.size;
  if (published > 0 && published < 3) {
    warn("src/content/journal", `only ${published} journal entries (recommend ≥3)`);
  }
}

function validateNow() {
  const file = path.join(CONTENT, "now", "now.md");
  const alt = path.join(CONTENT, "now", "now.mdx");
  const actual = fs.existsSync(file) ? file : fs.existsSync(alt) ? alt : null;
  if (!actual) { err("src/content/now", "now.md not found"); return; }

  const rel = path.relative(ROOT, actual);
  const raw = fs.readFileSync(actual, "utf-8");
  const { data, content } = matter(raw);

  // Normalize Date objects from gray-matter
  const lastUpdated = data.lastUpdated instanceof Date
    ? data.lastUpdated.toISOString().slice(0, 10)
    : data.lastUpdated;
  const normalizedData = { ...data, lastUpdated };

  validateSchema(rel, normalizedData, nowSchema);

  if (typeof lastUpdated === "string" && /^\d{4}-\d{2}-\d{2}$/.test(lastUpdated)) {
    if (lastUpdated > todayStr()) {
      err(rel, `lastUpdated (${lastUpdated}) is in the future`);
    }
    // Warn if stale (>90 days)
    const daysAgo = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 86400000);
    if (daysAgo > 90) warn(rel, `lastUpdated is ${daysAgo} days ago (stale)`);
  }

  const tree = parseMdast(content);
  const h2s = getH2Headings(tree);
  const required = ["现在在做", "现在在学", "现在在关注"];
  for (let i = 0; i < required.length; i++) {
    if (h2s[i] !== required[i]) {
      err(rel, `H2 #${i + 1} expected "${required[i]}", got "${h2s[i] ?? "missing"}"`);
    }
  }
}

function validateAbout() {
  const file = path.join(CONTENT, "about", "about.mdx");
  const alt = path.join(CONTENT, "about", "about.md");
  const actual = fs.existsSync(file) ? file : fs.existsSync(alt) ? alt : null;
  if (!actual) { err("src/content/about", "about.mdx not found"); return; }

  const rel = path.relative(ROOT, actual);
  const raw = fs.readFileSync(actual, "utf-8");
  const { data, content } = matter(raw);

  validateSchema(rel, data, aboutSchema);

  const tree = parseMdast(content);
  const h2s = getH2Headings(tree);
  for (const h of ["职业背景", "职业故事", "价值观", "技术兴趣", "非技术兴趣"]) {
    if (!h2s.includes(h)) err(rel, `missing H2: "${h}"`);
  }

  const text = extractText(tree);
  const wc = countWords(text);
  if (wc < 500) err(rel, `word count ${wc} below min 500`);
  if (wc > 2000) err(rel, `word count ${wc} above max 2000`);

  const valuesCount = countListItemsUnderHeading(tree, "价值观");
  if (valuesCount < 3) err(rel, `"价值观" has ${valuesCount} items, need ≥3`);
  for (const s of ["技术兴趣", "非技术兴趣"]) {
    const c = countListItemsUnderHeading(tree, s);
    if (c < 3) err(rel, `"${s}" has ${c} items, need ≥3`);
  }
}

function validateDataFile(dirName: string, schema: z.ZodTypeAny) {
  const dir = path.join(CONTENT, dirName);
  const files = findFiles(dir, [".yml", ".yaml"]);
  if (files.length === 0) { err(`src/content/${dirName}`, "no data file"); return; }

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    try {
      const data = parseYamlFile(file);
      if (data === null || data === undefined) { err(rel, "empty or invalid YAML"); continue; }
      validateSchema(rel, data, schema);
    } catch (e) {
      err(rel, `parse error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}

function validateImageRefs() {
  for (const sub of ["blog", "projects"]) {
    const dir = path.join(CONTENT, sub);
    for (const file of findFiles(dir, [".mdx", ".md"])) {
      const rel = path.relative(ROOT, file);
      const { content } = matter(fs.readFileSync(file, "utf-8"));
      const tree = parseMdast(content);
      for (const ref of collectImageRefs(tree)) {
        if (ref.startsWith("http://") || ref.startsWith("https://")) continue;
        if (!fs.existsSync(path.resolve(path.dirname(file), ref))) {
          err(rel, `image "${ref}" not found`);
        }
      }
    }
  }
}

// ── Cross-collection checks ──────────────────────────────────────────

function runCrossChecks() {
  const blogDir = path.join(CONTENT, "blog");
  const projectDir = path.join(CONTENT, "projects");

  // Count published (non-draft) entries per collection
  for (const [label, dir] of [["blog", blogDir], ["projects", projectDir]] as const) {
    const files = findFiles(dir, [".mdx", ".md"]);
    let published = 0;
    for (const f of files) {
      const { data } = matter(fs.readFileSync(f, "utf-8"));
      if (!data.draft) published++;
    }
    if (published === 0) warn(`src/content/${label}`, "no published entries");
  }
}

// ── Entry ────────────────────────────────────────────────────────────

function main() {
  console.log(`\n${C.CYAN}=== Content Validation ===${C.RESET}\n`);

  // Schema + structural validation
  validateBlog();
  validateProjects();
  validateJournal();
  validateNow();
  validateAbout();
  validateDataFile("skills", skillsSchema);
  validateDataFile("uses", usesSchema);
  validateDataFile("resume", resumeSchema);
  validateDataFile("site", siteSchema);
  validateImageRefs();
  runCrossChecks();

  // ── Report ──
  if (warnings.length) {
    console.log(`\n${C.YELLOW}Warnings (${warnings.length}):${C.RESET}`);
    for (const w of warnings) console.log(`  ⚠  ${w}`);
  }
  if (errors.length) {
    console.error(`\n${C.RED}Errors (${errors.length}):${C.RESET}`);
    for (const e of errors) console.error(`  ❌ ${e}`);
    console.error(`\n${C.RED}Validation FAILED — ${errors.length} error(s), ${warnings.length} warning(s).${C.RESET}\n`);
    process.exit(1);
  }

  const msg = warnings.length
    ? `All checks passed (${warnings.length} warning(s)).`
    : "All content passed validation.";
  console.log(`\n${C.GREEN}✅ ${msg}${C.RESET}\n`);
  process.exit(0);
}

main();
