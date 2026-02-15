import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides default theme as dark", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("toggles theme from dark to light", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("throws error when useTheme is used outside ThemeProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
    spy.mockRestore();
  });
});
