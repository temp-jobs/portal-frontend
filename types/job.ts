// types/job.ts
export interface Job {
  _id: string;
  title: string;
  location: string;
  status: 'Draft' | 'Active' | 'Closed';
  employer: { _id: string; companyName?: string };
  description: string;
  type: string;
  experienceLevel: string;
  salaryType: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  benefits?: string[];
  skillsRequired?: string[];
  education?: string;
  openings?: number;
  deadline?: string;
  jobDuration?: string;
  createdAt: string;
}
