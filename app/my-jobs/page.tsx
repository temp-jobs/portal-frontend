'use client';

import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobCard from '@/components/dashboard/JobCard';
import axios from 'axios';
import { useAuthContext } from '@/contexts/AuthContext';

export default function MyJobsPage() {
    const { user, token } = useAuthContext();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            // Backend doesn't have a filter param in our routes above; implement filter by employer on backend OR fetch all and filter client-side:
            // Preferred: backend route GET /api/jobs?employerId=<id> (if implemented). For now, fetch all /api/jobs and filter by employer id in returned objects.
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // support both shapes: { jobs: [...] } or direct array
            const data = res.data.jobs ?? res.data;
            // filter by employer (server should ideally do this)
            const userId = user?._id || user?.id;

            const myJobs = data.filter((j: any) => {
                const employerId =
                    typeof j.employer === 'string' ? j.employer : j.employer?._id;
                return employerId === userId;
            });
            setJobs(myJobs)


        } catch (err) {
            console.error(err);
            setError('Failed to load your jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchJobs();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs((prev) => prev.filter((j) => j._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete job');
        }
    };

    if (!user) return;

    return (
        <DashboardLayout>
            <Typography variant="h5" fontWeight={700} mb={3}>My Jobs</Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : jobs.length === 0 ? (
                <Typography color="text.secondary">You haven't posted any jobs yet. Use "Post a Job" to create your first listing.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {jobs.map((job) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job._id}>
                            <JobCard job={job} onDelete={handleDelete} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </DashboardLayout>
    );
}
