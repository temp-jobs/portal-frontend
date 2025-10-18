'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  level: string;
  institute: string;
  passingYear: string;
  marksObtained: string;
  totalMarks: string;
  percentage: string;
  documentUrl: string;
}

interface Applicant {
  _id: string;
  name: string;
  email: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
}

interface Application {
  _id: string;
  applicant: Applicant;
  status: 'pending' | 'accepted' | 'rejected' | 'shortlisted';
}

interface Job {
  _id: string;
  title: string;
}

interface Props {
  job: Job | null;
  onClose: () => void;
}

export default function ViewApplicantsModal({ job, onClose }: Props) {
  const { token } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/applications/job/${job._id}`, { headers });
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [job, token]);

  const updateStatus = async (app: Application, status: 'accepted' | 'rejected' | 'shortlisted') => {
  try {
    const res = await axios.put(`${API_URL}/applications/${app._id}/status`, { status }, { headers });

    setApplications(prev =>
      prev.map(a =>
        a._id === app._id ? { ...a, status } : a
      )
    );

    if (status === 'shortlisted' && res.data.chatId) {
      router.push(
        `/chat?userId=${app.applicant._id}&userName=${encodeURIComponent(app.applicant.name)}&chatId=${res.data.chatId}`
      );
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
    <Modal open={!!job} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          margin: 'auto',
          mt: { xs: 5, md: 10 },
          borderRadius: 2,
          width: { xs: '95%', sm: 600, md: 800 },
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" mb={2}>
          Applicants for "{job?.title}"
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : applications.length === 0 ? (
          <Typography>No applicants yet.</Typography>
        ) : (
          <List>
            {applications.map(app => {
              const a = app.applicant;
              return (
                <React.Fragment key={app._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${a.name} (${app.status.toUpperCase()})`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" display="block">
                            Email: {a.email}
                          </Typography>
                          {a.skills && (
                            <Typography component="span" variant="body2" display="block">
                              Skills: {a.skills.join(', ')}
                            </Typography>
                          )}
                          {a.experience &&
                            a.experience.map((exp, idx) => (
                              <Typography component="span" variant="body2" display="block" key={idx}>
                                Experience: {exp.description || `${exp.position} at ${exp.company}`}
                              </Typography>
                            ))}
                          {a.education &&
                            a.education.map((edu, idx) => (
                              <Typography component="span" variant="body2" display="block" key={idx}>
                                Education: {edu.level} ({edu.institute})
                              </Typography>
                            ))}
                        </>
                      }
                    />
                    <Stack spacing={1} direction="column" ml={2}>
                      {app.status !== 'accepted' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => updateStatus(app, 'accepted')}
                        >
                          Accept
                        </Button>
                      )}
                      {app.status !== 'rejected' && (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => updateStatus(app, 'rejected')}
                        >
                          Reject
                        </Button>
                      )}
                      {app.status !== 'shortlisted' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => updateStatus(app, 'shortlisted')}
                        >
                          Shortlist & Chat
                        </Button>
                      )}
                    </Stack>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Modal>
  );
}
