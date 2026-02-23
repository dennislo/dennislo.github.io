# Plan: Burger Menu

## Overview

Add a slide-in/out hamburger menu on the left side of the page. The menu contains two items: "Homepage" (links to `/`)
and "Contact" (links to `/contact-form`). The CSS follows mobile-first responsive design, consistent with the project's
existing patterns.

---

## Architecture

The burger menu is a new standalone component rendered inside `Layout`, alongside the existing `ThemeToggle`. It
consists of three parts:

1. **A hamburger button** — fixed-position trigger in the top-left corner (mirroring the ThemeToggle in the top-right).
2. **A slide-out panel** — a `<nav>` sidebar that slides in from the left when open, with CSS `transform: translateX()`
   transitions.
3. **An overlay backdrop** — a semi-transparent layer behind the panel that closes the menu on click.

State (`isOpen`) is managed locally with `useState` inside the component — no context needed since only the menu itself
cares about open/closed state.

CSS uses plain CSS (a `.css` file imported directly), matching the ThemeToggle pattern. All theme-aware colours use
existing CSS variables from `theme.css`. The CSS is written mobile-first: base styles target small screens, with
`@media (min-width: 768px)` for desktop adjustments.

Navigation uses Gatsby's `<Link>` component for internal routes.

### Files to Create / Modify

#### New files:

1. **`src/components/BurgerMenu/BurgerMenu.tsx`** — The burger menu component (button + panel + overlay).
2. **`src/components/BurgerMenu/BurgerMenu.css`** — Mobile-first styles for the burger menu, panel, overlay, and menu
   items.

#### Modified files:

3. **`src/components/Layout/Layout.tsx`** — Import and render `<BurgerMenu />` inside `<ThemeProvider>`, above
   `<ThemeToggle />`.

---

## Component / Module Structure

```
Layout (Layout.tsx)
├── ThemeProvider
│   ├── BurgerMenu          ← NEW
│   │   ├── <button>        (hamburger icon, fixed top-left)
│   │   ├── <div.overlay>   (click-to-close backdrop)
│   │   └── <nav.panel>     (slide-in sidebar)
│   │       ├── <button>    (close × button inside panel)
│   │       ├── Link "Homepage"   → /
│   │       └── Link "Contact"    → /contact-form
│   ├── ThemeToggle          (existing, fixed top-right)
│   ├── <main>{children}</main>
│   └── <Footer>
```

### Key component signature:

```tsx
// BurgerMenu.tsx
import React, {useState} from "react";
import {Link} from "gatsby";
import "./BurgerMenu.css";

const BurgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="burger-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        {/* 3-line hamburger icon (CSS or inline SVG) */}
      </button>

      {/* Overlay */}
      <div
        className={`burger-overlay ${isOpen ? "burger-overlay--open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <nav
        className={`burger-panel ${isOpen ? "burger-panel--open" : ""}`}
        aria-label="Main navigation"
      >
        <button
          className="burger-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        <ul className="burger-nav">
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Homepage
            </Link>
          </li>
          <li>
            <Link to="/contact-form" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
```

### Key CSS approach (mobile-first):

```css
/* Base (mobile) styles */
.burger-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  /* sized to match ThemeToggle */
}

.burger-panel {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 280px;
  transform: translateX(-100%); /* hidden off-screen */
  transition: transform 0.3s ease;
  z-index: 1001;
}

.burger-panel--open {
  transform: translateX(0); /* slide in */
}

.burger-overlay {
  display: none;
}

