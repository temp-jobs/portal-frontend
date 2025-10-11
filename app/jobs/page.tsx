'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Pagination,
  Grid,
  Chip,
  Divider,
  Checkbox,
  FormControlLabel,
  Paper,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import JobCard from '../../components/JobCard';

// --------------------
// Mock Job Data
// --------------------
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  tags?: string[];
  postedAt: string;
  category: string;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'React Developer for SaaS Dashboard',
    company: 'TechNova Labs',
    location: 'Remote',
    salary: '$25 - $35/hr',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    category: 'Web Development',
  },
  {
    id: '2',
    title: 'Creative Graphic Designer Needed',
    company: 'PixelCraft Studio',
    location: 'Bangalore, India',
    salary: 'Fixed: $300',
    tags: ['Figma', 'Illustrator', 'Logo Design'],
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    category: 'Graphic Design',
  },
  {
    id: '3',
    title: 'Blog Writer for Tech Website',
    company: 'WordFlow Media',
    location: 'Remote',
    salary: '$15/hr',
    tags: ['Writing', 'SEO', 'Copywriting'],
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    category: 'Writing',
  },
  {
    id: '4',
    title: 'Social Media Marketing Expert',
    company: 'BrightBuzz Agency',
    location: 'Delhi, India',
    salary: '$20/hr',
    tags: ['Instagram Ads', 'Brand Strategy', 'Content Calendar'],
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    category: 'Marketing',
  },
  {
    id: '5',
    title: 'Backend Developer with Node.js',
    company: 'CodeForge',
    location: 'Remote',
    salary: '$30/hr',
    tags: ['Node.js', 'Express', 'PostgreSQL'],
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    category: 'Web Development',
  },
];

const categories = ['Web Development', 'Graphic Design', 'Writing', 'Marketing'];
const jobTypes = ['Hourly', 'Fixed Price'];

export default function JobsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

  const jobsPerPage = 5;

  const filterJobs = (pageNumber = 1, search = '', cat = '') => {
    setLoading(true);
    setTimeout(() => {
      let filtered = mockJobs;

      if (search)
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.company.toLowerCase().includes(search.toLowerCase()) ||
            j.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        );

      if (cat)
        filtered = filtered.filter(
          (j) => j.category.toLowerCase() === cat.toLowerCase()
        );

      if (selectedCategories.length)
        filtered = filtered.filter((j) =>
          selectedCategories.includes(j.category)
        );

      const total = filtered.length;
      const startIndex = (pageNumber - 1) * jobsPerPage;
      const paginated = filtered.slice(startIndex, startIndex + jobsPerPage);

      setJobs(paginated);
      setTotalPages(Math.ceil(total / jobsPerPage));
      setPage(pageNumber);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    filterJobs(1, searchQuery, categoryQuery);
  }, [searchQuery, categoryQuery, selectedCategories, selectedJobTypes]);

  const handlePageChange = (_: any, value: number) => {
    filterJobs(value, searchTerm, categoryQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterJobs(1, searchTerm);
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Search Bar */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          alignItems: 'center',
          bgcolor: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search for jobs (e.g. React Developer, Writer)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained" sx={{ px: 4 }}>
          Search
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar Filters */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Filters
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold" mt={2}>
              Category
            </Typography>
            {categories.map((cat) => (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                }
                label={cat}
              />
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight="bold">
              Job Type
            </Typography>
            {jobTypes.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedJobTypes.includes(type)}
                    onChange={() =>
                      setSelectedJobTypes((prev) =>
                        prev.includes(type)
                          ? prev.filter((t) => t !== type)
                          : [...prev, type]
                      )
                    }
                  />
                }
                label={type}
              />
            ))}
          </Paper>
        </Grid>

        {/* Job Listings */}
        <Grid item xs={12} md={9}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {loading
              ? 'Loading jobs...'
              : `${jobs.length} Job${jobs.length !== 1 ? 's' : ''} Found`}
          </Typography>

          {jobs.map((job) => (
            <Paper
              key={job.id}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': { borderColor: 'primary.main', boxShadow: 3 },
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: 'primary.main', cursor: 'pointer' }}
              >
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {job.company} • {job.location}
              </Typography>
              <Typography variant="body2" fontWeight="bold" mb={1}>
                {job.salary}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                {job.tags?.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Posted {Math.floor((Date.now() - new Date(job.postedAt).getTime()) / 86400000)} day
                ago
              </Typography>
            </Paper>
          ))}

          {totalPages > 1 && (
            <Stack alignItems="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
