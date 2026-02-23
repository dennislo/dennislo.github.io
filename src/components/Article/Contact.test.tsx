import React from "react";
import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

// Contact.tsx uses Gatsby's <Link> for the contact-form navigation link
jest.mock("gatsby", () => ({
  Link: function MockLink({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) {
    return <a href={to}>{children}</a>;
  },
}));

jest.mock("../icons/Github", () => {
  function MockGithubIcon() {
    return <svg aria-label="GitHub icon" />;
  }
  return MockGithubIcon;
});

jest.mock("../icons/Email", () => {
  function MockEmailIcon() {
    return <svg aria-label="Email icon" />;
  }
  return MockEmailIcon;
});

jest.mock("../icons/Linkedin", () => {
  function MockLinkedinIcon() {
    return <svg aria-label="LinkedIn icon" />;
  }
  return MockLinkedinIcon;
});

jest.mock("../icons/Instagram", () => {
  function MockInstagramIcon() {
    return <svg aria-label="Instagram icon" />;
  }
  return MockInstagramIcon;
});

describe("Contact", () => {
  it("renders the contact section", () => {
    render(<Contact />);
    expect(screen.getByText("Contact Dennis Lo:")).toBeInTheDocument();
  });

  it("renders GitHub link", () => {
    render(<Contact />);
    const link = screen.getByTitle("Dennis Lo on GitHub");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/dennislo");
  });

  it("renders email link", () => {
    render(<Contact />);
    const link = screen.getByTitle("email Dennis Lo via dennis@dlo.wtf");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:dennis@dlo.wtf");
  });

  it("renders LinkedIn link", () => {
    render(<Contact />);
    const link = screen.getByTitle("Dennis Lo on LinkedIn");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/dennis-lo-profile",
    );
  });

  it("renders Instagram link", () => {
    render(<Contact />);
    const link = screen.getByTitle("Dennis Lo on Instagram");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://www.instagram.com/dlo");
  });

  it("renders all social media icons", () => {
    render(<Contact />);
    expect(screen.getByLabelText("GitHub icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Email icon")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Instagram icon")).toBeInTheDocument();
  });

  it("renders a link to the contact form", () => {
    render(<Contact />);
    const link = screen.getByRole("link", { name: /contact form/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/contact-form");
  });
});
