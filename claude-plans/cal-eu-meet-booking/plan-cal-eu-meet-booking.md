# Cal.eu Meet Booking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a localized Meet booking entry point that routes users to an embedded Cal.eu booking experience using `BookerEmbed` from `@calcom/atoms`.

**Architecture:** Add a dedicated localized `/meet/` Gatsby page that renders a small `MeetingBooker` wrapper around `BookerEmbed`. Header/footer Meet menu items and hero/footer Meet social icons link to that page, so the navigation stays accessible, bookmarkable, and consistent with the existing Contact route pattern.

**Tech Stack:** Gatsby 5, React 19, TypeScript, Tailwind CSS 4, Jest + React Testing Library, Playwright, `@calcom/atoms`.

---

## Overview

The requested Cal.eu booking path is:

- public booking URL: `https://cal.eu/dennis-lo/online-meeting`
- `BookerEmbed` props: `username="dennis-lo"` and `eventSlug="online-meeting"`
- initial booker view: `MONTH_VIEW`

The existing site already has:

- route-aware Contact links via `routes.contactForm`
- localized header/footer labels via `src/i18n/translations/*.ts`
- contact social icons in both `Hero` and `SiteFooter`
- top-nav spacing controlled by Tailwind gap utilities in `SiteHeader`
- locale-aware page creation through Gatsby page context

This plan assumes "link version of the BookerEmbed" means a first-class `/meet/` route that contains the embedded booker. The social icon should link to the same route and sit immediately to the right of the existing Contact form icon in both current social-icon groups (`Hero` and `SiteFooter`).

References checked:

- Cal.com Booker Embed docs: `https://cal.com/docs/atoms/booker-embed`
- Cal.com Atoms setup docs: `https://cal.com/docs/atoms/setup`
- Referenced Codex thread `019f1dfb-c346-7842-8f15-92dc7f9abab3`, which confirms `BookerEmbed` usage with `username`, `eventSlug`, `view`, and success/error callbacks.

## Architecture Notes

### Booker wrapper

Create `src/components/MeetingBooker/MeetingBooker.tsx` as the only component that imports `BookerEmbed`. Keep the Cal config in `src/config.ts` so tests and links share one source of truth.

Use a client-only dynamic import for `@calcom/atoms`:

```tsx
const BookerEmbed = React.lazy(async () => {
  const atoms = await import("@calcom/atoms");
  return { default: atoms.BookerEmbed };
});
```

Then only render it after mount. This protects Gatsby SSR/build from browser-only code inside the third-party package.

### Cal atoms CSS

The project uses Tailwind CSS 4, so import the v4 atoms stylesheet:

```ts
import "@calcom/atoms/globals.min.css";
```

Add the import to both `gatsby-browser.ts` and `gatsby-ssr.ts` next to the existing `global.css` import so development, production, and SSR rendering share styles.

### Routes and localized links

Extend `routes` in `src/config.ts`:

```ts
export const routes = {
  contactForm: "/contact-form",
  meet: "/meet",
} as const;
```

Add shared booking config:

```ts
booking: {
  username: "dennis-lo",
  eventSlug: "online-meeting",
  url: "https://cal.eu/dennis-lo/online-meeting",
},
```

Use `localizePath(routes.meet)` everywhere internal Meet links are rendered. This preserves `/zh-Hans/meet/`, `/es-ES/meet/`, and `/en-US/meet/` behavior.

### Navigation order

Header order should become:

```text
About, Projects, Activity, Experience, Education, Gists, Contact, Meet
```

Footer order should become:

```text
About, Projects, Activity, Experience, Education, Contact, Meet
```

The Meet menu item appears immediately to the right of Contact in desktop header nav and footer nav. In the mobile header menu it appears immediately after Contact.

### Social icon order

Hero and footer social icons should become:

```text
Contact form, Meet, GitHub, LinkedIn, Instagram
```

Create a new icon component at `src/components/icons/TablerCalendarEvent.tsx`. Keep it consistent with existing Tabler icon components: accept `className?: string`, render `aria-hidden="true"`, and use `currentColor`.

### Spacing changes

Reduce desktop header nav gaps:

```tsx
<ul className="hidden md:flex md:items-center md:gap-4 lg:gap-5">
```

Reduce desktop language switcher visual gaps by adjusting `LanguageSwitcher` link padding:

```tsx
className="inline-flex items-center gap-1 px-1.5 py-1 text-sm rounded ..."
```

Keep mobile menu item spacing unchanged unless visual QA shows overflow.

## Files To Modify

