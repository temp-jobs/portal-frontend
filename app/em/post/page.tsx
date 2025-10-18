'use client'
import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PostJob from './PostJob'

const page = () => {
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <PostJob />
    </LocalizationProvider>
    </>
  )
}

export default page