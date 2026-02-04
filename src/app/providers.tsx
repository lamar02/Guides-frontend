'use client';

import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </LanguageProvider>
  );
}
