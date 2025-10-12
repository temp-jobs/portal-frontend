import { Suspense } from 'react';
import PostJob from './PostJob';

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading jobs...</div>}>
      <PostJob />
    </Suspense>
  );
}
