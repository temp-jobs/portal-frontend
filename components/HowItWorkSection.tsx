'use client';

import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, useTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import { keyframes } from '@emotion/react';

const dashFlow = keyframes`
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -60; }
`;

export default function HowItWorksSection() {
  const theme = useTheme();
  const [activeFlow, setActiveFlow] = useState<'jobseeker' | 'jobprovider'>('jobseeker');

  const cardWidth = 260;
  const cardHeight = 300;

  const jobSeekerSteps = [
    { Icon: AccountCircleIcon, title: 'Create Profile', desc: 'Sign up and build a profile to showcase your skills.' },
    { Icon: SearchIcon, title: 'Find Jobs', desc: 'Browse and apply for part-time jobs that fit your skills.' },
    { Icon: ChatIcon, title: 'Connect Instantly', desc: 'Chat with employers and receive job offers quickly.' },
    { Icon: WorkIcon, title: 'Start Working', desc: 'Get hired and start your flexible work journey.' },
  ];

  const jobProviderSteps = [
    { Icon: BusinessIcon, title: 'Post Job', desc: 'Create a job post to attract top talent.' },
    { Icon: SearchIcon, title: 'Find Candidates', desc: 'Browse profiles and shortlist candidates efficiently.' },
    { Icon: ChatIcon, title: 'Interview & Hire', desc: 'Chat and hire the best fit quickly.' },
    { Icon: AddCircleIcon, title: 'Manage Workforce', desc: 'Track and manage part-time employees easily.' },
  ];

  const renderFlow = (steps: typeof jobSeekerSteps) => (
    <>
      <Box
        component="svg"
        viewBox="0 0 1200 150"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: { xs: 120, md: 150 },
          zIndex: 0,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <path
          d="M50,120 C300,30 900,120 1150,50"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          strokeDasharray="8"
          fill="transparent"
          style={{ animation: `${dashFlow} 4s linear infinite` }}
        />
      </Box>

      <Grid container spacing={{ xs: 3, sm: 4 }} justifyContent="center" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1, mt: { xs: 8, md: 10 } }}>
        {steps.map((step, index) => {
          const { Icon } = step;
          return (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <Paper
                elevation={4}
                sx={{
                  width: { xs: '90%', sm: cardWidth },
                  height: cardHeight,
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  textAlign: 'center',
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: `0 8px 30px ${theme.palette.primary.main}20`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0 12px 40px ${theme.palette.primary.main}40`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    mx: 'auto',
                    mb: 3,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.common.white,
                    boxShadow: `0 0 15px ${theme.palette.primary.main}40`,
                    flexShrink: 0,
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                  {step.desc}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );

  return (
    <Box sx={{ py: { xs: 10, md: 16 }, position: 'relative', overflow: 'hidden', background: theme.palette.mode === 'light' ? theme.palette.background.default : theme.palette.background.paper }}>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: { xs: 4, md: 6 },
          gap: { xs: 3, md: 0 },
        }}
      >
        <Typography component="h1" variant="h3" fontWeight={900} sx={{ flex: 1, minWidth: 280, fontSize: { xs: '2rem', md: '3rem' } }}>
          How <Box component="span" sx={{ color: theme.palette.primary.main }}>It Works</Box>
        </Typography>

        <Box
          sx={{
            width: { xs: '100%', sm: 260 },
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.light + '20' : theme.palette.primary.dark + '20',
            display: 'flex',
            position: 'relative',
            cursor: 'pointer',
            userSelect: 'none',
            mt: { xs: 2, md: 0 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: activeFlow === 'jobseeker' ? 0 : '50%',
              width: '50%',
              height: '100%',
              borderRadius: 20,
              backgroundColor: theme.palette.primary.main,
              transition: 'left 0.3s',
            }}
          />
          <Box
            onClick={() => setActiveFlow('jobseeker')}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              color: activeFlow === 'jobseeker' ? theme.palette.common.white : theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            Job Seeker
          </Box>
          <Box
            onClick={() => setActiveFlow('jobprovider')}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              color: activeFlow === 'jobprovider' ? theme.palette.common.white : theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            Job Provider
          </Box>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.7 }}>
          Explore the step-by-step journey of our platform. Whether you are a job seeker looking to land your dream part-time job, or a job provider seeking top talent, our process is designed to be simple, fast, and effective.
        </Typography>
      </Container>

      <Box sx={{ position: 'relative' }}>
        {activeFlow === 'jobseeker' ? renderFlow(jobSeekerSteps) : renderFlow(jobProviderSteps)}
      </Box>
    </Box>
  );
}
