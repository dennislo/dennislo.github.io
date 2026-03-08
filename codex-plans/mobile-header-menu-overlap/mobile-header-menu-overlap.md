# Plan: Fix Mobile Header Menu Overlap With Hero

## Summary

Fix the mobile header menu so that when the menu is open at the top of the homepage, the menu items do not overlap the
hero text. The recommended approach is to keep the header bar fixed, but render the mobile navigation as a dedicated
panel beneath it with its own background, spacing, and stacking context.

This keeps the current desktop navigation behavior intact while making the mobile open state visually isolated from the
hero section.

---

## Problem

### Actual behavior

When the mobile menu is open (`aria-expanded="true"`) and the user is at the top of the homepage, the open nav links
render in the same visual space as the hero content in [
`SiteHeader.tsx`](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.tsx) and [
`Hero.tsx`](/Users/dlo/work/dennislo.github.io/src/components/Hero/Hero.tsx).

This causes links such as "About", "Projects", "Experience", and "Education" to overlap the hero copy:
"Hello! 👋 I’m Dennis Lo".

### Expected behavior

When the mobile menu is open at the top of the page, the navigation should appear in its own visible layer and should
not overlap the hero text.

---

## Root Cause

The current header is fixed to the top of the viewport. On mobile, the menu list is simply toggled between `hidden`
and `flex` inside that fixed header container.

Because the header is transparent when the page is near the top and the menu is not rendered as a separate panel, the
expanded menu shares the same space as the hero beneath it. The hero remains visible through and around the open menu,
which creates the overlap.

---

## Recommended Solution

Render the mobile navigation as a dedicated dropdown panel positioned below the fixed header row.

### Core idea

1. Keep the top header row fixed.
2. Move the mobile open state into its own positioned panel.
3. Give that panel an opaque or strongly blurred background.
4. Offset the panel from the top by the mobile header height.
5. Ensure the panel has a higher stacking order than the hero content.

This solves the overlap without coupling the hero layout to menu state.

---

## Implementation Plan

### 1. Refactor the mobile menu container

Update [`SiteHeader.tsx`](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.tsx) so the mobile nav
is no longer just an inline `<ul>` expanding inside the normal document flow.

Instead:

- Keep the existing fixed `<header>` and top row with site title and menu button.
- Wrap the mobile navigation links in a dedicated panel container that renders only on small screens.
- Position the panel directly below the top row using `absolute` or `fixed` positioning.

Suggested direction:

- Header root remains `fixed top-0 left-0 right-0`.
- Top row keeps the current menu toggle button.
- Mobile menu panel uses:
  - `absolute left-0 right-0 top-full` if anchored to the header, or
  - `fixed left-0 right-0` with a computed top offset if that proves more reliable.

Preferred first pass:

- Use `absolute top-full left-0 right-0` inside the header/nav container so the panel naturally sits below the header
  row.

### 2. Give the mobile panel its own visual surface

Apply mobile-only styling to make the open menu read as a separate layer:

- Solid background such as `bg-white dark:bg-gray-950`
- Optional backdrop blur, but not blur alone
- Border or shadow for separation from the hero
- Padding that matches the site spacing scale

Suggested Tailwind classes for the panel:

- `bg-white/95 dark:bg-gray-950/95`
- `backdrop-blur-sm`
- `shadow-lg`
- `border-t border-gray-100 dark:border-gray-800`
- `px-4 pb-4`

The key requirement is that the background is visually strong enough to prevent the hero text from reading through the
menu.

### 3. Constrain panel height for smaller screens

Prevent the open menu from colliding with other viewport content on short devices:

- Add a max height relative to the viewport
- Allow internal scrolling when necessary

Suggested direction:

- `max-h-[calc(100vh-4.5rem)] overflow-y-auto`

The exact offset should match the final mobile header height.

### 4. Preserve desktop navigation behavior

Keep the existing desktop navigation layout unchanged:

- Mobile panel behavior applies only below `md`
- Desktop nav remains inline and always visible from `md` upward

This avoids regression risk on larger screens.

### 5. Keep interaction behavior consistent

Preserve the existing accessible behavior already present in the component:

- `aria-expanded` updates on the toggle button
- `aria-controls` remains connected to the menu container
- `Escape` closes the menu
- Clicking a nav link closes the menu
- Resizing to desktop width closes the mobile menu

Optional enhancement:

- Add outside-click dismissal only if it can be done cleanly without introducing focus bugs

This is not required for the overlap fix.

---

## Suggested Markup Direction

Example shape only, not final code:

```tsx
<header className="fixed top-0 left-0 right-0 z-50">
  <nav className="relative px-4 py-4 md:px-16 lg:px-24" aria-label="Primary">
    <div className="flex items-center justify-between">...</div>

    <div
      id="site-header-menu"
      className={
        isMenuOpen
          ? "absolute left-0 right-0 top-full md:hidden ..."
          : "hidden md:hidden"
      }
    >
      <ul className="flex flex-col gap-3 ...">...</ul>
    </div>

    <ul className="hidden md:flex md:items-center md:justify-end md:gap-6 lg:gap-8">
      ...
    </ul>
  </nav>
</header>
```

This separates the mobile and desktop render paths and makes the mobile open state easier to style and test.

---

## Agent And Skill Usage

Use the repo-specific agents and skills called out in [`CLAUDE.md`](/Users/dlo/work/dennislo.github.io/CLAUDE.md) during
implementation of this fix.

### 1. Senior frontend engineer

Use `.claude/agents/senior-frontend-engineer.md` for the UI implementation work.

Scope:

- Refactor the mobile navigation structure in [
  `SiteHeader.tsx`](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.tsx)
