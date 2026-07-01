declare module "https://esm.sh/@calcom/atoms@2.11.0?bundle" {
  import type React from "react";

  export const BookerEmbed: React.ComponentType<{
    username: string;
    eventSlug: string;
    view?: string;
    metadata?: Record<string, string>;
    onCreateBookingSuccess?: () => void;
    onCreateBookingError?: () => void;
  }>;
}
