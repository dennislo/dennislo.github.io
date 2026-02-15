import React from "react";
import { render, screen } from "@testing-library/react";
import Clients from "./Clients";

describe("Clients", () => {
  it("renders the clients section header", () => {
    render(<Clients />);
    expect(
      screen.getByText("I've worked with clients from:")
    ).toBeInTheDocument();
  });

  it("renders all client categories", () => {
    render(<Clients />);
    expect(screen.getByText("Advertising & Media")).toBeInTheDocument();
    expect(screen.getByText("HR & Recruitment")).toBeInTheDocument();
    expect(screen.getByText("Retail & Consumer")).toBeInTheDocument();
    expect(screen.getByText("Science & Education")).toBeInTheDocument();
    expect(screen.getByText("Finance & Banking")).toBeInTheDocument();
    expect(screen.getByText("IT & Telecommunications")).toBeInTheDocument();
  });

  it("renders client category links", () => {
    render(<Clients />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "https://dlo.wtf");
    });
  });
});
