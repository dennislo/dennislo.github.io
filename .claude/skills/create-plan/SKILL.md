---
name: create-plan
description:
  Creates a structured implementation plan document in the claude-plans/ directory. Plans include an
  overview, architecture notes, agent orchestration table, agent escalation flow diagram, and an
  implementation steps summary. Use this skill when the user asks to plan a feature, create a plan,
  write a plan, or document an implementation approach. Trigger words are "create plan, write plan,
  make a plan, plan this feature, plan the implementation, document the approach".
---

# Create Plan Skill

## Table of Contents

- [Overview](#overview)
- [Workflow](#workflow)
- [How to Use This Skill](#how-to-use-this-skill)
- [Plan File Location](#plan-file-location)
- [Available Subagents](#available-subagents)
- [Example Task Prompts](#example-task-prompts)

## Overview

Generate a detailed implementation plan `.md` file inside `claude-plans/<feature-name>/` (if using Claude) and
`codex-plans/<feature-name>/` (if using Codex) that follows the conventions established in the existing plans. Plans act
as orchestration documents — the main
agent writes code itself, then delegates review, testing, and debugging to subagents.

---

## Workflow

1. **Define scope and deliverable.** Confirm the feature goal, constraints, and expected plan outcome.
2. **Inspect relevant context.** Read only the files and docs needed to understand architecture and touchpoints.
3. **Set naming and path.** Use kebab-case `<feature-name>` and target
   `claude-plans/<feature-name>/plan-<feature-name>.md`.
4. **Draft core sections.** Write feature-specific overview, architecture notes, and implementation approach.
5. **Plan agent orchestration.** Include the available-agent table and concrete, self-contained `Task(...)` prompts.
6. **Assign ownership boundaries.** Keep implementation with the main agent; use subagents for review, testing, and
   debugging.
7. **Set execution order.** Run `code-reviewer` and `test-writer` in parallel when possible; call `debugger` only if
   typecheck or tests fail.
8. **Add required output sections.** Include the ASCII agent escalation flow and `## Implementation Steps (Summary)`
   checklist [ ] at
   the end of the plan,
   with agent labels and parallelization notes. Ensure each step is clear and actionable. Each step should be marked as
   complete with [x] once done by the responsible agent. See `codex-plans/burger-menu/plan-burger-menu.md` for an
   example.
9. **Validate and finalize.** Ensure the plan is clear, actionable, and complete, then save it at the required path.

---

## How to Use This Skill

When invoked, do the following:

1. **Clarify the feature** with the user if the request is vague (one question max).
2. **Explore the codebase** to understand the relevant files and architecture before writing the plan.
3. **Create the plan file** at `claude-plans/<feature-name>/plan-<feature-name>.md`.
4. **Follow the plan template** below exactly, populating each section with feature-specific content.

---

## Plan File Location

```
claude-plans/
└── <feature-name>/
    └── plan-<feature-name>.md
```

Use kebab-case for both the directory and filename. Examples:

- `claude-plans/contact-form/plan-contact-form.md`
- `claude-plans/time-based-theme/plan-time-based-theme.md`
- `claude-plans/dark-mode-toggle/plan-dark-mode-toggle.md`

---

## Available Subagents

These agents are defined in `.claude/agents/` and must be invoked via the `Task` tool during
implementation (not during planning). Reference them in the plan's Agent Orchestration section.

| Agent             | Path                              | Role                                                              | Tools                               |
| ----------------- | --------------------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

---

## Example Task Prompts

### code-reviewer

```
Task(subagent_type="code-reviewer", prompt="Review the changes to <files> for the <feature name> feature. Focus on: <specific concerns such as security, logic correctness, accessibility, React best practices, TypeScript typing, CSS theming>.")
```

### test-writer

```
Task(subagent_type="test-writer", prompt="Write tests for <ComponentName> at <src/path/Component.tsx>. Create <src/path/Component.test.tsx>. Cover: <list of specific test cases>. Use userEvent for interactions. Mock <external modules> as needed.")
```

### debugger

```
Task(subagent_type="debugger", prompt="Investigate and fix the following failures: <paste exact error output>. The <feature> was added to <file path>. The test file is <path>.")
```
