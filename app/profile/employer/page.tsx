'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Grid,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

interface PostedJob {
  id: string;
  title: string;
  location: string;
  salary?: string;
  status: string;
}

export default function EmployerProfilePage() {
  const { user, token } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    email: '',
  });

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/employer`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = res.data;
        setProfile(profileData);
        setPostedJobs(res.data.postedJobs || []);
        setForm({
          companyName: profileData.companyName || '',
          companyWebsite: profileData.companyWebsite || '',
          companyDescription: profileData.companyDescription || '',
          email: profileData.email || '',
        });
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!form.companyName.trim()) {
      setError('Company name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/employer`,
        {
          companyName: form.companyName,
          companyWebsite: form.companyWebsite,
          companyDescription: form.companyDescription,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPostedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch {
      alert('Failed to delete job');
    }
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        🏢 Welcome to your Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* --- Profile Header --- */}
      <Card
        elevation={3}
        sx={{
          borderRadius: 1,
          mb: 4,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 90,
            height: 90,
            fontSize: 36,
            textTransform: 'uppercase',
          }}
        >
          {form.companyName?.[0] || 'C'}
        </Avatar>
        <Box flex={1}>
          <Typography variant="h5" fontWeight="600">
            {form.companyName || 'Your Company'}
          </Typography>
          <Typography color="text.secondary">{form.email}</Typography>
          <Chip
            label={profile?.role || 'Employer'}
            color="primary"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </Box>
        <Box>
          <Button
            variant={isEditing ? 'contained' : 'outlined'}
            color={isEditing ? 'success' : 'primary'}
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={loading}
            sx={{ borderRadius: 1, px: 3 }}
          >
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </Button>
        </Box>
      </Card>

      {/* --- Company Details --- */}
      <Card elevation={2} sx={{ borderRadius: 1, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" mb={2} color="primary">
            Company Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                label="Company Name"
                fullWidth
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                disabled={!isEditing || loading}
                margin="normal"
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                label="Email"
                fullWidth
                value={form.email}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid size={{xs: 12}}>
              <TextField
                label="Company Website"
                fullWidth
                value={form.companyWebsite}
                onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
                disabled={!isEditing || loading}
                placeholder="https://example.com"
                margin="normal"
              />
            </Grid>
            <Grid size={{xs: 12}}>
              <TextField
                label="Company Description"
                fullWidth
                multiline
                minRows={3}
                value={form.companyDescription}
                onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
                disabled={!isEditing || loading}
                margin="normal"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* --- Posted Jobs Section --- */}
      <Card elevation={2} sx={{ borderRadius: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" mb={2} color="primary">
            Posted Jobs
          </Typography>
          {!postedJobs?.length ? (
            <Typography color="text.secondary">No jobs posted yet.</Typography>
          ) : (
            <List>
              {postedJobs.map((job) => (
                <ListItem
                  key={job.id}
                  divider
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Button
                        href={`/jobs/${job.id}/edit`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight="600" color="text.primary">
                        {job.title}
                      </Typography>
                    }
                    secondary={`${job.location} — ${job.salary || 'Salary not specified'} — Status: ${job.status}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