- `package.json` and `package-lock.json`: add `@calcom/atoms`.
- `gatsby-browser.ts`: import `@calcom/atoms/globals.min.css`.
- `gatsby-ssr.ts`: import `@calcom/atoms/globals.min.css`.
- `src/config.ts`: add `routes.meet` and `siteConfig.booking`.
- `src/i18n/translations/en-GB.ts`: add Meet labels and SEO copy.
- `src/i18n/translations/en-US.ts`: add the same keys with US copy where applicable.
- `src/i18n/translations/zh-Hans.ts`: add Chinese Meet labels and SEO copy.
- `src/i18n/translations/es-ES.ts`: add Spanish Meet labels and SEO copy.
- `src/components/MeetingBooker/MeetingBooker.tsx`: new client-only BookerEmbed wrapper.
- `src/components/MeetingBooker/MeetingBooker.test.tsx`: new unit tests.
- `src/pages/meet.tsx`: new Gatsby page.
- `src/pages/meet.test.tsx`: new page/head tests.
- `src/components/icons/TablerCalendarEvent.tsx`: new social/nav icon.
- `src/components/Hero/Hero.tsx`: add Meet social icon immediately after Contact.
- `src/components/Hero/Hero.test.tsx`: add Meet icon/link tests.
- `src/components/SiteHeader/SiteHeader.tsx`: add Meet route nav item and reduce nav gap.
- `src/components/SiteHeader/SiteHeader.test.tsx`: add Meet nav tests and spacing assertion.
- `src/components/SiteFooter/SiteFooter.tsx`: add Meet footer nav item and Meet social icon.
- `src/components/SiteFooter/SiteFooter.test.tsx`: add Meet nav/social tests.
- `src/components/LanguageSwitcher/LanguageSwitcher.tsx`: reduce locale link padding.
- `src/components/LanguageSwitcher/LanguageSwitcher.test.tsx`: add/adjust class assertion if the current tests cover link classes.
- `src/test-e2e/header-navigation.spec.ts`: add Meet nav/icon journey assertions.
- Optional after implementation: `static/meet.md` only if the project wants Markdown alternate output for all pages. Do not add this unless the existing Markdown route effort requires page parity.

## Agent Orchestration

| Agent | Path | Role In This Plan | When To Use |
| --- | --- | --- | --- |
| `test-writer` | `.claude/agents/test-writer.md` | Writes Jest/RTL tests before implementation | First implementation step |
| `senior-frontend-engineer` | `.claude/agents/senior-frontend-engineer.md` | Implements the minimal frontend changes that satisfy failing tests | After failing tests are confirmed |
| `code-reviewer` | `.claude/agents/code-reviewer.md` | Reviews correctness, React/Gatsby SSR risk, accessibility, and test adequacy | After tests pass and before PR |
| `debugger` | `.claude/agents/debugger.md` | Investigates failing tests, build failures, console errors, or BookerEmbed runtime issues | Only when verification fails |

Use `.claude/skills/unit-testing/SKILL.md` for Jest/RTL work, `.claude/skills/e2e-testing/SKILL.md` for Playwright work, and `.agent/skills/manual-testing/SKILL.md` for browser QA after implementation.

### Task Prompts

```text
Task(subagent_type="test-writer", prompt="Write failing Jest and Playwright tests for the Cal.eu Meet booking feature. Follow .claude/skills/unit-testing/SKILL.md and .claude/skills/e2e-testing/SKILL.md. Cover MeetingBooker rendering with a mocked @calcom/atoms BookerEmbed, /meet page layout and localized Head metadata, Hero and SiteFooter Meet social icons immediately after Contact, SiteHeader and SiteFooter Meet menu links immediately after Contact, localized routes for zh-Hans, and reduced desktop header/language switcher spacing. Do not implement production code.")
```

```text
Task(subagent_type="senior-frontend-engineer", prompt="Implement the Cal.eu Meet booking feature in this Gatsby/React/TypeScript site after failing tests exist. Add @calcom/atoms, a client-only MeetingBooker wrapper using username dennis-lo and eventSlug online-meeting, a localized /meet page, Meet nav/social links, translations, a Tabler-style calendar icon, and the requested top-nav/language spacing reductions. Keep changes minimal, accessible, SSR-safe, and consistent with existing Contact route patterns.")
```

```text
Task(subagent_type="code-reviewer", prompt="Review the complete Cal.eu Meet booking change. Focus on Gatsby SSR safety for @calcom/atoms, route localization, nav/social ordering, accessibility names for icon links, translation parity, package/CSS setup, Playwright coverage, and whether tests prove the requested spacing/order changes without over-coupling to implementation details.")
```

```text
Task(subagent_type="debugger", prompt="Investigate the following Cal.eu Meet booking failure using .claude/agents/debugger.md. Start by reproducing the exact failing command, isolate whether the root cause is dependency setup, Gatsby SSR, dynamic import, tests, route localization, or BookerEmbed runtime behavior, then apply the minimal fix and rerun the relevant verification.")
```

## Agent Escalation Flow

