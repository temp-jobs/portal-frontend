'use client';

import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Stack } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.secondary',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 8,
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Top Grid Links */}
        <Grid container spacing={4} justifyContent="space-between">
          {/* Company */}
          <Grid size={{xs: 12, md: 6, sm: 3}}>
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
              Company
            </Typography>
            <Stack spacing={1}>
              <Link href="/about" underline="hover" color="inherit">
                About Us
              </Link>
              <Link href="/contact" underline="hover" color="inherit">
                Contact
              </Link>
              <Link href="/careers" underline="hover" color="inherit">
                Careers
              </Link>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid size={{xs: 12, md: 6, sm: 3}}>
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Stack spacing={1}>
              <Link href="/blog" underline="hover" color="inherit">
                Blog
              </Link>
              <Link href="/faqs" underline="hover" color="inherit">
                FAQs
              </Link>
              <Link href="/help" underline="hover" color="inherit">
                Help Center
              </Link>
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid size={{xs: 12, md: 6, sm: 3}}>
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Stack spacing={1}>
              <Link href="/privacy" underline="hover" color="inherit">
                Privacy Policy
              </Link>
              <Link href="/terms" underline="hover" color="inherit">
                Terms of Service
              </Link>
              <Link href="/cookies" underline="hover" color="inherit">
                Cookie Policy
              </Link>
            </Stack>
          </Grid>

          {/* Socials */}
          <Grid size={{xs: 12, md: 6, sm: 3}}>
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Stack spacing={1}>
              <Link href="https://linkedin.com" target="_blank" underline="hover" color="inherit">
                LinkedIn
              </Link>
              <Link href="https://twitter.com" target="_blank" underline="hover" color="inherit">
                Twitter / X
              </Link>
              <Link href="https://facebook.com" target="_blank" underline="hover" color="inherit">
                Facebook
              </Link>
            </Stack>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

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
            <Link href="/privacy" underline="hover" color="inherit">
              Privacy
            </Link>
            <Link href="/terms" underline="hover" color="inherit">
              Terms
            </Link>
            <Link href="/sitemap" underline="hover" color="inherit">
              Sitemap
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
