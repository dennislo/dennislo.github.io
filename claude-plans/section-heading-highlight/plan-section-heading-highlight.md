# Plan: Section Heading Highlight

## Overview

When a user navigates to a page section — by clicking a header menu item (desktop or mobile), landing on a URL with a
hash (e.g. `/#projects`), or clicking any other in-page anchor — the target section's `h2` heading receives a momentary
highlight: a soft accent-colored background wash that fades in once the smooth scroll arrives at the section, holds,
and fades out after 2 seconds. The effect works in both light and dark themes and respects
`prefers-reduced-motion`.

Requirements agreed with the user:

- **Style**: soft background wash derived from the site accent color (`siteConfig.accentColor`, `#1d4ed8`), subtle and
  professional, no layout shift.
- **Timing**: the 2-second highlight starts when the heading actually comes into view (after the smooth scroll
  settles), not at click time. If the section is already in view, it starts immediately.
- **Triggers**: header menu clicks, direct URL hash on page load, and any in-page `a[href^="#"]` anchor. Re-clicking
  the same menu item re-triggers the highlight (even though the hash does not change).
- **Scope**: the five content sections — About (`#about`), Projects (`#projects`), GitHub Activity
  (`#github-activity`), Experience (`#experience`), Education (`#education`). The Hero (`#hero`) is excluded: its link
  is the logo/home link and its `h2` is a tagline, not a section name.

---

## Architecture

A single client-side hook drives everything; section components only gain a marker attribute and baseline styling on
their `h2`.

1. **`useSectionHighlight` hook** (new, `src/hooks/useSectionHighlight.ts`) — mounted once in the index page. On
   mount it:
   - Triggers for `window.location.hash` if present (direct URL load).
   - Listens for `hashchange` (normal anchor navigation).
   - Listens for delegated `click` events on `a[href^="#"]` at the document level — this is what makes re-clicking the
     same menu item work, since the hash does not change and `hashchange` never fires.

   On each trigger it resolves `document.getElementById(id)` and finds the heading via
   `section.querySelector("[data-section-heading]")`. Sections without the marker (e.g. Hero) are a no-op. It then
   observes the heading with an `IntersectionObserver` (threshold ≈ 0.5): the observer fires immediately if the
   heading is already in view, otherwise when the smooth scroll brings it into view. On intersection it disconnects,
   adds the `section-heading-highlight` class, and removes it after `HIGHLIGHT_DURATION_MS` (2000 ms). A safety
   timeout (~5 s) disconnects the observer if the scroll never arrives. Every new trigger cancels in-flight
   observers/timers and clears any currently highlighted heading, so rapid menu clicks behave sanely. All listeners,
   observers, and timers are cleaned up on unmount. A click and its resulting `hashchange` may both call the trigger
   for the same id; the trigger is a cancel-and-restart, so the double fire is harmless.

2. **Highlight styling** — the wash color lives in `src/styles/global.css` as a `.section-heading-highlight` rule,
   because it must be applied via `classList` from the hook (the heading is not re-rendered by React):

   ```css
   .section-heading-highlight {
     background-color: rgba(29, 78, 216, 0.1); /* accent #1d4ed8 @ 10% */
   }

   [data-theme="dark"] .section-heading-highlight {
     background-color: rgba(
       96,
       165,
       250,
       0.18
     ); /* blue-400 tint reads better on gray-950 */
   }
   ```

   Note: dark mode in this repo is the `[data-theme="dark"]` attribute (see the `@custom-variant dark` in
   `global.css`), **not** `prefers-color-scheme` — the dark rule must use the attribute selector.

   The fade in/out comes from baseline Tailwind classes added to each marked `h2`:
   `-mx-3 px-3 rounded-lg transition-colors duration-500 motion-reduce:transition-none`. The permanent negative
   margin + padding means toggling the background causes zero layout shift, and `motion-reduce:` makes the wash
   appear/disappear instantly for users who prefer reduced motion (the highlight still functions).

3. **Section components** — each of the five sections adds `data-section-heading` plus the baseline classes above to
   its main `h2`. One-line change per component.

### Files to Create / Modify

#### New files:

