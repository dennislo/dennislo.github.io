import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "../../context/ThemeContext";
import { mockDate } from "../../test/test-utils";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the theme toggle button", () => {
    mockDate(22, 0); // 10 PM — dark
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has the correct aria-label when in dark mode (offering to switch to light)", () => {
    mockDate(22, 0); // 10 PM — dark
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("has the correct aria-label when in light mode (offering to switch to dark)", () => {
    mockDate(10, 0); // 10 AM — light
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });

  it("renders the moon icon when theme is light", () => {
    mockDate(10, 0); // 10 AM — light
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
  });

  it("renders the sun icon when theme is dark", () => {
    mockDate(22, 0); // 10 PM — dark
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("calls toggleTheme and switches aria-label on click", async () => {
    mockDate(22, 0); // 10 PM — dark
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
});
