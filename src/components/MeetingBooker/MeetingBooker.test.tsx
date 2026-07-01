import React from "react";
import { screen, waitFor } from "@testing-library/react";
import MeetingBooker from "./MeetingBooker";
import { siteConfig } from "../../config";
import { loadBookerEmbed } from "../../lib/loadBookerEmbed";
import { renderWithLocale } from "../../test/renderWithLocale";

jest.mock("../../lib/loadBookerEmbed", () => ({
  loadBookerEmbed: jest.fn(async () => {
    return ({
      username,
      eventSlug,
      view,
    }: {
      username: string;
      eventSlug: string;
      view?: string;
    }) => (
      <section
        role="region"
        aria-label="Mock Cal booking"
        data-username={username}
        data-event-slug={eventSlug}
        data-view={view}
      />
    );
  }),
}));

const mockLoadBookerEmbed = jest.mocked(loadBookerEmbed);

beforeEach(() => {
  mockLoadBookerEmbed.mockResolvedValue(
    ({
      username,
      eventSlug,
      view,
    }: {
      username: string;
      eventSlug: string;
      view?: string;
    }) => (
      <section
        role="region"
        aria-label="Mock Cal booking"
        data-username={username}
        data-event-slug={eventSlug}
        data-view={view}
      />
    ),
  );
});

describe("MeetingBooker", () => {
  it("renders an accessible loading state before the BookerEmbed loads", () => {
    renderWithLocale(<MeetingBooker />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading meeting times",
    );
  });

  it("passes the Cal.eu booking config to BookerEmbed", async () => {
    renderWithLocale(<MeetingBooker />);

    const booker = await screen.findByRole("region", {
      name: "Mock Cal booking",
    });

    expect(booker).toHaveAttribute(
      "data-username",
      siteConfig.booking.username,
    );
    expect(booker).toHaveAttribute(
      "data-event-slug",
      siteConfig.booking.eventSlug,
    );
    expect(booker).toHaveAttribute("data-view", "MONTH_VIEW");
  });

  it("removes the loading status after BookerEmbed renders", async () => {
    renderWithLocale(<MeetingBooker />);

    await screen.findByRole("region", { name: "Mock Cal booking" });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("falls back to the direct booking page when the embed bundle fails to load", async () => {
    mockLoadBookerEmbed.mockRejectedValueOnce(new Error("network error"));

    renderWithLocale(<MeetingBooker />);

    const fallbackLink = await screen.findByRole("link", {
      name: "Open booking page",
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Booking is temporarily unavailable here",
    );
    expect(fallbackLink).toHaveAttribute("href", siteConfig.booking.url);
  });
});
