'use client';

import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function Sidebar() {
  const { user } = useAuthContext();
  const router = useRouter();

  if (!user) return null;

  const isEmployer = user.role === 'employer';
  const isJobseeker = user.role === 'jobseeker';

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      // textAlign="center"
      // height="100%"
      justifyContent="flex-start"
      sx={{ py: 3 }}
    >
      {/* Profile */}
      <Avatar
        sx={{
          width: 64,
          height: 64,
          bgcolor: 'primary.main',
          mb: 1.5,
          fontSize: 28,
        }}
      >
        {user?.companyName?.charAt(0).toUpperCase()}
      </Avatar>

      <Typography variant="subtitle1" fontWeight={600}>
        {isEmployer ? `${user.companyName}` : `${user.name}`}
      </Typography>
      <Typography variant="caption" color="text.secondary" mb={2}>
        {isEmployer ? 'Employer' : 'Job Seeker'}
      </Typography>

      <Divider sx={{ width: '100%', mb: 2 }} />

      {/* Dynamic navigation */}
      <Stack spacing={1} width="100%">
        {isEmployer && (
          <>
            <Button
              startIcon={<WorkOutlineIcon />}
              onClick={() => router.push('/em/jobs')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              My Jobs
            </Button>
            <Button
              startIcon={<AssignmentIndIcon />}
              onClick={() => router.push('/em/applicants')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Applicants
            </Button>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => router.push('/em/post')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Post a Job
            </Button>
            <Button
              startIcon={<ChatIcon />}
              onClick={() => router.push('/messages')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Messages
            </Button>
            <Button
              startIcon={<InsightsIcon />}
              onClick={() => router.push('/em/analytics')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Analytics
            </Button>
            <Button
              startIcon={<CurrencyRupeeIcon />}
              onClick={() => router.push('/em/wallet')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Wallet
            </Button>
          </>
        )}

        {isJobseeker && (
          <>
            <Button
              startIcon={<SearchIcon />}
              onClick={() => router.push('jsk/jobs')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Browse Jobs
            </Button>
            <Button
              startIcon={<FavoriteIcon />}
              onClick={() => router.push('jsk/saved-jobs')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Saved Jobs
            </Button>
            <Button
              startIcon={<AssignmentIndIcon />}
              onClick={() => router.push('jsk/applications')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              My Applications
            </Button>
            <Button
              startIcon={<ChatIcon />}
              onClick={() => router.push('/messages')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Messages
            </Button>
            <Button
              startIcon={<PersonIcon />}
              onClick={() => router.push('jsk/profile')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Profile
            </Button>
            <Button
              startIcon={<CurrencyRupeeIcon />}
              onClick={() => router.push('/jsk/wallet')}
              sx={{ justifyContent: 'center', textTransform: 'none' }}
            >
              Wallet
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
