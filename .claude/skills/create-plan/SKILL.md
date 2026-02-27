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

## Purpose

Generate a detailed implementation plan `.md` file inside `claude-plans/<feature-name>/` that follows
the conventions established in the existing plans. Plans act as orchestration documents — the main
agent writes code itself, then delegates review, testing, and debugging to subagents.

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
|-------------------|-----------------------------------|-------------------------------------------------------------------|-------------------------------------|
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

---

## Key Rules for Plans

1. **Agent Orchestration** — always include the table of available agents and a step-by-step breakdown of who does what,
   with concrete `Task(...)` prompts.
2. **Agent Escalation Flow** — always include the ASCII tree diagram showing the orchestration hierarchy from main agent
   down through subagents.
3. **Implementation Steps (Summary)** — always include the numbered summary list at the end with agent labels and
   parallelization notes.
4. **Main agent writes code** — the main agent handles implementation directly; subagents handle review, testing, and
   debugging only.
5. **Parallel execution** — code review and test writing run in parallel whenever possible (code-reviewer is read-only;
   test-writer writes to separate test files).
6. **Debugger is conditional** — only invoke the debugger if typecheck or tests fail; mark it _(Only if needed.)_ in the
   summary.
7. **Self-contained Task prompts** — every agent delegation must include a detailed, self-contained prompt so the
   subagent has full context without needing to read the plan file.

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
