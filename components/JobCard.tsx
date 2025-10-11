'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'; // ✅ optional for smooth hover

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  tags?: string[];
  postedAt: string; // ISO date string
}

export default function JobCard({
  id,
  title,
  company,
  location,
  salary,
  tags,
  postedAt,
}: JobCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/jobs/${id}`);
  };

  const postedDate = new Date(postedAt);
  const daysAgo = Math.floor(
    (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: 'pointer' }}
    >
      <Card
        onClick={handleClick}
        variant="outlined"
        sx={{
          borderRadius: 3,
          mb: 2,
          borderColor: 'divider',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderColor: 'primary.main',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Job Title */}
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            gutterBottom
            sx={{ lineHeight: 1.3 }}
          >
            {title}
          </Typography>

          {/* Company + Location */}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <Box component="span" fontWeight={500}>
              {company}
            </Box>{' '}
            — {location}
          </Typography>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ my: 1 }}
            >
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: 'grey.100',
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'grey.200',
                    },
                  }}
                />
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* Salary + Posted Info */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {salary ? (
              <Typography
                variant="body2"
                color="primary"
                fontWeight={600}
              >
                {salary}
              </Typography>
            ) : (
              <Box />
            )}
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Posted {daysAgo} day{daysAgo !== 1 ? 's' : ''} ago
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
