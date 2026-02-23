import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BurgerMenu from "./BurgerMenu";

jest.mock("gatsby", () => ({
  Link: function MockLink({
    to,
    children,
    onClick,
  }: {
    to: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  }) {
    return (
      <a href={to} onClick={onClick}>
        {children}
      </a>
    );
  },
}));

describe("BurgerMenu", () => {
  it("renders the hamburger button with the correct aria-label", () => {
    render(<BurgerMenu />);
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });

  it("keeps the panel closed by default", () => {
    render(<BurgerMenu />);
    const panel = screen.getByLabelText("Main navigation");
    expect(panel).not.toHaveClass("burger-panel--open");
  });

  it("opens the panel when clicking the hamburger button", async () => {
    const user = userEvent.setup();
    render(<BurgerMenu />);

    const openButton = screen.getByRole("button", { name: "Open menu" });
    const panel = screen.getByLabelText("Main navigation");

    await user.click(openButton);
    expect(panel).toHaveClass("burger-panel--open");
  });

  it("closes the panel when clicking the close button", async () => {
    const user = userEvent.setup();
    render(<BurgerMenu />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Close menu" }));

    expect(screen.getByLabelText("Main navigation")).not.toHaveClass(
      "burger-panel--open",
    );
  });

  it("closes the panel when clicking the overlay", async () => {
    const user = userEvent.setup();
    const { container } = render(<BurgerMenu />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const overlay = container.querySelector(".burger-overlay");
    expect(overlay).not.toBeNull();
    await user.click(overlay as HTMLElement);

    expect(screen.getByLabelText("Main navigation")).not.toHaveClass(
      "burger-panel--open",
    );
  });

  it('renders a "Homepage" link to "/"', () => {
    render(<BurgerMenu />);
    const link = screen.getByRole("link", { name: "Homepage" });
    expect(link).toHaveAttribute("href", "/");
  });

  it('renders a "Contact" link to "/contact-form"', () => {
    render(<BurgerMenu />);
    const link = screen.getByRole("link", { name: "Contact" });
    expect(link).toHaveAttribute("href", "/contact-form");
  });

  it("closes the panel when clicking a menu link", async () => {
    const user = userEvent.setup();
    render(<BurgerMenu />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("link", { name: "Homepage" }));

    expect(screen.getByLabelText("Main navigation")).not.toHaveClass(
      "burger-panel--open",
    );
  });

  it("updates aria-expanded based on open and closed state", async () => {
    const user = userEvent.setup();
    render(<BurgerMenu />);

    const openButton = screen.getByRole("button", { name: "Open menu" });
    expect(openButton).toHaveAttribute("aria-expanded", "false");

    await user.click(openButton);
    expect(openButton).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(openButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the panel when pressing Escape", async () => {
    const user = userEvent.setup();
    render(<BurgerMenu />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByLabelText("Main navigation")).toHaveClass(
      "burger-panel--open",
    );

    await user.keyboard("{Escape}");
    expect(screen.getByLabelText("Main navigation")).not.toHaveClass(
      "burger-panel--open",
    );
  });

  it("moves focus to close button when opened and back to trigger when closed", async () => {
    const user = userEvent.setup();
    render(<BurgerMenu />);

    const openButton = screen.getByRole("button", { name: "Open menu" });
    await user.click(openButton);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(openButton).toHaveFocus();
  });

  it('has a nav landmark with aria-label "Main navigation"', () => {
    render(<BurgerMenu />);
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument();
  });
});
