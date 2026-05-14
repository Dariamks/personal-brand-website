# Requirements Document

## Introduction

本文档定义"程序员个人品牌网站"的需求。该网站面向两类用户：作为作者的站主（程序员本人），用于以低维护成本持续记录自我介绍、职业履历、项目沉淀、技术学习、工具清单与日常心得；以及作为访客的面试官、同行与潜在合作者，用于在短时间内建立对站主专业能力与个性的立体印象。

网站采用静态站点 + Markdown / YAML 驱动内容的架构，内容以文件形式随代码一起通过 Git 管理，部署到静态托管平台。视觉风格以极简杂志风为基调，强调信息层级、排版节奏与留白，克制使用动效。

本需求文档聚焦"做什么"（What）与"做到什么程度"（How well），不规定具体技术栈选型，选型将在设计阶段确定。

## Glossary

- **Website**: 整个个人品牌网站系统，包含所有页面、内容与基础设施。
- **Home_Page**: 网站首页，访客进入网站后看到的第一个页面。
- **About_Page**: "关于我"页面，展示站主深度版自我介绍、职业故事、价值观与兴趣。
- **Resume_Page**: 工作经历与简历页面，以时间线形式展示职业与教育经历，并提供 PDF 下载。
- **Projects_Page**: 项目作品集页面，以卡片列表形式展示站主的项目。
- **Project_Detail_Page**: 单个项目的详情页面。
- **Blog_List_Page**: 博客列表页面，展示所有技术文章与学习笔记的索引。
- **Blog_Post_Page**: 单篇博客文章的阅读页面。
- **Skills_Page**: 技能栈展示页面，按类别分组可视化展示站主掌握的技术栈。
- **Now_Page**: 受 Derek Sivers `/now` 页面启发的单页面，展示站主"当下在做、在学、在关注"的状态。
- **Uses_Page**: 推荐页，展示站主使用与推荐的硬件、软件工具、书籍、课程/文章清单。
- **Journal_List_Page**: 日志列表页，时间倒序展示所有短心得条目。
- **Journal_Entry**: 一条日志条目，包含发布日期、正文与可选标签的短内容单元。
- **Contact_Section**: 联系方式区域，包含邮箱与社交媒体链接。
- **Content_Author**: 站主本人，以 Markdown / YAML 文件形式撰写与维护网站内容。
- **Visitor**: 访问网站的任何读者，包括面试官、同行、潜在合作者。
- **Content_File**: 以 Markdown、MDX 或 YAML 格式存储的内容文件，包含 Front Matter 元数据与正文（YAML 文件整体即为结构化数据）。
- **Front_Matter**: Content_File 头部的 YAML 元数据块，包含标题、日期、标签等字段。
- **Build_System**: 将 Content_File 与模板编译为静态 HTML/CSS/JS 的构建工具。
- **Search_System**: 站内全文搜索功能。
- **Blog_RSS_Feed**: 博客文章的 RSS 2.0 或 Atom 格式订阅源文件。
- **Journal_RSS_Feed**: 日志条目的 RSS 2.0 或 Atom 格式订阅源文件。
- **Analytics_System**: 访问统计系统，用于收集匿名的访问数据。
- **Theme_System**: 负责明暗主题切换与持久化的子系统。
- **Navigation_Bar**: 全局顶部导航栏，展示主要入口。
- **Overflow_Menu**: 顶部导航中承载次要入口的"更多"下拉菜单。
- **Global_Footer**: 网站全局页脚，出现在所有页面底部。
- **Tag**: Content_File 上的一个分类标识字符串。
- **Category**: Content_File 所属的顶层分类，每个文件有且仅有一个分类。
- **Lighthouse_Score**: Google Lighthouse 工具对页面性能、可访问性、最佳实践与 SEO 的评分，取值范围 0-100。
- **Mobile_Viewport**: 视口宽度小于 768px 的设备屏幕。
- **Tablet_Viewport**: 视口宽度在 768px 至 1024px 之间的设备屏幕。
- **Desktop_Viewport**: 视口宽度大于 1024px 的设备屏幕。

## Requirements

### Requirement 1: 首页信息呈现

**User Story:** 作为访客（特别是面试官），我希望在进入网站的 10 秒内理解站主是谁、擅长什么、最近在做什么、在想什么，以便快速判断是否值得深入了解。

#### Acceptance Criteria

