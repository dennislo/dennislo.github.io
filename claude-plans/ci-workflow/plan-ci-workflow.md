# Plan: GitHub Actions CI Workflow

## Overview

Add a GitHub Actions CI workflow that runs format checking, linting, TypeScript type checking, unit tests, and E2E tests. The workflow triggers on **every PR** (regardless of target branch) and on pushes to `develop` (i.e., when PRs are merged). ESLint must be added to the project first since no linting setup currently exists.

---

## Architecture

The workflow will be a single YAML file with parallel jobs for fast feedback. Each check runs independently so failures are isolated and easy to diagnose.

**Key decisions:**

- **Parallel jobs** — format, lint, typecheck, and unit tests run concurrently since they're independent. E2E tests run in a separate job that needs a Gatsby dev server.
- **Prettier `--check`** — uses `prettier --check .` (read-only) instead of `--write` to detect unformatted code without modifying files.
- **ESLint setup** — add `eslint` with `@typescript-eslint` and `eslint-plugin-react` since this is a TypeScript/React project. Use flat config format (`eslint.config.mjs`).
- **Node version** — pin to Node 20 (LTS) and add an `.nvmrc` for local consistency.
- **Caching** — use `actions/setup-node`'s built-in npm cache to speed up installs.
- **Playwright caching** — cache Playwright browser binaries to avoid re-downloading on every run.

### Files to Create / Modify

#### New files:

1. **`.github/workflows/ci.yml`** — CI workflow with format, lint, typecheck, unit test, and E2E test jobs
2. **`eslint.config.mjs`** — ESLint flat config for TypeScript + React
3. **`.nvmrc`** — Pin Node version to 20

#### Modified files:

4. **`package.json`** — Add `lint` script, ESLint devDependencies

---

## Workflow Structure

```
ci.yml
├── Triggers
│   ├── pull_request → all branches (every PR triggers CI)
│   └── push → develop (merged PRs)
│
├── Job: format
│   └── prettier --check .
│
├── Job: lint
│   └── npx eslint .
│
├── Job: typecheck
│   └── tsc --noEmit
│
├── Job: unit-tests
│   └── jest
│
└── Job: e2e-tests
    ├── npm run build (Gatsby production build)
    ├── npx playwright install --with-deps chromium
    └── playwright test
```

### Workflow YAML (key structure)

```yaml
name: CI

on:
  pull_request: # Runs on every PR, regardless of target branch
  push:
    branches: [develop]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "npm"
      - run: npm ci
      - run: npx prettier --check .

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "npm"
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "npm"
      - run: npm ci
      - run: npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "npm"
      - run: npm ci
      - run: npm test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test
        env:
          CI: true
```

**E2E note:** The Playwright config's `webServer` starts `npm run develop`, which is fine locally but slow in CI. For CI, we'll build with `npm run build` and serve with `gatsby serve` instead, controlled via an environment variable or a CI-specific Playwright config override. The simplest approach: update `playwright.config.ts` to use `gatsby serve` (port 9000) when `CI=true`.

---

## ESLint Configuration

```javascript
// eslint.config.mjs
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    plugins: { react: reactPlugin },
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform
    },
  },
  {
    ignores: ["node_modules/", "public/", ".cache/", "*.js"], // Ignore JS config files
  },
);
```

---

## Testing Plan

No new test files — this plan adds CI infrastructure and linting config. Verification is:

1. `npx prettier --check .` passes locally
2. `npm run lint` passes locally (after ESLint setup)
3. `npm run typecheck` passes locally
4. `npm test` passes locally
5. `npm run test:e2e` passes locally
6. Push a test branch and verify the workflow runs on a PR to `develop`

---

## Agent Orchestration

Use the custom Claude agents defined in `.claude/agents/` as subagents during implementation. This keeps the main context focused on orchestration while delegating review, testing, and debugging to subagents.

### Available Agents

| Agent             | Path                              | Role                                                              | Tools                               |
| ----------------- | --------------------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

### Agent Usage Per Implementation Step

