---
name: manual-testing
description: Manual QA workflow for web apps. Use when asked to start the app, open a browser, perform manual testing, use DevTools, capture screenshots, or document issues found during a manual test pass.
---

# Manual Testing

## Workflow

1. **Start the application.** Run `npm run develop` and wait for the local app to report a ready/healthy state.
2. **Open the target environment.** Launch Chrome and navigate to `http://localhost:8000`.
3. **Execute core scenarios.** Run the manual test scenarios listed below in a consistent order.
4. **Inspect with DevTools.** Check Console, Network, Elements, and Performance for visible and hidden issues.
5. **Capture evidence immediately.** Save screenshots for UI defects and record relevant console or network errors.
6. **Document findings clearly.** Log reproduction steps, expected vs actual behavior, and supporting evidence for each
   issue.
7. **Report pass/fail status.** Summarize what was covered, what failed, and what could not be validated.
8. **Escalate blockers.** If execution is blocked, request the missing environment setup, credentials, or test data.

## Test scenarios

- Home page renders.
- Contact form renders and is functional.
- Theme switcher works.

## Evidence capture

- Take a full-page screenshot when layout or visual issues appear.
- Capture console errors and network failures with timestamps or request URLs.
- Note browser, OS, viewport size, and any feature flags or test data used.

## Reporting format

- Provide a short summary of the pass.
- List issues as separate bullets using the following fields:
  Title: short issue name.
  Steps: minimal reproduction steps.
  Expected: expected behavior.
  Actual: observed behavior.
  Evidence: screenshot name, console error text, or request URL.

## If execution is blocked

- Ask the user to run the app or open the browser and share results.
- Request missing details: test scenarios, environment, credentials, or seed data.
