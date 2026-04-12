# Plan: Refresh Experience And Education Content In Config

## Objective

Replace the placeholder `experience` and `education` content in [src/config.ts](/Users/dlo/work/dennislo.github.io/src/config.ts) with real content sourced from [Dennis-Lo-Experience.md](/Users/dlo/work/dennislo.github.io/Dennis-Lo-Experience.md) and [Dennis-Lo-Education.md](/Users/dlo/work/dennislo.github.io/Dennis-Lo-Education.md).

The update should preserve the existing data shape already consumed by [Experience.tsx](/Users/dlo/work/dennislo.github.io/src/components/Experience/Experience.tsx) and [Education.tsx](/Users/dlo/work/dennislo.github.io/src/components/Education/Education.tsx).

## Current Constraints

### Config shape

The `siteConfig` entries must remain compatible with the current components:

- `experience[]`: `title`, `company`, `dateRange`, `bullets`
- `education[]`: `degree`, `school`, `dateRange`, `achievements`

### UI implications

- The Experience section renders as a vertical timeline of cards, so copying every role from the source markdown would make the homepage too long.
- The Education section renders well with one or two entries, but the current source material only clearly supports one strong academic entry.
- Bullet text should be shortened and normalized for homepage readability rather than pasted verbatim from LinkedIn-style markdown.

## Source-To-Config Mapping

### Experience source

Use [Dennis-Lo-Experience.md](/Users/dlo/work/dennislo.github.io/Dennis-Lo-Experience.md) as the source of truth for:

- role title
- company/client name
- date range
- 2 to 4 concise achievement bullets per role

### Education source

Use [Dennis-Lo-Education.md](/Users/dlo/work/dennislo.github.io/Dennis-Lo-Education.md) as the source of truth for:

- school: `UNSW`
- degree: `Bachelor of Engineering (B.Eng.), Computer Software Engineering`
- date range: `2003 - 2008`
- achievements derived from:
  - `Honours Class 1`
  - `Honours Thesis: Service Oriented Architecture for e-Business Standards`

The long descriptive paragraph about software engineering should not be copied into `achievements`; it is not structured for the current card layout.

## Recommended Content Selection

### Experience entries to include

Start with the most relevant and recent roles that best represent the current profile:

1. Crosstide / 101 Ways
2. Pret A Manger
3. NatWest Group
4. BCG Digital Ventures
5. Elsevier
6. Starcount

This gives the homepage a strong UK-focused consulting and product-engineering narrative without overloading the section with the full historical CV.

### Experience normalization rules

For each selected role:

- Keep `title` close to the source, for example `Software Engineer (Contractor)` or `Senior Software Engineer`
- Use the visible employer/client name as `company`
- Convert date ranges to simple ASCII format, for example `Nov 2021 - Present`
- Rewrite bullets into short, polished statements
- Limit each role to the highest-signal achievements, not full technology inventories

### Technology handling

Do not paste the `Technologies used:` lines into `bullets`.

If specific tools materially strengthen a role, fold them into a bullet only when they support the achievement, for example mentioning `Contentful`, `GraphQL`, or `React` where that improves clarity.

## Implementation Plan

### 1. Replace placeholder experience data

Edit [src/config.ts](/Users/dlo/work/dennislo.github.io/src/config.ts) and remove the fabricated entries:

- `Tech Company`
- `Startup Inc`
- `Digital Agency`

Replace them with curated entries derived from [Dennis-Lo-Experience.md](/Users/dlo/work/dennislo.github.io/Dennis-Lo-Experience.md).

### 2. Rewrite experience bullets for homepage use

For each selected role:

- condense long source bullets into 2 to 4 short statements
- prefer outcomes, scope, and leadership
- avoid duplication between adjacent roles
- keep wording consistent across all cards

### 3. Replace placeholder education data

Edit [src/config.ts](/Users/dlo/work/dennislo.github.io/src/config.ts) and remove the placeholder university and bootcamp entries.

Replace them with one real education entry sourced from [Dennis-Lo-Education.md](/Users/dlo/work/dennislo.github.io/Dennis-Lo-Education.md).

### 4. Keep data shape unchanged

Do not change the structure of `siteConfig`, component props, or rendering logic unless the content update reveals a hard constraint. The preferred path is a content-only change.

### 5. Run lightweight verification

After editing:

- run the relevant tests for Experience and Education rendering
- run `npm run typecheck`
- confirm the homepage still reads cleanly with the longer real content

## Suggested Acceptance Criteria

- [ ] `src/config.ts` contains real Dennis Lo experience entries instead of placeholder companies
- [ ] `src/config.ts` contains real Dennis Lo education data instead of placeholder education entries
- [ ] Experience bullets are concise and readable in the existing card UI
- [ ] Education achievements are derived from the markdown source and fit the current layout
- [ ] Existing Experience and Education tests still pass
- [ ] TypeScript typecheck passes

## Risks

- Including too many roles will make the Experience section disproportionately long.
- Copying the markdown too literally will produce bullets that are too dense for the homepage cards.
- Inconsistent date formatting between source files and config will make the timeline look messy.

## Recommendation

Implement this as a content-only refresh first. If the updated real content makes the Experience timeline feel too long, handle that in a separate design pass rather than expanding the scope of this config update.

## Implementation Steps (Summary)

- [ ] Replace the placeholder `experience` entries in [src/config.ts](/Users/dlo/work/dennislo.github.io/src/config.ts) with curated roles from [Dennis-Lo-Experience.md](/Users/dlo/work/dennislo.github.io/Dennis-Lo-Experience.md).
- [ ] Rewrite each selected experience entry into 2 to 4 concise, homepage-friendly bullets focused on impact, scope, and leadership.
- [ ] Replace the placeholder `education` entries in [src/config.ts](/Users/dlo/work/dennislo.github.io/src/config.ts) with the real UNSW degree details from [Dennis-Lo-Education.md](/Users/dlo/work/dennislo.github.io/Dennis-Lo-Education.md).
- [ ] Keep the existing `siteConfig` data shape unchanged so [Experience.tsx](/Users/dlo/work/dennislo.github.io/src/components/Experience/Experience.tsx) and [Education.tsx](/Users/dlo/work/dennislo.github.io/src/components/Education/Education.tsx) continue to render without component changes.
- [ ] Run the Experience and Education tests and `npm run typecheck` to verify the content refresh did not break rendering or typing.
