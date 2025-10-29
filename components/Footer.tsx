'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  TextField,
  Button,
  useTheme,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  const theme = useTheme();

  const socialColors = {
    linkedin: { main: '#0A66C2', hover: '#004182' },
    twitter: { main: '#1DA1F2', hover: '#0d95e8' },
    facebook: { main: '#1877F2', hover: '#0d47a1' },
    instagram: { main: '#E1306C', hover: '#b12b5b' },
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor:
          theme.palette.mode === 'light'
            ? theme.palette.grey[50]
            : theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderTop: `1px solid ${theme.palette.divider}`,
        // mt: 12,
        pt: 5,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Company */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Company
            </Typography>
            <Stack spacing={1.2}>
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Careers', href: '/careers' },
                { label: 'Team', href: '/team' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  underline="hover"
                  color="inherit"
                  sx={{
                    transition: 'color 0.2s ease',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Resources
            </Typography>
            <Stack spacing={1.2}>
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'FAQs', href: '/faqs' },
                { label: 'Help Center', href: '/help' },
                { label: 'Guides', href: '/guides' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  underline="hover"
                  color="inherit"
                  sx={{
                    transition: 'color 0.2s ease',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Legal
            </Typography>
            <Stack spacing={1.2}>
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'Security', href: '/security' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  underline="hover"
                  color="inherit"
                  sx={{
                    transition: 'color 0.2s ease',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter + Socials */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Stay Updated
            </Typography>

            {/* Newsletter */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} >
              <TextField
                fullWidth
                placeholder="Your email"
                size="small"
                variant="outlined"
                inputProps={{ 'aria-label': 'Email address' }}
                sx={{
                  flex: 1,
                  bgcolor:
                    theme.palette.mode === 'light'
                      ? theme.palette.common.white
                      : theme.palette.background.default,
                  borderRadius: 1,
                  input: { color: theme.palette.text.primary },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 2px 10px rgba(0,86,210,0.2)',
                  },
                }}
              >
                Subscribe
              </Button>
            </Stack>

            {/* Social Icons */}
            <Stack direction="row" spacing={1}>
              {[
                { href: 'https://linkedin.com', icon: <LinkedInIcon />, color: socialColors.linkedin },
                { href: 'https://twitter.com', icon: <TwitterIcon />, color: socialColors.twitter },
                { href: 'https://facebook.com', icon: <FacebookIcon />, color: socialColors.facebook },
                { href: 'https://instagram.com', icon: <InstagramIcon />, color: socialColors.instagram },
              ].map((social, i) => (
                <IconButton
                  key={i}
                  href={social.href}
                  target="_blank"
                  aria-label={`Visit our ${social.href.split('.')[1]} page`}
                  sx={{
                    color: social.color.main,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: social.color.hover,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, maxWidth: 240 }}
            >
              Get our latest updates and offers directly in your inbox.
            </Typography>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ borderTop: '1px solid', borderColor: theme.palette.divider, my: 3 }} />

        {/* Bottom Bar */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Part Time Match. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Sitemap', href: '/sitemap' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                underline="hover"
                color="inherit"
                sx={{
                  transition: 'color 0.2s ease',
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
