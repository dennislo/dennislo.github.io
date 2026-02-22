# Plan: ESLint Package Version Audit & Update

## Overview

Audit and update the ESLint ecosystem packages to the latest compatible versions for this Gatsby 5 / React 18 / TypeScript project. Ensure `npm run develop`, `npm run build`, and `npm run lint` all pass cleanly after changes.

---

## Research Findings: Latest Versions (Feb 2026)

### Our devDependencies (what we control)

| Package              | Currently Installed | Latest Available | Latest Compatible | Notes                                                                                       |
| -------------------- | ------------------- | ---------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `eslint`             | 9.39.3              | 10.0.1           | **9.39.3**        | ESLint 10 breaks `eslint-plugin-react` (`getFilename` API removed). Stay on v9.             |
| `typescript-eslint`  | 8.56.0              | 8.56.0           | **8.56.0**        | Supports ESLint ^8.57 \|\| ^9 \|\| ^10. Already at latest.                                 |
| `eslint-plugin-react`| 7.37.5              | 7.37.5           | **7.37.5**        | Supports ESLint up to ^9.7. No ESLint 10 support yet (issue [#3977][react-issue]). Already at latest. |

[react-issue]: https://github.com/jsx-eslint/eslint-plugin-react/issues/3977

**Conclusion: All three packages are already at their latest compatible versions.**

### Gatsby 5 internal ESLint (not our problem)

Gatsby 5 bundles its own `eslint@7.32.0` and legacy plugins (`eslint-config-react-app@6.0.0`, `@babel/eslint-parser@7.19.1`, `@typescript-eslint/*@5.62.0`). These are Gatsby's webpack dev overlay internals — they don't affect our lint CLI. The peer dependency warnings from `npm ls` are harmless because Gatsby's own `eslint@7.32.0` is nested in `node_modules/gatsby/node_modules/`, while our `eslint@9.39.3` lives at the root. The `--legacy-peer-deps` flag was needed during install to avoid npm's strict peer dep resolution blocking the install.

### Why not ESLint 10?

ESLint 10.0.1 was released Feb 2026, but:

- `eslint-plugin-react@7.37.5` is **broken** with ESLint 10 — `contextOrFilename.getFilename is not a function` (ESLint 10 removed the `RuleContext` API)
- The fix PR ([#3979](https://github.com/jsx-eslint/eslint-plugin-react/pull/3979)) is open but not merged
- We should revisit when `eslint-plugin-react` releases a v10-compatible version

---

## Architecture

### Current state analysis

The packages are already at their latest compatible versions. The remaining work is:

1. **Verify `--legacy-peer-deps` is persisted** — Without an `.npmrc` file, a clean `npm ci` in CI will fail because it uses strict peer dep resolution by default. We need to either add an `.npmrc` with `legacy-peer-deps=true` or ensure the `package-lock.json` was generated with that flag (which it was, so `npm ci` should work).
2. **Verify Gatsby commands work** — `npm run develop` and `npm run build` must not break from the ESLint peer dep hoisting.
3. **Verify `npm run lint` passes** — Already confirmed but re-verify as part of this plan.

### Files to Create / Modify

#### New files:

1. **`.npmrc`** — Add `legacy-peer-deps=true` so that `npm ci` and future `npm install` don't fail due to Gatsby's internal ESLint 7 peer dep conflicts with our ESLint 9.

#### Modified files:

None expected — packages are already at latest compatible versions.

---

## Testing Plan

1. Verify `.npmrc` with `legacy-peer-deps=true` allows clean `npm ci`
2. `npm run develop` — starts Gatsby dev server without errors (verify it builds, then kill)
3. `npm run build` — full production build completes
4. `npm run lint` — passes with zero errors
5. `npm run typecheck` — still passes
6. `npm test` — all unit tests pass

---

## Agent Orchestration

### Available Agents

| Agent             | Path                              | Role                                                              | Tools                               |
| ----------------- | --------------------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

### Agent Usage Per Implementation Step

#### Step 1 — Create `.npmrc` (main agent)

- **Do it yourself** (main agent). Create `.npmrc` with `legacy-peer-deps=true` to prevent npm peer dep resolution failures caused by Gatsby 5's internal ESLint 7 conflicting with our ESLint 9.

#### Step 2 — Verify Gatsby develop and build (main agent)

- **Do it yourself** (main agent). Run `npm run develop` (wait for successful compilation, then kill), and `npm run build`. Both must succeed.

#### Step 3 — Verify lint, typecheck, tests (main agent)

- **Do it yourself** (main agent). Run `npm run lint`, `npm run typecheck`, and `npm test`.

#### Step 4 — Debug Failures (if any)

- **Delegate to `debugger`** via the Task tool (only if steps 2–3 fail):
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following failures: <paste error output>. Context: ESLint 9.39.3 with typescript-eslint 8.56.0 and eslint-plugin-react 7.37.5 are installed alongside Gatsby 5 which bundles its own internal ESLint 7. An .npmrc with legacy-peer-deps=true was added. Files: .npmrc, eslint.config.mjs, package.json.")
  ```

#### Step 5 — Code Review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the .npmrc file at /Users/dlo/work/dennislo.github.io/.npmrc. Verify that legacy-peer-deps=true is the right approach for resolving Gatsby 5's internal ESLint 7 peer dep conflicts with our root ESLint 9. Also check that package.json devDependencies use appropriate version ranges for eslint, typescript-eslint, and eslint-plugin-react.")
  ```

### Parallelization Opportunities

- Steps 2 (Gatsby verify) and 3 (lint/typecheck/test) are independent and can run in parallel.
- Step 5 (code review) can run in parallel with steps 2–3.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Creates .npmrc (Step 1)
│
├─ Runs in parallel:
│   ├─ Verify gatsby develop + build (Step 2)
│   └─ Verify lint, typecheck, tests (Step 3)
│
├─ If failures → debugger (Step 4) → re-run Steps 2–3
│
└─ code-reviewer → review .npmrc and package.json (Step 5)
```

---

## Implementation Steps (Summary)

1. Create `.npmrc` with `legacy-peer-deps=true`.
2. Verify `npm run develop` and `npm run build` succeed. _(Run in parallel with step 3.)_
3. Verify `npm run lint`, `npm run typecheck`, and `npm test` pass. _(Run in parallel with step 2.)_
4. **Agent: debugger** — Fix any failures from steps 2–3. _(Only if needed.)_
5. **Agent: code-reviewer** — Review `.npmrc` and `package.json` dependency versions.
