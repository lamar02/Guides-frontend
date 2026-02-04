import en from './translations/en.json';
import fr from './translations/fr.json';

export type Locale = 'en' | 'fr';

export const locales: Locale[] = ['en', 'fr'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
};

const translations = { en, fr } as const;

type TranslationKeys = typeof en;

// Flatten nested object keys for type safety
type FlattenKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? FlattenKeys<T[K], `${Prefix}${K & string}.`>
        : `${Prefix}${K & string}`;
    }[keyof T]
  : never;

export type TranslationKey = FlattenKeys<TranslationKeys>;

// Get nested value from object using dot notation
function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if not found
    }
  }

  return typeof current === 'string' ? current : path;
}

export function getTranslation(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const translation = getNestedValue(translations[locale], key);

  if (!params) return translation;

  // Replace {param} with actual values
  return Object.entries(params).reduce(
    (str, [key, value]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    translation
  );
}

export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const browserLang = navigator.language.split('-')[0];
  return locales.includes(browserLang as Locale) ? (browserLang as Locale) : defaultLocale;
}
