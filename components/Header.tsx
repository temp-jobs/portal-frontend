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
  Divider,
  useScrollTrigger,
  Slide,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthContext } from '../contexts/AuthContext';
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

  const navigateWithLoader = (path: string) => router.push(path);

  // Active and inactive styles
  const activeButtonStyles = {
    color: '#fff',
    fontWeight: 600,
    textTransform: 'none',
    px: 2,
    py: 0.7,
    borderRadius: 20,
    bgcolor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      bgcolor: theme.palette.primary.dark,
      border: `1px solid ${theme.palette.primary.dark}`,
      transform: 'scale(1.05)',
    },
  };

  const textStyles = {
    color: theme.palette.text.primary,
    fontWeight: 600,
    textTransform: 'none',
    cursor: 'pointer',
    px: 1,
    py: 0.7,
    borderRadius: 20,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'scale(1.05)',
    },
  };

  const getLinkStyle = (path: string) =>
    pathname === path ? activeButtonStyles : textStyles;

  return (
    <>
      {loading && <FullPageLoader message="Loading..." />}

      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            zIndex: 1100,
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 70,
              px: { xs: 2, md: 6 },
            }}
          >
            {/* Logo */}
            <Box
              component="button"
              onClick={() => navigateWithLoader(user ? '/dashboard' : '/')}
              sx={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                color: '#00A884',
                fontSize: '1.5rem',
                letterSpacing: '-0.02em',
              }}
            >
              Part Time Match
            </Box>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  {user?.profileCompleted && (
                    <Box
                      component={pathname === '/dashboard' ? 'button' : 'span'}
                      onClick={() => navigateWithLoader('/dashboard')}
                      sx={getLinkStyle('/dashboard')}
                    >
                      Dashboard
                    </Box>
                  )}

                  {isJobseeker && user?.profileCompleted && (
                    <>
                      <Box
                        component={pathname === '/jobs' ? 'button' : 'span'}
                        onClick={() => navigateWithLoader('/jobs')}
                        sx={getLinkStyle('/jobs')}
                      >
                        Find Jobs
                      </Box>
                      <Box
                        component={pathname === '/profile/jobseeker' ? 'button' : 'span'}
                        onClick={() => navigateWithLoader('/profile/jobseeker')}
                        sx={getLinkStyle('/profile/jobseeker')}
                      >
                        Profile
                      </Box>
                    </>
                  )}

                  {isEmployer && user?.profileCompleted && (
                    <>
                      <Box
                        component={pathname === '/post-job' ? 'button' : 'span'}
                        onClick={() => navigateWithLoader('/post-job')}
                        sx={getLinkStyle('/post-job')}
                      >
                        Post Job
                      </Box>
                      <Box
                        component={pathname === '/profile/employer' ? 'button' : 'span'}
                        onClick={() => navigateWithLoader('/profile/employer')}
                        sx={getLinkStyle('/profile/employer')}
                      >
                        Profile
                      </Box>
                    </>
                  )}

                  <Avatar
                    alt={user.name || 'User'}
                    sx={{
                      width: 36,
                      height: 36,
                      ml: 1,
                      cursor: 'pointer',
                      bgcolor: 'primary.main',
                      fontSize: '0.9rem',
                    }}
                    onClick={handleProfileMenuOpen}
                  />
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{ elevation: 3, sx: { mt: 1.5, minWidth: 180, borderRadius: 1 } }}
                  >
                    <MenuItem
                      onClick={() => {
                        logout();
                        handleProfileMenuClose();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Box
                    component={pathname === '/login' ? 'button' : 'span'}
                    onClick={() => navigateWithLoader('/login')}
                    sx={getLinkStyle('/login')}
                  >
                    Login
                  </Box>

                  <Box
                    component={pathname === '/register' ? 'button' : 'span'}
                    onClick={() => navigateWithLoader('/register')}
                    sx={getLinkStyle('/register')}
                  >
                    Sign Up
                  </Box>
                </>
              )}
            </Box>

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
                {user
                  ? []
                  : [
                      <MenuItem key="login" onClick={() => navigateWithLoader('/login')}>
                        <Box
                          component={pathname === '/login' ? 'button' : 'span'}
                          sx={getLinkStyle('/login')}
                        >
                          Login
                        </Box>
                      </MenuItem>,
                      <MenuItem key="signup" onClick={() => navigateWithLoader('/register')}>
                        <Box
                          component={pathname === '/register' ? 'button' : 'span'}
                          sx={getLinkStyle('/register')}
                        >
                          Sign Up
                        </Box>
                      </MenuItem>,
                    ]}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </>
  );
}
