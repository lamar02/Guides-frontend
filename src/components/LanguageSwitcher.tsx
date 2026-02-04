'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Locale, locales, localeNames, localeFlags } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 px-2 text-gray-500 hover:text-black">
            <span className="text-lg mr-1">{localeFlags[locale]}</span>
            <span className="text-sm font-medium uppercase">{locale}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px] rounded-xl p-1">
          {locales.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => setLocale(loc)}
              className={`cursor-pointer rounded-lg ${locale === loc ? 'bg-gray-100' : ''}`}
            >
              <span className="text-lg mr-2">{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 gap-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl">
          <Globe className="w-4 h-4" />
          <span className="font-medium">{localeNames[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] rounded-xl p-1">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={`cursor-pointer rounded-lg flex items-center gap-2 ${locale === loc ? 'bg-gray-100' : ''}`}
          >
            <span className="text-lg">{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
