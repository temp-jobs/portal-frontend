'use client';

import React, { useState } from 'react';
import { Box, Typography, Chip, Button, Stack, LinearProgress, Divider } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface JobDetailsCardProps {
  job: {
    _id: string;
    title: string;
    companyName?: string;
    location: string;
    salary?: string;
    tags?: string[];
    description: string;
    postedAt?: string;
    matchPercentage?: number;
  };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string, save: boolean) => void;
}

export default function JobDetailsCard({ job, onApply, onSave }: JobDetailsCardProps) {
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSaveClick = () => {
    setSaved(!saved);
    onSave?.(job._id, !saved);
  };

  const handleApplyClick = () => {
    onApply?.(job._id);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
        mb: 3,
        boxShadow: 4,
        bgcolor: 'background.paper',
        maxWidth: 900,
        mx: 'auto',
      }}
    >
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        sx={{ mb: 2, textTransform: 'none', color: 'text.primary' }}
      >
        Back to Dashboard
      </Button>

      {/* Header: Title + Company */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {job.title}
          </Typography>
          <Typography variant="subtitle1" color="text.primary">
            {job.companyName || 'Company'} — {job.location}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="medium"
          onClick={handleSaveClick}
          startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          {saved ? 'Saved' : 'Save Job'}
        </Button>
      </Box>

      {/* Match Indicator */}
      {job.matchPercentage !== undefined && (
        <Box mb={2}>
          <Typography variant="body2" color="text.primary">
            Match: {job.matchPercentage}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={job.matchPercentage}
            sx={{ height: 10, borderRadius: 5, mt: 0.5 }}
          />
        </Box>
      )}

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
          {job.tags.map((tag) => (
            <Chip key={tag} label={tag} size="medium" color="primary" />
          ))}
        </Stack>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Description */}
      <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
        {job.description}
      </Typography>

      {/* Salary & Posted Date */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap">
        {job.salary && (
          <Typography variant="h6" color="primary" fontWeight={600}>
            💰 {job.salary}
          </Typography>
        )}
        {job.postedAt && (
          <Typography variant="caption" color="text.secondary">
            🕒 Posted {new Date(job.postedAt).toLocaleDateString()}
          </Typography>
        )}
      </Box>

      {/* Apply Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<WorkOutlineIcon />}
        onClick={handleApplyClick}
        sx={{ textTransform: 'none', fontWeight: 600 }}
      >
        Apply Now
      </Button>
    </Box>
  );
}
