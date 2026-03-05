import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { siteConfig } from "../../config";

describe("Hero", () => {
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
});
