# Plan: Markdown Source Alternate Routes

## Overview

Make clean Markdown source available for every current Gatsby page by publishing direct `.md` alternate routes.

GitHub Pages serves static files and does not perform server-side content negotiation based on query strings. Because of
that, do not implement a `?md=true` query-string feature, client-side redirects, or route negotiation. Instead, each
HTML page should have a stable Markdown sibling route:

- `/` → `/index.md`
- `/contact-form` → `/contact-form.md`
- `/404` → `/404.md`

This follows the "Layer 4: Content formatting for agent parsing" guidance from Addy Osmani's Agentic Engine
Optimization article:

- serve Markdown, not only HTML
- keep the Markdown path free of navigation, breadcrumbs, visual chrome, and footer noise
- use consistent heading hierarchy
- front-load the useful context
- structure sections for scanning with concise lists and tables where helpful

---

## Architecture

The feature should add a static Markdown-source layer alongside the current rendered Gatsby pages.

It consists of three parts:

1. **Direct Markdown files** — static `.md` files in `static/` that Gatsby copies to the site root.
2. **Discovery metadata** — `rel="alternate"` links in Gatsby `Head` exports.
3. **Agent index updates** — `llms.txt` entries that advertise the direct Markdown source routes.

No React redirect component, route-mapping helper, query-string parser, or `Layout` integration is needed.

### Supported routes

Cover all current public Gatsby routes:

| Page route        | Alternate Markdown route |
| ----------------- | ------------------------ |
| `/`               | `/index.md`              |
| `/contact-form`   | `/contact-form.md`       |
| `/404` or `/404/` | `/404.md`                |

Future pages should add their own direct Markdown sibling route as part of page implementation.

---

## Files To Create / Modify

### New files

1. **`static/index.md`** — Clean Markdown source for the homepage.
2. **`static/contact-form.md`** — Clean Markdown source for the contact page.
3. **`static/404.md`** — Clean Markdown source for the 404 page.
4. **`src/test-e2e/markdown-source.spec.ts`** — Playwright coverage for direct Markdown source routes.

### Modified files

5. **`src/pages/index.tsx`** — Add Markdown alternate link metadata through the Gatsby `Head` export.
6. **`src/pages/contact-form.tsx`** — Add Markdown alternate link metadata.
7. **`src/pages/404.tsx`** — Add Markdown alternate link metadata.
8. **`static/llms.txt`** — Advertise direct Markdown source routes.

---

## Markdown Content Structure

Each Markdown source file should be manually authored from the same facts used by the rendered page, primarily
`src/config.ts`. Do not scrape rendered HTML.

### Shared rules

- Start with exactly one H1.
- The first 200 words should answer:
  - what this page is
  - what Dennis Lo or Agile IT & Software Limited can help with
  - what an agent should read first
- Use H2 then H3 hierarchy without skipping levels.
- Exclude visual navigation, theme controls, layout wrappers, decorative copy, and footer chrome.
- Use concise bullets for services, skills, projects, and contact options.
- Use tables when they make structured data easier to parse than prose.
- Use root-relative links for internal pages.
- Include direct contact and external profile links where useful.

### Homepage Markdown outline

```md
# Who is DLO?

Personal website of Dennis Lo, IT consultant and software engineer...

## Summary

...

## Services

...

## Skills

...

## Client Sectors

...

## Projects

...

## Experience

...

## Education

...

## Contact

...
```

### Contact form Markdown outline

```md
# Contact Dennis Lo

Use this page to contact Dennis Lo about IT consultancy...

## Best For

...

## Contact Options

...

## Related Pages

...
```

### 404 Markdown outline

```md
# Page Not Found

The requested page does not exist...

## Useful Destinations

...
```

---

## Discovery Metadata

### Page head links

Each supported page should expose a Markdown alternate link:

```tsx
<link rel="alternate" type="text/markdown" href="/index.md" />
```

Use the page-specific Markdown route for each Gatsby page:

| Gatsby page file             | Alternate link href |
| ---------------------------- | ------------------- |
| `src/pages/index.tsx`        | `/index.md`         |
| `src/pages/contact-form.tsx` | `/contact-form.md`  |
| `src/pages/404.tsx`          | `/404.md`           |

### `llms.txt`

Update `static/llms.txt` so agents can discover the direct Markdown source routes without executing JavaScript.

Add a compact section such as:

```md
## Markdown Sources

Clean Markdown source is available at direct `.md` routes.

- [Homepage Markdown](/index.md): Clean source for the homepage profile, services, projects, experience, and education.
- [Contact Markdown](/contact-form.md): Clean source for contact intent and contact options.
- [404 Markdown](/404.md): Clean source for fallback navigation.
```

Keep `llms.txt` compact and task-oriented.

---

## Testing Plan

### Page metadata tests

Update existing page tests to assert the `Head` output includes:

1. `rel="alternate"` and `type="text/markdown"` for `/index.md`.
2. `rel="alternate"` and `type="text/markdown"` for `/contact-form.md`.
3. `rel="alternate"` and `type="text/markdown"` for `/404.md`.

### E2E tests

Use Playwright to validate:

4. Visiting `http://localhost:8000/index.md` renders visible Markdown text with the homepage H1.
5. Visiting `http://localhost:8000/contact-form.md` renders visible Markdown text with the contact H1.
6. Visiting `http://localhost:8000/404.md` renders visible Markdown text with the 404 H1.
7. Visiting `http://localhost:8000/` still renders the existing HTML homepage.
8. Visiting `http://localhost:8000/contact-form` still renders the existing HTML contact page.

Do not add tests for `?md=true`; that behavior is intentionally out of scope.

### Quality gates

Run:

```bash
npm run typecheck
npm test
npm run test:e2e
```

If e2e coverage is not added, replace `npm run test:e2e` with manual browser QA using
`.agent/skills/manual-testing/SKILL.md`.

---

## Agent Orchestration

Use the repo-specific agents and skills during implementation.

### Available Agents

| Agent                        | Path                                         | Role                                                              | Tools                               |
| ---------------------------- | -------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| **senior-frontend-engineer** | `.claude/agents/senior-frontend-engineer.md` | Implements Gatsby, React, and TypeScript UI changes               | Read, Glob, Grep, Bash, Edit, Write |
| **test-writer**              | `.claude/agents/test-writer.md`              | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer**            | `.claude/agents/code-reviewer.md`            | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**                 | `.claude/agents/debugger.md`                 | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

### Agent Usage Per Implementation Step

#### Step 1 — Implement Markdown source files and metadata

- **Use `senior-frontend-engineer` guidance.** Add the static Markdown source files, page head alternate links, and
  `llms.txt` update. Do not add query-string handling or client-side redirects.

#### Step 2 — Write unit tests

- **Delegate to `test-writer`** via the Task tool:
  ```
  Task(subagent_type="test-writer", prompt="Write Jest and React Testing Library coverage for the direct Markdown source route feature. Update page Head tests for index, contact-form, and 404 to assert rel='alternate' type='text/markdown' links with hrefs /index.md, /contact-form.md, and /404.md. Do not add tests for ?md=true or any redirect component.")
  ```

#### Step 3 — Add e2e coverage

- **Use `.claude/skills/e2e-testing/SKILL.md`** and add Playwright assertions for direct `.md` availability and normal
  HTML route behavior.

#### Step 4 — Code review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the direct Markdown source route implementation. Focus on GitHub Pages static compatibility, clean Markdown content for agent parsing, correct rel='alternate' metadata, llms.txt discoverability, and test coverage. Verify no ?md=true query-string feature, redirect component, route-mapping helper, or Layout integration was added.")
  ```

#### Step 5 — Run quality gates

- Run `npm run typecheck`, `npm test`, and `npm run test:e2e`.

#### Step 6 — Debug failures if needed

- **Delegate to `debugger`** via the Task tool only if quality gates fail:
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following failures from the direct Markdown source route feature: <paste exact error output>. The feature adds static Markdown files, page Head alternate links, llms.txt updates, and related tests. It should not implement ?md=true redirects.")
  ```

### Parallelization Opportunities

- Step 2 unit test writing can run after the page head metadata shape is known.
- Step 4 code review can run in parallel with e2e test writing if the implementation files are stable.
- Step 6 should run only after failures are reproduced with exact command output.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Implements direct Markdown source support
│   ├─ static/*.md files
│   ├─ page Head alternate links
│   └─ llms.txt discovery updates
│
├─ Delegates:
│   ├─ test-writer → page metadata tests
│   ├─ e2e-testing skill → direct Markdown route coverage
│   └─ code-reviewer → static compatibility, parsing quality, coverage
│
├─ Runs typecheck + Jest + Playwright
│
├─ If failures → debugger → re-run failed gates
│
└─ Final code-reviewer pass if debugger changes behavior
```

---

## Implementation Steps (Summary)

1. [ ] Main agent: create clean Markdown source files for `/`, `/contact-form`, and `/404`.
2. [ ] Main agent: add Markdown alternate links to page `Head` exports.
3. [ ] Main agent: update `static/llms.txt` with direct Markdown source discovery.
4. [ ] **Agent: test-writer** — Add page metadata tests for the alternate Markdown links.
5. [ ] **Skill: e2e-testing** — Add Playwright coverage for direct Markdown files and unchanged HTML routes.
6. [ ] **Agent: code-reviewer** — Review implementation for correctness, static-hosting constraints, AEO Layer 4
       alignment, and test adequacy.
7. [ ] Run `npm run typecheck`, `npm test`, and `npm run test:e2e`.
8. [ ] **Agent: debugger** — Use only if quality gates fail, then rerun the failed gates.
9. [ ] Final review and handoff.