1. WHEN Visitor 访问 Home_Page，THE Home_Page SHALL 在首屏（视口宽度 ≥ 1280px、视口高度 ≥ 900px 的 Desktop_Viewport）内展示一个 Hero 区域，包含站主姓名（1 到 50 个字符）、一句话身份定位（1 到 50 个字符）与一段自我介绍（1 到 200 个字符）。
2. THE Home_Page SHALL 在 Hero 区域下方展示 1 到 5 个核心技能或身份标签，每个标签文本长度为 1 到 20 个字符。
3. THE Home_Page SHALL 在 Hero 区域下方展示一个指向 Now_Page 的入口链接，链接文本长度为 1 到 20 个字符，点击后导航至 Now_Page。
4. THE Home_Page SHALL 按发布日期降序展示最多 3 个已发布项目的入口卡片，每张卡片包含项目名称（1 到 60 个字符）、一句话描述（1 到 100 个字符）与跳转至对应 Project_Detail_Page 的链接。
5. THE Home_Page SHALL 按发布日期降序展示最多 5 篇已发布博客文章的入口列表，每项包含文章标题（1 到 80 个字符）、采用 YYYY-MM-DD 格式的发布日期与跳转至对应 Blog_Post_Page 的链接。
6. THE Home_Page SHALL 按发布日期降序展示最多 3 条已发布 Journal_Entry 的入口列表，每项包含采用 YYYY-MM-DD 格式的发布日期、正文摘要（1 到 80 个字符）与跳转至 Journal_List_Page 的链接。
7. THE Home_Page SHALL 在页面内提供指向 About_Page、Projects_Page、Blog_List_Page、Journal_List_Page 的导航入口，每个入口点击后导航至对应页面。
8. WHEN Visitor 在视口宽度 ≥ 1280px 且视口高度 ≥ 900px 的 Desktop_Viewport 下访问 Home_Page，THE Home_Page SHALL 使 Hero 区域内的站主姓名、身份定位与自我介绍在不触发垂直滚动的情况下完整位于视口可视范围内。
9. IF 项目、博客文章或 Journal_Entry 的已发布条目数量为 0，THEN THE Home_Page SHALL 在对应区块显示一条说明无内容的占位提示文本（1 到 50 个字符），并保留该区块的标题与指向对应列表页的链接。

### Requirement 2: 关于我与身份呈现

**User Story:** 作为访客，我希望通过"关于我"页面了解站主的背景、职业故事、价值观与兴趣，以建立对其作为"人"的立体印象。

#### Acceptance Criteria

1. THE About_Page SHALL 展示一段字数在 500 至 2000 字之间的站主自我介绍正文，且正文内必须包含可识别标题的"职业背景"与"职业故事"两个章节。
2. THE About_Page SHALL 在正文区域显著位置展示站主的头像或代表性图像，并为该图像提供描述站主身份的替代文本（alt）。
3. IF 头像或代表性图像加载失败，THEN THE About_Page SHALL 以占位图像替代显示，并保证页面其余内容可正常浏览与访问。
4. THE About_Page SHALL 以三个带独立可见标题的分段分别展示站主的"价值观"、"技术兴趣"与"非技术兴趣"，且每个分段至少包含 3 条可读条目。
5. THE About_Page SHALL 在页面内展示 Contact_Section，且 Contact_Section 至少包含一种可供访客直接访问的联系方式入口。

### Requirement 3: 工作经历与简历

**User Story:** 作为面试官，我希望查看站主的完整职业履历并下载 PDF 版简历，以便在面试流程中归档参考。

#### Acceptance Criteria

1. THE Resume_Page SHALL 以时间线形式按起始时间倒序展示站主的每一段工作经历，每段经历包含公司名称、职位名称、精确到月的起止时间（在职岗位的结束时间以"至今"标识）与一段长度为 50 至 500 个字符的职责描述。
2. THE Resume_Page SHALL 以时间线形式按起始时间倒序展示站主的每一段教育经历，每段经历包含学校名称、专业、学位与精确到月的起止时间（仍在就读以"至今"标识）。
3. THE Resume_Page SHALL 在页面可视区域内持续展示一个"下载 PDF 简历"按钮，页面加载完成后按钮即处于可点击状态。
4. WHEN Visitor 点击"下载 PDF 简历"按钮，THE Resume_Page SHALL 在 3 秒内触发浏览器下载一份 PDF 格式的简历文件，且文件名包含站主姓名与 `resume` 字样。
5. IF PDF 简历文件不可用或下载请求失败，THEN THE Resume_Page SHALL 展示下载失败提示，且保留按钮与当前页面状态，不离开该页面。

### Requirement 4: 项目作品集

**User Story:** 作为面试官，我希望在项目作品集中清楚看到每个项目"做了什么、解决了什么问题、用了什么技术、我的贡献是什么、带来了什么成果"，以评估站主的工程能力。

#### Acceptance Criteria

