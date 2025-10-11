'use client';

import { useContext, useEffect, useState } from 'react';
import { Grid, Box, Typography, Button, Card, CardContent, Avatar, Divider, CircularProgress } from '@mui/material';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import axios from 'axios';

export default function DashboardPage() {

    interface Job {
        _id: string;
        title: string;
        description: string;
        location: string;
        employer?: {
            name?: string;
            companyName?: string;
        };
    }

    interface Application {
        _id: string;
        job: Job;
        status: 'pending' | 'accepted' | 'rejected';
    }
    const { user, token } = useAuthContext();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch jobs/applications based on role
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                if (user.role === 'employer') {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = res?.data;
                    const userId = user?._id || user?.id;

                    const myJobs = data.filter((j: any) => {
                        const employerId =
                            typeof j.employer === 'string' ? j.employer : j.employer?._id;
                        return employerId === userId;
                    });
                    setJobs(myJobs)
                } else if (user.role === 'jobseeker') {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setApplications(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, token]);

    if (!user)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );

    return (
        <Grid container spacing={0}>
            {/* Sidebar */}
            <Grid

                size={{ xs: 12, sm: 3, md: 2 }}
                sx={{
                    backgroundColor: '#f8f9fa',
                    borderRight: '1px solid #e0e0e0',
                    minHeight: '100vh',
                    position: 'sticky',
                    top: 0,
                    p: 2,
                }}
            >
                <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                        {user.role === 'employer' ? <BusinessIcon /> : <PersonIcon />}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {user.name || user.companyName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" flexDirection="column" gap={1}>

                    {user.role === 'employer' ? (
                        <>
                            <Button
                                variant="text"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() => router.push('/post-job')}
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                Post a Job
                            </Button>
                            <Button
                                variant="text"
                                startIcon={<AssignmentTurnedInIcon />}
                                onClick={() => router.push('/my-jobs')}
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                My Jobs
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="text"
                                startIcon={<AssignmentTurnedInIcon />}
                                onClick={() => router.push('/my-applications')}
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                My Applications
                            </Button>
                            <Button
                                variant="text"
                                startIcon={<WorkOutlineIcon />}
                                onClick={() => router.push('/jobs/explore')}
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                Browse Jobs
                            </Button>
                        </>
                    )}
                </Box>
            </Grid>

            {/* Main content */}
            <Grid size={{ xs: 12, sm: 9, md: 10 }} sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} mb={3}>
                    {user.role === 'employer' ? 'My Posted Jobs' : 'My Applications'}
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                        <CircularProgress />
                    </Box>
                ) : user.role === 'employer' ? (
                    <>
                        {jobs.length === 0 ? (
                            <Typography color="text.secondary">You haven’t posted any jobs yet.</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {jobs.map((job) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job._id}>
                                        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                                            <CardContent>
                                                <Typography variant="h6" fontWeight={600}>
                                                    {job?.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {job?.location}
                                                </Typography>
                                                <Typography variant="body2" noWrap>
                                                    {job?.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                ) : (
                    <>
                        {applications.length === 0 ? (
                            <Typography color="text.secondary">You haven’t applied to any jobs yet.</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {applications.map((app) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={app._id}>
                                        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                                            <CardContent>
                                                <Typography variant="h6" fontWeight={600}>
                                                    {app.job?.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {app.job?.location}
                                                </Typography>
                                                <Typography variant="body2">Status: {app.status}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}
            </Grid>
        </Grid>
    );
}