- Preserve desktop navigation behavior
- Apply the mobile panel styling and stacking-context fix
- Keep the implementation aligned with Gatsby, React, TypeScript, and current Tailwind usage

### 2. Debugger

Use `.claude/agents/debugger.md` if the visual issue reproduces differently than expected, if tests fail, or if the open
menu behavior is unclear during implementation.

Scope:

- Confirm exact reproduction conditions
- Investigate stacking, positioning, and height issues
- Isolate regressions involving scroll behavior, menu state, or keyboard dismissal
- Fix any implementation or test failures discovered during the change

### 3. Test writer

Use `.claude/agents/test-writer.md` for unit and integration test coverage.

Scope:

- Extend [`SiteHeader.test.tsx`](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.test.tsx)
- Cover mobile menu panel visibility and open/close behavior
- Add assertions around the non-overlapping mobile menu structure where practical in unit tests

### 4. Manual testing

Use `.agent/skills/manual-testing/SKILL.md` for the browser verification pass after implementation.

Scope:

- Start the app locally
- Open `http://localhost:8000`
- Verify the homepage in a mobile viewport at the top of the page
- Open the mobile menu and confirm it no longer overlaps the hero text
- Check dark and light themes
- Confirm no regressions on anchor navigation or the contact form route

### 5. E2E-testing

Use `.claude/skills/e2e-testing/SKILL.md` for Playwright regression coverage.

Scope:

- Extend [`header-navigation.spec.ts`](/Users/dlo/work/dennislo.github.io/src/test-e2e/header-navigation.spec.ts)
- Add a mobile viewport regression test for the top-of-page open-menu overlap case
- Verify the open mobile menu does not visually intersect the hero heading
- Keep the assertions focused on browser-observed layout behavior rather than URL state alone

---

## Testing Plan

### Unit tests

Update [`SiteHeader.test.tsx`](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.test.tsx) to
cover:

1. Mobile menu panel is closed by default.
2. Opening the menu sets `aria-expanded="true"`.
3. The mobile menu container receives the expected open-state classes or visibility state.
4. Clicking a nav link closes the mobile menu.
5. Pressing `Escape` closes the mobile menu.
6. Resizing to desktop width closes the mobile menu.

### E2E tests

Extend [`header-navigation.spec.ts`](/Users/dlo/work/dennislo.github.io/src/test-e2e/header-navigation.spec.ts) with a
regression test for the overlap case:

1. Open the homepage in a mobile viewport.
2. Ensure the page is scrolled to the top.
3. Open the mobile menu.
4. Assert the menu is visible.
5. Assert the hero heading is visually below the menu panel area or otherwise not intersecting the open menu region.

Practical assertion options:

- Compare bounding boxes of the mobile menu panel and hero heading to ensure they do not intersect.
- Or assert the menu panel occupies the full width with an opaque background and extends above the hero heading
  position.

Preferred assertion:

- Use bounding-box non-intersection between the open mobile panel and the hero heading text.

---

## Validation Checklist

- Mobile menu opens at the top of the homepage without overlapping hero text
- Mobile menu remains readable in both light and dark themes
- Desktop navigation is unchanged
- Anchor links still scroll correctly to `#about`, `#projects`, `#experience`, and `#education`
- Escape-to-close still works
- Resize-to-desktop still resets mobile state
- No visual regression on the contact form route

---

## Alternatives Considered

### 1. Add top padding to the hero when the menu opens

This would move the hero content down temporarily, but it couples `Hero` to `SiteHeader` state and introduces
unnecessary layout coordination across components.

### 2. Convert the mobile menu into a full-screen drawer

This would also fix the overlap, but it is a heavier change than necessary for a short list of in-page links.

### Recommendation

Use the dedicated mobile panel below the fixed header. It is the lowest-risk fix and fits the current component
structure best.

---

## Implementation Steps (Summary)

1. [x] **Agent: senior-frontend-engineer** — Updated [
       `SiteHeader.tsx`](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.tsx) to split mobile and
       desktop navigation paths, keeping the header row fixed and rendering the mobile menu in a dedicated panel below it.
2. [x] **Agent: senior-frontend-engineer** — Added mobile-only panel styling in [
       `SiteHeader.tsx`](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.tsx) so the open menu has
       an opaque background, separation from the hero, and a higher stacking context.
3. [x] **Agent: senior-frontend-engineer** — Constrained the mobile panel height, enabled internal scrolling, and kept
       the existing interaction behavior (`aria-expanded`, `aria-controls`, Escape-to-close, close-on-link-click, and
       close-on-resize-to-desktop).
4. [x] **Agent: test-writer** — Extended [
       `SiteHeader.test.tsx`](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.test.tsx) to cover the
       new mobile panel structure and open/close behavior.
5. [x] **Skill: e2e-testing** — Extended [
       `header-navigation.spec.ts`](/Users/dlo/work/dennislo.github.io/src/test-e2e/header-navigation.spec.ts) with a mobile
       regression test that verifies the open menu renders above the hero in the browser at the top of the page.
6. [x] Ran `npm run typecheck`, `npx jest src/components/SiteHeader/SiteHeader.test.tsx --runInBand --no-coverage`,
       and `npx playwright test src/test-e2e/header-navigation.spec.ts --grep "mobile menu opens|top visual layer|land sections below"`.
7. [x] **Agent: debugger** — Investigated the broader Playwright spec failure and confirmed it was caused by pre-existing
       local asset/runtime console 404s in the existing "runtime and local asset errors" test, not by the mobile header
       menu change.
8. [x] **Skill: manual-testing** — Manually verified the homepage header in a mobile viewport at `http://localhost:8000`,
       confirmed the open menu renders as the top visual layer over the hero area, and checked the interaction directly in
       the browser.
