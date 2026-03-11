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
    // TablerMoon renders an SVG with a moon path — verify an svg is present inside the button
    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeInTheDocument();
    // The moon path has a unique arc shape; verify it appears and sun's circle path does not
    const paths = button.querySelectorAll("path");
    const pathStrings = Array.from(paths).map((p) => p.getAttribute("d") ?? "");
    const hasMoonPath = pathStrings.some((d) => d.includes("7.92 12.446"));
    expect(hasMoonPath).toBe(true);
  });

  it("renders the sun icon when theme is dark", () => {
    mockDate(22, 0); // 10 PM — dark
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeInTheDocument();
    // The sun path has a unique circle definition; verify it appears
    const paths = button.querySelectorAll("path");
    const pathStrings = Array.from(paths).map((p) => p.getAttribute("d") ?? "");
    const hasSunPath = pathStrings.some((d) => d.includes("m-4 0a4 4"));
    expect(hasSunPath).toBe(true);
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
