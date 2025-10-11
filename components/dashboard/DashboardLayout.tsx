'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import Sidebar from './Sidebar'; // small sidebar component included below

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid container spacing={0}>
      {/* Sidebar column */}
      <Grid
        size={{ xs: 12, sm: 3, md: 2 }}
        sx={{
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid',
          borderColor: 'divider',
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
          p: 2,
        }}
      >
        <Sidebar />
      </Grid>

      {/* Main content */}
      <Grid size={{ xs: 12, sm: 9, md: 10 }} sx={{ p: { xs: 2, md: 4 } }}>
        <Box>{children}</Box>
      </Grid>
    </Grid>
  );
}
