# Plan: Dark Mode SVG Background Theming

## Overview

Fix the Hero section background so the SVG and its nested pattern content visually darken when the site theme is in dark mode.

## Current Behavior

- The Hero root container already switches between `bg-white` and `dark:bg-gray-950`.
- The SVG wrapper already switches stroke color with `stroke-gray-200 dark:stroke-gray-800`.
- The nested SVG pattern content inside `#programming-symbols` uses fixed `fill={accent}` on each `<text>` node.
- The gradient overlay above the SVG uses hard-coded light-end colors (`rgba(255,255,255,...)` and `white`), so it keeps washing the background toward light mode even when `data-theme="dark"`.
- Result: in dark mode, the grid and symbol layers remain too bright or too light-biased compared with the rest of the Hero.

## Root Cause

The theme-aware styling is applied only at the outer SVG/container level. The actual rendered pattern elements inside `<defs>` and the radial overlay colors are static values, so they do not react to the active theme.

## Proposed Fix

### Preferred approach: theme-aware SVG tokens inside `Hero.tsx`

Update `src/components/Hero/Hero.tsx` so the Hero background derives all SVG-related colors from the current theme instead of hard-coded light values.

### Implementation outline

1. Read the active theme from `ThemeContext` via `useTheme()`.
2. Derive a small set of visual tokens inside the Hero component, for example:
   - background overlay end colors
   - symbol fill color
   - symbol opacity
   - optional grid opacity
3. Replace the fixed `fill={accent}` text pattern fills with a theme-aware symbol color.
4. Replace the light-only radial gradient tail (`rgba(255,255,255,...)`, `white`) with theme-conditional dark values when `theme === "dark"`.
5. Keep the current accent hue, but reduce its brightness/opacity in dark mode so the SVG recedes behind content instead of competing with text.

### Why this is the best first fix

- Smallest change surface: one component
- Keeps existing structure and visuals mostly intact
- Avoids introducing SVG/CSS coupling that is harder to reason about
- Easy to cover with unit and manual checks

## Alternative Solutions

### Option 1: Use `currentColor` for the SVG pattern content

Set the SVG container or a wrapper to a theme-aware text color and use `fill="currentColor"` for the symbol pattern.

Pros:

- Simple SVG semantics
- Reduces repeated hard-coded color values

Cons:

- The accent-colored symbols will no longer use the configured brand accent unless combined with extra CSS variables
- Less precise control over symbol opacity versus content color

### Option 2: Introduce CSS custom properties for Hero background tokens

Define variables such as `--hero-grid`, `--hero-symbol`, `--hero-overlay-start`, and `--hero-overlay-end`, then switch them via `[data-theme="light"]` and `[data-theme="dark"]`.

Pros:

- Clean separation between theming and markup
- Scales well if more sections reuse the same background treatment

Cons:

- Slightly larger refactor
- Requires deciding where theme tokens should live globally

### Option 3: Split the SVG into dedicated subcomponents

Extract the background SVG into a separate `HeroBackground` component that accepts theme-aware props.

Pros:

- Better structure if the Hero keeps growing
- Easier targeted tests for background logic

Cons:

- More code movement than the bug likely needs
- Not necessary unless the Hero background is expected to become more complex

## Files To Modify

| File                                | Change                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `src/components/Hero/Hero.tsx`      | Read theme context and make SVG pattern fills plus gradient overlay theme-aware |
| `src/components/Hero/Hero.test.tsx` | Add or update tests to assert dark-mode-specific background styling logic       |

## Detailed Plan

### 1. Inspect existing Hero tests

- Check whether `Hero.test.tsx` already renders inside the `ThemeProvider` or uses mocks.
- Decide whether to test by mocking `useTheme()` or by rendering within the real provider with controlled localStorage.

### 2. Make Hero background theme-aware

- Import `useTheme` into `Hero.tsx`.
- Compute theme-sensitive style values before the return statement.
- Update the gradient overlay inline style to use dark-mode tail colors such as dark translucent grays instead of white.
- Update the symbol pattern fill to a dimmed accent in dark mode.
- If needed, add reduced `opacity` for the `programming-symbols` rect in dark mode.

### 3. Verify the grid layer remains visible but subtle

- Keep `grid-pattern` tied to the SVG stroke color already controlled by Tailwind.
- If the grid still feels too bright in dark mode, add theme-aware opacity at the rect level instead of changing the pattern path itself.