```text
User request
  |
  v
Main agent creates plan
  |
  v
test-writer + unit-testing/e2e-testing
  |  writes failing tests
  v
Main agent confirms RED test failures
  |
  v
senior-frontend-engineer
  |  implements minimum change
  v
Targeted tests + typecheck + build + e2e
  |
  +--> failure --> debugger --> targeted verification
  |
  v
code-reviewer
  |
  +--> Critical/Warning findings --> senior-frontend-engineer or debugger
  |
  v
commit, push, PR, final handoff
```

## Implementation Tasks

### Task 1: Dependency And Booker Test Harness

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `gatsby-browser.ts`
- Modify: `gatsby-ssr.ts`
- Create: `src/components/MeetingBooker/MeetingBooker.test.tsx`
- Create: `src/components/MeetingBooker/MeetingBooker.tsx`

- [ ] **Step 1: Install Cal atoms**

Run:

```bash
npm install @calcom/atoms
```

Expected: `package.json` and `package-lock.json` include `@calcom/atoms`.

- [ ] **Step 2: Write failing MeetingBooker unit tests**

Create `src/components/MeetingBooker/MeetingBooker.test.tsx`:

```tsx
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import MeetingBooker from "./MeetingBooker";
import { siteConfig } from "../../config";
import { renderWithLocale } from "../../test/renderWithLocale";

jest.mock("@calcom/atoms", () => ({
  BookerEmbed: jest.fn(
    ({
      username,
      eventSlug,
      view,
    }: {
      username: string;
      eventSlug: string;
      view?: string;
    }) => (
      <section
        aria-label="Mock Cal booking"
        data-username={username}
        data-event-slug={eventSlug}
        data-view={view}
      />
    ),
  ),
}));

describe("MeetingBooker", () => {
  it("renders an accessible loading state before the BookerEmbed loads", () => {
    renderWithLocale(<MeetingBooker />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading meeting times",
    );
  });

  it("passes the Cal.eu booking config to BookerEmbed", async () => {
    renderWithLocale(<MeetingBooker />);

    const booker = await screen.findByRole("region", {
      name: "Mock Cal booking",
    });

    expect(booker).toHaveAttribute(
      "data-username",
      siteConfig.booking.username,
    );
    expect(booker).toHaveAttribute(
      "data-event-slug",
      siteConfig.booking.eventSlug,
    );
    expect(booker).toHaveAttribute("data-view", "MONTH_VIEW");
  });

  it("removes the loading status after BookerEmbed renders", async () => {
    renderWithLocale(<MeetingBooker />);

    await screen.findByRole("region", { name: "Mock Cal booking" });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });
});
```

Run:

```bash
npx jest src/components/MeetingBooker/MeetingBooker.test.tsx --runInBand
```

Expected: FAIL because `MeetingBooker` and `siteConfig.booking` do not exist yet.

- [ ] **Step 3: Commit failing tests**

Run:

```bash
git add src/components/MeetingBooker/MeetingBooker.test.tsx
git commit -m "test: cover cal meet booker"
```

Expected: commit succeeds with the failing test file only, satisfying the repo TDD requirement.

- [ ] **Step 4: Add dependency CSS imports**

Update `gatsby-browser.ts`:

```ts
import "./src/styles/global.css";
import "@calcom/atoms/globals.min.css";

export { wrapPageElement } from "./src/gatsby/wrapPageElement";
```

Keep the existing `onClientEntry` logic below the imports.

Update `gatsby-ssr.ts`:

```ts
import "./src/styles/global.css";
import "@calcom/atoms/globals.min.css";
import React from "react";
```

Keep the existing redirect script and `wrapPageElement` export unchanged.

- [ ] **Step 5: Add shared booking config**

Update `src/config.ts`:

```ts
export const routes = {
  contactForm: "/contact-form",
  meet: "/meet",
} as const;

export const siteConfig = {
  siteUrl: "https://dlo.wtf",
  header: "Who is DLO?",
  name: "Dennis Lo",
  title: "IT Consultant & Software Engineer",
  description:
    "Personal website of Dennis Lo, IT consultant and software engineer.",
  accentColor: "#1d4ed8",
  booking: {
    username: "dennis-lo",
    eventSlug: "online-meeting",
    url: "https://cal.eu/dennis-lo/online-meeting",
  },
  social: {
    email: "lo.dennis@gmail.com",
    github: "https://github.com/dennislo",
    linkedin: "https://www.linkedin.com/in/dennis-lo-profile",
    instagram: "https://www.instagram.com/dlo",
  },
  // keep the rest of the existing object unchanged
};
```

- [ ] **Step 6: Implement MeetingBooker**

Create `src/components/MeetingBooker/MeetingBooker.tsx`:

