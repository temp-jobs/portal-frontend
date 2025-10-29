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
import { usePathname, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EditJobModal from '../jobs/modals/EditJobModal';
import ViewApplicantsModal from '../jobs/modals/ViewApplicantsModal';
import { Job } from '@/types/job';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


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
  const pathname = usePathname();
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
      navigateWithLoader(`/chat/${res.data.roomId}`);
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

  const navigateWithLoader = (path: string) => {
    if (pathname === path) return; // Prevent redundant navigation
    setLoading(true);
    router.push(path);
    setTimeout(() => setLoading(false), 600);
  };

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

          {/* Job Listings Carousel */}
          <Typography variant="h6" fontWeight={600} mt={2}>
            My Job Postings
          </Typography>

          <Box sx={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1.2}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                600: { slidesPerView: 1.2 },
                900: { slidesPerView: 2 },
              }}
              style={{
                paddingBottom: '40px',
                paddingTop: '10px',
              }}
            >
              {jobs.map((job) => (
                <SwiperSlide key={job._id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      height: 220,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      p: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {job.title}
                        </Typography>
                        <Chip
                          label={job.status}
                          color={job.status === 'Closed' ? 'default' : 'success'}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" mb={1}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {job.location}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {job.description}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'space-between', pt: 1 }}>
                      <Button size="small" variant="contained" onClick={() => setViewApplicantsJob(job)}>
                        View Applicants
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => setEditJob(job)}>
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Swiper Navigation Styling */}
            <style jsx global>{`
    .swiper-button-next,
    .swiper-button-prev {
      color: #1976d2;
      background: white;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
    .swiper-button-next::after,
    .swiper-button-prev::after {
      font-size: 14px;
      font-weight: bold;
    }
    .swiper-button-next {
      right: -20px;
    }
    .swiper-button-prev {
      left: -20px;
    }
    @media (max-width: 600px) {
      .swiper-button-next,
      .swiper-button-prev {
        display: none;
      }
    }
  `}</style>
          </Box>

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
                onClick={() => navigateWithLoader(`/chat?chatId=${chat.chatId}&userId=${chat.partnerId}&userName=${encodeURIComponent(chat.partnerName)}`)}
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
        <ViewApplicantsModal job={viewApplicantsJob} onClose={() => setViewApplicantsJob(null)} open={!!viewApplicantsJob} />
        <EditJobModal job={editJob} onClose={() => setEditJob(null)} onUpdated={() => { }} />
      </Grid>
    </DashboardLayout>
  );
}
