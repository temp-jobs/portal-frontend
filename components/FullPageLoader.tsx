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
    <Fade in={open} timeout={400} unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <CircularProgress
          size={50}
          thickness={3}
          sx={{
            color: 'primary.main',
            mb: 3,
            animation: 'spin 1.2s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            color: 'text.primary',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default FullScreenLoader;
