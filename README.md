# Personal Brand Website

基于 [Astro](https://astro.build) 构建的极简个人品牌网站，支持 Markdown / MDX / YAML 驱动内容，部署于 Cloudflare Pages。

## 技术栈

- **框架**: Astro 5 (TypeScript strict)
- **样式**: Tailwind CSS v4 + CSS 自定义属性（明/暗双主题）
- **内容**: MDX + Zod Content Collections（构建时强校验）
- **代码高亮**: Shiki（11 种语言，双主题）
- **数学公式**: KaTeX（rehype-katex）
- **搜索**: Pagefind（零后端，构建时生成索引）
- **部署**: Cloudflare Pages（自动 HTTPS，全球 CDN）

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建产物
pnpm preview

# 运行测试
pnpm test
```

## 目录结构

```
├── src/
│   ├── pages/          # 路由页面（Astro 文件即路由）
│   ├── layouts/        # 布局组件（BaseLayout, PostLayout）
│   ├── components/     # 共享组件（Nav, Footer, BlogCard 等）
│   ├── content/        # 内容配置（Zod schemas）
│   │   └── config.ts   # Content Collections 定义
│   ├── lib/            # 工具函数
│   └── styles/         # 全局样式
├── content/            # 内容文件（moved to src/content/）
├── public/             # 静态资源
│   ├── resume.pdf      # PDF 简历
│   ├── avatar.jpg      # 头像
│   ├── favicon.svg     # 网站图标
│   └── og-default.svg  # 默认 Open Graph 图
├── scripts/            # 构建脚本
│   ├── validate-content.ts  # 内容校验
│   └── og-generate.ts       # OG 图片生成（占位）
└── tests/              # 测试
    ├── unit/           # 单元测试
    ├── property/       # 属性测试
    ├── integration/    # 集成测试
    └── e2e/            # E2E 测试（Playwright）
```

## 新增内容

### 博客文章

在 `src/content/blog/` 下创建 `.mdx` 文件：

```mdx
---
title: "文章标题"
date: "2025-01-15"
category: "技术"
tags: ["TypeScript", "Web"]
summary: "文章摘要，不超过 500 字符。"
draft: false
cover: "./images/cover.jpg"  # 可选
---

## 二级标题

正文内容支持 Markdown、代码块、数学公式等。

```ts
const greeting = "Hello, World!";
```

$$ E = mc^2 $$
```

### 项目

在 `src/content/projects/` 下创建 `.mdx` 文件：

```mdx
---
title: "项目名称"
date: "2025-01-10"
summary: "一句话简介，不超过 120 字符。"
stack: ["TypeScript", "React", "Node.js"]
fullStack: ["TypeScript", "React", "Node.js", "PostgreSQL"]
demo: "https://..."    # 可选
repo: "https://..."    # 可选
draft: false
---

## 项目背景与要解决的问题

...

## 技术架构与选型理由

...

## 我的角色与个人贡献

...

## 项目成果或影响指标

...
```

> 注意：四个 H2 标题的顺序和文本必须完全一致，构建时校验会检查。

### 日志

在 `src/content/journal/` 下创建 `.md` 文件：

```md
---
date: "2025-01-20"
tags: ["bug", "debugging"]
draft: false
---

今天的日志内容。不超过 120 字符则直接显示，超过则截断并提供"展开全文"。
```

### 更新个人信息

- **站点配置**: 编辑 `src/content/site/site.yml`
- **关于页面**: 编辑 `src/content/about/about.mdx`
- **技能列表**: 编辑 `src/content/skills/skills.yml`
- **推荐列表**: 编辑 `src/content/uses/uses.yml`
- **简历数据**: 编辑 `src/content/resume/resume.yml`
- **Now 页面**: 编辑 `src/content/now/now.md`
- **PDF 简历**: 替换 `public/resume.pdf`
- **头像**: 替换 `public/avatar.jpg`
- **默认 OG 图**: 替换 `public/og-default.svg`

## Front Matter 字段速查

### Blog

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string (1-200) | 是 | 文章标题 |
| date | YYYY-MM-DD | 是 | 发布日期 |
| updated | YYYY-MM-DD | 否 | 最后更新日期 |
| category | string (1-50) | 是 | 分类 |
| tags | string[] (≤20) | 否 | 标签列表 |
| summary | string (1-500) | 是 | 摘要 |
| draft | boolean | 否 | 草稿（不发布） |
| cover | image | 否 | 封面图 |

### Project

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string (1-60) | 是 | 项目名称 |
| date | YYYY-MM-DD | 是 | 日期 |
| summary | string (1-120) | 是 | 一句话简介 |
| stack | string[] (≤6) | 是 | 卡片展示的技术栈 |
| fullStack | string[] (≥1) | 是 | 详情页完整技术栈 |
| demo | url | 否 | Live Demo 链接 |
| repo | url | 否 | 源码仓库链接 |
| draft | boolean | 否 | 草稿 |

### Journal

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | YYYY-MM-DD | 是 | 日期 |
| tags | string[] (≤20) | 否 | 标签 |
| draft | boolean | 否 | 草稿 |

### Skills

```yaml
groups:
  - category: 编程语言  # 编程语言 | 框架/库 | 工具 | 基础设施/云服务 | 其他
    items:
      - name: TypeScript
        proficiency:
          kind: years    # years | level | percent
          value: 6       # years: 0-50 | level: 熟练/掌握/了解 | percent: 0-100
```

## 部署

### Cloudflare Pages

1. 将仓库推送到 GitHub
2. 在 Cloudflare Pages 控制台创建新项目，连接仓库
3. 构建设置：
   - **Build command**: `pnpm build`
   - **Output directory**: `dist`
   - **Node version**: `20`
4. 设置环境变量 `PUBLIC_SITE_URL` 为你的域名
5. 部署完成后绑定自定义域名

### 环境变量

| 变量 | 说明 |
|------|------|
| `PUBLIC_SITE_URL` | 站点完整 URL（用于 sitemap/RSS/OG） |

## 测试

```bash
# 运行所有测试（需要先 build）
pnpm build && pnpm test

# E2E 测试需要安装 Playwright 浏览器
npx playwright install chromium
pnpm test
```

测试覆盖：排序正确性、导航一致性、外链属性、图片 alt、SEO 元数据、站点地图、CSS 动效时长、技能页渲染、日志截断、条件渲染、Now 过期提示、阅读时间公式等。

## 视觉设计

- 调色板 ≤ 6 色（明/暗双主题）
- 字体：Inter Variable（英文） + Noto Sans SC（中文） + JetBrains Mono（代码）
- 排版：68ch 正文行宽，Major Third 字号比例
- 动效：≤ 300ms，尊重 `prefers-reduced-motion`
- 响应式：Mobile (<768px) / Tablet (768-1024px) / Desktop (>1024px)