1. **`src/hooks/useSectionHighlight.ts`** — the hook (exports `useSectionHighlight` and `HIGHLIGHT_DURATION_MS`).
2. **`src/hooks/useSectionHighlight.test.ts`** — unit tests (written first, failing).
3. **`src/test-e2e/section-heading-highlight.spec.ts`** — Playwright e2e tests (written first, failing).

#### Modified files:

4. **`src/pages/index.tsx`** — call `useSectionHighlight()` inside `IndexPage`.
5. **`src/styles/global.css`** — add the `.section-heading-highlight` light/dark rules.
6. **`src/components/About/About.tsx`** — marker + baseline classes on the `h2`.
7. **`src/components/Projects/Projects.tsx`** — same.
8. **`src/components/GitHubActivity/GitHubActivity.tsx`** — same.
9. **`src/components/Experience/Experience.tsx`** — same.
10. **`src/components/Education/Education.tsx`** — same.
11. Section component tests (e.g. `About.test.tsx`) — assert the `h2` carries `data-section-heading`.

---

## Module Structure

```
IndexPage (src/pages/index.tsx)
├── useSectionHighlight()          ← NEW (side-effect hook, renders nothing)
│     ├─ initial-hash trigger
│     ├─ window "hashchange" listener
│     └─ document "click" listener on a[href^="#"]
│           └─ trigger(id)
│                ├─ section = getElementById(id)
│                ├─ heading = section.querySelector("[data-section-heading]")
│                ├─ IntersectionObserver → in view → add .section-heading-highlight
│                └─ setTimeout(2000) → remove .section-heading-highlight
├── SiteHeader (unchanged — plain #hash anchors already in place)
├── About / Projects / GitHubActivity / Experience / Education
│     └─ <h2 data-section-heading class="... -mx-3 px-3 rounded-lg transition-colors duration-500 motion-reduce:transition-none">
└── Hero (unchanged — intentionally not marked)
```

### Key hook sketch:

```ts
// src/hooks/useSectionHighlight.ts
export const HIGHLIGHT_DURATION_MS = 2000;
const OBSERVER_SAFETY_MS = 5000;
const HIGHLIGHT_CLASS = "section-heading-highlight";

export function useSectionHighlight(): void {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let highlightTimer: number | null = null;
    let safetyTimer: number | null = null;
    let activeHeading: HTMLElement | null = null;

    const reset = () => {
      /* disconnect observer, clear both timers, remove class from activeHeading */
    };

    const trigger = (hash: string) => {
      const heading = document
        .getElementById(hash.slice(1))
        ?.querySelector<HTMLElement>("[data-section-heading]");
      if (!heading) return; // Hero and unknown ids are no-ops
      reset();
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          /* disconnect, add HIGHLIGHT_CLASS, schedule removal after HIGHLIGHT_DURATION_MS */
        },
        { threshold: 0.5 },
      );
      observer.observe(heading); // fires immediately if already in view
      safetyTimer = window.setTimeout(reset, OBSERVER_SAFETY_MS);
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.('a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (href && href.length > 1) trigger(href);
    };
    const onHashChange = () => trigger(window.location.hash);

    if (window.location.hash) trigger(window.location.hash);
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      reset();
    };
  }, []);
}
```

SSR note: the hook body runs only in `useEffect`, so Gatsby SSR/build is unaffected. jsdom has no
`IntersectionObserver`; unit tests must install a controllable mock.

---

## Testing Plan (tests written FIRST, failing — per CLAUDE.md TDD workflow)

### `src/hooks/useSectionHighlight.test.ts` (Jest + RTL `renderHook`, fake timers, mocked IntersectionObserver)

1. Initial load with `location.hash` set → observes the marked heading; when the mock observer reports intersection,
   the heading gains `section-heading-highlight`.
2. Class is removed after exactly `HIGHLIGHT_DURATION_MS` (advance fake timers 1999 ms → still present; 2000 ms →
   gone).
3. `hashchange` event triggers the same flow.
4. Click on an `a[href="#about"]` triggers the flow even when the hash is unchanged (re-click case).
5. Click on an anchor whose target section has no `[data-section-heading]` (Hero) → no observer created, no class
   added.
6. A second trigger while a highlight is active removes the class from the first heading and highlights the new one.
7. Safety timeout: if the observer never reports intersection, everything is cleaned up after ~5 s and no class is
   added.
8. Unmount removes listeners and clears the active highlight/timers.

