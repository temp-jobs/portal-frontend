'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthContext } from '@/contexts/AuthContext';
import FullPageLoader from '@/components/FullPageLoader';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios, { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

interface JobPayload {
  title: string;
  location: string;
  description: string;
}

interface JobResponse {
  id: string;
  title: string;
  location: string;
  description: string;
}

export default function PostJobPage(): JSX.Element {
  const { user, token } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');

  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(Boolean(editId));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!editId || !token) return;

    const fetchJob = async (): Promise<void> => {
      try {
        const res = await axios.get<JobResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${editId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const job = res.data;
        setTitle(job.title || '');
        setLocation(job.location || '');
        setDescription(job.description || '');
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        console.error('Job fetch failed:', axiosErr);
        setError(axiosErr.response?.data?.message || 'Failed to load job for editing');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchJob();
  }, [editId, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !location.trim() || !description.trim()) {
      setError('Please fill title, location and description.');
      return;
    }

    setLoading(true);
    const payload: JobPayload = { title, location, description };

    try {
      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Job updated successfully');
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/post-job`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Job posted successfully');
        setTitle('');
        setLocation('');
        setDescription('');
      }

      // Navigate back after a brief delay
      setTimeout(() => router.push('/dashboard/my-jobs'), 800);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      console.error('Job save error:', axiosErr);
      setError(axiosErr.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <FullPageLoader />;
  if (initialLoading) return <FullPageLoader message="Loading job..." />;

  return (
    <DashboardLayout>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2}>
            {editId ? 'Edit Job' : 'Post a New Job'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={6}
              required
            />

            <Box display="flex" gap={2} justifyContent="flex-end" mt={1}>
              <Button
                variant="outlined"
                onClick={() => router.push('/dashboard/my-jobs')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : editId ? (
                  'Update Job'
                ) : (
                  'Post Job'
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
