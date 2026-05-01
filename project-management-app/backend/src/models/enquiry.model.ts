import { Schema, model, Document } from 'mongoose';

export interface IEnquiry extends Document {
  fullName: string;
  companyName: string;
  workEmail: string;
  phoneNumber: string;
  teamSize: string;
  message: string;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    workEmail: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    teamSize: { type: String, required: true },
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

export default model<IEnquiry>('Enquiry', enquirySchema);