```tsx
import React, { Suspense, useEffect, useState } from "react";
import { siteConfig } from "../../config";
import { useLocale } from "../../i18n";

const BookerEmbed = React.lazy(async () => {
  const atoms = await import("@calcom/atoms");
  return { default: atoms.BookerEmbed };
});

function MeetingBooker() {
  const [isClient, setIsClient] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fallback = (
    <p
      role="status"
      className="rounded border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
    >
      {t("meet.loading")}
    </p>
  );

  if (!isClient) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <BookerEmbed
        username={siteConfig.booking.username}
        eventSlug={siteConfig.booking.eventSlug}
        view="MONTH_VIEW"
        metadata={{ bookingSource: "dlo.wtf" }}
        onCreateBookingSuccess={() => undefined}
        onCreateBookingError={() => undefined}
      />
    </Suspense>
  );
}

export default MeetingBooker;
```

- [ ] **Step 7: Verify MeetingBooker tests pass**

Run:

```bash
npx jest src/components/MeetingBooker/MeetingBooker.test.tsx --runInBand
```

Expected: PASS.

### Task 2: Meet Page And Localized SEO

**Files:**

- Create: `src/pages/meet.tsx`
- Create: `src/pages/meet.test.tsx`
- Modify: `src/i18n/translations/en-GB.ts`
- Modify: `src/i18n/translations/en-US.ts`
- Modify: `src/i18n/translations/zh-Hans.ts`
- Modify: `src/i18n/translations/es-ES.ts`

- [ ] **Step 1: Write failing Meet page tests**

Create `src/pages/meet.test.tsx`:

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import MeetPage, { Head } from "./meet";
import { enGB } from "../i18n/translations/en-GB";
import { getDictionary } from "../i18n/dictionaries";
import { siteConfig } from "../config";

jest.mock("../components/Layout/Layout", () => ({
  __esModule: true,
  default: function MockLayout({ children }: { children: React.ReactNode }) {
    return <div aria-label="Layout">{children}</div>;
  },
}));

jest.mock("../components/MeetingBooker/MeetingBooker", () => ({
  __esModule: true,
  default: function MockMeetingBooker() {
    return <section aria-label="Meeting booker">Meeting booker</section>;
  },
}));

describe("MeetPage", () => {
  it("renders the layout and meeting booker", () => {
    render(<MeetPage />);

    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Meeting booker" }),
    ).toBeInTheDocument();
  });
});

describe("MeetPage Head", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders default localized meeting SEO", () => {
    render(<Head />);

    expect(document.title).toBe(enGB.seo.meetPageTitle);
    expect(
      document.head.querySelector('meta[name="description"]'),
    ).toHaveAttribute("content", enGB.seo.meetPageDescription);
  });

  it("emits canonical href for zh-Hans meet route", () => {
    render(
      <Head
        pageContext={{ locale: "zh-Hans" }}
        location={{ pathname: "/zh-Hans/meet/" }}
      />,
    );

    const dict = getDictionary("zh-Hans");
    const canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    expect(document.querySelector("title")?.textContent).toBe(
      dict.seo.meetPageTitle,
    );
    expect(canonical?.getAttribute("href")).toBe(
      `${siteConfig.siteUrl}/zh-Hans/meet/`,
    );
  });
});
```

Run:

```bash
npx jest src/pages/meet.test.tsx --runInBand
```

Expected: FAIL because the page and translation keys do not exist yet.

- [ ] **Step 2: Add translation keys**

Add these keys to every locale dictionary:

`en-GB.ts`:

```ts
nav: {
  // existing keys
  meet: "Meet",
},
hero: {
  // existing keys
  meetAriaLabel: "Book a meeting with Dennis Lo",
},
footer: {
  // existing keys
  meetAria: "Book a meeting with Dennis Lo",
  meet: "Meet",
},
meet: {
  loading: "Loading meeting times",
},
seo: {
  // existing keys
  meetPageTitle: "Meet Dennis Lo - DLO",
  meetPageDescription: "Book an online meeting with Dennis Lo",
},
```

`en-US.ts`:

```ts
nav: { meet: "Meet" },
hero: { meetAriaLabel: "Book a meeting with Dennis Lo" },
footer: {
  meetAria: "Book a meeting with Dennis Lo",
  meet: "Meet",
},
meet: { loading: "Loading meeting times" },
seo: {
  meetPageTitle: "Meet Dennis Lo - DLO",
  meetPageDescription: "Book an online meeting with Dennis Lo",
},
```

`zh-Hans.ts`:

```ts
nav: { meet: "预约会议" },
hero: { meetAriaLabel: "与 Dennis Lo 预约会议" },
footer: {
  meetAria: "与 Dennis Lo 预约会议",
  meet: "预约会议",
},
meet: { loading: "正在加载会议时间" },
seo: {
  meetPageTitle: "与 Dennis Lo 预约会议 - DLO",
  meetPageDescription: "与 Dennis Lo 预约在线会议",
},
```

`es-ES.ts`:

```ts
nav: { meet: "Reunión" },
hero: { meetAriaLabel: "Reservar una reunión con Dennis Lo" },
footer: {
  meetAria: "Reservar una reunión con Dennis Lo",
  meet: "Reunión",
},
meet: { loading: "Cargando horarios disponibles" },
seo: {
  meetPageTitle: "Reunión con Dennis Lo - DLO",
  meetPageDescription: "Reserva una reunión online con Dennis Lo",
},
```

Keep these additions inside the existing objects rather than replacing whole dictionaries.

- [ ] **Step 3: Implement Meet page**

Create `src/pages/meet.tsx`:

```tsx
import React from "react";
import Layout from "../components/Layout/Layout";
import MeetingBooker from "../components/MeetingBooker/MeetingBooker";
import { Head as SharedHead } from "../components/Head/Head";
import { buildWebPageSchema } from "../schemas";
import { siteConfig } from "../config";
import {
  defaultLocale,
  isLocale,
  localizePath,
  stripLocale,
} from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";

