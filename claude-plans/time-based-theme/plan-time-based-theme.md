# Plan: Time-Based Auto Theme Selection

## Overview

Automatically set the theme to **light** between 7:30 AM and 7:30 PM (browser local time), and **dark** otherwise. The user can still override the theme via the toggle button in the top right.

## Current Behavior

- `ThemeContext.tsx` defaults to `"dark"`
- On mount, it checks `localStorage.getItem("theme")` for a saved preference
- `toggleTheme` flips the theme and persists it to `localStorage`
- The saved preference persists forever across visits

## Proposed Changes

### 1. Add `getTimeBasedTheme()` helper to `ThemeContext.tsx`

A pure function that returns `"light"` if the current browser time is between 7:30 AM and 7:30 PM, and `"dark"` otherwise.

```typescript
function getTimeBasedTheme(): Theme {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;
  const startLight = 7 * 60 + 30;  // 7:30 AM = 450 minutes
  const endLight = 19 * 60 + 30;   // 7:30 PM = 1170 minutes
  return timeInMinutes >= startLight && timeInMinutes < endLight ? "light" : "dark";
}
```

### 2. Modify `ThemeProvider` initialization logic

**New behavior:**
- Track whether the user has manually overridden the theme via a separate `localStorage` key: `"theme-source"` (`"auto"` | `"manual"`)
- On mount:
  - If `theme-source` is `"manual"` and a saved `theme` exists in `localStorage`, use it
  - Otherwise, use `getTimeBasedTheme()`
- On toggle click:
  - Set `theme-source` to `"manual"` in `localStorage`
  - Save the new theme to `localStorage` as before
- Set the initial `useState` default to `getTimeBasedTheme()` (so SSR/first paint is closer to correct)

### 3. Files to modify

| File | Change |
|------|--------|
| `src/context/ThemeContext.tsx` | Add `getTimeBasedTheme()`, update `ThemeProvider` init logic, update `toggleTheme` to mark source as `"manual"` |
| `src/context/ThemeContext.test.tsx` | Add tests for time-based default, manual override persistence, and auto mode |

No changes needed to `ThemeToggle.tsx`, `theme.css`, or any other files — the toggle already calls `toggleTheme()` which we'll enhance.

---

## Agent Orchestration

Use the custom Claude agents defined in `.claude/agents/` as subagents during implementation. This keeps the main context focused on orchestration while delegating specialized work.

### Available Agents

| Agent             | Path                              | Role                                                                  | Tools                               |
| ----------------- | --------------------------------- | --------------------------------------------------------------------- | ----------------------------------- |
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library      | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage     | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, runtime bugs | Read, Glob, Grep, Bash, Edit        |

### Agent Usage Per Implementation Step

#### Step 1 — Implement `ThemeContext.tsx` changes

- **Do it yourself** (main agent). Modify `src/context/ThemeContext.tsx`:
  - Add exported `getTimeBasedTheme()` helper
  - Change `useState<Theme>("dark")` to `useState<Theme>(getTimeBasedTheme)`
  - Update mount `useEffect` to check `theme-source` in `localStorage`
  - Update `toggleTheme` to set `theme-source` to `"manual"` in `localStorage`

