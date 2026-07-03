# Cal.eu Meet Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Cal.eu "Meet" link to the homepage social icons, top navigation, and footer navigation, with the external URL opening in a new browser tab.

**Architecture:** Store the Cal.eu URL once in `siteConfig.social.meet`, render it through the existing `ExternalLink` component, and add localized "Meet" labels/aria labels through the i18n dictionaries. Tighten desktop nav and language-switcher spacing with small Tailwind class changes in the existing components.

**Tech Stack:** Gatsby, React, TypeScript, Tailwind utility classes, Jest, React Testing Library, Playwright.

---

## Scope

Implement these user-visible changes:

- Add a "Meet" social icon immediately to the right of the existing contact-form social icon in `Hero`.
- Add the same "Meet" social icon immediately to the right of the existing contact-form social icon in `SiteFooter`.
- Add a "Meet" menu item immediately to the right of "Contact" in the desktop and mobile header nav.
- Add a "Meet" menu item immediately to the right of "Contact" in the footer nav.
- Make every "Meet" link point to `https://www.cal.eu/dennis-lo/online-meeting`.
- Make every "Meet" link open a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- Reduce spacing between desktop top-nav menu items.
- Reduce spacing between language locale links in the desktop top nav.

## Current Touchpoints

- `src/config.ts` owns route and social URL constants.
- `src/components/ExternalLink/ExternalLink.tsx` already sets `target="_blank"` and `rel="noopener noreferrer"`.
- `src/components/Hero/Hero.tsx` renders the homepage social icon row.
- `src/components/SiteHeader/SiteHeader.tsx` renders desktop and mobile nav links from `staticNavLinks`.
- `src/components/SiteFooter/SiteFooter.tsx` renders footer nav links and footer social icons.
- `src/components/LanguageSwitcher/LanguageSwitcher.tsx` renders locale links with per-link `px-2`.
- `src/i18n/translations/*.ts` own localized labels and aria labels.
- Unit coverage already exists beside `Hero`, `SiteHeader`, `SiteFooter`, and `LanguageSwitcher`.
- E2E coverage already exists in `src/test-e2e/header-navigation.spec.ts` and `src/test-e2e/contact-icons.spec.ts`.

## Files

- Modify: `src/config.ts`
- Create: `src/components/icons/TablerCalendarEvent.tsx`
- Modify: `src/components/Hero/Hero.tsx`
- Modify: `src/components/SiteHeader/SiteHeader.tsx`
- Modify: `src/components/SiteFooter/SiteFooter.tsx`
- Modify: `src/components/LanguageSwitcher/LanguageSwitcher.tsx`
- Modify: `src/i18n/translations/en-GB.ts`
- Modify: `src/i18n/translations/en-US.ts`
- Modify: `src/i18n/translations/es-ES.ts`
- Modify: `src/i18n/translations/zh-Hans.ts`
- Modify: `src/components/Hero/Hero.test.tsx`
- Modify: `src/components/SiteHeader/SiteHeader.test.tsx`
- Modify: `src/components/SiteFooter/SiteFooter.test.tsx`
- Modify: `src/components/LanguageSwitcher/LanguageSwitcher.test.tsx`
- Modify: `src/test-e2e/header-navigation.spec.ts`
- Modify: `src/test-e2e/contact-icons.spec.ts`

## Agent Orchestration

| Agent or Skill             | Path                                         | Use                                                                                              |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `test-writer`              | `.claude/agents/test-writer.md`              | Write failing Jest and React Testing Library tests before implementation.                        |
| `unit-testing`             | `.claude/skills/unit-testing/SKILL.md`       | Apply repo-specific Jest and Testing Library patterns while adding unit tests.                   |
| `e2e-testing`              | `.claude/skills/e2e-testing/SKILL.md`        | Add failing Playwright coverage for new-tab external links and nav visibility.                   |
| `senior-frontend-engineer` | `.claude/agents/senior-frontend-engineer.md` | Implement the minimal Gatsby/React/TypeScript changes after tests fail.                          |
| `debugger`                 | `.claude/agents/debugger.md`                 | Investigate failing tests, broken builds, console issues, or unclear behavior.                   |
| `code-reviewer`            | `.claude/agents/code-reviewer.md`            | Review the complete code/test diff before PR merge; Critical and Warning findings must be fixed. |
| `manual-testing`           | `.agent/skills/manual-testing/SKILL.md`      | Start the app and verify the visual nav/icon behavior in a browser after automated checks.       |

