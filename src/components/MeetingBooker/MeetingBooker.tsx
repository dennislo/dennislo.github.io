import React, { Suspense, useEffect, useMemo, useState } from "react";
import { siteConfig } from "../../config";
import { useLocale } from "../../i18n";
import { loadBookerEmbed } from "../../lib/loadBookerEmbed";

type BookerEmbedProps = {
  username: string;
  eventSlug: string;
  view?: string;
  metadata?: Record<string, string>;
  onCreateBookingSuccess?: () => void;
  onCreateBookingError?: () => void;
};

type BookerEmbedErrorBoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

type BookerEmbedErrorBoundaryState = {
  hasError: boolean;
};

class BookerEmbedErrorBoundary extends React.Component<
  BookerEmbedErrorBoundaryProps,
  BookerEmbedErrorBoundaryState
> {
  state: BookerEmbedErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): BookerEmbedErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function MeetingBooker() {
  const [isClient, setIsClient] = useState(false);
  const { t } = useLocale();
  const BookerEmbed = useMemo(
    () =>
      React.lazy(async () => {
        const component = await loadBookerEmbed();
        return {
          default: component as React.ComponentType<BookerEmbedProps>,
        };
      }),
    [],
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fallback = (
    <p
      role="status"
      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
    >
      {t("meet.loading")}
    </p>
  );

  const errorFallback = (
    <div
      role="alert"
      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
    >
      <p>{t("meet.unavailable")}</p>
      <a
        href={siteConfig.booking.url}
        className="mt-3 inline-flex text-sm font-medium text-blue-700 underline decoration-blue-300 underline-offset-4 transition-colors duration-200 hover:text-blue-800 dark:text-blue-300 dark:decoration-blue-700 dark:hover:text-blue-200"
      >
        {t("meet.openBookingPage")}
      </a>
    </div>
  );

  if (!isClient) {
    return fallback;
  }

  return (
    <BookerEmbedErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <BookerEmbed
          username={siteConfig.booking.username}
          eventSlug={siteConfig.booking.eventSlug}
          view="MONTH_VIEW"
          metadata={{ bookingSource: "dlo.wtf" }}
          onCreateBookingSuccess={() => undefined}
          onCreateBookingError={() => undefined}
        />
      </Suspense>
    </BookerEmbedErrorBoundary>
  );
}

export default MeetingBooker;
