import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'completed', 'on-hold'], default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default model<IProject>('Project', projectSchema);