## Agent Escalation Flow

```text
Main orchestrator
|
+-- test-writer + unit-testing
|   +-- writes failing Jest/RTL tests
|
+-- e2e-testing
|   +-- writes failing Playwright tests
|
+-- senior-frontend-engineer
|   +-- implements config, labels, icon, links, spacing
|
+-- quality gates
|   +-- typecheck, lint, unit tests, focused e2e, build
|
+-- debugger
|   +-- only if a gate fails or behavior is unclear
|
+-- manual-testing
|   +-- browser smoke test at http://localhost:8000
|
+-- code-reviewer
    +-- final correctness/security/accessibility/test review
```

## Task 1: Write Failing Unit Tests

**Files:**

- Modify: `src/components/Hero/Hero.test.tsx`
- Modify: `src/components/SiteHeader/SiteHeader.test.tsx`
- Modify: `src/components/SiteFooter/SiteFooter.test.tsx`
- Modify: `src/components/LanguageSwitcher/LanguageSwitcher.test.tsx`

- [ ] **Step 1: Delegate Jest/RTL tests to `test-writer` using the `unit-testing` skill**

Use this prompt:

```text
Write failing Jest and React Testing Library tests for the Cal.eu Meet link feature.

Context:
- Cal.eu URL must be https://www.cal.eu/dennis-lo/online-meeting.
- Existing components use renderWithLocale.
- Existing external links use ExternalLink and should expose target="_blank" and rel="noopener noreferrer".
- Tests must be written before implementation and should fail because no Meet link/config/labels exist yet.

Update:
1. src/components/Hero/Hero.test.tsx
   - Add an en-GB test that finds a link named enGB.hero.meetAriaLabel.
   - Assert href is siteConfig.social.meet.
   - Assert target is "_blank" and rel is "noopener noreferrer".
   - Assert it appears immediately after the contact link in the social icon container by checking the contact link's nextElementSibling.

2. src/components/SiteHeader/SiteHeader.test.tsx
   - Add an en-GB desktop test that finds the Meet nav link named enGB.nav.meet.
   - Assert href is siteConfig.social.meet, target "_blank", rel "noopener noreferrer".
   - Assert Meet appears immediately after Contact in the desktop nav list.
   - Add a mobile-menu test that opens the menu, finds Meet, asserts href/target/rel, clicks it, and verifies the mobile menu closes.

3. src/components/SiteFooter/SiteFooter.test.tsx
   - Add a footer nav test that Contact is immediately followed by Meet.
   - Assert the footer nav Meet link name uses enGB.nav.meet and opens siteConfig.social.meet in a new tab.
   - Add a footer social icon test that finds enGB.footer.meetAria and asserts href/target/rel.
   - Assert the footer social Meet icon appears immediately after the contact icon.

4. src/components/LanguageSwitcher/LanguageSwitcher.test.tsx
   - Add a test asserting each locale link has "px-1.5" and does not have "px-2".

Keep existing mocks and query style. Use getByRole/within. Do not add implementation code.
```

- [ ] **Step 2: Run the targeted failing unit tests**

Run:

```bash
npm test -- src/components/Hero/Hero.test.tsx src/components/SiteHeader/SiteHeader.test.tsx src/components/SiteFooter/SiteFooter.test.tsx src/components/LanguageSwitcher/LanguageSwitcher.test.tsx
```

Expected: FAIL because `siteConfig.social.meet`, `nav.meet`, `hero.meetAriaLabel`, and `footer.meetAria` do not exist yet, and `LanguageSwitcher` still uses `px-2`.

## Task 2: Write Failing E2E Tests

**Files:**

- Modify: `src/test-e2e/header-navigation.spec.ts`
- Modify: `src/test-e2e/contact-icons.spec.ts`

- [ ] **Step 1: Use the `e2e-testing` skill to add Playwright coverage**

Add this helper constant to each touched spec where needed:

```typescript
const meetUrl = "https://www.cal.eu/dennis-lo/online-meeting";
```

In `src/test-e2e/header-navigation.spec.ts`, add:

