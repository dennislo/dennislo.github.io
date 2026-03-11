import React from "react";
import { render, screen } from "@testing-library/react";
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
    const HeadComponent = Head as () => React.ReactElement;
    const { container } = render(<HeadComponent />);
    expect(container.querySelector("title")).toHaveTextContent("Not found");
  });
});