### 4. Add regression coverage

- Add a unit test that verifies the Hero renders its theme-aware styles for dark mode.
- Prefer asserting generated inline styles or key attributes rather than snapshotting the whole SVG.

### 5. Run validation

- Run `npm run typecheck`
- Run the relevant Jest tests for Hero and theme behavior
- Manually verify in the browser that toggling light/dark mode changes:
  - overlay tone
  - programming symbol tone
  - overall Hero contrast

## Agent Orchestration

Use the custom Claude agents defined in `.claude/agents/` as subagents during implementation.

### Available Agents

| Agent             | Path                              | Role                                                             | Tools                               |
| ----------------- | --------------------------------- | ---------------------------------------------------------------- | ----------------------------------- |
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, regressions, and test coverage         | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates test failures, broken behavior, or theming bugs     | Read, Glob, Grep, Bash, Edit        |

### Agent Usage Per Implementation Step

#### Step 1 — Implement Hero theming fix

- **Do it yourself** (main agent). Modify `src/components/Hero/Hero.tsx` to read the current theme and apply theme-aware SVG/overlay tokens.

#### Step 2 — Code Review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the changes to src/components/Hero/Hero.tsx for the dark-mode SVG background fix. Focus on: correctness of theme-dependent styling, whether the nested SVG pattern content now responds to dark mode, visual regression risk in light mode, accessibility/contrast, and whether the implementation is maintainable.")
  ```

#### Step 3 — Write/Update Tests

- **Delegate to `test-writer`** via the Task tool:
  ```
  Task(subagent_type="test-writer", prompt="Update src/components/Hero/Hero.test.tsx for the dark-mode SVG background fix in src/components/Hero/Hero.tsx. Add focused tests that verify theme-aware background styling for dark mode without relying on brittle full-component snapshots. Cover the theme-specific overlay/style tokens and ensure light mode behavior still renders.")
  ```

#### Step 4 — Run Typecheck + Tests

- Run `npm run typecheck`
- Run Hero-related Jest tests, then the full suite if needed

#### Step 5 — Debug Failures (if any)

- **Delegate to `debugger`** via the Task tool only if validation fails:
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following failures after the dark-mode SVG background update: <paste exact error output>. The implementation changed src/components/Hero/Hero.tsx and tests in src/components/Hero/Hero.test.tsx. Focus on theme-context usage, SVG attribute assertions, and any light/dark regression.")
  ```

### Parallelization Opportunities

- Steps 2 and 3 can run in parallel after the Hero fix is implemented.
- If the debugger changes implementation details, rerun both review and tests afterward.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Writes Hero dark-mode SVG fix (Step 1)
│
├─ Delegates in parallel:
│   ├─ code-reviewer → reviews Hero theming changes (Step 2)
│   └─ test-writer → updates Hero tests (Step 3)
│
├─ Runs typecheck + tests (Step 4)
│
├─ If failures → debugger (Step 5) → re-run validation
│
└─ Finalize once dark/light mode behavior is verified
```

## Risks And Checks

- Theme reads from context may affect tests that currently render Hero without a provider.
- Inline SVG style assertions can be brittle if tests over-specify full style strings.
- Darkening too aggressively can make the Hero background disappear instead of receding.
- Keeping the accent hue but lowering opacity is safer than switching to a completely different dark-mode color family.

## Recommendation

Implement the preferred approach first: theme-aware color tokens inside `Hero.tsx`, with the minimum possible surface area.

If the team expects more theme-sensitive backgrounds later, follow up with Option 2 and move these values into shared CSS custom properties.

## Implementation Steps (Summary)

- [ ] Update `src/components/Hero/Hero.tsx` to derive overlay and SVG pattern colors from the active theme.
- [ ] Keep `grid-pattern` subtle in dark mode, adding rect-level opacity only if the existing dark stroke is still too strong.
- [ ] **Agent: code-reviewer** Review the Hero theming change for correctness and regression risk. Run in parallel with the next step.
- [ ] **Agent: test-writer** Update `src/components/Hero/Hero.test.tsx` with focused dark-mode regression coverage. Run in parallel with the previous step.
- [ ] Run `npm run typecheck` and the relevant Jest tests.
- [ ] **Agent: debugger** Investigate and fix any failures from validation, if needed.
