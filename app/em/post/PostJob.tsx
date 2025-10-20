'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Chip,
  Autocomplete,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';

const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Remote'];
const experienceLevels = ['Entry', 'Mid', 'Senior'];
const salaryTypes = ['Fixed', 'Range', 'Variable'];

export default function PostJobPage() {
  const { user, token } = useAuthContext();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    experienceLevel: '',
    location: '',
    salaryType: 'Range',
    minSalary: '',
    maxSalary: '',
    currency: 'INR',
    benefits: [] as string[],
    skillsRequired: [] as string[],
    education: '',
    openings: 1,
    deadline: null as Date | null,
    jobDuration: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.title.trim()) errs.title = 'Job title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.length > 1000) errs.description = 'Max 1000 characters';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (!form.type) errs.type = 'Job type is required';
    if (!form.experienceLevel) errs.experienceLevel = 'Experience level is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (form.salaryType !== 'Variable') {
      if (form.minSalary === '') errs.minSalary = 'Min salary is required';
      if (form.maxSalary === '') errs.maxSalary = 'Max salary is required';
      if (+form.minSalary > +form.maxSalary) errs.maxSalary = 'Max salary should be >= Min salary';
    }
    if (form.openings < 1) errs.openings = 'Openings must be at least 1';
    if (form.skillsRequired.length > 20) errs.skillsRequired = 'Max 20 skills allowed';
    if (form.benefits.length > 20) errs.benefits = 'Max 20 benefits allowed';
    if (form.deadline && new Date(form.deadline) < new Date()) errs.deadline = 'Deadline must be future date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user || !token) return;

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jobs/post-job`, form, { headers });
      alert('Job posted successfully!');
      router.push('/em/jobs');
    } catch (err) {
      console.error(err);
      alert('Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Typography variant="h5" mb={3}>
          Post a New Job
        </Typography>
        <Grid container spacing={2}>
          {/* Title */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Job Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              error={!!errors.category}
              helperText={errors.category}
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          {/* Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              required
              label="Job Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
            >
              {jobTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Experience */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              required
              label="Experience Level"
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              error={!!errors.experienceLevel}
              helperText={errors.experienceLevel}
            >
              {experienceLevels.map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Location */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              error={!!errors.location}
              helperText={errors.location}
            />
          </Grid>

          {/* Salary Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Salary Type"
              name="salaryType"
              value={form.salaryType}
              onChange={handleChange}
            >
              {salaryTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Min / Max Salary */}
          {form.salaryType !== 'Variable' && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Salary"
                  name="minSalary"
                  value={form.minSalary}
                  onChange={handleChange}
                  error={!!errors.minSalary}
                  helperText={errors.minSalary}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Salary"
                  name="maxSalary"
                  value={form.maxSalary}
                  onChange={handleChange}
                  error={!!errors.maxSalary}
                  helperText={errors.maxSalary}
                />
              </Grid>
            </>
          )}

          {/* Currency */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
            />
          </Grid>

          {/* Skills */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={form.skillsRequired}
              onChange={(e, value) => setForm(prev => ({ ...prev, skillsRequired: value }))}
              renderTags={(value: string[], getTagProps) =>
                value.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)
              }
              renderInput={params => (
                <TextField {...params} label="Skills Required" error={!!errors.skillsRequired} helperText={errors.skillsRequired} />
              )}
            />
          </Grid>

          {/* Education */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Education"
              name="education"
              value={form.education}
              onChange={handleChange}
            />
          </Grid>

          {/* Openings */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Openings"
              name="openings"
              value={form.openings}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              error={!!errors.openings}
              helperText={errors.openings}
            />
          </Grid>

          {/* Job Duration */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Job Duration"
              name="jobDuration"
              value={form.jobDuration}
              onChange={handleChange}
            />
          </Grid>

          {/* Deadline */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Application Deadline"
              value={form.deadline}
              onChange={(newValue) => setForm(prev => ({ ...prev, deadline: newValue }))}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.deadline,
                  helperText: errors.deadline,
                }
              }}
            />
          </Grid>

          {/* Benefits */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={form.benefits}
              onChange={(e, value) => setForm(prev => ({ ...prev, benefits: value }))}
              renderTags={(value: string[], getTagProps) =>
                value.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)
              }
              renderInput={params => (
                <TextField {...params} label="Benefits" error={!!errors.benefits} helperText={errors.benefits} />
              )}
            />
          </Grid>

          {/* Submit */}
          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </Grid>
        </Grid>
      </Box>

    </DashboardLayout>
  );
}
