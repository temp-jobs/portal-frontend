'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Card,
    CardContent,
    TextField,
    Alert,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import FullPageLoader from '@/components/FullPageLoader';
import { useAuthContext } from '@/contexts/AuthContext';

const steps = ['Company Info', 'Website', 'Description', 'Review & Submit'];

export default function EmployerOnboardingPage() {
    const router = useRouter();
    const { user, setUser } = useAuthContext();
    const [activeStep, setActiveStep] = useState(0);
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [companyDescription, setCompanyDescription] = useState('');
    const [companyIndustry, setCompanyIndustry] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [companyLocation, setCompanyLocation] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const [existingData, setExistingData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Fetch employer profile from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Unauthorized');
                setInitialLoading(true);

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/profile/employer`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );



                const data = res.data;
                setExistingData(data);
                setCompanyName(data.companyName || '');
                setCompanyWebsite(data.companyWebsite || '');
                setCompanyDescription(data.companyDescription || '');
                setCompanyIndustry(data.companyIndustry || '');
                setCompanySize(data.companySize || '');
                setCompanyLocation(data.companyLocation || '');
            } catch (err: any) {
                console.error('❌ Employer fetch failed:', err);
                setError(err.response?.data?.message || 'Failed to load profile data');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleNext = () => {
        if (activeStep === 0 && !companyName.trim()) {
            setError('Company name is required');
            return;
        }
        if (activeStep === 2 && !companyDescription.trim()) {
            setError('Company description is required');
            return;
        }
        setError(null);
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Unauthorized');

            const payload: any = {};
            if (!existingData?.companyName && companyName) payload.companyName = companyName;
            if (!existingData?.companyWebsite && companyWebsite) payload.companyWebsite = companyWebsite;
            if (!existingData?.companyDescription && companyDescription)
                payload.companyDescription = companyDescription;
            if (!existingData?.industry && companyIndustry) payload.companyIndustry = companyIndustry;
            if (!existingData?.companySize && companySize) payload.companySize = companySize;
            if (!existingData?.companyLocation && companyLocation)
                payload.companyLocation = companyLocation;

            if (Object.keys(payload).length === 0) {
                setError('All profile details are already completed.');
                setLoading(false);
                return;
            }

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/profile/employer`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser((prev) => prev ? { ...prev, profileCompleted: true } : prev);
            localStorage.setItem('user', JSON.stringify({ ...user, profileCompleted: true }));

            setSuccess(true);
            setTimeout(() => router.push('/profile/employer'), 1500);
        } catch (err: any) {
            console.error('❌ Onboarding submission failed:', err);
            setError(err.response?.data?.message || 'Failed to complete onboarding');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <FullPageLoader message="Updating details..." />;
    if (initialLoading) return <FullPageLoader message="Fetching Details..." />;

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Organization/Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            fullWidth
                            InputProps={{ readOnly: Boolean(existingData?.companyName) }}
                            helperText={existingData?.companyName ? 'Already filled from database' : ''}
                        />
                        <TextField
                            label="Company Location"
                            value={companyLocation}
                            onChange={(e) => setCompanyLocation(e.target.value)}
                            required
                            fullWidth
                            InputProps={{ readOnly: Boolean(existingData?.companyLocation) }}
                            helperText={existingData?.companyLocation ? 'Already filled from database' : ''}
                        />
                        <TextField
                            label="Industry (Optional)"
                            value={companyIndustry}
                            onChange={(e) => setCompanyIndustry(e.target.value)}
                            fullWidth
                            InputProps={{ readOnly: Boolean(existingData?.industry) }}
                            helperText={existingData?.industry ? 'Already filled from database' : ''}
                        />
                        <TextField
                            label="Company Size (e.g., 10–50 employees)"
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                            fullWidth
                            InputProps={{ readOnly: Boolean(existingData?.companySize) }}
                            helperText={existingData?.companySize ? 'Already filled from database' : ''}
                        />
                    </Box>
                );

            case 1:
                return (
                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Company Website (Optional)"
                            type="url"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            fullWidth
                            placeholder="https://example.com"
                            InputProps={{ readOnly: Boolean(existingData?.companyWebsite) }}
                            helperText={existingData?.companyWebsite ? 'Already filled from database' : ''}
                        />
                        <Box>
                            <Typography variant="body1" fontWeight="bold" mb={1}>
                                Upload Company Logo (Optional)
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                                disabled
                            />
                            <Typography variant="caption" color="text.secondary">
                                Logo uploads will be supported later.
                            </Typography>
                        </Box>
                    </Box>
                );

            case 2:
                return (
                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Company Description"
                            multiline
                            minRows={4}
                            value={companyDescription}
                            onChange={(e) => setCompanyDescription(e.target.value)}
                            required
                            fullWidth
                            InputProps={{ readOnly: Boolean(existingData?.companyDescription) }}
                            helperText={existingData?.companyDescription ? 'Already filled from database' : ''}
                        />
                        <Typography variant="body2" color="text.secondary">
                            Write a short summary that helps job seekers understand your company and its values.
                        </Typography>
                    </Box>
                );

            case 3:
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Review Your Details
                        </Typography>
                        <Typography><b>Company Name:</b> {companyName}</Typography>
                        {companyWebsite && <Typography><b>Website:</b> {companyWebsite}</Typography>}
                        {companyIndustry && <Typography><b>Industry:</b> {companyIndustry}</Typography>}
                        {companySize && <Typography><b>Size:</b> {companySize}</Typography>}
                        <Typography mt={1}><b>Description:</b> {companyDescription}</Typography>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                <CardContent sx={{ p: 5 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                        Complete Your Employer Profile
                    </Typography>
                    <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
                        Let’s set up your company profile to start posting jobs.
                    </Typography>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Employer profile completed successfully!
                        </Alert>
                    )}

                    {renderStepContent()}

                    <Box display="flex" justifyContent="space-between" mt={5}>
                        <Button
                            disabled={activeStep === 0 || loading}
                            onClick={handleBack}
                            variant="outlined"
                            sx={{ borderRadius: 3 }}
                        >
                            Back
                        </Button>

                        {activeStep < steps.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                variant="contained"
                                sx={{ borderRadius: 3, px: 4 }}
                                disabled={loading}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                                sx={{ borderRadius: 3, px: 4 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
