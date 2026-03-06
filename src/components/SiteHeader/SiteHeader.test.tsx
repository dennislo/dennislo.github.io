import React from "react";
import { render, screen } from "@testing-library/react";
import SiteHeader from "./SiteHeader";
import { siteConfig } from "../../config";

describe("SiteHeader", () => {
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
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
