import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completeDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'failed', 'completed'],
      default: 'active',
    },
    mediaRequired: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    logs: [
      {
        date: { type: Date, required: true },
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        media: {
            url: { type: String, default: null },
            public_id: { type: String, default: null },
        }
      },
    ],
  },
  { timestamps: true }
);

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
