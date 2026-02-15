import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "./Layout";

jest.mock("gatsby", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock("../ThemeToggle/ThemeToggle", () => ({
  __esModule: true,
  default: () => <button data-testid="theme-toggle">Theme Toggle</button>,
}));

describe("Layout", () => {
  it("renders children content", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders ThemeToggle component", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders footer with copyright", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName === "FOOTER" && content.includes(`© ${currentYear}`)
        );
      }),
    ).toBeInTheDocument();
  });

  it("renders Gatsby link in footer", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );
    const link = screen.getByRole("link", { name: "Gatsby.js" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://www.gatsbyjs.org/");
  });
});
