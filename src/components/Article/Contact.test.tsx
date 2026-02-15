import React from "react";
import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

jest.mock("../icons/Github", () => () => <svg data-testid="github-icon" />);
jest.mock("../icons/Email", () => () => <svg data-testid="email-icon" />);
jest.mock("../icons/Linkedin", () => () => <svg data-testid="linkedin-icon" />);
jest.mock("../icons/Instagram", () => () => (
  <svg data-testid="instagram-icon" />
));

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
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.getByTestId("email-icon")).toBeInTheDocument();
    expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument();
    expect(screen.getByTestId("instagram-icon")).toBeInTheDocument();
  });
});
