'use client';

import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import HowItWorkSection from '../components/HowItWorkSection';
import FeaturesSection from '../components/FeaturesSection';
import { Box, Button, Container, Typography, TextField, InputAdornment, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

// Icons
import WorkIcon from '@mui/icons-material/Work';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ComputerIcon from '@mui/icons-material/Computer';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BrushIcon from '@mui/icons-material/Brush';
import BuildIcon from '@mui/icons-material/Build';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EventIcon from '@mui/icons-material/Event';

export default function HomePage() {
  const router = useRouter();
  const theme = useTheme();
 const [heroIcons, setHeroIcons] = useState<React.ReactElement[]>([]);


  // Generate hero icons positions safely on client
  useEffect(() => {
    const icons = [
      <WorkIcon key="work" />,
      <LaptopMacIcon key="laptop" />,
      <DescriptionIcon key="desc" />,
      <BusinessCenterIcon key="briefcase" />,
      <AccountCircleIcon key="user" />,
    ];

    const positionedIcons = icons.map((Icon, i) => {
      const top = Math.random() * 80 + 10;
      const left = Math.random() * 80 + 10;
      return (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            color: 'rgba(255,255,255,0.2)',
            fontSize: { xs: 40, sm: 60 },
            animation: `float${i} 12s ease-in-out infinite`,
          }}
        >
          {Icon}
        </Box>
      );
    });

    setHeroIcons(positionedIcons);
  }, []);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('searchQuery')?.toString().trim();
    if (query) router.push(`/jobs?search=${encodeURIComponent(query)}`);
  };

  // Categories (exact same UI you gave)
  const categories = [
    { name: 'Retail & Sales', icon: <LocalMallIcon /> },
    { name: 'IT & Software', icon: <ComputerIcon /> },
    { name: 'Education', icon: <SchoolIcon /> },
    { name: 'Hospitality', icon: <RestaurantIcon /> },
    { name: 'Design & Creative', icon: <BrushIcon /> },
    { name: 'Construction', icon: <BuildIcon /> },
    { name: 'Digital Marketing', icon: <DesignServicesIcon /> },
    { name: 'Social Work', icon: <VolunteerActivismIcon /> },
    { name: 'Events & Management', icon: <EventIcon /> },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: { xs: '90vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f0fdf4,rgb(30, 134, 113))',
        }}
      >
        {/* Floating Icons Layer */}
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
          {heroIcons}

          <style jsx global>{`
            @keyframes float0 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(-20px,30px) rotate(10deg);} }
            @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(25px,-25px) rotate(-8deg);} }
            @keyframes float2 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(-15px,-20px) rotate(6deg);} }
            @keyframes float3 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(30px,20px) rotate(-6deg);} }
            @keyframes float4 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(-25px,-30px) rotate(8deg);} }
          `}</style>
        </Box>

        {/* Hero Content */}
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, color: '#fff', mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}
          >
            Find Flexible Part-Time Jobs That Fit You
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.85)', mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Explore thousands of part-time, remote, and on-site opportunities — all tailored for students and professionals.
          </Typography>

          <Box component="form" onSubmit={onSearch} sx={{ display: 'flex', justifyContent: 'center', mb: 5, width: '100%' }}>
            <TextField
              name="searchQuery"
              placeholder="Search for part-time jobs, skills, or companies..."
              variant="outlined"
              fullWidth
              sx={{
                width: '100%',
                maxWidth: 640,
                borderRadius: '999px',
                background: '#fff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.22)' },
                '& .MuiInputBase-input': { color: 'black', padding: '14px 16px', fontSize: '1rem' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ ml: 2, borderRadius: '999px', px: 4, py: 1.5, fontWeight: 700, backgroundColor: theme.palette.primary.main }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ===== POPULAR CATEGORIES SECTION (unchanged UI) ===== */}
      <Box sx={{ py: 10, backgroundColor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                  Discover Jobs That <br />
                  <Typography component="span" sx={{ color: '#00A884' }}>
                    Fit Your Lifestyle
                  </Typography>
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontSize: '1.05rem', lineHeight: 1.7 }}>
                  Find the perfect part-time opportunities across industries — whether you love tech, teaching, design, or customer service.
                  Explore flexible roles that match your skills and schedule.
                </Typography>
              </Box>
            </Grid>

            <Grid  size={{ xs: 12, md: 8 }}>
              <Grid container spacing={3}>
                {categories.map((cat, index) => (
                  <Grid key={index}  size={{ xs: 6, sm: 4, md: 4 }}>
                    <Box
                      sx={{
                        height: 140,
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#00A884',
                          transform: 'translateY(-6px)',
                          boxShadow: '0 6px 18px rgba(0, 168, 132, 0.4)',
                          '& .MuiSvgIcon-root': { color: '#fff' },
                          '& .cat-name': { color: '#fff' },
                        },
                      }}
                    >
                      <Box sx={{ mb: 1 }}>{React.cloneElement(cat.icon, { sx: { fontSize: 40, color: '#00A884', transition: 'color 0.3s' } })}</Box>
                      <Typography className="cat-name" variant="subtitle1" fontWeight={600} color="text.primary">
                        {cat.name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES */}
      <FeaturesSection />

      {/* HOW IT WORKS */}
      <HowItWorkSection />

      {/* CTA SECTION */}
      <Box sx={{ position: 'relative', py: 16, textAlign: 'center', background: 'linear-gradient(135deg, #006b4f, #00A884, #00C9A7)', color: '#fff' }}>
        <Container maxWidth="sm">
          <Typography variant="h3" fontWeight={800} mb={3}>
            Get Your <span style={{ color: '#ffffff' }}>Instant Job</span> Today!
          </Typography>
          <Typography variant="h6" mb={5}>
            Join <b>Part Time Match</b> now and connect with top employers instantly. Your next opportunity is just a click away!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/register')}
            sx={{ bgcolor: '#fff', color: '#00A884', fontWeight: 700, px: 8, py: 1.5, borderRadius: '50px' }}
          >
            🚀 Get Started
          </Button>
        </Container>
      </Box>

      <Footer />
    </>
  );
}
