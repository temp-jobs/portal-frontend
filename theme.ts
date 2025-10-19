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
          containedPrimary: {
            boxShadow: 'none',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
          },
          outlinedPrimary: {
            borderWidth: 2,
            '&:hover': { backgroundColor: 'rgba(79,70,229,0.08)' },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 500 },
          colorPrimary: {
            '&.MuiChip-filled': {
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              color: '#fff',
              '&:hover': { opacity: 0.9 },
            },
          },
          colorSecondary: {
            '&.MuiChip-filled': {
              background: 'linear-gradient(135deg, #10B981, #34D399)',
              color: '#fff',
              '&:hover': { opacity: 0.9 },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: '0 12px 28px rgba(0,0,0,0.12)' },
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
        primary: { main: '#4F46E5', light: '#6366F1', dark: '#3730A3', contrastText: '#fff' },
        secondary: { main: '#10B981', light: '#34D399', dark: '#059669', contrastText: '#fff' },
        background: { default: '#F3F4F6', paper: '#FFFFFF' },
        text: { primary: '#1F2937', secondary: '#4B5563', disabled: '#9CA3AF' },
        divider: '#E5E7EB',
        error: { main: red.A400 },
        action: { hover: 'rgba(79,70,229,0.08)' },
      },
      components: {
        ...common.components,
        MuiButton: {
          styleOverrides: {
            containedPrimary: {
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              color: '#fff',
              '&:hover': { background: 'linear-gradient(135deg, #3730A3, #4F46E5)' },
            },
            outlinedPrimary: {
              borderColor: '#4F46E5',
              color: '#4F46E5',
              '&:hover': { background: 'rgba(79,70,229,0.06)' },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#4F46E5' },
                '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#4F46E5' },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: { backgroundColor: '#FFFFFF', color: '#1F2937', borderBottom: '1px solid #E5E7EB' },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: { backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(31,41,55,0.08)' },
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
