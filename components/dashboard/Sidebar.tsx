'use client';

import React from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const { user } = useAuthContext();
  const router = useRouter();

  if (!user) return null; // ✅ Prevents hydration mismatch if user is undefined on first render

  return (
    <Box>
      {/* User Info Section */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
          {user.companyName?.[0] ?? user.name?.[0] ?? 'C'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {user.companyName || user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : ''}
          </Typography>
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <Box display="flex" flexDirection="column" gap={1}>
        {user.role === 'employer' && (
          <>
            <Button
              onClick={() => router.push('/post-job')}
              variant="text"
              startIcon={<AddCircleOutlineIcon />}
              sx={{ justifyContent: 'flex-start' }}
            >
              Post a Job
            </Button>

            <Button
              onClick={() => router.push('/my-jobs')}
              variant="text"
              startIcon={<BusinessIcon />}
              sx={{ justifyContent: 'flex-start' }}
            >
              My Jobs
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
