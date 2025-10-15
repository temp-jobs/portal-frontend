'use client';

import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack, IconButton, TextField, Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f7f9fa',
        color: 'text.secondary',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 12,
        pt: 10,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Top Grid Links + Newsletter */}
        <Grid container spacing={6}>
          {/* Company */}
          <Grid size={{xs:12,sm:6 ,md:3}}>
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
              <Link href="/team" underline="hover" color="inherit">
                Team
              </Link>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid size={{xs:12,sm:6 ,md:3}}>
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
              <Link href="/guides" underline="hover" color="inherit">
                Guides
              </Link>
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid size={{xs:12,sm:6 ,md:3}}>
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
              <Link href="/security" underline="hover" color="inherit">
                Security
              </Link>
            </Stack>
          </Grid>

          {/* Newsletter + Socials */}
          <Grid size={{xs:12,sm:6 ,md:3}}>
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
              Stay Updated
            </Typography>

            {/* Newsletter */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mb={2}>
              <TextField
                placeholder="Your email"
                size="small"
                variant="outlined"
                sx={{ flex: 1, bgcolor: '#fff', borderRadius: 1 }}
              />
              <Button variant="contained" color="primary" sx={{ px: 3 }}>
                Subscribe
              </Button>
            </Stack>

            {/* Socials */}
            <Stack direction="row" spacing={1}>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                sx={{ color: '#0A66C2', '&:hover': { bgcolor: 'transparent', color: '#004182' } }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                sx={{ color: '#1DA1F2', '&:hover': { bgcolor: 'transparent', color: '#0d95e8' } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                sx={{ color: '#1877F2', '&:hover': { bgcolor: 'transparent', color: '#0d47a1' } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://instagram.com"
                target="_blank"
                sx={{ color: '#E1306C', '&:hover': { bgcolor: 'transparent', color: '#b12b5b' } }}
              >
                <InstagramIcon />
              </IconButton>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Get our latest updates and offers directly in your inbox.
            </Typography>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ borderTop: '1px solid #ddd', my: 6 }} />

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
