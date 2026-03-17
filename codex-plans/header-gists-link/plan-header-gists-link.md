# Plan: Add Gists Link To Header Menu

## Summary

Add a new `Gists` item to the existing header navigation that links to `https://gist.github.com/dennislo/public`.
The new item should appear in both the desktop header nav and the mobile menu, while preserving the current internal
section links and menu behavior.

This is a focused `SiteHeader` change. The footer, hero social links, and broader navigation structure are out of
scope.

---

## Recommended Approach

Update `src/components/SiteHeader/SiteHeader.tsx` so the shared header link data can support both:

- internal section anchors such as `#about`
- one external destination for `Gists`

Keep a single shared data source for header links so desktop and mobile navigation stay in sync.

### Navigation data

Change the local `navLinks` structure from a simple `{ label, href }` list to a typed mixed structure that can
represent internal and external links explicitly.

Suggested direction:

```ts
type InternalNavLink = {
  type: "internal";
  label: string;
  href: `#${string}`;
};

type ExternalNavLink = {
  type: "external";
  label: string;
  href: string;
  ariaLabel?: string;
};
```

Append the new item after `Education` so the current section order remains unchanged and `Gists` reads as an additional
resource instead of interrupting the section navigation.

### Rendering strategy

Preserve the existing render paths:

- desktop nav remains inline from `md` upward
- mobile menu remains the toggleable panel below `md`

For rendering:

- keep internal items as standard anchor tags with `href="#section"`
- render the new `Gists` item with `ExternalLink` so it opens in a new tab with `rel="noopener noreferrer"`

The mobile `Gists` item should still close the menu on click before the new tab opens, matching the current
close-on-selection behavior.

### Styling

No redesign is needed. Reuse the current Tailwind class patterns already applied to header links so the new item blends
into both desktop and mobile navigation without introducing a new visual treatment.

---

## Implementation Plan

### 1. Update header link data

Modify `src/components/SiteHeader/SiteHeader.tsx` to add a `Gists` entry with:

- label: `Gists`
- href: `https://gist.github.com/dennislo/public`
- type: external

### 2. Support external link rendering

Import `ExternalLink` into `SiteHeader.tsx` and branch rendering based on link type.

Requirements:

- desktop nav renders `Gists` alongside the existing items
- mobile menu renders `Gists` in the same list
- mobile `onClick` still collapses the menu for the external item
- existing accessibility behavior stays intact:
  - `aria-expanded`
  - `aria-controls`
  - Escape-to-close
  - resize-to-desktop reset

### 3. Keep scope tight

Do not change:

- `src/components/SiteFooter/SiteFooter.tsx`
- `src/config.ts`
- page structure or section ids

Only make additional refactors if needed to keep the header link typing clean and readable.

---

## Testing Plan

### Unit tests

Update `src/components/SiteHeader/SiteHeader.test.tsx` to cover:

1. desktop nav renders `Gists`
2. `Gists` uses the exact gist URL
3. `Gists` has `target="_blank"`
4. `Gists` has `rel="noopener noreferrer"`
5. mobile menu shows `Gists` after opening
6. clicking `Gists` closes the mobile menu

Keep the existing tests for scroll styling, Escape dismissal, and resize reset passing to guard against regressions in
header behavior unrelated to the new link.

### E2E coverage

Extend `src/test-e2e/header-navigation.spec.ts` with a lightweight assertion that the mobile menu exposes `Gists` with
the expected external URL and new-tab attributes. Do not navigate away from the site during this test.

---

## Agent And Skill Usage

Use the repo-specific guidance in `AGENTS.md` during implementation:

- `.claude/agents/senior-frontend-engineer.md` for the `SiteHeader` implementation
- `.claude/agents/test-writer.md` with `.claude/skills/unit-testing/SKILL.md` for Jest + RTL coverage
- `.claude/skills/e2e-testing/SKILL.md` if the Playwright spec is updated
- `.claude/agents/code-reviewer.md` for a correctness and coverage review after changes
- `.claude/agents/debugger.md` only if tests or runtime behavior regress

---

## Assumptions

- The visible label is `Gists`.
- The new link belongs only in the header navigation.
- The external link should open in a new tab because repo guidance requires `ExternalLink` for external destinations.
- The plan file lives at `codex-plans/header-gists-link/plan-header-gists-link.md`.
