---
name: manual-testing
description: Manual QA workflow for web apps. Use when asked to start the app, open a browser, perform manual testing, use DevTools, capture screenshots, or document issues found during a manual test pass.
---

# Manual Testing

## Workflow

- Start the app with `npm run develop` and wait for a ready/healthy state.
- Open Chrome to `http://localhost:8000`.
- Perform the manual test scenarios listed below.
- Use DevTools to inspect Console, Network, Elements, and Performance as needed.
- Capture screenshots for visible issues and record console/network errors.
- Write a concise issue log with reproduction steps, expected vs actual behavior, and evidence.

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