const MeetPage = () => (
  <Layout>
    <main className="min-h-screen bg-white px-6 py-24 dark:bg-gray-950 sm:px-10 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <MeetingBooker />
      </div>
    </main>
  </Layout>
);

export default MeetPage;

interface MeetHeadProps {
  pageContext?: { locale?: unknown };
  location?: { pathname?: string };
}

export function Head({ pageContext, location }: MeetHeadProps = {}) {
  const localeFromCtx = pageContext?.locale;
  const locale =
    typeof localeFromCtx === "string" && isLocale(localeFromCtx)
      ? localeFromCtx
      : defaultLocale;
  const dict = getDictionary(locale);
  const { basePath } = stripLocale(location?.pathname ?? "/meet/");

  const schemas = [
    buildWebPageSchema({
      url: `${siteConfig.siteUrl}${localizePath(basePath, locale)}`,
      name: dict.seo.meetPageTitle,
      description: dict.seo.meetPageDescription,
    }),
  ];

  return (
    <SharedHead
      title={dict.seo.meetPageTitle}
      description={dict.seo.meetPageDescription}
      locale={locale}
      path={basePath}
      schemas={schemas}
    />
  );
}
```

- [ ] **Step 4: Verify page tests and translation parity**

Run:

```bash
npx jest src/pages/meet.test.tsx src/i18n/translations/parity.test.ts --runInBand
```

Expected: PASS.

### Task 3: Header/Footer Menu Items And Spacing

**Files:**

- Modify: `src/components/SiteHeader/SiteHeader.tsx`
- Modify: `src/components/SiteHeader/SiteHeader.test.tsx`
- Modify: `src/components/SiteFooter/SiteFooter.tsx`
- Modify: `src/components/SiteFooter/SiteFooter.test.tsx`
- Modify: `src/components/LanguageSwitcher/LanguageSwitcher.tsx`
- Modify: `src/components/LanguageSwitcher/LanguageSwitcher.test.tsx` if class coverage exists

- [ ] **Step 1: Write failing nav and spacing tests**

Extend `src/components/SiteHeader/SiteHeader.test.tsx` with:

```tsx
it("renders Meet immediately after Contact in the desktop nav list", () => {
  renderWithLocale(<SiteHeader />);

  const desktopNav = getDesktopNav();
  const links = within(desktopNav).getAllByRole("link");
  const labels = links.map((link) => link.textContent);
  const contactIndex = labels.indexOf(enGB.nav.contact);
  const meetIndex = labels.indexOf(enGB.nav.meet);

  expect(meetIndex).toBe(contactIndex + 1);
  expect(links[meetIndex]).toHaveAttribute("href", routes.meet);
});

it("renders Meet immediately after Contact in the mobile menu", async () => {
  const user = userEvent.setup();
  renderWithLocale(<SiteHeader />);

  await user.click(screen.getByRole("button", { name: enGB.nav.openMenu }));

  const mobileMenu = screen.getByRole("region", {
    name: enGB.nav.mobileMenuAriaLabel,
  });
  const labels = within(mobileMenu)
    .getAllByRole("link")
    .map((link) => link.textContent);

  expect(labels.indexOf(enGB.nav.meet)).toBe(
    labels.indexOf(enGB.nav.contact) + 1,
  );
});

