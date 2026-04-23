<p style="display: flex; justify-content: center;">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 style="display: flex; justify-content: center; width: 100%; text-align: center;">
  Personal homepage: Who is DLO?
</h1>

## Contents

- [Development](#development)
  - [Running locally](#running-locally)
  - [Making changes](#making-changes)
- [Deployment](#deployment)
  - [Deploying latest](#deploying-latest)
- [Domain management](#domain-management)
- [Commands](#commands)
- [Architecture](#architecture)
  - [Site Config](#site-config)
  - [Styling](#styling)
  - [Theme System](#theme-system)
  - [External Links](#external-links)
  - [Icons](#icons)
  - [Markdown Source Routes](#markdown-source-routes)
  - [Contact Form](#contact-form)

## Development

### Running locally

1. **Run server**

   Navigate into your new site’s directory and start it up.

   ```shell
   cd gatsby-site/
   npm run develop
   ```

2. **Open the code and start customizing!**

   Your site is now running at http://localhost:8000

   For example, you can edit `src/pages/index.tsx` to see your site update in real-time.

### Making changes

All edits to be committed to the `develop` branch. Creating features branches
is useful for larger changes.

## Deployment

### Deploying latest

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
npm run develop          # Dev server at http://localhost:8000
npm run build            # Production build
npm run serve            # Serve production build at http://localhost:9000
npm run deploy           # Build + deploy to GitHub Pages (master)
npm run typecheck        # TypeScript check (no emit)
npm run lint             # ESLint
npm run format           # Prettier format
npm test                 # Jest unit tests
npm run test:watch       # Jest in watch mode
npm run test:e2e         # Playwright E2E (headless)
npm run test:e2e:ui      # Playwright UI mode
npm run test:e2e:headed  # Playwright headed
```

Run a single test file:

```bash
npx jest src/components/About/About.test.tsx
```

## Architecture

### Site Config

`src/config.ts` exports a single `siteConfig` object (name, title, description, accentColor, social links, bio, etc.).
All components read from `siteConfig` — never hardcode site data.

### Styling

**Tailwind CSS v4** is the only styling system. There are no CSS modules or styled-components.

- Global styles: `src/styles/global.css` (`@import "tailwindcss"`)
- Dark mode: triggered by `data-theme="dark"` on `document.documentElement` via
  `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` in `global.css`
- Use standard Tailwind utilities with `dark:` variants for all theme-aware styles

### Theme System

`ThemeContext` (`src/context/ThemeContext.tsx`) provides `theme` (`"light" | "dark"`) and `toggleTheme`.

- **Default is time-based**: `getTimeBasedTheme()` returns `"light"` from 7:30 AM–7:30 PM, `"dark"` otherwise
- **Manual override**: stored in `localStorage` under keys `theme` and `theme-source` (`"manual"`)
- Applied as `document.documentElement.setAttribute("data-theme", theme)`
- `<Layout>` wraps everything in `<ThemeProvider>`; `<ThemeToggle>` is rendered inside `<Layout>`

### External Links

Always use `src/components/ExternalLink/ExternalLink.tsx` for external links (adds `target="_blank"` and
`rel="noopener noreferrer"`).

### Icons

SVG components live in `src/components/icons/` (Tabler icon set: `TablerEmail`, `TablerGithub`, `TablerLinkedin`,
`TablerInstagram`, `TablerMoon`, `TablerSun`, `TablerArrowUpRight`, `TablerTwitter`).

### Markdown Source Routes

`static/` contains agent-friendly Markdown siblings copied verbatim to the site root:
`static/index.md` → `/index.md`, `static/contact-form.md` → `/contact-form.md`, `static/404.md` → `/404.md`,
`static/llms.txt` → `/llms.txt`.  
New pages should add a matching `static/<page>.md` and a
`<link rel="alternate" type="text/markdown" href="/<page>.md" />`
in the page `Head` export.

### Contact Form

The contact form uses Formspree (https://formspree.io/) for submission handling. The repo owns the Gatsby page and form
component, but the
submission inbox and receipt routing are managed in the Formspree dashboard. If the destination email changes, update
that Formspree configuration there rather than in this codebase.
