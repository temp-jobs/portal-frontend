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
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

// ---------- Carousel Card Component ----------
const JobCard = ({ job, matchPercentage, savedJobs, toggleSaveJob, onClick }: any) => (
  <Card
    sx={{
      borderRadius: 2,
      p: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 3,
      transition: 'all 0.3s ease',
      '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
    }}
  >
    <CardContent sx={{ pb: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600} noWrap>
          {job.title}
        </Typography>
        {matchPercentage !== undefined && (
          <Chip
            label={`${matchPercentage}%`}
            color={matchPercentage > 80 ? 'success' : 'default'}
            size="small"
          />
        )}
      </Box>
      <Typography display="flex" alignItems="center" variant="body2" mb={1} color="text.secondary">
        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} /> {job.location}
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {job.description}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between', pt: 1 }}>
      <Button variant="contained" size="small" onClick={onClick}>
        View & Apply
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
);

// ---------- Jobseeker Dashboard ----------
export default function JobseekerDashboard() {
  const { user, token } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [applications, setApplications] = useState<Application[]>([]);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, chatsRes, matchRes] = await Promise.all([
          axios.get(`${API_URL}/applications`, { headers }),
          axios.get(`${API_URL}/chats/user`, { headers }),
          axios.get(`${API_URL}/recommendations/jobseeker`, { headers }),
        ]);

        const appsWithApplied = (appsRes.data || []).map((app: Application) => ({
          ...app,
          status: app.status === 'pending' ? 'applied' : app.status,
        }));

        setApplications(appsWithApplied);
        setChats(chatsRes.data || []);
        setMatches(matchRes.data.matches || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const updated = new Set(prev);
      updated.has(jobId) ? updated.delete(jobId) : updated.add(jobId);
      return updated;
    });
  };

  if (!user)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6">Please login to view dashboard</Typography>
      </Box>
    );

  const navigateWithLoader = (path: string) => {
    if (pathname === path) return; // Prevent redundant navigation
    setLoading(true);
    router.push(path);
    setTimeout(() => setLoading(false), 600);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <DashboardLayout>
      <Grid container spacing={2} sx={{ height: 'calc(100vh - 32px)' }}>
        {/* Main Section */}
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            overflowY: 'auto',
            pr: 1,
          }}
        >
          {/* Welcome Card */}
          <Paper sx={{ p: 2, borderRadius: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              Welcome, {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore new jobs, track applications, and chat with employers.
            </Typography>
          </Paper>

          {/* Recommended Jobs Carousel */}
          {matches.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={600} mb={1}>
                Recommended Jobs
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={2}
                  pagination={{ clickable: true }}
                  navigation
                  breakpoints={{
                    600: { slidesPerView: 1.2 },
                    900: { slidesPerView: 2 },
                  }}
                  style={{
                    paddingBottom: '40px',
                    paddingTop: '10px',
                    paddingLeft: '40px',
                    paddingRight: '40px'
                  }}
                >
                  {matches.map((match: any) => (
                    <SwiperSlide key={match.job._id}>
                      <Card
                        sx={{
                          borderRadius: 1,
                          boxShadow: 3,
                          p: 2,
                          height: 220,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.3s ease',
                          '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              {match.job.title}
                            </Typography>
                            {match.matchPercentage && (
                              <Chip
                                label={`${match.matchPercentage}% Match`}
                                color={match.matchPercentage > 80 ? 'success' : 'default'}
                                size="small"
                              />
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            display="flex"
                            alignItems="center"
                            mb={1}
                          >
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {match.job.location}
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
                            {match.job.description || 'No description available.'}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between', pt: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigateWithLoader(`/jobs/${match.job._id}`)}
                          >
                            View & Apply
                          </Button>
                          <Button
                            size="small"
                            variant={savedJobs.has(match.job._id) ? 'contained' : 'outlined'}
                            startIcon={
                              savedJobs.has(match.job._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />
                            }
                            onClick={() => toggleSaveJob(match.job._id)}
                          >
                            {savedJobs.has(match.job._id) ? 'Saved' : 'Save'}
                          </Button>
                        </CardActions>
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Styling */}
                <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #1976d2;
          background: white;
          border-radius: 50%;
          padding: 1;
          width: 25px;
          height: 25px;
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
            </Box>
          )}


          {/* Recent Applications Carousel */}
          <Box mt={2}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Recent Applications
            </Typography>
            {applications.length === 0 ? (
              <Typography color="text.secondary">You haven’t applied to any jobs yet.</Typography>
            ) : (
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={3}
                  navigation
                  pagination={{ clickable: true }}
                  breakpoints={{
                    600: { slidesPerView: 1.5 },
                    900: { slidesPerView: 2.2 },
                    1200: { slidesPerView: 3 },
                  }}
                  style={{
                    paddingBottom: '40px',
                    paddingTop: '10px',
                    paddingLeft: '40px',
                    paddingRight: '40px'
                  }}
                >
                  {applications.map((app) => (
                    <SwiperSlide key={app._id}>
                      <Card
                        sx={{
                          borderRadius: 1,
                          p: 0.5,
                          boxShadow: 4,
                          transition: 'all 0.3s ease',
                          '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
                          minHeight: '150px'
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={700} noWrap>
                            {app.job.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            display="flex"
                            alignItems="center"
                            mb={1}
                          >
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} /> {app.job.location}
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
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </CardContent>
                      </Card>
                    </SwiperSlide>
                  ))}
              </Swiper>
            )}
          </Box>
        </Grid>

        {/* Messages Sidebar */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            bgcolor: 'light',
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
            <Typography color="text.secondary">No messages yet.</Typography>
          ) : (
            chats.map((chat) => (
              <Card
                key={chat._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4, bgcolor: 'grey.50' },
                }}
                onClick={() =>
                  navigateWithLoader(
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
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {chat.lastMessage}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography variant="caption">{chat.timestamp}</Typography>
                  {chat.unreadCount > 0 && (
                    <Chip label={chat.unreadCount} color="primary" size="small" sx={{ mt: 0.5 }} />
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
