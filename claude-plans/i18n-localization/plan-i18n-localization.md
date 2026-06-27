# Plan: Multi-Language Localization (i18n)

## Overview

Localize the entire site — every heading, body string, button, label, and accessibility attribute
(`aria-label`, `alt`, `title`, `placeholder`) — into four locales, with locale-aware URLs, a header
language switcher (flag + locale text), and fully localized SEO (meta tags, JSON-LD, hreflang,
sitemap, robots/llms/markdown mirrors).

### Supported locales

| Locale code | Language               | URL path                    | Notes                                                            |
| ----------- | ---------------------- | --------------------------- | ---------------------------------------------------------------- |
| `en-GB`     | English (UK)           | `/` (canonical) + `/en-GB/` | **Default.** Existing copy is already British ("visualisation"). |
| `en-US`     | English (US)           | `/en-US/`                   | Americanised spellings.                                          |
| `zh-Hans`   | 简体中文 (Simplified)  | `/zh-Hans/`                 | Machine-translated, human-checkable.                             |
| `zh-Hant`   | 繁體中文 (Traditional) | `/zh-Hant/`                 | Machine-translated, human-checkable.                             |

- **Default locale:** `en-GB`, served at root `/`. Also reachable at `/en-GB/` (alias) with
  `<link rel="canonical">` pointing back to `/` to avoid duplicate-content penalties.
- **All four locales appear in the URL** via the switcher.

### Chosen approach — Lightweight custom i18n (no heavy plugin)

Decision (approved): **Option 2 — custom i18n** over `gatsby-plugin-react-i18next`.

Rationale:

- Repo runs **React 19** on **Gatsby 5.16**; `gatsby-plugin-react-i18next` pins peer deps to React 18
  and historically depended on `react-helmet`, while this repo has already migrated to the **Gatsby
  Head API**. Avoids peer-dep overrides and SSR friction.
- Translatable content is small and already centralized in `src/config.ts` + a few component
  strings — a typed dictionary + `t()` helper is simpler than wiring i18next/ICU.
- Full control of hreflang / `<html lang>` through the existing `Head.tsx` + `gatsby-ssr.ts`.
- No new runtime dependency; fits existing conventions (`config.ts`, `schemas.ts`, Gatsby Head API).

> Translation source: machine translation (Google Translate / equivalent) for the initial `zh-Hans`
> and `zh-Hant` strings, stored as plain TS/JSON so they remain reviewable and editable. en-US is a
> spelling-variant pass over en-GB.

---

## Architecture

### Current state (what i18n must touch)

- **Content source of truth:** `src/config.ts` — one large `siteConfig` object (header, name, title,
  description, aboutMe, agileIT, skills[], clients[], funFacts[], projects[], experience[],
  education[]) plus `sectionNavLinks[]`.
- **Components with hardcoded strings / a11y labels:**
  - `SiteHeader.tsx` — nav `aria-label="Primary"`, `"Mobile primary menu"`, Menu open/close labels,
    `"Gists"` external link, `"Menu"` button text.
  - `Hero.tsx` — social `aria-label`s ("Email Dennis Lo", "… on GitHub/LinkedIn/Instagram"), any
    headings/CTAs.
  - `About.tsx`, `Projects.tsx` (`aria-label={`View ${project.name}`}`), `Experience.tsx`,
    `Education.tsx`, `GitHubActivity.tsx` (`"Loading GitHub activity"`, `"Recent GitHub activity"`),
    `SiteFooter.tsx` (social labels), `ThemeToggle.tsx` (`"Switch to … mode"`),
    `ContactForm.tsx` (field labels, validation messages, button text, `aria-describedby` copy),
    `contact-form.tsx` page (`title="Contact — DLO"`), `404.tsx`.
- **SEO:** `Head.tsx` (title/description/OG/Twitter), `schemas.ts` + `JsonLd.tsx` (Person/WebSite/
  ProfilePage JSON-LD), `pages/index.tsx` Head (schemas + `/index.md` alternate).
- **Static AI/SEO files:** `static/robots.txt`, `static/llms.txt`, `static/index.md`,
  `static/contact-form.md`, `static/404.md`.
- **Sitemap:** `gatsby-plugin-sitemap`.

### Target design

```
src/
  i18n/
    config.ts          # locales list, defaultLocale='en-GB', path helpers, RTL=false
    LocaleContext.tsx  # React context: { locale, t, localizePath }
    useLocale.ts       # hook -> useContext(LocaleContext)
    translations/
      en-GB.ts         # canonical dictionary (existing copy, British)
      en-US.ts         # spelling variants
      zh-Hans.ts       # 简体中文
      zh-Hant.ts       # 繁體中文
    types.ts           # TranslationDictionary type derived from en-GB (compile-time key parity)
```

- **`config.ts` refactor:** locale-invariant data (urls, emails, social links, dateRanges, skill
  _names_ that stay in English, accentColor) stays in `siteConfig`. Locale-variant copy
  (headings, descriptions, bullets, labels) moves into the per-locale `translations/*` dictionaries
  keyed by stable dot-paths (e.g. `about.heading`, `experience.items.0.bullets.1`).
