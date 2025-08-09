export interface Job {
  id?: number;  
  role: string;
  companyName: string;
  status: 'Applied' | 'Interviewed' | 'Rejected' | string;
  dateApplied: string; 
  details?: string;     
  description?: string; 
}
