'use client';

import React from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <Grid container sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      {/* Sidebar */}
      <Grid
        size={{ xs: 12, sm: 4, md: 2 }}
        sx={{
          borderRight: '1px solid',
          borderColor: theme.palette.divider,
          bgcolor: theme.palette.mode === 'light' ? theme.palette.background.paper : '#1A1A1A',
          px: 2,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          position: { md: 'sticky' },
          top: 0,
          height: { md: '100vh', xs: 'auto' },
          transition: 'background 0.3s ease',
        }}
      >
        <Sidebar />
      </Grid>

      {/* Main content */}
      <Grid
        size={{ xs: 12, sm: 8, md: 10 }}
        sx={{
          p: { xs: 2, md: 4 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <Box flexGrow={1}>{children}</Box>
      </Grid>
    </Grid>
  );
}
