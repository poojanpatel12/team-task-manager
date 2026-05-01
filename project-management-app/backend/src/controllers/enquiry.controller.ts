import { Request, Response } from 'express';
import Enquiry from '../models/enquiry.model';

export const submitEnquiry = async (req: Request, res: Response) => {
  try {
    const { fullName, companyName, workEmail, phoneNumber, teamSize, message } = req.body;
    if (!fullName || !companyName || !workEmail || !phoneNumber || !teamSize) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    const enquiry = await Enquiry.create({ fullName, companyName, workEmail, phoneNumber, teamSize, message });
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
