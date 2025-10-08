import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00A884', // Teal — trust + freshness
      light: '#4DD4B0',
      dark: '#00775E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B35', // Coral — energy + friendliness
      light: '#FF8E66',
      dark: '#E55A2C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Soft neutral
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Baloo Bhai 2", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      letterSpacing: '-0.03em',
      color: '#1E293B',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.02em',
      color: '#1E293B',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      color: '#1E293B',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1E293B',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1E293B',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      color: '#1E293B',
    },
    subtitle1: {
      fontWeight: 500,
      color: '#475569',
    },
    subtitle2: {
      fontWeight: 500,
      color: '#475569',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#475569',
    },
    body2: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      color: '#475569',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 18,
          paddingRight: 18,
          transition: 'all 0.25s ease-in-out',
          fontWeight: 600,
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #00A884 0%, #4DD4B0 100%)',
          ':hover': {
            background: 'linear-gradient(90deg, #009574 0%, #32C69A 100%)',
            boxShadow: '0 4px 16px rgba(0,168,132,0.25)',
          },
        },
        containedSecondary: {
          background: '#FF6B35',
          ':hover': {
            background: '#E55A2C',
            boxShadow: '0 4px 16px rgba(255,107,53,0.25)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
  },
});

export default theme;
