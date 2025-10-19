'use client';

import React from 'react';
import { Modal, Box, Typography, Chip, Divider } from '@mui/material';
import { Job } from '@/types/job';



interface Props {
  job: Job | null;
  onClose: () => void;
}

export default function ViewJobModal({ job, onClose }: Props) {
  if (!job) return null;

  return (
    <Modal open={!!job} onClose={onClose}>
      <Box sx={{ p: 3, bgcolor: 'background.paper', margin: 'auto', mt: 10, borderRadius: 2, width: 800, maxHeight: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" mb={2}>{job.title}</Typography>
        <Typography><strong>Status:</strong> {job.status}</Typography>
        <Typography><strong>Location:</strong> {job.location}</Typography>
        <Typography><strong>Type:</strong> {job.type}</Typography>
        <Typography><strong>Experience:</strong> {job.experienceLevel}</Typography>
        <Typography><strong>Description:</strong> {job.description}</Typography>
        {job.skillsRequired && (
          <>
            <Typography mt={1}><strong>Skills:</strong></Typography>
            {job.skillsRequired.map(skill => <Chip key={skill} label={skill} sx={{ mr: 1, mt: 1 }} />)}
          </>
        )}
        {job.benefits && (
          <>
            <Typography mt={1}><strong>Benefits:</strong></Typography>
            {job.benefits.map(b => <Chip key={b} label={b} sx={{ mr: 1, mt: 1 }} />)}
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography><strong>Salary:</strong> {job.salaryType === 'Variable' ? 'Variable' : `${job.minSalary || 0} - ${job.maxSalary || 0} ${job.currency || 'INR'}`}</Typography>
        <Typography><strong>Openings:</strong> {job.openings}</Typography>
        <Typography><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</Typography>
        <Typography><strong>Job Duration:</strong> {job.jobDuration || 'N/A'}</Typography>
      </Box>
    </Modal>
  );
}
