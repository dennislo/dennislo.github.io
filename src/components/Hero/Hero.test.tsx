import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { siteConfig } from "../../config";
import { useTheme } from "../../context/ThemeContext";

jest.mock("../../context/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe("Hero", () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      toggleTheme: jest.fn(),
    });
  });

  it("renders the greeting", () => {
    render(<Hero />);
    expect(screen.getByText(/Hello!/)).toBeInTheDocument();
  });

  it("renders the name from siteConfig", () => {
    render(<Hero />);
    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
  });

  it("renders the title from siteConfig", () => {
    render(<Hero />);
    expect(screen.getByText(siteConfig.title)).toBeInTheDocument();
  });

  it("renders the email link with correct aria-label and href", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: "Email Dennis Lo" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `mailto:${siteConfig.social.email}`);
  });

  it("renders the GitHub link with correct aria-label and href", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: "Dennis Lo on GitHub" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.github);
  });

  it("renders the LinkedIn link with correct aria-label and href", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: "Dennis Lo on LinkedIn" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.linkedin);
  });

  it("renders the Instagram link with correct aria-label and href", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: "Dennis Lo on Instagram" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.instagram);
  });

  it("uses light theme overlay and symbol styling by default", () => {
    const { container } = render(<Hero />);

    const overlay = container.querySelector(".absolute.inset-0.-z-10");
    const svg = container.querySelector("svg");
    const symbolRect = container.querySelector(
      'rect[fill="url(#programming-symbols)"]',
    );
    const symbol = container.querySelector("#programming-symbols text");

    expect(overlay).toHaveStyle({
      background: `radial-gradient(ellipse 800px 1200px at 0% 0%, ${siteConfig.accentColor}40 0%, ${siteConfig.accentColor}25 20%, ${siteConfig.accentColor}10 40%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0.8) 90%, white 100%)`,
    });
    expect(svg).toHaveStyle({
      color: `${siteConfig.accentColor}b8`,
      stroke: "#c9d2dc",
    });
    expect(symbolRect).toHaveAttribute("opacity", "0.24");
    expect(symbol).toHaveAttribute("fill", "currentColor");
  });

  it("uses dark theme overlay and dimmer symbol styling in dark mode", () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      toggleTheme: jest.fn(),
    });

    const { container } = render(<Hero />);

    const overlay = container.querySelector(".absolute.inset-0.-z-10");
    const svg = container.querySelector("svg");
    const symbolRect = container.querySelector(
      'rect[fill="url(#programming-symbols)"]',
    );
    const gridRect = container.querySelector('rect[fill="url(#grid-pattern)"]');

    expect(overlay).toHaveStyle({
      background: `radial-gradient(ellipse 800px 1200px at 0% 0%, ${siteConfig.accentColor}33 0%, ${siteConfig.accentColor}1f 20%, ${siteConfig.accentColor}14 40%, rgba(17,24,39,0.45) 70%, rgba(3,7,18,0.78) 90%, #030712 100%)`,
    });
    expect(svg).toHaveStyle({
      color: `${siteConfig.accentColor}94`,
      stroke: "#5b6673",
    });
    expect(symbolRect).toHaveAttribute("opacity", "0.2");
    expect(gridRect).not.toHaveAttribute("opacity");
  });
});
