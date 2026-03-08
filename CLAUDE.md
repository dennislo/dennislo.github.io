# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Overview

This is a personal website/blog built with Gatsby, React, and TypeScript.

## Required Agent And Skill Usage

- Use `.agent/skills/manual-testing/SKILL.md` for manual QA tasks: start the app, open a browser, go to `http://localhost:8000`, exercise the site like a real user, inspect DevTools, and capture evidence for issues.
- Use `.claude/agents/debugger.md` whenever there are errors, failing tests, broken builds, console issues, or unclear behavior. Add plan steps to understand the symptom first, investigate and isolate the cause second, then fix and verify.
- Use `.claude/agents/senior-frontend-engineer.md` for frontend implementation and bug-fix work in Gatsby, React, and TypeScript. Default to this agent when code needs to be written or corrected in the UI layer.
- Use `.claude/agents/test-writer.md` for unit and integration testing with Jest and React Testing Library. If a request says `test-writter`, interpret it as this agent.
- Use `.claude/skills/e2e-testing/SKILL.md` for Playwright work, including new browser tests, updating existing specs, debugging flaky end-to-end coverage, and validating user journeys.

## Code Style & Standards

- Write TypeScript with strict typing
- Follow React best practices and hooks patterns
- Use functional components over class components
- Write comprehensive unit tests using Jest and React Testing Library

## Testing Guidelines

- All new components should include unit tests
- Test files should be colocated with components (e.g., `Component.test.tsx`)
- Use `@testing-library/react` for component testing
- Verify both functionality and accessibility where applicable
- Mock external dependencies appropriately
- Follow existing test patterns (see `src/components/Head/Head.test.tsx` for reference)
- Use descriptive test names with "it" blocks
- Test component rendering, behavior, and edge cases

## Development Workflow

- This is a Gatsby project - use Gatsby-specific patterns and APIs
- Run tests before committing changes
- Follow the existing project structure in `src/`
- Maintain consistency with existing code patterns

## Communication Style

- Be concise and direct
- Focus on the specific task at hand
- Provide code examples when helpful
- Explain technical decisions when they're not obvious

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

**Branching:** `develop` is the working branch. `master` is production (GitHub Pages). Never commit directly to
`master` — use `npm run deploy` which builds and pushes to `master` via `gh-pages`.

**Page structure:** `src/pages/index.tsx` is the sole page. It renders `<Layout>` wrapping `<Article>`. The `Head`
component is exported from `src/components/Head/Head.tsx` and used as a named export from the page (Gatsby Head API).

**Theme system:** `ThemeContext` (`src/context/ThemeContext.tsx`) provides `theme` (`"light" | "dark"`) and
`toggleTheme` via React Context. Theme is persisted to `localStorage` and applied as `data-theme` on
`document.documentElement`. CSS variables in `src/styles/theme.css` key off `:root[data-theme="dark"]` /
`:root[data-theme="light"]`. `Layout` wraps everything in `<ThemeProvider>`.

**Styling:** Mix of styled-components (for `Layout`'s `Footer`) and plain CSS modules (component-scoped `.css` files
imported directly). Global CSS lives in `src/components/styles/` (reset, typography, links) and `src/styles/theme.css`.

**External links:** Always use `src/components/ExternalLink/ExternalLink.tsx` for external links — it sets
`rel="noopener noreferrer"` and `target="_blank"` to prevent tabnabbing.

**Testing:** Jest + React Testing Library. Tests live alongside source files (`*.test.tsx`). `jest.setup.js` imports
`@testing-library/jest-dom`. CSS modules are mapped via `identity-obj-proxy`.

**Pre-commit hook:** Runs `npm run format` then `npm run typecheck` automatically via Husky.
