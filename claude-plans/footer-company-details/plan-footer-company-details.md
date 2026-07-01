# Plan: Footer Company Details

## Overview

Add the requested company details directly under the existing footer sentence that currently renders as
`© {currentYear} Dennis Lo. Built with ❤️ using Gatsby.js`. On July 1, 2026, that line renders as
`© 2026 Dennis Lo. Built with ❤️ using Gatsby.js`, and the new legal/business details should appear immediately below
it in the same footer section.

The change is small in scope, but it still needs to follow the repo's mandatory TDD workflow from `AGENTS.md`:
write failing unit and end-to-end tests first, implement the minimum UI/config changes second, then push, open a PR,
and run code review before merge.

## Requested Company Details

- Name: `Agile IT & Software Limited`
- Address: `Brookfield Court Selby Road, Garforth, Leeds LS25 1NB, UK`
- Company Number: `10042911`
- VAT number: `235 2977 88`

## Current State

- [`src/components/SiteFooter/SiteFooter.tsx`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/components/SiteFooter/SiteFooter.tsx)
  renders a single bottom paragraph with the dynamic year, localized `footer.builtWith` / `footer.using` copy, and
  the Gatsby link.
- [`src/components/SiteFooter/SiteFooter.test.tsx`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/components/SiteFooter/SiteFooter.test.tsx)
  covers the current footer links and localized copy, but not company/legal details.
- The translation dictionaries in
  [`src/i18n/translations/en-GB.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/i18n/translations/en-GB.ts),
  [`src/i18n/translations/en-US.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/i18n/translations/en-US.ts),
  [`src/i18n/translations/es-ES.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/i18n/translations/es-ES.ts),
  and
  [`src/i18n/translations/zh-Hans.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/i18n/translations/zh-Hans.ts)
  do not yet define footer labels for company metadata.
- [`src/config.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/config.ts) has site-wide structured
  content but no dedicated footer/company-details object yet.

## Proposed Implementation

### 1. Centralize the invariant company values in `siteConfig`

Add a small `companyDetails` object to `siteConfig` in
[`src/config.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/config.ts), for example:

```ts
companyDetails: {
  name: "Agile IT & Software Limited",
  address: "Brookfield Court Selby Road, Garforth, Leeds LS25 1NB, UK",
  companyNumber: "10042911",
  vatNumber: "235 2977 88",
}
```

Why:

- The values are legal/business identifiers and should stay identical across locales.
- This keeps footer content structured and reusable rather than hard-coding it inside the component.
- The repo already treats company names as invariant data in other places, such as experience entries.

### 2. Add localized footer labels only where labels are needed

Extend each footer dictionary with the minimum additional keys needed for surrounding copy, most likely:

```ts
companyNumberLabel: "Company Number";
vatNumberLabel: "VAT number";
```

Optional:

- If the rendered address should include a label, add `addressLabel`.
- If the company name should be prefixed by a label instead of standing alone, add `companyNameLabel`.

Planned default:

- Render the company name and address as invariant text lines.
- Localize only the `Company Number` and `VAT number` labels so non-English pages keep the existing i18n standard
  without over-translating legal values.

### 3. Update the footer markup with a second text block

Modify [`src/components/SiteFooter/SiteFooter.tsx`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/components/SiteFooter/SiteFooter.tsx)
to render a stacked block directly beneath the existing copyright/Gatsby line.

Recommended structure:

- Keep the existing top footer layout unchanged.
- Keep the current copyright/Gatsby sentence as the first line.
- Add a second block beneath it with small subdued text and tight spacing.
- Use semantic, readable markup such as:
  - one `<p>` for the company name
  - one `<address className="not-italic">` or `<p>` for the address
  - one `<p>` for company number
  - one `<p>` for VAT number

Recommended styling constraints:

- Preserve centered alignment inside the existing bottom footer section.
- Use smaller legal-copy styling such as `text-xs` or equivalent existing Tailwind scale.
- Add only modest vertical spacing, for example `mt-3` or `space-y-1`, so the footer grows naturally without looking
  detached.
- Preserve light/dark contrast using the existing gray token family.

### 4. Preserve locale behavior intentionally

The plan assumes:

- Company name, address, company number, and VAT number are invariant across locales.
- Labels such as `Company Number` and `VAT number` should localize through the existing footer dictionaries.
- The new details should appear on `/`, `/en-US/`, `/es-ES/`, and `/zh-Hans/` without changing route behavior or
  locale switching.

## Files Expected To Change

