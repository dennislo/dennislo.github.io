import type React from "react";

type BookerEmbedProps = {
  username: string;
  eventSlug: string;
  view?: string;
  metadata?: Record<string, string>;
  onCreateBookingSuccess?: () => void;
  onCreateBookingError?: () => void;
};

type BookerEmbedModule = {
  BookerEmbed: React.ComponentType<BookerEmbedProps>;
};

// Gatsby cannot bundle the full @calcom/atoms package cleanly because its
// Booker entrypoint pulls in a large Next-specific peer dependency surface.
// Loading it dynamically only on the client keeps the meet page build-safe.
export async function loadBookerEmbed() {
  const module = (await import("@calcom/atoms")) as BookerEmbedModule;

  return module.BookerEmbed;
}
