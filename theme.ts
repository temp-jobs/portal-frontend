'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red, grey } from '@mui/material/colors';

import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

export type Mode = 'light' | 'dark';

const baseTypography = {
  fontFamily: 'Montserrat, "Roboto", "Helvetica", Arial, sans-serif',
  h1: { fontWeight: 700, fontSize: '2.75rem', letterSpacing: '-0.015em' },
  h2: { fontWeight: 700, fontSize: '2rem' },
  h3: { fontWeight: 600, fontSize: '1.5rem' },
  h4: { fontWeight: 600, fontSize: '1.25rem' },
  h5: { fontWeight: 500, fontSize: '1.125rem' },
  h6: { fontWeight: 500, fontSize: '1rem' },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.9rem', lineHeight: 1.5 },
  button: { fontWeight: 700, textTransform: 'none', letterSpacing: '0.01em' },
};

export const getDesignTokens = (mode: Mode) => {
  const common = {
    typography: baseTypography,
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 500 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.08)' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 12, backgroundImage: 'none' },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': { borderRadius: 10 },
            '& .MuiInputLabel-root': { fontWeight: 500 },
            '& .MuiInputBase-input::placeholder': { color: grey[400], opacity: 1 },
          },
        },
      },
      MuiAppBar: { styleOverrides: { root: { boxShadow: '0 2px 6px rgba(0,0,0,0.08)' } } },
    },
  };

  if (mode === 'light') {
    return {
      ...common,
      palette: {
        mode: 'light',
        primary: { main: '#0056D2', light: '#E6F0FF', dark: '#003A99', contrastText: '#fff' },
        secondary: { main: '#00A884', light: '#CFFFEF', dark: '#00876B', contrastText: '#fff' },
        background: { default: '#F9FAFB', paper: '#FFFFFF' },
        text: { primary: '#1E293B', secondary: '#475569', disabled: '#94A3B8' },
        divider: '#E2E8F0',
        error: { main: '#DC2626' },
        action: { hover: 'rgba(0,86,210,0.08)' },
      },
      components: {
        ...common.components,
        MuiButton: {
          styleOverrides: {
            containedPrimary: {
              background: 'linear-gradient(135deg, #4E8EF7, #0056D2)',
              color: '#fff',
              '&:hover': { background: 'linear-gradient(135deg, #2C72EA, #0046B2)' },
            },
            outlinedPrimary: {
              borderColor: '#0056D2',
              color: '#0056D2',
              '&:hover': { background: 'rgba(0,86,210,0.1)' },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#0056D2' },
                '&.Mui-focused fieldset': { borderColor: '#0056D2', borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#0056D2' },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: '#FFFFFF',
              color: '#1E293B',
              borderBottom: '1px solid #E2E8F0',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(17,24,39,0.08)',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            colorPrimary: {
              '&.MuiChip-filled': {
                background: '#E6F0FF',
                color: '#0056D2',
                '&:hover': { opacity: 0.9 },
              },
            },
            colorSecondary: {
              '&.MuiChip-filled': {
                background: '#CFFFEF',
                color: '#00876B',
                '&:hover': { opacity: 0.9 },
              },
            },
          },
        },
      },
    };
  }

  // dark mode
  return {
    ...common,
    palette: {
      mode: 'dark',
      primary: { main: '#4E8EF7', light: '#6FA8F9', dark: '#0056D2', contrastText: '#fff' },
      secondary: { main: '#00C59B', light: '#5AF2D0', dark: '#009474', contrastText: '#fff' },
      background: { default: '#0F172A', paper: '#1E293B' },
      text: { primary: '#F8FAFC', secondary: '#CBD5E1', disabled: '#64748B' },
      divider: '#334155',
      error: { main: '#F87171' },
      action: { hover: 'rgba(255,255,255,0.06)' },
    },
    components: {
      ...common.components,
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            background: 'linear-gradient(135deg, #0056D2, #4E8EF7)',
            color: '#fff',
            '&:hover': { background: 'linear-gradient(135deg, #0046B2, #2C72EA)' },
          },
          outlinedPrimary: {
            borderColor: '#4E8EF7',
            color: '#4E8EF7',
            '&:hover': { background: 'rgba(78,142,247,0.1)' },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#4E8EF7' },
              '&.Mui-focused fieldset': { borderColor: '#4E8EF7', borderWidth: 2 },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#4E8EF7' },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1E293B',
            color: '#F8FAFC',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#1E293B',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
          },
        },
      },
    },
  };
};

export const createAppTheme = (mode: Mode) => {
  let theme = createTheme(getDesignTokens(mode) as any);
  theme = responsiveFontSizes(theme);
  return theme;
};

export const defaultTheme = createAppTheme('light');
export default createAppTheme;
