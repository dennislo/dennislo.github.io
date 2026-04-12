import React from "react";
import { render, screen } from "@testing-library/react";
import type { PageProps } from "gatsby";
import NotFoundPage, { Head } from "./404";

jest.mock("gatsby", () => ({
  Link: function MockLink({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) {
    return <a href={to}>{children}</a>;
  },
}));

const mockLocation: PageProps["location"] = {
  pathname: "/404/",
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
  path: "/404/",
  uri: "/404/",
  location: mockLocation,
  children: undefined,
  params: {},
  serverData: {},
  pageResources: {
    component: new MockPageComponent({}),
    json: { data: {}, pageContext: {} },
    page: {
      componentChunkName: "component---src-pages-404-tsx",
      path: "/404/",
      webpackCompilationHash: "test-hash",
    },
  },
  data: {},
  pageContext: {},
};

describe("NotFoundPage", () => {
  it("renders page not found heading", () => {
    render(<NotFoundPage />);
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("renders apology message", () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/Sorry/)).toBeInTheDocument();
  });

  it("renders go home link", () => {
    render(<NotFoundPage />);
    const link = screen.getByRole("link", { name: "Go home" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the page head title", () => {
    const { container } = render(<Head {...mockPageProps} />);
    expect(container.querySelector("title")).toHaveTextContent("Not found");
  });
});
