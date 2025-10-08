'use client';

import React, { useContext, useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const OnboardingPage = () => {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Jobseeker fields
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');

  // Employer fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }
    if (user.profileCompleted) {
      router.push('/');
    }
  }, [user, token, router]);

  if (!user || !token) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (user.role === 'jobseeker') {
        await axios.post(
          `${API_URL}/api/profile/jobseeker`,
          { skills, experience, education },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}/api/profile/employer`,
          { companyName, companyWebsite, companyDescription },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {user.role === 'jobseeker' ? 'Complete Your Jobseeker Profile' : 'Complete Your Employer Profile'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {user.role === 'jobseeker' ? (
          <>
            <TextField
              label="Skills"
              fullWidth
              required
              margin="normal"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js"
            />
            <TextField
              label="Experience"
              fullWidth
              required
              margin="normal"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 3 years at XYZ company"
            />
            <TextField
              label="Education"
              fullWidth
              required
              margin="normal"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. Bachelor of Computer Science"
            />
          </>
        ) : (
          <>
            <TextField
              label="Company Name"
              fullWidth
              required
              margin="normal"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <TextField
              label="Company Website"
              fullWidth
              margin="normal"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
            />
            <TextField
              label="Company Description"
              fullWidth
              required
              multiline
              rows={4}
              margin="normal"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Profile'}
        </Button>
      </Box>
    </Container>
  );
};

export default OnboardingPage;