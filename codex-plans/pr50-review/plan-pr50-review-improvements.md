### PR #50 Review Improvement Plan (`/code-reviewer`-driven)

#### Summary

Use `origin/pr-50-head` as the implementation baseline (not `develop`) and prepare a focused follow-up branch
`codex/pr50-review-fixes`. Prioritize one functional regression (mobile navigation access), then tighten tests around
user-visible behavior and accessibility.

#### Key Changes

1. **Create fix branch from PR head**
2. Run:
   `git switch --create codex/pr50-review-fixes origin/pr-50-head`
3. Keep all existing PR files together (per your preference), but include a short reviewer note that `.claude/skills/*`
   edits are intentional and non-product changes.

4. **Fix mobile navigation regression (Critical)**
5. Update [SiteHeader.tsx](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.tsx) so primary nav
   is available on small screens (currently hidden with `hidden md:block`).
6. Implement either:
   - Responsive inline nav visible on all breakpoints, or
   - A compact mobile menu toggle with accessible open/close semantics.
7. Ensure key in-page links (`#about`, `#projects`, `#experience`, `#education`) are reachable on mobile.

8. **Strengthen behavior-driven tests (Warning)**
9. Extend [SiteHeader.test.tsx](/Users/dlo/work/dennislo.github.io/src/components/SiteHeader/SiteHeader.test.tsx):
   - Assert mobile nav affordance exists (or nav links remain reachable).
   - Assert scroll-state class change is triggered by scroll event.
10. Refine [Layout.test.tsx](/Users/dlo/work/dennislo.github.io/src/components/Layout/Layout.test.tsx) to avoid DOM
    implementation-detail checks (`querySelector`) and assert user-visible structure/roles instead.

11. **Review safety/quality pass before update**
12. Run `npm run test`, `npm run lint`, `npm run typecheck`.
13. Manually verify mobile viewport behavior on homepage and in-page anchor navigation.

#### Public Interfaces / Types

- No external API changes.
- UI interaction contract changes:
  - Header navigation must be available on mobile.
  - Header scroll state remains visually distinct after scrolling.

#### Test Plan

- Unit tests:
  - `SiteHeader` renders nav access for mobile and desktop behavior paths.
  - `SiteHeader` reacts to scroll event.
  - `Layout` test asserts behavior, not DOM internals.
- Manual scenarios:
  - iPhone/Android viewport: can reach all major sections from header/footer links.
  - Dark/light mode still works with fixed header and theme toggle.
  - No regressions on contact form route.

#### Manual Testing Follow-up (`manual-testing`)

- Start the local app and open `http://localhost:8000` in Chrome.
- Run the core manual scenarios in this order:
  - Homepage renders without layout shifts or blocked content.
  - Mobile header menu opens, closes, and reaches `#about`, `#projects`, `#experience`, and `#education`.
  - Theme toggle still works with the fixed header present on small screens.
  - Contact form route renders and the back link returns to the homepage.
- Inspect Chrome DevTools:
  - Console for runtime errors and hydration warnings.
  - Network for failed page-data, static asset, or Formspree requests.
  - Elements/Responsive mode for header overlap with hero content or the floating theme toggle.
- Capture evidence for any failures:
  - Full-page screenshot for layout defects.
  - Console error text and affected route.
  - Network request URL and response status for failed requests.

#### Debugger Investigation Additions (`debugger`)

- Understand any runtime errors by recording:
  - Exact route, viewport size, theme, and reproduction steps.
  - First visible symptom and the first console/network error that appears with it.
- Investigate likely risk areas introduced by the header fix:
  - Whether the mobile menu should close on `Escape` or outside click.
  - Whether focus order remains logical when the menu is opened and closed.
  - Whether the fixed header obscures anchored sections after in-page navigation.
- If a browser-side error is found, isolate it before changing code:
  - Reproduce on `/` and `/contact-form`.
  - Narrow to the smallest component involved (`SiteHeader`, `Layout`, `ThemeToggle`, or `ContactForm`).
  - Add a targeted regression test before or alongside the fix.

#### Frontend / Test Follow-up (`senior-frontend-engineer` + `test-writer`)

- If manual testing shows anchor targets landing under the fixed header, add scroll offset handling for in-page sections and cover it with a focused test.
- If the mobile menu interaction feels incomplete, consider adding keyboard dismissal (`Escape`) and verify the toggle remains properly labelled and focusable.
- Add or extend tests only around user-visible behavior:
  - Mobile menu closes after choosing a link.
  - Mobile menu resets correctly when returning to desktop width.
  - Header and theme toggle do not regress the contact form route structure or navigation.

#### Assumptions

- Baseline for fixes is PR head commit `e4b064667dd5e96f0b88becc8b22c36948701132`.
- We are explicitly not diffing/reviewing against `develop`; findings are based on PR merge-parent baseline.
- Non-product `.claude/skills/*` edits stay in scope (as requested).

#### Implementation Summary

- [ ] Restored mobile access to primary header navigation with an accessible menu toggle on small screens.
- [ ] Preserved desktop header navigation behavior while keeping the fixed header scroll styling intact.
- [ ] Added `SiteHeader` coverage for mobile menu access and scroll-state styling updates.
- [ ] Updated `Layout` tests to assert user-visible behavior instead of DOM implementation details.
- [ ] Verified the automated quality gates with `npm run test -- --runInBand`, `npm run lint`, and `npm run typecheck`.
- [ ] Complete the Chrome manual test pass for homepage, mobile header navigation, theme toggle, and contact form behavior.
- [ ] Record and investigate any console/network/runtime issues before applying follow-up fixes.
- [ ] Add targeted regression coverage for any browser-only issues discovered during manual testing.
