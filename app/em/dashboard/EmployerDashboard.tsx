'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EditJobModal from '../jobs/modals/EditJobModal';
import ViewApplicantsModal from '../jobs/modals/ViewApplicantsModal';
import { Job } from '@/types/job';

interface Applicant {
  _id: string;
  name: string;
  skills: string[];
  status: 'pending' | 'shortlisted' | 'rejected';
  job: string;
}

interface ChatPreview {
  _id: string;
  chatId: string;
  partnerId: string;
  partnerName: string;
  jobTitle: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function EmployerDashboard() {
  const { user, token } = useAuthContext();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewApplicantsJob, setViewApplicantsJob] = useState<Job | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [chats, setChats] = useState<ChatPreview[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch Jobs, Applicants, and Chats
  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, chatsRes] = await Promise.all([
          axios.get(`${API_URL}/employer/dashboard`, { headers }),
          axios.get(`${API_URL}/chats/user`, { headers }),
        ]);

        const jobList: Job[] = jobsRes.data;
        setJobs(jobList);

        const applicantReqs = jobList.map((j) =>
          axios.get(`${API_URL}/employer/dashboard/${j._id}/applicants`, { headers })
        );
        const applicantRes = await Promise.all(applicantReqs);
        const applicantsData = applicantRes.flatMap((r) => r.data);
        setApplicants(applicantsData);

        setChats(chatsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const handleShortlist = async (applicationId: string) => {
    try {
      await axios.put(`${API_URL}/employer/dashboard/shortlist/${applicationId}`, {}, { headers });
      setApplicants((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status: 'shortlisted' } : a))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to shortlist candidate');
    }
  };

  const handleChat = async (applicantId: string) => {
    try {
      const res = await axios.post(`${API_URL}/employer/dashboard/initiate-chat/${applicantId}`, {}, { headers });
      router.push(`/chat/${res.data.roomId}`);
    } catch (err: any) {
      console.error(err);
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

  // Stats
  const totalJobs = jobs.length;
  const totalApplicants = applicants.length;
  const shortlisted = applicants.filter((a) => a.status === 'shortlisted').length;
  const openJobs = jobs.filter((j) => j.status === 'Active').length;

  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        {/* Main Section */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3, overflowY: 'auto' }}>
          {/* Welcome & Stats */}
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.light' }}>
            <Typography variant="h5" fontWeight={600} color="text.primary">Welcome, {user.name}</Typography>
            <Typography variant="body1" color="text.primary">Manage your job postings, track applicants, and connect with candidates.</Typography>
          </Paper>

          <Grid container spacing={2}>
            {[{ label: 'Total Jobs', value: totalJobs }, { label: 'Open Jobs', value: openJobs }, { label: 'Applicants', value: totalApplicants }, { label: 'Shortlisted', value: shortlisted }].map((stat, i) => (
              <Grid size={{ xs: 6, sm: 3 }} key={i}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
                  <Typography variant="h6" fontWeight={600}>{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Job Listings */}
          <Typography variant="h6" fontWeight={600} mt={2}>My Job Postings</Typography>
          <Grid container spacing={2}>
            {jobs.map((job) => (
              <Grid size={{ xs: 12, sm: 6 }} key={job._id}>
                <Card sx={{ borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%', '&:hover': { boxShadow: 6, transform: 'scale(1.01)', transition: '0.3s' } }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={600}>{job.title}</Typography>
                      <Chip
                        label={job.status}
                        color={job.status === 'Closed' ? 'default' : 'success'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.primary" mb={1} display="flex" alignItems="center">
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} /> {job.location}
                    </Typography>
                    <Typography variant="body2" noWrap>{job.description}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button size="small" variant="contained" onClick={() => setViewApplicantsJob(job)}>View Applicants</Button>
                    <Button size="small" variant="outlined" onClick={() => setEditJob(job)}>Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Messages Sidebar */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            bgcolor: 'primary.light',
            borderRadius: 2,
            borderLeft: '1px solid primary.light',
            p: 2,
            height: '80vh',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" fontWeight={600}>Messages</Typography>
          {chats.length === 0 ? (
            <Typography color="text.primary">No messages yet.</Typography>
          ) : (
            chats.map((chat) => (
              <Card
                key={chat._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4, bgcolor: 'grey.50', color: 'black' },
                }}
                onClick={() => router.push(`/chat?chatId=${chat.chatId}&userId=${chat.partnerId}&userName=${encodeURIComponent(chat.partnerName)}`)}
              >
                <Chip label={chat.unreadCount > 0 ? `${chat.unreadCount} new` : ''} color="primary" size="small" sx={{ mr: 1 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>{chat.partnerName} ({chat.jobTitle})</Typography>
                  <Typography variant="body2" noWrap>{chat.lastMessage}</Typography>
                  <Typography variant="caption">{chat.timestamp}</Typography>
                </Box>
              </Card>
            ))
          )}
        </Grid>

        {/* Modals */}
        <ViewApplicantsModal job={viewApplicantsJob} onClose={() => setViewApplicantsJob(null)} />
        <EditJobModal job={editJob} onClose={() => setEditJob(null)} onUpdated={() => { }} />
      </Grid>
    </DashboardLayout>
  );
}
