'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../contexts/AuthContext';

interface OTPModalProps {
  email: string;
  onClose: () => void;
}

export default function OTPModal({ email, onClose }: OTPModalProps) {
  const { setUser } = useAuthContext();
  const router = useRouter();

  const OTP_LENGTH = 6;
  const RESEND_COUNTDOWN = 60; // seconds

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(RESEND_COUNTDOWN);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Handle input change and auto-focus next box
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  // Handle backspace and previous box focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Verify OTP
  const handleOtpVerified = async () => {
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) {
      setOtpError('Please enter the full 6-digit OTP');
      return;
    }

    setLoading(true);
    setOtpError(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        email,
        otp: otpString,
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      router.push(user.role === 'employer' ? '/em/onboarding' : '/jsk/onboarding');
      onClose();
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setOtpError(null);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, { email });
      setOtpError('OTP resent successfully!');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setResendTimer(RESEND_COUNTDOWN);
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Countdown for resend button
  useEffect(() => {
    inputRefs.current[0]?.focus();
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <Paper sx={{ p: 4, borderRadius: 2, width: 380 }}>
        <Typography variant="h6" mb={1} textAlign="center">
          Enter the 6-digit OTP
        </Typography>
        <Typography variant="subtitle2" mb={3} textAlign="center" color="text.secondary">
          sent to {email}
        </Typography>

        {otpError && (
          <Alert
            severity={otpError.includes('successfully') ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {otpError}
          </Alert>
        )}

        <Grid container justifyContent="center" spacing={1} sx={{ mb: 3 }}>
  {otp.map((value, index) => (
    <Grid key={index}> {/* add item prop */}
      <input
        ref={(el) => { inputRefs.current[index] = el; }} // callback ref returns void
        type="text"
        inputMode="numeric"
        pattern="\d*"
        maxLength={1}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          if (!/^\d*$/.test(val)) return;

          const newOtp = [...otp];
          newOtp[index] = val.slice(-1); // ensure only 1 char
          setOtp(newOtp);

          if (val && index < OTP_LENGTH - 1) {
            setTimeout(() => {
              inputRefs.current[index + 1]?.focus();
            }, 0);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];
            if (otp[index]) {
              newOtp[index] = '';
              setOtp(newOtp);
            } else if (index > 0) {
              newOtp[index - 1] = '';
              setOtp(newOtp);
              setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
            }
          }
        }}
        style={{
          width: 50,
          height: 50,
          fontSize: 24,
          textAlign: 'center',
          borderRadius: 8,
          border: '1px solid #ccc',
          outline: 'none',
          boxShadow: '0 0 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s',
        }}
      />
    </Grid>
  ))}
</Grid>

        <Button
          onClick={handleOtpVerified}
          disabled={loading}
          fullWidth
          variant="contained"
          sx={{ mb: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
        </Button>

        <Button
          onClick={handleResendOtp}
          disabled={resendTimer > 0 || loading}
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
        >
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
        </Button>

        <Button onClick={onClose} fullWidth variant="text">
          Cancel
        </Button>
      </Paper>
    </Box>
  );
}
