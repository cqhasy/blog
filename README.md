# 昊の月

Cqhasy 的个人博客，记录 Go、AI Agent、工程实践与生活随笔。

## 本地开发

需要 Node.js 20 及以上版本，使用 pnpm：

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:4321/blog/`。

## 写作栏目

分享与随笔是独立的 Astro 内容集合，从文件目录决定所属栏目，无需添加分类标签来区分：

| 栏目 | 内容目录 | 页面地址 |
| --- | --- | --- |
| 分享 | `src/content/shares/` | `/blog/shares/` |
| 随笔 | `src/content/notes/` | `/blog/notes/` |

现有四篇技术文章已迁入 `shares/`，原 `/blog/posts/<slug>/` 地址会跳转到新地址并保留锚点。随笔暂时留空，不生成示例文章。

```bash
pnpm new-post article-name         # 分享草稿
pnpm new-post shares article-name  # 分享草稿，显式指定栏目
pnpm new-note essay-name           # 随笔草稿
pnpm new-post notes essay-name     # 随笔草稿，另一种写法
```

支持中文文件名和子目录，含空格的标题需要加引号。新文件默认 `draft: true`，可在开发服务器查看；发布时设为 `false`。生产站点、搜索与 RSS 都会排除草稿。文件名决定默认 URL，也可以用 frontmatter 的 `slug` 显式指定地址。更改已发布文章的文件名或 slug 需要另加跳转。

两栏共享 frontmatter 格式：

```yaml
---
title: 一篇文字的标题
published: 2026-11-02
description: 一两句话概括内容，可选
tags: []
draft: false
---
```

文章前后篇只在当前栏目内切换；首页分别展示分享和最新随笔，RSS 与搜索包含两个栏目。新增栏目文稿无需修改路由。VS Code Front Matter 也已配置两个写作目录。

## 常用命令

```bash
pnpm check       # Astro 类型与组件检查
pnpm type-check  # TypeScript 检查
pnpm build       # 构建生产站点并生成 Pagefind 搜索索引
pnpm preview     # 预览构建结果
```

## 页面与排版

- 页面结构：`src/layouts/Layout.astro`、`src/layouts/MainGridLayout.astro`
- 阅读样式：`src/styles/reading.css`
- 正文与目录：`src/components/Article.astro`
- 首页与栏目：`src/pages/[...page].astro`、`src/components/WritingIndex.astro`
- 站点资料：`src/config.ts`
- 关于页面：`src/content/spec/about.md`
- 友链页面：`src/content/spec/friends.md`

标题使用本地托管的可变思源宋体（Noto Serif SC），按字符子集加载，`font-display: swap` 避免阻塞阅读；正文使用适配各系统的中文无衬线字体栈，代码使用 JetBrains Mono。正文桌面端 17px、2 倍行高；手机端 16px、1.95 倍行高。页面支持深浅色、键盘焦点、跳转正文、原生目录折叠、搜索弹窗与减少动态效果偏好。

设计参考 [Paul Graham 的文章目录](https://paulgraham.com/articles.html)、[Derek Sivers 的轻量个人网站](https://sive.rs/)，以及 [Maggie Appleton 对不同文字类型的区分](https://maggieappleton.com/garden)。对齐与间距参考 [Adobe XD 的对象对齐和分布指南](https://helpx.adobe.com/xd/desktop/design/shapes-objects-and-path/move-align-distribute-objects.html)。首页集中展示文字，项目、技能与友链放在页脚入口，移除大横幅、轮播、侧栏和装饰动效。

交互与视觉细化对照 [Josh W. Comeau 的技术长文](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/)、[Nielsen Norman Group 的可用性原则](https://www.nngroup.com/articles/ten-usability-heuristics/) 和 [Vercel Geist 的颜色系统](https://vercel.com/geist/colors)，将“浏览、定位、阅读、复制”作为主要路径：增加列表和章节留白、缩短摘要，减少重复说明；界面以中性灰作为表面和边框，只用克制的蓝色表示交互状态；技能以原生折叠分组呈现，项目采用无渐变、细边框的卡片，保留短摘要和单一仓库入口。熟悉操作采用统一线性图标并提供可访问名称，目录随阅读置顶且选择章节后自动收起。代码块使用与页面同步的 GitHub Light / Dark 高亮，采用独立的中性表面和工具栏，成功或失败均显示反馈。

## 许可证

本项目遵循 MIT 许可证，详见 [LICENSE](LICENSE)。思源宋体与 JetBrains Mono 按其随包提供的 SIL Open Font License 使用。
