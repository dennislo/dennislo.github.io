# Plan: Playwright E2E Testing

## Overview

Set up Playwright for end-to-end testing of the Gatsby site. This includes creating a Claude skill document for E2E best practices, installing dependencies, adding npm scripts, configuring Playwright to work with Gatsby's dev server, and writing initial E2E tests for the theme toggler and contact form.

---

## Architecture

Playwright will run against the Gatsby dev server (`gatsby develop` on port 8000). Tests live in `src/test-e2e/` — separate from the Jest unit tests in `src/` — to keep the two test ecosystems cleanly separated.

### Key design decisions:

- **Playwright config** lives at the project root (`playwright.config.ts`) alongside `jest.config.js`.
- **`webServer` config** in `playwright.config.ts` will auto-start `gatsby develop` before tests and shut it down after, so no manual server management is needed.
- **Test directory:** `src/test-e2e/` (not `e2e/` or `tests/`) per the user's request.
- **Browsers:** Chromium only for now to keep CI fast. Can expand to Firefox/WebKit later.
- **Base URL:** `http://localhost:8000` (Gatsby default dev port).
- **No interference with Jest:** Playwright uses its own config and test runner. The existing `npm test` (Jest) remains unchanged. New scripts use the `test:e2e` prefix.

### Files to Create / Modify

#### New files:

1. **`.claude/skills/e2e-testing/SKILL.md`** — Claude skill document covering Playwright E2E best practices, configuration, patterns, and templates specific to this project.
2. **`playwright.config.ts`** — Playwright configuration: base URL, webServer, test directory, browser projects, timeouts.
3. **`src/test-e2e/theme-toggle.spec.ts`** — E2E tests for the theme toggle: toggling between light/dark, persistence across navigation, visual state changes.
4. **`src/test-e2e/contact-form.spec.ts`** — E2E tests for the contact form: navigation, field validation, form submission flow, accessibility.

#### Modified files:

5. **`package.json`** — Add `@playwright/test` to devDependencies, add `test:e2e`, `test:e2e:ui`, and `test:e2e:headed` scripts.
6. **`.gitignore`** — Add Playwright artifacts: `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`.

---

## Component / Module Structure

```
project root
├── playwright.config.ts              ← NEW (Playwright config)
├── package.json                      ← MODIFIED (new scripts + dependency)
├── .gitignore                        ← MODIFIED (Playwright artifacts)
├── .claude/
│   └── skills/
│       ├── unit-testing/SKILL.md     (existing)
│       ├── create-plan/SKILL.md      (existing)
│       └── e2e-testing/SKILL.md      ← NEW (E2E skill doc)
└── src/
    └── test-e2e/
        ├── theme-toggle.spec.ts      ← NEW
        └── contact-form.spec.ts      ← NEW
```

### Playwright config shape:

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/test-e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:8000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run develop",
    url: "http://localhost:8000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### npm scripts to add:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed"
}
```

---

## Testing Plan

### `src/test-e2e/theme-toggle.spec.ts`

1. Page loads with a theme (dark or light depending on time-of-day logic)
2. Theme toggle button is visible and clickable
3. Clicking toggle switches `data-theme` attribute on `<html>` from one theme to the other
4. Background colour and text colour change after toggling
5. Theme persists in localStorage after toggle (manual theme source)
6. Theme persists after navigating to `/contact-form` and back
7. Toggle button shows the correct icon (sun vs moon) for the current theme

### `src/test-e2e/contact-form.spec.ts`

8. Navigate to `/contact-form` — page loads with heading "Contact"
9. All form fields are present: first name, last name, mobile, email, message
10. Submitting empty form shows validation errors on all required fields
11. Entering invalid email shows email validation error on blur
12. Entering invalid mobile format shows mobile validation error on blur
13. Entering a message under 10 characters shows message length error
14. Back link navigates to homepage (`/`)
15. Form fields use theme-aware colours (input borders, background match current theme)

---

## Agent Orchestration

Use the custom Claude agents defined in `.claude/agents/` as subagents during implementation. This keeps the main context focused on orchestration while delegating specialized work.

### Available Agents

| Agent             | Path                              | Role                                                              | Tools                               |
| ----------------- | --------------------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

### Agent Usage Per Implementation Step

#### Step 1 — Create E2E skill document (main agent)

- **Do it yourself** (main agent). Write `.claude/skills/e2e-testing/SKILL.md` following the format of the existing `unit-testing/SKILL.md`. Cover: Playwright overview, configuration reference, test structure, best practices (locators, assertions, waiting, page objects), template tests, common patterns (navigation, forms, theme testing, localStorage), and debugging tips.

#### Step 2 — Install Playwright and configure project (main agent)

- **Do it yourself** (main agent). Run `npm install -D @playwright/test` and `npx playwright install chromium`. Create `playwright.config.ts`. Update `package.json` scripts. Update `.gitignore`.

#### Step 3 — Write E2E tests (main agent)

- **Do it yourself** (main agent). Create `src/test-e2e/theme-toggle.spec.ts` and `src/test-e2e/contact-form.spec.ts` with the test cases listed in the Testing Plan.

#### Step 4 — Code Review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the new Playwright E2E testing setup. Files to review: .claude/skills/e2e-testing/SKILL.md, playwright.config.ts, src/test-e2e/theme-toggle.spec.ts, src/test-e2e/contact-form.spec.ts, and the changes to package.json and .gitignore. Focus on: Playwright best practices (prefer role-based locators, avoid hardcoded waits, use web-first assertions), test isolation, correct Gatsby dev server config, proper use of CSS variable assertions for theme tests, form validation test coverage, and consistency with the project's existing patterns.")
  ```
