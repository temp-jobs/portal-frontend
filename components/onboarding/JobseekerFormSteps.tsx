import React from 'react';
import { Box, Grid, TextField, Typography, Chip, Stack } from '@mui/material';
import Input from '@/components/Input';

interface Props {
  activeStep: number;
}

export default function JobseekerFormSteps({ activeStep }: Props) {
  switch (activeStep) {
    case 0:
      return (
        <Box>
          <Typography variant="h6" mb={2}>Personal Information</Typography>
          <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 6}}><Input label="Full Name" /></Grid>
            <Grid size={{xs: 12, md: 6}}><Input label="Location" /></Grid>
            <Grid size={{xs: 12, md: 6}}><TextField fullWidth multiline rows={3} label="Short Bio" /></Grid>
          </Grid>
        </Box>
      );

    case 1:
      return (
        <Box>
          <Typography variant="h6" mb={2}>Skills & Preferences</Typography>
          <Stack direction="row" spacing={1}>
            {['React', 'Node.js', 'UI/UX', 'MongoDB', 'Python'].map((skill) => (
              <Chip key={skill} label={skill} clickable />
            ))}
          </Stack>
        </Box>
      );

    case 2:
      return (
        <Box>
          <Typography variant="h6" mb={2}>Experience & Education</Typography>
          <Input label="Years of Experience" type="number" />
          <Input label="Highest Qualification" />
        </Box>
      );

    case 3:
      return (
        <Box>
          <Typography variant="h6" mb={2}>Resume Upload & Confirmation</Typography>
          <Input label="Upload Resume" type="file" />
          <Typography variant="body2" mt={2}>Review all details before submitting.</Typography>
        </Box>
      );

    default:
      return null;
  }
}
