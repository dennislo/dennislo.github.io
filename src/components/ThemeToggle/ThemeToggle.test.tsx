import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "../../context/ThemeContext";

describe("ThemeToggle", () => {
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

  it("displays moon icon in light mode", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
