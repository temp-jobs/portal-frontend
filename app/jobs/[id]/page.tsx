'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Modal,
  TextField,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { useAuthContext } from '../../../contexts/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuthContext();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleApplyOpen = () => {
    setApplyOpen(true);
    setCoverLetter('');
    setError(null);
    setSuccessMsg(null);
  };

  const handleApplyClose = () => {
    setApplyOpen(false);
  };

  const handleApplySubmit = async () => {
    if (!coverLetter.trim()) {
      setError('Cover letter is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/apply`,
        { coverLetter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg('Application submitted successfully!');
      setCoverLetter('');
    } catch (err) {
      setError('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Job not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {job.company} — {job.location}
      </Typography>
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        {job.tags?.map((tag: string) => (
          <Chip key={tag} label={tag} />
        ))}
      </Stack>
      <Typography variant="body1" paragraph>
        {job.description}
      </Typography>
      {job.salary && (
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Salary: {job.salary}
        </Typography>
      )}

      {user && user.role === 'jobseeker' ? (
        <Button variant="contained" color="primary" onClick={handleApplyOpen}>
          Apply Now
        </Button>
      ) : (
        <Typography color="error" mt={2}>
          You must be logged in as a jobseeker to apply.
        </Typography>
      )}

      <Modal open={applyOpen} onClose={handleApplyClose}>
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: { xs: '90%', sm: 400 },
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Submit Your Application
          </Typography>
          <TextField
            label="Cover Letter"
            multiline
            minRows={4}
            maxRows={8}
            fullWidth
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            disabled={submitting}
          />
          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}
          {successMsg && (
            <Typography color="success.main" mt={1}>
              {successMsg}
            </Typography>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button onClick={handleApplyClose} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleApplySubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}