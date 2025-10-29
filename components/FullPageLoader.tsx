'use client';

import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface FullScreenLoaderProps {
  message?: string;
  open?: boolean; // control visibility
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message = 'Loading...',
  open = true,
}) => {
  return (
    <Fade in={open} timeout={300} unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255,255,255,0.85)'
              : 'rgba(17,24,39,0.85)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <CircularProgress
          size={50}
          thickness={4}
          sx={{
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default FullScreenLoader;
