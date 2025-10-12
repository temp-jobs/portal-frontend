'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Avatar, Stack } from '@mui/material';

export default function ResumeUploadSection({
  onChange,
}: {
  onChange?: (resume: File | null) => void;
}) {
  const [resume, setResume] = useState<File | null>(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
      onChange?.(file);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Upload Resume
      </Typography>

      <Button variant="contained" component="label">
        Upload Resume (PDF)
        <input hidden accept=".pdf" type="file" onChange={handleResumeChange} />
      </Button>

      {resume && (
        <Stack mt={2} spacing={1}>
          <Typography variant="body2">File: {resume.name}</Typography>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
            📄
          </Avatar>
        </Stack>
      )}
    </Box>
  );
}
