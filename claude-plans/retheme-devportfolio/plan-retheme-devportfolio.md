# Plan: Re-theme Codebase with DevPortfolio Design

## Overview

Re-theme the existing Gatsby/React/TypeScript personal website to match the design of [RyanFitzgerald/devportfolio](https://github.com/RyanFitzgerald/devportfolio). The site will transition from custom CSS/styled-components to **Tailwind CSS v4**, adopt **Tabler Icons** (inline SVGs), and restructure the single-page layout into distinct portfolio sections (Hero, About, Experience, Education, Projects, Footer) while preserving the existing Gatsby + React + TypeScript stack.

Existing text content (Dennis Lo's bio, clients, fun facts, contact info) will be mapped into the new section-based layout. Sections from the devportfolio design that have no matching content (e.g., Projects, Experience, Education) will retain example/placeholder text.

---

## Architecture Notes

### Current State

- **Stack:** Gatsby 5, React 18, TypeScript, styled-components + CSS modules
- **Layout:** Single page (`index.tsx`) rendering `<Layout>` > `<Article>` with subsections (Clients, More, Contact)
- **Styling:** Mix of styled-components (`Layout.tsx` Footer), CSS modules (`main.css`, `animation.css`, `BurgerMenu.css`, `ThemeToggle.css`, `ContactForm.css`), and global CSS (`reset.css`, `typography.css`, `links.css`, `theme.css`)
- **Theme:** `ThemeContext` with light/dark mode, CSS custom properties, `data-theme` attribute on `<html>`
- **Icons:** Custom SVG components (`Github.tsx`, `Email.tsx`, `Linkedin.tsx`, `Instagram.tsx`)

### Target State

- **Stack:** Gatsby 5, React 18, TypeScript (unchanged)
- **Styling:** Tailwind CSS v4 (replaces all CSS modules, styled-components, and global CSS)
- **Layout:** Single page with distinct section components: `Hero`, `About`, `Experience`, `Education`, `Projects`, `Header`, `Footer`
- **Theme:** Keep light/dark theme system but implement via Tailwind's `dark:` variant (driven by `data-theme` attribute)
- **Icons:** Tabler Icons as inline SVGs in React components (Email, LinkedIn, GitHub, Instagram, ArrowUpRight, X/Twitter)
- **Font:** IBM Plex Mono (via Google Fonts import)
- **Config:** Centralized `siteConfig.ts` object driving all section content

### Content Mapping (Existing -> New Sections)

| DevPortfolio Section | Content Source                                       | Notes                                                                           |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Hero**             | `Article.tsx` "hello" heading + Dennis Lo name       | Greeting "Hello!" + "I'm Dennis Lo" + title "IT Consultant & Software Engineer" |
| **About**            | `Article.tsx` `.intro` paragraphs + Agile IT section | Bio text + skill tags from existing client industries                           |
| **Projects**         | _None_                                               | Keep devportfolio example projects (placeholder)                                |
| **Experience**       | _None_                                               | Keep devportfolio example experience (placeholder)                              |
| **Education**        | _None_                                               | Keep devportfolio example education (placeholder)                               |
| **Footer**           | `Contact.tsx` social links + copyright               | GitHub, Email, LinkedIn, Instagram links + copyright                            |
| **Header**           | `BurgerMenu.tsx` navigation links                    | Fixed nav bar with section anchors (replaces burger menu)                       |
| **Contact Form**     | `ContactForm.tsx` (separate page)                    | Keep as separate `/contact-form` page, restyle with Tailwind                    |

### Key Design Decisions

1. **Tailwind v4 with PostCSS** — Use `@tailwindcss/postcss` for Gatsby integration (Gatsby uses PostCSS under the hood via `gatsby-plugin-postcss`).
2. **Dark mode via `selector` strategy** — Tailwind's dark mode will use `[data-theme="dark"]` selector to work with existing `ThemeContext`.
3. **No Tabler Icons package** — Use inline SVGs directly in components (matches devportfolio approach, avoids extra dependency).
4. **Config-driven content** — Create `src/config.ts` with all site content, section data, and accent color. Components read from this config.
5. **Keep ThemeToggle** — The devportfolio doesn't have dark mode, but we keep our existing toggle (restyled with Tailwind).
6. **Remove styled-components** — Fully replace with Tailwind utility classes.
7. **Remove all CSS module files** — Replace with Tailwind classes inline.
8. **Keep Gatsby plugins** — `gatsby-plugin-image`, `gatsby-plugin-sitemap`, `gatsby-plugin-segment-js` stay. Remove `gatsby-plugin-styled-components`.

---

## Implementation Steps

### Step 1: Install Tailwind CSS and Configure

**Files to create/modify:**

- `package.json` — Add `tailwindcss`, `@tailwindcss/postcss`, `postcss`. Remove `styled-components`, `gatsby-plugin-styled-components`.
- `postcss.config.js` — Create with `@tailwindcss/postcss` plugin.
- `src/styles/global.css` — Create: `@import "tailwindcss";` + IBM Plex Mono font-family + dark mode custom properties.
- `gatsby-config.ts` — Remove `gatsby-plugin-styled-components`. Add `gatsby-plugin-postcss`.
- `gatsby-browser.ts` — Import `./src/styles/global.css`.
- `gatsby-ssr.ts` — Import `./src/styles/global.css`.

**Actions:**

1. `npm install tailwindcss @tailwindcss/postcss postcss gatsby-plugin-postcss`
2. `npm uninstall styled-components gatsby-plugin-styled-components`
3. Create `postcss.config.js`:
   ```js
   module.exports = {
     plugins: {
       "@tailwindcss/postcss": {},
     },
   };
   ```
4. Create `src/styles/global.css`:

   ```css
   @import "tailwindcss";

   @theme {
     --font-mono: "IBM Plex Mono", monospace;
   }

   body {
     font-family: var(--font-mono);
   }

   /* Dark mode overrides using existing data-theme attribute */
   :root[data-theme="dark"] {
     --accent-color: #77b7d8;
   }
   :root[data-theme="light"] {
     --accent-color: #1d4ed8;
   }
   ```

5. Update `gatsby-config.ts`: remove styled-components plugin, add `gatsby-plugin-postcss`.
6. Update `gatsby-browser.ts` and `gatsby-ssr.ts` to import global CSS.

### Step 2: Create Site Config

**Files to create:**

- `src/config.ts`

**Content:** Centralized config object with all site data:

```typescript
export const siteConfig = {
  name: "Dennis Lo",
  title: "IT Consultant & Software Engineer",
  description: "...",
  accentColor: "#1d4ed8",
  social: {
    email: "dennis@dlo.wtf",
    github: "https://github.com/dennislo",
    linkedin: "https://www.linkedin.com/in/dennis-lo-profile",
    instagram: "https://www.instagram.com/dlo",
  },
  aboutMe:
    "I'm Dennis Lo, an IT consultant and software engineer who crafts robust, scalable solutions that solve real problems...",
  agileIT:
    "We deliver enterprise-grade IT consultancy and software engineering services...",
  skills: [
    "JavaScript",
    "TypeScript",
    "C#",
    "Java",
    "Bash/Shell",
    "React",
    "Node.js",
    "Cloud Computing",
    "DevOps",
    "Full Stack Development",
    "System Architecture",
  ],
  clients: [
    "Advertising & Media",
    "HR & Recruitment",
    "Retail & Consumer",
    "Science & Education",
    "Finance & Banking",
    "IT & Telecommunications",
  ],
  funFacts: [
    {
      emoji: "🤓",
      text: "Learning Cloud Computing & Optimising Software Delivery",
    },
    { emoji: "💬", text: "Ask me about Entrepreneurship & Web Development" },
    { emoji: "😍", text: "Enjoys Snowboarding & Bike Riding" },
  ],
  // Placeholder data from devportfolio (no matching existing content)
  projects: [
    {
      name: "AI Dev Roundup Newsletter",
      description:
        "One concise email. Five minutes. Every Tuesday. Essential AI news & trends, production-ready libraries...",
      link: "",
      skills: ["React", "Node.js", "AWS"],
    },
    {
      name: "Chrome Extension Mastery",
      description:
        "A comprehensive course covering full-stack Chrome extension development...",
      link: "",
      skills: ["JavaScript", "Chrome APIs", "React"],
    },
    {
      name: "ExtensionKit",
      description: "A starter template kit for Chrome extensions...",
      link: "",
      skills: ["TypeScript", "React", "Vite"],
    },
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Company",
      dateRange: "Jan 2022 - Present",
      bullets: [
        "Led development of microservices architecture serving 1M+ users",
        "Reduced API response times by 40% through optimization",
        "Mentored team of 5 junior developers",
      ],
    },
    {
      title: "Full Stack Developer",
      company: "Startup Inc",
      dateRange: "Jun 2020 - Dec 2021",
      bullets: [
        "Built and deployed 3 production applications",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      school: "University",
      dateRange: "2014 - 2018",
      achievements: [
        "Graduated Magna Cum Laude with 3.8 GPA",
        "Teaching Assistant for Data Structures",
      ],
    },
  ],
};
```

### Step 3: Create Tabler Icon Components

**Files to create:**

- `src/components/icons/TablerEmail.tsx`
- `src/components/icons/TablerLinkedin.tsx`
- `src/components/icons/TablerGithub.tsx`
- `src/components/icons/TablerInstagram.tsx`
- `src/components/icons/TablerTwitter.tsx`
- `src/components/icons/TablerArrowUpRight.tsx`
- `src/components/icons/TablerMoon.tsx` — shown in ThemeToggle when theme is `"light"` (click to go dark)
- `src/components/icons/TablerSun.tsx` — shown in ThemeToggle when theme is `"dark"` (click to go light)

Each icon is a React functional component rendering an inline SVG from Tabler Icons, accepting `className` prop for Tailwind styling. Example:

```tsx
import React from "react";

interface TablerIconProps {
  className?: string;
}

const TablerEmail: React.FC<TablerIconProps> = ({ className = "h-6 w-6" }) => (
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
    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
    <path d="M3 7l9 6l9 -6" />
  </svg>
);

export default TablerEmail;
```

SVG paths sourced from the devportfolio repo (Tabler Icons).

**ThemeToggle icon mapping:**

- Light mode → show `TablerMoon` (Tabler `icon-moon`, path: `M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z`)
- Dark mode → show `TablerSun` (Tabler `icon-sun`, center circle + 8 ray lines)

### Step 4: Build Section Components

Replace `Article.tsx` and its subsections with new section components matching devportfolio layout.

**Files to create:**

- `src/components/Hero/Hero.tsx` — Full-screen hero with greeting, name, title, social icons, gradient overlay, programming symbols SVG background
- `src/components/About/About.tsx` — Two-column grid: "About Me" heading + bio text + skill tags + clients list + fun facts
- `src/components/Projects/Projects.tsx` — Two-column grid: "Projects" heading + numbered project cards
- `src/components/Experience/Experience.tsx` — Two-column grid: "Experience" heading + timeline cards
- `src/components/Education/Education.tsx` — Two-column grid: "Education" heading + education cards
- `src/components/Header/Header.tsx` — Fixed nav bar with scroll-triggered backdrop blur (replaces BurgerMenu)
- `src/components/Footer/Footer.tsx` — Name, title, social icons, nav links, copyright, decorative wave SVG

**Key implementation details:**

- All components import from `src/config.ts`
- All styling via Tailwind utility classes
- Social icons use new Tabler icon components
- Dark mode: use `dark:` Tailwind variants for dark theme colors (e.g., `bg-white dark:bg-gray-900`, `text-gray-800 dark:text-gray-100`)
- Hero gradient overlay uses accent color with opacity
- Header scroll behavior via `useEffect` + scroll event listener
- Smooth scrolling via `scroll-behavior: smooth` in global CSS
- Responsive: mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Conditionally render Projects/Experience/Education sections based on config data presence

### Step 5: Update Layout Component

**Files to modify:**

- `src/components/Layout/Layout.tsx`

**Changes:**

- Remove styled-components `Footer` — footer is now a separate component
- Remove `import styled from "styled-components"`
- Keep `<ThemeProvider>` wrapper
- Keep `<ThemeToggle>` (will restyle in Step 6)
- Remove `<BurgerMenu>` (replaced by Header component)
- Render `{children}` in a clean wrapper
- Add Tailwind classes for base layout (`min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors`)

### Step 6: Restyle Existing Components with Tailwind

**Files to modify:**

- `src/components/ThemeToggle/ThemeToggle.tsx` — Replace CSS module import with Tailwind classes; replace inline SVGs with `TablerMoon` / `TablerSun` icon components
- `src/components/ContactForm/ContactForm.tsx` — Replace CSS module import with Tailwind classes
- `src/components/ExternalLink/ExternalLink.tsx` — Minimal changes (keep as is, just ensure Tailwind link styles work)
- `src/components/Head/Head.tsx` — No styling changes needed

**Files to delete:**

- `src/components/ThemeToggle/ThemeToggle.css`
- `src/components/ContactForm/ContactForm.css`
- `src/components/BurgerMenu/BurgerMenu.tsx`
- `src/components/BurgerMenu/BurgerMenu.css`
- `src/components/Article/Article.tsx`
- `src/components/Article/Clients.tsx`
- `src/components/Article/Contact.tsx`
- `src/components/Article/More.tsx`
- `src/components/Article/main.css`
- `src/components/Article/animation.css`
- `src/components/styles/index.css`
- `src/components/styles/reset.css`
- `src/components/styles/typography.css`
- `src/components/styles/links.css`
- `src/styles/theme.css`
- `src/components/icons/Github.tsx` (replaced by Tabler versions)
- `src/components/icons/Email.tsx`
- `src/components/icons/Linkedin.tsx`
- `src/components/icons/Instagram.tsx`

### Step 7: Update Pages

**Files to modify:**

- `src/pages/index.tsx` — Replace `<Article />` with new section components:
  ```tsx
  <Layout>
    <Header />
    <Hero />
    <About />
    <Projects />
    <Experience />
    <Education />
    <Footer />
  </Layout>
  ```
- `src/pages/contact-form.tsx` — Update to use Tailwind-styled ContactForm
- `src/pages/404.tsx` — Restyle with Tailwind classes

### Step 8: Update Theme System for Tailwind Dark Mode

**Files to modify:**

- `src/context/ThemeContext.tsx` — Keep existing logic (localStorage, time-based default, `data-theme` attribute). No changes needed since Tailwind will use `[data-theme="dark"]` selector.
- `src/styles/global.css` — Add dark mode CSS custom property for accent color. Configure Tailwind dark mode to use `selector` strategy with `[data-theme="dark"]`.

**Tailwind dark mode config** (in `global.css` with Tailwind v4):

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

This makes `dark:` utility classes activate when `data-theme="dark"` is set on any ancestor.

### Step 9: Clean Up and Remove Old Dependencies

**Files to modify:**

- `package.json` — Remove: `styled-components`, `gatsby-plugin-styled-components`, `@types/styled-components` (if present). Ensure `gatsby-plugin-postcss` is added.
- `gatsby-config.ts` — Remove `gatsby-plugin-styled-components`, add `gatsby-plugin-postcss`.

**Run:** `npm install` to clean up lock file.

### Step 10: Add Google Font (IBM Plex Mono)

**Files to modify:**

- `src/components/Head/Head.tsx` — Add `<link>` tags for Google Fonts IBM Plex Mono (weights 400, 500, 600, 700 + italic variants)
- Or use `gatsby-plugin-google-fonts` / inline in `gatsby-ssr.tsx`

### Step 11: Update Tests

**Files to modify/create:**

- Update all existing tests to work with new component structure
- Remove tests for deleted components (Article, Clients, More, BurgerMenu)
- Add tests for new components (Hero, About, Projects, Experience, Education, Header, Footer)
- Update Layout tests to reflect new structure
- Update ThemeToggle tests for Tailwind class changes
- Update ContactForm tests for Tailwind class changes

### Step 12: TypeScript & Lint Verification

- Run `npm run typecheck` to verify no type errors
- Run `npm run format` to format all new files
- Run `npm test` to verify all tests pass

---

## Agent Orchestration

| Step         | Agent             | Action                                                                                                                           |
| ------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1-10         | **Main agent**    | Implement all code changes (install deps, create components, update config, delete old files)                                    |
| 11a          | **code-reviewer** | Review all new/modified components for quality, accessibility, Tailwind best practices, TypeScript typing, dark mode correctness |
| 11b          | **test-writer**   | Write unit tests for Hero, About, Projects, Experience, Education, Header, Footer components + update existing tests             |
| 11a + 11b    | _(parallel)_      | Code review and test writing run concurrently                                                                                    |
| 12           | **Main agent**    | Run typecheck + format + tests                                                                                                   |
| 12 (if fail) | **debugger**      | Investigate and fix any typecheck or test failures                                                                               |

---

## Agent Escalation Flow

```
Main Agent (implements all code)
├── code-reviewer (reviews new components, parallel with test-writer)
├── test-writer (writes tests for new components, parallel with code-reviewer)
└── debugger (only if typecheck/tests fail)
```

---

## Implementation Steps (Summary)

1. [x] **[Main]** Install Tailwind CSS v4, PostCSS, gatsby-plugin-postcss. Remove styled-components.
2. [x] **[Main]** Create `postcss.config.js` and `src/styles/global.css` with Tailwind import + dark mode config.
3. [x] **[Main]** Create `src/config.ts` with all site content and placeholder data.
4. [x] **[Main]** Create Tabler Icon components (8 icons as React SVG components): Email, LinkedIn, GitHub, Instagram, Twitter, ArrowUpRight, Moon, Sun.
5. [x] **[Main]** Build Hero component with gradient overlay, programming symbols SVG, social icons, animations.
6. [x] **[Main]** Build About component with two-column grid, bio text, skill tags.
7. [x] **[Main]** Build Projects component with numbered cards.
8. [x] **[Main]** Build Experience component with timeline visualization.
9. [x] **[Main]** Build Education component with cards.
10. [x] **[Main]** Build SiteHeader component with fixed nav + scroll-triggered backdrop blur.
11. [x] **[Main]** Build SiteFooter component with social icons, nav links, copyright, decorative SVG.
12. [x] **[Main]** Update Layout component (remove styled-components, add Tailwind classes, remove BurgerMenu).
13. [x] **[Main]** Restyle ThemeToggle with Tailwind classes + TablerMoon/TablerSun (delete old CSS).
14. [x] **[Main]** Restyle ContactForm with Tailwind classes (delete old CSS).
15. [x] **[Main]** Update `index.tsx` page to compose new section components.
16. [x] **[Main]** Update `contact-form.tsx` and `404.tsx` pages.
17. [x] **[Main]** Update `gatsby-config.ts` (remove styled-components plugin, add postcss plugin).
18. [x] **[Main]** Update `gatsby-browser.ts` and `gatsby-ssr.ts` for global CSS import.
19. [x] **[Main]** Add IBM Plex Mono Google Font via Head component.
20. [x] **[Main]** Delete all old CSS files, old Article subsections, old icon components, BurgerMenu (incl. orphaned font files).
21. [x] **[Main]** Update ThemeContext dark mode to work with Tailwind `@custom-variant`.
22. [x] **[code-reviewer, parallel]** Review all new/modified files for quality and best practices.
23. [x] **[test-writer, parallel]** Write tests for all new components; update existing tests.
24. [x] **[Main]** Run `npm run typecheck`, `npm run format`, `npm test` — all pass (111 tests, 0 type errors).
25. [x] **[debugger]** _(Only if needed.)_ Fix any typecheck or test failures — ESLint errors in 4 test files fixed post-review.
