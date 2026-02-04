'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Locale, defaultLocale, getTranslation, detectBrowserLocale } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'preferred-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Check localStorage first, then browser preference
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && (stored === 'en' || stored === 'fr')) {
      setLocaleState(stored);
    } else {
      const detected = detectBrowserLocale();
      setLocaleState(detected);
      localStorage.setItem(STORAGE_KEY, detected);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return getTranslation(locale, key, params);
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook for just translations
export function useTranslation() {
  const { t, locale } = useLanguage();
  return { t, locale };
}
