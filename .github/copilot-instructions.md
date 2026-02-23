# Copilot Instructions

## Project overview

- Gatsby 5 personal website/blog built with React and TypeScript.
- Deployed to GitHub Pages at `https://dlo.wtf/`.

## Branching and deployment

- Work on `develop`. Do not commit directly to `master`.
- Deploy with `npm run deploy` (builds and pushes `master` via `gh-pages`).

## Code style and standards

- Use strict TypeScript typing.
- Prefer functional React components and hooks.
- Follow existing patterns in `src/`.

## Architecture notes

- Main page: `src/pages/index.tsx` renders `<Layout>` wrapping `<Article>`.
- Gatsby Head API: `Head` is exported from `src/components/Head/Head.tsx`.
- Theme system: `ThemeContext` in `src/context/ThemeContext.tsx` provides `theme` and `toggleTheme`.
  - Theme persisted to `localStorage` and applied as `data-theme` on `document.documentElement`.
  - Theme variables live in `src/styles/theme.css`.
- External links: always use `src/components/ExternalLink/ExternalLink.tsx`.
- Styling: CSS modules for components; global styles in `src/components/styles/` plus `src/styles/theme.css`.
- `Layout` uses styled-components for the footer.

## Unit Tests

- See `.claude/skills/unit-testing/SKILL.md` for unit testing guidelines.
- Dependencies: Jest + React Testing Library.
- Co-locate tests with components as `*.test.tsx`.
- Test rendering, behavior, accessibility, and edge cases.
- See `src/components/Head/Head.test.tsx` for patterns.

## E2E Tests

- See `.claude/skills/e2e-testing/SKILL.md` for end-to-end testing guidelines.
- Dependencies: Playwright for E2E tests.
- Tests located in `tests/e2e/` with `.spec.ts` extension.
- Run E2E tests with `npm run test:e2e`.

## Commands

- `npm run develop` starts dev server at `http://localhost:8000`.
- `npm run build` production build.
- `npm run typecheck` TypeScript checks.
- `npm run format` Prettier format.
- `npm test` run Jest tests.
- Run single test: `npx jest src/components/Article/Article.test.tsx`.