1. THE Projects_Page SHALL 以卡片列表形式展示所有已发布的项目，每张卡片包含项目封面图、项目名称（1 到 60 个字符）、一句话简介（1 到 120 个字符）与不超过 6 个技术栈标签。
2. THE Projects_Page SHALL 按项目发布日期倒序排列卡片；若发布日期相同，按项目名称升序排列。
3. WHERE 项目在 Content_File 中提供非空的 Live Demo 链接，THE Projects_Page SHALL 在对应卡片上展示指向该 Live Demo 的入口。
4. WHERE 项目在 Content_File 中提供非空的源码仓库链接，THE Projects_Page SHALL 在对应卡片上展示指向该仓库的入口。
5. WHEN Visitor 点击项目卡片中非外链区域的元素，THE Website SHALL 在 2 秒内跳转至对应的 Project_Detail_Page。
6. WHEN Visitor 点击卡片上的 Live Demo 或源码仓库入口，THE Website SHALL 在新标签页中打开对应外部链接并保持当前 Projects_Page 页面状态不变。
7. THE Project_Detail_Page SHALL 包含以下四个必需且按顺序呈现的章节：项目背景与要解决的问题、技术架构与选型理由、站主承担的角色与个人贡献、项目成果或影响指标。
8. THE Project_Detail_Page SHALL 展示该项目使用的完整技术栈列表。
9. THE Project_Detail_Page SHALL 支持在正文中渲染图片（每页不超过 30 张）、代码块（以等宽字体呈现并标注语言）与外部链接（在新标签页中打开）。
10. IF 项目 Content_File 未提供封面图或封面图加载失败，THEN THE Projects_Page SHALL 以统一的默认占位图替代展示。
11. IF Visitor 访问的 Project_Detail_Page 对应的项目不存在或已下线，THEN THE Website SHALL 展示"项目未找到"提示页面并提供返回 Projects_Page 的入口。
12. IF 当前已发布项目数量为 0，THEN THE Projects_Page SHALL 展示空状态提示文案。

### Requirement 5: 技术博客与学习笔记

**User Story:** 作为访客，我希望阅读站主的技术博客与学习笔记以了解其学习路径与解决问题的思路；作为站主，我希望用极低成本发布新文章。

#### Acceptance Criteria

1. THE Blog_List_Page SHALL 按发布日期倒序（最新在前）展示所有已发布的博客文章，每项包含文章标题、格式为 YYYY-MM-DD 的发布日期、所属分类、标签列表与不超过 150 个字符的摘要。
2. THE Blog_List_Page SHALL 在页面可见位置提供按 Category 筛选的 UI 控件，该控件列出当前所有已发布文章覆盖的全部分类选项。
3. THE Blog_List_Page SHALL 在页面可见位置提供按 Tag 筛选的 UI 控件，该控件列出当前所有已发布文章覆盖的全部标签选项。
4. WHEN Visitor 在 Blog_List_Page 选择一个 Category，THE Blog_List_Page SHALL 仅展示属于该 Category 的已发布文章，并保持发布日期倒序。
5. WHEN Visitor 在 Blog_List_Page 选择一个 Tag，THE Blog_List_Page SHALL 仅展示包含该 Tag 的已发布文章，并保持发布日期倒序。
6. THE Blog_Post_Page SHALL 渲染 Content_File 中的 Markdown 或 MDX 正文为 HTML。
7. THE Blog_Post_Page SHALL 对代码块进行语法高亮渲染，支持至少 JavaScript、TypeScript、Python、Go、Rust、Shell、JSON、YAML、SQL 九种语言；对于未识别或未声明语言的代码块，THE Blog_Post_Page SHALL 以等宽字体的纯文本形式展示且不中断页面渲染。
8. THE Blog_Post_Page SHALL 渲染数学公式，支持 LaTeX 语法的行内公式与块级公式。
9. THE Blog_Post_Page SHALL 展示基于正文 H2 至 H4 标题层级自动生成的目录（TOC），每个目录项点击后将视图定位至对应标题位置。
10. WHEN Visitor 向上或向下滚动 Blog_Post_Page，THE Blog_Post_Page SHALL 以 0% 至 100% 的整数百分比展示阅读进度指示器，反映当前视口底部相对于正文起止范围的位置。
11. THE Blog_Post_Page SHALL 展示文章的发布日期、最后更新日期、按中文 300 字/分钟、英文 200 词/分钟估算并向上取整到 1 分钟的阅读时长、所属分类与标签列表。
12. THE Blog_Post_Page SHALL 在正文区域按 Content_File 中的引用顺序渲染图片，并为每张图片呈现其替代文本（alt）。
13. IF Blog_List_Page 在当前筛选条件或未筛选状态下没有任何已发布文章可展示，THEN THE Blog_List_Page SHALL 展示空状态提示，并提供清除当前筛选条件或返回全部文章列表的操作入口。
14. IF Blog_Post_Page 引用的某张图片资源无法加载，THEN THE Blog_Post_Page SHALL 以占位符或替代文本方式指示图片缺失，并继续完成正文其他内容的渲染。
15. IF Visitor 访问的 Blog_Post_Page 对应的 Content_File 不存在或解析失败，THEN THE Website SHALL 展示错误提示并提供返回 Blog_List_Page 的入口。

