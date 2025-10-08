'use client';

import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  employer: {
    name: string;
    email: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const JobDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useContext(AuthContext);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get<Job>(`${API_URL}/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!token) {
      setError('You must be logged in to apply');
      return;
    }
    setApplying(true);
    setError(null);
    setMessage(null);

    try {
      await axios.post(
        `${API_URL}/api/jobs/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Application submitted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography>No job found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {job.description}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" paragraph>
        Location: {job.location}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" paragraph>
        Posted by: {job.employer.name} ({job.employer.email})
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {user?.role === 'jobseeker' && (
        <Box>
          <Button
            variant="contained"
            disabled={applying}
            onClick={handleApply}
          >
            {applying ? <CircularProgress size={24} /> : 'Apply for this Job'}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default JobDetailPage;