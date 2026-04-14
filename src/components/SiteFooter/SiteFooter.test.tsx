import React from "react";
import { render, screen } from "@testing-library/react";
import SiteFooter from "./SiteFooter";
import { siteConfig } from "../../config";

// Mock gatsby's Link so it renders as a plain anchor in jsdom
jest.mock("gatsby", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
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
    expect(link).toHaveAttribute("href", "mailto:lo.dennis@gmail.com");
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

  it("renders copyright text with the current year", () => {
    render(<SiteFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });
});
