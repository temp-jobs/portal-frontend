'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useAuthContext } from '../../../contexts/AuthContext';
import JobDetailsCard from './JobDetailsCard';

interface Job {
  _id: string;
  title: string;
  companyName?: string;
  location: string;
  description: string;
  salary?: string;
  tags?: string[];
  postedAt?: string;
  matchPercentage?: number;
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuthContext();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogSuccess, setDialogSuccess] = useState(true);

  // Fetch job details
  useEffect(() => {
    if (!id || !token) return;
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = res.data.job || res.data;
        setJob(data);
      } catch (err: unknown) {
        const error = err as AxiosError;
        console.error('Failed to fetch job:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  // Apply button handler
  const handleApply = async (jobId: string) => {
    if (!user || !token) {
      setDialogMessage('Please login as a jobseeker to apply.');
      setDialogSuccess(false);
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show backend message in dialog
      setDialogMessage(res.data.message || 'Application submitted successfully!');
      setDialogSuccess(true);
      setDialogOpen(true);
    } catch (err: unknown) {
      const error = err as AxiosError;
      // console.error('Apply failed:', error.message);
      // Show backend error if available
      setDialogMessage(
        (error.response?.data as any)?.message || 'Failed to submit application'
      );
      setDialogSuccess(false);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Save button handler
  const handleSave = (jobId: string, save: boolean) => {
    // TODO: Implement API call to save/unsave job for the user
    console.log(save ? 'Saved job:' : 'Removed saved job:', jobId);
  };

  if (loading || !job) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <JobDetailsCard job={job} onApply={handleApply} onSave={handleSave} />

      {/* Dialog Popup */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        {/* <DialogTitle>{dialogSuccess ? 'Success' : 'Error'}</DialogTitle> */}
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
