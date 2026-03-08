# Plan: Fix Footer Wave Div Visual Bug

## Overview

Remove the decorative wave `<div>` from `SiteFooter.tsx` that creates a visual artifact. The div
contains an SVG wave shape added during the devportfolio re-theme, but it conflicts with the
footer's existing `border-t` separator and produces an awkward gap/color mismatch at the top of
the footer in both light and dark mode.

---

## Investigation

### Origin

The div was introduced in commit `4471ea8` ("Implement devportfolio re-theme with Tailwind CSS
v4", Mar 5 2026) as part of a full-site re-theme. The commit message explicitly names it:
_"SiteFooter (social icons, nav links, copyright, wave SVG)"_. It was intentional at the time —
a decorative wave separator borrowed from the devportfolio design system.

### Why It's a Bug Now

The `<footer>` element already applies `border-t border-gray-100 dark:border-gray-800` for visual
separation from the content above. The wave SVG sitting immediately inside creates two problems:

1. **Double separator**: A visible border line appears directly above the wave shape, producing
   redundant and conflicting visual dividers.
2. **Color mismatch**: The SVG fills with `text-gray-50` (light) / `text-gray-900` (dark) via
   `fill="currentColor"`. These colors do not blend cleanly with the white/dark footer background,
   making the wave look like an orphaned block rather than a smooth transition.

### Affected File

`src/components/SiteFooter/SiteFooter.tsx` — lines 21–34:

```tsx
{
  /* Decorative wave */
}
<div className="w-full overflow-hidden leading-none">
  <svg
    viewBox="0 0 1440 60"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-12 text-gray-50 dark:text-gray-900"
    preserveAspectRatio="none"
  >
    <path
      d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
      fill="currentColor"
    />
  </svg>
</div>;
```

---

## Fix

Remove the decorative wave div entirely. The `border-t` on `<footer>` already provides clean
visual separation. No replacement element is needed.

Also remove `pt-0` from the padding div on line 36, since without the wave the top padding
should be restored to match the rest of the section padding (`p-8 sm:p-12 md:p-16 lg:p-24`).

### Before

```tsx
<footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
  {/* Decorative wave */}
  <div className="w-full overflow-hidden leading-none">
    <svg ...>
      <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="currentColor" />
    </svg>
  </div>

  <div className="p-8 sm:p-12 md:p-16 lg:p-24 pt-0">
```

### After

```tsx
<footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
  <div className="p-8 sm:p-12 md:p-16 lg:p-24">
```

---

## Implementation Steps

### Step 1: Edit SiteFooter component

**Files to modify:**

- `src/components/SiteFooter/SiteFooter.tsx`

**Actions:**

1. Delete lines 21–34: the `{/* Decorative wave */}` comment, the wrapper div, and the SVG element
2. Remove `pt-0` from the inner padding div (line 36) so the full padding
   `p-8 sm:p-12 md:p-16 lg:p-24` applies uniformly at the top

### Step 2: Update SiteFooter unit tests

**Files to modify:**

- `src/components/SiteFooter/SiteFooter.test.tsx`

**Actions:**

1. Search the test file for any assertion referencing the wave SVG path, the `overflow-hidden`
   class, or the `leading-none` class
2. Remove or update those assertions — the wave element no longer exists in the DOM

### Step 3: Run tests and typecheck

**Actions:**

```bash
npm test
npm run typecheck
```

All tests must pass and typecheck must be clean before proceeding. If either fails, use the
**debugger** agent to investigate and fix.

### Step 4: Visual verification

**Actions:**

1. Run `npm run develop`
2. Open `http://localhost:8000` in a browser
3. Scroll to the footer and confirm:
   - The `border-t` separator is clean — no double-border or wave artifact
   - Top padding inside the footer is consistent with other sections
4. Toggle dark mode and repeat the checks
5. Capture a screenshot as evidence in both light and dark mode

---

## Agent Orchestration

| Step | Agent                        | Action                                                                   |
| ---- | ---------------------------- | ------------------------------------------------------------------------ |
| 1    | **senior-frontend-engineer** | Edit `SiteFooter.tsx`: remove wave div, restore top padding              |
| 2    | **test-writer**              | Audit and update `SiteFooter.test.tsx` to remove wave-related assertions |
| 3    | **Main agent**               | Run `npm test` and `npm run typecheck`                                   |
| 3    | **debugger** _(if needed)_   | Investigate and fix any test failures or type errors                     |
| 4    | **manual-testing skill**     | Start dev server, verify footer visually in light and dark mode          |

---

## Agent Escalation Flow

```
Main Agent (orchestrates)
├── senior-frontend-engineer (edits SiteFooter.tsx)
├── test-writer (updates SiteFooter.test.tsx)
├── Main agent (runs tests + typecheck)
│   └── debugger (only if tests or typecheck fail)
└── manual-testing skill (visual verification)
```

---

## Implementation Steps (Summary)

1. [x] **[senior-frontend-engineer]** Remove wave div (lines 21–34) and `pt-0` from `SiteFooter.tsx`
2. [x] **[test-writer]** Audited `SiteFooter.test.tsx` — no wave assertions existed, no changes needed
3. [x] **[Main]** Run `npm test` and `npm run typecheck` — 121/121 tests pass, typecheck clean
4. [ ] **[debugger]** _(Not needed — no failures.)_
5. [x] **[manual-testing skill]** Verified footer in light and dark mode — clean `border-t`, no wave artifact, correct padding
6. [x] **[Main]** Committed as `8a9f358` — "Remove decorative wave div from SiteFooter (dennislo-wms)"