#### Step 1 — Install ESLint dependencies (main agent)

- **Do it yourself** (main agent). Run `npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react typescript-eslint`.

#### Step 2 — Create ESLint config (main agent)

- **Do it yourself** (main agent). Create `eslint.config.mjs` with TypeScript + React rules. Add `"lint": "eslint . --ext .ts,.tsx"` to `package.json` scripts.

#### Step 3 — Create `.nvmrc` (main agent)

- **Do it yourself** (main agent). Create `.nvmrc` with `20`.

#### Step 4 — Update Playwright config for CI (main agent)

- **Do it yourself** (main agent). Update `playwright.config.ts` so that when `CI=true`, it uses `gatsby serve` on port 9000 instead of `gatsby develop` on port 8000.

#### Step 5 — Create CI workflow file (main agent)

- **Do it yourself** (main agent). Create `.github/workflows/ci.yml` with all 5 jobs.

#### Step 6 — Code Review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the CI workflow and ESLint setup changes. Files to review: .github/workflows/ci.yml, eslint.config.mjs, playwright.config.ts, package.json, .nvmrc. Focus on: GitHub Actions best practices, security (no secrets leakage), correct trigger configuration, ESLint rule appropriateness for a Gatsby/React/TypeScript project, Playwright CI configuration.")
  ```

#### Step 7 — Run all checks locally

- Run `npx prettier --check .`, `npm run lint`, `npm run typecheck`, and `npm test` from the main agent.

#### Step 8 — Debug Failures (if any)

- **Delegate to `debugger`** via the Task tool (only if step 7 fails):
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following failures: <paste error output>. Context: Added ESLint config (eslint.config.mjs), CI workflow (.github/workflows/ci.yml), and updated playwright.config.ts for CI builds.")
  ```
- Re-run checks after fixes.

#### Step 9 — Final Code Review

- **Delegate to `code-reviewer`** for a final pass after all fixes:
  ```
  Task(subagent_type="code-reviewer", prompt="Final review of the complete CI workflow feature. Check all new/modified files: .github/workflows/ci.yml, eslint.config.mjs, playwright.config.ts, package.json, .nvmrc. Verify the workflow triggers are correct (all PRs + push to develop), all 5 checks are covered, and ESLint config is appropriate.")
  ```

### Parallelization Opportunities

- Steps 1–5 are sequential (each builds on the previous).
- Steps 6 (code review) can run while step 7 (local checks) runs — launch in parallel.
- If the debugger fixes code in step 8, re-run both code-reviewer and the checks afterward.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Installs ESLint deps (Step 1)
├─ Creates eslint.config.mjs + lint script (Step 2)
├─ Creates .nvmrc (Step 3)
├─ Updates playwright.config.ts for CI (Step 4)
├─ Creates .github/workflows/ci.yml (Step 5)
│
├─ Delegates in parallel:
│   ├─ code-reviewer → review all new/modified files (Step 6)
│   └─ Runs local checks: prettier, lint, typecheck, test (Step 7)
│
├─ If failures → debugger (Step 8) → re-run Step 7
│
└─ Final code-reviewer pass (Step 9)
```

---

## Implementation Steps (Summary)

1. Install ESLint devDependencies: `eslint`, `typescript-eslint`, `eslint-plugin-react`.
2. Create `eslint.config.mjs` with TypeScript + React rules. Add `"lint"` script to `package.json`.
3. Create `.nvmrc` with Node 20.
4. Update `playwright.config.ts` to use `gatsby serve` (port 9000) when `CI=true`.
5. Create `.github/workflows/ci.yml` with 5 parallel jobs: format, lint, typecheck, unit-tests, e2e-tests.
6. **Agent: code-reviewer** — Review all new/modified files. _(Run in parallel with step 7.)_
7. Run `prettier --check`, `lint`, `typecheck`, and `test` locally.
8. **Agent: debugger** — Fix any failures from step 7. _(Only if needed.)_
9. **Agent: code-reviewer** — Final review pass.
