import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot } from "react-dom/client";
import { getTimeBasedTheme, ThemeProvider, useTheme } from "./ThemeContext";
import { mockDate } from "../test/test-utils";

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span role="status" aria-live="polite">
        {theme}
      </span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe("getTimeBasedTheme", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 'light' during daytime (12:00 PM)", () => {
    mockDate(12, 0); // noon → 720 minutes, within [450, 1170)
    expect(getTimeBasedTheme()).toBe("light");
  });

  it("returns 'dark' at night (10:00 PM)", () => {
    mockDate(22, 0); // 22:00 → 1320 minutes, outside [450, 1170)
    expect(getTimeBasedTheme()).toBe("dark");
  });

  it("returns 'light' at exactly 7:30 AM (boundary — inclusive start)", () => {
    mockDate(7, 30); // 7*60+30 = 450 minutes — equals startLight, >= is true
    expect(getTimeBasedTheme()).toBe("light");
  });

  it("returns 'dark' at exactly 7:30 PM (boundary — exclusive end)", () => {
    mockDate(19, 30); // 19*60+30 = 1170 minutes — equals endLight, < is false
    expect(getTimeBasedTheme()).toBe("dark");
  });
});

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    // Default to nighttime so existing tests that expect 'dark' are deterministic.
    mockDate(22, 0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("provides default theme as dark", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("dark");
  });

  it("toggles theme from dark to light", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(screen.getByRole("status")).toHaveTextContent("light");
  });

  it("throws error when useTheme is used outside ThemeProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
    spy.mockRestore();
  });

  it("uses time-based theme when no localStorage is set (daytime -> light)", () => {
    // Override the default nighttime mock with daytime.
    jest.restoreAllMocks();
    mockDate(12, 0);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("light");
  });

  it("saves theme-source as 'manual' and saves the new theme to localStorage on toggle", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button"));

    expect(localStorage.getItem("theme-source")).toBe("manual");
    // Started at dark (nighttime mock), toggled to light.
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("uses saved manual theme from localStorage instead of time-based theme", () => {
    // Daytime mock would normally produce 'light', but the saved manual
    // theme is 'dark' — the saved preference should win.
    jest.restoreAllMocks();
    mockDate(12, 0);

    localStorage.setItem("theme-source", "manual");
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("dark");
  });

  it("ignores invalid localStorage theme value and falls back to time-based theme", () => {
    // theme-source is 'manual' but the stored value is not a valid Theme
    localStorage.setItem("theme-source", "manual");
    localStorage.setItem("theme", "invalid-value");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // VALID_THEMES guard rejects 'invalid-value', falls back to getTimeBasedTheme()
    // Nighttime mock (22:00) is active -> should resolve to 'dark'
    expect(screen.getByRole("status")).toHaveTextContent("dark");
  });

  it("uses time-based theme when theme-source is not 'manual'", () => {
    // theme-source is absent — should fall through to getTimeBasedTheme().
    // Nighttime mock is already active (set in beforeEach).
    localStorage.setItem("theme", "light"); // saved theme exists but source is not 'manual'

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Even though a 'theme' value is stored, without theme-source === 'manual'
    // the provider ignores it and uses time-based (dark at 22:00).
    expect(screen.getByRole("status")).toHaveTextContent("dark");
  });

  it("hydrates manual light mode without SSR/client mismatch", async () => {
    mockDate(12, 0);
    localStorage.setItem("theme-source", "manual");
    localStorage.setItem("theme", "light");

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const container = document.createElement("div");
    container.innerHTML =
      '<div><span role="status" aria-live="polite">dark</span><button>Toggle</button></div>';
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(
        container,
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(screen.getByRole("status")).toHaveTextContent("light");
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
    container.remove();
  });
});