it("uses reduced desktop nav gaps", () => {
  renderWithLocale(<SiteHeader />);

  expect(getDesktopNav()).toHaveClass("md:gap-4");
  expect(getDesktopNav()).toHaveClass("lg:gap-5");
});
```

Extend `src/components/SiteFooter/SiteFooter.test.tsx` with:

```tsx
it("renders Meet immediately after Contact in the footer nav", () => {
  renderWithLocale(<SiteFooter />);

  const links = screen.getAllByRole("link");
  const navLabels = links.map((link) => link.textContent);

  expect(navLabels.indexOf(enGB.footer.meet)).toBe(
    navLabels.indexOf(enGB.footer.contact) + 1,
  );
  expect(
    screen.getByRole("link", { name: enGB.footer.meet }),
  ).toHaveAttribute("href", routes.meet);
});
```

If `LanguageSwitcher.test.tsx` already asserts link classes, update it to expect `px-1.5`. If it does not, add:

```tsx
it("uses compact locale link padding in the top navigation", () => {
  renderWithLocale(<LanguageSwitcher />);

  expect(screen.getByRole("link", { name: /English/ })).toHaveClass("px-1.5");
});
```

Run:

```bash
npx jest src/components/SiteHeader/SiteHeader.test.tsx src/components/SiteFooter/SiteFooter.test.tsx src/components/LanguageSwitcher/LanguageSwitcher.test.tsx --runInBand
```

Expected: FAIL because Meet links and compact spacing are not implemented yet.

- [ ] **Step 2: Update SiteHeader nav model**

In `src/components/SiteHeader/SiteHeader.tsx`, extend the route mapping:

```tsx
const staticNavLinks: NavLink[] = [
  ...sectionNavLinks.map((link) => ({
    type: "internal" as const,
    href: link.href,
  })),
  {
    type: "external" as const,
    label: "gists",
    href: "https://gist.github.com/dennislo/public",
  },
  {
    type: "route" as const,
    href: routes.contactForm,
    label: "contact",
  },
  {
    type: "route" as const,
    href: routes.meet,
    label: "meet",
  },
];
```

Update the route type and label resolution:

```tsx
type RouteNavLink = {
  type: "route";
  href: (typeof routes)[keyof typeof routes];
  label: keyof TranslationDictionary["nav"];
};
```

```tsx
return {
  ...link,
  href: localizePath(link.href) as `/${string}`,
  label: t(navTranslationKey(link.label)),
};
```

Reduce desktop nav gap:

```tsx
<ul className="hidden md:flex md:items-center md:gap-4 lg:gap-5">
```

- [ ] **Step 3: Update SiteFooter nav**

In `src/components/SiteFooter/SiteFooter.tsx`, render Meet immediately after Contact:

```tsx
<li>
  <Link
    to={localizePath(routes.contactForm)}
    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
  >
    {t("footer.contact")}
  </Link>
</li>
<li>
  <Link
    to={localizePath(routes.meet)}
    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
  >
    {t("footer.meet")}
  </Link>
</li>
```

- [ ] **Step 4: Compact LanguageSwitcher link padding**

In `src/components/LanguageSwitcher/LanguageSwitcher.tsx`, change the link class from `px-2` to `px-1.5`:

```tsx
className="inline-flex items-center gap-1 px-1.5 py-1 text-sm rounded transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
```

- [ ] **Step 5: Verify nav tests**

Run:

```bash
npx jest src/components/SiteHeader/SiteHeader.test.tsx src/components/SiteFooter/SiteFooter.test.tsx src/components/LanguageSwitcher/LanguageSwitcher.test.tsx --runInBand
```

Expected: PASS.

### Task 4: Meet Social Icons

**Files:**

- Create: `src/components/icons/TablerCalendarEvent.tsx`
- Modify: `src/components/Hero/Hero.tsx`
- Modify: `src/components/Hero/Hero.test.tsx`
- Modify: `src/components/SiteFooter/SiteFooter.tsx`
- Modify: `src/components/SiteFooter/SiteFooter.test.tsx`

- [ ] **Step 1: Write failing social icon tests**

Extend `src/components/Hero/Hero.test.tsx`:

```tsx
it("renders the Meet social icon immediately after Contact", () => {
  renderWithLocale(<Hero />);

  const links = screen.getAllByRole("link");
  const names = links.map((link) => link.getAttribute("aria-label"));
  const contactIndex = names.indexOf(enGB.hero.contactAriaLabel);
  const meetIndex = names.indexOf(enGB.hero.meetAriaLabel);

  expect(meetIndex).toBe(contactIndex + 1);
  expect(links[meetIndex]).toHaveAttribute("href", routes.meet);
});
```

Extend `src/components/SiteFooter/SiteFooter.test.tsx`:

```tsx
it("renders the Meet social icon immediately after the Contact form icon", () => {
  renderWithLocale(<SiteFooter />);

  const links = screen.getAllByRole("link");
  const names = links.map((link) => link.getAttribute("aria-label"));
  const contactIndex = names.indexOf(enGB.footer.emailAria);
  const meetIndex = names.indexOf(enGB.footer.meetAria);

  expect(meetIndex).toBe(contactIndex + 1);
  expect(links[meetIndex]).toHaveAttribute("href", routes.meet);
});
```

Run:

```bash
npx jest src/components/Hero/Hero.test.tsx src/components/SiteFooter/SiteFooter.test.tsx --runInBand
```

Expected: FAIL because Meet social icons do not exist yet.

- [ ] **Step 2: Add Tabler calendar icon**

Create `src/components/icons/TablerCalendarEvent.tsx`:

```tsx
import React from "react";

