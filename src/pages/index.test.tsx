import React from "react";
import { render, screen } from "@testing-library/react";
import IndexPage from "./index";

jest.mock("../components/Layout/Layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock("../components/Article/Article", () => ({
  __esModule: true,
  default: () => <div data-testid="article">Article Content</div>,
}));

const mockPageProps: any = {
  path: "/",
  uri: "/",
  location: {
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
  },
  pageResources: {},
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
