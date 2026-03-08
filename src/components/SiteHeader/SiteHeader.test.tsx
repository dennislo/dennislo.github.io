import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteHeader from "./SiteHeader";
import { siteConfig } from "../../config";

describe("SiteHeader", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  it("renders the site header text from siteConfig", () => {
    render(<SiteHeader />);
    expect(screen.getByText(siteConfig.header)).toBeInTheDocument();
  });

  it("renders the About nav link", () => {
    render(<SiteHeader />);
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#about");
  });

  it("renders the Projects nav link", () => {
    render(<SiteHeader />);
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#projects");
  });

  it("renders the Experience nav link", () => {
    render(<SiteHeader />);
    const link = screen.getByRole("link", { name: "Experience" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#experience");
  });

  it("renders the Education nav link", () => {
    render(<SiteHeader />);
    const link = screen.getByRole("link", { name: "Education" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#education");
  });

  it("renders a nav element", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
  });

  it("opens the mobile menu so nav links are reachable", async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "About" })).toBeInTheDocument();

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "#about",
    );
  });

  it("closes the mobile menu when escape is pressed", async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toBeInTheDocument();
  });

  it("resets the mobile menu when returning to desktop width", async () => {
    const user = userEvent.setup();

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 390,
    });

    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1024,
    });

    fireEvent(window, new Event("resize"));

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toBeInTheDocument();
  });

  it("updates the header style after scrolling", () => {
    const { container } = render(<SiteHeader />);
    const header = container.querySelector("header");

    expect(header).toHaveClass("bg-transparent");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 120,
    });

    fireEvent.scroll(window);

    expect(header).toHaveClass("bg-white/80");
    expect(header).toHaveClass("backdrop-blur-sm");
  });
});
