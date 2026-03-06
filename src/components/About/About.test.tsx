import React from "react";
import { render, screen } from "@testing-library/react";
import About from "./About";
import { siteConfig } from "../../config";

describe("About", () => {
  it('renders the "About Me" heading', () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: "About Me" }),
    ).toBeInTheDocument();
  });

  it("renders the aboutMe text from siteConfig", () => {
    render(<About />);
    expect(screen.getByText(siteConfig.aboutMe)).toBeInTheDocument();
  });

  it("renders each skill from siteConfig.skills", () => {
    render(<About />);
    for (const skill of siteConfig.skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it("renders each client from siteConfig.clients", () => {
    render(<About />);
    for (const client of siteConfig.clients) {
      expect(screen.getByText(client)).toBeInTheDocument();
    }
  });

  it("renders each fun fact from siteConfig.funFacts", () => {
    render(<About />);
    for (const fact of siteConfig.funFacts) {
      expect(screen.getByText(fact.text)).toBeInTheDocument();
    }
  });

  it("renders the contact link pointing to /contact-form", () => {
    render(<About />);
    const contactLink = screen.getByRole("link", { name: /contact/i });
    expect(contactLink).toHaveAttribute("href", "/contact-form");
  });
});