```typescript
test("desktop and mobile nav expose the Meet link as a new-tab Cal.eu link after Contact", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const primaryNav = page.getByRole("navigation", { name: "Primary" });
  const desktopContact = primaryNav.getByRole("link", { name: "Contact" });
  const desktopMeet = primaryNav.getByRole("link", { name: "Meet" });

  await expect(desktopMeet).toBeVisible();
  await expect(desktopMeet).toHaveAttribute("href", meetUrl);
  await expect(desktopMeet).toHaveAttribute("target", "_blank");
  await expect(desktopMeet).toHaveAttribute("rel", "noopener noreferrer");
  const nextDesktopItemText = await desktopContact.evaluate((node) =>
    node.parentElement?.nextElementSibling?.textContent?.trim(),
  );
  expect(nextDesktopItemText).toBe("Meet");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole("button", { name: /navigation menu/i }).click();

  const mobileMenu = page.getByRole("region", {
    name: "Mobile primary menu",
  });
  const mobileMeet = mobileMenu.getByRole("link", { name: "Meet" });

  await expect(mobileMeet).toBeVisible();
  await expect(mobileMeet).toHaveAttribute("href", meetUrl);
  await expect(mobileMeet).toHaveAttribute("target", "_blank");
  await expect(mobileMeet).toHaveAttribute("rel", "noopener noreferrer");
});
```

In `src/test-e2e/contact-icons.spec.ts`, add:

```typescript
test("Meet social icons open Cal.eu in a new tab from the homepage and footer", async ({
  page,
}) => {
  await page.goto("/");

  const meetLinks = page.getByRole("link", { name: "Meet with Dennis Lo" });
  const links = await meetLinks.all();
  expect(links.length).toBeGreaterThanOrEqual(2);

  for (const link of links) {
    await expect(link).toHaveAttribute("href", meetUrl);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }

  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Meet with Dennis Lo" }),
  ).toBeVisible();
});
```

- [ ] **Step 2: Run the targeted failing E2E tests**

Run:

```bash
npm run test:e2e -- src/test-e2e/header-navigation.spec.ts src/test-e2e/contact-icons.spec.ts
```

Expected: FAIL because no visible "Meet" link or "Meet with Dennis Lo" social icon exists yet.

## Task 3: Implement Shared URL and Translations

**Files:**

- Modify: `src/config.ts`
- Modify: `src/i18n/translations/en-GB.ts`
- Modify: `src/i18n/translations/en-US.ts`
- Modify: `src/i18n/translations/es-ES.ts`
- Modify: `src/i18n/translations/zh-Hans.ts`

- [ ] **Step 1: Add the Cal.eu URL to `siteConfig.social`**

In `src/config.ts`, extend `siteConfig.social`:

```typescript
  social: {
    email: "lo.dennis@gmail.com",
    meet: "https://www.cal.eu/dennis-lo/online-meeting",
    github: "https://github.com/dennislo",
    linkedin: "https://www.linkedin.com/in/dennis-lo-profile",
    instagram: "https://www.instagram.com/dlo",
  },
```

- [ ] **Step 2: Add en-GB labels**

In `src/i18n/translations/en-GB.ts`, add:

```typescript
    meet: "Meet",
```

inside `nav`, add:

```typescript
    meetAriaLabel: "Meet with Dennis Lo",
```

inside `hero`, and add:

```typescript
    meetAria: "Meet with Dennis Lo",
```

inside `footer`.

- [ ] **Step 3: Add en-US labels**

Use the same text as en-GB in `src/i18n/translations/en-US.ts`:

```typescript
    meet: "Meet",
    meetAriaLabel: "Meet with Dennis Lo",
    meetAria: "Meet with Dennis Lo",
```

- [ ] **Step 4: Add es-ES labels**

In `src/i18n/translations/es-ES.ts`, use:

```typescript
    meet: "Reunión",
    meetAriaLabel: "Reunirse con Dennis Lo",
    meetAria: "Reunirse con Dennis Lo",
```

- [ ] **Step 5: Add zh-Hans labels**

In `src/i18n/translations/zh-Hans.ts`, use:

```typescript
    meet: "预约会议",
    meetAriaLabel: "与 Dennis Lo 预约会议",
    meetAria: "与 Dennis Lo 预约会议",
```

- [ ] **Step 6: Run translation/type checks**

Run:

```bash
npm test -- src/i18n/translations/parity.test.ts
npm run typecheck
```

