'use client';

import React, { useState } from 'react';
import {
    Grid,
    TextField,
    Typography,
    Box,
    Button,
    MenuItem,
    Divider,
    Avatar,
    Stack,
    Alert,
    Snackbar,
} from '@mui/material';

interface Education {
    level: string;
    institute: string;
    passingYear: string;
    marksObtained: number | '';
    totalMarks: number | '';
    percentage: number;
    document: File | null;
    documentPreview: string;
}

const qualificationLevels = ['Below 10th', '10th', '12th / Diploma', 'Graduation', 'Post Graduation'];

const getEducationLevels = (highest: string): string[] => {
    const index = qualificationLevels.indexOf(highest);
    if (index <= 0) return [];
    return qualificationLevels.slice(1, index + 1).reverse();
};

export default function EducationSection({ onChange }: { onChange?: (education: Education[]) => void }) {
    const [highestQualification, setHighestQualification] = useState<string>('');
    const [educationList, setEducationList] = useState<Education[]>([]);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

    const showSnackbar = (message: string) => setSnackbar({ open: true, message });

    const handleHighestQualificationChange = (value: string) => {
        setHighestQualification(value);

        if (value === 'Below 10th') {
            const below10th: Education[] = [
                { level: 'Below 10th', institute: '', passingYear: '', marksObtained: '', totalMarks: '', percentage: 0, document: null, documentPreview: '' },
            ];
            setEducationList([]);
            onChange?.(below10th);
            return;
        }

        const levels = getEducationLevels(value);
        const newEducation: Education[] = levels.map((level) => ({
            level,
            institute: '',
            passingYear: '',
            marksObtained: '',
            totalMarks: '',
            percentage: 0,
            document: null,
            documentPreview: '',
        }));

        setEducationList(newEducation);
        onChange?.(newEducation);
    };

    const handleFieldChange = (level: string, field: keyof Education, value: string | number | File | null) => {
        const updated = educationList.map((edu) => {
            if (edu.level === level) {
                const newEdu = { ...edu, [field]: value };

                // Marks & Percentage
                if (field === 'marksObtained' || field === 'totalMarks') {
                    const obtained = Number(newEdu.marksObtained);
                    const total = Number(newEdu.totalMarks);

                    // Only validate if both values are positive numbers
                    if (!isNaN(obtained) && !isNaN(total) && total > 0) {
                        if (obtained > total) {
                            showSnackbar('Marks Obtained cannot be greater than Total Marks');
                            // Keep the value typed by user, do not reset
                            newEdu.percentage = 0;
                        } else {
                            newEdu.percentage = (obtained / total) * 100;
                        }
                    } else {
                        newEdu.percentage = 0;
                    }
                }


                // Passing Year validation
                if (field === 'passingYear') {
                    const year = Number(value);
                    const currentYear = new Date().getFullYear();
                    if (!isNaN(year) && (year < 1900 || year > currentYear + 5)) {
                        showSnackbar('Please enter a valid Passing Year');
                    }
                }

                // Document validation
                if (field === 'document' && value instanceof File) {
                    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
                    const maxSize = 5 * 1024 * 1024;
                    if (!allowedTypes.includes(value.type)) {
                        showSnackbar('Only PDF or image files allowed');
                        newEdu.document = null;
                        newEdu.documentPreview = '';
                    } else if (value.size > maxSize) {
                        showSnackbar('File size should be <= 5MB');
                        newEdu.document = null;
                        newEdu.documentPreview = '';
                    } else {
                        newEdu.documentPreview = URL.createObjectURL(value);
                    }
                }

                return newEdu;
            }
            return edu;
        });

        setEducationList(updated);
        onChange?.(updated);
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Highest Qualification
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        select
                        fullWidth
                        label="Select Qualification"
                        value={highestQualification}
                        onChange={(e) => handleHighestQualificationChange(e.target.value)}
                    >
                        {qualificationLevels.map((level) => (
                            <MenuItem key={level} value={level}>
                                {level}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            {highestQualification !== 'Below 10th' && educationList.length > 0 && (
                <>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Education Details
                    </Typography>
                    <Box mt={2}>
                        {educationList.map((edu, idx) => (
                            <Box key={edu.level} mb={3}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    {`${idx + 1}. ${edu.level}`}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <TextField
                                            label="Institute Name"
                                            fullWidth
                                            value={edu.institute}
                                            onChange={(e) => handleFieldChange(edu.level, 'institute', e.target.value)}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <TextField
                                            label="Passing Year"
                                            type="number"
                                            fullWidth
                                            value={edu.passingYear}
                                            onChange={(e) => handleFieldChange(edu.level, 'passingYear', e.target.value)}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                        <TextField
                                            label="Marks Obtained"
                                            type="number"
                                            fullWidth
                                            value={edu.marksObtained}
                                            onChange={(e) => handleFieldChange(edu.level, 'marksObtained', Number(e.target.value))}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                        <TextField
                                            label="Total Marks"
                                            type="number"
                                            fullWidth
                                            value={edu.totalMarks}
                                            onChange={(e) => handleFieldChange(edu.level, 'totalMarks', Number(e.target.value))}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                        <TextField
                                            label="Percentage"
                                            fullWidth
                                            value={edu.percentage.toFixed(2)}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Button variant="outlined" component="label" fullWidth>
                                            Upload Document
                                            <input
                                                type="file"
                                                hidden
                                                accept="application/pdf,image/*"
                                                onChange={(e) => handleFieldChange(edu.level, 'document', e.target.files?.[0] || null)}
                                            />
                                        </Button>
                                        {edu.documentPreview && (
                                            <Stack direction="row" mt={1}>
                                                <Avatar src={edu.documentPreview} alt={edu.level} sx={{ width: 56, height: 56 }} />
                                            </Stack>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity="error">{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
