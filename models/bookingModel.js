import mongoose from 'mongoose';

const { Schema } = mongoose;

export const BOOKING_STATUS = ['pending', 'confirmed', 'approved', 'rejected'];
export const BOOKING_OPTIONS = ['self_without_driver', 'out_of_station'];

const pricingBreakdownSchema = new Schema(
  {
    baseRatePerDay: { type: Number, required: true, min: 0 },
    extraChargePerDay: { type: Number, default: 0, min: 0 },
    totalDays: { type: Number, required: true, min: 1 },
    calculatedTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
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
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    dropoffDate: {
      type: Date,
      required: true,
    },
    bookingOption: {
      type: String,
      enum: BOOKING_OPTIONS,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    pricing: {
      type: pricingBreakdownSchema,
      required: true,
    },
    status: {
      type: String,
      enum: BOOKING_STATUS,
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ pickupDate: 1, dropoffDate: 1 });
bookingSchema.index({ status: 1 });

const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;


