import { enGB } from "./translations/en-GB";

// TranslationDictionary is structurally derived from the canonical en-GB dictionary.
// All other locale dictionaries must satisfy this type (identical keys, non-empty string leaves).
export type TranslationDictionary = typeof enGB;