Expected: PASS after all dictionaries have matching keys.

## Task 4: Add the Meet Icon Component

**Files:**

- Create: `src/components/icons/TablerCalendarEvent.tsx`

- [ ] **Step 1: Create the icon using the existing local Tabler component pattern**

Create `src/components/icons/TablerCalendarEvent.tsx`:

```tsx
import React from "react";

interface TablerIconProps {
  className?: string;
}

const TablerCalendarEvent = ({ className = "h-6 w-6" }: TablerIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
    <path d="M16 3l0 4" />
    <path d="M8 3l0 4" />
    <path d="M4 11l16 0" />
    <path d="M8 15h2v2h-2z" />
  </svg>
);

export default TablerCalendarEvent;
```

## Task 5: Implement Header Nav and Spacing

**Files:**

- Modify: `src/components/SiteHeader/SiteHeader.tsx`
- Modify: `src/components/LanguageSwitcher/LanguageSwitcher.tsx`

- [ ] **Step 1: Add Meet to the shared header nav list after Contact**

In `src/components/SiteHeader/SiteHeader.tsx`, add this item immediately after the contact route item in `staticNavLinks`:

```typescript
  {
    type: "external" as const,
    label: "meet",
    href: siteConfig.social.meet,
  },
```

Update the comment above the external-label handling to:

```typescript
// External labels are stored in link.label.
```

- [ ] **Step 2: Tighten desktop nav item gaps**

Change the desktop nav list classes from:

```tsx
<ul className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
```

to:

```tsx
<ul className="hidden md:flex md:items-center md:gap-4 lg:gap-5">
```

- [ ] **Step 3: Tighten locale link gaps**

In `src/components/LanguageSwitcher/LanguageSwitcher.tsx`, change locale link padding from:

```tsx
className =
  "inline-flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100";
```

to:

```tsx
className =
  "inline-flex items-center gap-1 px-1.5 py-1 text-sm rounded transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100";
```

## Task 6: Implement Hero and Footer Meet Links

**Files:**

- Modify: `src/components/Hero/Hero.tsx`
- Modify: `src/components/SiteFooter/SiteFooter.tsx`

- [ ] **Step 1: Add the Meet social icon to `Hero` immediately after contact**

Import the icon:

```typescript
import TablerCalendarEvent from "../icons/TablerCalendarEvent";
```

Add this `ExternalLink` immediately after the existing contact-form `<Link>`:

```tsx
<ExternalLink
  href={siteConfig.social.meet}
  aria-label={t("hero.meetAriaLabel")}
  className="transition-colors duration-300 hover:text-[--accent]"
  style={{ ["--accent" as string]: accent }}
>
  <TablerCalendarEvent className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
</ExternalLink>
```

- [ ] **Step 2: Add the Meet nav item to `SiteFooter` immediately after Contact**

Inside the footer nav `<ul>`, add this `<li>` immediately after the existing Contact `<li>`:

```tsx
<li>
  <ExternalLink
    href={siteConfig.social.meet}
    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
  >
    {t("nav.meet")}
  </ExternalLink>
</li>
```

- [ ] **Step 3: Add the Meet social icon to `SiteFooter` immediately after contact**

Import the icon:

```typescript
import TablerCalendarEvent from "../icons/TablerCalendarEvent";
```

Add this `ExternalLink` immediately after the existing contact-form `<Link>` in the social icon row:

```tsx
<ExternalLink
  href={siteConfig.social.meet}
  aria-label={t("footer.meetAria")}
  className="transition-colors duration-300 hover:text-[--accent]"
>
  <TablerCalendarEvent className="h-5 w-5" />
</ExternalLink>
```

## Task 7: Verify Tests Now Pass

**Files:**

- All changed implementation and test files.

- [ ] **Step 1: Run focused unit tests**

Run:

