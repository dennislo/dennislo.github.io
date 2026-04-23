# Technology Stack & Development Guidelines

## Technology Stack

- **Framework:** Gatsby 5 powers the site, with the app built as a React 18 single-page experience where needed and
  rendered through Gatsby's page and data layer patterns.
- **Language:** TypeScript 5 is used across the codebase with `strict` mode enabled to keep components, context, and
  configuration strongly typed.
- **Styling:** Tailwind CSS 4 is wired in through PostCSS, and the source currently uses global CSS plus theme-driven
  styling rather than a large CSS module footprint.
- **Images & site tooling:** Gatsby image plugins such as `gatsby-plugin-image`, `gatsby-plugin-sharp`,
  `gatsby-transformer-sharp`, and `gatsby-source-filesystem` support optimized assets and local image sourcing.
- **Forms & integrations:** The contact form is connected to Formspree through `@formspree/react`, and analytics support
  is configured with `gatsby-plugin-segment-js`.
- **Unit testing:** Jest runs component and logic tests in a `jsdom` environment, with `ts-jest` handling TypeScript and
  React Testing Library covering user-facing behavior.
- **End-to-end testing:** Playwright provides browser-based coverage from `src/test-e2e`, with a local Gatsby dev server
  reused during local test runs.
- **Code quality & delivery:** ESLint and Prettier are used for code quality, Husky installs git hooks during setup, and
  deployment is handled with `gh-pages` to publish the built site to GitHub Pages.

## AI Agent communication Style

- Be concise and direct
- Focus on the specific task at hand
- Provide code examples when helpful
- Explain technical decisions when they're not obvious

## Code Style & Standards

- High-quality, maintainable, professional code
- Write TypeScript with strict typing
- Follow React best practices and hooks patterns
- Use functional components over class components
- Write comprehensive unit tests using Jest and React Testing Library

## Testing Guidelines

- All new components should include unit tests that meaningfully cover functionality and edge cases
- Test files should be colocated with components (e.g., `Component.test.tsx`)
- Verify both functionality and accessibility where applicable
- Follow existing test patterns (see `src/components/Head/Head.test.tsx` for reference)
- E2E tests are in `src/test-e2e/` as `*.spec.ts` files (run with `npm run test:e2e`)
- Use `src/test/test-utils.ts` → `mockDate(hours, minutes)` to stub `Date` in time-based theme tests

## Development Workflow

- This is a Gatsby project – use Gatsby-specific patterns and APIs
- Work on `develop`. **Never commit directly to `master`** — `master` is production (GitHub Pages)
- Deploy with `npm run deploy` (builds then pushes to `master` via `gh-pages`). This website is deployed to GitHub Pages
  at https://dlo.wtf/.

## Architecture

**Mirrored agent docs:** `CLAUDE.md` is the canonical source of truth. `AGENTS.md` must stay byte-for-byte identical to
the staged `CLAUDE.md` content. If the hook reports drift, restore the canonical paths if needed, then resync with:

```bash
cp CLAUDE.md AGENTS.md
git add CLAUDE.md AGENTS.md
```