### Requirement 6: 技能栈展示

**User Story:** 作为面试官，我希望在独立页面上快速看到站主掌握的完整技术栈与熟练度，以评估技能匹配度；作为站主，我希望技能清单由纯数据文件驱动，便于随时增减。

#### Acceptance Criteria

1. THE Skills_Page SHALL 按以下固定类别分组展示站主掌握的技术栈：编程语言、框架/库、工具、基础设施/云服务；未归入上述类别的技能统一放入"其他"分组。每个已展示分组至少包含 1 项技能。
2. THE Skills_Page SHALL 对每一项技能展示一个可量化或可比较的熟练度描述，取值须满足以下三种形式之一，且同一项技能不得混用多种形式：使用年限（整数 0 至 50）、固定档位（取值必须为"熟练"、"掌握"或"了解"三者之一）、或百分比进度值（整数 0 至 100）。
3. THE Skills_Page SHALL 在同一视觉单元内同时展示每一项技能的名称（1 到 40 个字符）与熟练度描述；缺失名称或熟练度描述的条目不被渲染。
4. THE Website SHALL 由代码仓库中单一指定路径的 Markdown 或 YAML 数据文件驱动 Skills_Page 的内容，不允许以其他来源硬编码。
5. WHEN Content_Author 修改该数据文件并推送到主分支，THE Build_System SHALL 在下一次构建完成后使 Skills_Page 页面内容与数据文件中的每一项技能条目逐一一致。
6. IF 某一项技能的名称或熟练度描述字段缺失，或熟练度取值越界（如年限超出 0–50、百分比超出 0–100、档位不在规定集合中），THEN THE Build_System SHALL 在构建阶段报错并返回非零退出码，错误信息须指出具体技能条目与失败原因。
7. IF Skills_Page 的数据文件不存在、内容为空或解析失败，THEN THE Build_System SHALL 终止构建并返回非零退出码，错误信息须包含数据文件路径与失败原因。

### Requirement 7: Now 页面

**User Story:** 作为访客，我希望一眼看到站主"此刻在做什么、在学什么、在关注什么"，以感知其当前状态；作为站主，我希望用一个 Markdown 文件就能维护该页面。

#### Acceptance Criteria

1. THE Now_Page SHALL 以独立二级标题恰好展示三个板块，且顺序固定为："现在在做"、"现在在学"、"现在在关注"。
2. THE Website SHALL 由位于 `/content/now.md` 的单个 Markdown 文件驱动 Now_Page 的内容，每次构建以当次构建时刻的文件内容为准。
3. THE Now_Page SHALL 在三个板块之上以 YYYY-MM-DD 格式展示"最后更新日期"标注，日期取自 `/content/now.md` 的 Front_Matter 字段。
4. IF Now_Page 的最后更新日期距当前构建日期超过 90 个自然日，THEN THE Now_Page SHALL 在三个板块之前的可见位置展示"内容可能已过时"的提示条，直至该条件不再成立。
5. IF `/content/now.md` 缺少最后更新日期字段或该字段格式无效，THEN THE Build_System SHALL 终止构建、输出错误信息并返回非零退出码。
6. IF `/content/now.md` 文件不存在或不可读，THEN THE Build_System SHALL 终止构建、输出错误信息并返回非零退出码。
7. IF `/content/now.md` 的最后更新日期晚于构建日期，THEN THE Build_System SHALL 终止构建、输出错误信息并返回非零退出码。

### Requirement 8: Uses 推荐页

**User Story:** 作为访客，我希望看到站主日常使用与推荐的工具与资源清单，以获得参考；作为站主，我希望用简单的数据文件维护这份清单。

#### Acceptance Criteria

