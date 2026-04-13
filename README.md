<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Personal homepage: Who is DLO?
</h1>

<!-- TOC -->

- [💻 Development](#development)
  - [Running locally](#running-locally)
  - [Making changes](#making-changes)
- [🚀 Deployment](#deployment)
  - [Deploying latest](#deploying-latest)
- [Domain management](#domain-management)
- [Commands](#commands)
- [Architecture](#architecture)

<!-- TOC -->

## [💻 Development](#development)

### [Running locally](#running-locally)

1. **Run server**

   Navigate into your new site’s directory and start it up.

   ```shell
   cd gatsby-site/
   npm run develop
   ```

2. **Open the code and start customizing!**

   Your site is now running at http://localhost:8000

   For example, you can edit `src/pages/index.tsx` to see your site update in real-time.

### [Making changes](#making-changes)

All edits to be committed to the `develop` branch. Creating features branches
is useful for larger changes.

## [🚀 Deployment](#deployment)

### [Deploying latest](#deploying-latest)

**NOTE:** Do not commit directly to the `master` branch
as this is the production branch for github pages.

Run the following to deploy the latest changes to production:

```shell
git checkout develop
npm run deploy
```

Your site will be built and deployed using the latest `master` branch. This is served by GitHub Pages
at https://dlo.wtf/

## Domain management

Manage the `dlo.wtf` domain at https://account.squarespace.com/domains

1. Sign in using the Google account: lo.dennis@gmail.com

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

**Branching:** `develop` is the working branch. `master` is production (GitHub Pages). Never commit directly to
`master` — use `npm run deploy` which builds and pushes to `master` via `gh-pages`.

**Theme system:** `ThemeContext` (`src/context/ThemeContext.tsx`) provides `theme` (`"light" | "dark"`) and
`toggleTheme` via React Context. Theme is persisted to `localStorage` and applied as `data-theme` on
`document.documentElement`. CSS variables in `src/styles/theme.css` key off `:root[data-theme="dark"]` /
`:root[data-theme="light"]`. `Layout` wraps everything in `<ThemeProvider>`.

**Markdown source routes:** The site publishes clean Markdown siblings in `static/` that Gatsby copies to the site
root: `static/index.md` → `/index.md`, `static/contact-form.md` → `/contact-form.md`, and `static/404.md` →
`/404.md`. These files provide agent-friendly, chrome-free content for the homepage, contact page, and 404 page.
Future pages should add the same pattern: a matching `static/<page>.md` file and a `rel="alternate"
type="text/markdown"` link in the page `Head` export. `static/llms.txt` also advertises the direct Markdown routes.

**Styling:** Mix of styled-components (for `Layout`'s `Footer`) and plain CSS modules (component-scoped `.css` files
imported directly). Global CSS lives in `src/components/styles/` (reset, typography, links) and `src/styles/theme.css`.

**External links:** Always use `src/components/ExternalLink/ExternalLink.tsx` for external links — it sets
`rel="noopener noreferrer"` and `target="_blank"` to prevent tabnabbing.

**Testing:** Jest + React Testing Library. Tests live alongside source files (`*.test.tsx`). `jest.setup.js` imports
`@testing-library/jest-dom`. CSS modules are mapped via `identity-obj-proxy`.

**Git hooks:** This repository should use `.husky` as `core.hooksPath`. Husky-owned hooks forward Beads hook events
from `.husky`, and `pre-commit` then runs `sh ./scripts/check-agents-claude-sync.sh`, `npm run format`,
`npm run typecheck`, `npm run lint`, and `npm test`.
