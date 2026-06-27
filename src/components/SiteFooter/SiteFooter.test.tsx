import React from "react";
import { render, screen } from "@testing-library/react";
import SiteFooter from "./SiteFooter";
import { siteConfig } from "../../config";

// Mock gatsby's Link so it renders as a plain anchor in jsdom
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

describe("SiteFooter", () => {
  it("renders the site name from siteConfig", () => {
    render(<SiteFooter />);
    // The name appears in a bold <p> and also in the copyright line; use getAllByText
    const matches = screen.getAllByText(siteConfig.name, { exact: true });
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders the title from siteConfig", () => {
    render(<SiteFooter />);
    expect(screen.getByText(siteConfig.title)).toBeInTheDocument();
  });

  it("renders the email social link with correct aria-label", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", { name: "Email Dennis Lo" });
    expect(link).toBeInTheDocument();
    // The email icon should navigate to the internal contact form, not open a mail client
    expect(link).toHaveAttribute("href", "/contact-form");
  });

  it("renders the GitHub social link with correct aria-label", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", { name: "Dennis Lo on GitHub" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.github);
  });

  it("renders the LinkedIn social link with correct aria-label", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", { name: "Dennis Lo on LinkedIn" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.linkedin);
  });

  it("renders the Instagram social link with correct aria-label", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", { name: "Dennis Lo on Instagram" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", siteConfig.social.instagram);
  });

  it("renders the About nav link", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("renders the Projects nav link", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
  });

  it("renders the Experience nav link", () => {
    render(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: "Experience" }),
    ).toBeInTheDocument();
  });

  it("renders the Education nav link", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Education" })).toBeInTheDocument();
  });

  it("renders the Contact nav link pointing to /contact-form", () => {
    render(<SiteFooter />);
    // "Contact" is unique: the email icon link's accessible name is "Email Dennis Lo" (sr-only span)
    expect(
      screen.getByRole("link", { name: "Contact" }),
    ).toHaveAttribute("href", "/contact-form");
  });

  it("renders copyright text with the current year", () => {
    render(<SiteFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });
});
