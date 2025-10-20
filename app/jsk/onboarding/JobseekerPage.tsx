'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  MenuItem,
  Avatar,
  Grid,
  Snackbar,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import EducationSection from '@/components/onboarding/EducationSection';
import ResumeUploadSection from '@/components/onboarding/ResumeUploadSection';

const steps = ['Personal Info', 'Education', 'Experience & Availability', 'Upload Resume', 'Preview'];

const skillsList = [
  'JavaScript',
  'React',
  'Node.js',
  'UI/UX Design',
  'Python',
  'Data Entry',
  'Digital Marketing',
  'Customer Support',
  'Content Writing',
];

export default function JobseekerOnboarding() {
  const router = useRouter();
  const { user, setUser } = useAuthContext();

  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    fatherName: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    photo: null as File | null,
    photoPreview: '',
  });

  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState({
    skills: [] as string[],
    years: '',
    jobType: '',
    availability: '',
    expectedSalary: '',
  });
  const [resume, setResume] = useState<File | null>(null);

  const isAbove15 = (dob: string) => dayjs().diff(dayjs(dob), 'year') >= 15;

  const handleNext = () => {
    if (activeStep === 0) {
      if (!personalInfo.fullName || !personalInfo.fatherName || !isAbove15(personalInfo.dob)) {
        return setSnackbar({
          open: true,
          message: 'Please fill personal details correctly (age must be 15+)',
          severity: 'error',
        });
      }
    }
    if (activeStep === 1 && education.length === 0) {
      return setSnackbar({ open: true, message: 'Please add your education details', severity: 'error' });
    }
    if (activeStep === 2 && (experience.skills.length === 0 || !experience.jobType)) {
      return setSnackbar({
        open: true,
        message: 'Please fill skills and job preferences',
        severity: 'error',
      });
    }
    if (activeStep === 3 && !resume) {
      return setSnackbar({
        open: true,
        message: 'Please upload your resume before continuing',
        severity: 'error',
      });
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('Unauthorized');

      // 🧠 Correct payload format for new schema
      const payload = {
          personalInfo,
          education,
          skills: experience.skills,
        experience: [
            {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: `${experience.years} (${experience.jobType}, ${experience.availability} hrs/week)`,
            },
        ],
        expectedSalary: experience.expectedSalary,
    };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/profile/jobseeker`, payload, {
          headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => {
          const updated = prev ? { ...prev, profileCompleted: true } : prev;
          if (updated) localStorage.setItem('user', JSON.stringify(updated));
          return updated;
      });

      setSnackbar({
          open: true,
          message: 'Profile created successfully!',
          severity: 'success',
      });

        setTimeout(() => router.push('/jsk/dashboard'), 1000);
      } catch (err: any) {
          console.error('❌ Jobseeker profile submission failed:', err);
          setSnackbar({
              open: true,
              message: err.response?.data?.message || 'Failed to submit profile.',
              severity: 'error',
          });
      }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPersonalInfo((p) => ({
      ...p,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    }));
  };

  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Full Name"
          value={personalInfo.fullName}
          onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Father's Name"
          value={personalInfo.fatherName}
          onChange={(e) => setPersonalInfo({ ...personalInfo, fatherName: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          InputLabelProps={{ shrink: true }}
          value={personalInfo.dob}
          onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          label="Gender"
          value={personalInfo.gender}
          onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          label="Current Address"
          value={personalInfo.address}
          onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="City"
          value={personalInfo.city}
          onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="State"
          value={personalInfo.state}
          onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Pincode"
          value={personalInfo.pincode}
          onChange={(e) => setPersonalInfo({ ...personalInfo, pincode: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12 }} textAlign="center">
        <Button variant="contained" component="label">
          Upload Photo
          <input hidden accept="image/*" type="file" onChange={handleFileChange} />
        </Button>
        {personalInfo.photoPreview && (
          <Avatar src={personalInfo.photoPreview} alt="Preview" sx={{ width: 100, height: 100, mt: 2, mx: 'auto' }} />
        )}
      </Grid>
    </Grid>
  );

  const renderExperience = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Skills</InputLabel>
          <Select
            multiple
            value={experience.skills}
            onChange={(e) => setExperience({ ...experience, skills: e.target.value as string[] })}
            input={<OutlinedInput label="Skills" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {skillsList.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          select
          fullWidth
          label="Years of Experience"
          value={experience.years}
          onChange={(e) => setExperience({ ...experience, years: e.target.value })}
        >
          <MenuItem value="<1 year">{'<1 year'}</MenuItem>
          <MenuItem value="1-3 years">{'1–3 years'}</MenuItem>
          <MenuItem value=">3 years">{'>3 years'}</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          select
          fullWidth
          label="Preferred Job Type"
          value={experience.jobType}
          onChange={(e) => setExperience({ ...experience, jobType: e.target.value })}
        >
          <MenuItem value="Full-time">Full-time</MenuItem>
          <MenuItem value="Part-time">Part-time</MenuItem>
          <MenuItem value="Remote">Remote</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Weekly Availability (hrs)"
          value={experience.availability}
          onChange={(e) => setExperience({ ...experience, availability: e.target.value })}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Expected Salary (per hour)"
          value={experience.expectedSalary}
          onChange={(e) => setExperience({ ...experience, expectedSalary: e.target.value })}
          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
        />
      </Grid>
    </Grid>
  );

  const renderPreview = () => (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Review Your Details
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold">
            Personal Info
          </Typography>
          <Typography>Name: {personalInfo.fullName}</Typography>
          <Typography>Father's Name: {personalInfo.fatherName}</Typography>
          <Typography>DOB: {personalInfo.dob}</Typography>
          <Typography>Gender: {personalInfo.gender}</Typography>
          <Typography>Address: {personalInfo.address}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Education
          </Typography>
          {education.map((edu, i) => (
            <Typography key={i}>
              {edu.level} — {edu.institute} ({edu.passingYear}) — {edu.percentage}%
            </Typography>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Experience
          </Typography>
          <Typography>Skills: {experience.skills.join(', ')}</Typography>
          <Typography>Years: {experience.years}</Typography>
          <Typography>Type: {experience.jobType}</Typography>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        Jobseeker Profile Setup
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 6 }}>
        {activeStep === 0 && renderPersonalInfo()}
        {activeStep === 1 && <EducationSection onChange={setEducation} />}
        {activeStep === 2 && renderExperience()}
        {activeStep === 3 && <ResumeUploadSection onChange={setResume} />}
        {activeStep === 4 && renderPreview()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
