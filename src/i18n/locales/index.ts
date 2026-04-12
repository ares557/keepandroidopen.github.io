/**
 * Landing page string resolver.
 *
 * Loads per-locale YAML files from src/i18n/locales/{locale}.yaml,
 * falling back to English for any missing key.
 *
 * Usage:
 *   import { getLandingStrings } from '../i18n/locales';
 *   const t = getLandingStrings('fr');
 *   t.hero_lede  // French if available, English otherwise
 */

// Eagerly import all locale YAML files via Vite's glob import (sync).
// Each module default-exports the parsed YAML object.
const modules = import.meta.glob('./*.yaml', { eager: true }) as Record<string, { default: Record<string, string> }>;

function loadLocale(locale: string): Record<string, string> {
  const key = `./${locale}.yaml`;
  return modules[key]?.default ?? {};
}

const enStrings = loadLocale('en');

/**
 * Returns a merged string map for the given locale.
 * Every key present in en.yaml is guaranteed to exist in the result;
 * locale-specific overrides take precedence.
 */
export function getLandingStrings(locale: string = 'en'): Record<string, string> {
  if (locale === 'en') return { ...enStrings };
  const raw = loadLocale(locale);
  // Filter out empty strings so they fall back to English
  const localeStrings: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v !== '') localeStrings[k] = v;
  }
  return { ...enStrings, ...localeStrings };
}