interface TablerCalendarEventProps {
  className?: string;
}

function TablerCalendarEvent({ className }: TablerCalendarEventProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
      <path d="M16 3l0 4" />
      <path d="M8 3l0 4" />
      <path d="M4 11l16 0" />
      <path d="M8 15h2v2h-2z" />
    </svg>
  );
}

export default TablerCalendarEvent;
```

- [ ] **Step 3: Add Hero Meet icon after Contact**

In `src/components/Hero/Hero.tsx`, import the icon:

```tsx
import TablerCalendarEvent from "../icons/TablerCalendarEvent";
```

Render it immediately after the Contact `Link`:

```tsx
<Link
  to={localizePath(routes.meet)}
  aria-label={t("hero.meetAriaLabel")}
  className="transition-colors duration-300 hover:text-[--accent]"
  style={{ ["--accent" as string]: accent }}
>
  <TablerCalendarEvent className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
</Link>
```

- [ ] **Step 4: Add footer Meet icon after Contact**

In `src/components/SiteFooter/SiteFooter.tsx`, import the icon:

```tsx
import TablerCalendarEvent from "../icons/TablerCalendarEvent";
```

Render it immediately after the Contact form social icon:

```tsx
<Link
  to={localizePath(routes.meet)}
  aria-label={t("footer.meetAria")}
  className="transition-colors duration-300 hover:text-[--accent]"
>
  <TablerCalendarEvent className="h-5 w-5" />
</Link>
```

- [ ] **Step 5: Verify social icon tests**

Run:

```bash
npx jest src/components/Hero/Hero.test.tsx src/components/SiteFooter/SiteFooter.test.tsx --runInBand
```

Expected: PASS.

### Task 5: End-To-End Coverage And Manual QA

**Files:**

- Modify: `src/test-e2e/header-navigation.spec.ts`

- [ ] **Step 1: Write failing Playwright tests**

Add tests to `src/test-e2e/header-navigation.spec.ts`:

```ts
test("desktop nav Meet link navigates to /meet and shows the booking page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Meet" })
    .click();

  await expect(page).toHaveURL(new RegExp(`${routes.meet}/?$`));
  await expect(page.getByRole("main")).toBeVisible();
});

test("mobile menu shows Meet immediately after Contact", async ({ page }) => {
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: /navigation menu/i });
  await menuButton.click();

  const mobileMenu = page.getByRole("region", {
    name: "Mobile primary menu",
  });
  const labels = await mobileMenu
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.textContent));

  expect(labels.indexOf("Meet")).toBe(labels.indexOf("Contact") + 1);
});
```

If the live `BookerEmbed` makes the page slow or network-dependent in CI, assert the local route, page shell, and absence of local asset errors rather than waiting for Cal.eu network completion.

Run:

```bash
npx playwright test src/test-e2e/header-navigation.spec.ts --project=chromium
```

Expected before implementation: FAIL because the Meet route/link does not exist. Expected after implementation: PASS.

- [ ] **Step 2: Run focused verification**

Run:

```bash
npx jest src/components/MeetingBooker/MeetingBooker.test.tsx src/pages/meet.test.tsx src/components/Hero/Hero.test.tsx src/components/SiteHeader/SiteHeader.test.tsx src/components/SiteFooter/SiteFooter.test.tsx src/i18n/translations/parity.test.ts --runInBand
npm run typecheck
npm run build
npx playwright test src/test-e2e/header-navigation.spec.ts --project=chromium
```

Expected: all commands PASS.

- [ ] **Step 3: Manual QA with `.agent/skills/manual-testing/SKILL.md`**

Run:

```bash
npm run develop
```

Open `http://localhost:8000` and verify:

- desktop header shows Meet immediately to the right of Contact
- desktop header nav and locale switcher gaps are visibly tighter and do not wrap at 1280px, 1024px, and 768px widths
- mobile menu shows Meet immediately after Contact
- hero social icons show Contact, Meet, GitHub, LinkedIn, Instagram in that order
- footer nav shows Meet immediately after Contact
- footer social icons show Contact, Meet, GitHub, LinkedIn, Instagram in that order
- `/meet/` renders the Cal.eu booking experience for `dennis-lo/online-meeting`
- `/zh-Hans/meet/`, `/es-ES/meet/`, and `/en-US/meet/` render localized site chrome and the same booker
- browser Console has no uncaught errors
- Network has no failed local assets

