'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Chip,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useAuthContext } from '@/contexts/AuthContext';
import FullPageLoader from '@/components/FullPageLoader';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios, { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

interface JobPayload {
  title: string;
  location: string;
  description: string;
  jobType: string[];
  skills: string[];
  minSalary: number;
  maxSalary: number;
}

interface JobResponse {
  id: string;
  title: string;
  location: string;
  description: string;
  jobType: string[];
  skills: string[];
  minSalary: number;
  maxSalary: number;
}

const jobTypeOptions = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];

export default function PostJobPage() {
  const { user, token } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(Boolean(editId));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch job if edit
  useEffect(() => {
    if (!editId || !token) return;

    const fetchJob = async () => {
      try {
        const res = await axios.get<JobResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${editId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const job = res.data;
        setTitle(job.title || '');
        setLocation(job.location || '');
        setDescription(job.description || '');
        setJobType(job.jobType || []);
        setSkills(job.skills || []);
        setMinSalary(job.minSalary?.toString() || '');
        setMaxSalary(job.maxSalary?.toString() || '');
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message || 'Failed to load job');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchJob();
  }, [editId, token]);

  if (!user) return <FullPageLoader />;
  if (initialLoading) return <FullPageLoader message="Loading job..." />;

  const steps = ['Basic Info', 'Job Details', 'Salary & Skills'];

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    if (step === 0) {
      if (!title.trim()) errors.title = 'Job title is required';
      if (!location.trim()) errors.location = 'Location is required';
    }
    if (step === 1) {
      if (!description.trim()) errors.description = 'Job description is required';
      if (!jobType.length) errors.jobType = 'Select at least one job type';
    }
    if (step === 2) {
      if (!minSalary || Number(minSalary) < 0) errors.minSalary = 'Enter valid min salary';
      if (!maxSalary || Number(maxSalary) < 0) errors.maxSalary = 'Enter valid max salary';
      if (Number(maxSalary) < Number(minSalary)) errors.maxSalary = 'Max salary must be >= min salary';
      if (!skills.length) errors.skills = 'Add at least one skill';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload: JobPayload = {
      title,
      location,
      description,
      jobType,
      skills,
      minSalary: Number(minSalary),
      maxSalary: Number(maxSalary),
    };

    try {
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Job updated successfully');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jobs/post-job`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Job posted successfully');
        setTitle('');
        setLocation('');
        setDescription('');
        setJobType([]);
        setSkills([]);
        setMinSalary('');
        setMaxSalary('');
      }
      setTimeout(() => router.push('/my-jobs'), 1000);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Card sx={{ borderRadius: 3, p: 3, maxWidth: 800, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={3}>
            {editId ? 'Edit Job' : 'Post a New Job'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                error={!!fieldErrors.title}
                helperText={fieldErrors.title}
              />
              <TextField
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                error={!!fieldErrors.location}
                helperText={fieldErrors.location}
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Job Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={6}
                error={!!fieldErrors.description}
                helperText={
                  fieldErrors.description || `${description.length}/1000 characters`
                }
                inputProps={{ maxLength: 1000 }}
              />

              <Autocomplete
                multiple
                options={jobTypeOptions}
                value={jobType}
                onChange={(_, value) => setJobType(value)}
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Type"
                    placeholder="Select job type(s)"
                    error={!!fieldErrors.jobType}
                    helperText={fieldErrors.jobType}
                  />
                )}
              />
            </Box>
          )}

          {activeStep === 2 && (
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" gap={2}>
                <TextField
                  label="Min Salary"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value.replace(/\D/g, ''))}
                  fullWidth
                  error={!!fieldErrors.minSalary}
                  helperText={fieldErrors.minSalary || 'Minimum salary in ₹'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOnIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Max Salary"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value.replace(/\D/g, ''))}
                  fullWidth
                  error={!!fieldErrors.maxSalary}
                  helperText={fieldErrors.maxSalary || 'Maximum salary in ₹'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOnIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={skills}
                onChange={(_, value) => setSkills(value as string[])}
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    placeholder="Add relevant skills"
                    error={!!fieldErrors.skills}
                    helperText={fieldErrors.skills}
                  />
                )}
              />
            </Box>
          )}

          <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Post Job'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
