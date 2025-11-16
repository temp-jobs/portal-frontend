'use client';

import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Divider,
  CircularProgress,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Input from '../../components/Input';
import { useAuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import FullPageLoader from '@/components/FullPageLoader';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';

export default function RegisterPage() {
  const theme = useTheme();
  const { register, user, setUser } = useAuthContext();
  const router = useRouter();

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const displayName = role === 'jobseeker' ? name : companyName;
      const data = await register(displayName, email, password, role);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (role === 'employer') {
        router.push(data.user.profileCompleted ? '/em/dashboard' : '/em/onboarding');
      } else {
        router.push(data.user.profileCompleted ? '/jsk/dashboard' : '/jsk/onboarding');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRole: 'jobseeker' | 'employer' | null
  ) => {
    if (newRole) setRole(newRole);
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
  if (!credentialResponse.credential) {
    setError('Google login failed');
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      token: credentialResponse.credential,
      role, // only needed for first-time signup
    });

    const { token, user } = res.data; // destructure token and user from response

    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Update context
    setUser(user);

    // Redirect based on role
    if (user.role === 'employer') {
      router.push(user.profileCompleted ? '/em/dashboard' : '/em/onboarding');
    } else {
      router.push(user.profileCompleted ? '/jsk/dashboard' : '/jsk/onboarding');
    }
  } catch (err: any) {
    console.error('Google login failed', err);
    setError(err?.response?.data?.message || 'Google login failed');
  } finally {
    setLoading(false);
  }
};

  if (loading) return <FullPageLoader message="Signing you up..." />;

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* LEFT SIDE – Marketing */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: theme.palette.common.white,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: { xs: 4, md: 10 },
        }}
      >
        <Typography variant="h3" fontWeight={800} mb={3}>
          Join{' '}
          <Typography
            component="span"
            color={theme.palette.common.white}
            fontWeight={800}
          >
            Part Time Match
          </Typography>
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
          bgcolor: theme.palette.background.default,
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

          <ToggleButtonGroup
  value={role}
  exclusive
  fullWidth
  onChange={handleRoleChange}
  sx={{
    mb: 3,
    gap: 1,
    '& .MuiToggleButton-root': {
      flex: 1,
      borderRadius: 3, 
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      padding: '10px 14px',
      border: `1px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        borderRadius: 3, // fully rounded both sides
        boxShadow: theme.shadows[3],
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    },
  }}
>
  <ToggleButton value="jobseeker">
    <PersonOutlineIcon fontSize="small" />
    Job Seeker
  </ToggleButton>
  <ToggleButton value="employer">
    <BusinessCenterIcon fontSize="small" />
    Employer
  </ToggleButton>
</ToggleButtonGroup>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

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
              sx={{ mt: 3, borderRadius: 3, py: 1.5, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={26} sx={{ color: 'white' }} /> : 'Register'}
            </Button>

            <Divider sx={{ my: 3 }}>or</Divider>

            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setError('Google login failed')} />

            <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
              Already have an account?{' '}
              <Box
                component="span"
                sx={{ color: theme.palette.primary.main, fontWeight: 600, cursor: 'pointer' }}
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
