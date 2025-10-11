'use client';

import React from 'react';
import Link from 'next/link';
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

// Hide AppBar when scrolling down (like Upwork)
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const isJobseeker = user?.role === 'jobseeker';
  const isEmployer = user?.role === 'employer';

  // ✅ Prepare menu items (to prevent hydration mismatch)
  const mobileMenuItems = React.useMemo(() => {
    const items: React.ReactNode[] = [];

    if (user) {
      if (isJobseeker) {
        items.push(
          <MenuItem key="jobs" component={Link} href="/jobs" onClick={handleMenuClose}>
            Find Jobs
          </MenuItem>,
          <MenuItem key="profile" component={Link} href="/profile" onClick={handleMenuClose}>
            Profile
          </MenuItem>,
          <Divider key="divider1" />,
          <MenuItem
            key="logout"
            onClick={() => {
              logout();
              handleMenuClose();
            }}
          >
            Logout
          </MenuItem>
        );
      } else if (isEmployer) {
        items.push(
          <MenuItem key="post" component={Link} href="/post-job" onClick={handleMenuClose}>
            Post Job
          </MenuItem>,
          <MenuItem key="profile" component={Link} href="/profile" onClick={handleMenuClose}>
            Profile
          </MenuItem>,
          <Divider key="divider1" />,
          <MenuItem
            key="logout"
            onClick={() => {
              logout();
              handleMenuClose();
            }}
          >
            Logout
          </MenuItem>
        );
      }
    } else {
      items.push(
        <MenuItem key="login" component={Link} href="/login" onClick={handleMenuClose}>
          Login
        </MenuItem>,
        <MenuItem key="register" component={Link} href="/register" onClick={handleMenuClose}>
          Sign Up
        </MenuItem>
      );
    }

    return items;
  }, [user, isJobseeker, isEmployer, logout]);

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
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
            component={Link}
            href="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              fontSize: '1.5rem',
              letterSpacing: '-0.02em',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Part Time Match
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {user ? (
              <>
                {isJobseeker && (
                  <>
                    <Button
                      component={Link}
                      href="/jobs"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                      }}
                    >
                      Find Jobs
                    </Button>
                    <Button
                      component={Link}
                      href="/profile/jobseeker"
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

                {isEmployer && (
                  <>
                    <Button
                      component={Link}
                      href="/post-job"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                      }}
                    >
                      Post Job
                    </Button>
                    <Button
                      component={Link}
                      href="/profile/employer"
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
                  src={user.avatarUrl || ''}
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
                  component={Link}
                  href="/login"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/register"
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
            )
            }
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
              {mobileMenuItems}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
