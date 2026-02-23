import React from "react";
import { render, screen } from "@testing-library/react";
import type { PageProps } from "gatsby";
import IndexPage from "./index";

jest.mock("../components/Layout/Layout", () => ({
  __esModule: true,
  default: function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  },
}));

jest.mock("../components/Article/Article", () => ({
  __esModule: true,
  default: function MockArticle() {
    return <div data-testid="article">Article Content</div>;
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
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("renders the Article component", () => {
    render(<IndexPage {...mockPageProps} />);
    expect(screen.getByTestId("article")).toBeInTheDocument();
  });
});
