import React from "react";
import { render, screen } from "@testing-library/react";
import Projects from "./Projects";
import { siteConfig } from "../../config";

// Mock the module so we can override siteConfig.projects in some tests
jest.mock("../../config", () => ({
  siteConfig: {
    ...jest.requireActual("../../config").siteConfig,
  },
}));

describe("Projects", () => {
  it('renders the "Projects" heading', () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { name: "Projects" }),
    ).toBeInTheDocument();
  });

  it("renders each project name", () => {
    render(<Projects />);
    for (const project of siteConfig.projects) {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    }
  });

  it("renders numbered index for each project (01, 02, etc.)", () => {
    render(<Projects />);
    siteConfig.projects.forEach((_project, index) => {
      const padded = String(index + 1).padStart(2, "0");
      expect(screen.getByText(padded)).toBeInTheDocument();
    });
  });

  it("renders project skill tags for each project", () => {
    render(<Projects />);
    for (const project of siteConfig.projects) {
      for (const skill of project.skills) {
        // Use getAllByText because the same skill may appear in multiple projects
        const matches = screen.getAllByText(skill);
        expect(matches.length).toBeGreaterThan(0);
      }
    }
  });

  it("returns null when projects array is empty", () => {
    // Temporarily replace siteConfig.projects with an empty array
    const actual =
      jest.requireActual<typeof import("../../config")>("../../config");
    const originalProjects = actual.siteConfig.projects;

    // Override via the mocked module reference
    const config = require("../../config");
    config.siteConfig.projects = [];

    const { container } = render(<Projects />);
    expect(container.firstChild).toBeNull();

    // Restore
    config.siteConfig.projects = originalProjects;
  });
});
