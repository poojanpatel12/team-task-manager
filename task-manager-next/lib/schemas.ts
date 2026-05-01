import { z } from 'zod';

export const enquirySchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyName: z.string().min(1, 'Company name is required'),
  workEmail: z.string().email('Enter a valid work email'),
  phoneNumber: z.string().min(7, 'Enter a valid phone number'),
  teamSize: z.string().min(1, 'Please select a team size'),
  message: z.string().optional(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