### Section component tests (update existing `*.test.tsx` for the five sections)

9. The section's `h2` has the `data-section-heading` attribute.

### `src/test-e2e/section-heading-highlight.spec.ts` (Playwright; reuse patterns from `header-navigation.spec.ts`)

10. Desktop: click "Activity" nav link → the `#github-activity` `h2` gains `section-heading-highlight` (wait for
    scroll arrival) → after ~2 s the class is gone.
11. Mobile viewport: open the burger menu, click a section link → same behavior.
12. Direct navigation to `/#projects` → Projects `h2` is highlighted on arrival, then clears.
13. Re-click the same nav link after the highlight has cleared → it highlights again.
14. Dark theme (`data-theme="dark"` via the theme toggle): highlight background-color is the dark-mode tint (assert
    via computed style), and text remains readable.
15. No layout shift: heading bounding box is identical before/during/after the highlight.

---

## Agent Orchestration

Use the custom agents defined in `.claude/agents/`, invoked via the Task tool during implementation. The main agent
orchestrates; per CLAUDE.md the TDD order below is mandatory (failing tests before implementation).

### Available Agents

| Agent                        | Path                                         | Role                                                              | Tools                                          |
| ---------------------------- | -------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| **test-writer**              | `.claude/agents/test-writer.md`              | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write            |
| **senior-frontend-engineer** | `.claude/agents/senior-frontend-engineer.md` | Implements the minimum code to make failing tests pass            | Read, Write, Edit, MultiEdit, Glob, Grep, Bash |
| **code-reviewer**            | `.claude/agents/code-reviewer.md`            | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash                         |
| **debugger**                 | `.claude/agents/debugger.md`                 | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit                   |

### Agent Usage Per Implementation Step

#### Step 0 — Track the work (main agent)

- Create a `bd` feature issue for this plan and claim it
  (`bd create "Section heading highlight on menu navigation" -t feature -p 2 --json`, then `bd update <id> --claim`).

#### Step 1 — Write failing unit tests

- **Delegate to `test-writer`** via the Task tool:
  ```
  Task(subagent_type="test-writer", prompt="Write FAILING tests for a not-yet-implemented hook src/hooks/useSectionHighlight.ts (create the test at src/hooks/useSectionHighlight.test.ts). The hook (export useSectionHighlight and HIGHLIGHT_DURATION_MS = 2000) listens for initial location.hash, hashchange, and document clicks on a[href^='#']; finds the target section by id and its heading via [data-section-heading]; uses IntersectionObserver (mock it in jsdom) to wait until the heading is in view; then adds class 'section-heading-highlight' for 2000ms before removing it. Use jest fake timers and follow .claude/skills/unit-testing/SKILL.md conventions. Cover: initial-hash trigger, hashchange trigger, same-hash re-click trigger, no-op when target has no [data-section-heading], new trigger cancels an active highlight, safety-timeout cleanup when intersection never happens, and unmount cleanup. Also update the five section component tests (About, Projects, GitHubActivity, Experience, Education) to assert their h2 carries data-section-heading. Run the tests and confirm they FAIL because the hook/attribute do not exist yet.")
  ```

#### Step 2 — Write failing e2e tests (parallel with Step 1)

- **Main agent, following `.claude/skills/e2e-testing/SKILL.md`**: create
  `src/test-e2e/section-heading-highlight.spec.ts` covering e2e cases 10–15 above, reusing the nav/viewport helpers
  and patterns from `src/test-e2e/header-navigation.spec.ts`. Run it and confirm it fails for the right reason (no
  `section-heading-highlight` class ever appears).

#### Step 3 — Implement

- **Delegate to `senior-frontend-engineer`** via the Task tool:
  ```
  Task(subagent_type="senior-frontend-engineer", prompt="Implement the section-heading-highlight feature per claude-plans/section-heading-highlight/plan-section-heading-highlight.md with the minimum change needed to make the failing tests pass: (1) create src/hooks/useSectionHighlight.ts per the plan's hook sketch; (2) call it in src/pages/index.tsx; (3) add .section-heading-highlight light/dark rules to src/styles/global.css using the [data-theme='dark'] selector (NOT prefers-color-scheme); (4) add data-section-heading plus '-mx-3 px-3 rounded-lg transition-colors duration-500 motion-reduce:transition-none' to the main h2 of About, Projects, GitHubActivity, Experience, Education (do NOT touch Hero). Run npm run typecheck and the new unit tests.")
  ```

