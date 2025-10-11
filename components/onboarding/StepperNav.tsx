import React from 'react';
import { Box, Button } from '@mui/material';

interface Props {
  activeStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function StepperNav({ activeStep, totalSteps, onNext, onBack, onSubmit }: Props) {
  return (
    <Box display="flex" justifyContent="space-between" mt={3}>
      <Button disabled={activeStep === 0} onClick={onBack}>
        Back
      </Button>

      {activeStep < totalSteps - 1 ? (
        <Button variant="contained" color="primary" onClick={onNext}>
          Next
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={onSubmit}>
          Submit
        </Button>
      )}
    </Box>
  );
}
