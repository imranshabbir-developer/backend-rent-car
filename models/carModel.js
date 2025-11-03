import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    // Basic car info
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    carPhoto: {
      type: String,
      default: null,
    },

    // Reference to the category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },

    // Pricing and rent details
    rentPerDay: {
      type: Number,
      required: [true, 'Rent per day is required'],
    },
    rentPerHour: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    depositAmount: {
      type: Number,
      default: 0,
    },

    // Availability and status
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance', 'inactive'],
      default: 'available',
    },

    // Location
    location: {
      city: { type: String, required: [true, 'City is required'] },
      address: { type: String },
    },

    // Car specifications
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual'],
      required: [true, 'Transmission type is required'],
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
      required: [true, 'Fuel type is required'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
    },
    mileage: {
      type: Number, // km per liter or equivalent
    },
    color: {
      type: String,
    },
    registrationNumber: {
      type: String,
      unique: true,
      required: [true, 'Registration number is required'],
      uppercase: true,
    },

    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
carSchema.index({ brand: 1 });
carSchema.index({ category: 1 });
carSchema.index({ status: 1 });
carSchema.index({ location: 1 });
carSchema.index({ registrationNumber: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;

