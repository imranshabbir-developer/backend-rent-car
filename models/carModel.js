import mongoose from 'mongoose';
import { generateSlug, generateCanonicalUrl, generateSeoTitle, generateSeoDescription } from '../utils/seoUtils.js';

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
    gallery: {
      type: [String],
      default: [],
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
    isFeatured: {
      type: Boolean,
      default: false,
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
    serialNo: {
      type: Number,
      default: 1,
      index: true,
    },

    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // SEO fields
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate SEO fields before saving
carSchema.pre('save', async function (next) {
  // Generate slug from name if not provided
  if (this.isModified('name') && !this.slug) {
    let baseSlug = generateSlug(this.name);
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Check for duplicate slugs and append counter if needed
    const Car = mongoose.model('Car');
    while (true) {
      const existing = await Car.findOne({ slug: finalSlug, _id: { $ne: this._id } });
      if (!existing) {
        break;
      }
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = finalSlug;
  }

  // Generate SEO title if not provided
  if (!this.seoTitle && this.name) {
    this.seoTitle = generateSeoTitle(this.name);
  }

  // Generate SEO description if not provided
  if (!this.seoDescription) {
    const descriptionParts = [];
    if (this.name) descriptionParts.push(this.name);
    if (this.brand) descriptionParts.push(this.brand);
    if (this.model) descriptionParts.push(this.model);
    if (this.location?.city) descriptionParts.push(`in ${this.location.city}`);
    
    const defaultDesc = descriptionParts.length > 0
      ? `Rent ${descriptionParts.join(' ')} with Convoy Travels. ${this.rentPerDay ? `Starting at Rs ${this.rentPerDay} per day.` : 'Affordable car rental service.'}`
      : generateSeoDescription('');
    
    this.seoDescription = generateSeoDescription(defaultDesc);
  }

  // Generate canonical URL if not provided
  if (!this.canonicalUrl && this.slug) {
    this.canonicalUrl = generateCanonicalUrl('/cars', this.slug);
  }

  next();
});

// Index for faster queries
carSchema.index({ brand: 1 });
carSchema.index({ category: 1 });
carSchema.index({ status: 1 });
carSchema.index({ isFeatured: 1 });
carSchema.index({ location: 1 });
carSchema.index({ registrationNumber: 1 });
carSchema.index({ serialNo: 1 });
carSchema.index({ slug: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;

