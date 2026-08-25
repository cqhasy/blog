# 昊の月

Cqhasy 的个人博客，记录 Go、性能分析、可观测性、工程实践与日常学习。

## 本地开发

需要 Node.js 20 及以上版本，并使用 pnpm 安装依赖：

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:4321/blog/`。

## 常用命令

```bash
pnpm check       # Astro 类型与组件检查
pnpm type-check  # TypeScript 检查
pnpm build       # 构建生产站点
pnpm preview     # 预览构建结果
pnpm new-post -- article-name
```

## 内容与配置

- 站点信息、导航、个人资料：`src/config.ts`
- 博客文章：`src/content/posts/`
- 关于页面：`src/content/spec/about.md`
- 友链页面：`src/content/spec/friends.md`

## 许可证

本项目遵循 MIT 许可证，详见 [LICENSE](LICENSE)。