- **Routing (`gatsby-node.ts` `onCreatePage`):** for each auto-created page, delete the original and
  recreate one page per locale with `pageContext.locale` and path prefix
  (`/` for en-GB, `/en-US/`, `/zh-Hans/`, `/zh-Hant/`, plus alias `/en-GB/`). Default locale keeps
  the root path. 404 stays unprefixed.
- **Runtime:** wrap pages with `<LocaleProvider locale={pageContext.locale}>` (via
  `wrapPageElement` in `gatsby-browser.ts` + `gatsby-ssr.ts`). Components call
  `const { t } = useLocale()` instead of reading raw `siteConfig` copy.
- **Switcher (`LanguageSwitcher.tsx`):** rendered in `SiteHeader` (desktop nav + mobile menu).
  Flag emoji/SVG + locale label per language; switching navigates to the same logical page in the
  target locale via `localizePath`, preserving hash (`#about`, etc.). Has `aria-label`,
  keyboard-operable, marks current locale with `aria-current`.
- **SEO per locale:**
  - `Head.tsx` gains a `locale` prop → sets localized `<title>`/`<meta>`/OG/Twitter, `og:locale`,
    `<html lang>` (via `gatsby-ssr.ts onRenderBody setHtmlAttributes`), `<link rel="canonical">`,
    and `<link rel="alternate" hreflang="…">` for all four locales + `x-default`.
  - `schemas.ts` builders take the active dictionary so JSON-LD `name`/`jobTitle`/`description`
    are localized; add `inLanguage` to WebSite/ProfilePage schemas.
  - Localized markdown mirrors: `index.md` → per-locale alternates referenced from each page's Head.
  - `robots.txt`/`llms.txt`: keep single robots; update `llms.txt` to list localized URLs; ensure
    sitemap includes every locale URL with hreflang annotations (configure
    `gatsby-plugin-sitemap` `serialize`/`resolvePages`).

---

## Agent Orchestration

Implementation is **TDD-first**: for each unit of work, `test-writer` writes failing tests against
the agreed behavior, the **main agent** implements until green, then `code-reviewer` reviews. The
`debugger` is invoked only when typecheck/tests fail and the cause is non-obvious.

| Agent                        | Path                                         | Role in this plan                                                                  |
| ---------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| **test-writer**              | `.claude/agents/test-writer.md`              | Jest/RTL tests for i18n core, LanguageSwitcher, localized components, SEO/schemas. |
| **senior-frontend-engineer** | `.claude/agents/senior-frontend-engineer.md` | Implements i18n infra, routing, switcher, component refactors, SEO wiring.         |
| **code-reviewer**            | `.claude/agents/code-reviewer.md`            | Reviews each milestone + final PR for correctness, a11y, SEO, typing, test cover.  |
| **debugger**                 | `.claude/agents/debugger.md`                 | Diagnoses failing tests / TS errors / broken SSR builds.                           |
| **e2e (skill)**              | `.claude/skills/e2e-testing/SKILL.md`        | Playwright specs for switching, locale URLs, hreflang, persisted locale.           |

Issue tracking: create a `bd` epic + child issues before coding (`bd create … -t epic`,
children with `--deps discovered-from:<epic>`); claim each before work, close on completion.

### Agent escalation flow

```
                         ┌─────────────────────────┐
                         │      Main agent          │
                         │ (implements + commits)   │
                         └────────────┬─────────────┘
                                      │ writes code for a milestone
                                      ▼
         ┌───────────────────────────────────────────────┐
         │  test-writer (TDD: failing tests first)        │
         └───────────────────────┬───────────────────────┘
                                 │ tests exist
                                 ▼
                    ┌────────────────────────┐    pass
                    │ Run typecheck + jest    │──────────────┐
                    └────────────┬───────────┘               │
                                 │ fail                       ▼
                                 ▼                  ┌────────────────────┐
                       ┌──────────────────┐         │   code-reviewer    │
                       │     debugger      │        │ (review milestone) │
                       │ isolate + fix     │        └─────────┬──────────┘
                       └─────────┬────────┘                   │ findings
                                 │ green                       ▼
                                 └──────────────►   main agent applies fixes
                                                          │
                                                          ▼
                                              next milestone / open PR
                                                          │
                                                          ▼
                                       code-reviewer reviews full PR → fixes → merge
```

Parallelization: `test-writer` and `code-reviewer` run in parallel only on _different_ milestones
(reviewer on milestone N-1 while test-writer specs milestone N). Within a milestone the order is
test → implement → review.

---

## Example Task Prompts

### test-writer (i18n core)

