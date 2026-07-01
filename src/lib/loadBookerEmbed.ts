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
// Loading the browser bundle only on the client keeps the meet page build-safe.
export async function loadBookerEmbed() {
  const module = (await import(
    /* webpackIgnore: true */
    "https://esm.sh/@calcom/atoms@2.11.0?bundle"
  )) as BookerEmbedModule;

  return module.BookerEmbed;
}
