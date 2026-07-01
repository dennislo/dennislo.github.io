import React from "react";
import { screen } from "@testing-library/react";
import Hero from "./Hero";
import { routes, siteConfig } from "../../config";
import { useTheme } from "../../context/ThemeContext";
import { enGB } from "../../i18n/translations/en-GB";
import { zhHans } from "../../i18n/translations/zh-Hans";
import { renderWithLocale } from "../../test/renderWithLocale";

// Mock gatsby's Link so it renders as a plain anchor in jsdom
jest.mock("gatsby", () => ({
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={to} {...(rest as React.ComponentProps<"a">)}>
      {children}
    </a>
  ),
}));

jest.mock("../../context/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe("Hero (en-GB, default locale)", () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      toggleTheme: jest.fn(),
    });
  });

  it("renders the localized greeting from enGB dict", () => {
    renderWithLocale(<Hero />);
    expect(
      screen.getByText(new RegExp(enGB.hero.greeting)),
    ).toBeInTheDocument();
  });

  it("renders the localized intro text from enGB dict", () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText(new RegExp(enGB.hero.intro))).toBeInTheDocument();
  });

  it("renders the name from siteConfig (locale-invariant)", () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
  });

  it("renders the title from siteConfig (locale-invariant)", () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText(siteConfig.title)).toBeInTheDocument();
  });

  it("renders the localized contact aria-label from enGB dict", () => {
    renderWithLocale(<Hero />);
    const link = screen.getByRole("link", { name: enGB.hero.contactAriaLabel });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", routes.contactForm);
  });

  it("renders the localized GitHub aria-label from enGB dict", () => {
    renderWithLocale(<Hero />);
    const link = screen.getByRole("link", { name: enGB.hero.githubAriaLabel });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.github);
  });

  it("renders the localized LinkedIn aria-label from enGB dict", () => {
    renderWithLocale(<Hero />);
    const link = screen.getByRole("link", {
      name: enGB.hero.linkedinAriaLabel,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.linkedin);
  });

  it("renders the localized Instagram aria-label from enGB dict", () => {
    renderWithLocale(<Hero />);
    const link = screen.getByRole("link", {
      name: enGB.hero.instagramAriaLabel,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.instagram);
  });

  it("renders the Meet social icon immediately after Contact", () => {
    renderWithLocale(<Hero />);

    const links = screen.getAllByRole("link");
    const names = links.map((link) => link.getAttribute("aria-label"));
    const contactIndex = names.indexOf(enGB.hero.contactAriaLabel);
    const meetIndex = names.indexOf(enGB.hero.meetAriaLabel);

    expect(meetIndex).toBe(contactIndex + 1);
    expect(links[meetIndex]).toHaveAttribute("href", routes.meet);
  });

  it("uses light theme overlay and symbol styling by default", () => {
    const { container } = renderWithLocale(<Hero />);

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

    const { container } = renderWithLocale(<Hero />);

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

describe("Hero (zh-Hans locale)", () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      toggleTheme: jest.fn(),
    });
  });

  it("renders the localized greeting in Chinese", () => {
    renderWithLocale(<Hero />, "zh-Hans");
    expect(
      screen.getByText(new RegExp(zhHans.hero.greeting)),
    ).toBeInTheDocument();
  });

  it("does NOT render the English greeting when locale is zh-Hans", () => {
    renderWithLocale(<Hero />, "zh-Hans");
    // enGB greeting is "Hello!" — should not appear
    expect(
      screen.queryByText(new RegExp(enGB.hero.greeting)),
    ).not.toBeInTheDocument();
  });

  it("renders the localized contact aria-label in Chinese", () => {
    renderWithLocale(<Hero />, "zh-Hans");
    const link = screen.getByRole("link", {
      name: zhHans.hero.contactAriaLabel,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/zh-Hans/contact-form");
  });

  it("renders the localized Meet aria-label in Chinese", () => {
    renderWithLocale(<Hero />, "zh-Hans");
    const link = screen.getByRole("link", {
      name: zhHans.hero.meetAriaLabel,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/zh-Hans/meet");
  });

  it("name remains locale-invariant in zh-Hans", () => {
    renderWithLocale(<Hero />, "zh-Hans");
    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
  });
});
