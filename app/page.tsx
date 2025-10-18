'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import JobCard from '../components/JobCard'; // assuming JobCard exists
import { useAuthContext } from '@/contexts/AuthContext';

const categories = [
  { title: 'Web Development', icon: <WorkOutlineIcon /> },
  { title: 'Graphic Design', icon: <PeopleOutlineIcon /> },
  { title: 'Writing', icon: <WorkOutlineIcon /> },
  { title: 'Marketing', icon: <PeopleOutlineIcon /> },
];

const featuredJobs = [
  {
    id: '1',
    title: 'React Developer Needed for E-commerce Site',
    company: 'TechVerse',
    location: 'Remote',
    salary: '$25-$40/hr',
    tags: ['React', 'Next.js', 'TypeScript'],
    postedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Content Writer for Blog Series',
    company: 'WordCraft',
    location: 'Remote',
    salary: '$15/hr',
    tags: ['Writing', 'SEO', 'Blog'],
    postedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Graphic Designer – Logo & Branding',
    company: 'PixelHub',
    location: 'Remote',
    salary: '$20/hr',
    tags: ['Photoshop', 'Illustrator'],
    postedAt: new Date().toISOString(),
  },
];

export default function HomePage() {
  const router = useRouter();
  const { token, user } = useAuthContext();

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('searchQuery')?.toString().trim();
    if (query) router.push(`/jobs?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    if (user || token) {
      if (user?.role === 'jobseeker') {
        router.push('jsk/dashboard');
      } else {
        router.push('em/dashboard')
      }
    }
  });

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* HERO */}
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          py: { xs: 8, md: 12 },
        }}
      >
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.3 }}
          >
            Find Your <Box component="span" color="primary.main">Perfect Part-Time</Box> Job
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
            Join thousands of professionals finding flexible, remote, and local work that fits their lifestyle.
          </Typography>
          <Box
            component="form"
            onSubmit={onSearch}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              maxWidth: 600,
            }}
          >
            <TextField
              name="searchQuery"
              placeholder="Search jobs, skills, or companies"
              fullWidth
              variant="outlined"
              sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" size="large" sx={{ px: 5, borderRadius: 3 }}>
              Search
            </Button>
          </Box>
        </Box>

        {/* Optional illustration */}
        <Box
          component="img"
          src="/hero-illustration.svg"
          alt="Freelancer working"
          sx={{ flex: 1, maxWidth: 400, mt: { xs: 5, md: 0 }, mx: 'auto' }}
        />
      </Container>

      {/* POPULAR CATEGORIES */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
            Explore Popular Categories
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {categories.map(({ title, icon }) => (
              <Grid size={{ xs: 12, md: 3, sm: 6 }} key={title}>
                <motion.div whileHover={{ y: -6 }}>
                  <Card
                    onClick={() =>
                      router.push(`/jobs?category=${encodeURIComponent(title)}`)
                    }
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 4,
                      textAlign: 'center',
                      p: 3,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.08)' },
                    }}
                  >
                    <Stack alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 60, height: 60 }}>
                        {icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        {title}
                      </Typography>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FEATURED JOBS */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>
          Featured Jobs
        </Typography>
        {featuredJobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </Container>

      {/* WHY CHOOSE SECTION */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
            Why Choose <Box component="span" color="primary.main">Part Time Match?</Box>
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Verified Employers',
                icon: <SecurityIcon color="primary" />,
                desc: 'All companies are vetted to ensure reliable and secure job postings.',
              },
              {
                title: 'Flexible Hours',
                icon: <AccessTimeIcon color="primary" />,
                desc: 'Choose jobs that fit your schedule, from short gigs to long-term work.',
              },
              {
                title: 'Fast Growth',
                icon: <TrendingUpIcon color="primary" />,
                desc: 'Build your experience, grow your profile, and unlock better opportunities.',
              },
            ].map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                <Stack alignItems="center" textAlign="center" spacing={2}>
                  {item.icon}
                  <Typography variant="h6" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.desc}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box
        sx={{
          py: 10,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #6fda44, #3ac569)',
          color: '#fff',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} mb={3}>
            Ready to Find Your Next Job?
          </Typography>
          <Typography variant="h6" mb={4}>
            Join Part Time Match today and start connecting with employers in minutes.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#fff',
              color: 'primary.main',
              fontWeight: 700,
              px: 6,
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
            onClick={() => router.push('/register')}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
