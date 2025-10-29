'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useAuthContext } from '@/contexts/AuthContext';
import ViewApplicantsModal from './modals/ViewApplicantsModal';
import EditJobModal from './modals/EditJobModal';
import ViewJobModal from './modals/ViewJobModal';
import DashboardLayout from '@/components/dashboard/DashboardLayout';


interface Job {
  _id: string;
  title: string;
  location: string;
  status: 'Draft' | 'Active' | 'Closed';
  employer: { _id: string };
  description: string;
  type: string;
  experienceLevel: string;
  salaryType: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  benefits?: string[];
  skillsRequired?: string[];
  education?: string;
  openings?: number;
  deadline?: string;
  jobDuration?: string;
  createdAt: string;
}

export default function PostedJobsPage() {
  const { user, token } = useAuthContext();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/filter state
  const [searchTitle, setSearchTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  // Modal state
  const [viewApplicantsJob, setViewApplicantsJob] = useState<Job | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchJobs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/jobs`, { headers });
      const employerJobs = res.data.filter((job: Job) => job.employer?._id === user?.id);
      setJobs(employerJobs);
      setFilteredJobs(employerJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!token) return;
    try {
      await axios.delete(`${API_URL}/jobs/${jobId}`, { headers });
      fetchJobs();
      setDeleteJobId(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  // Filter/search effect
  useEffect(() => {
    let temp = [...jobs];
    if (searchTitle) {
      temp = temp.filter(job => job.title.toLowerCase().includes(searchTitle.toLowerCase()));
    }
    if (filterStatus) {
      temp = temp.filter(job => job.status === filterStatus);
    }
    setFilteredJobs(temp);
    setPage(1);
  }, [searchTitle, filterStatus, jobs]);

  const paginatedJobs = filteredJobs.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (!user) return <Typography>Please login to view jobs</Typography>;

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" mb={3}>
          Posted Jobs
        </Typography>

        {/* Filters */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
          <TextField
            fullWidth
            placeholder="Search by title"
            value={searchTitle}
            onChange={e => setSearchTitle(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center"><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2}>
            {paginatedJobs.length === 0 && (
              <Typography>No jobs found for your filters</Typography>
            )}
            {paginatedJobs.map(job => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job._id}>
                <Card sx={{ borderRadius: 2, p: 2, boxShadow: 7 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                    <Typography variant="caption" color="text.secondary">Status: {job.status}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<VisibilityIcon />} onClick={() => setViewJob(job)}>View</Button>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => setEditJob(job)}>Edit</Button>
                    <Button size="small" onClick={() => setViewApplicantsJob(job)}>Applicants</Button>
                    <Button size="small" startIcon={<DeleteIcon />} color="error" onClick={() => setDeleteJobId(job._id)}>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {filteredJobs.length > rowsPerPage && (
          <Box display="flex" justifyContent="center" mt={3} gap={1}>
            {Array.from({ length: Math.ceil(filteredJobs.length / rowsPerPage) }, (_, i) => (
              <Button key={i} variant={i + 1 === page ? 'contained' : 'outlined'} onClick={() => setPage(i + 1)}>
                {i + 1}
              </Button>
            ))}
          </Box>
        )}

        {/* Delete Confirmation */}
        <Dialog open={!!deleteJobId} onClose={() => setDeleteJobId(null)}>
          <DialogTitle>Delete Job</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this job? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteJobId(null)}>Cancel</Button>
            <Button color="error" onClick={() => deleteJobId && handleDeleteJob(deleteJobId)}>Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Modals */}
        <ViewApplicantsModal job={viewApplicantsJob} onClose={() => setViewApplicantsJob(null)} open={Boolean(viewApplicantsJob)} />
        <EditJobModal job={editJob} onClose={() => setEditJob(null)} onUpdated={fetchJobs} />
        <ViewJobModal job={viewJob} onClose={() => setViewJob(null)} />
      </Box>
    </DashboardLayout>
  );
}
