'use client';

import { ReactNode, useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme, Mode } from '../theme';
import { useColorMode } from '@/contexts/ColorModeContext';

interface ThemeRegistryProps {
  children: ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  const { mode } = useColorMode(); // Get current mode from context
  const theme = useMemo(() => createAppTheme(mode as Mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
