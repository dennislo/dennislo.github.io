# Plan: Keep `AGENTS.md` And `CLAUDE.md` Identical Via Husky

## Objective

Update the Husky commit hook flow so commits fail whenever the index version of [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) and [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) would no longer be identical after the commit.

The check should evaluate the exact content in the Git index, not the working tree, and it should produce a short remediation message that tells the contributor to resync [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) from the canonical [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) baseline before retrying the commit.

## Current State

- [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) and [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) are already different in both structure and content.
- The only active Husky hook is [`.husky/pre-commit`](/Users/dlo/work/dennislo.github.io/.husky/pre-commit), which currently runs:
  - `npm run format`
  - `npm run typecheck`
  - `npm run lint`
  - `npm test`
- Because the files are already divergent, adding a strict equality check without first reconciling the baseline would cause every commit to fail.
- The canonical-source decision is now explicit: [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) is the source of truth, and [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) must mirror it exactly.

## Scope

### In scope

- enforce full-file equality between [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) and [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md)
- define [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) as the canonical source and [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) as the mirrored copy
- add a Husky guard that validates the index state before commit
- document the contributor workflow for keeping the files synchronized

### Out of scope

- changing unrelated Husky quality gates
- introducing a broader documentation generation system unless it is needed to make the sync rule maintainable
- rewriting the contents of the two files beyond what is required to establish the chosen canonical baseline

## Constraints

### 1. Validate index content, not the working tree

The hook must compare the Git index blobs for both files, not the on-disk files. This avoids false positives when a contributor has unstaged edits or when a formatter rewrites the files during the hook.

Use Git's index view for the comparison, for example with `git show :AGENTS.md` and `git show :CLAUDE.md`, or an equivalent staged-file read.

### 2. Define the enforcement moment

The repository currently uses `pre-commit`, and that is the simplest place to add the check because the project already depends on it.

If the check remains in [`.husky/pre-commit`](/Users/dlo/work/dennislo.github.io/.husky/pre-commit), it should run before the expensive quality gates so contributors fail fast on documentation drift.

### 3. File presence must be enforced

If the policy is full-file equality, both files must remain present in the index. A commit that deletes, renames, or stops tracking either file should fail with a clear explanation, because the synchronization guarantee otherwise becomes meaningless.

### 4. Baseline sync is required

Since the two files are not currently identical, implementation must first reconcile [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) to match the canonical [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) baseline before enabling enforcement.

## Recommended Design

### Hook behavior

Add a small shell check that:

1. detects whether either file is staged for commit
2. verifies that both files still exist in the index
3. resolves the staged blob object for each file
4. fails if the blob IDs differ
5. exits with a non-zero status and a short remediation message if they differ

This should be implemented as a dedicated script, for example `scripts/check-agents-claude-sync.sh`, and called from [`.husky/pre-commit`](/Users/dlo/work/dennislo.github.io/.husky/pre-commit). Keeping the logic out of the hook file makes it easier to test and maintain.

Comparing staged blob IDs is the preferred implementation because identical blob hashes imply byte-for-byte identical content without needing temporary files. If the hook wants to print a helpful diff, it can fall back to comparing extracted index content only on failure.

### Canonical source choice

Manual duplication is easy to drift out of sync. The implementation should use one explicit source of truth and one explicit synchronization action:

- [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) is canonical
- [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) is the mirrored file
- the documented repair path should copy [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) to [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md), then restage both files if needed

The hook should validate only. If a sync helper is added, keep that as a separate script so the failure mode stays predictable.

### Detection rules

- If neither file is staged, the check should exit successfully without doing anything.
- If one file is staged and the other is not, the check should still compare the index versions that would be committed and fail if they differ.
- If both files are staged, compare the index blobs directly.
- If either file is missing from the index, fail immediately.
- If a rename or delete touches either path, treat that as a failure unless both canonical paths still exist in the index after staging.
- The error should instruct the contributor to restore [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) from [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) and restage before retrying the commit.

### Suggested remediation path

Standardize one repair path so the hook message and docs can reference it verbatim:

```bash
cp CLAUDE.md AGENTS.md
git add CLAUDE.md AGENTS.md
```

If the repository later adds a helper script, the hook message can point to that command instead.

## Implementation Plan

### 1. Reconcile the source files to the canonical baseline

Update [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) so it matches the canonical [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) baseline before enabling enforcement.

This is mandatory because the current diff is substantial. Without this baseline step, the new hook will fail every commit immediately.

### 2. Add a dedicated sync-check script

Create a small POSIX shell script that:

