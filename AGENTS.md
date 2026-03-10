# Project Overview

This is a personal website/blog built with Gatsby, React, and TypeScript.

## Required Agent And Skill Usage

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

## Code Style & Standards

- Write TypeScript with strict typing
- Follow React best practices and hooks patterns
- Use functional components over class components
- Write comprehensive unit tests using Jest and React Testing Library

## Testing Guidelines

- All new components should include unit tests
- Test files should be colocated with components (e.g., `Component.test.tsx`)
- Use `@testing-library/react` for component testing
- Verify both functionality and accessibility where applicable
- Mock external dependencies appropriately
- Follow existing test patterns (see `src/components/Head/Head.test.tsx` for reference)
- Use descriptive test names with "it" blocks
- Test component rendering, behavior, and edge cases

## Development Workflow

- This is a Gatsby project - use Gatsby-specific patterns and APIs
- Run tests before committing changes
- Follow the existing project structure in `src/`
- Maintain consistency with existing code patterns

## Communication Style

- Be concise and direct
- Focus on the specific task at hand
- Provide code examples when helpful
- Explain technical decisions when they're not obvious

## Commands

```bash
npm run develop      # Start dev server at http://localhost:8000
npm run build        # Production build
npm run deploy       # Build + deploy to GitHub Pages (master branch)
npm run typecheck    # TypeScript type check (no emit)
npm run format       # Prettier format all files
npm test             # Run Jest tests
npm run testwatch    # Run Jest in watch mode
```

Run a single test file:

```bash
npx jest src/components/Article/Article.test.tsx
```

## Architecture

This is a Gatsby 5 personal website (TypeScript) deployed to GitHub Pages at https://dlo.wtf/.

**Branching:** `develop` is the working branch. `master` is production (GitHub Pages). Never commit directly to
`master` — use `npm run deploy` which builds and pushes to `master` via `gh-pages`.

**Page structure:** `src/pages/index.tsx` is the sole page. It renders `<Layout>` wrapping `<Article>`. The `Head`
component is exported from `src/components/Head/Head.tsx` and used as a named export from the page (Gatsby Head API).

**Theme system:** `ThemeContext` (`src/context/ThemeContext.tsx`) provides `theme` (`"light" | "dark"`) and
`toggleTheme` via React Context. Theme is persisted to `localStorage` and applied as `data-theme` on
`document.documentElement`. CSS variables in `src/styles/theme.css` key off `:root[data-theme="dark"]` /
`:root[data-theme="light"]`. `Layout` wraps everything in `<ThemeProvider>`.

**Styling:** Mix of styled-components (for `Layout`'s `Footer`) and plain CSS modules (component-scoped `.css` files
imported directly). Global CSS lives in `src/components/styles/` (reset, typography, links) and `src/styles/theme.css`.

**External links:** Always use `src/components/ExternalLink/ExternalLink.tsx` for external links — it sets
`rel="noopener noreferrer"` and `target="_blank"` to prevent tabnabbing.

**Testing:** Jest + React Testing Library. Tests live alongside source files (`*.test.tsx`). `jest.setup.js` imports
`@testing-library/jest-dom`. CSS modules are mapped via `identity-obj-proxy`.

**Pre-commit hook:** Runs `sh ./scripts/check-agents-claude-sync.sh` first, then `npm run format`,
`npm run typecheck`, `npm run lint`, and `npm test` via Husky.

**Mirrored agent docs:** `CLAUDE.md` is the canonical source of truth. `AGENTS.md` must stay byte-for-byte identical to
the staged `CLAUDE.md` content. If the hook reports drift, restore the canonical paths if needed, then resync with:

```bash
cp CLAUDE.md AGENTS.md
git add CLAUDE.md AGENTS.md
```

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
