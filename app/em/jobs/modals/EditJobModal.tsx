'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, MenuItem, Button, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';
import { useAuthContext } from '@/contexts/AuthContext';
import { Job } from '@/types/job';

interface Props {
  job: Job | null;
  onClose: () => void;
  onUpdated: () => void;
}

const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Remote'];
const experienceLevels = ['Entry', 'Mid', 'Senior'];
const salaryTypes = ['Fixed', 'Range', 'Variable'];

export default function EditJobModal({ job, onClose, onUpdated }: Props) {
  const { token } = useAuthContext();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [form, setForm] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) setForm(job);
  }, [job]);

  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleArrayChange = (name: keyof Job, value: string[]) => {
    setForm(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      await axios.put(`${API_URL}/jobs/${form._id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={!!job} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, bgcolor: 'background.paper', margin: 'auto', mt: 10, borderRadius: 2, width: 800, maxHeight: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" mb={2}>Edit Job: {form.title}</Typography>
        <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Location" name="location" value={form.location} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth select label="Type" name="type" value={form.type} onChange={handleChange} sx={{ mb: 2 }}>
          {jobTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField fullWidth select label="Experience Level" name="experienceLevel" value={form.experienceLevel} onChange={handleChange} sx={{ mb: 2 }}>
          {experienceLevels.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
        </TextField>
        <TextField fullWidth label="Description" name="description" value={form.description} multiline rows={4} onChange={handleChange} sx={{ mb: 2 }} />
        <Box display="flex" gap={2} mb={2}>
          <TextField fullWidth label="Min Salary" name="minSalary" type="number" value={form.minSalary || ''} onChange={handleChange} />
          <TextField fullWidth label="Max Salary" name="maxSalary" type="number" value={form.maxSalary || ''} onChange={handleChange} />
        </Box>
        <TextField fullWidth label="Currency" name="currency" value={form.currency} onChange={handleChange} sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Update Job'}
        </Button>
      </Box>
    </Modal>
  );
}
