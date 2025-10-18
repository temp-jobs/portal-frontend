'use client';

import React from 'react';
import { Grid, Box } from '@mui/material';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      container
      sx={{
        minHeight: '100vh',
        bgcolor: '#f9fafb',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Grid
        size={{ xs: 12, sm: 4, md: 2 }}
        sx={{
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: '#ffffff',
          px: 2,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          position: { md: 'sticky' },
          top: 0,
          height: { md: '100vh', xs: 'auto' },
        }}
      >
        <Sidebar />
      </Grid>

      {/* Main content */}
      <Grid
        size={{ xs: 12, sm: 8, md: 10 }}
        sx={{
          p: { xs: 2, md: 4 },
          height: '100vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box flexGrow={1}>{children}</Box>
      </Grid>
    </Grid>
  );
}
