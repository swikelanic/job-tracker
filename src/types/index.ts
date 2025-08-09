export interface Job {
  id: number;
  role: string;
  companyName: string;
  status: 'Applied' | 'Interviewed' | 'Rejected';
  dateApplied: string;
}
