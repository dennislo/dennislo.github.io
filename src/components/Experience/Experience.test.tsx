import React from "react";
import { render, screen } from "@testing-library/react";
import Experience from "./Experience";
import { siteConfig } from "../../config";

type MutableExperienceConfig = { experience: typeof siteConfig.experience };

jest.mock("../../config", () => ({
  siteConfig: {
    ...jest.requireActual("../../config").siteConfig,
  },
}));

describe("Experience", () => {
  it('renders the "Experience" heading', () => {
    render(<Experience />);
    expect(
      screen.getByRole("heading", { name: "Experience" }),
    ).toBeInTheDocument();
  });

  it("renders each job title from siteConfig.experience", () => {
    render(<Experience />);
    for (const exp of siteConfig.experience) {
      expect(screen.getByText(exp.title)).toBeInTheDocument();
    }
  });

  it("renders each company from siteConfig.experience", () => {
    render(<Experience />);
    for (const exp of siteConfig.experience) {
      expect(screen.getByText(exp.company)).toBeInTheDocument();
    }
  });

  it("renders each bullet point from siteConfig.experience", () => {
    render(<Experience />);
    for (const exp of siteConfig.experience) {
      for (const bullet of exp.bullets) {
        expect(screen.getByText(bullet)).toBeInTheDocument();
      }
    }
  });

  it("returns null when experience array is empty", () => {
    const originalExperience = siteConfig.experience;
    (siteConfig as MutableExperienceConfig).experience = [];

    const { container } = render(<Experience />);
    expect(container.firstChild).toBeNull();

    (siteConfig as MutableExperienceConfig).experience = originalExperience;
  });
});
