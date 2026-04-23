# Project Overview

Only read [mission.md](./docs/mission.md) if you need more context on the project mission, why, audiences. Otherwise,
refer to it when relevant to the task at hand.

## Agent And Skill Usage

- Use `.claude/skills/create-plan/SKILL.md` when the user asks for a plan, implementation approach, or scoped execution
  document. Create the plan in `claude-plans/` using the local plan conventions.
- Use `.agent/skills/manual-testing/SKILL.md` for manual QA tasks: start the app, open a browser, go to
  `http://localhost:8000`, exercise the site like a real user, inspect DevTools, and capture evidence for issues.
- Use `.agent/skills/rule-of-5/SKILL.md` when the user asks for repeated review, convergence, iterative critique, or
  the "rule of 5". Apply multiple review passes and record only net-new findings each round.
- Use `.claude/agents/code-health.md` for code-health sweeps, cleanup audits, stale-pattern detection, and follow-up
  maintenance discovery. Check existing `bd` work first and file any new actionable findings in `bd`.
- Use `.claude/agents/code-reviewer.md` proactively after meaningful code or test changes, and whenever the user asks
  for a review. Focus on correctness, security, performance, readability, error handling, React best practices, and
  test adequacy.
- Use `.claude/agents/debugger.md` whenever there are errors, failing tests, broken builds, console issues, or unclear
  behavior. Add plan steps to understand the symptom first, investigate and isolate the cause second, then fix and
  verify.
- Use `.claude/agents/senior-frontend-engineer.md` for frontend implementation and bug-fix work in Gatsby, React, and
  TypeScript. Default to this agent when code needs to be written or corrected in the UI layer.
- Use `.claude/agents/test-writer.md` for unit and integration testing with Jest and React Testing Library.
- Use `.claude/skills/e2e-testing/SKILL.md` for Playwright work, including new browser tests, updating existing specs,
  debugging flaky end-to-end coverage, and validating user journeys.
- Use `.claude/skills/unit-testing/SKILL.md` when writing or updating Jest and React Testing Library coverage, to
  follow this repo's testing patterns, query priorities, mocking boundaries, and AAA structure.

## Technology Stack & Development Guidelines

Only read [technology-stack.md](./docs/technology-stack.md) if you need more context on the technology stack, code
style, testing, or development workflow. Otherwise, refer to it when relevant to the task at hand.

<!-- BEGIN BEADS INTEGRATION -->

## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other
tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Dolt-powered version control with native sync
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
bd ready --json
```

**Create new issues:**

```bash
bd create "Issue title" --description="Detailed context" -t bug|feature|task -p 0-4 --json
bd create "Issue title" --description="What this issue is about" -p 1 --deps discovered-from:bd-123 --json
```

**Claim and update:**

```bash
bd update <id> --claim --json
bd update bd-42 --priority 1 --json
```

**Complete work:**

```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task atomically**: `bd update <id> --claim`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" --description="Details about what was found" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`

### Auto-Sync

bd automatically syncs via Dolt:

- Each write auto-commits to Dolt history
- Use `bd dolt push`/`bd dolt pull` for remote sync
- No manual export/import needed!

### Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ✅ Check `bd ready` before asking "what should I work on?"
- ✅ In Codex/Codex app sandboxes, rerun `bd` commands outside the sandbox if they fail with
  `Dolt server unreachable at 127.0.0.1:13819`
- ✅ Treat `port 13819 is in use by a non-dolt process` as a likely sandbox false positive when `bd` works outside the
  sandbox
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems

### Codex Sandbox Note

`bd` talks to the local Dolt SQL server over `127.0.0.1:13819`. In Codex/Codex app sandboxed command execution,
localhost TCP access may be blocked even when the repo's Dolt server is healthy. When that happens, commands such as
`bd ready --json` can fail with:

- `failed to open database: Dolt server unreachable at 127.0.0.1:13819`
- `port 13819 is in use by a non-dolt process`

If you see that combination in Codex, do not change the beads port or switch the repo away from Dolt as a first step.
Re-run the same `bd` command with escalated permissions / outside the sandbox and continue if it succeeds there.

For more details, see README.md and docs/QUICKSTART.md.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

<!-- END BEADS INTEGRATION -->
