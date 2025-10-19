'use client';

import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Avatar, useTheme } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import LanguageIcon from '@mui/icons-material/Language';

const featuresData = [
  { title: 'AI-Powered Matching', description: 'Our intelligent system analyzes your skills and goals to connect the right job seekers with the right employers effortlessly.', icon: AutoAwesomeIcon },
  { title: 'Verified Employers & Candidates', description: 'Every profile is verified to ensure trust, authenticity, and safety in hiring and job applications.', icon: VerifiedUserIcon },
  { title: 'Skill-Based Discovery', description: 'We focus on actual skills — discover opportunities based on talent and experience, not just keywords.', icon: EmojiObjectsIcon },
  { title: 'Faster Hiring Process', description: 'Streamlined workflows and smart tools ensure hiring and applications happen faster and more effectively.', icon: RocketLaunchIcon },
  { title: 'Work Experience Insights', description: 'Employers can see meaningful skill summaries from portfolios, helping make better decisions.', icon: WorkHistoryIcon },
  { title: 'Global Talent Reach', description: 'Access and connect across borders — empowering opportunities without boundaries.', icon: LanguageIcon },
];

export default function FeaturesSection() {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => { setClientReady(true); }, []);

  useEffect(() => {
    if (!clientReady || paused) return;
    const interval = setInterval(() => setActiveIndex(prev => (prev + 1) % featuresData.length), 5000);
    return () => clearInterval(interval);
  }, [paused, clientReady]);

  const handleCardClick = (index: number) => {
    setPaused(true);
    setActiveIndex(index);
    setTimeout(() => setPaused(false), 7000);
  };

  if (!clientReady) return <Box sx={{ height: '90vh' }} />;

  return (
    <Box
      sx={{
        position: 'relative',
        height: '90vh',
        overflow: 'hidden',
        mt: -2,
        pt: 2,
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(180deg, #f0fdf9 0%, #e0f7f1 100%)'
          : 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
      }}
    >
      <Grid container size={{ xs: 12, md: 12 }} sx={{ height: '100vh', px: { xs: 2, md: 6 }, pt: { xs: 6, md: 6 } }}>
        {/* LEFT — Feature Cards */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ position: 'relative', height: 420, mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          {featuresData.map((feature, index) => {
            const diff = (index - activeIndex + featuresData.length) % featuresData.length;
            if (diff >= 3) return null;

            const translateY = diff * 90;
            const scale = Math.max(1 - diff * 0.08, 0.85);
            const opacity = diff < 3 ? 1 - diff * 0.2 : 0;
            const zIndex = featuresData.length - diff;
            const isActive = index === activeIndex;
            const blur = diff === 2 ? 'blur(3px)' : diff === 1 ? 'blur(1px)' : 'none';
            const Icon = feature.icon;

            return (
              <Card
                key={index}
                onClick={() => handleCardClick(index)}
                sx={{
                  position: 'absolute',
                  width: '70%',
                  height: 350,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  transition: 'transform 0.8s cubic-bezier(0.25,1,0.25,1), opacity 0.6s ease, box-shadow 0.4s, filter 0.4s',
                  opacity,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: isActive
                    ? `0 0 25px ${theme.palette.primary.main}80, 0 8px 20px rgba(0,0,0,0.15)`
                    : '0 6px 16px rgba(0,0,0,0.1)',
                  borderRadius: 4,
                  p: 3,
                  zIndex,
                  filter: blur,
                  border: isActive ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                  '&:hover': { transform: `translateY(${translateY - 10}px) scale(${scale + 0.02})`, boxShadow: `0 14px 28px ${theme.palette.primary.main}20` },
                }}
              >
                <CardContent>
                  <Avatar sx={{ width: 60, height: 60, bgcolor: theme.palette.primary.light + '20', margin: '0 auto 14px' }}>
                    <Icon sx={{ fontSize: 38, color: theme.palette.primary.main }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} color={theme.palette.primary.main} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Grid>

        {/* RIGHT — Info & CTA */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ pl: { md: 6 }, textAlign: { xs: 'center', md: 'left' }, mt: { xs: 5, md: 4 } }}>
          <Typography variant="h2" fontWeight={800} color={theme.palette.primary.main} mb={1.5} sx={{ letterSpacing: '-0.5px' }}>
            Experience the Future of Smart Hiring
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3} sx={{ maxWidth: 500, lineHeight: 1.6 }}>
            Discover a platform where innovation meets opportunity — connecting talent
            and employers with intelligence, speed, and trust. Start exploring the next
            generation of hiring today.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = '/register')}
            sx={{
              borderRadius: '30px',
              px: 5,
              py: 1.3,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: `0 6px 18px ${theme.palette.primary.main}30`,
              transition: 'all 0.3s ease',
              '&:hover': { boxShadow: `0 10px 24px ${theme.palette.primary.main}40`, transform: 'translateY(-2px)' },
            }}
          >
            Try Our Platform
          </Button>
        </Grid>
      </Grid>

      <style jsx global>{`
        @keyframes glowBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
}
