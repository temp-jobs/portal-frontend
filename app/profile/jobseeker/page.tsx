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
import {useRouter} from 'next/navigation';
import FullPageLoader from '../../../components/FullPageLoader'

interface AppliedJob {
  id: string;
  title: string;
  company: string;
  status: string;
}

export default function JobseekerProfilePage() {

  const router = useRouter();
  const { user, token } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [education, setEducation] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/jobseeker`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if(!res?.data.profileCompleted){
          router.push('/onboarding/jobseeker')
        } else if (res?.data) {
          setProfile(res.data);
          setAppliedJobs(res.data.appliedJobs || []);
          setName(res.data.name || '');
          setSkills(res.data.skills || []);
          setExperience(res.data.experience || []);
          setEducation(res.data.education || []);
        }
      } catch (err) {
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

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/jobseeker`,
        { name, skills, experience, education },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      // window.location.reload();
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FullPageLoader message="Please wait..." />
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        👤 Welcome to your profile
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
          {profile?.name?.[0] || 'U'}
        </Avatar>
        <Box flex={1}>
          <Typography variant="h5" fontWeight="600">
            {profile?.name}
          </Typography>
          <Typography color="text.secondary">{profile?.email}</Typography>
          <Chip
            label={profile?.role || 'Jobseeker'}
            color="primary"
            variant="outlined"
            sx={{ mt: 1, textTransform: 'capitalize' }}
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

      {/* --- Personal Information --- */}
      <Card elevation={2} sx={{ borderRadius: 1, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" mb={2} color="primary">
            Personal Information
          </Typography>

          <TextField
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing || loading}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={profile?.email || ''}
            disabled
            margin="normal"
          />
        </CardContent>
      </Card>

      {/* --- Skills Section --- */}
      <Card elevation={2} sx={{ borderRadius: 1, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" mb={2} color="primary">
            Skills
          </Typography>

          {isEditing ? (
            <TextField
              label="Enter comma-separated skills"
              fullWidth
              value={skills.join(', ')}
              onChange={(e) => setSkills(e.target.value.split(',').map(s => s.trim()))}
              margin="normal"
            />
          ) : profile?.skills?.length ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.skills.map((skill: string, i: number) => (
                <Chip key={i} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">No skills added yet.</Typography>
          )}
        </CardContent>
      </Card>

      {/* --- Experience Section --- */}
      <Card elevation={2} sx={{ borderRadius: 1, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" mb={2} color="primary">
            Experience
          </Typography>
          <Grid container spacing={2}>
            {['Type', 'Work Mode', 'Availability'].map((label, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                {isEditing ? (
                  <TextField
                    label={label}
                    fullWidth
                    value={experience[idx] || ''}
                    onChange={(e) => {
                      const newExp = [...experience];
                      newExp[idx] = e.target.value;
                      setExperience(newExp);
                    }}
                    margin="normal"
                  />
                ) : (
                  <Typography>
                    <strong>{label}:</strong> {experience[idx] || 'N/A'}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* --- Education Section --- */}
      <Card elevation={2} sx={{ borderRadius: 1, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" mb={2} color="primary">
            Education
          </Typography>
          <Grid container spacing={2}>
            {['Qualification', 'Institute', 'Passing Year'].map((label, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                {isEditing ? (
                  <TextField
                    label={label}
                    fullWidth
                    value={education[idx] || ''}
                    onChange={(e) => {
                      const newEdu = [...education];
                      newEdu[idx] = e.target.value;
                      setEducation(newEdu);
                    }}
                    margin="normal"
                  />
                ) : (
                  <Typography>
                    <strong>{label}:</strong> {education[idx] || 'N/A'}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* --- Applied Jobs Section --- */}
      <Card elevation={2} sx={{ borderRadius: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" mb={2} color="primary">
            Applied Jobs
          </Typography>
          {!appliedJobs?.length ? (
            <Typography color="text.secondary">No applied jobs yet.</Typography>
          ) : (
            <List>
              {appliedJobs.map((job) => (
                <ListItem key={job.id} divider>
                  <ListItemText
                    primary={
                      <Typography fontWeight="600" color="text.primary">
                        {job.title}
                      </Typography>
                    }
                    secondary={`${job.company} — Status: ${job.status}`}
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
