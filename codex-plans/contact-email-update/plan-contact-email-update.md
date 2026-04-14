# Contact Email Update

## Summary

Update the site-wide contact email from `dennis@dlo.wtf` to `lo.dennis@gmail.com`, and make sure the contact form notifications/receipts are routed to the same inbox. This is a narrow content/config update with one external dependency: the Formspree recipient setting.

## Key Changes

- Update `src/config.ts` so `siteConfig.social.email` becomes `lo.dennis@gmail.com`; this automatically updates the mailto links in the hero and footer.
- Update the public Markdown sources in `static/index.md` and `static/contact-form.md` so the rendered source pages match the new address.
- Verify the contact form still uses the existing Formspree wiring, and change the Formspree recipient/notification destination to `lo.dennis@gmail.com` in the Formspree dashboard if it is not already set there.
- Keep the Gatsby route/component structure unchanged; this is not a form redesign or submission-flow rewrite.
- No public API or type changes are expected.

## Agent Orchestration

| Agent           | Use                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `code-reviewer` | Review the email update for correctness, missing references, and any broken assumptions around Formspree or public-facing content. |
| `test-writer`   | Add or adjust assertions if we want explicit coverage for the new email in content or component tests.                             |
| `debugger`      | Use only if tests or typecheck fail after the update.                                                                              |

### Suggested Task Prompts

- `Task(subagent_type="code-reviewer", prompt="Review the email address update across src/config.ts, static/index.md, and static/contact-form.md, plus any contact-form-related code paths. Focus on correctness, completeness of public-facing email references, and whether the Formspree recipient change is handled as a code change or an external configuration step.")`
- `Task(subagent_type="test-writer", prompt="Update or add tests for the email address change. Cover the new mailto href derived from siteConfig.social.email and any public content assertions for static/index.md and static/contact-form.md if those are added to the test suite.")`

### Escalation Flow

```text
Implement email/content update
        |
        v
Run component + content tests
        |
        +--> pass -> review and finish
        |
        +--> fail -> debugger investigates
                         |
                         v
                fix config/content/test mismatch
                         |
                         v
                   rerun tests and verify
```

## Test Plan

- Unit: confirm the hero and footer email links still render with `mailto:lo.dennis@gmail.com` through `siteConfig.social.email`.
- Content: verify `static/index.md` and `static/contact-form.md` show the new address everywhere it is surfaced to users.
- E2E: keep the existing contact-form route tests green; add a markdown-source assertion if we want explicit coverage for the new address in the rendered source pages.
- Manual: send one test submission through the contact form and confirm the receipt lands in `lo.dennis@gmail.com`.

## Assumptions

- The current Formspree form ID stays the same unless the external Formspree setup requires a new one.
- The recipient change is managed in Formspree, not embedded in the Gatsby app.
- `lo.dennis@gmail.com` is the only email address that should replace the existing public contact address.

## Implementation Steps (Summary)

- [ ] Update `src/config.ts` to `lo.dennis@gmail.com`.
- [ ] Update `static/index.md` and `static/contact-form.md`.
- [ ] Confirm the Formspree recipient/notification destination is `lo.dennis@gmail.com`.
- [ ] Run the relevant tests and verify the contact form still behaves normally.
- [ ] Review for any remaining stale public-facing email references.
