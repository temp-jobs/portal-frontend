'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

type JobCardProps = {
  job: any;
  onDelete?: (id: string) => void;
  showActions?: boolean;
};

export default function JobCard({ job, onDelete, showActions = true }: JobCardProps) {
  const router = useRouter();

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {job.location}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
          {job.description?.length > 200 ? job.description.slice(0, 200) + '…' : job.description}
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
          <IconButton size="small" color="error" onClick={() => onDelete && onDelete(job._id)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Card>
  );
}