1. THE Uses_Page SHALL 至少按以下四个类别分组展示推荐项并按数据文件声明顺序渲染，每个分组以可见标题呈现：硬件、软件/开发工具、书籍、课程/文章推荐。
2. THE Uses_Page SHALL 对每一项推荐必填展示名称（1 到 100 个字符）与一句话评价（1 到 200 个字符）。
3. WHERE 某一项推荐在数据文件中提供非空的外部链接 URL，THE Uses_Page SHALL 在该项展示一个指向该 URL 的可点击链接元素。
4. THE Website SHALL 由代码仓库中单一指定路径的 Markdown 或 YAML 数据文件驱动 Uses_Page 的内容，修改后在下一次构建后生效。
5. WHEN Visitor 点击某一项推荐的外部链接，THE Website SHALL 在新标签页中打开该链接，且保持当前 Uses_Page 页面状态不变。
6. IF Uses_Page 的数据文件不存在、内容为空或解析失败，THEN THE Build_System SHALL 终止构建并返回非零退出码。
7. IF 某个类别分组下的推荐项数量为 0，THEN THE Uses_Page SHALL 不渲染该分组的标题与分组容器。

### Requirement 9: 日志与短心得

**User Story:** 作为站主，我希望以极低的心理负担发布"今天解决了什么 bug"、"读到了一个好观点"之类的碎片内容；作为订阅者，我希望独立订阅这类短内容流。

#### Acceptance Criteria

1. THE Journal_List_Page SHALL 按发布日期倒序展示所有 `draft` 字段值不为 `true` 的 Journal_Entry。
2. THE Journal_List_Page SHALL 使每一条 Journal_Entry 至少展示 YYYY-MM-DD 格式的发布日期与正文。
3. THE Journal_Entry SHALL 由 Markdown 片段形式的正文构成，无需标题字段。
4. WHERE Journal_Entry 的 Front_Matter 中包含 `tags` 字段，THE Journal_List_Page SHALL 在该条目下展示标签。
5. THE Journal_List_Page SHALL 提供按标签筛选 Journal_Entry 的入口，并在已应用筛选时提供清除筛选以恢复展示全部 Journal_Entry 的入口。
6. WHEN Visitor 在 Journal_List_Page 选择一个标签，THE Journal_List_Page SHALL 仅展示包含该标签的 Journal_Entry。
7. WHERE Journal_Entry 的正文长度超过 120 个字符，THE Journal_List_Page SHALL 在列表视图中仅展示正文的前 120 个字符作为摘要，并在摘要末尾展示"展开全文"入口。
8. WHEN Visitor 在 Journal_List_Page 点击某条 Journal_Entry 的"展开全文"入口，THE Journal_List_Page SHALL 在该条目位置展示其完整 Markdown 正文。
9. IF Journal_List_Page 当前视图下无可展示的 Journal_Entry（总数为 0 或筛选结果为空），THEN THE Journal_List_Page SHALL 展示"暂无日志"的提示文案。
10. THE Build_System SHALL 在每次构建时生成独立的 Journal_RSS_Feed 文件，路径为 `/journal/feed.xml`。
11. THE Journal_RSS_Feed SHALL 包含最近发布的不少于 20 条 Journal_Entry（若总数不足 20 则包含全部）。

### Requirement 10: 联系方式

**User Story:** 作为访客，我希望在网站任意页面都能便捷找到站主的联系方式与社交链接。

#### Acceptance Criteria

1. THE Contact_Section SHALL 展示站主的邮箱地址，邮箱字符串须满足 RFC 5322 基础格式。
2. THE Contact_Section SHALL 展示指向站主 GitHub 主页的链接，链接呈现包含图标与可访问文本标签（1 到 40 个字符）。
3. THE Contact_Section SHALL 展示指向站主 LinkedIn 主页的链接，链接呈现包含图标与可访问文本标签（1 到 40 个字符）。
4. THE Contact_Section SHALL 展示指向站主 Twitter / X 主页的链接，链接呈现包含图标与可访问文本标签（1 到 40 个字符）。
5. THE Contact_Section SHALL 出现在 Global_Footer 中，并在所有公开页面（包括 Home_Page、About_Page、Resume_Page、Projects_Page、Project_Detail_Page、Blog_List_Page、Blog_Post_Page、Skills_Page、Now_Page、Uses_Page、Journal_List_Page 与 404 页面）可达。
6. WHEN Visitor 点击邮箱地址，THE Website SHALL 在 2 秒内触发默认邮件客户端并预填收件人地址。
7. WHEN Visitor 点击 GitHub、LinkedIn 或 Twitter / X 链接，THE Website SHALL 在新标签页中打开对应链接并保持当前页面的滚动位置与状态不变。
8. WHERE 某一社交平台的链接 URL 在站点配置中未配置或为空值，THE Contact_Section SHALL 不渲染该平台的入口条目。
9. IF 点击邮箱地址后设备未能触发任何邮件客户端，THEN THE Website SHALL 以可见反馈告知访客并提供将邮箱复制到剪贴板的替代操作。
10. THE Contact_Section SHALL 使所有链接可通过键盘 Tab 依次聚焦，呈现可见的聚焦样式，并可通过 Enter 键激活。

