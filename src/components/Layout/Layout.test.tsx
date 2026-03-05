import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "./Layout";

// Prevent ThemeProvider's localStorage/DOM side-effects from interfering
jest.mock("../../context/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTheme: () => ({ theme: "light", toggleTheme: jest.fn() }),
}));

jest.mock("../ThemeToggle/ThemeToggle", () => ({
  __esModule: true,
  default: () => <button>Theme Toggle</button>,
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

  it("renders the ThemeToggle component", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );
    expect(
      screen.getByRole("button", { name: "Theme Toggle" }),
    ).toBeInTheDocument();
  });

  it("wraps children inside a div container", () => {
    const { container } = render(
      <Layout>
        <p>Inner</p>
      </Layout>,
    );
    // The outer ThemeProvider wrapper renders a div; inside it is Layout's own div
    expect(container.querySelector("div")).toBeInTheDocument();
    expect(screen.getByText("Inner")).toBeInTheDocument();
  });
});
