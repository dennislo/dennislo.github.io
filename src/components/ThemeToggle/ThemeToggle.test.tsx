import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "../../context/ThemeContext";
import { mockDate } from "../../test/test-utils";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    mockDate(22, 0); // 10 PM — dark
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the theme toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("toggles theme when clicked", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to light mode");

    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  it("shows aria-label offering to switch to light mode when theme is dark", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });
});
