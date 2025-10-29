'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Applicant {
  _id: string;
  job: string;
  applicant: {
    _id: string;
    name: string;
    email: string;
    profileCompleted?: boolean;
    skills: string[];
    experience?: { company?: string; position?: string; description?: string }[];
  };
  status: string;
  matchPercentage: number;
  appliedAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  job: { _id: string; title?: string } | null;
}

const ViewApplicantsModal: React.FC<Props> = ({ open, onClose, job }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!job?._id || !open) return;

    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/applications/job/${job._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplicants(res.data || []);
      } catch (err) {
        console.error('Error fetching applicants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [job?._id, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Applicants for {job?.title ? `"${job.title}"` : 'this job'}
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : applicants.length === 0 ? (
          <Typography>No applicants found.</Typography>
        ) : (
          <Stack spacing={2}>
            {applicants.map((app) => (
              <Box
                key={app._id}
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', color: '#fff' }}>
                  {app.applicant.name?.charAt(0).toUpperCase()}
                </Avatar>

                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {app.applicant.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.applicant.email}
                  </Typography>

                  <Box mt={1}>
                    {app.applicant.skills?.slice(0, 5).map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {app.applicant.experience?.[0]?.position
                      ? `${app.applicant.experience?.[0]?.position} @ ${app.applicant.experience?.[0]?.company || '—'}`
                      : app.applicant.experience?.[0]?.description || 'No experience details'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box textAlign="center" width={100}>
                  <Typography variant="body2" color="text.secondary">
                    Match
                  </Typography>
                  <Typography fontWeight={600}>{app.matchPercentage}%</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={app.matchPercentage}
                    sx={{ height: 8, borderRadius: 5, mt: 0.5 }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewApplicantsModal;
