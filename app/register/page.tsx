'use client';

import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Input from '../../components/Input';
import { useAuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { register } = useAuthContext();
  const router = useRouter();

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const displayName = role === 'jobseeker' ? name : companyName;
      await register(displayName, email, password, role);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* LEFT SIDE – Marketing */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          background: 'linear-gradient(135deg, #6fda44 0%, #3ac569 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: { xs: 4, md: 10 },
        }}
      >
        <Typography variant="h3" fontWeight={800} mb={3}>
          Join <Box component="span" color="#fff">Part Time Match</Box>
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 420 }}>
          Whether you’re looking for flexible work or hiring top part-time talent — our platform connects the right people, faster.
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85 }}>
          ✔ Access hundreds of verified listings <br />
          ✔ Build your professional profile <br />
          ✔ Start earning or hiring today
        </Typography>
      </Grid>

      {/* RIGHT SIDE – Form */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 4, md: 8 },
          bgcolor: 'background.default',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
            Create Your Account
          </Typography>

          {/* Role Selection */}
          <ToggleButtonGroup
            value={role}
            exclusive
            fullWidth
            onChange={(_, value) => value && setRole(value)}
            sx={{
              mb: 3,
              '& .MuiToggleButton-root': {
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                p: 1.5,
              },
            }}
          >
            <ToggleButton value="jobseeker">
              <PersonOutlineIcon sx={{ mr: 1 }} /> Job Seeker
            </ToggleButton>
            <ToggleButton value="employer">
              <BusinessCenterIcon sx={{ mr: 1 }} /> Employer
            </ToggleButton>
          </ToggleButtonGroup>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {role === 'jobseeker' ? (
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            ) : (
              <Input
                label="Organization / Company Name"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                autoComplete="organization"
              />
            )}

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={26} sx={{ color: 'white' }} />
              ) : (
                'Register'
              )}
            </Button>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Continue with Google
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
              Already have an account?{' '}
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => router.push('/login')}
              >
                Login
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
