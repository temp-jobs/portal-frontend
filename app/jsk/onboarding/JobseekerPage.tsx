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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import EducationSection from '@/components/onboarding/EducationSection';
import ResumeUploadSection from '@/components/onboarding/ResumeUploadSection';

const steps = [
  'Personal Info',
  'Education',
  'Experience & Availability',
  'Upload Resume',
  'Preferences & Preview',
];

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

const experienceOptions = [
  'Fresher / No Experience',
  '<1 year',
  '1-3 years',
  '>3 years',
];

export default function JobseekerOnboarding() {
  const router = useRouter();
  const { user, setUser } = useAuthContext();

  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // --- State ---
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
    location: [0, 0] as [number, number],
  });

  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<{
    skills: string[];
    years: string;
    jobType: string;
    availability: string;
    expectedSalary: string;
    acceptsRemote: boolean;
    preferredIndustry: string; // <-- add this
  }>({
    skills: [],
    years: '',
    jobType: '',
    availability: '',
    expectedSalary: '',
    acceptsRemote: true,
    preferredIndustry: '', // <-- initial value
  });

  const [resume, setResume] = useState<File | null>(null);

  // --- Step navigation ---
  const handleNext = () => {
    if (activeStep === 0) {
      // Personal Info validation
      if (
        !personalInfo.fullName ||
        !personalInfo.fatherName ||
        !personalInfo.dob ||
        !personalInfo.gender ||
        !personalInfo.city ||
        !personalInfo.state ||
        !personalInfo.pincode
      ) {
        return showSnackbar('Please fill all personal info fields', 'error');
      }
      if (!isAbove15(personalInfo.dob))
        return showSnackbar('You must be at least 15 years old', 'error');
    }

    if (activeStep === 1 && education.length === 0) {
      return showSnackbar('Please add your education details', 'error');
    }

    if (
      activeStep === 2 &&
      (experience.skills.length === 0 || !experience.jobType || !experience.years)
    ) {
      return showSnackbar('Please fill skills, experience, and job type', 'error');
    }

    if (activeStep === 3 && !resume) {
      return showSnackbar('Please upload your resume', 'error');
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const isAbove15 = (dob: string) => dayjs().diff(dayjs(dob), 'year') >= 15;

  // --- Helper: convert pin code to [lng, lat] ---
  const geocodePinCode = async (pin: string): Promise<[number, number]> => {
    try {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pin}`
      );
      const data = res.data[0]?.PostOffice?.[0];
      if (!data) return [0, 0];
      // We'll fake lng/lat with static values as postal API doesn't give coordinates
      // In production, integrate Google Maps / OpenStreetMap geocoding
      return [parseFloat(pin) || 0, parseFloat(pin) || 0];
    } catch (err) {
      console.error(err);
      return [0, 0];
    }
  };

  // --- Submit ---
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      // --- convert pin to location ---
      const location = await geocodePinCode(personalInfo.pincode);

      // --- totalExperience in years ---
      const totalExperience =
        experience.years === 'Fresher / No Experience'
          ? 0
          : experience.years === '<1 year'
            ? 0.5
            : experience.years === '1-3 years'
              ? 2
              : 5;

      const payload = {
        name: personalInfo.fullName,
        education: education.map((edu) => ({
          ...edu,
          documentUrl: edu.documentPreview || '',
        })),
        experience: [
          {
            company: '',
            position: '',
            startDate: null,
            endDate: null,
            description: `${experience.years} (${experience.jobType}, ${experience.availability || 0} hrs/week)`,
          },
        ],
        totalExperience,
        skills: experience.skills,
        availability: experience.availability
          ? [
            {
              day: 'Any',
              startTime: '00:00',
              endTime: '23:59',
            },
          ]
          : [],
        pincode: personalInfo.pincode,
        preferredSalary: Number(experience.expectedSalary) || 0,
        preferredIndustry: experience.preferredIndustry || '',
        acceptsRemote: experience.acceptsRemote,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/profile/jobseeker`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => {
        const updated = prev ? { ...prev, profileCompleted: true } : prev;
        if (updated) localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });

      showSnackbar('Jobseeker profile created successfully!', 'success');
      setTimeout(() => router.push('/jsk/dashboard'), 1000);
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.response?.data?.message || 'Failed to submit profile', 'error');
    }
  };

  // --- Render steps ---
  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Full Name"
          value={personalInfo.fullName}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, fullName: e.target.value })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Father's Name"
          value={personalInfo.fatherName}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, fatherName: e.target.value })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          InputLabelProps={{ shrink: true }}
          value={personalInfo.dob}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, dob: e.target.value })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          label="Gender"
          value={personalInfo.gender}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, gender: e.target.value })
          }
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Current Address"
          value={personalInfo.address}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, address: e.target.value })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="City"
          value={personalInfo.city}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, city: e.target.value })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="State"
          value={personalInfo.state}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, state: e.target.value })
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Pin Code"
          value={personalInfo.pincode}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, pincode: e.target.value })
          }
        />
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
            onChange={(e) =>
              setExperience({ ...experience, skills: e.target.value as string[] })
            }
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
          label="Experience"
          value={experience.years}
          onChange={(e) => setExperience({ ...experience, years: e.target.value })}
        >
          {experienceOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
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
          type="number"
          value={experience.availability}
          onChange={(e) =>
            setExperience({ ...experience, availability: e.target.value })
          }
        />
      </Grid>
    </Grid>
  );

  const renderPreferences = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Expected Salary (per hour)"
          value={experience.expectedSalary}
          onChange={(e) =>
            setExperience({ ...experience, expectedSalary: e.target.value })
          }
          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Preferred Industry"
          value={experience.preferredIndustry || ''}
          onChange={(e) =>
            setExperience({ ...experience, preferredIndustry: e.target.value })
          }
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={experience.acceptsRemote}
              onChange={(e) =>
                setExperience({ ...experience, acceptsRemote: e.target.checked })
              }
            />
          }
          label="Accept Remote Jobs"
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
          <Typography>City: {personalInfo.city}</Typography>
          <Typography>State: {personalInfo.state}</Typography>
          <Typography>Pin Code: {personalInfo.pincode}</Typography>
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
            Experience & Skills
          </Typography>
          <Typography>
            Skills: {experience.skills.join(', ')}
          </Typography>
          <Typography>Experience: {experience.years}</Typography>
          <Typography>Job Type: {experience.jobType}</Typography>
          <Typography>Availability: {experience.availability} hrs/week</Typography>
          <Typography>Expected Salary: ₹{experience.expectedSalary}</Typography>
          <Typography>Preferred Industry: {experience.preferredIndustry}</Typography>
          <Typography>Accepts Remote: {experience.acceptsRemote ? 'Yes' : 'No'}</Typography>
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
        {activeStep === 4 && (
          <>
            {renderPreferences()}
            <Box mt={4}>{renderPreview()}</Box>
          </>
        )}
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
