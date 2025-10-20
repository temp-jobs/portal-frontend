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
        primary: { main: '#6366F1', light: '#A5B4FC', dark: '#4F46E5', contrastText: '#fff' },
        secondary: { main: '#34D399', light: '#A7F3D0', dark: '#10B981', contrastText: '#fff' },
        background: { default: '#FAFAFA', paper: '#FFFFFF' },
        text: { primary: '#111827', secondary: '#4B5563', disabled: '#6B7280' },
        divider: '#E5E7EB',
        error: { main: red.A400 },
        action: { hover: 'rgba(99,102,241,0.08)' },
      },
      components: {
        ...common.components,
        MuiButton: {
          styleOverrides: {
            containedPrimary: {
              background: 'linear-gradient(135deg, #A5B4FC, #6366F1)',
              color: '#fff',
              '&:hover': { background: 'linear-gradient(135deg, #818CF8, #4F46E5)' },
            },
            outlinedPrimary: {
              borderColor: '#6366F1',
              color: '#6366F1',
              '&:hover': { background: 'rgba(163,175,252,0.1)' },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#6366F1' },
                '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: { backgroundColor: '#FFFFFF', color: '#111827', borderBottom: '1px solid #E5E7EB' },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: { backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(17,24,39,0.08)' },
          },
        },
        MuiChip: {
          styleOverrides: {
            colorPrimary: {
              '&.MuiChip-filled': {
                background: '#E0E7FF',
                color: '#4F46E5',
                '&:hover': { opacity: 0.9 },
              },
            },
            colorSecondary: {
              '&.MuiChip-filled': {
                background: '#D1FAE5',
                color: '#10B981',
                '&:hover': { opacity: 0.9 },
              },
            },
          },
        },
      },
    };
  }

  // dark mode (keep same as before)
  return {
    ...common,
    palette: {
      mode: 'dark',
      primary: { main: '#6366F1', light: '#818CF8', dark: '#4F46E5', contrastText: '#fff' },
      secondary: { main: '#34D399', light: '#6EE7B7', dark: '#10B981', contrastText: '#fff' },
      background: { default: '#111827', paper: '#1F2937' },
      text: { primary: '#E5E7EB', secondary: '#9CA3AF', disabled: '#6B7280' },
      divider: '#374151',
      error: { main: red.A400 },
      action: { hover: 'rgba(255,255,255,0.06)' },
    },
    components: {
      ...common.components,
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            color: '#fff',
            '&:hover': { background: 'linear-gradient(135deg, #4F46E5, #6366F1)' },
          },
          outlinedPrimary: {
            borderColor: '#6366F1',
            color: '#6366F1',
            '&:hover': { background: 'rgba(99,102,241,0.08)' },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#6366F1' },
              '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: 2 },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: '#1F2937', color: '#E5E7EB', borderBottom: '1px solid rgba(255,255,255,0.08)' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundColor: '#1F2937', boxShadow: '0 4px 12px rgba(0,0,0,0.6)' },
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
