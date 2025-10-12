import { Suspense } from 'react';
import JobPageContent from './JobPageContent';

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading jobs...</div>}>
      <JobPageContent />
    </Suspense>
  );
}
