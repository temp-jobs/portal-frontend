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
  List,
  ListItem,
  ListItemText,
  Grid
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuthContext } from '../../../contexts/AuthContext';
import FullPageLoader from '../../../components/FullPageLoader';

interface AppliedJob {
  id: string;
  title: string;
  company: string;
  status: string;
}

interface Experience {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Education {
  level: string;
  institute?: string;
  passingYear?: string;
  marksObtained?: string;
  totalMarks?: string;
  percentage?: string;
  documentUrl?: string;
}

interface JobseekerProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profileCompleted: boolean;
  skills: string[];
  experience: Experience[];
  education: Education[];
  appliedJobs: AppliedJob[];
}


export default function JobseekerProfilePage() {
  const router = useRouter();
  const { token } = useAuthContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<JobseekerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Editable fields
  const [name, setName] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);

  // Fetch Jobseeker profile
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await axios.get<JobseekerProfile>(
          `${process.env.NEXT_PUBLIC_API_URL}/profile/jobseeker`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;

        if (!data.profileCompleted) {
          router.push('/jsk/onboarding');
          return;
        }

        // 🧠 Normalize any existing string[] data for backward compatibility
        const normalizedExperience = Array.isArray(data.experience)
          ? data.experience.map((exp: any) =>
            typeof exp === 'string'
              ? { description: exp }
              : {
                company: exp.company || '',
                position: exp.position || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                description: exp.description || '',
              }
          )
          : [];

        const normalizedEducation = Array.isArray(data.education)
          ? data.education.map((edu: any) =>
            typeof edu === 'string'
              ? { level: edu }
              : {
                level: edu.level || '',
                institute: edu.institute || '',
                passingYear: edu.passingYear || '',
                marksObtained: edu.marksObtained || '',
                totalMarks: edu.totalMarks || '',
                percentage: edu.percentage || '',
                documentUrl: edu.documentUrl || '',
              }
          )
          : [];

        setProfile(data);
        setName(data.name || '');
        setSkills(data.skills || []);
        setExperience(normalizedExperience);
        setEducation(normalizedEducation);
      } catch (err) {
        const axiosErr = err as AxiosError;
        console.error('Profile fetch error:', axiosErr);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, router]);


  const handleSave = async (): Promise<void> => {
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      // 🧠 Normalize experience + education for backend
      const formattedExperience = Array.isArray(experience)
        ? experience.map((exp: any) =>
          typeof exp === 'string'
            ? { description: exp }
            : {
              company: exp.company || '',
              position: exp.position || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              description: exp.description || '',
            }
        )
        : [];

      const formattedEducation = Array.isArray(education)
        ? education.map((edu: any) =>
          typeof edu === 'string'
            ? { level: edu }
            : {
              level: edu.level || '',
              institute: edu.institute || '',
              passingYear: edu.passingYear || '',
              marksObtained: edu.marksObtained || '',
              totalMarks: edu.totalMarks || '',
              percentage: edu.percentage || '',
              documentUrl: edu.documentUrl || '',
            }
        )
        : [];

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/jobseeker`,
        { name, skills, experience: formattedExperience, education: formattedEducation },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };


  if (loading && !profile) return <FullPageLoader message="Please wait..." />;

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
          <Typography variant="h5" fontWeight={600}>
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
          <Typography variant="h6" fontWeight={600} mb={2} color="primary">
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
          <Typography variant="h6" fontWeight={600} mb={2} color="primary">
            Skills
          </Typography>

          {isEditing ? (
            <TextField
              label="Enter comma-separated skills"
              fullWidth
              value={skills.join(', ')}
              onChange={(e) =>
                setSkills(e.target.value.split(',').map((s) => s.trim()))
              }
              margin="normal"
            />
          ) : profile?.skills?.length ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.skills.map((skill, i) => (
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
          <Typography variant="h6" fontWeight={600} mb={2} color="primary">
            Experience
          </Typography>

          {!experience.length ? (
            <Typography color="text.secondary">No experience added yet.</Typography>
          ) : (
            experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Company"
                      fullWidth
                      value={exp.company || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index] = { ...newExp[index], company: e.target.value };
                        setExperience(newExp);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Position"
                      fullWidth
                      value={exp.position || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index] = { ...newExp[index], position: e.target.value };
                        setExperience(newExp);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Start Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={exp.startDate || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index] = { ...newExp[index], startDate: e.target.value };
                        setExperience(newExp);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="End Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={exp.endDate || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index] = { ...newExp[index], endDate: e.target.value };
                        setExperience(newExp);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      value={exp.description || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index] = { ...newExp[index], description: e.target.value };
                        setExperience(newExp);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))
          )}

          {isEditing && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() =>
                setExperience([
                  ...experience,
                  { company: '', position: '', startDate: '', endDate: '', description: '' },
                ])
              }
            >
              + Add Experience
            </Button>
          )}
        </CardContent>
      </Card>



      {/* --- Education Section --- */}
      <Card elevation={2} sx={{ borderRadius: 1, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2} color="primary">
            Education
          </Typography>

          {!education.length ? (
            <Typography color="text.secondary">No education added yet.</Typography>
          ) : (
            education.map((edu, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Qualification"
                      fullWidth
                      value={edu.level || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...newEdu[index], level: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Institute"
                      fullWidth
                      value={edu.institute || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...newEdu[index], institute: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Passing Year"
                      fullWidth
                      value={edu.passingYear || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...newEdu[index], passingYear: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Marks Obtained"
                      fullWidth
                      value={edu.marksObtained || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...newEdu[index], marksObtained: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Total Marks"
                      fullWidth
                      value={edu.totalMarks || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...newEdu[index], totalMarks: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Percentage"
                      fullWidth
                      value={edu.percentage || ''}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...newEdu[index], percentage: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))
          )}

          {isEditing && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() =>
                setEducation([
                  ...education,
                  {
                    level: '',
                    institute: '',
                    passingYear: '',
                    marksObtained: '',
                    totalMarks: '',
                    percentage: '',
                  },
                ])
              }
            >
              + Add Education
            </Button>
          )}
        </CardContent>
      </Card>


      {/* --- Applied Jobs Section --- */}
      <Card elevation={2} sx={{ borderRadius: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2} color="primary">
            Applied Jobs
          </Typography>
          {!profile?.appliedJobs?.length ? (
            <Typography color="text.secondary">No applied jobs yet.</Typography>
          ) : (
            <List>
                {profile.appliedJobs.map((job) => (
                <ListItem key={job.id} divider>
                  <ListItemText
                    primary={
                      <Typography fontWeight={600} color="text.primary">
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
