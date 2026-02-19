# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run develop      # Start dev server at http://localhost:8000
npm run build        # Production build
npm run deploy       # Build + deploy to GitHub Pages (master branch)
npm run typecheck    # TypeScript type check (no emit)
npm run format       # Prettier format all files
npm test             # Run Jest tests
npm run testwatch    # Run Jest in watch mode
```

Run a single test file:
```bash
npx jest src/components/Article/Article.test.tsx
```

## Architecture

This is a Gatsby 5 personal website (TypeScript) deployed to GitHub Pages at https://dlo.wtf/.

**Branching:** `develop` is the working branch. `master` is production (GitHub Pages). Never commit directly to `master` — use `npm run deploy` which builds and pushes to `master` via `gh-pages`.

**Page structure:** `src/pages/index.tsx` is the sole page. It renders `<Layout>` wrapping `<Article>`. The `Head` component is exported from `src/components/Head/Head.tsx` and used as a named export from the page (Gatsby Head API).

**Theme system:** `ThemeContext` (`src/context/ThemeContext.tsx`) provides `theme` (`"light" | "dark"`) and `toggleTheme` via React Context. Theme is persisted to `localStorage` and applied as `data-theme` on `document.documentElement`. CSS variables in `src/styles/theme.css` key off `:root[data-theme="dark"]` / `:root[data-theme="light"]`. `Layout` wraps everything in `<ThemeProvider>`.

**Styling:** Mix of styled-components (for `Layout`'s `Footer`) and plain CSS modules (component-scoped `.css` files imported directly). Global CSS lives in `src/components/styles/` (reset, typography, links) and `src/styles/theme.css`.

**External links:** Always use `src/components/ExternalLink/ExternalLink.tsx` for external links — it sets `rel="noopener noreferrer"` and `target="_blank"` to prevent tabnabbing.

**Testing:** Jest + React Testing Library. Tests live alongside source files (`*.test.tsx`). `jest.setup.js` imports `@testing-library/jest-dom`. CSS modules are mapped via `identity-obj-proxy`.

**Pre-commit hook:** Runs `npm run format` then `npm run typecheck` automatically via Husky.
