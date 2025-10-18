'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00A884', // Part Time Match's Green green
      light: '#00A884',
      dark: '#00A884',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1976d2', // your existing blue
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: grey[400],
    },
    divider: grey[300],
  },

  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.75rem',
      letterSpacing: '-0.015em',
      color: '#1c1c1c',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#1c1c1c',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1c1c1c',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1c1c1c',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#1c1c1c',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#1c1c1c',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
      color: grey[700],
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          boxShadow: 'none',
          backgroundColor: '#00A884',
          '&:hover': {
            backgroundColor: '#00A884',
            boxShadow: '0 4px 20px rgba(111, 218, 68, 0.3)',
          },
        },
        outlinedPrimary: {
          borderColor: '#00A884',
          color: '#00A884',
          '&:hover': {
            backgroundColor: 'rgba(111, 218, 68, 0.08)',
            borderColor: '#00A884',
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1c1c1c',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #eaeaea',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          transition: 'all 0.25s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
