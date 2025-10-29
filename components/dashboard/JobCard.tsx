'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

// Define a proper type for a Job
interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  employer?: {
    _id?: string;
    name?: string;
    companyName?: string;
  };
}

interface JobCardProps {
  job: Job;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function JobCard({ job, onDelete, showActions = true }: JobCardProps) {
  const router = useRouter();

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Job Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          noWrap
          sx={{ color: 'text.primary' }}
        >
          {job.title}
        </Typography>

        {/* Job Location */}
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          {job.location}
        </Typography>

        {/* Job Description */}
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ mt: 1, lineHeight: 1.5 }}
        >
          {job.description.length > 200
            ? `${job.description.slice(0, 200)}…`
            : job.description}
        </Typography>

        {/* Employer Info (optional) */}
        {job.employer?.companyName && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            {`Posted by: ${job.employer.companyName}`}
          </Typography>
        )}
      </CardContent>

      {/* Action Buttons */}
      {showActions && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            p: 1,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Tooltip title="Edit Job">
            <IconButton
              size="small"
              color="primary"
              onClick={() => router.push(`/jobs?editId=${job._id}`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Job">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete?.(job._id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
}
