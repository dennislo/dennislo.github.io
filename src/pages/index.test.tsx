import React from "react";
import { render, screen } from "@testing-library/react";
import IndexPage, { Head } from "./index";
import { enGB } from "../i18n/translations/en-GB";
import { renderWithLocale } from "../test/renderWithLocale";
import { getDictionary } from "../i18n/dictionaries";
import { siteConfig } from "../config";

jest.mock("../components/Layout/Layout", () => ({
  __esModule: true,
  default: function MockLayout({ children }: { children: React.ReactNode }) {
    return <div aria-label="Layout">{children}</div>;
  },
}));

jest.mock("../components/SiteHeader/SiteHeader", () => ({
  __esModule: true,
  default: function MockSiteHeader() {
    return <header aria-label="SiteHeader">Site Header</header>;
  },
}));

jest.mock("../components/Hero/Hero", () => ({
  __esModule: true,
  default: function MockHero() {
    return <section aria-label="Hero">Hero Section</section>;
  },
}));

jest.mock("../components/About/About", () => ({
  __esModule: true,
  default: function MockAbout() {
    // Render a localized heading so the locale assertion below can find it
    return (
      <section aria-label="About">
        <h2>About Section</h2>
      </section>
    );
  },
}));

jest.mock("../components/Projects/Projects", () => ({
  __esModule: true,
  default: function MockProjects() {
    return <section aria-label="Projects">Projects Section</section>;
  },
}));

jest.mock("../components/GitHubActivity/GitHubActivity", () => ({
  __esModule: true,
  default: function MockGitHubActivity() {
    return (
      <section aria-label="GitHubActivity">GitHub Activity Section</section>
    );
  },
}));

jest.mock("../components/Experience/Experience", () => ({
  __esModule: true,
  default: function MockExperience() {
    return <section aria-label="Experience">Experience Section</section>;
  },
}));

jest.mock("../components/Education/Education", () => ({
  __esModule: true,
  default: function MockEducation() {
    return <section aria-label="Education">Education Section</section>;
  },
}));

jest.mock("../components/SiteFooter/SiteFooter", () => ({
  __esModule: true,
  default: function MockSiteFooter() {
    return <footer aria-label="SiteFooter">Site Footer</footer>;
  },
}));

describe("IndexPage", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders the Layout component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
  });

  it("renders the SiteHeader component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("SiteHeader")).toBeInTheDocument();
  });

  it("renders the Hero component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("Hero")).toBeInTheDocument();
  });

  it("renders the About component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("About")).toBeInTheDocument();
  });

  it("renders the Projects component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("Projects")).toBeInTheDocument();
  });

  it("renders the GitHubActivity component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("GitHubActivity")).toBeInTheDocument();
  });

  it("renders the Experience component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("Experience")).toBeInTheDocument();
  });

  it("renders the Education component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("Education")).toBeInTheDocument();
  });

  it("renders the SiteFooter component", () => {
    render(<IndexPage />);
    expect(screen.getByLabelText("SiteFooter")).toBeInTheDocument();
  });

  it("renders the page head title", () => {
    render(<Head />);
    expect(document.title).toBe("Who is DLO?");
  });

  it("renders alternate Markdown link in head", () => {
    render(<Head />);
    const link = document.head.querySelector(
      'link[rel="alternate"][type="text/markdown"]',
    ) as HTMLLinkElement | null;
    expect(link).toBeInTheDocument();
    expect(link?.href).toContain("/index.md");
  });

  it("renders through LocaleProvider and shows the page structure", () => {
    // Wrap with LocaleProvider as wrapPageElement does at runtime
    renderWithLocale(<IndexPage />);
    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
    expect(screen.getByLabelText("About")).toBeInTheDocument();
  });

  it("renders correctly when wrapped with en-GB LocaleProvider", () => {
    renderWithLocale(<IndexPage />, "en-GB");
    // The page composes all sections; verify the primary shell is present
    expect(screen.getByLabelText("SiteHeader")).toBeInTheDocument();
    expect(screen.getByLabelText("SiteFooter")).toBeInTheDocument();
  });

  it("renders correctly when wrapped with zh-Hans LocaleProvider", () => {
    renderWithLocale(<IndexPage />, "zh-Hans");
    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
    expect(screen.getByLabelText("Education")).toBeInTheDocument();
  });

  it("a localized section heading key is present in enGB dict", () => {
    // Verify the dict has the expected heading key so the i18n wiring is testable
    expect(enGB.about.heading).toBe("About Me");
    expect(enGB.projects.heading).toBe("Projects");
    expect(enGB.experience.heading).toBe("Experience");
  });
});

describe("IndexPage Head — localized SEO", () => {
  // Cast to any so TypeScript accepts the not-yet-implemented pageContext/location props.
  // Runtime assertions will fail (RED) until the engineer implements them.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LocalizedHead = Head as React.ComponentType<any>;

  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("renders localized title from zh-Hans dictionary when pageContext.locale=zh-Hans", () => {
    // The new contract: Head accepts pageContext and location props
    render(
      <LocalizedHead
        pageContext={{ locale: "zh-Hans" }}
        location={{ pathname: "/zh-Hans/" }}
      />,
    );
    const zhHansDict = getDictionary("zh-Hans");
    expect(document.querySelector("title")?.textContent).toBe(
      zhHansDict.seo.siteTitle,
    );
  });

  it("emits canonical href https://dlo.wtf/zh-Hans/ when pageContext.locale=zh-Hans and pathname=/zh-Hans/", () => {
    render(
      <LocalizedHead
        pageContext={{ locale: "zh-Hans" }}
        location={{ pathname: "/zh-Hans/" }}
      />,
    );
    const canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute("href")).toBe(
      `${siteConfig.siteUrl}/zh-Hans/`,
    );
  });
});
