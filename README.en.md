# Hao Yue

Cqhasy's personal blog for notes on Go, profiling, observability, engineering practice, and everyday learning.

## Local development

Requires Node.js 20 or newer and pnpm:

```bash
pnpm install
pnpm dev
```

The development server is available at `http://localhost:4321/blog/`.

## Common commands

```bash
pnpm check       # Astro checks
pnpm type-check  # TypeScript checks
pnpm build       # Build the production site
pnpm preview     # Preview the production build
pnpm new-post -- article-name
```

## Content and configuration

- Site settings, navigation, and profile: `src/config.ts`
- Posts: `src/content/posts/`
- About page: `src/content/spec/about.md`
- Friends page: `src/content/spec/friends.md`

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
