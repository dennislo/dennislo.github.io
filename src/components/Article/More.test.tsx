import React from "react";
import { render, screen } from "@testing-library/react";
import More from "./More";

describe("More", () => {
  it("renders the fun facts header", () => {
    render(<More />);
    expect(screen.getByText("Fun facts:")).toBeInTheDocument();
  });

  it("renders learning fact", () => {
    render(<More />);
    expect(
      screen.getByText(
        /I'm learning Cloud Computing & Optimising Software Delivery/,
      ),
    ).toBeInTheDocument();
  });

  it("renders ask me about fact", () => {
    render(<More />);
    expect(
      screen.getByText(/Ask me about Entrepreneurship & Web Development/),
    ).toBeInTheDocument();
  });

  it("renders hobbies fact", () => {
    render(<More />);
    expect(
      screen.getByText(/Enjoys Snowboarding & Bike Riding/),
    ).toBeInTheDocument();
  });

  it("renders all three fun facts", () => {
    render(<More />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });
});