.burger-overlay--open {
  display: block;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* Desktop adjustments */
@media (min-width: 768px) {
  .burger-button {
    top: 20px;
    left: 20px;
  }

  .burger-panel {
    width: 320px;
  }
}
```

---

## Testing Plan

### `src/components/BurgerMenu/BurgerMenu.test.tsx`

1. Renders the hamburger button with correct aria-label
2. Panel is hidden (off-screen) by default — does not have `burger-panel--open` class
3. Clicking the hamburger button opens the panel — adds `burger-panel--open` class
4. Clicking the close button closes the panel
5. Clicking the overlay closes the panel
6. Renders "Homepage" link with `href="/"`
7. Renders "Contact" link with `href="/contact-form"`
8. Clicking a menu link closes the panel
9. `aria-expanded` on hamburger button reflects open/closed state
10. Panel has `aria-label="Main navigation"` for accessibility

### `src/components/Layout/Layout.test.tsx` (update existing)

11. Renders BurgerMenu component (add a mock similar to the ThemeToggle mock)

---

## Agent Orchestration

Use the custom agents defined in `.claude/agents/` as subagents during implementation. This keeps the main context
focused on orchestration while delegating specialized work.

### Available Agents

| Agent             | Path                              | Role                                                              | Tools                               |
|-------------------|-----------------------------------|-------------------------------------------------------------------|-------------------------------------|
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

### Agent Usage Per Implementation Step

#### Step 1 — Implement BurgerMenu component + CSS + Layout integration (main agent)

- **Do it yourself** (main agent). Create `BurgerMenu.tsx` and `BurgerMenu.css`. Update `Layout.tsx` to render
  `<BurgerMenu />`.

#### Step 2 — Code Review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review the new BurgerMenu component at src/components/BurgerMenu/BurgerMenu.tsx and src/components/BurgerMenu/BurgerMenu.css, plus the changes to src/components/Layout/Layout.tsx. Focus on: accessibility (aria attributes, keyboard navigation, focus management), CSS theme variable usage, mobile-first responsive design, React best practices, TypeScript typing, and consistency with existing components like ThemeToggle.")
  ```
- Address any Critical or Warning findings before proceeding.

#### Step 3 — Write Tests

- **Delegate to `test-writer`** via the Task tool:
  ```
  Task(subagent_type="test-writer", prompt="Write tests for BurgerMenu at src/components/BurgerMenu/BurgerMenu.tsx. Create src/components/BurgerMenu/BurgerMenu.test.tsx. Mock gatsby Link as done in Layout.test.tsx. Cover: renders hamburger button with aria-label, panel hidden by default, clicking button opens panel, clicking close button closes panel, clicking overlay closes panel, renders Homepage link to '/', renders Contact link to '/contact-form', clicking a menu link closes the panel, aria-expanded reflects state, nav has aria-label. Also update src/components/Layout/Layout.test.tsx to add a mock for BurgerMenu and a test that it renders.")
  ```

#### Step 4 — Run Typecheck + Tests

- Run `npm run typecheck` and `npm test` from the main agent.

#### Step 5 — Debug Failures (if any)

- **Delegate to `debugger`** via the Task tool (only if step 4 fails):
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following failures: <paste error output>. The BurgerMenu component was added at src/components/BurgerMenu/BurgerMenu.tsx with CSS at src/components/BurgerMenu/BurgerMenu.css. Layout.tsx was updated to include it. Test files: src/components/BurgerMenu/BurgerMenu.test.tsx and src/components/Layout/Layout.test.tsx.")
  ```
- Re-run typecheck + tests after fixes.

#### Step 6 — Final Code Review

- **Delegate to `code-reviewer`** for a final pass after all fixes:
  ```
  Task(subagent_type="code-reviewer", prompt="Final review of the complete burger menu feature. Check all new/modified files: src/components/BurgerMenu/BurgerMenu.tsx, src/components/BurgerMenu/BurgerMenu.css, src/components/Layout/Layout.tsx, src/components/BurgerMenu/BurgerMenu.test.tsx, src/components/Layout/Layout.test.tsx. Verify test coverage is adequate, no security issues remain, accessibility is solid, and the implementation matches the plan.")
  ```

### Parallelization Opportunities

- Steps 2 (code review) and 3 (test writing) can be launched **in parallel** since the code-reviewer is read-only and
  the test-writer writes to a separate file.
- If the debugger fixes code in step 5, re-run both code-reviewer and the test suite afterward.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Writes code (Step 1)
│   ├─ src/components/BurgerMenu/BurgerMenu.tsx
│   ├─ src/components/BurgerMenu/BurgerMenu.css
│   └─ src/components/Layout/Layout.tsx (modified)
│
├─ Delegates in parallel:
│   ├─ code-reviewer → reviews BurgerMenu + Layout changes (Step 2)
│   └─ test-writer → creates BurgerMenu.test.tsx, updates Layout.test.tsx (Step 3)
│
├─ Runs typecheck + tests (Step 4)
│
├─ If failures → debugger (Step 5) → re-run Step 4
│
└─ Final code-reviewer pass (Step 6)
```

---

## Implementation Steps (Summary)

1. [ ] Main agent: create `BurgerMenu.tsx`, `BurgerMenu.css`, and update `Layout.tsx` to render the menu.
2. [ ] **Agent: code-reviewer** — Review BurgerMenu component, CSS, and Layout changes for accessibility, theming, and best
   practices. _(Run in parallel with step 3.)_
3. [ ] **Agent: test-writer** — Create `BurgerMenu.test.tsx` and update `Layout.test.tsx` with burger menu mock + test. _(
   Run in parallel with step 2.)_
4. [ ] Run `npm run typecheck` and `npm test`.
5. [ ] **Agent: debugger** — Fix any failures from step 4. _(Only if needed.)_
6. [ ] **Agent: code-reviewer** — Final review pass.