- inspects `git diff --cached --name-only --diff-filter=ACDMR -- AGENTS.md CLAUDE.md`
- exits early when neither file is relevant to the commit
- verifies both files are present in the index
- resolves the staged blob ID for both files with Git
- compares the blob IDs first
- optionally prints an extracted diff of the index content when the comparison fails
- prints a concise failure message when the files diverge

The script should avoid mutating either file. Its job is validation only.

If a helper script is added, it should make the canonical direction obvious, for example `scripts/sync-agents-from-claude.sh`.

### 3. Wire the script into Husky

Edit [`.husky/pre-commit`](/Users/dlo/work/dennislo.github.io/.husky/pre-commit) so the sync check runs before formatting, typechecking, linting, and tests.

This keeps the failure fast and avoids spending time on the full gate suite when the commit is already invalid.

### 4. Add focused verification for the script path

Because Husky hooks are shell entrypoints, verify the behavior with a lightweight script-level test or a documented manual validation flow that covers:

- no staged doc changes
- only one of the files staged
- both files staged and identical
- both files staged and different
- one file removed from the index
- one file renamed away from the canonical path

If the repository already has a shell-test convention, follow it. Otherwise, a concise manual verification checklist is acceptable for the first pass.

### 5. Document the workflow

Add a short note near the hook or in contributor docs explaining:

- the files are intentionally mirrored
- that [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) is canonical
- that [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) must be regenerated or copied from [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md)
- that commits will fail if the index versions drift

Include the exact remediation command sequence in the documentation so the hook error can point to one unambiguous fix path.

## Suggested Acceptance Criteria

- [ ] [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) is documented as the canonical baseline
- [ ] [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) has been reconciled to match the canonical [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) baseline
- [ ] A dedicated validation script compares the index versions of the two files
- [ ] [`.husky/pre-commit`](/Users/dlo/work/dennislo.github.io/.husky/pre-commit) runs the validation before the existing quality gates
- [ ] A commit with matching staged files passes the sync check
- [ ] A commit with divergent staged files fails with a clear remediation message
- [ ] A commit that removes either file fails clearly
- [ ] A commit that renames either file away from its canonical path fails clearly
- [ ] Contributor docs describe the canonical direction and the exact resync steps
- [ ] The hook message and contributor docs point to the same remediation command sequence

## Risks

### 1. False failures from working-tree comparison

Risk: Comparing on-disk files instead of index blobs will create false failures when contributors have partial staging.

Recommended solution: Implement the check against staged blob IDs from the Git index, not filesystem contents. Use Git index lookups as the source of truth throughout the script and only inspect extracted content when generating an optional failure diff.

### 2. Unnecessary hook complexity

Risk: Comparing extracted temp-file content when blob IDs would suffice adds avoidable complexity to the hook implementation.

Recommended solution: Make blob-ID comparison the primary path. Keep extracted temporary content as a failure-only debugging aid, not the default comparison strategy.

### 3. Unexpected hook side effects

Risk: Auto-fixing inside the hook would make the commit flow harder to reason about and could silently modify documentation during commit.

Recommended solution: Keep the Husky check validation-only. Put any repair behavior in a separate, explicitly invoked sync command or helper script such as `scripts/sync-agents-from-claude.sh`.

### 4. Formatter interaction during commit

Risk: If formatting runs before the sync check, the hook may become harder to reason about because the formatter can rewrite markdown during the same commit flow.

Recommended solution: Run the sync guard at the top of [`.husky/pre-commit`](/Users/dlo/work/dennislo.github.io/.husky/pre-commit) before `npm run format`. Preserve that ordering as part of the acceptance criteria so the equality decision always happens before any mutating quality gate.

### 5. Direct edits to the mirrored file

Risk: If contributors edit [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) directly without resyncing from [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md), they will repeatedly trip the hook until the canonical direction is well documented.

Recommended solution: Document [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) as the canonical file everywhere this workflow is described, provide the exact resync command sequence, and optionally add a helper script whose name makes the direction unambiguous.

### 6. Divergent repair instructions

Risk: If the hook error message and contributor docs recommend different repair steps, the workflow will become noisy and unreliable.

Recommended solution: Standardize one remediation path and reuse it everywhere. The hook message, docs, and any helper script should all point to the same command sequence:

```bash
cp CLAUDE.md AGENTS.md
git add CLAUDE.md AGENTS.md
```

## Recommendation

Use [CLAUDE.md](/Users/dlo/work/dennislo.github.io/CLAUDE.md) as the source of truth, reconcile [AGENTS.md](/Users/dlo/work/dennislo.github.io/AGENTS.md) to that baseline, and add a validation-only index-content guard at the top of [`.husky/pre-commit`](/Users/dlo/work/dennislo.github.io/.husky/pre-commit). Pair that with one documented sync path so contributors do not have to guess how to fix hook failures.