```
Task(subagent_type="test-writer", prompt="Write failing Jest tests for the i18n core at
src/i18n/. Create src/i18n/translations/__tests__/parity.test.ts asserting all four dictionaries
(en-GB, en-US, zh-Hans, zh-Hant) expose identical key sets to en-GB. Create
src/i18n/LocaleContext.test.tsx covering: useLocale() returns the provided locale; t('about.heading')
resolves from the active dictionary; t() of a missing key falls back to en-GB and warns. Mock nothing
external; render via the project's test-utils.")
```

### senior-frontend-engineer (switcher)

```
Task(subagent_type="senior-frontend-engineer", prompt="Implement src/components/LanguageSwitcher/
LanguageSwitcher.tsx and integrate into SiteHeader (desktop nav + mobile menu). Render flag + locale
label for en-GB/en-US/zh-Hans/zh-Hant, mark active with aria-current='true', be keyboard-operable
with an accessible aria-label, and navigate via i18n localizePath preserving the current hash. Make
src/i18n/LanguageSwitcher tests green. Follow existing Tailwind/dark-mode conventions in SiteHeader.")
```

### code-reviewer (final PR)

```
Task(subagent_type="code-reviewer", prompt="Review the i18n localization PR. Focus on: locale routing
correctness in gatsby-node.ts, no untranslated/hardcoded strings remaining (grep components), a11y of
the switcher and localized aria-labels, SEO correctness (hreflang/x-default/canonical, og:locale,
localized JSON-LD inLanguage, sitemap per-locale URLs), React 19 + Gatsby Head API SSR safety,
TypeScript key-parity typing, and unit/e2e coverage adequacy. List blocking vs non-blocking issues.")
```

### debugger (if build/SSR fails)

```
Task(subagent_type="debugger", prompt="Investigate failures: <paste exact gatsby build / jest /
tsc output>. i18n routing was added in gatsby-node.ts onCreatePage and LocaleProvider wired via
wrapPageElement in gatsby-ssr.ts/gatsby-browser.ts. Isolate the root cause and apply a minimal fix.")
```

---

## Implementation Steps (Summary)

> Each step is TDD: **(T)** test-writer authors failing tests → **(I)** main / senior-frontend-engineer
> implements to green → **(R)** code-reviewer reviews. Mark `[x]` when the responsible agent completes.

- [ ] **0. Setup & tracking** — Create `bd` epic + child issues; create feature branch. _(main)_
- [ ] **1. i18n core** _(T → I → R)_ — `src/i18n/` config, types (compile-time key parity),
      `LocaleContext`, `useLocale`, `t()` with en-GB fallback + dev warning. Dictionary skeleton.
- [ ] **2. Extract & translate content** _(T → I)_ — Move locale-variant copy out of `config.ts`
      into `translations/en-GB.ts`; generate `en-US` (spelling), `zh-Hans`, `zh-Hant` (machine
      translation). Parity test green. Include every string from `config.ts` + component a11y labels.
- [ ] **3. Locale routing** _(T → I → R)_ — `gatsby-node.ts onCreatePage` emits per-locale pages
      (`/`, `/en-GB/` alias, `/en-US/`, `/zh-Hans/`, `/zh-Hant/`) with `pageContext.locale`; wire
      `LocaleProvider` via `wrapPageElement` in `gatsby-ssr.ts` + `gatsby-browser.ts`.
- [ ] **4. Refactor components to `t()`** _(T → I → R)_ — SiteHeader, Hero, About, Projects,
      Experience, Education, GitHubActivity, SiteFooter, ThemeToggle, ContactForm, contact-form page, 404. Replace all hardcoded strings + `aria-label`/`alt`/`title`/`placeholder` with `t()`.
- [ ] **5. Language switcher** _(T → I → R)_ — `LanguageSwitcher` in header (desktop + mobile),
      flag + locale text, `aria-current`, keyboard a11y, hash-preserving navigation, optional
      `localStorage` persistence + redirect on root visit.
- [ ] **6. SEO & metadata** _(T → I → R)_ — `Head.tsx` localized title/desc/OG/Twitter +
      `og:locale`, `<html lang>` via `gatsby-ssr`, canonical + hreflang (4 locales + `x-default`);
      localize `schemas.ts` JSON-LD + `inLanguage`; per-locale `.md` mirrors; update `llms.txt`;
      sitemap per-locale URLs with hreflang; verify `robots.txt`.
- [ ] **7. Unit tests pass** _(R)_ — Update/extend all affected `*.test.tsx`; `jest` green;
      `tsc --noEmit` clean; `gatsby build` (SSR) succeeds.
- [ ] **8. E2E tests** _(e2e skill)_ — Playwright: switch each locale, assert URL + visible
      translated content + `<html lang>` + hreflang tags + persisted choice; update existing specs
      (header-navigation, structured-data) for locale awareness.
- [ ] **9. Final review + PR** _(R → I)_ — Open PR to `develop`; run `code-reviewer` on full diff;
      implement fixes via senior-frontend-engineer/debugger; re-review until clean.
- [ ] **10. Land the plane** — `bd` issues closed, quality gates green, push, PR ready.

```

```
