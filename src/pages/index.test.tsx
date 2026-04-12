import React from "react";
import { render, screen } from "@testing-library/react";
import IndexPage, { Head } from "./index";

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
    return <section aria-label="About">About Section</section>;
  },
}));

jest.mock("../components/Projects/Projects", () => ({
  __esModule: true,
  default: function MockProjects() {
    return <section aria-label="Projects">Projects Section</section>;
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
    const { container } = render(<Head />);
    expect(container.querySelector("title")).toHaveTextContent("Who is DLO?");
    const alternate = container.querySelector(
      'link[rel="alternate"][type="text/markdown"]',
    );
    expect(alternate).toHaveAttribute("href", "/index.md");
  });
});
