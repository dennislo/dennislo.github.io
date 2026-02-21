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
| ----------------- | --------------------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

---

## Plan Template

Use this template, filling in the `<PLACEHOLDER>` sections with feature-specific content.

````markdown
# Plan: <Feature Title>

## Overview

<1–3 sentence description of the feature: what it does, why it's needed, and any key constraints.>

---

## Architecture

<Describe the technical approach. Include:
- Which existing files are affected and why
- New files that will be created
- Any new dependencies
- Key design decisions (e.g. why a particular library or pattern was chosen)
- Data flow or state management approach if relevant>

### Files to Create / Modify

#### New files:

1. **`<path>`** — <what it does>

#### Modified files:

2. **`<path>`** — <what changes and why>

---

## Component / Module Structure

```
<ASCII tree or pseudocode showing the structure of new/modified components>
```

<Optionally include representative code snippets for key interfaces, types, or component signatures.>

---

## Testing Plan

<List the test cases that should be covered. Group by file if multiple test files are involved.>

### `<TestFile>.test.tsx`

1. <Test case description>
2. <Test case description>

---

## Agent Orchestration

Use the custom Claude agents defined in `.claude/agents/` as subagents during implementation. This
keeps the main context focused on orchestration while delegating specialized work.

### Available Agents

| Agent             | Path                              | Role                                                              | Tools                               |
| ----------------- | --------------------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| **test-writer**   | `.claude/agents/test-writer.md`   | Writes unit/integration tests using Jest + React Testing Library  | Read, Glob, Grep, Bash, Edit, Write |
| **code-reviewer** | `.claude/agents/code-reviewer.md` | Reviews code for quality, security, best practices, test coverage | Read, Glob, Grep, Bash              |
| **debugger**      | `.claude/agents/debugger.md`      | Investigates and fixes test failures, TypeScript errors, bugs     | Read, Glob, Grep, Bash, Edit        |

### Agent Usage Per Implementation Step

#### Step 1 — <Step name> (main agent)

- **Do it yourself** (main agent). <What the main agent implements.>

#### Step 2 — Code Review

- **Delegate to `code-reviewer`** via the Task tool:
  ```
  Task(subagent_type="code-reviewer", prompt="Review <files> for the <feature> feature. Focus on: <specific concerns>.")
  ```
- Address any Critical or Warning findings before proceeding.

#### Step 3 — Write Tests

- **Delegate to `test-writer`** via the Task tool:
  ```
  Task(subagent_type="test-writer", prompt="Write tests for <ComponentName> at <src/path/Component.tsx>. Create <src/path/Component.test.tsx>. Cover: <list of test cases>. Mock: <external modules>.")
  ```

#### Step 4 — Run Typecheck + Tests

- Run `npm run typecheck` and `npm test` from the main agent.

#### Step 5 — Debug Failures (if any)

- **Delegate to `debugger`** via the Task tool (only if step 4 fails):
  ```
  Task(subagent_type="debugger", prompt="Investigate and fix the following failures: <paste error output>. <Context about what changed and where.>")
  ```
- Re-run typecheck + tests after fixes.

#### Step 6 — Final Code Review

- **Delegate to `code-reviewer`** for a final pass after all fixes:
  ```
  Task(subagent_type="code-reviewer", prompt="Final review of the complete <feature name> feature. Check all new/modified files: <list files>. Verify test coverage is adequate, no security issues remain, and the implementation matches the plan.")
  ```

### Parallelization Opportunities

- Steps 2 (code review) and 3 (test writing) can be launched **in parallel** since the
  code-reviewer is read-only and the test-writer writes to a separate file.
- If the debugger fixes code in step 5, re-run both code-reviewer and the test suite afterward.

### Agent Escalation Flow

```
Main Agent (orchestrator)
│
├─ Writes code (Step 1)
│   ├─ <file or change 1>
│   └─ <file or change 2>
│
├─ Delegates in parallel:
│   ├─ code-reviewer → <what it reviews> (Step 2)
│   └─ test-writer → <what it writes> (Step 3)
│
├─ Runs typecheck + tests (Step 4)
│
├─ If failures → debugger (Step 5) → re-run Step 4
│
└─ Final code-reviewer pass (Step 6)
```

---

## Implementation Steps (Summary)

0. <Optional: install dependencies, e.g. `npm install <package>`>
1. <Main agent: implement X — one sentence describing what is written.>
2. **Agent: code-reviewer** — <what it reviews>. _(Run in parallel with step 3.)_
3. **Agent: test-writer** — <what it writes>. _(Run in parallel with step 2.)_
4. Run `npm run typecheck` and `npm test`.
5. **Agent: debugger** — Fix any failures from step 4. _(Only if needed.)_
6. **Agent: code-reviewer** — Final review pass.
````

---

## Key Rules for Plans

1. **Agent Orchestration** — always include the table of available agents and a step-by-step breakdown of who does what, with concrete `Task(...)` prompts.
2. **Agent Escalation Flow** — always include the ASCII tree diagram showing the orchestration hierarchy from main agent down through subagents.
3. **Implementation Steps (Summary)** — always include the numbered summary list at the end with agent labels and parallelization notes.
4. **Main agent writes code** — the main agent handles implementation directly; subagents handle review, testing, and debugging only.
5. **Parallel execution** — code review and test writing run in parallel whenever possible (code-reviewer is read-only; test-writer writes to separate test files).
6. **Debugger is conditional** — only invoke the debugger if typecheck or tests fail; mark it _(Only if needed.)_ in the summary.
7. **Self-contained Task prompts** — every agent delegation must include a detailed, self-contained prompt so the subagent has full context without needing to read the plan file.

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
