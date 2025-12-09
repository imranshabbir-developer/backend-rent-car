import mongoose from 'mongoose';

const { Schema } = mongoose;

const contactQuerySchema = new Schema(
  {
    name: {
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
      maxlength: 255,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

contactQuerySchema.index({ status: 1 });
contactQuerySchema.index({ createdAt: -1 });
contactQuerySchema.index({ email: 1 });

const ContactQuery =
  mongoose.models.ContactQuery || mongoose.model('ContactQuery', contactQuerySchema);

export default ContactQuery;

