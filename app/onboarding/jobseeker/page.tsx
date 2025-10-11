'use client';

import React, { useState, useEffect } from 'react';
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
import {useRouter} from 'next/navigation';

const steps = ['Personal Info', 'Education', 'Experience & Availability', 'Preview'];



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
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // const user = localStorage.getItem('user');

  // ------------------ Personal Info ------------------
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

  // ------------------ Education ------------------
  const [education, setEducation] = useState({
    qualification: '',
    institute: '',
    passingYear: '',
    resume: null as File | null,
    resumePreview: '',
    documents: [] as File[],
    documentsPreview: [] as string[],
  });

  // ------------------ Experience & Availability ------------------
  const [experience, setExperience] = useState({
    skills: [] as string[],
    years: '',
    jobType: '',
    availability: '',
    expectedSalary: '',
  });

  // ------------------ Validation Helper ------------------
  const isAbove15 = (dob: string) => {
    const age = dayjs().diff(dayjs(dob), 'year');
    return age >= 15;
  };

  // ------------------ Handlers ------------------
  const handleNext = () => {
    if (activeStep === 0) {
      if (!personalInfo.fatherName || !personalInfo.dob || !isAbove15(personalInfo.dob)) {
        setSnackbar({
          open: true,
          message: 'Please fill all personal details correctly (age must be 15+)',
          severity: 'error',
        });
        return;
      }
    }
    if (activeStep === 1) {
      if (!education.qualification) {
        setSnackbar({ open: true, message: 'Please select qualification', severity: 'error' });
        return;
      }
    }
    if (activeStep === 2) {
      if (experience.skills.length === 0 || !experience.jobType) {
        setSnackbar({
          open: true,
          message: 'Please fill skills and job preferences',
          severity: 'error',
        });
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, multiple = false) => {
    const files = e.target.files;
    if (!files) return;

    if (field === 'photo') {
      const file = files[0];
      setPersonalInfo((p) => ({
        ...p,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    } else if (field === 'resume') {
      const file = files[0];
      setEducation((e) => ({
        ...e,
        resume: file,
        resumePreview: URL.createObjectURL(file),
      }));
    } else if (field === 'documents') {
      const fileArr = Array.from(files);
      setEducation((e) => ({
        ...e,
        documents: fileArr,
        documentsPreview: fileArr.map((f) => URL.createObjectURL(f)),
      }));
    }
  };

  // ------------------ Submit ------------------
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        skills: experience.skills,
        experience: [experience.years, experience.jobType, experience.availability],
        education: [education.qualification, education.institute, education.passingYear],
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/profile/jobseeker`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({
        open: true,
        message: 'Profile created successfully!',
        severity: 'success',
      });

      const {user} = response.data;

      if(user.profileCompleted){
        router.push('/profile/jobseeker')
      }
    } catch (err: any) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to submit profile.',
        severity: 'error',
      });
    }
  };

  // ------------------ UI Renderers ------------------
  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      <Grid size={{xs:12, md: 6}}>
        <TextField fullWidth label="Full Name" value={personalInfo.fullName} 
        onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
        />
      </Grid>
      <Grid size={{xs:12, md: 6}}>
        <TextField
          fullWidth
          label="Father's Name"
          value={personalInfo.fatherName}
          onChange={(e) => setPersonalInfo({ ...personalInfo, fatherName: e.target.value })}
        />
      </Grid>
      <Grid size={{xs:12, md: 6}}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          InputLabelProps={{ shrink: true }}
          value={personalInfo.dob}
          onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
        />
      </Grid>
      <Grid size={{xs:12, md: 6}}>
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
      <Grid size={{xs:12}}>
        <TextField
          fullWidth
          multiline
          label="Current Address"
          value={personalInfo.address}
          onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
        />
      </Grid>
      <Grid size={{xs:12, md: 6}}>
        <TextField
          fullWidth
          label="City"
          value={personalInfo.city}
          onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
        />
      </Grid>
      <Grid size={{xs:12, md: 6}}>
        <TextField
          fullWidth
          label="State"
          value={personalInfo.state}
          onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
        />
      </Grid>
      <Grid size={{xs:12, md: 6}}>
        <TextField
          fullWidth
          label="Pincode"
          value={personalInfo.pincode}
          onChange={(e) => setPersonalInfo({ ...personalInfo, pincode: e.target.value })}
        />
      </Grid>
      <Grid size={{xs:12}} textAlign="center">
        <Button variant="contained" component="label">
          Upload Photo
          <input hidden accept="image/*" type="file" onChange={(e) => handleFileChange(e, 'photo')} />
        </Button>
        {personalInfo.photoPreview && (
          <Avatar
            src={personalInfo.photoPreview}
            alt="Preview"
            sx={{ width: 100, height: 100, mt: 2, mx: 'auto' }}
          />
        )}
      </Grid>
    </Grid>
  );

  const renderEducation = () => (
    <Grid container spacing={3}>
      <Grid size={{xs:12, md: 6}}>
        <TextField
          select
          fullWidth
          label="Highest Qualification"
          value={education.qualification}
          onChange={(e) => setEducation({ ...education, qualification: e.target.value })}
        >
          <MenuItem value="Below 10th">Below 10th</MenuItem>
          <MenuItem value="10th">10th</MenuItem>
          <MenuItem value="12th">12th</MenuItem>
          <MenuItem value="Diploma">Diploma</MenuItem>
          <MenuItem value="Graduation">Graduation</MenuItem>
          <MenuItem value="Post Graduation">Post Graduation</MenuItem>
        </TextField>
      </Grid>
      {education.qualification !== 'Below 10th' && (
        <>
          <Grid size={{xs:12, md: 6}}>
            <TextField
              fullWidth
              label="Institute Name"
              value={education.institute}
              onChange={(e) => setEducation({ ...education, institute: e.target.value })}
            />
          </Grid>
          <Grid size={{xs:12, md: 6}}>
            <TextField
              fullWidth
              label="Year of Passing"
              value={education.passingYear}
              onChange={(e) => setEducation({ ...education, passingYear: e.target.value })}
            />
          </Grid>
          <Grid size={{xs:12}}>
            <Button variant="outlined" component="label">
              Upload Resume
              <input hidden accept=".pdf" type="file" onChange={(e) => handleFileChange(e, 'resume')} />
            </Button>
            {education.resumePreview && (
              <Typography sx={{ mt: 1, fontSize: 14 }}>{education.resume?.name}</Typography>
            )}
          </Grid>
          <Grid size={{xs:12}}>
            <Button variant="outlined" component="label">
              Upload Documents
              <input hidden multiple accept=".pdf,image/*" type="file" onChange={(e) => handleFileChange(e, 'documents', true)} />
            </Button>
            <Stack direction="row" spacing={2} mt={2}>
              {education.documentsPreview.map((src, idx) => (
                <Avatar key={idx} src={src} sx={{ width: 60, height: 60 }} />
              ))}
            </Stack>
          </Grid>
        </>
      )}
    </Grid>
  );

  const renderExperience = () => (
    <Grid container spacing={3}>
      <Grid size={{xs:12, md: 6}}>
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
      <Grid size={{xs:12, md: 4}}>
        <TextField
          fullWidth
          label="Years of Experience"
          value={experience.years}
          onChange={(e) => setExperience({ ...experience, years: e.target.value })}
        />
      </Grid>
      <Grid size={{xs:12, md: 4}}>
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
      <Grid size={{xs:12, md: 4}}>
        <TextField
          fullWidth
          label="Weekly Availability (hrs)"
          value={experience.availability}
          onChange={(e) => setExperience({ ...experience, availability: e.target.value })}
        />
      </Grid>
      <Grid size={{xs:12, md: 6}}>
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
          <Typography>Qualification: {education.qualification}</Typography>
          <Typography>Institute: {education.institute}</Typography>
          <Typography>Year: {education.passingYear}</Typography>
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
        {activeStep === 1 && renderEducation()}
        {activeStep === 2 && renderExperience()}
        {activeStep === 3 && renderPreview()}
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
