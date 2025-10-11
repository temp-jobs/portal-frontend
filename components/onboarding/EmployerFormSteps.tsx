import React from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import Input from '@/components/Input';

interface Props {
  activeStep: number;
}

export default function EmployerFormSteps({ activeStep }: Props) {
  switch (activeStep) {
    case 0:
      return (
        <Box>
          <Typography variant="h6" mb={2}>Company Information</Typography>
          <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 6}}><Input label="Company Name" /></Grid>
            <Grid size={{xs: 12, md: 6}}><Input label="Website" /></Grid>
            <Grid size={{xs: 12, md: 6}}><Input label="Tagline" /></Grid>
          </Grid>
        </Box>
      );

    case 1:
      return (
        <Box>
          <Typography variant="h6" mb={2}>About & Size</Typography>
          <Input label="Industry" />
          <Input label="Team Size" type="number" />
          <TextField fullWidth multiline rows={3} label="Company Description" />
        </Box>
      );

    case 2:
      return (
        <Box>
          <Typography variant="h6" mb={2}>Hiring Preferences</Typography>
          <Input label="Job Categories" />
          <Input label="Work Type (Remote/On-site)" />
        </Box>
      );

    case 3:
      return (
        <Box>
          <Typography variant="h6" mb={2}>Verification & Finish</Typography>
          <Input label="Contact Email" />
          <Input label="Phone Number" />
          <Typography variant="body2" mt={2}>Please confirm all information before submitting.</Typography>
        </Box>
      );

    default:
      return null;
  }
}

