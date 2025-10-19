'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  useScrollTrigger,
  Slide,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAuthContext } from '@/contexts/AuthContext';
import { useColorMode } from '@/contexts/ColorModeContext';
import FullPageLoader from './FullPageLoader';

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header() {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const isJobseeker = user?.role === 'jobseeker';
  const isEmployer = user?.role === 'employer';

  const navigateWithLoader = (path: string) => {
    if (pathname === path) return; // Prevent redundant navigation
    setLoading(true);
    router.push(path);
    setTimeout(() => setLoading(false), 600);
  };

  // Styles
  const activeButtonStyles = {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    fontWeight: 600,
    textTransform: 'none',
    px: 2,
    py: 0.8,
    borderRadius: 20,
    bgcolor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      bgcolor: theme.palette.primary.dark,
      transform: 'scale(1.05)',
    },
  };

  const textStyles = {
    color: theme.palette.text.primary,
    fontWeight: 500,
    textTransform: 'none',
    cursor: 'pointer',
    px: 2,
    py: 0.8,
    borderRadius: 20,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      bgcolor: theme.palette.action.hover,
      transform: 'scale(1.05)',
    },
  };

  const getLinkStyle = (path: string) => (pathname === path ? activeButtonStyles : textStyles);

  return (
    <>
      {loading && <FullPageLoader message="Loading..." />}

      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.paper,
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            backdropFilter: 'blur(8px)',
            zIndex: 1200,
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 72,
              px: { xs: 2, md: 6 },
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {/* Logo */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                color: theme.palette.primary.main,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
              onClick={() => {
                if (isJobseeker) navigateWithLoader('/jsk/dashboard');
                else if (isEmployer) navigateWithLoader('/em/dashboard');
                else navigateWithLoader('/');
              }}
            >
              Part Time Match
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  {isJobseeker && user?.profileCompleted && (
                    <>
                      <Box onClick={() => navigateWithLoader('/jsk/dashboard')} sx={getLinkStyle('/jsk/dashboard')}>Dashboard</Box>
                      <Box onClick={() => navigateWithLoader('/jobs')} sx={getLinkStyle('/jobs')}>Find Jobs</Box>
                      <Box onClick={() => navigateWithLoader('/jsk/profile')} sx={getLinkStyle('/jsk/profile')}>Profile</Box>
                    </>
                  )}
                  {isEmployer && user?.profileCompleted && (
                    <>
                      <Box onClick={() => navigateWithLoader('/em/dashboard')} sx={getLinkStyle('/em/dashboard')}>Dashboard</Box>
                      <Box onClick={() => navigateWithLoader('/em/post')} sx={getLinkStyle('/em/post')}>Post Job</Box>
                      <Box onClick={() => navigateWithLoader('/em/profile')} sx={getLinkStyle('/em/profile')}>Profile</Box>
                    </>
                  )}

                  {/* Theme toggle */}
                  <IconButton
                    onClick={toggleColorMode}
                    sx={{
                      color: mode === 'dark' ? theme.palette.warning.light : theme.palette.text.primary,
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'rotate(20deg) scale(1.1)' },
                    }}
                  >
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>

                  {/* Profile */}
                  <Avatar
                    alt={user.name || 'User'}
                    sx={{
                      width: 36,
                      height: 36,
                      ml: 1,
                      cursor: 'pointer',
                      bgcolor: theme.palette.primary.main,
                      fontSize: '0.9rem',
                    }}
                    onClick={handleProfileMenuOpen}
                  />
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 4,
                      sx: { mt: 1.5, minWidth: 180, borderRadius: 2 },
                    }}
                  >
                    <MenuItem onClick={() => { logout(); handleProfileMenuClose(); }}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                    <Box onClick={() => navigateWithLoader('/login')} sx={getLinkStyle('/login')}>Login</Box>
                    <Box onClick={() => navigateWithLoader('/register')} sx={getLinkStyle('/register')}>Sign Up</Box>
                    <IconButton
                      onClick={toggleColorMode}
                      sx={{
                        ml: 1,
                        color: mode === 'dark' ? theme.palette.warning.light : theme.palette.text.primary,
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'rotate(20deg) scale(1.1)' },
                      }}
                  >
                      {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </>
              )}
            </Box>

            {/* Mobile Menu */}
            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ elevation: 3, sx: { mt: 1.5, minWidth: 180, borderRadius: 2 } }}
              >
                {user && isJobseeker && user?.profileCompleted && [
                  <MenuItem key="dashboard" onClick={() => navigateWithLoader('/jsk/dashboard')} selected={pathname === '/jsk/dashboard'}>Dashboard</MenuItem>,
                  <MenuItem key="find-jobs" onClick={() => navigateWithLoader('/jobs')} selected={pathname === '/jobs'}>Find Jobs</MenuItem>,
                  <MenuItem key="profile" onClick={() => navigateWithLoader('/jsk/profile')} selected={pathname === '/jsk/profile'}>Profile</MenuItem>
                ]}

                {user && isEmployer && user?.profileCompleted && [
                  <MenuItem key="em-dashboard" onClick={() => navigateWithLoader('/em/dashboard')} selected={pathname === '/em/dashboard'}>Dashboard</MenuItem>,
                  <MenuItem key="post-job" onClick={() => navigateWithLoader('/em/post')} selected={pathname === '/em/post'}>Post Job</MenuItem>,
                  <MenuItem key="em-profile" onClick={() => navigateWithLoader('/em/profile')} selected={pathname === '/em/profile'}>Profile</MenuItem>
                ]}

                {user && <Divider key="divider1" />}
                {user && <MenuItem key="logout" onClick={() => { logout(); handleMenuClose(); }}>Logout</MenuItem>}

                {!user && [
                  <MenuItem key="login" onClick={() => navigateWithLoader('/login')} selected={pathname === '/login'}>Login</MenuItem>,
                  <MenuItem key="signup" onClick={() => navigateWithLoader('/register')} selected={pathname === '/register'}>Sign Up</MenuItem>
                ]}

                <Divider key="divider2" />
                <MenuItem key="toggle-theme" onClick={toggleColorMode}>
                  {mode === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
                </MenuItem>
              </Menu>
            </Box>

          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </>
  );
}