Capture screenshots only if layout or BookerEmbed rendering is visually wrong.

### Task 6: PR, Review, And Landing

**Files:**

- All files changed above

- [ ] **Step 1: Run full quality gates**

Run:

```bash
npm test -- --runInBand
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --project=chromium
```

Expected: PASS.

- [ ] **Step 2: Run code-reviewer**

Use:

```text
Task(subagent_type="code-reviewer", prompt="Review the Cal.eu Meet booking feature and tests. Check all changed files for SSR safety, accessibility, localization, route ordering, dependency setup, and test adequacy. Critical and Warning findings must be fixed before PR.")
```

Expected: no Critical or Warning findings remain.

- [ ] **Step 3: Fix review findings if needed**

If review or quality gates fail, use:

```text
Task(subagent_type="debugger", prompt="Investigate and fix the exact Cal.eu Meet booking failure: <paste command and error output>. Reproduce first, isolate root cause, apply the minimal fix, and rerun the relevant command.")
```

Expected: all rerun checks PASS.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add package.json package-lock.json gatsby-browser.ts gatsby-ssr.ts src
git commit -m "feat: add cal meet booking"
```

Expected: commit succeeds.

- [ ] **Step 5: Land according to AGENTS.md**

Run:

```bash
bd ready --json
git pull --rebase
bd sync
git push
git status
```

Expected: push succeeds and `git status` reports the branch is up to date with origin.

- [ ] **Step 6: Open PR**

Open a PR containing both failing-test commit and implementation commit. PR summary should mention:

- adds `/meet/` with `BookerEmbed`
- adds Meet header/footer menu items after Contact
- adds Meet hero/footer social icons after Contact form icon
- tightens desktop header nav and language switcher spacing
- verifies Jest, typecheck, lint, build, Playwright, and manual QA

## Risks And Mitigations

- **Gatsby SSR risk:** `@calcom/atoms` may access browser APIs. Mitigate with `React.lazy`, client-only rendering after mount, and `npm run build`.
- **Third-party network risk:** CI should not depend on Cal.eu availability. Unit tests mock `@calcom/atoms`; Playwright should verify local route and shell rather than live slot data.
- **Cal.eu host ambiguity:** `BookerEmbed` docs require `username` and `eventSlug`; the public fallback URL remains `https://cal.eu/dennis-lo/online-meeting`. Manual QA must confirm the embedded booking resolves the intended event.
- **Localization drift:** translation parity tests must pass after adding `nav.meet`, `hero.meetAriaLabel`, `footer.meetAria`, `footer.meet`, `meet.loading`, and Meet SEO keys.
- **Header wrapping risk:** adding Meet while reducing gaps can still wrap on narrow desktop widths. Manual QA must check 768px, 1024px, and 1280px widths.

## Implementation Steps (Summary)

- [ ] **Agent: test-writer** - Add failing Jest tests for `MeetingBooker`, `meet` page, Hero, SiteHeader, SiteFooter, LanguageSwitcher, and translation parity.
- [ ] **Agent: test-writer** - Add failing Playwright coverage for Meet nav behavior.
- [ ] **Main agent** - Run targeted tests and confirm they fail for missing Meet behavior.
- [ ] **Agent: senior-frontend-engineer** - Install `@calcom/atoms` and add atoms CSS imports.
- [ ] **Agent: senior-frontend-engineer** - Add shared booking config and `routes.meet`.
- [ ] **Agent: senior-frontend-engineer** - Implement client-only `MeetingBooker`.
- [ ] **Agent: senior-frontend-engineer** - Implement `/meet/` page and localized Head metadata.
- [ ] **Agent: senior-frontend-engineer** - Add Meet labels to all locale dictionaries.
- [ ] **Agent: senior-frontend-engineer** - Add Meet menu items after Contact in header, mobile menu, and footer.
- [ ] **Agent: senior-frontend-engineer** - Add Meet social icons after Contact form icons in Hero and SiteFooter.
- [ ] **Agent: senior-frontend-engineer** - Reduce desktop header nav gaps and language switcher padding.
- [ ] **Main agent** - Run targeted Jest, typecheck, build, and Playwright checks.
- [ ] **Agent: debugger** - Investigate and fix any failing command before broad verification.
- [ ] **Manual QA skill** - Validate desktop/mobile layout, `/meet/`, localized meet routes, console, and local network errors.
- [ ] **Agent: code-reviewer** - Review complete change and test adequacy.
- [ ] **Main agent** - Resolve all Critical/Warning review findings.
- [ ] **Main agent** - Run full quality gates.
- [ ] **Main agent** - Commit, pull/rebase, sync beads, push, verify branch is up to date, and open PR.
