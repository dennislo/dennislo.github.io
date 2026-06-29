import { enGB } from "./translations/en-GB";

// TranslationDictionary is structurally derived from the canonical en-GB dictionary.
// All other locale dictionaries must satisfy this type (identical keys, non-empty string leaves).
export type TranslationDictionary = typeof enGB;

type StringLeafPaths<T> = {
  [K in Extract<keyof T, string>]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${StringLeafPaths<T[K]>}`
      : never;
}[Extract<keyof T, string>];

export type TranslationKey = StringLeafPaths<TranslationDictionary>;
