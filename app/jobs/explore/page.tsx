'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// ---------- Types ----------
interface Category {
  title: string;
  subcategories: string[];
}

interface ExploreTile {
  title: string;
  jobs: number;
  icon: React.ReactNode;
}

// ---------- Mock Data ----------
const categories: Category[] = [
  {
    title: 'Development & IT',
    subcategories: [
      'Web Development',
      'Mobile App Development',
      'Game Development',
      'DevOps Engineering',
      'AI & Machine Learning',
    ],
  },
  {
    title: 'Design & Creative',
    subcategories: [
      'Graphic Design',
      'UX/UI Design',
      'Video Editing',
      'Animation',
      '3D Modeling',
    ],
  },
  {
    title: 'Writing & Translation',
    subcategories: [
      'Content Writing',
      'Copywriting',
      'Technical Writing',
      'Translation',
      'Proofreading & Editing',
    ],
  },
  {
    title: 'Sales & Marketing',
    subcategories: [
      'Digital Marketing',
      'SEO',
      'Lead Generation',
      'Social Media Marketing',
    ],
  },
];

const exploreTiles: ExploreTile[] = [
  { title: 'Web Developers', jobs: 1200, icon: <CodeIcon /> },
  { title: 'Graphic Designers', jobs: 845, icon: <DesignServicesIcon /> },
  { title: 'Writers & Editors', jobs: 650, icon: <EditNoteIcon /> },
  { title: 'Translators', jobs: 340, icon: <TranslateIcon /> },
  { title: 'IT Support Specialists', jobs: 415, icon: <SupportAgentIcon /> },
  { title: 'AI Engineers', jobs: 270, icon: <WorkOutlineIcon /> },
];

const filters = [
  'Remote Only',
  'Fixed Price',
  'Hourly',
  'Entry Level',
  'Intermediate',
  'Expert',
];

export default function ExploreJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* ---------- Header ---------- */}
      <Typography variant="h3" fontWeight="bold" mb={1}>
        Explore Jobs
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Browse jobs by category or skill specialization.
      </Typography>

      {/* ---------- Search + Filters ---------- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <TextField
          placeholder="Search job titles, skills, or categories"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              clickable
              onClick={() => toggleFilter(filter)}
              color={activeFilters.includes(filter) ? 'primary' : 'default'}
              variant={activeFilters.includes(filter) ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 2,
                fontWeight: activeFilters.includes(filter) ? 600 : 400,
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* ---------- Layout Container ---------- */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* ---------- Sidebar ---------- */}
        <Box
          sx={{
            flex: { xs: '1', md: '0 0 280px' },
            bgcolor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 3,
            p: 3,
            height: 'fit-content',
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Categories
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {categories.map((cat) => (
            <Box key={cat.title} mb={3}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {cat.title}
              </Typography>
              <List dense disablePadding>
                {cat.subcategories.map((sub) => (
                  <ListItemButton
                    key={sub}
                    sx={{
                      borderRadius: 2,
                      pl: 2,
                      py: 0.8,
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <ListItemText primary={sub} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* ---------- Main Content ---------- */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Popular Specializations
          </Typography>
          <Grid container spacing={3}>
            {exploreTiles.map((item) => (
              <Grid
                key={item.title}
                size={{ xs: 12, sm: 6, md: 4 }} // ✅ per your preferred grid layout
              >
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 3,
                    transition: 'all 0.25s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.jobs} jobs available
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
