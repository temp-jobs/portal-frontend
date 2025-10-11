'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

// ✅ Define a proper type for a Job
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
              boxShadow: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
          }}
      >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
          {job.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {job.location}
        </Typography>

        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                  {job.description.length > 200
                      ? `${job.description.slice(0, 200)}…`
                      : job.description}
        </Typography>
      </CardContent>

      {showActions && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => router.push(`/jobs?editId=${job._id}`)}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
                  <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete?.(job._id)}
                      aria-label="delete"
                  >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Card>
  );
}