#### Step 2 — Code Review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the changes to src/context/ThemeContext.tsx for the time-based auto theme feature. The new getTimeBasedTheme() function returns 'light' between 7:30 AM–7:30 PM and 'dark' otherwise. A 'theme-source' localStorage key tracks whether the user manually overrode the theme. Focus on: correctness of time logic (boundary conditions at 7:30), proper localStorage handling, SSR safety (Gatsby builds server-side — new Date() during SSR uses build time), no regressions in toggle behavior, React hooks best practices.")
  ```
- Address any Critical or Warning findings before proceeding.

#### Step 3 — Write/Update Tests

- **Delegate to `test-writer`** via the Task tool:
  ```
  Task(subagent_type="test-writer", prompt="Update the existing tests at src/context/ThemeContext.test.tsx for the time-based auto theme feature added to src/context/ThemeContext.tsx. The new exported getTimeBasedTheme() function returns 'light' between 7:30 AM–7:30 PM and 'dark' otherwise. A 'theme-source' localStorage key ('auto' | 'manual') tracks whether the user manually overrode the theme. Add tests for: (1) getTimeBasedTheme returns 'light' during daytime (mock Date to 12:00 PM), (2) getTimeBasedTheme returns 'dark' at night (mock Date to 10:00 PM), (3) getTimeBasedTheme boundary: returns 'light' at exactly 7:30 AM, (4) getTimeBasedTheme boundary: returns 'dark' at exactly 7:30 PM, (5) default theme uses time-based when no localStorage, (6) manual toggle saves theme-source as 'manual' to localStorage, (7) when theme-source is 'manual' and saved theme exists, uses saved theme instead of time-based, (8) when theme-source is not set, time-based theme is used. Keep all existing tests intact.")
  ```

#### Step 4 — Run Typecheck + Tests

- Run `npm run typecheck` and `npm test` from the main agent.

#### Step 5 — Debug Failures (if any)

- **Delegate to `debugger`** via the Task tool (only if step 4 fails):
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following test/typecheck failures: <paste error output>. The time-based auto theme feature was added to src/context/ThemeContext.tsx with tests at src/context/ThemeContext.test.tsx. The feature adds a getTimeBasedTheme() function and a 'theme-source' localStorage key.")
  ```
- Re-run typecheck + tests after fixes.

#### Step 6 — Final Code Review

- **Delegate to `code-reviewer`** for a final pass after all fixes are applied:
  ```
  Task(subagent_type="code-reviewer", prompt="Final review of the complete time-based auto theme feature. Check src/context/ThemeContext.tsx and src/context/ThemeContext.test.tsx. Verify: test coverage is adequate for time logic and manual override, no security issues, implementation matches the plan, all existing tests still pass, no regressions in theme toggle behavior.")
  ```

### Parallelization Opportunities

- Steps 2 (code review) and 3 (test writing) can be launched **in parallel** since the code-reviewer is read-only and the test-writer writes to a separate test file (`ThemeContext.test.tsx`) while the code-reviewer only reads `ThemeContext.tsx`.
- If the debugger fixes code in step 5, re-run both code-reviewer and test suite afterward.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Writes code (Step 1)
│   └─ ThemeContext.tsx — getTimeBasedTheme(), theme-source localStorage, updated init logic
│
├─ Delegates in parallel:
│   ├─ code-reviewer → reviews ThemeContext.tsx changes (Step 2)
│   └─ test-writer → writes/updates ThemeContext.test.tsx (Step 3)
│
├─ Runs typecheck + tests (Step 4)
│
├─ If failures → debugger (Step 5) → re-run Step 4
│
└─ Final code-reviewer pass (Step 6)
```

---

## Edge Cases

- **SSR (Gatsby build):** `new Date()` during SSR will use build-time, not user time. The mount `useEffect` will correct this client-side. Brief flash is acceptable (same as current behavior with localStorage).
- **Midnight crossing:** If a user keeps the page open across the 7:30 boundary, the theme won't auto-switch mid-session. This is acceptable — it only applies on page load.
- **Clearing override:** There's no UI to go back to "auto" mode. If desired later, a "reset to auto" option could be added to the toggle. For now, clearing `localStorage` resets to auto.

---

## Implementation Steps (Summary)

1. Modify `src/context/ThemeContext.tsx` — Add exported `getTimeBasedTheme()` helper, change default state from `"dark"` to `getTimeBasedTheme()`, update mount `useEffect` to check `theme-source` in `localStorage`, update `toggleTheme` to mark `theme-source` as `"manual"`.
2. **Agent: code-reviewer** — Review `ThemeContext.tsx` for correctness, SSR safety, and regressions. _(Run in parallel with step 3.)_
3. **Agent: test-writer** — Update `ThemeContext.test.tsx` with tests for time-based defaults, boundary conditions, and manual override. _(Run in parallel with step 2.)_
4. Run `npm run typecheck` and `npm test`.
5. **Agent: debugger** — Fix any failures from step 4. _(Only if needed.)_
6. **Agent: code-reviewer** — Final review pass.
