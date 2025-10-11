'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';
import { useAuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];

export default function PostJobPage() {
  const { token, user } = useAuthContext();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (!user || user.role !== 'employer') {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>You must be logged in as an employer to post a job.</Typography>
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim() || !location.trim() || !jobType) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
        {
          title,
          description,
          location,
          salary: salary.trim() || null,
          jobType,
          tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Job posted successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setSalary('');
      setJobType('');
      setTags('');
      router.push('/profile/employer');
    } catch (err) {
      setError('Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Post a New Job
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Job Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Job Description"
          fullWidth
          required
          multiline
          minRows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Location"
          fullWidth
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Salary (optional)"
          fullWidth
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth required margin="normal">
          <InputLabel id="job-type-label">Job Type</InputLabel>
          <Select
            labelId="job-type-label"
            value={jobType}
            label="Job Type"
            onChange={(e) => setJobType(e.target.value)}
          >
            {jobTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Tags (comma separated)"
          fullWidth
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          helperText="Add tags to describe the job (e.g. JavaScript, Remote)"
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </Button>
      </Box>
    </Container>
  );
}