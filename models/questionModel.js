import mongoose from 'mongoose';

const { Schema } = mongoose;

export const QUESTION_STATUS = ['pending', 'answered', 'closed'];

const questionSchema = new Schema(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: false, // Optional, as questions might be general
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: QUESTION_STATUS,
      default: 'pending',
    },
    answer: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    answeredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    answeredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ status: 1 });
questionSchema.index({ car: 1 });
questionSchema.index({ createdAt: -1 });

const Question =
  mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;

