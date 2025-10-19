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
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FullPageLoader from '@/components/FullPageLoader';
import Input from '@/components/Input';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

export default function LoginPage() {
  const { login } = useAuthContext();
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Optional: redirect handled inside login
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader message="Logging you in..." />;

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* LEFT SIDE – Brand Intro */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: theme.palette.common.white,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' },
          p: { xs: 5, md: 10 },
        }}
      >
        <Typography variant="h3" fontWeight={800} mb={3}>
          Welcome Back
        </Typography>
        <Typography
          variant="h6"
          sx={{ opacity: 0.9, mb: 4, maxWidth: 420 }}
        >
          Log in to access personalized job matches, apply faster, and manage
          your professional profile.
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85 }}>
          ✔ Save your favorite jobs <br />
          ✔ Manage applications easily <br />
          ✔ Grow your part-time career
        </Typography>
      </Grid>

      {/* RIGHT SIDE – Login Form */}
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
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={3}
            textAlign="center"
          >
            Log In to Your Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              autoComplete="current-password"
            />

            <Box
              sx={{
                textAlign: 'right',
                mt: 1,
                mb: 2,
                color: 'primary.main',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => router.push('/forgot-password')}
            >
              Forgot Password?
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={26} sx={{ color: 'white' }} />
              ) : (
                'Log In'
              )}
            </Button>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<GoogleIcon />}
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                },
              }}
            >
              Continue with Google
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 3 }}
            >
              Don’t have an account?{' '}
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => router.push('/register')}
              >
                Sign up
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
