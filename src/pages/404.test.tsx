import React from "react";
import { render, screen } from "@testing-library/react";
import NotFoundPage from "./404";

jest.mock("gatsby", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

const mockPageProps: any = {
  path: "/404/",
  uri: "/404/",
  location: {
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
  },
  pageResources: {},
  data: {},
  pageContext: {},
};

describe("NotFoundPage", () => {
  it("renders page not found heading", () => {
    render(<NotFoundPage {...mockPageProps} />);
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("renders apology message", () => {
    render(<NotFoundPage {...mockPageProps} />);
    expect(screen.getByText(/Sorry/)).toBeInTheDocument();
  });

  it("renders go home link", () => {
    render(<NotFoundPage {...mockPageProps} />);
    const link = screen.getByRole("link", { name: "Go home" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