#### Step 4 — Run quality gates (main agent)

- `npm run typecheck`, full `npm test`, and the Playwright suite (per `.claude/skills/e2e-testing/SKILL.md`, e.g.
  `npm run test:e2e`). Also lint if configured.

#### Step 5 — Debug failures (only if Step 4 fails)

- **Delegate to `debugger`** via the Task tool:
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following failures: <paste exact error output>. The section-heading-highlight feature was added: hook at src/hooks/useSectionHighlight.ts (mounted in src/pages/index.tsx), CSS in src/styles/global.css, data-section-heading markers on the five section h2s. Tests: src/hooks/useSectionHighlight.test.ts and src/test-e2e/section-heading-highlight.spec.ts.")
  ```
- Re-run Step 4 after fixes.

#### Step 6 — Pull request (main agent)

- Branch, commit tests + implementation together, push, and open a PR.

#### Step 7 — Code review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the section-heading-highlight PR: src/hooks/useSectionHighlight.ts, src/hooks/useSectionHighlight.test.ts, src/pages/index.tsx, src/styles/global.css, the five section components (About, Projects, GitHubActivity, Experience, Education), their updated tests, and src/test-e2e/section-heading-highlight.spec.ts. Focus on: listener/observer/timer cleanup and leak-freedom, SSR safety for Gatsby build, correct [data-theme='dark'] usage, prefers-reduced-motion handling, no layout shift from the highlight, accessibility (decorative-only effect, contrast preserved), TypeScript typing, and test adequacy including the same-hash re-click case.")
  ```
- Resolve all Critical and Warning findings (via `senior-frontend-engineer`/`debugger`) before merge, re-running
  Step 4 after any fix.

#### Step 8 — Land the plane (main agent)

- Close the `bd` issue, `git pull --rebase`, `bd sync`, `git push`, verify `git status` is clean/up to date.

### Parallelization Opportunities

- Steps 1 (unit tests) and 2 (e2e tests) can run **in parallel** — they write to disjoint files.
- Step 7's review findings, if any, can be fixed while e2e re-runs are queued, but always finish with a green Step 4.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Step 0: bd issue created + claimed
│
├─ Delegates in parallel (both must FAIL before implementation):
│   ├─ test-writer → src/hooks/useSectionHighlight.test.ts + section h2 marker assertions (Step 1)
│   └─ main agent (e2e-testing skill) → src/test-e2e/section-heading-highlight.spec.ts (Step 2)
│
├─ senior-frontend-engineer → hook, index.tsx, global.css, 5 section h2s (Step 3)
│
├─ Runs typecheck + unit tests + e2e (Step 4)
│
├─ If failures → debugger (Step 5) → re-run Step 4
│
├─ Commit, push, open PR (Step 6)
│
├─ code-reviewer → full-diff review; Critical/Warning fixes loop back to Step 4 (Step 7)
│
└─ Merge-ready → close bd issue, sync, push (Step 8)
```

---

## Implementation Steps (Summary)

1. [ ] Main agent: create + claim `bd` feature issue.
2. [ ] **Agent: test-writer** — failing unit tests for `useSectionHighlight` + `data-section-heading` assertions on
       the five section `h2`s (parallel with step 3).
3. [ ] Main agent (e2e-testing skill): failing Playwright spec `section-heading-highlight.spec.ts` (parallel with
       step 2).
4. [ ] Confirm all new tests fail for the right reason.
5. [ ] **Agent: senior-frontend-engineer** — implement hook, mount in `index.tsx`, add CSS rules, mark the five
       section `h2`s.
6. [ ] Main agent: run `npm run typecheck`, `npm test`, and the Playwright suite — all green.
7. [ ] **Agent: debugger** — only if step 6 fails; then re-run step 6.
8. [ ] Main agent: branch, commit tests + implementation, push, open PR.
9. [ ] **Agent: code-reviewer** — review PR; resolve all Critical/Warning findings, re-running step 6 after fixes.
10. [ ] Main agent: close `bd` issue, `bd sync`, `git push`, verify clean status.