### Requirement 11: 导航与信息架构

**User Story:** 作为访客，我希望顶部导航清晰、入口数量克制，以便快速定位感兴趣的板块。

#### Acceptance Criteria

1. THE Navigation_Bar SHALL 展示不超过 7 个主要入口。
2. THE Navigation_Bar SHALL 按以下固定顺序从左至右展示主要入口：Home、About、Resume、Projects、Blog、Journal、Now。
3. WHERE 视口宽度 ≥ 1024px，THE Navigation_Bar SHALL 通过 Overflow_Menu 承载以下次要入口：Skills、Uses。
4. THE Global_Footer SHALL 在页面底部承载 Contact_Section，且 Contact_Section 至少包含一种可点击的联系方式入口。
5. WHILE Visitor 在视口宽度 < 768px 的 Mobile_Viewport 下浏览任意页面，THE Navigation_Bar SHALL 以折叠菜单形式呈现，主要入口与 Overflow_Menu 内的次要入口默认隐藏。
6. WHEN Visitor 在 Mobile_Viewport 下点击折叠菜单切换按钮，THE Navigation_Bar SHALL 展开或收起包含全部主要入口与次要入口的导航列表。
7. THE Navigation_Bar SHALL 在所有页面保持一致的结构、入口顺序、视觉布局与文本，确保任何页面跳转后导航呈现一致。
8. THE Navigation_Bar SHALL 对当前所在页面对应的入口展示可观测的视觉区分（如标识当前活动状态）。

### Requirement 12: 内容创作与发布流程

**User Story:** 作为 Content_Author，我希望通过创建一个 Markdown 或 YAML 文件并 `git push` 就能发布或更新内容，而无需登录任何后台。

#### Acceptance Criteria

1. THE Website SHALL 将所有博客文章、项目、Journal_Entry、Skills_Page 数据、Uses_Page 数据、Now_Page 内容以 Markdown、MDX 或 YAML 文件形式存储在代码仓库中。
2. THE Content_File SHALL 通过 Front_Matter 声明元数据，Blog_Post_Page 与 Project_Detail_Page 对应的 Content_File 至少包含以下字段：`title`（非空字符串，最大 200 字符）、`date`（ISO 8601 日期格式 `YYYY-MM-DD`）、`category`（非空字符串，最大 50 字符）、`tags`（字符串数组，包含 0 到 20 个元素，每个元素最大 50 字符）、`summary`（非空字符串，最大 500 字符）、`draft`（布尔值 `true` 或 `false`）。
3. THE Content_File SHALL 使 Journal_Entry 的 Front_Matter 至少包含以下字段：`date`（`YYYY-MM-DD`）、`draft`（布尔值），并可选包含 `tags`（字符串数组，0 到 20 个元素，每个元素最大 50 字符）。
4. WHERE Content_File 的 Front_Matter 中 `draft` 字段值为 `true`，THE Build_System SHALL 在生产构建中排除该文件，使其不出现在任何生产环境的页面、列表页、归档页与 RSS 输出中。
5. WHEN Content_Author 向主分支推送一个新增或修改的 Content_File，THE Build_System SHALL 在 5 分钟内自动触发构建，并在构建成功后自动完成部署。
6. IF 构建过程发生错误（包括依赖安装失败、编译错误或内容校验失败），THEN THE Build_System SHALL 返回非零退出码，并在构建日志中输出指示失败原因、失败阶段及对应文件路径的错误信息。
7. THE Website SHALL 支持在 Markdown 中引用相对路径的本地图片资源（支持 PNG、JPG、JPEG、GIF、SVG、WebP 格式，单个文件最大 10 MB），并在构建时将被引用的图片一同部署到生产产物中。
8. IF Content_File 缺少第 2 条或第 3 条所要求的必填 Front_Matter 字段，或字段值不符合上述格式与长度约束，THEN THE Build_System SHALL 使该次构建失败，并在错误信息中指明缺失或错误的字段名以及所在文件的路径。
9. IF Markdown 中引用的相对路径图片资源在代码仓库中不存在或路径无法解析，THEN THE Build_System SHALL 使该次构建失败，并在错误信息中指明缺失的图片路径以及引用该图片的 Content_File 路径。

### Requirement 13: 响应式与跨设备体验

**User Story:** 作为访客，我希望在手机、平板、桌面任意设备上访问网站都能获得良好的阅读体验。

#### Acceptance Criteria

