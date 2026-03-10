---
name: rule-of-5
description:
  Multi-pass self-review workflow for designs, implementation plans, code, tests, and code health. Use when the user
  asks for the rule of five, repeated review, convergence, iterative critique, or multiple passes on important work. Do
  not use for trivial edits or single-pass tasks.
---

# Rule of Five

## Table of Contents

- [Overview](#overview)
- [When to Use](#when-to-use)
- [When Not to Use](#when-not-to-use)
- [Workflow](#workflow)
- [Pass Design](#pass-design)
- [Review Focus by Artifact](#review-focus-by-artifact)
- [Output Format](#output-format)
- [When to Stop](#when-to-stop)

## Overview

Use this skill when quality depends on repeated review rather than a single pass. The core idea is simple: produce a
first result, then review it several more times with different lenses until the work converges.

Counting model:

- Pass 0: initial draft, plan, implementation, or test change.
- Pass 1 to Pass 4: review passes over that initial artifact.
- Default Rule of Five pattern: 1 creation pass plus 4 review passes.

Do not treat review passes as duplicates. Each pass should search for issues the previous pass was likely to miss. Start
narrow when needed, then broaden into architecture, product fit, and "are we doing the right thing?" questions.

Default review depth:

- Small or low-risk tasks: Pass 0 plus 1 to 2 review passes.
- Medium tasks: Pass 0 plus 2 to 3 review passes.
- Large, risky, unfamiliar, or high-stakes tasks: Pass 0 plus 3 to 4 review passes.

Apply this approach to each stage that matters, not just the final code. Typical candidates are design, implementation
planning, code changes, tests, and code health.

## When to Use

Use this skill when the request or situation implies that one pass is not enough. Common triggers:

- "Use the rule of five."
- "Review this again."
- "Do multiple passes."
- "Self-critique before finalizing."
- "Stress test the plan or design."
- "Keep reviewing until it converges."

## When Not to Use

Do not force the full Rule of Five pattern onto trivial work where the cost exceeds the risk.

- Skip this skill for simple factual answers, tiny wording changes, or low-impact one-line edits unless the user explicitly asks for deeper review.
- Prefer 2 passes when the task is small and early review rounds find nothing new.
- Switch to a more specific skill when the real need is deterministic execution rather than reflective review.

## Workflow

1. **Define the artifact.** Decide what is being reviewed: design, `bd` implementation plan, code, tests, or overall code health.
2. **Produce Pass 0.** Create the draft, plan, implementation, or test change before beginning review.
3. **Set the review count.** Use 1 to 2 review passes for small work, 2 to 3 for medium work, and 3 to 4 for large or uncertain work.
4. **Run Pass 1.** Check obvious correctness, missing requirements, and low-level mistakes.
5. **Run Pass 2.** Re-read independently and look for issues missed in the first pass.
6. **Run later passes as needed.** Expand the lens to architecture, maintainability, UX, test strategy, edge cases, and whether the work solves the right problem.
7. **Fix between passes.** Update the artifact after each review round or batch the fixes if that is more efficient.
8. **Record only net-new findings.** Each review pass should state what changed, what remains risky, and whether confidence increased.
9. **Verify after the final review pass.** Run the relevant checks, then summarize why the work has converged.

## Pass Design

Use a different lens each round. A good default sequence is:

1. **Correctness pass.** Does it work? Are there logic errors, broken assumptions, missing cases, or invalid commands?
2. **Completeness pass.** Did we satisfy the request, constraints, dependencies, and expected deliverables?
3. **Maintainability pass.** Is the structure clear, typed, testable, and consistent with the codebase?
4. **Systems or existential pass.** Does the design or implementation create architectural, performance, security, or operational problems, and are we doing the right thing at all?

If useful, reverse the order and start broad before drilling down. What matters is mixing in-the-small and in-the-large
reviews rather than repeating the same critique five times.

Example cadence: for implementation work, write the code in Pass 0, then run four review passes with different lenses.

## Review Focus by Artifact

### Design

- Check whether the design matches the actual user problem.
- Stress the interfaces, ownership boundaries, and failure modes.
- Ask whether a simpler design would remove future maintenance cost.

### `bd` Implementation Plan

- Check whether issues are split at the right granularity.
- Verify dependencies, blockers, and sequencing.
- Improve issue shape and dependency quality inside `bd`; do not create duplicate tracking outside the system.
- Ask whether the plan creates the best execution path or just a plausible one.

### Code

- Check logic, typing, edge cases, regressions, and fit with local patterns.
- Re-review after changes; the second review often finds issues the first one missed.
- Add a broad pass for architecture, not just line-by-line defects.

### Tests

- Check whether tests cover behavior, not implementation details.
- Look for false confidence: missing edge cases, weak assertions, or happy-path-only coverage.
- Ask whether the tests would catch the most likely future regressions.

### Code Health

- Check naming, duplication, dead paths, confusing control flow, and cleanup opportunities.
- Confirm lint, typecheck, and build or targeted verification still pass.
- Ask whether the work is now easier for the next engineer to change safely.

## Output Format

When using this skill, report review passes explicitly and keep each one short. Pass 0 is optional in the write-up and
only needs to be reported when the draft itself needs explanation.

```md
Pass 0 - Initial Draft
- Optional note:

Pass 1 - Correctness
- Findings:
- Fixes made:
- Residual risk:

Pass 2 - Completeness
- Findings:
- Fixes made:
- Residual risk:

Pass 3 - Maintainability
- Findings:
- Fixes made:
- Residual risk:

Pass 4 - Systems or Existential
- Findings:
- Fixes made:
- Residual risk:

Convergence
- Decision:
- Why:
```

After the final pass, end with a short convergence statement that says whether confidence is now high enough to stop.

## When to Stop

Stop when additional passes are no longer producing meaningful findings and the output has clearly converged. If the
task is still revealing new categories of problems late in the process, do more passes.

If the task is tiny and Pass 2 finds nothing materially new, stop early and say so explicitly.

Do not claim convergence just because the pass count was reached. The stopping condition is stable quality, not merely
five iterations.
