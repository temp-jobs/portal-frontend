'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InsightsIcon from '@mui/icons-material/Insights';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  totalApplications?: number;
  status?: 'open' | 'closed';
}

interface Applicant {
  _id: string;
  name: string;
  email?: string;
  skills: string[];
  status: 'pending' | 'shortlisted' | 'rejected';
  job: string;
}

export default function EmployerDashboard() {
  const { user, token } = useAuthContext();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // already includes /api/v1

  // 🧠 Fetch Jobs + Applicants
  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        // 1️⃣ Fetch all jobs
        const jobsRes = await axios.get(`${API_URL}/employer/dashboard`, { headers });
        const jobList = jobsRes.data;
        setJobs(jobList);

        // 2️⃣ Fetch applicants for all jobs
        const jobIds = jobList.map((j: any) => j._id);
        const applicantReqs = jobIds.map((id: string) =>
          axios.get(`${API_URL}/employer/dashboard/${id}/applicants`, { headers })
        );
        const applicantRes = await Promise.all(applicantReqs);
        const applicantsData = applicantRes.flatMap((r) => r.data);
        setApplicants(applicantsData);
      } catch (err) {
        console.error('Employer dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  // ✳️ Shortlist candidate
  const handleShortlist = async (applicationId: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.put(
        `${API_URL}/employer/dashboard/shortlist/${applicationId}`,
        {},
        { headers }
      );
      // Update state instantly
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === applicationId ? { ...a, status: 'shortlisted' } : a
        )
      );
      console.log(res.data.message);
    } catch (err) {
      console.error('Shortlist error:', err);
      alert('Failed to shortlist candidate');
    }
  };

  // 💬 Initiate chat
  const handleChat = async (applicantId: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        `${API_URL}/employer/dashboard/initiate-chat/${applicantId}`,
        {},
        { headers }
      );
      router.push(`/chat/${res.data.roomId}`);
    } catch (err: any) {
      console.error('Chat initiation error:', err);
      alert(err.response?.data?.message || 'Unable to start chat');
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6">Please login to view your dashboard</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalJobs = jobs.length;
  const totalApplicants = applicants.length;
  const shortlisted = applicants.filter((a) => a.status === 'shortlisted').length;
  const openJobs = jobs.filter((j) => j.status !== 'closed').length;

  return (
    // <Grid container sx={{ height: '100vh' }}>
    <DashboardLayout>

      {/* Main Content */}
      <Grid size={{ xs: 12, md: 10 }} sx={{ overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.light' }}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Welcome, {user.name}
          </Typography>
          <Typography variant="body1" color="text.primary">
            Manage your job postings, track applicants, and connect with candidates.
          </Typography>
        </Paper>

        {/* Dashboard Overview */}
        <Grid container spacing={2}>
          {[
            { label: 'Total Jobs', value: totalJobs },
            { label: 'Open Jobs', value: openJobs },
            { label: 'Applicants', value: totalApplicants },
            { label: 'Shortlisted', value: shortlisted },
          ].map((stat, i) => (
            <Grid size={{ xs: 6, sm: 3 }} key={i}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Job Cards */}
        <Typography variant="h6" fontWeight={600}>
          My Job Postings
        </Typography>
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid size={{ xs: 12, sm: 6 }} key={job._id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  '&:hover': { boxShadow: 6, transform: 'scale(1.01)', transition: '0.3s' },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      {job.title}
                    </Typography>
                    <Chip
                      label={job.status === 'closed' ? 'Closed' : 'Open'}
                      color={job.status === 'closed' ? 'default' : 'success'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.primary" mb={1} display="flex" alignItems="center">
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} /> {job.location}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {job.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button size="small" variant="contained" onClick={() => router.push(`/employer/jobs/${job._id}`)}>
                    View Applicants
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => router.push(`/employer/jobs/edit/${job._id}`)}>
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Applicants Section */}
        <Typography variant="h6" fontWeight={600} mt={3}>
          Recent Applicants
        </Typography>
        {applicants.length === 0 ? (
          <Typography color="text.primary">No applications yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {applicants.slice(0, 4).map((app) => (
              <Grid size={{ xs: 12, sm: 6 }} key={app._id}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {app.name}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {app.skills.join(', ')}
                    </Typography>
                    <Chip
                      label={app.status}
                      color={
                        app.status === 'shortlisted'
                          ? 'success'
                          : app.status === 'rejected'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    {app.status !== 'shortlisted' ? (
                      <Button size="small" variant="outlined" onClick={() => handleShortlist(app._id)}>
                        Shortlist
                      </Button>
                    ) : (
                      <Button size="small" variant="contained" onClick={() => handleChat(app._id)}>
                        Chat
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </DashboardLayout>
  );
}
