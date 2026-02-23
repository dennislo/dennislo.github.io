# Contact Form Mobile-First CSS Plan

## Goal

Make the `/contact-form` page mobile-first and responsive while preserving current functionality, validation states, and theme variables.

## Current State Summary

- Contact form markup is in `src/components/ContactForm/ContactForm.tsx`.
- Styles are in `src/components/ContactForm/ContactForm.css`.
- Existing CSS is mostly single-column and fixed-width (`max-width: 600px`) but not explicitly mobile-first with structured breakpoints.

## Scope

- In scope: `ContactForm.css` layout/spacing/typography/button behavior, responsive breakpoints, touch targets, form field sizing.
- In scope: optional minor class additions in `ContactForm.tsx` only if needed for responsive layout grouping.
- In scope: unit tests updates/additions for responsive class hooks and core render/state behavior.
- In scope: manual testing across target viewport sizes and interaction states.
- Out of scope: form validation rule changes, Formspree integration changes, content changes.

## Mobile-First Design Requirements

1. Base styles target small screens first (320px+).
2. Inputs and textarea use full width by default.
3. Submit button is easy to tap (min-height/comfortable padding).
4. Container uses side padding and avoids edge collisions on narrow screens.
5. Typographic scale and spacing remain readable at small sizes.

## Responsive Breakpoint Strategy

- `@media (min-width: 480px)`:
  - Increase horizontal breathing room.
  - Slightly increase gaps and button size if needed.
- `@media (min-width: 768px)`:
  - Increase max content width and internal spacing.
  - Optionally place first/last name in a 2-column row (only if class hooks are added).
- `@media (min-width: 1140px)`:
  - Keep centered readable measure; avoid over-wide fields.

## Proposed CSS Refactor

1. Base (`mobile`) rules:
   - `contact-form-container`: `width: min(100%, <max>)`, `padding-inline`, `padding-block`.
   - `contact-form`: compact gaps tuned for mobile.
   - `.contact-form-field input, textarea`: `width: 100%`, `box-sizing: border-box`, min touch-friendly sizing.
   - `.contact-form-submit`: full-width on small screens for easier interaction.
2. Tablet-up rules:
   - Reduce button to intrinsic width (`align-self: flex-start`) at `768px+`.
   - Increase section spacing and heading margin.
3. Desktop rules:
   - Preserve readable line length and avoid oversized controls.

## Accessibility and UX Checks

- Preserve visible `:focus-visible` outline at all viewport sizes.
- Keep error text readable with sufficient line-height.
- Ensure no horizontal overflow at 320px width.
- Keep tap targets comfortably large (minimum ~44px interaction height).

## Implementation Steps

1. Refactor `src/components/ContactForm/ContactForm.css` to a mobile-first structure.
2. Add responsive media queries in ascending order (`480`, `768`, `1140`).
3. If needed, add lightweight layout hooks in `src/components/ContactForm/ContactForm.tsx` (e.g., name row wrapper).
4. Add/update unit tests in `src/components/ContactForm/ContactForm.test.tsx` for:
   - Core form render still intact after responsive refactor.
   - Error/success/server-error states still render as expected.
   - Any new responsive layout class hooks added to markup.
5. Run formatting/lint/tests relevant to CSS/component updates.
6. Manually verify `/contact-form` at 320px, 375px, 768px, and 1140px.

## Testing Plan

- Unit tests:
  - Run targeted tests for ContactForm component and any touched page/component tests.
  - Ensure all updated tests pass locally.
- Manual testing:
  - Verify layout and spacing at 320px, 375px, 768px, and 1140px.
  - Verify keyboard navigation and focus-visible states on all fields and submit button.
  - Verify client validation error display and success/server-error states remain legible and correctly positioned.
  - Verify no horizontal overflow and no clipped controls/messages at each viewport.

## Acceptance Criteria

- No horizontal scrolling on mobile widths.
- Form fields are full-width and readable on small screens.
- Button and inputs are touch-friendly on mobile.
- Layout scales cleanly on tablet/desktop without regressions.
- Existing validation/error/success UI remains functional and legible.
- Updated/new unit tests pass for touched behavior.
- Manual test checklist is completed for all target viewport widths.

## Risks and Mitigations

- Risk: breakpoints introduce inconsistent spacing.
  - Mitigation: use a small spacing scale and tune once per breakpoint.
- Risk: button width behavior may feel inconsistent.
  - Mitigation: full-width only on mobile, intrinsic width on tablet+.
- Risk: future field additions break layout.
  - Mitigation: keep form as a resilient one-column base; optional grid only above `768px`.
