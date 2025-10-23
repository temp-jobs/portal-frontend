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
  Avatar,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// ---------- Types ----------
interface Employer {
  _id?: string;
  id?: string;
  name?: string;
  companyName?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  employer?: Employer | string;
  matchPercentage?: number;
}

interface Application {
  _id: string;
  job: Job;
  status: 'pending' | 'applied' | 'accepted' | 'rejected' | 'shortlisted';
  chatId?: string;
  chatInitiated?: boolean;
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

export default function JobseekerDashboard() {
  const { user, token } = useAuthContext();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const headers = { Authorization: `Bearer ${token}` };

  // ---------- Fetch all dashboard data ----------
  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes, appsRes, chatsRes, matchRes] = await Promise.all([
          axios.get(`${API_URL}/jobs`, { headers }),
          axios.get(`${API_URL}/applications`, { headers }),
          axios.get(`${API_URL}/chats/user`, { headers }),
          axios.get(`${API_URL}/recommendations/jobseeker`, { headers }),
        ]);

        setJobs(matchRes.data.matches || []);

        const appsWithApplied = (appsRes.data || []).map((app: Application) => ({
          ...app,
          status: app.status === 'pending' ? 'applied' : app.status,
        }));
        setApplications(appsWithApplied);

        setChats(chatsRes.data || []);
        setMatches(matchRes.data.matches)
        console.log(matchRes.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  // ---------- Save/Unsave job ----------
  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const updated = new Set(prev);
      updated.has(jobId) ? updated.delete(jobId) : updated.add(jobId);
      return updated;
    });
    // TODO: integrate backend save/unsave jobs
  };

  // ---------- UI States ----------
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6">Please login to view dashboard</Typography>
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

  // ---------- Main Render ----------
  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        {/* Main Section */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Welcome Card */}
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.light' }}>
            <Typography color="text.primary" variant="h5" fontWeight={600}>
              Welcome, {user.name}
            </Typography>
            <Typography variant="body1" color="text.primary">
              Explore new jobs, track applications, and chat with employers.
            </Typography>
          </Paper>

          {/* Recommended Jobs */}
          <Typography variant="h6" fontWeight={600}>
            Recommended Jobs
          </Typography>
          <Grid container spacing={2}>
            {matches.map((match) => {
              const job = match.job;
              const matchPercentage = match.matchPercentage;

              const appForJob = applications.find(
                (a) => String(a.job._id) === String(job._id)
              );
              const hasChat = !!(appForJob && (appForJob.chatId || appForJob.chatInitiated));

              if (hasChat) return null;

              const employer =
                typeof job.employer === 'string'
                  ? { _id: '', name: job.employer }
                  : job.employer || { _id: '', name: '' };

              return (
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
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6" fontWeight={600}>
                          {job.title}
                        </Typography>
                        <Chip
                          label={matchPercentage ? `${matchPercentage}% Match` : 'New'}
                          color={matchPercentage && matchPercentage > 80 ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        mb={1}
                        display="flex"
                        alignItems="center"
                      >
                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} /> {job.location}
                      </Typography>
                      <Typography variant="body2" noWrap>
                        {job.description}
                      </Typography>
                    </CardContent>

                    {/* Actions */}
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button
                        disabled={hasChat}
                        size="small"
                        variant="contained"
                        onClick={() => router.push(`/jobs/${job._id}`)}
                      >
                        {hasChat ? 'Applied & Shortlisted' : 'View & Apply'}
                      </Button>

                      <Button
                        size="small"
                        variant={savedJobs.has(job._id) ? 'contained' : 'outlined'}
                        startIcon={savedJobs.has(job._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        onClick={() => toggleSaveJob(job._id)}
                      >
                        {savedJobs.has(job._id) ? 'Saved' : 'Save'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>


          {/* Applications Section */}
          <Typography variant="h6" fontWeight={600} mt={3}>
            Recent Applications
          </Typography>
          {applications.length === 0 ? (
            <Typography color="text.primary">You haven’t applied to any jobs yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {applications.map((app) => (
                <Grid size={{ xs: 12, sm: 6 }} key={app._id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {app.job.title}
                      </Typography>
                      <Typography variant="body2" color="text.primary" gutterBottom>
                        {app.job.location}
                      </Typography>
                      <Chip
                        label={app.status}
                        color={
                          app.status === 'accepted'
                            ? 'success'
                            : app.status === 'rejected'
                              ? 'error'
                              : app.status === 'applied'
                                ? 'warning'
                                : app.status === 'shortlisted'
                                  ? 'primary'
                                  : 'default'
                        }
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Messages Sidebar */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            bgcolor: '#f5f5f5',
            borderLeft: '1px solid #e0e0e0',
            p: 2,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Messages
          </Typography>

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
                  '&:hover': { boxShadow: 4, bgcolor: 'grey.50' },
                }}
                onClick={() =>
                  router.push(
                    `/chat?chatId=${chat.chatId}&userId=${chat.partnerId}&userName=${encodeURIComponent(
                      chat.partnerName
                    )}`
                  )
                }
              >
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  {chat.partnerName.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {chat.partnerName} ({chat.jobTitle})
                  </Typography>
                  <Typography variant="body2" color="text.primary" noWrap>
                    {chat.lastMessage}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography variant="caption" color="text.primary">
                    {chat.timestamp}
                  </Typography>
                  {chat.unreadCount > 0 && (
                    <Chip
                      label={chat.unreadCount}
                      color="primary"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
