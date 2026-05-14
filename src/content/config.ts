import { defineCollection, z } from "astro:content";

// 1. Blog collection
const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(200),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      updated: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      category: z.string().min(1).max(50),
      tags: z.array(z.string().max(50)).max(20).default([]),
      summary: z.string().min(1).max(500),
      draft: z.boolean().default(false),
      cover: image().optional(),
    }),
});

// 2. Projects collection
const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(60),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      summary: z.string().min(1).max(120),
      stack: z.array(z.string()).max(6),
      fullStack: z.array(z.string()).min(1),
      demo: z.string().url().optional(),
      repo: z.string().url().optional(),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

// 3. Journal collection
const journal = defineCollection({
  type: "content",
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    tags: z.array(z.string().max(50)).max(20).optional(),
    draft: z.boolean().default(false),
  }),
});

// 4. Now collection (single file content/now.md)
const now = defineCollection({
  type: "content",
  schema: z.object({
    lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

// 5. Skills collection (data file content/skills.yml)
const skills = defineCollection({
  type: "data",
  schema: z.object({
    groups: z.array(
      z.object({
        category: z.enum([
          "编程语言",
          "框架/库",
          "工具",
          "基础设施/云服务",
          "其他",
        ]),
        items: z
          .array(
            z.object({
              name: z.string().min(1).max(40),
              proficiency: z.discriminatedUnion("kind", [
                z.object({
                  kind: z.literal("years"),
                  value: z.number().int().min(0).max(50),
                }),
                z.object({
                  kind: z.literal("level"),
                  value: z.enum(["熟练", "掌握", "了解"]),
                }),
                z.object({
                  kind: z.literal("percent"),
                  value: z.number().int().min(0).max(100),
                }),
              ]),
            }),
          )
          .min(1),
      }),
    ),
  }),
});

// 6. Uses collection (data file content/uses.yml)
const uses = defineCollection({
  type: "data",
  schema: z.object({
    groups: z.array(
      z.object({
        category: z.string().min(1),
        items: z
          .array(
            z.object({
              name: z.string().min(1).max(100),
              note: z.string().min(1).max(200),
              url: z.string().url().optional(),
            }),
          )
          .default([]),
      }),
    ),
  }),
});

// 7. Resume collection (data file content/resume.yml)
const resume = defineCollection({
  type: "data",
  schema: z.object({
    work: z.array(
      z.object({
        company: z.string().min(1),
        role: z.string().min(1),
        start: z.string().regex(/^\d{4}-\d{2}$/),
        end: z.union([
          z.string().regex(/^\d{4}-\d{2}$/),
          z.literal("至今"),
        ]),
        description: z.string().min(50).max(500),
      }),
    ),
    education: z.array(
      z.object({
        school: z.string().min(1),
        major: z.string().min(1),
        degree: z.string().min(1),
        start: z.string().regex(/^\d{4}-\d{2}$/),
        end: z.union([
          z.string().regex(/^\d{4}-\d{2}$/),
          z.literal("至今"),
        ]),
      }),
    ),
  }),
});

// 8. Site config (data file content/site.yml)
const site = defineCollection({
  type: "data",
  schema: z.object({
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
  }),
});

// 9. About page
const about = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1).max(200),
  }),
});

export const collections = {
  blog,
  projects,
  journal,
  now,
  skills,
  uses,
  resume,
  site,
  about,
};
