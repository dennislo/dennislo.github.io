# Contact Form Mobile-First Execution Checklist

## Pre-Change

- [x] Confirm `/contact-form` uses `src/components/ContactForm/ContactForm.css`.
- [x] Capture baseline screenshots for mobile and desktop.
- [x] Identify and review existing unit tests for `ContactForm` before changes.

## CSS Refactor

- [x] Reorder styles to mobile-first base first.
- [x] Set container width/padding for small screens.
- [x] Ensure inputs/textarea are full-width with stable box sizing.
- [x] Ensure submit button is mobile-friendly (size + width).
- [x] Keep existing focus/error/success styles intact.

## Breakpoints

- [x] Add `@media (min-width: 480px)` adjustments.
- [x] Add `@media (min-width: 768px)` adjustments.
- [x] Add `@media (min-width: 1140px)` adjustments.
- [x] If needed, add markup hooks for grouped fields at tablet+.

## Unit Testing

- [x] Add/update tests in `src/components/ContactForm/ContactForm.test.tsx` for responsive-related markup/class hooks (if changed).
- [x] Confirm tests still cover core states: default form, validation errors, success state, and server-error rendering.
- [x] Run unit tests for touched files and confirm all pass.

## Manual Testing

- [x] Verify no horizontal overflow at 320px.
- [x] Verify field spacing and readability at 375px.
- [x] Verify tablet behavior at 768px.
- [x] Verify desktop behavior at 1140px+.
- [x] Verify error/success/server-error messages remain readable.
- [x] Verify keyboard-only navigation and visible focus indicators.
- [x] Verify submit button touch target and behavior on mobile viewports.
- [x] Record post-change screenshots for 320, 375, 768, and 1140 widths.

## Regression

- [x] Confirm hover/focus states still work.
- [x] Confirm `state.submitting` button disabled styling still looks correct.
- [x] Confirm no changes to validation or Formspree submission behavior.

## Done Definition

- [x] All acceptance criteria from the plan are satisfied.
- [x] Unit tests for touched files pass.
- [x] Manual testing checklist completed and final screenshots captured.

## Run Notes

- Unit tests executed: `npm test -- src/components/ContactForm/ContactForm.test.tsx --runInBand` (pass).
- Lint executed: `npm run lint` (pass).
- Manual testing and screenshots completed by user and approved.
