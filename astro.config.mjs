import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "http://localhost:4321",
  output: "static",
  trailingSlash: "ignore",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkGfm, remarkSmartypants, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      rehypeKatex,
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
    ],
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      langs: [
        "js",
        "ts",
        "jsx",
        "tsx",
        "python",
        "go",
        "rust",
        "shell",
        "json",
        "yaml",
        "sql",
        "text",
      ],
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
