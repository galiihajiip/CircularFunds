'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <>{children}</>;
}
