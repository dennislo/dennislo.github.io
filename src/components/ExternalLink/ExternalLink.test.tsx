import React from "react";
import {render, screen} from "@testing-library/react";
import ExternalLink from "./ExternalLink";

describe("ExternalLink", () => {
  const defaultProps = {
    href: "https://example.com",
    children: "Visit Example",
  };

  describe("children", () => {
    it("renders children correctly", () => {
      render(<ExternalLink {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: "Visit Example" }),
      ).toBeInTheDocument();
    });
  });

  describe("href", () => {
    it("applies the href attribute", () => {
      render(<ExternalLink {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: "Visit Example" }),
      ).toHaveAttribute("href", "https://example.com");
    });
  });

  describe("security attributes", () => {
    it('always sets rel="noopener noreferrer"', () => {
      render(<ExternalLink {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: "Visit Example" }),
      ).toHaveAttribute("rel", "noopener noreferrer");
    });

    it('always sets target="_blank"', () => {
      render(<ExternalLink {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: "Visit Example" }),
      ).toHaveAttribute("target", "_blank");
    });
  });

  describe("title (optional)", () => {
    it("renders title attribute when provided", () => {
      render(<ExternalLink {...defaultProps} title="Example Site" />);
      expect(
        screen.getByRole("link", { name: "Visit Example" }),
      ).toHaveAttribute("title", "Example Site");
    });

    it("does not render title attribute when omitted", () => {
      render(<ExternalLink {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: "Visit Example" }),
      ).not.toHaveAttribute("title");
    });
  });

  describe("className (optional)", () => {
    it("applies className when provided", () => {
      render(<ExternalLink {...defaultProps} className="my-link" />);
      expect(screen.getByRole("link", { name: "Visit Example" })).toHaveClass(
        "my-link",
      );
    });

    it("does not apply className when omitted", () => {
      render(<ExternalLink {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: "Visit Example" }),
      ).not.toHaveAttribute("class");
    });
  });
});
