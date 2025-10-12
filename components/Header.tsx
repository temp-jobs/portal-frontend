'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthContext } from '../contexts/AuthContext';
import FullPageLoader from './FullPageLoader'; // ✅ Import your loader component

// Hide AppBar when scrolling down
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const isJobseeker = user?.role === 'jobseeker';
  const isEmployer = user?.role === 'employer';

  // ✅ Universal navigation handler with loader
  const navigateWithLoader = async (path: string) => {
    // setLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 100)); // tiny UX delay
    router.push(path);
    // setTimeout(() => setLoading(false), 1000); // fallback hide loader
  };



  return (
    <>
      {loading && <FullPageLoader message="Loading..." />} {/* ✅ Loader visible when navigating */}

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
            <Typography
              variant="h6"
              component="button"
              onClick={() => {
                if (isJobseeker || isEmployer) {
                  navigateWithLoader('/dashboard')
                } else {
                  navigateWithLoader('/')
                }
              }} // ✅ Added loader on logo click
              style={{
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
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              {user ? (
                <>
                  {
                    user?.profileCompleted && (

                      <>
                        <Button
                          onClick={() => navigateWithLoader('/dashboard')}
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                          }}
                        >
                          Dashboard
                        </Button>
                      </>
                    )
                  }
                  {isJobseeker && user?.profileCompleted && (
                    <>
                      <Button
                        onClick={() => navigateWithLoader('/jobs')}
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                        }}
                      >
                        Find Jobs
                      </Button>
                      <Button
                        onClick={() => navigateWithLoader('/profile/jobseeker')}
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                        }}
                      >
                        Profile
                      </Button>
                    </>
                  )}

                  {isEmployer && user?.profileCompleted && (
                    <>
                      <Button
                        onClick={() => navigateWithLoader('/post-job')}
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                        }}
                      >
                        Post Job
                      </Button>
                      <Button
                        onClick={() => navigateWithLoader('/profile/employer')}
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                        }}
                      >
                        Profile
                      </Button>
                    </>
                  )}

                  {/* Avatar dropdown */}
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
                    PaperProps={{
                      elevation: 3,
                      sx: { mt: 1.5, minWidth: 180, borderRadius: 1 },
                    }}
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
                  <Button
                      onClick={() => navigateWithLoader('/login')}
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => navigateWithLoader('/register')}
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: 6,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                      }}
                    >
                      Sign Up
                    </Button>
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
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 2,
                  },
                }}
              >
                {user
                  ? [
                    ...(isJobseeker
                      ? [
                        <MenuItem key="jobs" onClick={() => navigateWithLoader('/jobs')}>
                          Find Jobs
                        </MenuItem>,
                        <MenuItem key="profile-jobseeker" onClick={() => navigateWithLoader('/profile/jobseeker')}>
                          Profile
                        </MenuItem>,
                      ]
                      : []),
                    ...(isEmployer
                      ? [
                        <MenuItem key="post" onClick={() => navigateWithLoader('/post-job')}>
                          Post Job
                        </MenuItem>,
                        <MenuItem key="profile-employer" onClick={() => navigateWithLoader('/profile/employer')}>
                          Profile
                        </MenuItem>,
                      ]
                      : []),
                    <Divider key="divider" />,
                    <MenuItem
                      key="logout"
                      onClick={() => {
                        logout();
                        handleMenuClose();
                      }}
                    >
                      Logout
                    </MenuItem>,
                  ]
                  : [
                    <MenuItem key="login" onClick={() => navigateWithLoader('/login')}>
                      Login
                    </MenuItem>,
                    <MenuItem key="signup" onClick={() => navigateWithLoader('/register')}>
                      Sign Up
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