1. WHEN Visitor 在 Mobile_Viewport 下访问任意页面，THE Website SHALL 渲染适配 Mobile_Viewport 的布局，无横向滚动条。
2. WHEN Visitor 在 Tablet_Viewport 下访问任意页面，THE Website SHALL 渲染适配 Tablet_Viewport 的布局。
3. WHEN Visitor 在 Desktop_Viewport 下访问任意页面，THE Website SHALL 渲染适配 Desktop_Viewport 的布局。
4. THE Website SHALL 使正文段落的行宽在 Desktop_Viewport 下保持在 65 至 80 个字符之间。
5. THE Website SHALL 使正文字号在 Mobile_Viewport 下不小于 16px。

### Requirement 14: 主题与视觉克制

**User Story:** 作为访客，我希望网站在视觉上保持极简与克制，能根据系统偏好自动切换明暗主题，并支持手动覆盖。

#### Acceptance Criteria

1. THE Theme_System SHALL 支持明色主题与暗色主题两种模式。
2. WHEN Visitor 首次访问 Website 且操作系统设置为暗色模式，THE Theme_System SHALL 默认加载暗色主题。
3. WHEN Visitor 首次访问 Website 且操作系统设置为明色模式，THE Theme_System SHALL 默认加载明色主题。
4. WHEN Visitor 在任意页面点击主题切换按钮，THE Theme_System SHALL 切换至另一种主题并持久化该偏好至下次访问。
5. THE Website SHALL 将站点的基础调色板限制在不超过 6 种颜色（含明暗两种主题各自的背景、前景、次级前景、边框、强调色）。
6. THE Website SHALL 限制页面切换与元素过渡动画的时长不超过 300ms。
7. THE Website SHALL 在所有页面保持一致的排版节奏，段落间距、标题间距与行高在同一页面内遵循统一的模块化比例。
8. THE Website SHALL 在正文区域的左右两侧预留不少于视口宽度 10% 的留白（Desktop_Viewport 下）。

### Requirement 15: 站内搜索

**User Story:** 作为访客，我希望通过关键词快速查找博客文章与日志条目，以便定位到感兴趣的内容。

#### Acceptance Criteria

1. THE Search_System SHALL 在 Website 的全局导航中提供一个搜索入口。
2. WHEN Visitor 在搜索框中输入关键词并提交，THE Search_System SHALL 在博客文章的标题、摘要、正文以及 Journal_Entry 的正文与标签中进行匹配，并返回匹配结果列表。
3. THE Search_System SHALL 在搜索结果列表中按相关度倒序展示结果，每项包含标题（Journal_Entry 无标题时使用其正文摘要代替）、所属来源类型（Blog 或 Journal）与摘要。
4. THE Search_System SHALL 在每一条搜索结果上明确标注其来源类型（Blog 或 Journal）。
5. IF 搜索结果为空，THEN THE Search_System SHALL 展示"未找到匹配内容"的提示文案。
6. THE Search_System SHALL 在 Visitor 输入后不超过 500ms 内展示搜索结果。

### Requirement 16: RSS 订阅

**User Story:** 作为订阅者，我希望通过 RSS 阅读器独立订阅站主的博客更新或日志更新。

#### Acceptance Criteria

1. THE Build_System SHALL 在每次构建时生成一份 Blog_RSS_Feed 文件，路径为 `/feed.xml`。
2. THE Blog_RSS_Feed SHALL 包含最近发布的不少于 20 篇博客文章（若总数不足 20 则包含全部）。
3. THE Blog_RSS_Feed SHALL 对每篇文章包含以下字段：标题、链接、发布日期、作者、摘要。
4. THE Build_System SHALL 在每次构建时生成一份 Journal_RSS_Feed 文件，路径为 `/journal/feed.xml`。
5. THE Journal_RSS_Feed SHALL 对每条 Journal_Entry 包含以下字段：链接、发布日期、作者、正文摘要、标签（如有）。
6. THE Website SHALL 在 HTML 头部通过 `<link rel="alternate" type="application/rss+xml">` 标签分别声明 Blog_RSS_Feed 与 Journal_RSS_Feed 的位置。

### Requirement 17: SEO 与可发现性

**User Story:** 作为访客，我希望通过搜索引擎能找到站主的文章；作为站主，我希望在社交平台分享链接时呈现美观的预览卡片。

#### Acceptance Criteria