- Address any Critical or Warning findings before proceeding.

#### Step 5 — Run E2E tests

- Run `npm run test:e2e` from the main agent. Also run `npm run typecheck` to verify the new `.ts` files compile.

#### Step 6 — Debug Failures (if any)

- **Delegate to `debugger`** via the Task tool (only if step 5 fails):
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following Playwright E2E test failures: <paste error output>. The Playwright config is at playwright.config.ts. Tests are in src/test-e2e/theme-toggle.spec.ts and src/test-e2e/contact-form.spec.ts. The site runs on gatsby develop at localhost:8000. Check: is the dev server starting correctly? Are selectors finding the right elements? Are there timing issues?")
  ```
- Re-run E2E tests after fixes.

#### Step 7 — Final Code Review

- **Delegate to `code-reviewer`** for a final pass after all fixes:
  ```
  Task(subagent_type="code-reviewer", prompt="Final review of the complete Playwright E2E testing setup. Check all new/modified files: .claude/skills/e2e-testing/SKILL.md, playwright.config.ts, src/test-e2e/theme-toggle.spec.ts, src/test-e2e/contact-form.spec.ts, package.json, .gitignore. Verify test coverage is adequate for the theme toggler and contact form, no flaky test patterns exist, the skill doc is comprehensive, and the setup integrates cleanly with the existing project.")
  ```

### Parallelization Opportunities

- Steps 1 (skill doc) and 2 (install + config) are independent and can run sequentially but quickly since they're both main-agent work.
- Step 4 (code review) can begin as soon as step 3 completes — no dependency on running the tests first.
- If the debugger fixes code in step 6, re-run both code-reviewer and the test suite afterward.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Writes skill doc (Step 1)
│   └─ .claude/skills/e2e-testing/SKILL.md
│
├─ Installs deps + configures (Step 2)
│   ├─ package.json (scripts + dependency)
│   ├─ playwright.config.ts
│   └─ .gitignore
│
├─ Writes E2E tests (Step 3)
│   ├─ src/test-e2e/theme-toggle.spec.ts
│   └─ src/test-e2e/contact-form.spec.ts
│
├─ Delegates:
│   └─ code-reviewer → reviews all new files (Step 4)
│
├─ Runs test:e2e + typecheck (Step 5)
│
├─ If failures → debugger (Step 6) → re-run Step 5
│
└─ Final code-reviewer pass (Step 7)
```

---

## Implementation Steps (Summary)

1. Main agent: create `.claude/skills/e2e-testing/SKILL.md` — E2E testing best practices skill document.
2. Main agent: install `@playwright/test` + Chromium, create `playwright.config.ts`, add npm scripts, update `.gitignore`.
3. Main agent: write `src/test-e2e/theme-toggle.spec.ts` (7 tests) and `src/test-e2e/contact-form.spec.ts` (8 tests).
4. **Agent: code-reviewer** — Review all new files for Playwright best practices, test quality, and project consistency.
5. Run `npm run test:e2e` and `npm run typecheck`.
6. **Agent: debugger** — Fix any failures from step 5. _(Only if needed.)_
7. **Agent: code-reviewer** — Final review pass.
