import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteHeader from "./SiteHeader";
import { siteConfig } from "../../config";

// Mock gatsby's Link so it renders as a plain anchor in jsdom (same pattern as SiteFooter.test.tsx)
// Spread ...rest so that onClick, aria-label, className, etc. are forwarded to the anchor.
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

describe("SiteHeader", () => {
  const getDesktopNav = () => {
    const navigation = screen.getByRole("navigation", { name: "Primary" });
    const desktopNavList = within(navigation).getByRole("list");

    expect(desktopNavList).toHaveClass("hidden");
    expect(desktopNavList).toHaveClass("md:flex");

    return desktopNavList;
  };

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

    const link = within(getDesktopNav()).getByRole("link", {
      name: "About",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#about");
  });

  it("renders the Projects nav link", () => {
    render(<SiteHeader />);

    const link = within(getDesktopNav()).getByRole("link", {
      name: "Projects",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#projects");
  });

  it("renders the Activity nav link", () => {
    render(<SiteHeader />);

    const link = within(getDesktopNav()).getByRole("link", {
      name: "Activity",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#github-activity");
  });

  it("renders the Experience nav link", () => {
    render(<SiteHeader />);

    const link = within(getDesktopNav()).getByRole("link", {
      name: "Experience",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#experience");
  });

  it("renders the Education nav link", () => {
    render(<SiteHeader />);

    const link = within(getDesktopNav()).getByRole("link", {
      name: "Education",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#education");
  });

  it("renders the Gists nav link as an external link in the desktop nav", () => {
    render(<SiteHeader />);

    const link = within(getDesktopNav()).getByRole("link", { name: "Gists" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://gist.github.com/dennislo/public",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a Contact nav link pointing to /contact-form in both desktop and mobile", async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    // Open the mobile menu so both desktop and mobile Contact links are in the a11y tree
    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    // Both the desktop nav link and the mobile menu link should be present
    const allContactLinks = screen.getAllByRole("link", { name: "Contact" });
    expect(allContactLinks).toHaveLength(2);
    allContactLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/contact-form");
    });
  });

  it("renders the Contact link in the desktop nav list", () => {
    render(<SiteHeader />);

    const desktopContactLink = within(getDesktopNav()).getByRole("link", {
      name: "Contact",
    });
    expect(desktopContactLink).toBeInTheDocument();
    expect(desktopContactLink).toHaveAttribute("href", "/contact-form");
  });

  it("renders the Contact link in the mobile menu", async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const mobileMenu = screen.getByRole("region", {
      name: "Mobile primary menu",
    });
    const mobileContactLink = within(mobileMenu).getByRole("link", {
      name: "Contact",
    });
    expect(mobileContactLink).toBeInTheDocument();
    expect(mobileContactLink).toHaveAttribute("href", "/contact-form");
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
    expect(
      screen.queryByRole("region", { name: "Mobile primary menu" }),
    ).not.toBeInTheDocument();

    await user.click(menuButton);

    const mobileMenu = screen.getByRole("region", {
      name: "Mobile primary menu",
    });
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(mobileMenu).toBeVisible();
    expect(
      within(mobileMenu).getByRole("link", { name: "About" }),
    ).toHaveAttribute("href", "#about");
  });

  it("renders the Gists link in the mobile menu as an external link", async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const mobileMenu = screen.getByRole("region", {
      name: "Mobile primary menu",
    });
    const link = within(mobileMenu).getByRole("link", { name: "Gists" });
    expect(link).toHaveAttribute(
      "href",
      "https://gist.github.com/dennislo/public",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("closes the mobile menu after clicking the Gists external link", async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const mobileMenu = screen.getByRole("region", {
      name: "Mobile primary menu",
    });

    await user.click(within(mobileMenu).getByRole("link", { name: "Gists" }));

    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: "Mobile primary menu" }),
    ).not.toBeInTheDocument();
  });

  it("closes the mobile menu after clicking the mobile Contact route link", async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const mobileMenu = screen.getByRole("region", {
      name: "Mobile primary menu",
    });

    // The Contact link is a Gatsby <Link> (route type); onClick forwarding via Change A closes the menu
    await user.click(
      within(mobileMenu).getByRole("link", { name: "Contact" }),
    );

    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: "Mobile primary menu" }),
    ).not.toBeInTheDocument();
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
      screen.queryByRole("region", { name: "Mobile primary menu" }),
    ).not.toBeInTheDocument();
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
      screen.queryByRole("region", { name: "Mobile primary menu" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toBeInTheDocument();
  });

  it("closes the mobile menu after choosing a link", async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const mobileMenu = screen.getByRole("region", {
      name: "Mobile primary menu",
    });

    await user.click(within(mobileMenu).getByRole("link", { name: "About" }));

    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("region", { name: "Mobile primary menu" }),
    ).not.toBeInTheDocument();
  });

  it("updates the header style after scrolling", () => {
    render(<SiteHeader />);
    const header = screen.getByRole("banner");

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
