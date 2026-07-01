# Plan: Replace `zh-Hant` Locale with `es-ES`

## Overview

Swap the `zh-Hant` (Traditional Chinese) locale for `es-ES` (Spanish, Spain) across the i18n system
introduced in [PR #85](https://github.com/dennislo/dennislo.github.io/pull/85). The supported-locale
set changes from:

`en-GB` (default) · `en-US` · `zh-Hans` · `zh-Hant`

to:

`en-GB` (default) · `en-US` · `zh-Hans` · `es-ES`

`es-ES` must be implemented exactly like the three surviving locales: same `LocaleMeta` shape, same
translation-dictionary key parity, same routing (`/es-ES/`), same switcher entry, same SEO/hreflang
treatment. This is a swap, not a new architecture — no changes to `src/i18n/config.ts` structure,
`LocaleContext`, routing logic, or SEO plumbing beyond substituting the locale identifier.

### Scope

| Area                                                          | Change                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `src/i18n/config.ts`                                          | `locales` tuple + `localeMeta["zh-Hant"]` → `localeMeta["es-ES"]`     |
| `src/i18n/translations/zh-Hant.ts`                            | Delete; add `src/i18n/translations/es-ES.ts` (full parity dictionary) |
| `src/i18n/dictionaries.ts`                                    | Swap `zhHant` import/export for `esES`                                |
| Every `*.test.ts(x)` referencing `zh-Hant`/`zh_TW`/`繁體中文` | Update fixtures/assertions to `es-ES`/`es_ES`/`Español (España)`      |
| `src/test-e2e/i18n-localization.spec.ts`                      | Update locale-specific assertions                                     |
| `static/llms.txt`                                             | Replace Traditional Chinese line with Spanish                         |
| `.beads/issues.jsonl` history                                 | No action — historical record, not touched                            |

### Locale identity for `es-ES`

Following the existing `LocaleMeta` pattern (`en-GB`, `en-US`, `zh-Hans`):

```ts
"es-ES": {
  label: "Español (España)",
  flag: "🇪🇸",
  htmlLang: "es-ES",
  ogLocale: "es_ES",
},
```

URL path: `/es-ES/` (mirrors `/en-US/`, `/zh-Hans/` — no alias, since only the default locale
(`en-GB`) gets the root + alias treatment).

### Translation approach

Same as the original `zh-Hant`/`zh-Hans` dictionaries: machine-translated Spanish (Spain
conventions — `vosotros`-neutral, `ordenador` over `computadora`, etc.), human-checkable, stored as
a plain typed TS dictionary. Proper nouns, brand names, and tech product names stay in English, per
the existing convention documented in the other dictionary files' header comments.

---

## Architecture

No structural changes to `src/i18n/`. This plan only touches the **locale identity and content**
layer, never the mechanism:

```
src/i18n/
  config.ts               # locales tuple + localeMeta: "zh-Hant" entry → "es-ES" entry
  dictionaries.ts          # swap import/export key
  types.ts                 # unchanged (TranslationDictionary shape is locale-agnostic)
  translations/
    en-GB.ts               # unchanged (canonical, still key-parity source of truth)
    en-US.ts                # unchanged
    zh-Hans.ts              # unchanged
    zh-Hant.ts              # DELETE
    es-ES.ts                # NEW — full parity dictionary, same keys as en-GB
    parity.test.ts          # unchanged mechanism; asserts across whatever `locales` contains
```

Downstream consumers (`Head.tsx`, `LanguageSwitcher.tsx`, `createLocalePages.ts`,
`gatsby-ssr`/`gatsby-browser`, `persistence.ts`, `schemas.ts`) all iterate over `locales` /
`localeMeta` generically — they require **no code changes**, only their existing tests that
hardcode the literal string `"zh-Hant"` need updating to `"es-ES"`.

### Files with hardcoded `zh-Hant` / `zh_TW` / `繁體中文` references (from repo scan)

- `src/i18n/config.ts` — `localeMeta` entry, `locales` tuple
- `src/i18n/config.test.ts` — locale-array assertions, `localizePath`/`stripLocale` fixtures
- `src/i18n/dictionaries.ts` — import + record entry
- `src/i18n/translations/zh-Hant.ts` — delete; replaced by `es-ES.ts`
- `src/i18n/translations/parity.test.ts` — mechanism-only, verify it still passes generically
- `src/i18n/LocaleContext.test.tsx` — fallback/locale fixtures
- `src/i18n/persistence.test.ts` — stored-locale fixtures, redirect-target fixtures
- `src/gatsby/createLocalePages.ts` / `.test.ts` — per-locale page generation fixtures
- `src/gatsby/wrapPageElement.test.tsx` — `pageContext.locale` fixture
- `src/components/LanguageSwitcher/LanguageSwitcher.test.tsx` — link-target fixtures, `localeMeta` lookups
- `src/components/Head/Head.tsx` / `Head.test.tsx` — hreflang fixture locale (uses `zh-Hans` primarily, verify no `zh-Hant`-specific assertions remain broken)
- `src/schemas.test.ts` — `inLanguage: "zh-Hant"` fixtures → `"es-ES"`
- `src/test-e2e/i18n-localization.spec.ts` — `/zh-Hant/` route assertions, `localStorage` persisted-locale test
- `static/llms.txt` — locale listing line

---

## Agent Orchestration

| Agent                        | Path                                         | Role                                                                                                                                                           |
| ---------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **test-writer**              | `.claude/agents/test-writer.md`              | Update/extend failing unit tests: swap `zh-Hant` fixtures for `es-ES` across all listed test files, add `es-ES` cases to `config.test.ts` and `parity.test.ts` |
| **senior-frontend-engineer** | `.claude/agents/senior-frontend-engineer.md` | Implement the swap: `config.ts`, `dictionaries.ts`, delete `zh-Hant.ts`, author `es-ES.ts`, update `static/llms.txt`                                           |
| **e2e-testing skill**        | `.claude/skills/e2e-testing/SKILL.md`        | Update `i18n-localization.spec.ts` locale-routing/persistence assertions for `es-ES`                                                                           |
| **code-reviewer**            | `.claude/agents/code-reviewer.md`            | Review the full diff for stray `zh-Hant` references, key-parity correctness, SEO/hreflang correctness, a11y of switcher labels                                 |
| **debugger**                 | `.claude/agents/debugger.md`                 | Only if `tsc`, `jest`, or `gatsby build` fail after the swap                                                                                                   |

### Agent Escalation Flow

```
            ┌─────────────┐
            │ test-writer │  update fixtures zh-Hant → es-ES
            │ (failing)   │  across all *.test.ts(x) + config.test.ts/parity.test.ts additions
            └──────┬──────┘
                   │ red
                   ▼
      ┌────────────────────────────┐
      │ senior-frontend-engineer   │  config.ts, dictionaries.ts, es-ES.ts,
      │ (main agent implements)    │  delete zh-Hant.ts, llms.txt
      └──────────────┬─────────────┘
                   │ green (jest + tsc)
                   ▼
      ┌────────────────────────────┐
      │  e2e-testing skill         │  update i18n-localization.spec.ts
      └──────────────┬─────────────┘
                   │ pass
                   ▼
            ┌─────────────┐    fail    ┌────────────┐
            │ code-reviewer├───────────►│  debugger  │
            │ (full diff)  │            │ isolate+fix│
            └──────┬───────┘            └─────┬──────┘
                   │ clean                    │ green
                   ▼                          │
            main agent applies fixes ◄────────┘
                   │
                   ▼
              open PR → merge
```

---

## Example Task Prompts

### test-writer

```
Task(subagent_type="test-writer", prompt="Update failing/updated Jest tests to replace the zh-Hant
locale with es-ES across: src/i18n/config.test.ts (locales array, localizePath/stripLocale fixtures),
src/i18n/dictionaries.ts consumers, src/i18n/LocaleContext.test.tsx, src/i18n/persistence.test.ts,
src/gatsby/createLocalePages.test.ts, src/gatsby/wrapPageElement.test.tsx,
src/components/LanguageSwitcher/LanguageSwitcher.test.tsx, src/schemas.test.ts. Also add a new
src/i18n/translations/es-ES parity assertion to src/i18n/translations/parity.test.ts (same key-set
as en-GB). Run jest to confirm these now fail because es-ES doesn't exist yet / zh-Hant fixtures
mismatch the new expected locale set.")
```

### senior-frontend-engineer

```
Task(subagent_type="senior-frontend-engineer", prompt="Replace the zh-Hant locale with es-ES to make
the updated tests pass. In src/i18n/config.ts: change the locales tuple entry 'zh-Hant' to 'es-ES'
and replace the localeMeta['zh-Hant'] entry with { label: 'Español (España)', flag: '🇪🇸',
htmlLang: 'es-ES', ogLocale: 'es_ES' }. Delete src/i18n/translations/zh-Hant.ts and create
src/i18n/translations/es-ES.ts as a full TranslationDictionary with the same keys as en-GB.ts,
machine-translated into Spanish (Spain conventions), keeping proper nouns/brand/tech names in
English per the existing dictionary header convention. Update src/i18n/dictionaries.ts to import
esES instead of zhHant and use the 'es-ES' key. Update static/llms.txt to replace the Traditional
Chinese line with a Spanish line. Do not change any routing, context, or SEO logic — only locale
identity and content. Run jest + tsc --noEmit until green.")
```

### e2e-testing skill

```
Invoke .claude/skills/e2e-testing/SKILL.md to update src/test-e2e/i18n-localization.spec.ts: replace
the '/zh-Hant/' route/html-lang/localStorage-persistence assertions with '/es-ES/' equivalents
(html lang 'es-ES', persisted locale 'es-ES'). Keep all other locale coverage (en-GB, en-US,
zh-Hans) unchanged. Run against a production build to confirm green.
```

### code-reviewer

```
Task(subagent_type="code-reviewer", prompt="Review the zh-Hant → es-ES locale swap PR. Focus on: no
remaining 'zh-Hant'/'zh_TW'/'繁體中文' references anywhere in src/, static/, or tests (grep to
confirm); es-ES dictionary has full key parity with en-GB (no missing/extra keys); localeMeta['es-ES']
matches the established shape/conventions of the other three locales; hreflang/sitemap/JSON-LD
inLanguage correctly emit 'es-ES' with no leftover Chinese-locale artifacts; LanguageSwitcher renders
and labels es-ES correctly with proper aria-current and keyboard access; unit + e2e coverage is
adequate for the swap.")
```

### debugger (if needed)

```
Task(subagent_type="debugger", prompt="Investigate failures: <paste exact jest/tsc/gatsby build
output>. The zh-Hant locale was just replaced with es-ES in src/i18n/config.ts, dictionaries.ts, and
a new translations/es-ES.ts file. Isolate the root cause (likely a stale reference to 'zh-Hant' or a
missing/mismatched dictionary key) and apply a minimal fix.")
```

---

## Implementation Steps (Summary)

> TDD cycle per CLAUDE.md: **(T)** test-writer updates/adds failing tests → **(I)**
> senior-frontend-engineer implements to green → **(R)** code-reviewer reviews. Mark `[x]` when the
> responsible agent completes the step.

- [ ] **0. Setup & tracking** — Create `bd` task(s) for the swap (`discovered-from` not needed, this
      is user-directed); create feature branch `feat/es-es-locale`. _(main)_
- [ ] **1. Update failing tests** _(T)_ — test-writer updates all `*.test.ts(x)` fixtures listed in
      Architecture above from `zh-Hant`/`zh_TW`/`繁體中文` to `es-ES`/`es_ES`/`Español (España)`;
      adds an `es-ES` case to `src/i18n/translations/parity.test.ts`. Confirm tests fail for the
      right reason (missing `es-ES` dictionary / stale `zh-Hant` expectations).
- [ ] **2. Implement the swap** _(I)_ — senior-frontend-engineer updates `src/i18n/config.ts`
      (`locales` tuple + `localeMeta`), deletes `src/i18n/translations/zh-Hant.ts`, authors
      `src/i18n/translations/es-ES.ts` with full en-GB key parity, updates
      `src/i18n/dictionaries.ts`, updates `static/llms.txt`. No changes to routing/context/SEO
      mechanism code.
- [ ] **3. Unit tests green** _(I)_ — `jest` passes for all updated suites; `tsc --noEmit` clean
      (dictionary type parity enforced at compile time via `TranslationDictionary`).
- [ ] **4. E2E tests** _(e2e-testing skill)_ — Update `i18n-localization.spec.ts` locale-routing,
      `<html lang>`, hreflang, and persistence assertions for `es-ES`; run against a production
      `gatsby build` to confirm green.
- [ ] **5. Grep sweep** _(I)_ — `grep -rn "zh-Hant\|zh_TW\|繁體中文"` across `src/` and `static/`
      returns no hits (excluding historical `.beads/issues.jsonl` and old plan docs under
      `claude-plans/i18n-localization/`, which are historical records and stay untouched).
- [ ] **6. Code review** _(R)_ — code-reviewer reviews the full diff per the focus areas above;
      senior-frontend-engineer/debugger applies fixes; re-review until clean.
- [ ] **7. PR & land the plane** — Commit, push, open PR to `develop` with tests + implementation
      together; run quality gates (`jest`, `tsc`, `gatsby build`); close `bd` issue(s); push.
