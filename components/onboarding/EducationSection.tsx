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
} from '@mui/material';

interface Education {
    level: string;
    institute: string;
    passingYear: string;
    marksObtained: string;
    totalMarks: string;
    percentage: string;
    document: File | null;
    documentPreview: string;
}

const qualificationLevels = [
    'Below 10th',
    '10th',
    '12th / Diploma',
    'Graduation',
    'Post Graduation',
];

// 🧩 Skip “Below 10th” from education levels
const getEducationLevels = (highest: string): string[] => {
    const index = qualificationLevels.indexOf(highest);
    if (index <= 0) return []; // “Below 10th” or invalid
    return qualificationLevels.slice(1, index + 1).reverse(); // skip “Below 10th”
};

export default function EducationSection({
    onChange,
}: {
    onChange?: (education: Education[]) => void;
}) {
    const [highestQualification, setHighestQualification] = useState<string>('');
    const [educationList, setEducationList] = useState<Education[]>([]);

    const handleHighestQualificationChange = (value: string) => {
        setHighestQualification(value);

        if (value === 'Below 10th') {
            const below10th = [
                {
                    level: 'Below 10th',
                    institute: '',
                    passingYear: '',
                    marksObtained: '',
                    totalMarks: '',
                    percentage: '',
                    document: null,
                    documentPreview: '',
                },
            ];
            setEducationList([]);
            onChange?.(below10th); // ✅ send dummy data to mark as valid
            return;
        }

        const levels = getEducationLevels(value);
        const newEducation = levels.map((level) => ({
            level,
            institute: '',
            passingYear: '',
            marksObtained: '',
            totalMarks: '',
            percentage: '',
            document: null,
            documentPreview: '',
        }));

        setEducationList(newEducation);
        onChange?.(newEducation);
    };


    const handleFieldChange = (
        level: string,
        field: keyof Education,
        value: string | File | null
    ) => {
        const updated = educationList.map((edu) => {
            if (edu.level === level) {
                const newEdu = { ...edu, [field]: value };

                // Auto calculate %
                if (field === 'marksObtained' || field === 'totalMarks') {
                    const obtained = parseFloat(newEdu.marksObtained);
                    const total = parseFloat(newEdu.totalMarks);
                    if (!isNaN(obtained) && !isNaN(total) && total > 0) {
                        newEdu.percentage = ((obtained / total) * 100).toFixed(2);
                    } else {
                        newEdu.percentage = '';
                    }
                }

                // Preview for document
                if (field === 'document' && value instanceof File) {
                    newEdu.documentPreview = URL.createObjectURL(value);
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
            {/* Dropdown always visible */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
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

            {/* Hide the rest if “Below 10th” is selected */}
            {highestQualification !== 'Below 10th' && educationList.length > 0 && (
                <>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Education Details
                    </Typography>
                    <Box mt={2}>
                        {educationList.map((edu, idx) => (
                            <Box key={edu.level} mb={3}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {`${idx + 1}. ${edu.level}`}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <TextField
                                            label="Institute Name"
                                            fullWidth
                                            value={edu.institute}
                                            onChange={(e) =>
                                                handleFieldChange(edu.level, 'institute', e.target.value)
                                            }
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <TextField
                                            label="Passing Year"
                                            type="number"
                                            fullWidth
                                            value={edu.passingYear}
                                            onChange={(e) =>
                                                handleFieldChange(edu.level, 'passingYear', e.target.value)
                                            }
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                        <TextField
                                            label="Marks Obtained"
                                            type="number"
                                            fullWidth
                                            value={edu.marksObtained}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    edu.level,
                                                    'marksObtained',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                        <TextField
                                            label="Total Marks"
                                            type="number"
                                            fullWidth
                                            value={edu.totalMarks}
                                            onChange={(e) =>
                                                handleFieldChange(edu.level, 'totalMarks', e.target.value)
                                            }
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                        <TextField
                                            label="Percentage"
                                            fullWidth
                                            value={edu.percentage}
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
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        edu.level,
                                                        'document',
                                                        e.target.files?.[0] || null
                                                    )
                                                }
                                            />
                                        </Button>
                                        {edu.documentPreview && (
                                            <Stack direction="row" mt={1}>
                                                <Avatar
                                                    src={edu.documentPreview}
                                                    alt={edu.level}
                                                    sx={{ width: 56, height: 56 }}
                                                />
                                            </Stack>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
}
