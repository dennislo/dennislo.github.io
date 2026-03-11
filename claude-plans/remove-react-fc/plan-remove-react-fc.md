# Plan: Remove React.FC from All Components

## Overview

Remove all usage of `React.FC` (and `React.FunctionComponent`) from the codebase and replace
with explicit prop type annotations and inferred return types. This is a widely recommended
TypeScript/React best practice because `React.FC`:

- Implicitly includes `children` in the props type (pre-React 18), masking missing prop definitions
- Prevents generic component typing
- Adds noise without adding safety

The codebase has **21 occurrences** across 4 categories of components that need different
refactoring patterns.

---

## Affected Files (21 occurrences)

### Category A — No props (9 files)

Components typed as `React.FC` with no generic parameter. Replace with a plain arrow function
and let TypeScript infer the return type.

| File                                         | Current signature                           |
| -------------------------------------------- | ------------------------------------------- |
| `src/components/Hero/Hero.tsx`               | `const Hero: React.FC = () => {`            |
| `src/components/SiteFooter/SiteFooter.tsx`   | `const SiteFooter: React.FC = () => {`      |
| `src/components/ContactForm/ContactForm.tsx` | `const ContactForm: React.FC = () => {`     |
| `src/components/Education/Education.tsx`     | `const Education: React.FC = () => {`       |
| `src/components/Projects/Projects.tsx`       | `const Projects: React.FC = () => {`        |
| `src/components/About/About.tsx`             | `const About: React.FC = () => {`           |
| `src/components/Experience/Experience.tsx`   | `const Experience: React.FC = () => {`      |
| `src/components/SiteHeader/SiteHeader.tsx`   | `const SiteHeader: React.FC = () => {`      |
| `src/pages/contact-form.tsx`                 | `const ContactFormPage: React.FC = () => (` |

**Pattern — Before:**

```tsx
const Hero: React.FC = () => {
  return <div>...</div>;
};
```

**Pattern — After:**

```tsx
const Hero = () => {
  return <div>...</div>;
};
```

### Category A2 — Page components with unused `PageProps` generic (2 files)

These use `React.FC<PageProps>` but never destructure the props. Remove the `React.FC` type
annotation and the now-unused `PageProps` import.

| File                  | Current signature                                   |
| --------------------- | --------------------------------------------------- |
| `src/pages/404.tsx`   | `const NotFoundPage: React.FC<PageProps> = () => {` |
| `src/pages/index.tsx` | `const IndexPage: React.FC<PageProps> = () => {`    |

**Pattern — Before:**

```tsx
import { PageProps } from "gatsby";
const IndexPage: React.FC<PageProps> = () => { ... };
```

**Pattern — After:**

```tsx
// PageProps import removed (unused)
const IndexPage = () => { ... };
```

> **Note on `HeadFC`:** `src/pages/404.tsx` also exports `const Head: HeadFC = () => ...`.
> `HeadFC` is a Gatsby-specific type for the Head API, not `React.FC`. It is **out of scope**
> for this refactor and should be left as-is.

### Category B — With props interface (2 files)

Components typed as `React.FC<Props>`. Move the props type to the function parameter.