- [`src/config.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/config.ts)
- [`src/components/SiteFooter/SiteFooter.tsx`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/components/SiteFooter/SiteFooter.tsx)
- [`src/components/SiteFooter/SiteFooter.test.tsx`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/components/SiteFooter/SiteFooter.test.tsx)
- [`src/i18n/translations/en-GB.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/i18n/translations/en-GB.ts)
- [`src/i18n/translations/en-US.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/i18n/translations/en-US.ts)
- [`src/i18n/translations/es-ES.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/i18n/translations/es-ES.ts)
- [`src/i18n/translations/zh-Hans.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/i18n/translations/zh-Hans.ts)
- One Playwright spec in [`src/test-e2e/`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/test-e2e), preferably
  `footer-company-details.spec.ts`

## TDD Execution Plan

### Preflight

1. Check for existing ready work with `bd ready --json`.
2. Claim the relevant issue with `bd update <id> --claim --json`, or create a new linked issue if this change is not
   already tracked.

### Step 1. Write failing unit tests first

Use the `test-writer` agent together with the `unit-testing` skill to extend
[`src/components/SiteFooter/SiteFooter.test.tsx`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/components/SiteFooter/SiteFooter.test.tsx).

New assertions should cover:

- The footer renders `Agile IT & Software Limited`.
- The footer renders `Brookfield Court Selby Road, Garforth, Leeds LS25 1NB, UK`.
- The footer renders the company number with its label.
- The footer renders the VAT number with its label.
- The new legal details appear in the default locale.
- The invariant values still appear in at least one non-English locale such as `zh-Hans`.
- Existing Gatsby link and current footer copy still render.

Run the narrow test first and confirm it fails for the right reason:

```bash
npx jest src/components/SiteFooter/SiteFooter.test.tsx --runInBand
```

### Step 2. Write failing E2E coverage before implementation

Use the `e2e-testing` skill to add a focused Playwright spec, preferably
[`src/test-e2e/footer-company-details.spec.ts`](/Users/dlo/.codex/worktrees/872f/dennislo.github.io/src/test-e2e/footer-company-details.spec.ts).

The spec should verify:

- On `/`, the footer shows the requested company details.
- On a localized route such as `/zh-Hans/`, the footer still shows the invariant values and the page remains localized.
- The assertions scope to the footer via `getByRole("contentinfo")` or `locator("footer")` instead of brittle global
  text queries.

Run the focused spec and confirm it fails before implementation:

```bash
npx playwright test src/test-e2e/footer-company-details.spec.ts
```

### Step 3. Implement the minimum code change

Use the `senior-frontend-engineer` agent after both test layers exist and are failing for the missing footer details.

Implementation scope:

- Add `siteConfig.companyDetails` in `src/config.ts`.
- Add the minimum new footer translation keys across all locale files.
- Render the new legal block in `SiteFooter.tsx` under the existing copyright sentence.
- Keep the rest of the footer layout and navigation/social behaviors unchanged.

### Step 4. Run targeted verification, then broader quality gates

After implementation:

```bash
npx jest src/components/SiteFooter/SiteFooter.test.tsx --runInBand
npx playwright test src/test-e2e/footer-company-details.spec.ts
npm run typecheck
npm test -- --runInBand
npm run test:e2e
```

Optional but recommended:

```bash
npm run build
```

### Step 5. Debug only if verification fails

If unit tests, E2E tests, typecheck, or build fail, use the `debugger` agent.

The debugger should:

1. Capture the exact failing command and error output.
2. Isolate whether the problem is markup, translation typing, test assumptions, or Gatsby rendering.
3. Apply the smallest safe fix.
4. Re-run the failing command first, then the broader verification set.

### Step 6. Open the PR and run review before merge

Once tests pass:

1. Commit both tests and implementation together.
2. `git pull --rebase`
3. `bd sync`
4. `git push`
5. Open the PR.
6. Use the `code-reviewer` agent for a PR review pass.
7. Resolve all Critical and Warning findings before merge.

### Step 7. Manual verification

Use the `manual-testing` skill for a quick visual pass on `http://localhost:8000`:

- Confirm the footer still looks balanced on desktop and mobile widths.
- Confirm the new legal block sits directly below the Gatsby sentence.
- Confirm light and dark mode contrast still feels consistent.
- Confirm the footer does not gain awkward spacing or wrapping regressions.

## Agent And Skill Orchestration

| Step      | Agent / Skill                              | Purpose                                                    |
| --------- | ------------------------------------------ | ---------------------------------------------------------- |
| Preflight | Main agent + `bd`                          | Claim or create the tracked work item                      |
| 1         | `test-writer` agent + `unit-testing` skill | Add failing Jest coverage for footer company details       |
| 2         | `e2e-testing` skill                        | Add failing Playwright coverage for the footer journey     |
| 3         | `senior-frontend-engineer` agent           | Implement the minimum footer/config/i18n changes           |
| 4         | Main agent                                 | Run targeted and broad verification commands               |
| 5         | `debugger` agent                           | Investigate and fix failures only if verification breaks   |
| 6         | Main agent                                 | Commit, sync, push, and open the PR                        |
| 7         | `code-reviewer` agent                      | Review the final PR diff for correctness and test adequacy |
| 8         | `manual-testing` skill                     | Verify layout and behavior in the browser                  |

### Suggested Task Prompts

#### `test-writer`

```text
Task(subagent_type="test-writer", prompt="Update src/components/SiteFooter/SiteFooter.test.tsx for the footer company details feature. Add failing tests that assert the footer renders Agile IT & Software Limited, Brookfield Court Selby Road, Garforth, Leeds LS25 1NB, UK, Company Number 10042911, and VAT number 235 2977 88. Cover the default locale and one non-English locale to confirm the legal values remain invariant. Preserve the existing footer link and localization assertions.")
```

#### `senior-frontend-engineer`

```text
Task(subagent_type="senior-frontend-engineer", prompt="Implement the footer company details feature with the minimum change required. Add structured company details to src/config.ts, add the necessary footer translation labels across the locale dictionaries, and render the new legal details directly under the existing copyright/Gatsby sentence in src/components/SiteFooter/SiteFooter.tsx. Preserve the existing footer layout, accessibility, and locale-aware behavior.")
```

#### `debugger`

```text
Task(subagent_type="debugger", prompt="Investigate the failing verification for the footer company details feature. Capture the exact failing Jest, Playwright, typecheck, or build output first; isolate whether the breakage comes from footer markup, translation typing, or test assumptions; then apply the minimal fix and re-run the failing command.")
```

#### `code-reviewer`

```text
Task(subagent_type="code-reviewer", prompt="Review the footer company details change across src/config.ts, src/components/SiteFooter/SiteFooter.tsx, src/components/SiteFooter/SiteFooter.test.tsx, the footer locale dictionaries, and the new Playwright spec. Focus on correctness, locale behavior, accessibility, responsive layout risk, and whether the tests are strong enough to catch regressions.")
```

## Agent Escalation Flow

```text
Main agent
├── bd preflight (claim/create issue)
├── test-writer + unit-testing skill (write failing Jest tests)
├── e2e-testing skill (write failing Playwright spec)
├── senior-frontend-engineer (implement minimum code change)
├── main agent (run Jest, Playwright, typecheck, build)
│   └── debugger (only if a verification step fails)
├── main agent (commit, sync, push, open PR)
├── code-reviewer (review PR diff and tests)
└── manual-testing skill (final visual verification)
```

## Assumptions

- The legal values provided by the user are the final approved strings and should be rendered exactly as written.
- The current year should remain dynamic via `new Date().getFullYear()`, so the footer keeps showing the correct year
  after 2026.
- The footer change should not alter navigation links, social icons, route localization, or Gatsby link behavior.
- The company/legal values are invariant content; only surrounding labels need translation.

## Risks To Watch

- Adding new footer translation keys can break TypeScript expectations if one locale file is missed.
- Footer copy can wrap awkwardly on narrow mobile widths if the legal block is not spaced carefully.
- Exact-text tests can become brittle if markup splits strings unexpectedly, so tests should query visible content in a
  DOM-aware way.

## Implementation Steps (Summary)

- [ ] Claim or create the tracked `bd` issue for the footer company details work.
- [ ] Use `test-writer` with the `unit-testing` skill to add failing Jest coverage in `SiteFooter.test.tsx`.
- [ ] Use the `e2e-testing` skill to add a failing Playwright spec for footer company details.
- [ ] Confirm both test layers fail for the missing footer details.
- [ ] Use `senior-frontend-engineer` to implement the minimal `config` + `SiteFooter` + locale updates.
- [ ] Run targeted Jest and Playwright verification, then `npm run typecheck`, `npm test -- --runInBand`, and `npm run test:e2e`.
- [ ] Use `debugger` only if a verification command fails.
- [ ] Commit, `git pull --rebase`, `bd sync`, and `git push`.
- [ ] Open the PR and use `code-reviewer` to review the final diff.
- [ ] Use the `manual-testing` skill to visually verify the footer before merge.