```bash
npm test -- src/components/Hero/Hero.test.tsx src/components/SiteHeader/SiteHeader.test.tsx src/components/SiteFooter/SiteFooter.test.tsx src/components/LanguageSwitcher/LanguageSwitcher.test.tsx src/i18n/translations/parity.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run focused e2e tests**

Run:

```bash
npm run test:e2e -- src/test-e2e/header-navigation.spec.ts src/test-e2e/contact-icons.spec.ts
```

Expected: PASS.

- [ ] **Step 3: Run broad quality gates**

Run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 4: Use `debugger` if any gate fails**

Use this prompt:

```text
Investigate and fix the failing Cal.eu Meet link checks. Paste the exact command output here. The feature adds siteConfig.social.meet, nav/hero/footer translation keys, a TablerCalendarEvent icon, Meet links in Hero/SiteHeader/SiteFooter, and tighter desktop nav/language-switcher spacing. First isolate whether the failure is type, test selector, e2e runtime, layout, or implementation, then make the smallest fix and rerun the failing command.
```

## Task 8: Manual QA

**Files:**

- No source edits expected unless QA finds a defect.

- [ ] **Step 1: Use `.agent/skills/manual-testing/SKILL.md`**

Run the app:

```bash
npm run develop
```

Open `http://localhost:8000` and verify:

- The homepage social icon row shows Contact, then Meet, then GitHub, LinkedIn, Instagram.
- The footer social icon row shows Contact, then Meet, then GitHub, LinkedIn, Instagram.
- The header desktop nav shows Contact, then Meet.
- The mobile nav shows Contact, then Meet, and tapping Meet closes the menu.
- The footer nav shows Contact, then Meet.
- Meet links open `https://www.cal.eu/dennis-lo/online-meeting` in a new tab.
- Desktop nav spacing is visibly tighter and still readable.
- Language locale spacing is visibly tighter and still readable.
- Browser console has no new errors.

## Task 9: Review, PR, and Session Completion

**Files:**

- All changed files.

- [ ] **Step 1: Use `code-reviewer` for final review**

Use this prompt:

```text
Review the complete Cal.eu Meet link feature. Focus on correctness, accessibility, external-link security, i18n key parity, React/Gatsby best practices, Tailwind spacing changes, test adequacy, and whether the implementation exactly matches the requested ordering: Contact then Meet in social icons, header nav, and footer nav. Treat Critical and Warning findings as blocking.
```

- [ ] **Step 2: Resolve all Critical and Warning review findings**

If fixes are needed, apply them through the appropriate agent:

- `test-writer` for missing/weak tests.
- `senior-frontend-engineer` for implementation defects.
- `debugger` for failing checks or unclear behavior.

- [ ] **Step 3: Commit, push, and open a PR**

Run:

```bash
git status --short
git add src/config.ts src/components/icons/TablerCalendarEvent.tsx src/components/Hero/Hero.tsx src/components/SiteHeader/SiteHeader.tsx src/components/SiteFooter/SiteFooter.tsx src/components/LanguageSwitcher/LanguageSwitcher.tsx src/i18n/translations/en-GB.ts src/i18n/translations/en-US.ts src/i18n/translations/es-ES.ts src/i18n/translations/zh-Hans.ts src/components/Hero/Hero.test.tsx src/components/SiteHeader/SiteHeader.test.tsx src/components/SiteFooter/SiteFooter.test.tsx src/components/LanguageSwitcher/LanguageSwitcher.test.tsx src/test-e2e/header-navigation.spec.ts src/test-e2e/contact-icons.spec.ts
git commit -m "feat: add Cal.eu meet links"
git pull --rebase
bd sync
git push
```

Open a PR that includes both tests and implementation together.

## Implementation Steps (Summary)

- [ ] `test-writer` + `unit-testing`: Add failing unit tests for Hero, SiteHeader, SiteFooter, and LanguageSwitcher.
- [ ] `e2e-testing`: Add failing Playwright tests for header nav and social Meet links.
- [ ] `senior-frontend-engineer`: Add `siteConfig.social.meet`, localized labels, and `TablerCalendarEvent`.
- [ ] `senior-frontend-engineer`: Add Meet links to Hero, SiteHeader, and SiteFooter in the required order.
- [ ] `senior-frontend-engineer`: Reduce desktop header nav gap and locale-link padding.
- [ ] Main orchestrator: Run targeted tests and broad quality gates.
- [ ] `debugger`: Fix any failing test/build/runtime behavior if needed.
- [ ] `manual-testing`: Verify the homepage in a browser at `http://localhost:8000`.
- [ ] `code-reviewer`: Review final code/test changes and block on Critical or Warning findings.
- [ ] Main orchestrator: Commit tests plus implementation, push to remote, and open a PR.
