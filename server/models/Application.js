import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    appliedDate: {
      type: Date,
      required: [true, 'Applied date is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    jobLink: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