1. THE Build_System SHALL 在每次构建时生成一份 `sitemap.xml` 文件，列出所有可公开访问的页面。
2. THE Build_System SHALL 在每次构建时生成一份 `robots.txt` 文件，允许搜索引擎抓取除草稿与私有路径外的所有页面。
3. THE Website SHALL 为每个页面提供唯一的 `<title>` 与 `<meta name="description">` 标签。
4. THE Website SHALL 为每个页面提供 Open Graph 元数据，至少包含 `og:title`、`og:description`、`og:type`、`og:url`、`og:image`。
5. THE Website SHALL 为每个页面提供 Twitter Card 元数据，至少包含 `twitter:card`、`twitter:title`、`twitter:description`、`twitter:image`。
6. THE Website SHALL 为每篇 Blog_Post_Page 嵌入 schema.org 的 `BlogPosting` 类型 JSON-LD 结构化数据。
7. THE Website SHALL 使所有公开页面可被搜索引擎抓取，即不对公开内容返回 `noindex` 指令。

### Requirement 18: 性能

**User Story:** 作为访客，我希望在任何网络条件下都能快速打开网站，以获得流畅的阅读体验。

#### Acceptance Criteria

1. WHEN 对 Home_Page 运行 Google Lighthouse 桌面端测试，THE Home_Page SHALL 获得不低于 90 的 Performance Lighthouse_Score。
2. WHEN 对任意 Blog_Post_Page 运行 Google Lighthouse 桌面端测试，THE Blog_Post_Page SHALL 获得不低于 90 的 Performance Lighthouse_Score。
3. WHEN 对 Home_Page 运行 Google Lighthouse 桌面端测试，THE Home_Page SHALL 获得不低于 90 的 SEO Lighthouse_Score。
4. WHEN 对 Home_Page 运行 Google Lighthouse 桌面端测试，THE Home_Page SHALL 获得不低于 90 的 Accessibility Lighthouse_Score。
5. THE Website SHALL 使 Home_Page 在模拟 Fast 3G 网络条件下的 Largest Contentful Paint 不超过 2.5 秒。
6. THE Build_System SHALL 在构建时对页面内引用的图片生成响应式变体（包含适配 Mobile_Viewport、Tablet_Viewport、Desktop_Viewport 的尺寸）。
7. THE Website SHALL 对正文中引用的图片应用懒加载策略，视口外的图片不在首屏阶段加载。

### Requirement 19: 访问统计

**User Story:** 作为站主，我希望了解网站的访问量与访客来源，以判断内容影响力，同时保持对访客隐私的尊重。

#### Acceptance Criteria

1. THE Analytics_System SHALL 采集每个页面的浏览量与来源渠道。
2. THE Analytics_System SHALL 不采集任何个人身份可识别信息（PII）。
3. THE Analytics_System SHALL 不使用 Cookie 识别访客身份。
4. THE Website SHALL 向 Content_Author 提供一个访问统计仪表盘入口。

### Requirement 20: 部署与自定义域名

**User Story:** 作为站主，我希望将网站部署在零成本或低成本的静态托管平台上，并绑定自定义域名。

#### Acceptance Criteria

1. THE Website SHALL 可部署至支持静态站点托管的平台（如 Vercel、Netlify、Cloudflare Pages 或 GitHub Pages）。
2. WHEN Content_Author 向主分支推送代码变更，THE Build_System SHALL 在 5 分钟内完成自动构建与部署。
3. IF 构建失败，THEN THE Build_System SHALL 保留上一个成功的部署版本并通知 Content_Author。
4. THE Website SHALL 支持绑定自定义域名。
5. THE Website SHALL 通过 HTTPS 协议对外提供服务。

### Requirement 21: 可访问性

**User Story:** 作为使用辅助技术的访客，我希望能通过键盘与屏幕阅读器正常浏览网站。

#### Acceptance Criteria

1. THE Website SHALL 为所有图片提供 `alt` 属性描述。
2. THE Website SHALL 使用语义化 HTML 标签（如 `<nav>`、`<main>`、`<article>`、`<aside>`、`<footer>`）组织页面结构。
3. WHEN Visitor 仅使用键盘导航，THE Website SHALL 使所有交互元素（链接、按钮、表单输入）可被聚焦并提供可见的聚焦指示样式。
4. THE Website SHALL 使正文文本与背景之间的对比度在明色主题与暗色主题下均不低于 WCAG 2.1 AA 级别要求的 4.5:1。

### Requirement 22: 错误处理与未定义路由

**User Story:** 作为访客，如果访问到不存在的页面，我希望得到清晰的反馈并能快速返回网站其他部分。

#### Acceptance Criteria

1. IF Visitor 访问一个不存在的路径，THEN THE Website SHALL 返回一个 404 页面。
2. THE 404 页面 SHALL 展示返回 Home_Page 的链接。
3. THE 404 页面 SHALL 展示指向 Blog_List_Page 的链接。
4. THE 404 页面 SHALL 展示指向 Journal_List_Page 的链接。
5. IF Search_System 在执行搜索时出错，THEN THE Search_System SHALL 展示"搜索暂不可用"的提示文案而不崩溃整个页面。
