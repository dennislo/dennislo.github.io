import React from "react";
import { render, screen } from "@testing-library/react";
import Education from "./Education";
import { siteConfig } from "../../config";

jest.mock("../../config", () => ({
  siteConfig: {
    ...jest.requireActual("../../config").siteConfig,
  },
}));

describe("Education", () => {
  it('renders the "Education" heading', () => {
    render(<Education />);
    expect(
      screen.getByRole("heading", { name: "Education" }),
    ).toBeInTheDocument();
  });

  it("renders each degree from siteConfig.education", () => {
    render(<Education />);
    for (const edu of siteConfig.education) {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
    }
  });

  it("renders each school from siteConfig.education", () => {
    render(<Education />);
    for (const edu of siteConfig.education) {
      expect(screen.getByText(edu.school)).toBeInTheDocument();
    }
  });

  it("renders each achievement from siteConfig.education", () => {
    render(<Education />);
    for (const edu of siteConfig.education) {
      for (const achievement of edu.achievements) {
        expect(screen.getByText(achievement)).toBeInTheDocument();
      }
    }
  });

  it("returns null when education array is empty", () => {
    const actual =
      jest.requireActual<typeof import("../../config")>("../../config");
    const originalEducation = actual.siteConfig.education;

    const config = require("../../config");
    config.siteConfig.education = [];

    const { container } = render(<Education />);
    expect(container.firstChild).toBeNull();

    config.siteConfig.education = originalEducation;
  });
});
