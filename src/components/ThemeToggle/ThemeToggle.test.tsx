import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "../../context/ThemeContext";
import { mockDate } from "../../test/test-utils";
import { enGB } from "../../i18n/translations/en-GB";
import { renderWithLocale } from "../../test/renderWithLocale";

// Wrap with both LocaleProvider (outer) and ThemeProvider (inner)
function renderThemeToggle(
  locale: Parameters<typeof renderWithLocale>[1] = "en-GB",
) {
  return renderWithLocale(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
    locale,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the theme toggle button", () => {
    mockDate(22, 0); // 10 PM — dark
    renderThemeToggle();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has the localized aria-label when in dark mode (offering to switch to light) from enGB dict", () => {
    mockDate(22, 0); // 10 PM — dark
    renderThemeToggle();
    expect(
      screen.getByRole("button", { name: enGB.themeToggle.switchToLight }),
    ).toBeInTheDocument();
  });

  it("has the localized aria-label when in light mode (offering to switch to dark) from enGB dict", () => {
    mockDate(10, 0); // 10 AM — light
    renderThemeToggle();
    expect(
      screen.getByRole("button", { name: enGB.themeToggle.switchToDark }),
    ).toBeInTheDocument();
  });

  it("renders the moon icon when theme is light", () => {
    mockDate(10, 0); // 10 AM — light
    renderThemeToggle();
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
  });

  it("renders the sun icon when theme is dark", () => {
    mockDate(22, 0); // 10 PM — dark
    renderThemeToggle();
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("calls toggleTheme and switches localized aria-label on click", async () => {
    mockDate(22, 0); // 10 PM — dark
    const user = userEvent.setup();
    renderThemeToggle();
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute(
      "aria-label",
      enGB.themeToggle.switchToLight,
    );

    await user.click(button);
    expect(button).toHaveAttribute("aria-label", enGB.themeToggle.switchToDark);
  });
});