| File                                           | Current signature                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/components/ExternalLink/ExternalLink.tsx` | `const ExternalLink: React.FC<ExternalLinkProps> = ({...}) => (`                     |
| `src/context/ThemeContext.tsx`                 | `export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({...}) => {` |

**Pattern — Before:**

```tsx
const ExternalLink: React.FC<ExternalLinkProps> = ({ href, title, children, className }) => (
```

**Pattern — After:**

```tsx
const ExternalLink = ({ href, title, children, className }: ExternalLinkProps) => (
```

For `ThemeProvider`, inline the children prop type in the parameter (note `ReactNode` named import):

```tsx
// Before
import React, { createContext, useContext, useEffect, useState } from "react";
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// After
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
```

### Category C — Icon components with props (8 files)

All follow the same `React.FC<TablerIconProps>` pattern with a default className value.

| File                                          | Current signature                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/components/icons/TablerEmail.tsx`        | `const TablerEmail: React.FC<TablerIconProps> = ({ className = "h-6 w-6" }) => (`  |
| `src/components/icons/TablerInstagram.tsx`    | `const TablerInstagram: React.FC<TablerIconProps> = ({...}) => (`                  |
| `src/components/icons/TablerLinkedin.tsx`     | `const TablerLinkedin: React.FC<TablerIconProps> = ({...}) => (`                   |
| `src/components/icons/TablerGithub.tsx`       | `const TablerGithub: React.FC<TablerIconProps> = ({ className = "h-6 w-6" }) => (` |
| `src/components/icons/TablerTwitter.tsx`      | `const TablerTwitter: React.FC<TablerIconProps> = ({...}) => (`                    |
| `src/components/icons/TablerMoon.tsx`         | `const TablerMoon: React.FC<TablerIconProps> = ({ className = "h-6 w-6" }) => (`   |
| `src/components/icons/TablerArrowUpRight.tsx` | `const TablerArrowUpRight: React.FC<TablerIconProps> = ({...}) => (`               |
| `src/components/icons/TablerSun.tsx`          | `const TablerSun: React.FC<TablerIconProps> = ({ className = "h-6 w-6" }) => (`    |

**Pattern — Before:**

```tsx
const TablerGithub: React.FC<TablerIconProps> = ({ className = "h-6 w-6" }) => (
```

**Pattern — After:**

```tsx
const TablerGithub = ({ className = "h-6 w-6" }: TablerIconProps) => (
```

---

## Import Cleanup

After removing `React.FC`, check whether the `React` default import is still needed in each file.
Gatsby 5 uses the automatic JSX transform, so `import React from "react"` is not needed for JSX alone.

**Files where `React` import can be removed entirely** (only used for `React.FC` + JSX):

- All Category A files (9 components) — check each; most only import React for `React.FC`
- All Category C icon files (8 icons) — only import React for `React.FC`

**Files where `React` import must be converted to named imports** (uses React APIs):

- `src/context/ThemeContext.tsx` — uses `createContext`, `useContext`, `useEffect`, `useState`,
  and `React.ReactNode`. Convert `import React, { createContext, ... }` to named imports only;
  keep `type ReactNode` import for the `children` prop type.
- `src/components/ExternalLink/ExternalLink.tsx` — uses `React.ReactNode` in the props interface.
  Convert to `import type { ReactNode } from "react"` and update the type reference.

**Files where `import * as React` becomes unused:**

- `src/pages/index.tsx` — uses `import * as React from "react"` solely for `React.FC`; remove it
- `src/pages/404.tsx` — uses `import * as React from "react"` solely for `React.FC`; remove it

---

## Architecture Notes

- This is a **mechanical refactor** — no runtime behavior changes
- All existing tests should continue to pass unchanged since the component APIs are identical
- TypeScript will catch any regressions at compile time via `npm run typecheck`
- No CSS, styling, or DOM output changes

---

## Agent Orchestration

| Step | Agent                        | Action                                                                                                                                                   |
| ---- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **senior-frontend-engineer** | Refactor all 21 files: remove `React.FC`, add explicit prop annotations, let TS infer return types, clean up unused `React` imports                      |
| 2a   | **test-writer**              | Review all colocated test files to ensure they still pass with the refactored signatures; no existing tests reference `React.FC` so changes are unlikely |
| 2b   | **code-reviewer**            | Review all 21 changed files for correctness, consistent patterns, no regressions, proper typing, and React best practices                                |
| 3    | **Main agent**               | Run `npm run typecheck`, `npm run lint`, and `npm test`                                                                                                  |
| 3b   | **debugger** _(if needed)_   | Investigate and fix any test failures or type errors                                                                                                     |

> Steps 2a and 2b run **in parallel** since they are independent read-only operations on the
> changed files.

---

## Agent Escalation Flow

```
Main Agent (orchestrates)
├── senior-frontend-engineer (refactors all 21 files)
├─┬ [parallel]
│ ├── test-writer (reviews/updates test files)
│ └── code-reviewer (reviews all changes)
├── Main agent (runs typecheck + lint + tests)
│   └── debugger (only if typecheck or tests fail)
└── Done
```

---

## Implementation Steps (Summary)

1. [ ] **[senior-frontend-engineer]** Refactor Category A files (9 no-props components): remove `React.FC`, let TS infer return type, clean up imports
2. [ ] **[senior-frontend-engineer]** Refactor Category A2 files (2 page components): remove `React.FC<PageProps>`, remove unused `PageProps` import, leave `HeadFC` as-is
3. [ ] **[senior-frontend-engineer]** Refactor Category B files (2 components with props interfaces): move props to function params, let TS infer return type
4. [ ] **[senior-frontend-engineer]** Refactor Category C files (8 icon components): move `TablerIconProps` to function params, let TS infer return type
5. [ ] **[test-writer]** Review all colocated test files; verify tests still pass (no existing tests reference `React.FC`)
6. [ ] **[code-reviewer]** Review all 21 changed files for correctness, consistency, typing, and React best practices
7. [ ] **[Main]** Run `npm run typecheck`, `npm run lint`, and `npm test` — all must pass
8. [ ] **[debugger]** _(If needed)_ Fix any test failures or type errors
