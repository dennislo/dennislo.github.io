import React from "react";
import { render, screen } from "@testing-library/react";
import type { PageProps } from "gatsby";
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

const mockLocation: PageProps["location"] = {
  pathname: "/",
  search: "",
  hash: "",
  href: "",
  origin: "",
  protocol: "",
  host: "",
  hostname: "",
  port: "",
  state: null,
  key: "",
  ancestorOrigins: {} as DOMStringList,
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
};

class MockPageComponent extends React.Component {
  render() {
    return null;
  }
}

const mockPageProps: PageProps = {
  path: "/",
  uri: "/",
  location: mockLocation,
  children: undefined,
  params: {},
  serverData: {},
  pageResources: {
    component: new MockPageComponent({}),
    json: { data: {}, pageContext: {} },
    page: {
      componentChunkName: "component---src-pages-index-tsx",
      path: "/",
      webpackCompilationHash: "test-hash",
    },
  },
  data: {},
  pageContext: {},
};

describe("IndexPage", () => {
  it("renders the Layout component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByLabelText("Layout")).toBeInTheDocument();
  });

  it("renders the SiteHeader component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByLabelText("SiteHeader")).toBeInTheDocument();
  });

  it("renders the Hero component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByLabelText("Hero")).toBeInTheDocument();
  });

  it("renders the About component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByLabelText("About")).toBeInTheDocument();
  });

  it("renders the Projects component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByLabelText("Projects")).toBeInTheDocument();
  });

  it("renders the Experience component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByLabelText("Experience")).toBeInTheDocument();
  });

  it("renders the Education component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByLabelText("Education")).toBeInTheDocument();
  });

  it("renders the SiteFooter component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByLabelText("SiteFooter")).toBeInTheDocument();
  });

  it("renders the page head title", () => {
    const { container } = render(<Head />);
    expect(container.querySelector("title")).toHaveTextContent("Who is DLO?");
  });
});
